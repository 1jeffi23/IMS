import { db } from "../../db/index.js";

import { sale } from "../models/saleModel.js";
import { saleItem } from "../models/saleItemModel.js";
import { product } from "../models/productModel.js";
import { customer } from "../models/customerModel.js";
import { productBatch } from "../models/productBatchModel.js";

import {
  and,
  asc,
  eq,
  isNull,
  or,
  sql,
} from "drizzle-orm";

import { createAuditLog } from "../../utils/auditLogger.js";


// =====================================================
// CREATE SALE
// =====================================================

export const createSale = async (req, res) => {
  try {
    const {
      customerId,
      items,
      discount = 0,
      tax = 0,
      paymentMethod,
      amountPaid,
    } = req.body;

    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "At least one product is required",
      });
    }

    if (
      !paymentMethod ||
      !["cash", "card"].includes(paymentMethod)
    ) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    const discountAmount = Number(discount);
    const taxAmount = Number(tax);

    if (
      Number.isNaN(discountAmount) ||
      discountAmount < 0
    ) {
      return res.status(400).json({
        message: "Invalid discount",
      });
    }

    if (
      Number.isNaN(taxAmount) ||
      taxAmount < 0
    ) {
      return res.status(400).json({
        message: "Invalid tax",
      });
    }

    // =================================================
    // CHECK CUSTOMER
    // =================================================

    let selectedCustomerId = null;

    if (
      customerId !== null &&
      customerId !== undefined &&
      customerId !== ""
    ) {
      selectedCustomerId = Number(customerId);

      if (Number.isNaN(selectedCustomerId)) {
        return res.status(400).json({
          message: "Invalid customer ID",
        });
      }

      const [existingCustomer] = await db
        .select()
        .from(customer)
        .where(
          eq(
            customer.id,
            selectedCustomerId
          )
        );

      if (!existingCustomer) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }
    }

    // =================================================
    // DATABASE TRANSACTION
    // =================================================

    const result = await db.transaction(
      async (tx) => {
        let subtotal = 0;

        const saleItemsData = [];

        // =============================================
        // PROCESS EACH ITEM
        // =============================================

        for (const item of items) {
          const productId = Number(item.productId);
          const quantity = Number(item.quantity);

          // ---------------------------------------------
          // VALIDATE ITEM
          // ---------------------------------------------

          if (Number.isNaN(productId)) {
            throw new Error("Invalid product");
          }

          if (!quantity || quantity <= 0) {
            throw new Error(
              "Quantity must be greater than 0"
            );
          }

          // =============================================
          // FIND PRODUCT
          // =============================================

          const [existingProduct] =
            await tx
              .select()
              .from(product)
              .where(
                eq(
                  product.id,
                  productId
                )
              );

          if (!existingProduct) {
            throw new Error(
              "Product not found"
            );
          }

          if (!existingProduct.isActive) {
            throw new Error(
              `${existingProduct.name} is inactive`
            );
          }

          // =============================================
          // FIND AVAILABLE BATCHES
          // =============================================
          // Only batches:
          // 1. Belong to this product
          // 2. Have quantity > 0
          // 3. Are NOT expired
          //
          // Ordered by expiry date so that the batch
          // expiring first is sold first (FEFO).

          const availableBatches =
            await tx
              .select()
              .from(productBatch)
              .where(
                and(
                  eq(
                    productBatch.productId,
                    productId
                  ),

                  sql`${productBatch.quantity} > 0`,

                  or(
                    isNull(
                      productBatch.expiryDate
                    ),

                    sql`${productBatch.expiryDate} >= CURRENT_DATE`
                  )
                )
              )
              .orderBy(
                asc(
                  productBatch.expiryDate
                )
              );

          // =============================================
          // CALCULATE AVAILABLE STOCK
          // =============================================

          const availableStock =
            availableBatches.reduce(
              (total, batch) =>
                total +
                Number(batch.quantity),
              0
            );

          // =============================================
          // CHECK AVAILABLE STOCK
          // =============================================

          if (
            availableStock < quantity
          ) {
            throw new Error(
              `Insufficient stock for ${existingProduct.name}. Available: ${availableStock}, Requested: ${quantity}`
            );
          }

          // =============================================
          // SELLING PRICE
          // =============================================

          const unitPrice =
            Number(
              existingProduct.sellingPrice
            );

          // =============================================
          // DISTRIBUTE QUANTITY ACROSS BATCHES
          // =============================================

          let remainingQuantity =
            quantity;

          for (
            const batch of availableBatches
          ) {
            if (
              remainingQuantity <= 0
            ) {
              break;
            }

            const batchQuantity =
              Number(batch.quantity);

            const quantityFromBatch =
              Math.min(
                remainingQuantity,
                batchQuantity
              );

            const itemTotal =
              unitPrice *
              quantityFromBatch;

            subtotal += itemTotal;

            // -----------------------------------------
            // UPDATE BATCH STOCK
            // -----------------------------------------

            await tx
              .update(productBatch)
              .set({
                quantity: sql`
                  ${productBatch.quantity}
                  - ${quantityFromBatch}
                `,
                updatedAt: new Date(),
              })
              .where(
                eq(
                  productBatch.id,
                  batch.id
                )
              );

            // -----------------------------------------
            // PREPARE SALE ITEM
            // -----------------------------------------
            // costPrice comes directly from DB batch.
            // It is NOT taken from frontend/request.

            saleItemsData.push({
              productId,

              batchId:
                batch.id,

              quantity:
                quantityFromBatch,

              unitPrice:
                String(unitPrice),

              costPrice:
                String(batch.costPrice),

              totalPrice:
                String(itemTotal),
            });

            remainingQuantity -=
              quantityFromBatch;
          }

          // =============================================
          // SYNCHRONIZE PRODUCT STOCK
          // =============================================
          //
          // Product quantity should represent
          // AVAILABLE (non-expired) stock.
          //
          // So instead of trusting the old
          // product.quantity, calculate it from
          // available batches.

          const newProductQuantity =
            availableStock -
            quantity;

          await tx
            .update(product)
            .set({
              quantity:
                newProductQuantity,
            })
            .where(
              eq(
                product.id,
                productId
              )
            );
        }

        // =============================================
        // CALCULATE TOTAL
        // =============================================

        const total =
          subtotal -
          discountAmount +
          taxAmount;

        if (total < 0) {
          throw new Error(
            "Discount cannot be greater than subtotal"
          );
        }

        const paid =
          Number(amountPaid);

        if (
          Number.isNaN(paid) ||
          paid < total
        ) {
          throw new Error(
            "Amount paid is insufficient"
          );
        }

        // =============================================
        // CREATE SALE
        // =============================================

        const [newSale] =
          await tx
            .insert(sale)
            .values({
              customerId:
                selectedCustomerId,

              subtotal:
                String(subtotal),

              discount:
                String(discountAmount),

              tax:
                String(taxAmount),

              total:
                String(total),

              paymentMethod,

              amountPaid:
                String(paid),
            })
            .returning();

        // =============================================
        // CREATE SALE ITEMS
        // =============================================

        const itemsWithSaleId =
          saleItemsData.map(
            (item) => ({
              ...item,

              saleId:
                newSale.id,
            })
          );

        const newItems =
          await tx
            .insert(saleItem)
            .values(
              itemsWithSaleId
            )
            .returning();

        return {
          sale: newSale,
          items: newItems,
        };
      }
    );

    // =================================================
    // AUDIT LOG
    // =================================================

    await createAuditLog({
      userId: req.user.id,

      action: "CREATE",

      module: "SALE",

      entityId:
        String(result.sale.id),

      description:
        `Created sale ${result.sale.id}`,
    });

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(201).json({
      message:
        "Sale completed successfully",

      sale:
        result.sale,

      items:
        result.items,
    });

  } catch (error) {
    console.error(
      "Create sale error:",
      error
    );

    return res.status(400).json({
      message:
        error.message ||
        "Failed to complete sale",
    });
  }
};


// =====================================================
// GET ALL SALES
// NO AUDIT LOG
// =====================================================

export const getSales = async (req, res) => {
  try {
    // -----------------------------------------------
    // GET ALL SALES + CUSTOMER
    // -----------------------------------------------

    const sales = await db
      .select({
        id:
          sale.id,

        customerId:
          sale.customerId,

        customerName:
          customer.name,

        subtotal:
          sale.subtotal,

        discount:
          sale.discount,

        tax:
          sale.tax,

        total:
          sale.total,

        paymentMethod:
          sale.paymentMethod,

        amountPaid:
          sale.amountPaid,

        createdAt:
          sale.createdAt,
      })

      .from(sale)

      .leftJoin(
        customer,

        eq(
          sale.customerId,
          customer.id
        )
      )

      .orderBy(
        sql`${sale.createdAt} DESC`
      );


    // -----------------------------------------------
    // GET ALL SALE ITEMS + PRODUCT
    // Same approach as getSaleById
    // -----------------------------------------------

    const items =
      await db
        .select({
          id:
            saleItem.id,

          saleId:
            saleItem.saleId,

          productId:
            saleItem.productId,

          productName:
            product.name,

          sku:
            product.sku,

          unit:
            product.unit,

          quantity:
            saleItem.quantity,

          unitPrice:
            saleItem.unitPrice,

          costPrice:
            saleItem.costPrice,

          totalPrice:
            saleItem.totalPrice,
        })

        .from(saleItem)

        .leftJoin(
          product,

          eq(
            saleItem.productId,
            product.id
          )
        );


    // -----------------------------------------------
    // ATTACH ITEMS TO THEIR SALE
    // -----------------------------------------------

    const salesWithItems =
      sales.map(
        (currentSale) => ({
          ...currentSale,

          items:
            items.filter(
              (item) =>
                item.saleId ===
                currentSale.id
            ),
        })
      );


    // -----------------------------------------------
    // SUCCESS
    // -----------------------------------------------

    return res.status(200).json({
      message:
        "Sales fetched successfully",

      sales:
        salesWithItems,
    });

  } catch (error) {
    console.error(
      "Get sales error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch sales",
    });
  }
};


