import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { product } from "../models/productModel.js";
import { category } from "../models/categoryModel.js";
import { createAuditLog } from "../../utils/auditLogger.js";


// ==========================================
// CREATE PRODUCT
// ==========================================

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      categoryId,
      unit,
      sellingPrice,
      reorderLevel,
      storageTime,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    if (!sku?.trim()) {
      return res.status(400).json({
        message: "SKU is required",
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        message: "Category is required",
      });
    }

    if (sellingPrice === undefined || sellingPrice === null) {
      return res.status(400).json({
        message: "Selling price is required",
      });
    }

    // Check category
    const [existingCategory] = await db
      .select()
      .from(category)
      .where(eq(category.id, Number(categoryId)));

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (!existingCategory.isActive) {
      return res.status(400).json({
        message: "Cannot add product to an inactive category",
      });
    }

    // Check SKU
    const [existingProduct] = await db
      .select()
      .from(product)
      .where(eq(product.sku, sku.trim()));

    if (existingProduct) {
      return res.status(409).json({
        message: "SKU already exists",
      });
    }

    const [newProduct] = await db
      .insert(product)
      .values({
        name: name.trim(),
        sku: sku.trim(),
        categoryId: Number(categoryId),
        unit: unit?.trim() || "piece",
        sellingPrice: String(sellingPrice),
        quantity: 0,
        reorderLevel:
          reorderLevel !== undefined
            ? Number(reorderLevel)
            : 10,
        storageTime:
          storageTime !== undefined && storageTime !== null
            ? Number(storageTime)
            : null,
      })
      .returning();

    // ==========================================
    // AUDIT LOG
    // ==========================================

    await createAuditLog({
      userId: req.user.id,
      action: "CREATE",
      module: "PRODUCT",
      entityId: String(newProduct.id),
      description: `Created product "${newProduct.name}"`,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });

  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      message: "Failed to create product",
    });
  }
};


// ==========================================
// GET ALL PRODUCTS
// NO AUDIT LOG
// ==========================================

export const getProducts = async (req, res) => {
  try {
    const products = await db
      .select({
        id: product.id,
        name: product.name,
        sku: product.sku,
        categoryId: product.categoryId,
        categoryName: category.name,
        unit: product.unit,
        sellingPrice: product.sellingPrice,
        quantity: product.quantity,
        reorderLevel: product.reorderLevel,
        storageTime: product.storageTime,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })
      .from(product)
      .leftJoin(
        category,
        eq(product.categoryId, category.id)
      )
      .orderBy(product.name);

    return res.status(200).json({
      products,
    });

  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};


// ==========================================
// GET PRODUCT BY ID
// NO AUDIT LOG
// ==========================================

export const getProductById = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const [existingProduct] = await db
      .select({
        id: product.id,
        name: product.name,
        sku: product.sku,
        categoryId: product.categoryId,
        categoryName: category.name,
        unit: product.unit,
        sellingPrice: product.sellingPrice,
        quantity: product.quantity,
        reorderLevel: product.reorderLevel,
        storageTime: product.storageTime,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })
      .from(product)
      .leftJoin(
        category,
        eq(product.categoryId, category.id)
      )
      .where(eq(product.id, productId));

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      product: existingProduct,
    });

  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      message: "Failed to fetch product",
    });
  }
};


// ==========================================
// UPDATE PRODUCT
// ==========================================

export const updateProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const {
      name,
      sku,
      categoryId,
      unit,
      sellingPrice,
      reorderLevel,
      storageTime,
      isActive,
    } = req.body;

    const [existingProduct] = await db
      .select()
      .from(product)
      .where(eq(product.id, productId));

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Check category if changed
    if (categoryId !== undefined) {
      const [existingCategory] = await db
        .select()
        .from(category)
        .where(eq(category.id, Number(categoryId)));

      if (!existingCategory) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      if (!existingCategory.isActive) {
        return res.status(400).json({
          message: "Cannot assign product to an inactive category",
        });
      }
    }

    // Check SKU if changed
    if (sku && sku.trim() !== existingProduct.sku) {
      const [duplicateProduct] = await db
        .select()
        .from(product)
        .where(eq(product.sku, sku.trim()));

      if (duplicateProduct) {
        return res.status(409).json({
          message: "SKU already exists",
        });
      }
    }

    const updateData = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Product name cannot be empty",
        });
      }

      updateData.name = name.trim();
    }

    if (sku !== undefined) {
      if (!sku.trim()) {
        return res.status(400).json({
          message: "SKU cannot be empty",
        });
      }

      updateData.sku = sku.trim();
    }

    if (categoryId !== undefined) {
      updateData.categoryId = Number(categoryId);
    }

    if (unit !== undefined) {
      updateData.unit = unit.trim() || "piece";
    }

    if (sellingPrice !== undefined) {
      updateData.sellingPrice = String(sellingPrice);
    }

    if (reorderLevel !== undefined) {
      updateData.reorderLevel = Number(reorderLevel);
    }

    if (storageTime !== undefined) {
      updateData.storageTime =
        storageTime === null || storageTime === ""
          ? null
          : Number(storageTime);
    }

    // STATUS
    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    const [updatedProduct] = await db
      .update(product)
      .set(updateData)
      .where(eq(product.id, productId))
      .returning();

    // ==========================================
    // AUDIT LOG
    // ==========================================

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE",
      module: "PRODUCT",
      entityId: String(updatedProduct.id),
      description: `Updated product "${updatedProduct.name}"`,
    });

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      message: "Failed to update product",
    });
  }
};