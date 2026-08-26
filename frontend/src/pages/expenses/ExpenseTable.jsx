import { useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Receipt,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ErrorState from "../loader/ErrorState";
import Loader from "../loader/Loader";

const ExpenseTable = ({
  expenses,
  isLoading,
  isError,
  onDelete,
  isDeleting,
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    return [
      ...new Set(
        expenses
          .map((expense) => expense.category)
          .filter(Boolean)
      ),
    ];
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        expense.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        expense.description
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "all" ||
        expense.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [expenses, search, category]);

  const getCategoryStyle = (category) => {
    switch (category?.toLowerCase()) {
      case "rent":
        return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300";

      case "utilities":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";

      case "salary":
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";

      case "transport":
        return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300";

      case "maintenance":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return <Loader text="Loading expenses..." />
  }

  if (isError) {
    return (
       <ErrorState
         title="Failed to load expenses"
         message={
           "Something went wrong while fetching expenses."
         }
       />
     );
  }

  return (
    <div>

      {/* Filters */}
      <div className="flex flex-col gap-3 border-b p-4 md:flex-row">

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses..."
            className="pl-9"
          />
        </div>

        <div className="relative md:w-52">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">
              All Categories
            </option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty */}
      {!filteredExpenses.length ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <Receipt className="h-7 w-7 text-muted-foreground" />
          </div>

          <h3 className="font-semibold">
            No expenses found
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Try changing your search or filter.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3">Expense</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium">
                          {expense.title}
                        </p>

                        {expense.description && (
                          <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">
                            {expense.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <Badge
                        variant="secondary"
                        className={getCategoryStyle(
                          expense.category
                        )}
                      >
                        {expense.category}
                      </Badge>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        - Rs.{" "}
                        {Number(expense.amount).toLocaleString()}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {expense.expenseDate
                        ? new Date(
                            expense.expenseDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isDeleting}
                        onClick={() =>
                          onDelete(expense.id)
                        }
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 p-4 md:hidden">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">
                    <h3 className="font-semibold">
                      {expense.title}
                    </h3>

                    <div className="mt-2">
                      <Badge
                        variant="secondary"
                        className={getCategoryStyle(
                          expense.category
                        )}
                      >
                        {expense.category}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isDeleting}
                    onClick={() =>
                      onDelete(expense.id)
                    }
                    className="shrink-0 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Amount
                    </p>

                    <p className="font-semibold text-red-600">
                      - Rs.{" "}
                      {Number(
                        expense.amount
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      Date
                    </p>

                    <p className="text-sm">
                      {expense.expenseDate
                        ? new Date(
                            expense.expenseDate
                          ).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>

                {expense.description && (
                  <p className="mt-3 border-t pt-3 text-sm text-muted-foreground">
                    {expense.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseTable;