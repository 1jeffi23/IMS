import { db } from "../../db/index.js";

import {
  purchase,
} from "../models/purchaseModel.js";

import {
  purchaseItem,
} from "../models/purchaseItemModel.js";

import {
  product,
} from "../models/productModel.js";

import {
  productBatch,
} from "../models/productBatchModel.js";

import {
  supplier,
} from "../models/supplierModel.js";

import {
  eq,
  sql,
  and,
} from "drizzle-orm";

import { createAuditLog } from "../../utils/auditLogger.js";


// ==========================================
// CREATE PURCHASE
// ==========================================

export const createPurchase = async (req, res) => {
  try {

    const {
      supplierId,
      invoiceNumber,
      purchaseDate,
      items,
    } = req.body;


    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (!supplierId) {
      return res.status(400).json({
        message: "Supplier is required",
      });
    }

    if (!invoiceNumber?.trim()) {
      return res.status(400).json({
        message: "Invoice number is required",
      });
    }

    if (!purchaseDate) {
      return res.status(400).json({
        message: "Purchase date is required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "At least one purchase item is required",
      });
    }


    // ==========================================
    // CHECK SUPPLIER
    // ==========================================

    const [existingSupplier] = await db
      .select()
      .from(supplier)
      .where(
        eq(
          supplier.id,
          Number(supplierId)
        )
      );

    if (!existingSupplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    if (!existingSupplier.isActive) {
      return res.status(400).json({
        message:
          "Cannot create purchase from an inactive supplier",
      });
    }


    // ==========================================
    // DATABASE TRANSACTION
    // ==========================================

    const result = await db.transaction(
      async (tx) => {

        let totalAmount = 0;

        const purchaseItemsData = [];


        // ======================================
        // PROCESS EACH ITEM
        // ======================================

        for (const item of items) {

          const {
            productId,
            batchNumber,
            quantity,
            costPrice,
            receivedDate,
            expiryDate,
            storageLocation,
          } = item;

          const qty = Number(quantity);
          const cost = Number(costPrice);


          // =================================
          // VALIDATION
          // =================================

          if (!productId) {
            throw new Error(
              "Product is required"
            );
          }

          if (!qty || qty <= 0) {
            throw new Error(
              "Quantity must be greater than 0"
            );
          }

          if (
            cost === undefined ||
            cost === null ||
            cost < 0
          ) {
            throw new Error(
              "Invalid cost price"
            );
          }

          if (!batchNumber?.trim()) {
            throw new Error(
              "Batch number is required"
            );
          }


          // =================================
          // FIND PRODUCT
          // =================================

          const [existingProduct] =
            await tx
              .select()
              .from(product)
              .where(
                eq(
                  product.id,
                  Number(productId)
                )
              );

          if (!existingProduct) {
            throw new Error(
              `Product ${productId} not found`
            );
          }

          if (!existingProduct.isActive) {
            throw new Error(
              `${existingProduct.name} is inactive`
            );
          }


          // =================================
          // CHECK EXISTING BATCH
          // =================================

          const [existingBatch] =
            await tx
              .select()
              .from(productBatch)
              .where(
                and(
                  eq(
                    productBatch.productId,
                    Number(productId)
                  ),
                  eq(
                    productBatch.batchNumber,
                    batchNumber.trim()
                  )
                )
              );


          let batch;


          // =================================
          // EXISTING BATCH
          // =================================

          if (existingBatch) {

            const [updatedBatch] =
              await tx
                .update(productBatch)
                .set({
                  quantity: sql`
                    ${productBatch.quantity}
                    + ${qty}
                  `,
                  updatedAt: new Date(),
                })
                .where(
                  eq(
                    productBatch.id,
                    existingBatch.id
                  )
                )
                .returning();

            batch = updatedBatch;

          }


          // =================================
          // NEW BATCH
          // =================================

          else {

            const [newBatch] =
              await tx
                .insert(productBatch)
                .values({

                  productId:
                    Number(productId),

                  batchNumber:
                    batchNumber.trim(),

                  quantity:
                    qty,

                  costPrice:
                    String(cost),

                  receivedDate:
                    receivedDate || purchaseDate,

                  expiryDate:
                    expiryDate || null,

                  storageLocation:
                    storageLocation?.trim() || null,

                })
                .returning();

            batch = newBatch;

          }


          // =================================
          // UPDATE PRODUCT STOCK
          // =================================

          await tx
            .update(product)
            .set({
              quantity: sql`
                ${product.quantity}
                + ${qty}
              `,
            })
            .where(
              eq(
                product.id,
                Number(productId)
              )
            );


          // =================================
          // ITEM TOTAL
          // =================================

          const itemTotal =
            qty * cost;

          totalAmount += itemTotal;


          purchaseItemsData.push({

            productId:
              Number(productId),

            batchId:
              batch.id,

            quantity:
              qty,

            costPrice:
              String(cost),

            totalPrice:
              String(itemTotal),

          });

        }


        // ======================================
        // CREATE PURCHASE
        // ======================================

        const [newPurchase] =
          await tx
            .insert(purchase)
            .values({

              supplierId:
                Number(supplierId),

              invoiceNumber:
                invoiceNumber.trim(),

              purchaseDate,

              totalAmount:
                String(totalAmount),

              createdBy:
                req.user.id,

            })
            .returning();


        // ======================================
        // CREATE PURCHASE ITEMS
        // ======================================

        const itemsWithPurchaseId =
          purchaseItemsData.map(
            (item) => ({
              ...item,

              purchaseId:
                newPurchase.id,
            })
          );


        const newItems =
          await tx
            .insert(purchaseItem)
            .values(itemsWithPurchaseId)
            .returning();


        return {
          purchase: newPurchase,
          items: newItems,
        };

      }
    );


    // ==========================================
    // AUDIT LOG
    // ==========================================

    await createAuditLog({
      userId: req.user.id,
      action: "CREATE",
      module: "PURCHASE",
      entityId: String(result.purchase.id),
      description:
        `Created purchase ${result.purchase.id} ` +
        `with invoice ${result.purchase.invoiceNumber}`,
    });


    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({

      message:
        "Purchase created successfully",

      purchase:
        result.purchase,

      items:
        result.items,

    });


  } catch (error) {

    console.error(
      "Create purchase error:",
      error
    );

    return res.status(500).json({

      message:
        error.message ||
        "Failed to create purchase",

    });

  }
};


// ==========================================
// GET ALL PURCHASES
// NO AUDIT LOG
// ==========================================

export const getPurchases = async (req, res) => {
  try {

    const purchases = await db
      .select({
        id: purchase.id,

        invoiceNumber:
          purchase.invoiceNumber,

        purchaseDate:
          purchase.purchaseDate,

        totalAmount:
          purchase.totalAmount,

        supplierId:
          supplier.id,

        supplierName:
          supplier.name,

        createdAt:
          purchase.createdAt,
      })
      .from(purchase)
      .leftJoin(
        supplier,
        eq(
          purchase.supplierId,
          supplier.id
        )
      );

    return res.status(200).json({
      message:
        "Purchases fetched successfully",

      purchases,
    });

  } catch (error) {

    console.error(
      "Get purchases error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch purchases",
    });
  }
};


