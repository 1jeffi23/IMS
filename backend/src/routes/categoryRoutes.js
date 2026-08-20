import express from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deactivateCategory,
} from "../controllers/categoryController.js";

import {
  requireAuth,
  requireRole,
} from "../../middlewares/authMiddleware.js";

const router = express.Router();


// View categories
// Admin + Manager + Staff
router.get(
  "/",
  requireAuth,
  getCategories
);


// View single category
router.get(
  "/:id",
  requireAuth,
  getCategoryById
);


// Add category
// Admin + Manager
router.post(
  "/",
  requireAuth,
  requireRole("admin", "manager"),
  createCategory
);


// Edit category
// Admin + Manager
router.put(
  "/:id",
  requireAuth,
  requireRole("admin", "manager"),
  updateCategory
);


// Deactivate category
// Admin only
router.patch(
  "/:id/deactivate",
  requireAuth,
  requireRole("admin"),
  deactivateCategory
);


export default router;