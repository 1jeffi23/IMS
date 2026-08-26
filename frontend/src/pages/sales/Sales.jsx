import { useMemo, useState, useEffect } from "react";

import {
  ShoppingCart,
  Receipt,
  Banknote,
  Search,
  RefreshCcw,
  CircleDollarSign,
  CalendarDays,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";

import {
  useGetSalesQuery,
} from "../../services/saleApi";

import ErrorState from "../loader/ErrorState";
import Loader from "../loader/Loader";
import SaleTable from "./SaleTable";

import usePagination from "../../components/customHooks/usePagination";
import Pagination from "../../components/customHooks/Pagination";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


const SALES_PER_PAGE = 5;


const Sale = () => {

  // =====================================================
  // STATE
  // =====================================================

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");


  // =====================================================
  // GET SALES
  // =====================================================

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetSalesQuery();


  const sales = data?.sales || [];


  // =====================================================
  // CALCULATIONS
  // =====================================================

  const totalSales = sales.length;

  const totalRevenue = sales.reduce(
    (total, sale) =>
      total + Number(sale.total || 0),
    0
  );

  const averageSale =
    totalSales > 0
      ? totalRevenue / totalSales
      : 0;

  const cashSales = sales.filter(
    (sale) =>
      sale.paymentMethod?.toLowerCase() === "cash"
  ).length;

  const cardSales = sales.filter(
    (sale) =>
      sale.paymentMethod?.toLowerCase() === "card"
  ).length;


  // =====================================================
  // FILTER SALES
  // =====================================================

  const filteredSales = useMemo(() => {

    const searchText = search
      .toLowerCase()
      .trim();

    return sales.filter((sale) => {

      const customerName =
        sale.customerName ||
        "walk-in customer";

      const saleId = String(sale.id);

      const matchesSearch =
        !searchText ||
        saleId.includes(searchText) ||
        customerName
          .toLowerCase()
          .includes(searchText) ||
        sale.paymentMethod
          ?.toLowerCase()
          .includes(searchText);

      const matchesPayment =
        paymentFilter === "all" ||
        sale.paymentMethod?.toLowerCase() ===
          paymentFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesPayment
      );

    });

  }, [
    sales,
    search,
    paymentFilter,
  ]);


  // =====================================================
  // PAGINATION
  // =====================================================

  const {
    currentpage,
    totalPages,
    currentData: currentSales,
    nextPage,
    prevPage,
    gotoPage,
  } = usePagination(
    filteredSales,
    SALES_PER_PAGE
  );


  // =====================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =====================================================

  useEffect(() => {

    gotoPage(1);

  }, [
    search,
    paymentFilter,
  ]);


  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {

    setSearch("");
    setPaymentFilter("all");

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {

    return (
      <Loader text="Loading Sales..." />
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {

    return (
      <ErrorState
        title="Failed to load sales"
        message={
          error?.data?.message ||
          "Something went wrong while fetching sales."
        }
      />
    );

  }


  // =====================================================
  // STATS
  // =====================================================

  const stats = [

    {
      title: "Total Sales",
      value: totalSales,
      description: "Completed transactions",
      icon: ShoppingCart,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },

    {
      title: "Total Revenue",
      value: `Rs. ${totalRevenue.toLocaleString(
        "en-PK"
      )}`,
      description: "Revenue from all sales",
      icon: CircleDollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },

    {
      title: "Average Sale",
      value: `Rs. ${averageSale.toLocaleString(
        "en-PK",
        {
          maximumFractionDigits: 0,
        }
      )}`,
      description: "Average transaction value",
      icon: Receipt,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },

    {
      title: "Cash Sales",
      value: cashSales,
      description: `${cardSales} card sales`,
      icon: Banknote,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },

  ];


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="space-y-6 p-4 md:p-6">

      <div className="mx-auto max-w-8xl space-y-6">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">

                <ShoppingCart className="h-6 w-6" />

              </div>

              <div>

                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Sales
                </h1>

                <p className="text-sm text-muted-foreground">
                  View completed sales and manage invoices
                </p>

              </div>

            </div>

          </div>


          {/* REFRESH */}

          <Button
            variant="outline"
            onClick={refetch}
            disabled={isFetching}
            className="
              w-full
              gap-2
              sm:w-auto
              hover:border-emerald-400
              hover:bg-emerald-50
              hover:text-emerald-600
            "
          >

            <RefreshCcw
              className={`h-4 w-4 ${
                isFetching
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh

          </Button>

        </div>


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat) => {

            const Icon = stat.icon;

            return (

              <Card
                key={stat.title}
                className="
                  border-0
                  shadow-sm
                  transition-shadow
                  hover:shadow-md
                "
              >

                <CardContent className="p-5">

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>

                      <p className="mt-2 text-2xl font-bold tracking-tight">
                        {stat.value}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {stat.description}
                      </p>

                    </div>

                    <div
                      className={`rounded-xl p-2.5 ${stat.iconBg} ${stat.iconColor}`}
                    >

                      <Icon className="h-5 w-5" />

                    </div>

                  </div>

                </CardContent>

              </Card>

            );

          })}

        </div>


        {/* =================================================
            SEARCH + FILTER SECTION
        ================================================= */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            {/* SECTION TITLE */}

            <div className="mb-4 flex items-center gap-2">

              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">

                <SlidersHorizontal className="h-4 w-4" />

              </div>

              <div>

                <h2 className="text-sm font-semibold">
                  Search & Filters
                </h2>

                <p className="text-xs text-muted-foreground">
                  Find sales quickly
                </p>

              </div>

            </div>


            {/* FILTERS */}

            <div className="flex flex-col gap-3 lg:flex-row">

              {/* SEARCH */}

              <div className="relative flex-1">

                <Search
                  className="
                    absolute
                    left-3.5
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
                    setSearch(e.target.value)
                  }
                  placeholder="Search sale ID, customer or payment method..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    py-2.5
                    pl-10
                    pr-4
                    text-sm
                    outline-none
                    transition
                    focus:border-emerald-400
                    focus:ring-4
                    focus:ring-emerald-50
                  "
                />

              </div>


              {/* PAYMENT */}

              <select
                value={paymentFilter}
                onChange={(e) =>
                  setPaymentFilter(e.target.value)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  outline-none
                  transition
                  focus:border-emerald-400
                  focus:ring-4
                  focus:ring-emerald-50
                  lg:w-48
                "
              >

                <option value="all">
                  All Payments
                </option>

                <option value="cash">
                  Cash
                </option>

                <option value="card">
                  Card
                </option>

                <option value="online">
                  Online
                </option>

                <option value="easypaisa">
                  Easypaisa
                </option>

                <option value="jazzcash">
                  JazzCash
                </option>

              </select>


              {/* CLEAR */}

              {(search ||
                paymentFilter !== "all") && (

                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  className="
                    w-full
                    gap-2
                    lg:w-auto
                    hover:border-emerald-400
                    hover:bg-emerald-50
                    hover:text-emerald-600
                  "
                >

                  <RotateCcw className="h-4 w-4" />

                  Clear

                </Button>

              )}

            </div>


            {/* FILTER INFO */}

            <div className="mt-4 flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs text-muted-foreground">

                Showing{" "}

                <span className="font-semibold text-foreground">
                  {filteredSales.length}
                </span>

                {" "}of{" "}

                <span className="font-semibold text-foreground">
                  {sales.length}
                </span>

                {" "}sales

              </p>


              <div className="flex items-center gap-2 text-xs text-muted-foreground">

                <CalendarDays className="h-3.5 w-3.5" />

                Completed transactions

              </div>

            </div>

          </CardContent>

        </Card>


        {/* =================================================
            SALES TABLE
        ================================================= */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-0">

            {/* SECTION HEADER */}

            <div className="
              flex
              flex-col
              gap-2
              border-b
              p-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            ">

              <div>

                <h2 className="text-lg font-semibold">
                  Sales History
                </h2>

                <p className="text-sm text-muted-foreground">
                  View completed transactions and invoices
                </p>

              </div>


              <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600">

                {filteredSales.length}{" "}
                {filteredSales.length === 1
                  ? "Sale"
                  : "Sales"}

              </div>

            </div>


            {/* TABLE */}

            <SaleTable
              sales={currentSales}
              totalSales={sales.length}
              clearFilters={clearFilters}
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

      </div>

    </div>

  );

};


export default Sale;