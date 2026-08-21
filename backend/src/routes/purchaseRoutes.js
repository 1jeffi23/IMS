import express from "express";

import {
  createPurchase,
  getPurchases,
  getPurchaseById,
} from "../controllers/purchaseController.js";

import {
  requireAuth,
  requireRole,
} from "../../middlewares/authMiddleware.js";
import { downloadPurchaseInvoice } from "../controllers/pdfGenController.js";

const router = express.Router();


// Create Purchase
router.post(
  "/",
  requireAuth,
  requireRole("admin", "manager"),
  createPurchase
);

router.get(
  "/:id/invoice",
  requireAuth,
  requireRole("admin","manager"),
  downloadPurchaseInvoice
);


// Get All Purchases
router.get(
  "/",
  requireAuth,
  requireRole("admin", "manager"),
  getPurchases
);


// Get Single Purchase
router.get(
  "/:id",
  requireAuth,
  requireRole("admin", "manager"),
  getPurchaseById
);


export default router;