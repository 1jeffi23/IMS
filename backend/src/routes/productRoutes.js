import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";

import {
  requireAuth,
  requireRole,
} from "../../middlewares/authMiddleware.js";

const router = express.Router();


// View all products
// Admin + Manager + Staff
router.get(
  "/",
//   requireAuth,
  getProducts
);


// View single product
router.get(
  "/:id",
//   requireAuth,
  getProductById
);


// Create product
// Admin + Manager
router.post(
  "/",
//   requireAuth,
//   requireRole("admin", "manager"),
  createProduct
);


// Update product
// Admin + Manager
router.put(
  "/:id",
//   requireAuth,
//   requireRole("admin", "manager"),
  updateProduct
);



export default router;