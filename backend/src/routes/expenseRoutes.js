import express from "express";

import {
  createExpense,
  getExpenses,
  getExpenseById,
  deleteExpense,
} from "../controllers/expenseController.js";

import { requireAuth } from "../../middlewares/authMiddleware.js";
import { requireRole } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Get all expenses
router.get(
  "/",
  requireAuth,
  requireRole("admin", "manager"),
  getExpenses
);

// Get single expense
router.get(
  "/:id",
  requireAuth,
  requireRole("admin", "manager"),
  getExpenseById
);

// Create expense
router.post(
  "/",
  requireAuth,
  requireRole("admin", "manager"),
  createExpense
);

// Delete expense
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  deleteExpense
);

export default router;