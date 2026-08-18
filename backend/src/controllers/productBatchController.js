import { eq, and, sql } from "drizzle-orm";
import { db } from "../../db/index.js";

import { product } from "../models/productModel.js";
import { productBatch } from "../models/productBatchModel.js";


// =====================================================
// CREATE PRODUCT BATCH
// =====================================================

export const createProductBatch = async (req, res) => {
  try {
    const {
      productId,
      batchNumber,
      quantity,
      costPrice,
      receivedDate,
      expiryDate,
      storageLocation,
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!productId) {
      return res.status(400).json({
        message: "Product is required",
      });
    }

    if (!batchNumber?.trim()) {
      return res.status(400).json({
        message: "Batch number is required",
      });
    }

    if (
      quantity === undefined ||
      quantity === null ||
      Number(quantity) <= 0
    ) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    if (
      costPrice === undefined ||
      costPrice === null ||
      Number(costPrice) < 0
    ) {
      return res.status(400).json({
        message: "Valid cost price is required",
      });
    }

    if (!receivedDate) {
      return res.status(400).json({
        message: "Received date is required",
      });
    }

    const productIdNumber = Number(productId);
    const batchQuantity = Number(quantity);

    // -----------------------------
    // Check product
    // -----------------------------

    const [existingProduct] = await db
      .select()
      .from(product)
      .where(eq(product.id, productIdNumber));

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (!existingProduct.isActive) {
      return res.status(400).json({
        message: "Cannot add batch to an inactive product",
      });
    }

    // -----------------------------
    // Check existing batch
    // product + batchNumber
    // -----------------------------

    const [existingBatch] = await db
      .select()
      .from(productBatch)
      .where(
        and(
          eq(productBatch.productId, productIdNumber),
          eq(productBatch.batchNumber, batchNumber.trim())
        )
      );

    // =================================================
    // Existing batch
    // =================================================

    if (existingBatch) {
      const [updatedBatch] = await db
        .update(productBatch)
        .set({
          quantity: sql`${productBatch.quantity} + ${batchQuantity}`,
          updatedAt: new Date(),
        })
        .where(eq(productBatch.id, existingBatch.id))
        .returning();

      // Increase total product stock
      await db
        .update(product)
        .set({
          quantity: sql`${product.quantity} + ${batchQuantity}`,
        })
        .where(eq(product.id, productIdNumber));

      return res.status(200).json({
        message: "Product batch quantity updated successfully",
        batch: updatedBatch,
      });
    }

    // =================================================
    // New batch
    // =================================================

    const [newBatch] = await db
      .insert(productBatch)
      .values({
        productId: productIdNumber,
        batchNumber: batchNumber.trim(),
        quantity: batchQuantity,
        costPrice: String(costPrice),
        receivedDate,
        expiryDate: expiryDate || null,
        storageLocation: storageLocation?.trim() || null,
      })
      .returning();

    // Increase total product stock
    await db
      .update(product)
      .set({
        quantity: sql`${product.quantity} + ${batchQuantity}`,
      })
      .where(eq(product.id, productIdNumber));

    return res.status(201).json({
      message: "Product batch created successfully",
      batch: newBatch,
    });

  } catch (error) {
    console.error("Create product batch error:", error);

    return res.status(500).json({
      message: "Failed to create product batch",
      error: error.message,
    });
  }
};


// =====================================================
// GET ALL PRODUCT BATCHES
// =====================================================

export const getProductBatches = async (req, res) => {
  try {
    const allBatches = await db
      .select({
        id: productBatch.id,

        productId: productBatch.productId,

        batchNumber: productBatch.batchNumber,

        quantity: productBatch.quantity,

        costPrice: productBatch.costPrice,

        receivedDate: productBatch.receivedDate,

        expiryDate: productBatch.expiryDate,

        storageLocation: productBatch.storageLocation,

        productName: product.name,

        sku: product.sku,
      })
      .from(productBatch)
      .leftJoin(
        product,
        eq(productBatch.productId, product.id)
      )
      .orderBy(productBatch.receivedDate);

    return res.status(200).json({
      message: "Product batches fetched successfully",
      batches: allBatches,
    });

  } catch (error) {
    console.error("Get product batches error:", error);

    return res.status(500).json({
      message: "Failed to fetch product batches",
      error: error.message,
    });
  }
};


// =====================================================
// GET SINGLE PRODUCT BATCH
// =====================================================

