import { useMemo, useState } from "react";

import {
  useGetSalesQuery,
  useLazyGetSaleByIdQuery,
} from "../../services/saleApi";

import { generateSaleInvoice } from "./saleInvoice";

import {
  ShoppingCart,
  Receipt,
  Banknote,
  CreditCard,
  Wallet,
  Search,
  Download,
  RefreshCw,
  CircleDollarSign,
  CalendarDays,
} from "lucide-react";

const Sale = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [downloadingSaleId, setDownloadingSaleId] =
    useState(null);

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // ==========================================
  // GET SALES
  // ==========================================

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetSalesQuery();

  // ==========================================
  // GET SINGLE SALE
  // ==========================================

  const [getSaleById] = useLazyGetSaleByIdQuery();

  const sales = data?.sales || [];

  // ==========================================
  // CALCULATIONS
  // ==========================================

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

  // ==========================================
  // FILTER SALES
  // ==========================================

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

  // ==========================================
  // DOWNLOAD PDF
  // ==========================================

  const handleDownloadPDF = async (saleId) => {
    try {
      setDownloadingSaleId(saleId);

      const result =
        await getSaleById(saleId).unwrap();

      generateSaleInvoice(
        result.sale,
        result.items
      );
    } catch (error) {
      console.error(
        "PDF download error:",
        error
      );

      alert(
        error?.data?.message ||
          "Failed to generate invoice"
      );
    } finally {
      setDownloadingSaleId(null);
    }
  };

  // ==========================================
  // PAYMENT STYLE
  // ==========================================

  const getPaymentStyle = (method) => {
    switch (
      method?.toLowerCase()
    ) {
      case "cash":
        return {
          wrapper:
            "bg-green-50 text-green-700 border-green-100",
          dot: "bg-green-500",
          icon: Banknote,
        };

      case "card":
        return {
          wrapper:
            "bg-blue-50 text-blue-700 border-blue-100",
          dot: "bg-blue-500",
          icon: CreditCard,
        };

      case "online":
      case "easypaisa":
      case "jazzcash":
        return {
          wrapper:
            "bg-purple-50 text-purple-700 border-purple-100",
          dot: "bg-purple-500",
          icon: Wallet,
        };

      default:
        return {
          wrapper:
            "bg-gray-50 text-gray-700 border-gray-100",
          dot: "bg-gray-400",
          icon: Wallet,
        };
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-full">
        <div className="max-w-7xl mx-auto">

          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded-lg" />
            <div className="h-4 w-72 bg-gray-200 rounded mt-3" />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-7">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white border rounded-2xl p-5 h-32"
                />
              ))}
            </div>

            <div className="bg-white border rounded-2xl h-96 mt-6" />
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (isError) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-full">
        <div className="max-w-7xl mx-auto">

          <div className="border border-red-200 rounded-2xl bg-white p-8 text-center">

            <div className="mx-auto w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <Receipt
                size={27}
                className="text-red-500"
              />
            </div>

            <h2 className="mt-4 font-semibold text-gray-800">
              Failed to load sales
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {error?.data?.message ||
                "Something went wrong while fetching sales."}
            </p>

            <button
              type="button"
              onClick={refetch}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // STATS
  // ==========================================

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

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-full">

      <div className="max-w-8xl mx-auto">

        {/* ======================================
            HEADER
        ======================================= */}

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

        {/* ======================================
            SUMMARY CARDS
        ======================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all duration-200"
              >

                <div className="flex items-start justify-between">

                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconBg}`}
                  >
                    <Icon
                      size={21}
                      className={stat.iconColor}
                    />
                  </div>

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

        {/* ======================================
            SEARCH + FILTER
        ======================================= */}

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
                onClick={() => {
                  setSearch("");
                  setPaymentFilter("all");
                }}
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
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700">
                {sales.length}
              </span>{" "}
              sales
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <CalendarDays size={14} />
              Completed transactions
            </div>

          </div>

        </div>

        {/* ======================================
            SALES TABLE
        ======================================= */}

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mt-5">

          {/* CARD HEADER */}

          <div className="px-5 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

            <div>
              <h2 className="font-semibold text-gray-900">
                Sales History
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                All completed transactions
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
              <Receipt size={14} />
              {filteredSales.length}{" "}
              {filteredSales.length === 1
                ? "Sale"
                : "Sales"}
            </div>

          </div>

          {/* ====================================
              EMPTY STATE
          ===================================== */}

          {filteredSales.length === 0 ? (

            <div className="py-16 px-6 text-center">

              <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Receipt
                  size={30}
                  className="text-blue-500"
                />
              </div>

              <h3 className="font-semibold text-gray-800 mt-4">
                {sales.length === 0
                  ? "No sales yet"
                  : "No matching sales"}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {sales.length === 0
                  ? "Completed sales will appear here."
                  : "Try changing your search or payment filter."}
              </p>

              {(search ||
                paymentFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPaymentFilter("all");
                  }}
                  className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}

            </div>

          ) : (

            /* ==================================
               TABLE
            =================================== */

            <div className="overflow-x-auto">

              <table className="w-full min-w-225">

                {/* TABLE HEADER */}

                <thead>
                  <tr className="border-b bg-gray-50">

                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Sale
                    </th>

                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Customer
                    </th>

                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Date
                    </th>

                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Payment
                    </th>

                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Total
                    </th>

                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Invoice
                    </th>

                  </tr>
                </thead>

                {/* TABLE BODY */}

                <tbody>

                  {filteredSales.map((sale) => {

                    const paymentMethod =
                      sale.paymentMethod ||
                      "Unknown";

                    const paymentStyle =
                      getPaymentStyle(
                        paymentMethod
                      );

                    const PaymentIcon =
                      paymentStyle.icon;

                    const isDownloading =
                      downloadingSaleId ===
                      sale.id;

                    return (
                      <tr
                        key={sale.id}
                        className="border-b last:border-b-0 hover:bg-blue-50/30 transition-colors"
                      >

                        {/* SALE */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                              <Receipt
                                size={17}
                                className="text-blue-600"
                              />
                            </div>

                            <div>
                              <p className="font-semibold text-gray-900">
                                #{sale.id}
                              </p>

                              <p className="text-xs text-gray-400 mt-0.5">
                                Sale
                              </p>
                            </div>

                          </div>

                        </td>

                        {/* CUSTOMER */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center text-sm font-semibold text-purple-600">
                              {(
                                sale.customerName ||
                                "W"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>

                              <p className="font-medium text-gray-800">
                                {sale.customerName ||
                                  "Walk-in Customer"}
                              </p>

                              {!sale.customerName && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  No customer selected
                                </p>
                              )}

                            </div>

                          </div>

                        </td>

                        {/* DATE */}

                        <td className="px-5 py-4 whitespace-nowrap">

                          {sale.createdAt ? (
                            <>
                              <p className="text-sm text-gray-700">
                                {new Date(
                                  sale.createdAt
                                ).toLocaleDateString(
                                  "en-PK",
                                  {
                                    dateStyle:
                                      "medium",
                                  }
                                )}
                              </p>

                              <p className="text-xs text-gray-400 mt-0.5">
                                {new Date(
                                  sale.createdAt
                                ).toLocaleTimeString(
                                  "en-PK",
                                  {
                                    hour:
                                      "2-digit",
                                    minute:
                                      "2-digit",
                                  }
                                )}
                              </p>
                            </>
                          ) : (
                            <span className="text-gray-400">
                              -
                            </span>
                          )}

                        </td>

                        {/* PAYMENT */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${paymentStyle.wrapper}`}
                          >

                            <PaymentIcon size={14} />

                            {paymentMethod}

                          </span>

                        </td>

                        {/* TOTAL */}

                        <td className="px-5 py-4 text-right whitespace-nowrap">

                          <span className="font-semibold text-green-700">
                            Rs.{" "}
                            {Number(
                              sale.total || 0
                            ).toLocaleString(
                              "en-PK"
                            )}
                          </span>

                        </td>

                        {/* DOWNLOAD */}

                        <td className="px-5 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              handleDownloadPDF(
                                sale.id
                              )
                            }
                            disabled={
                              downloadingSaleId !==
                              null
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >

                            {isDownloading ? (
                              <>
                                <RefreshCw
                                  size={15}
                                  className="animate-spin"
                                />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Download
                                  size={15}
                                />
                                PDF
                              </>
                            )}

                          </button>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </div>
  );
};

export default Sale;