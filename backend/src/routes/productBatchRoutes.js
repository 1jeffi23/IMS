import express from "express";

import {
  createProductBatch,
  getProductBatches,
  getProductBatchById,
  updateProductBatch,
  deleteProductBatch,
} from "../controllers/productBatchController.js";

import {
  requireAuth,
  requireRole,
} from "../../middlewares/authMiddleware.js";

const router = express.Router();


// ==========================================
// GET ALL BATCHES
// Admin + Manager + Staff
// ==========================================

router.get(
  "/",
//   requireAuth,
  getProductBatches
);


// ==========================================
// GET SINGLE BATCH
// Admin + Manager + Staff
// ==========================================

router.get(
  "/:id",
  requireAuth,
  getProductBatchById
);


// ==========================================
// CREATE BATCH
// Admin + Manager
// ==========================================

router.post(
  "/",
  requireAuth,
  requireRole("admin", "manager"),
  createProductBatch
);


// ==========================================
// UPDATE BATCH
// Admin + Manager
// ==========================================

router.put(
  "/:id",
  requireAuth,
  requireRole("admin", "manager"),
  updateProductBatch
);


// ==========================================
// DELETE BATCH
// Admin only
// ==========================================

router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  deleteProductBatch
);


export default router;