// ==========================================
// GET PURCHASE BY ID
// NO AUDIT LOG
// ==========================================

export const getPurchaseById = async (
  req,
  res
) => {

  try {

    const purchaseId =
      Number(req.params.id);


    if (Number.isNaN(purchaseId)) {

      return res.status(400).json({
        message:
          "Invalid purchase ID",
      });

    }


    const [purchaseData] =
      await db
        .select({
          id: purchase.id,

          invoiceNumber:
            purchase.invoiceNumber,

          purchaseDate:
            purchase.purchaseDate,

          totalAmount:
            purchase.totalAmount,

          supplierId:
            supplier.id,

          supplierName:
            supplier.name,
        })
        .from(purchase)
        .leftJoin(
          supplier,
          eq(
            purchase.supplierId,
            supplier.id
          )
        )
        .where(
          eq(
            purchase.id,
            purchaseId
          )
        );


    if (!purchaseData) {

      return res.status(404).json({
        message:
          "Purchase not found",
      });

    }


    const items =
      await db
        .select({

          id:
            purchaseItem.id,

          productId:
            product.id,

          productName:
            product.name,

          sku:
            product.sku,

          batchId:
            productBatch.id,

          batchNumber:
            productBatch.batchNumber,

          quantity:
            purchaseItem.quantity,

          costPrice:
            purchaseItem.costPrice,

          totalPrice:
            purchaseItem.totalPrice,

        })
        .from(purchaseItem)

        .leftJoin(
          product,
          eq(
            purchaseItem.productId,
            product.id
          )
        )

        .leftJoin(
          productBatch,
          eq(
            purchaseItem.batchId,
            productBatch.id
          )
        )

        .where(
          eq(
            purchaseItem.purchaseId,
            purchaseId
          )
        );


    return res.status(200).json({

      message:
        "Purchase fetched successfully",

      purchase: {
        ...purchaseData,
        items,
      },

    });


  } catch (error) {

    console.error(
      "Get purchase error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch purchase",
    });

  }

};