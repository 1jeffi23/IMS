import { useMemo, useState } from "react";

import {
  useGetSalesQuery,
} from "../../services/saleApi";

import {
  ShoppingCart,
  Receipt,
  Banknote,
  Search,
  RefreshCw,
  CircleDollarSign,
  CalendarDays,
} from "lucide-react";

import ErrorState from "../loader/ErrorState";
import Loader from "../loader/Loader";
import SaleTable from "./SaleTable";


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
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },

    {
      title: "Total Revenue",
      value: `Rs. ${totalRevenue.toLocaleString(
        "en-PK"
      )}`,
      description: "Revenue from all sales",
      icon: CircleDollarSign,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
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
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },

    {
      title: "Cash Sales",
      value: cashSales,
      description: `${cardSales} card sales`,
      icon: Banknote,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },

  ];


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="p-4 sm:p-6 bg-gray-50 min-h-full">

      <div className="max-w-8xl mx-auto">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">

                <ShoppingCart
                  size={22}
                  className="text-blue-600"
                />

              </div>

              <div>

                <h1 className="text-2xl font-semibold text-gray-900">
                  Sales
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  View completed sales and manage invoices
                </p>

              </div>

            </div>

          </div>


          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >

            <RefreshCw
              size={16}
              className={
                isFetching
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>

        </div>


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {stats.map((stat) => {

            const Icon = stat.icon;

            return (

              <div
                key={stat.title}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all duration-200"
              >

                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gray-50">

                  <Icon
                    size={21}
                    className={stat.iconColor}
                  />

                </div>

                <p className="text-sm text-gray-500 mt-5">
                  {stat.title}
                </p>

                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stat.value}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {stat.description}
                </p>

              </div>

            );

          })}

        </div>


        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <div className="bg-white border border-gray-200 rounded-2xl p-4 mt-6">

          <div className="flex flex-col md:flex-row gap-3">


            {/* SEARCH */}

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search sale ID, customer or payment method..."
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
              />

            </div>


            {/* PAYMENT */}

            <select
              value={paymentFilter}
              onChange={(e) =>
                setPaymentFilter(e.target.value)
              }
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
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

              <button
                type="button"
                onClick={clearFilters}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm hover:bg-gray-50 transition"
              >
                Clear
              </button>

            )}

          </div>


          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3">

            <p className="text-xs text-gray-500">

              Showing{" "}

              <span className="font-medium text-gray-700">
                {filteredSales.length}
              </span>

              {" "}of{" "}

              <span className="font-medium text-gray-700">
                {sales.length}
              </span>

              {" "}sales

            </p>


            <div className="flex items-center gap-2 text-xs text-gray-400">

              <CalendarDays size={14} />

              Completed transactions

            </div>

          </div>

        </div>


        {/* =================================================
            SALES TABLE
        ================================================= */}

        <SaleTable
          sales={filteredSales}
          totalSales={sales.length}
          clearFilters={clearFilters}
        />

      </div>

    </div>

  );

};


export default Sale;