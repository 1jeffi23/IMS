import { useMemo, useState } from "react";

import {
  CalendarDays,
  Plus,
  Receipt,
  RefreshCcw,
  Search,
  TrendingDown,
  Wallet,
} from "lucide-react";

import {
  useGetExpensesQuery,
  useDeleteExpenseMutation,
} from "../../services/expenseApi";

import ExpenseTable from "./ExpenseTable";
import ExpenseForm from "./ExpenseForm";

import Loader from "../loader/Loader";
import ErrorState from "../loader/ErrorState";

import Pagination from "../../components/customHooks/Pagination";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import usePagination from "@/components/customHooks/usePagination";


const EXPENSES_PER_PAGE = 7;


const Expenses = () => {

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  // =====================================================
  // GET EXPENSES
  // =====================================================

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetExpensesQuery();

  const [deleteExpense, { isLoading: isDeleting }] =
    useDeleteExpenseMutation();

  const expenses = data?.expenses || data || [];


  // =====================================================
  // FILTER EXPENSES
  // =====================================================

  const filteredExpenses = useMemo(() => {

    const searchText =
      search.toLowerCase().trim();

    if (!searchText) {
      return expenses;
    }

    return expenses.filter((expense) => {

      return (
        expense.title
          ?.toLowerCase()
          .includes(searchText) ||

        expense.description
          ?.toLowerCase()
          .includes(searchText) ||

        expense.category
          ?.toLowerCase()
          .includes(searchText)
      );

    });

  }, [expenses, search]);


  // =====================================================
  // SUMMARY
  // =====================================================

  const {
    totalExpenses,
    monthlyExpenses,
    expenseRecords,
  } = useMemo(() => {

    const now = new Date();

    let total = 0;
    let monthly = 0;

    expenses.forEach((expense) => {

      const amount =
        Number(expense.amount || 0);

      total += amount;

      if (expense.expenseDate) {

        const date =
          new Date(expense.expenseDate);

        if (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        ) {
          monthly += amount;
        }

      }

    });

    return {
      totalExpenses: total,
      monthlyExpenses: monthly,
      expenseRecords: expenses.length,
    };

  }, [expenses]);


  // =====================================================
  // PAGINATION
  // =====================================================

  const {
    currentpage,
    totalPages,
    currentData,
    nextPage,
    prevPage,
    gotoPage,
  } = usePagination(
    filteredExpenses,
    EXPENSES_PER_PAGE
  );


  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (value) => {

    setSearch(value);
    gotoPage(1);

  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {

    try {

      await deleteExpense(id).unwrap();

    } catch (error) {

      console.error(
        "Failed to delete expense:",
        error
      );

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {

    return (
      <Loader text="Loading Expenses..." />
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {

    return (
      <ErrorState
        title="Failed to load expenses"
        message={
          error?.data?.message ||
          "Something went wrong while fetching expenses."
        }
      />
    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="space-y-6 p-4 md:p-6">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">

              <Wallet className="h-6 w-6" />

            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Expenses
              </h1>

              <p className="text-sm text-muted-foreground">
                Track and manage your business expenses
              </p>

            </div>

          </div>

        </div>


        <div className="flex items-center gap-2">

          {/* REFRESH */}

          <Button
            variant="outline"
            size="icon"
            onClick={refetch}
            disabled={isFetching}
            title="Refresh"
          >

            <RefreshCcw
              className={`h-4 w-4 ${
                isFetching
                  ? "animate-spin"
                  : ""
              }`}
            />

          </Button>


          {/* ADD EXPENSE */}

          <Button
            onClick={() => setShowForm(true)}
            className="gap-2"
          >

            <Plus className="h-4 w-4" />

            <span>
              Add Expense
            </span>

          </Button>

        </div>

      </div>


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">


        {/* TOTAL EXPENSES */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Total Expenses
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight">

                  Rs.{" "}

                  {totalExpenses.toLocaleString("en-PK")}

                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  All recorded expenses
                </p>

              </div>


              <div className="rounded-xl bg-red-100 p-2.5 text-red-600">

                <TrendingDown className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>


        {/* THIS MONTH */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  This Month
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight">

                  Rs.{" "}

                  {monthlyExpenses.toLocaleString("en-PK")}

                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Current month expenses
                </p>

              </div>


              <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600">

                <CalendarDays className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>


        {/* RECORDS */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Expense Records
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight">
                  {expenseRecords.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Total recorded transactions
                </p>

              </div>


              <div className="rounded-xl bg-purple-100 p-2.5 text-purple-600">

                <Receipt className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>

      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <Card className="border-0 shadow-sm">

        <CardContent className="p-4">

          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="relative flex-1">

              <Search
                className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  handleSearch(e.target.value)
                }
                placeholder="Search expenses..."
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  border-input
                  bg-background
                  pl-9
                  pr-3
                  text-sm
                  outline-none
                  transition
                  placeholder:text-muted-foreground
                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-500/20
                "
              />

            </div>


            {search && (

              <Button
                variant="outline"
                onClick={() =>
                  handleSearch("")
                }
                className="w-full sm:w-auto"
              >
                Clear
              </Button>

            )}

          </div>


          {/* RESULT INFO */}

          <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-muted-foreground">

              Showing{" "}

              <span className="font-medium text-foreground">

                {filteredExpenses.length === 0
                  ? 0
                  : (currentpage - 1) *
                      EXPENSES_PER_PAGE +
                    1}

              </span>

              {" "}–{" "}

              <span className="font-medium text-foreground">

                {Math.min(
                  currentpage *
                    EXPENSES_PER_PAGE,
                  filteredExpenses.length
                )}

              </span>

              {" "}of{" "}

              <span className="font-medium text-foreground">

                {filteredExpenses.length}

              </span>

              {" "}expenses

            </p>


            {search && (

              <p className="text-xs text-muted-foreground">
                Search results
              </p>

            )}

          </div>

        </CardContent>

      </Card>


      {/* =================================================
          EXPENSE TABLE
      ================================================= */}

      <Card className="overflow-hidden border-0 shadow-sm">

        <CardContent className="p-0">

          <ExpenseTable
            expenses={currentData}
            isLoading={isLoading}
            isError={isError}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />

        </CardContent>

      </Card>


      {/* =================================================
          PAGINATION
      ================================================= */}

      {totalPages > 1 && (

        <Pagination
          currentpage={currentpage}
          totalPages={totalPages}
          nextPage={nextPage}
          prevPage={prevPage}
          gotoPage={gotoPage}
        />

      )}


      {/* =================================================
          EXPENSE FORM
      ================================================= */}

      {showForm && (

        <ExpenseForm
          onClose={() =>
            setShowForm(false)
          }
        />

      )}

    </div>

  );

};


export default Expenses;