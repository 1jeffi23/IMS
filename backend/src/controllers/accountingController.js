import { db } from "../../db/index.js";

import { sale } from "../models/saleModel.js";
import { saleItem } from "../models/saleItemModel.js";
import { expense } from "../models/expenseModel.js";

import { eq, and, gte, lte, sql } from "drizzle-orm";

export const getAccountingSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const saleConditions = [];
    const expenseConditions = [];

    // Date filtering
    if (startDate) {
      saleConditions.push(
        gte(sale.createdAt, new Date(startDate))
      );

      expenseConditions.push(
        gte(expense.expenseDate, new Date(startDate))
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      saleConditions.push(
        lte(sale.createdAt, end)
      );

      expenseConditions.push(
        lte(expense.expenseDate, end)
      );
    }

    // -----------------------------------
    // SALES + COGS
    // -----------------------------------

    const salesResult = await db
      .select({
        totalSales: sql`
          COALESCE(
            SUM(
              ${saleItem.quantity} * ${saleItem.unitPrice}
            ),
            0
          )
        `,

        totalCOGS: sql`
          COALESCE(
            SUM(
              ${saleItem.quantity} * ${saleItem.costPrice}
            ),
            0
          )
        `,

        totalTransactions: sql`
          COUNT(DISTINCT ${sale.id})
        `,
      })
      .from(sale)
      .innerJoin(
        saleItem,
        eq(saleItem.saleId, sale.id)
      )
      .where(
        saleConditions.length
          ? and(...saleConditions)
          : undefined
      );

    // -----------------------------------
    // EXPENSES
    // -----------------------------------

    const expensesResult = await db
      .select({
        totalExpenses: sql`
          COALESCE(
            SUM(${expense.amount}),
            0
          )
        `,

        expenseCount: sql`
          COUNT(${expense.id})
        `,
      })
      .from(expense)
      .where(
        expenseConditions.length
          ? and(...expenseConditions)
          : undefined
      );

    const totalSales = Number(
      salesResult[0]?.totalSales || 0
    );

    const totalCOGS = Number(
      salesResult[0]?.totalCOGS || 0
    );

    const totalExpenses = Number(
      expensesResult[0]?.totalExpenses || 0
    );

    const totalTransactions = Number(
      salesResult[0]?.totalTransactions || 0
    );

    const expenseCount = Number(
      expensesResult[0]?.expenseCount || 0
    );

    // -----------------------------------
    // PROFIT CALCULATIONS
    // -----------------------------------

    const grossProfit =
      totalSales - totalCOGS;

    const netProfit =
      grossProfit - totalExpenses;

    res.status(200).json({
      success: true,

      data: {
        totalSales,
        totalCOGS,
        grossProfit,
        totalExpenses,
        netProfit,
        totalTransactions,
        expenseCount,
      },
    });
  } catch (error) {
    console.error(
      "Get accounting summary error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to get accounting summary",
      error: error.message,
    });
  }
};