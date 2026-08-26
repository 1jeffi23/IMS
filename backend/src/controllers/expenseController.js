import { db } from "../../db/index.js";

import { expense } from "../models/expenseModel.js";

import { eq, desc } from "drizzle-orm";

import { createAuditLog } from "../../utils/auditLogger.js";


// ==========================================
// CREATE EXPENSE
// ==========================================

export const createExpense = async (req, res) => {
  try {
    const {
      title,
      category,
      amount,
      expenseDate,
      description,
    } = req.body;


    // BASIC VALIDATION

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Expense title is required",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        message: "Expense category is required",
      });
    }

    const expenseAmount = Number(amount);

    if (
      amount === undefined ||
      amount === null ||
      Number.isNaN(expenseAmount) ||
      expenseAmount <= 0
    ) {
      return res.status(400).json({
        message: "Expense amount must be greater than 0",
      });
    }

    if (!expenseDate) {
      return res.status(400).json({
        message: "Expense date is required",
      });
    }


    // CREATE EXPENSE

    const [newExpense] = await db
      .insert(expense)
      .values({
        title: title.trim(),

        category: category.trim(),

        amount: String(expenseAmount),

        expenseDate,

        description:
          description?.trim() || null,

        createdBy: req.user.id,
      })
      .returning();


    // AUDIT LOG

    await createAuditLog({
      userId: req.user.id,
      action: "CREATE",
      module: "EXPENSE",
      entityId: String(newExpense.id),
      description:
        `Created expense "${newExpense.title}" ` +
        `of Rs. ${newExpense.amount}`,
    });


    return res.status(201).json({
      message: "Expense created successfully",

      expense: newExpense,
    });

  } catch (error) {

    console.error(
      "Create expense error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to create expense",
    });
  }
};


// ==========================================
// GET ALL EXPENSES
// ==========================================

export const getExpenses = async (req, res) => {
  try {

    const expenses = await db
      .select()
      .from(expense)
      .orderBy(
        desc(expense.expenseDate),
        desc(expense.createdAt)
      );


    return res.status(200).json({
      message:
        "Expenses fetched successfully",

      expenses,
    });

  } catch (error) {

    console.error(
      "Get expenses error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch expenses",
    });
  }
};


// ==========================================
// GET EXPENSE BY ID
// ==========================================

export const getExpenseById = async (
  req,
  res
) => {
  try {

    const expenseId =
      Number(req.params.id);


    if (Number.isNaN(expenseId)) {
      return res.status(400).json({
        message:
          "Invalid expense ID",
      });
    }


    const [expenseData] =
      await db
        .select()
        .from(expense)
        .where(
          eq(
            expense.id,
            expenseId
          )
        );


    if (!expenseData) {
      return res.status(404).json({
        message:
          "Expense not found",
      });
    }


    return res.status(200).json({
      message:
        "Expense fetched successfully",

      expense: expenseData,
    });

  } catch (error) {

    console.error(
      "Get expense error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch expense",
    });
  }
};


// ==========================================
// DELETE EXPENSE
// ==========================================

export const deleteExpense = async (
  req,
  res
) => {
  try {

    const expenseId =
      Number(req.params.id);


    if (Number.isNaN(expenseId)) {
      return res.status(400).json({
        message:
          "Invalid expense ID",
      });
    }


    // CHECK EXPENSE

    const [existingExpense] =
      await db
        .select()
        .from(expense)
        .where(
          eq(
            expense.id,
            expenseId
          )
        );


    if (!existingExpense) {
      return res.status(404).json({
        message:
          "Expense not found",
      });
    }


    // DELETE

    await db
      .delete(expense)
      .where(
        eq(
          expense.id,
          expenseId
        )
      );


    // AUDIT LOG

    await createAuditLog({
      userId: req.user.id,
      action: "DELETE",
      module: "EXPENSE",
      entityId: String(expenseId),
      description:
        `Deleted expense "${existingExpense.title}" ` +
        `of Rs. ${existingExpense.amount}`,
    });


    return res.status(200).json({
      message:
        "Expense deleted successfully",
    });

  } catch (error) {

    console.error(
      "Delete expense error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete expense",
    });
  }
};