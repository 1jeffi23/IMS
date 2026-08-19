import { db } from "../../db/index.js";

import { sale } from "../models/saleModel.js";
import { saleItem } from "../models/saleItemModel.js";
import { product } from "../models/productModel.js";
import { customer } from "../models/customerModel.js";

import {
  eq,
  sql,
} from "drizzle-orm";


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

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {

      return res.status(400).json({
        message:
          "At least one product is required",
      });

    }


    if (
      !paymentMethod ||
      !["cash", "card"].includes(
        paymentMethod
      )
    ) {

      return res.status(400).json({
        message:
          "Invalid payment method",
      });

    }


    const discountAmount =
      Number(discount);

    const taxAmount =
      Number(tax);


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

      selectedCustomerId =
        Number(customerId);


      if (
        Number.isNaN(
          selectedCustomerId
        )
      ) {

        return res.status(400).json({
          message:
            "Invalid customer ID",
        });

      }


      const [existingCustomer] =
        await db
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
          message:
            "Customer not found",
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

          const productId =
            Number(item.productId);

          const quantity =
            Number(item.quantity);


          // ---------------------------------------------
          // Validate item
          // ---------------------------------------------

          if (
            Number.isNaN(productId)
          ) {

            throw new Error(
              "Invalid product"
            );

          }


          if (
            !quantity ||
            quantity <= 0
          ) {

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
          // CHECK STOCK
          // =============================================

          const availableStock =
            Number(
              existingProduct.quantity
            );


          if (
            availableStock <
            quantity
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


          const itemTotal =
            unitPrice * quantity;


          subtotal += itemTotal;


          // =============================================
          // PREPARE SALE ITEM
          // =============================================

          saleItemsData.push({

            productId,

            quantity,

            unitPrice:
              String(unitPrice),

            totalPrice:
              String(itemTotal),

          });

        }


        // =================================================
        // CALCULATE TOTAL
        // =================================================

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


        // =================================================
        // CREATE SALE
        // =================================================

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


        // =================================================
        // CREATE SALE ITEMS
        // =================================================

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


        // =================================================
        // DECREASE PRODUCT STOCK
        // =================================================

        for (
          const item of saleItemsData
        ) {

          await tx
            .update(product)
            .set({

              quantity:
                sql`${product.quantity} - ${item.quantity}`,

            })
            .where(
              eq(
                product.id,
                item.productId
              )
            );

        }


        return {
          sale: newSale,
          items: newItems,
        };

      }
    );


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
// =====================================================

export const getSales = async (req, res) => {

  try {

    const sales = await db
      .select({
        id: sale.id,

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


    return res.status(200).json({

      message:
        "Sales fetched successfully",

      sales,

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
// =====================================================

export const getSaleById = async (req, res) => {

  try {

    const saleId = Number(req.params.id);


    // =================================================
    // VALIDATE SALE ID
    // =================================================

    if (Number.isNaN(saleId)) {

      return res.status(400).json({

        message:
          "Invalid sale ID",

      });

    }


    // =================================================
    // GET SALE + CUSTOMER
    // =================================================

    const [saleData] = await db

      .select({

        id: sale.id,

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


    // =================================================
    // SALE NOT FOUND
    // =================================================

    if (!saleData) {

      return res.status(404).json({

        message:
          "Sale not found",

      });

    }


    // =================================================
    // GET SALE ITEMS + PRODUCT
    // =================================================

    const items = await db

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


    // =================================================
    // SUCCESS
    // =================================================

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