export const getProductBatchById = async (req, res) => {
  try {
    const batchId = Number(req.params.id);

    if (Number.isNaN(batchId)) {
      return res.status(400).json({
        message: "Invalid batch ID",
      });
    }

    const [batch] = await db
      .select({
        id: productBatch.id,

        productId: productBatch.productId,

        batchNumber: productBatch.batchNumber,

        quantity: productBatch.quantity,

        costPrice: productBatch.costPrice,

        receivedDate: productBatch.receivedDate,

        expiryDate: productBatch.expiryDate,

        storageLocation: productBatch.storageLocation,

        productName: product.name,

        sku: product.sku,
      })
      .from(productBatch)
      .leftJoin(
        product,
        eq(productBatch.productId, product.id)
      )
      .where(eq(productBatch.id, batchId));

    if (!batch) {
      return res.status(404).json({
        message: "Product batch not found",
      });
    }

    return res.status(200).json({
      message: "Product batch fetched successfully",
      batch,
    });

  } catch (error) {
    console.error("Get product batch error:", error);

    return res.status(500).json({
      message: "Failed to fetch product batch",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE PRODUCT BATCH
// =====================================================

export const updateProductBatch = async (req, res) => {
  try {
    const batchId = Number(req.params.id);

    if (Number.isNaN(batchId)) {
      return res.status(400).json({
        message: "Invalid batch ID",
      });
    }

    const {
      batchNumber,
      quantity,
      costPrice,
      receivedDate,
      expiryDate,
      storageLocation,
    } = req.body;

    // -----------------------------
    // Find existing batch
    // -----------------------------

    const [existingBatch] = await db
      .select()
      .from(productBatch)
      .where(eq(productBatch.id, batchId));

    if (!existingBatch) {
      return res.status(404).json({
        message: "Product batch not found",
      });
    }

    // -----------------------------
    // Validation
    // -----------------------------

    if (!batchNumber?.trim()) {
      return res.status(400).json({
        message: "Batch number is required",
      });
    }

    if (
      quantity === undefined ||
      quantity === null ||
      Number(quantity) < 0
    ) {
      return res.status(400).json({
        message: "Quantity cannot be negative",
      });
    }

    if (
      costPrice === undefined ||
      costPrice === null ||
      Number(costPrice) < 0
    ) {
      return res.status(400).json({
        message: "Valid cost price is required",
      });
    }

    // -----------------------------
    // Check duplicate batch number
    // for same product
    // -----------------------------

    const [duplicateBatch] = await db
      .select()
      .from(productBatch)
      .where(
        and(
          eq(productBatch.productId, existingBatch.productId),
          eq(productBatch.batchNumber, batchNumber.trim())
        )
      );

    if (
      duplicateBatch &&
      duplicateBatch.id !== existingBatch.id
    ) {
      return res.status(409).json({
        message: "Batch number already exists for this product",
      });
    }

    // -----------------------------
    // Quantity difference
    // -----------------------------

    const oldQuantity = Number(existingBatch.quantity);
    const newQuantity = Number(quantity);

    const quantityDifference =
      newQuantity - oldQuantity;

    // -----------------------------
    // Update batch
    // -----------------------------

    const [updatedBatch] = await db
      .update(productBatch)
      .set({
        batchNumber: batchNumber.trim(),
        quantity: newQuantity,
        costPrice: String(costPrice),
        receivedDate,
        expiryDate: expiryDate || null,
        storageLocation:
          storageLocation?.trim() || null,
        updatedAt: new Date(),
      })
      .where(eq(productBatch.id, batchId))
      .returning();

    // -----------------------------
    // Update total product quantity
    // -----------------------------

    await db
      .update(product)
      .set({
        quantity: sql`${product.quantity} + ${quantityDifference}`,
      })
      .where(eq(product.id, existingBatch.productId));

    return res.status(200).json({
      message: "Product batch updated successfully",
      batch: updatedBatch,
    });

  } catch (error) {
    console.error("Update product batch error:", error);

    return res.status(500).json({
      message: "Failed to update product batch",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE PRODUCT BATCH
// =====================================================

export const deleteProductBatch = async (req, res) => {
  try {
    const batchId = Number(req.params.id);

    if (Number.isNaN(batchId)) {
      return res.status(400).json({
        message: "Invalid batch ID",
      });
    }

    // -----------------------------
    // Find batch
    // -----------------------------

    const [existingBatch] = await db
      .select()
      .from(productBatch)
      .where(eq(productBatch.id, batchId));

    if (!existingBatch) {
      return res.status(404).json({
        message: "Product batch not found",
      });
    }

    // -----------------------------
    // Don't allow deleting stock
    // silently
    // -----------------------------

    if (Number(existingBatch.quantity) > 0) {
      return res.status(400).json({
        message:
          "Cannot delete a batch that still has stock",
      });
    }

    // -----------------------------
    // Delete batch
    // -----------------------------

    await db
      .delete(productBatch)
      .where(eq(productBatch.id, batchId));

    return res.status(200).json({
      message: "Product batch deleted successfully",
    });

  } catch (error) {
    console.error("Delete product batch error:", error);

    return res.status(500).json({
      message: "Failed to delete product batch",
      error: error.message,
    });
  }
};