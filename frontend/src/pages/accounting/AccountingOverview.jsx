import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const AccountingOverview = ({
  accounting,
  isLoading,
}) => {
  const {
    totalSales = 0,
    totalCOGS = 0,
    grossProfit = 0,
    totalExpenses = 0,
    netProfit = 0,
    totalTransactions = 0,
    expenseCount = 0,
  } = accounting;

  const formatAmount = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString()}`;

  const isProfit = Number(netProfit) >= 0;

  return (
    <>
      {/* Financial Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

        {/* Revenue */}
        <Card className="overflow-hidden border-0 shadow-sm">
          <CardContent className="relative p-5">

            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-blue-50 dark:bg-blue-950/30" />

            <div className="relative flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Revenue
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {isLoading
                    ? "..."
                    : formatAmount(totalSales)}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Total sales
                </p>
              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950">
                <DollarSign className="h-5 w-5" />
              </div>

            </div>
          </CardContent>
        </Card>

        {/* COGS */}
        <Card className="overflow-hidden border-0 shadow-sm">
          <CardContent className="relative p-5">

            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-orange-50 dark:bg-orange-950/30" />

            <div className="relative flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  COGS
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {isLoading
                    ? "..."
                    : formatAmount(totalCOGS)}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Cost of goods sold
                </p>
              </div>

              <div className="rounded-xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-950">
                <ShoppingCart className="h-5 w-5" />
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Gross Profit */}
        <Card className="overflow-hidden border-0 shadow-sm">
          <CardContent className="relative p-5">

            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-emerald-50 dark:bg-emerald-950/30" />

            <div className="relative flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Gross Profit
                </p>

                <h2 className="mt-2 text-2xl font-bold text-emerald-600">
                  {isLoading
                    ? "..."
                    : formatAmount(grossProfit)}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Revenue − COGS
                </p>
              </div>

              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-950">
                <TrendingUp className="h-5 w-5" />
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card className="overflow-hidden border-0 shadow-sm">
          <CardContent className="relative p-5">

            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-red-50 dark:bg-red-950/30" />

            <div className="relative flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Expenses
                </p>

                <h2 className="mt-2 text-2xl font-bold text-red-600">
                  {isLoading
                    ? "..."
                    : formatAmount(totalExpenses)}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Business expenses
                </p>
              </div>

              <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-950">
                <TrendingDown className="h-5 w-5" />
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Net Profit */}
        <Card
          className={`overflow-hidden border-0 shadow-sm ${
            isProfit
              ? "bg-emerald-50/60 dark:bg-emerald-950/20"
              : "bg-red-50/60 dark:bg-red-950/20"
          }`}
        >
          <CardContent className="relative p-5">

            <div className="relative flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Net {isProfit ? "Profit" : "Loss"}
                </p>

                <h2
                  className={`mt-2 text-2xl font-bold ${
                    isProfit
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {isLoading
                    ? "..."
                    : formatAmount(Math.abs(netProfit))}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Gross profit − expenses
                </p>
              </div>

              <div
                className={`rounded-xl p-3 ${
                  isProfit
                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950"
                    : "bg-red-100 text-red-600 dark:bg-red-950"
                }`}
              >
                <Wallet className="h-5 w-5" />
              </div>

            </div>
          </CardContent>
        </Card>

      </div>

      {/* Quick Summary */}
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Sales */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h2 className="font-semibold">
                  Sales Summary
                </h2>

                <p className="text-sm text-muted-foreground">
                  Sales activity for selected period
                </p>
              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950">
                <ShoppingCart className="h-5 w-5" />
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-xl bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">
                  Transactions
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {isLoading
                    ? "..."
                    : totalTransactions}
                </p>
              </div>

              <div className="rounded-xl bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">
                  Revenue
                </p>

                <p className="mt-1 text-lg font-bold">
                  {formatAmount(totalSales)}
                </p>
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Expenses */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h2 className="font-semibold">
                  Expense Summary
                </h2>

                <p className="text-sm text-muted-foreground">
                  Expense activity for selected period
                </p>
              </div>

              <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-950">
                <Receipt className="h-5 w-5" />
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-xl bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">
                  Expense Records
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {isLoading
                    ? "..."
                    : expenseCount}
                </p>
              </div>

              <div className="rounded-xl bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">
                  Total Expenses
                </p>

                <p className="mt-1 text-lg font-bold text-red-600">
                  {formatAmount(totalExpenses)}
                </p>
              </div>

            </div>

          </CardContent>
        </Card>

      </div>

    </>
  );
};

export default AccountingOverview;