import express from "express";

import {
  getAccountingSummary,
} from "../controllers/accountingController.js";

import { requireAuth } from "../../middlewares/authMiddleware.js";
import { requireRole } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Accounting summary
router.get(
  "/summary",
  requireAuth,
  requireRole("admin", "manager"),
  getAccountingSummary
);

export default router;