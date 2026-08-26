import { useMemo, useState } from "react";

import { useGetSalesQuery } from "../../services/saleApi";

import {
  Receipt,
  Banknote,
  CreditCard,
  Wallet,
  Search,
  Download,
  RefreshCw,
  CalendarDays,
} from "lucide-react";

import ErrorState from "../loader/ErrorState";
import Loader from "../loader/Loader";
import axios from "axios";

const SaleTable = () => {
  // STATE

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [downloadingSaleId, setDownloadingSaleId] = useState(null);

  // GET SALES

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetSalesQuery();

  const sales = data?.sales || [];

  // FILTER SALES

  const filteredSales = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return sales.filter((sale) => {
      const customerName =
        sale.customerName || "walk-in customer";

      const saleId = String(sale.id);

      const matchesSearch =
        !searchText ||
        saleId.includes(searchText) ||
        customerName.toLowerCase().includes(searchText) ||
        sale.paymentMethod
          ?.toLowerCase()
          .includes(searchText);

      const matchesPayment =
        paymentFilter === "all" ||
        sale.paymentMethod?.toLowerCase() ===
          paymentFilter.toLowerCase();

      return matchesSearch && matchesPayment;
    });
  }, [sales, search, paymentFilter]);

  // DOWNLOAD PDF

  const handleDownloadPDF = async (saleId) => {
    try {
      setDownloadingSaleId(saleId);

      const response = await axios.get(
        `http://localhost:3000/api/sales/${saleId}/invoice`,
        {
          responseType: "blob",
           withCredentials: true,
        }
      );

      const blob = response.data;

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `Sale-Invoice-${saleId}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Invoice download error:",
        error
      );

      alert(
        "Failed to download invoice"
      );
    } finally {
      setDownloadingSaleId(null);
    }
  };

  // PAYMENT STYLE

  const getPaymentStyle = (method) => {
    switch (method?.toLowerCase()) {
      case "cash":
        return {
          wrapper:
            "bg-green-50 text-green-700 border-green-100",
          icon: Banknote,
        };

      case "card":
        return {
          wrapper:
            "bg-blue-50 text-blue-700 border-blue-100",
          icon: CreditCard,
        };

      case "online":
      case "easypaisa":
      case "jazzcash":
        return {
          wrapper:
            "bg-purple-50 text-purple-700 border-purple-100",
          icon: Wallet,
        };

      default:
        return {
          wrapper:
            "bg-gray-50 text-gray-700 border-gray-100",
          icon: Wallet,
        };
    }
  };

  // LOADING

  if (isLoading) {
    return <Loader text="Loading Sales..." />;
  }

  // ERROR

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

  // UI

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

      {/* HEADER */}

      <div className="px-5 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <div>
          <h2 className="font-semibold text-gray-900">
            Sales History
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            All completed transactions
          </p>
        </div>

        <div className="flex items-center gap-2">

          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
            <Receipt size={14} />

            {filteredSales.length}{" "}
            {filteredSales.length === 1
              ? "Sale"
              : "Sales"}
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 border border-gray-200 bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={
                isFetching
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </div>

      </div>

      {/* SEARCH + FILTER */}

      <div className="p-4 border-b bg-gray-50">

        <div className="flex flex-col md:flex-row gap-3">

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
              className="w-full border border-gray-200 bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
            />

          </div>

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

          {(search ||
            paymentFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPaymentFilter("all");
              }}
              className="border border-gray-200 bg-white rounded-lg px-4 py-2.5 text-sm hover:bg-gray-50 transition"
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

      {/* EMPTY STATE */}

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

        <div className="overflow-x-auto">

          <table className="w-full min-w-225">

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

            <tbody>

              {filteredSales.map((sale) => {

                const paymentMethod =
                  sale.paymentMethod || "Unknown";

                const paymentStyle =
                  getPaymentStyle(paymentMethod);

                const PaymentIcon =
                  paymentStyle.icon;

                const isDownloading =
                  downloadingSaleId === sale.id;

                return (

                  <tr
                    key={sale.id}
                    className="border-b last:border-b-0 hover:bg-blue-50/30 transition-colors"
                  >

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

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center text-sm font-semibold text-purple-600">

                          {(
                            sale.customerName || "W"
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

                    <td className="px-5 py-4 whitespace-nowrap">

                      {sale.createdAt ? (
                        <>
                          <p className="text-sm text-gray-700">
                            {new Date(
                              sale.createdAt
                            ).toLocaleDateString(
                              "en-PK",
                              {
                                dateStyle: "medium",
                              }
                            )}
                          </p>

                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(
                              sale.createdAt
                            ).toLocaleTimeString(
                              "en-PK",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
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

                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${paymentStyle.wrapper}`}
                      >

                        <PaymentIcon size={14} />

                        {paymentMethod}

                      </span>

                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">

                      <span className="font-semibold text-green-700">
                        Rs.{" "}
                        {Number(
                          sale.total || 0
                        ).toLocaleString("en-PK")}
                      </span>

                    </td>

                    <td className="px-5 py-4 text-right">

                      <button
                        type="button"
                        onClick={() =>
                          handleDownloadPDF(sale.id)
                        }
                        disabled={
                          downloadingSaleId !== null
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
                            <Download size={15} />
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
  );
};

export default SaleTable;