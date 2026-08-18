import express from "express";

import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
} from "../controllers/supplierController.js";

import { requireAuth } from "../../middlewares/authMiddleware.js";
import { requireRole } from "../../middlewares/authMiddleware.js";

const router = express.Router();


// ===============================
// GET ALL SUPPLIERS
// Admin, Manager, Staff
// ===============================

router.get(
  "/",
//   requireAuth,
//   requireRole("admin", "manager", "staff"),
  getSuppliers
);


// ===============================
// GET SINGLE SUPPLIER
// Admin, Manager, Staff
// ===============================

router.get(
  "/:id",
//   requireAuth,
//   requireRole("admin", "manager", "staff"),
  getSupplierById
);


// ===============================
// CREATE SUPPLIER
// Admin, Manager
// ===============================

router.post(
  "/",
//   requireAuth,
//   requireRole("admin", "manager"),
  createSupplier
);


// ===============================
// UPDATE SUPPLIER
// Admin, Manager
// ===============================

router.put(
  "/:id",
//   requireAuth,
//   requireRole("admin", "manager"),
  updateSupplier
);


export default router;