// =====================================================
// GET SALE BY ID
// NO AUDIT LOG
// =====================================================

export const getSaleById = async (req, res) => {
  try {
    const saleId =
      Number(req.params.id);

    // -----------------------------------------------
    // VALIDATE SALE ID
    // -----------------------------------------------

    if (Number.isNaN(saleId)) {
      return res.status(400).json({
        message:
          "Invalid sale ID",
      });
    }

    // -----------------------------------------------
    // GET SALE + CUSTOMER
    // -----------------------------------------------

    const [saleData] =
      await db
        .select({
          id:
            sale.id,

          customerId:
            sale.customerId,

          customerName:
            customer.name,

          customerPhone:
            customer.phone,

          customerEmail:
            customer.email,

          subtotal:
            sale.subtotal,

          discount:
            sale.discount,

          tax:
            sale.tax,

          total:
            sale.total,

          paymentMethod:
            sale.paymentMethod,

          amountPaid:
            sale.amountPaid,

          createdAt:
            sale.createdAt,
        })

        .from(sale)

        .leftJoin(
          customer,

          eq(
            sale.customerId,
            customer.id
          )
        )

        .where(
          eq(
            sale.id,
            saleId
          )
        );

    // -----------------------------------------------
    // SALE NOT FOUND
    // -----------------------------------------------

    if (!saleData) {
      return res.status(404).json({
        message:
          "Sale not found",
      });
    }

    // -----------------------------------------------
    // GET SALE ITEMS + PRODUCT
    // -----------------------------------------------

    const items =
      await db
        .select({
          id:
            saleItem.id,

          productId:
            saleItem.productId,

          productName:
            product.name,

          sku:
            product.sku,

          unit:
            product.unit,

          quantity:
            saleItem.quantity,

          unitPrice:
            saleItem.unitPrice,

          costPrice:
            saleItem.costPrice,

          totalPrice:
            saleItem.totalPrice,
        })

        .from(saleItem)

        .leftJoin(
          product,

          eq(
            saleItem.productId,
            product.id
          )
        )

        .where(
          eq(
            saleItem.saleId,
            saleId
          )
        );

    // -----------------------------------------------
    // SUCCESS
    // -----------------------------------------------

    return res.status(200).json({
      message:
        "Sale fetched successfully",

      sale:
        saleData,

      items,
    });

  } catch (error) {
    console.error(
      "Get sale by ID error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch sale",
    });
  }
};