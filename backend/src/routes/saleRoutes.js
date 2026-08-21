import express from "express";

import {
  createSale,
  getSales,
  getSaleById,
} from "../controllers/saleController.js";

import { requireAuth,requireRole } from "../../middlewares/authMiddleware.js";
import { downloadSaleInvoice } from "../controllers/pdfGenController.js";


const router = express.Router();

// Sales
router.get(
  "/",
  requireAuth,
  requireRole("admin", "manager", "cashier"),
  getSales
);

router.get(
  "/:id",
  requireAuth,
  requireRole("admin", "manager", "cashier"),
  getSaleById
);

router.get(
  "/:id/invoice",
  requireAuth,
  requireRole("admin", "manager", "cashier"),
  downloadSaleInvoice
);

router.post(
  "/",
  requireAuth,
  requireRole("admin", "manager", "cashier"),
  createSale
);

export default router;