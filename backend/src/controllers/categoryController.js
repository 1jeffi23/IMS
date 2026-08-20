import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { category } from "../models/categoryModel.js";
import { createAuditLog } from "../../utils/auditLogger.js";


// =====================================================
// CREATE CATEGORY
// =====================================================

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const existingCategory = await db
      .select()
      .from(category)
      .where(eq(category.name, name.trim()));

    if (existingCategory.length > 0) {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    const [newCategory] = await db
      .insert(category)
      .values({
        name: name.trim(),
        description: description?.trim() || null,
      })
      .returning();


    // ============================
    // AUDIT LOG
    // ============================

    await createAuditLog({
      userId: req.user.id,
      action: "CREATE",
      module: "CATEGORY",
      entityId: String(newCategory.id),
      description: `Created category "${newCategory.name}"`,
    });


    return res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });

  } catch (error) {
    console.error("Create category error:", error);

    return res.status(500).json({
      message: "Failed to create category",
    });
  }
};


// =====================================================
// GET ALL CATEGORIES
// NO AUDIT LOG
// =====================================================

export const getCategories = async (req, res) => {
  try {
    const categories = await db
      .select()
      .from(category)
      .orderBy(category.name);

    return res.status(200).json({
      categories,
    });

  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      message: "Failed to fetch categories",
    });
  }
};


// =====================================================
// GET CATEGORY BY ID
// NO AUDIT LOG
// =====================================================

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingCategory] = await db
      .select()
      .from(category)
      .where(eq(category.id, Number(id)));

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json({
      category: existingCategory,
    });

  } catch (error) {
    console.error("Get category error:", error);

    return res.status(500).json({
      message: "Failed to fetch category",
    });
  }
};


// =====================================================
// UPDATE CATEGORY
// =====================================================

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const categoryId = Number(id);

    const [existingCategory] = await db
      .select()
      .from(category)
      .where(eq(category.id, categoryId));

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const duplicateCategory = await db
      .select()
      .from(category)
      .where(eq(category.name, name.trim()));

    if (
      duplicateCategory.length > 0 &&
      duplicateCategory[0].id !== categoryId
    ) {
      return res.status(409).json({
        message: "Category name already exists",
      });
    }

    const [updatedCategory] = await db
      .update(category)
      .set({
        name: name.trim(),
        description: description?.trim() || null,
      })
      .where(eq(category.id, categoryId))
      .returning();


    // ============================
    // AUDIT LOG
    // ============================

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE",
      module: "CATEGORY",
      entityId: String(updatedCategory.id),
      description: `Updated category "${updatedCategory.name}"`,
    });


    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });

  } catch (error) {
    console.error("Update category error:", error);

    return res.status(500).json({
      message: "Failed to update category",
    });
  }
};


// =====================================================
// DEACTIVATE CATEGORY
// =====================================================

export const deactivateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const categoryId = Number(id);

    const [existingCategory] = await db
      .select()
      .from(category)
      .where(eq(category.id, categoryId));

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const [updatedCategory] = await db
      .update(category)
      .set({
        isActive: false,
      })
      .where(eq(category.id, categoryId))
      .returning();


    // ============================
    // AUDIT LOG
    // ============================

    await createAuditLog({
      userId: req.user.id,
      action: "DEACTIVATE",
      module: "CATEGORY",
      entityId: String(updatedCategory.id),
      description: `Deactivated category "${updatedCategory.name}"`,
    });


    return res.status(200).json({
      message: "Category deactivated successfully",
      category: updatedCategory,
    });

  } catch (error) {
    console.error("Deactivate category error:", error);

    return res.status(500).json({
      message: "Failed to deactivate category",
    });
  }
};