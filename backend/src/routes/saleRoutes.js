import express from "express";

import {
  createSale,
  getSales,
  getSaleById,
} from "../controllers/saleController.js";

import { requireAuth,requireRole } from "../../middlewares/authMiddleware.js";


const router = express.Router();

// Sales
router.get(
  "/",
//   requireAuth,
//   requireRole("admin", "manager", "cashier"),
  getSales
);

router.get(
  "/:id",
//   requireAuth,
//   requireRole("admin", "manager", "cashier"),
  getSaleById
);

router.post(
  "/",
//   requireAuth,
//   requireRole("admin", "manager", "cashier"),
  createSale
);

export default router;