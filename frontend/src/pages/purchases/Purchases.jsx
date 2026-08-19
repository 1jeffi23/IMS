import { useState } from "react";

import {
  useGetPurchasesQuery,
} from "../../services/purchaseApi";

import PurchaseForm from "./PurchaseForm";
import PurchaseDetails from "./PurchaseDetails";


const Purchases = () => {

  const [viewingPurchase, setViewingPurchase] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);


  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetPurchasesQuery();


  const purchases =
    data?.purchases || [];


  const [search, setSearch] =
    useState("");


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredPurchases =
    purchases.filter((purchase) => {

      const searchText =
        search.toLowerCase().trim();

      return (
        purchase.invoiceNumber
          ?.toLowerCase()
          .includes(searchText) ||

        purchase.supplierName
          ?.toLowerCase()
          .includes(searchText)
      );

    });


  // ==========================================
  // SUMMARY
  // ==========================================

  const totalPurchases =
    purchases.length;


  const totalAmount =
    purchases.reduce(
      (total, purchase) =>
        total +
        Number(purchase.totalAmount || 0),
      0
    );


  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {

    return (
      <div className="p-6">

        <p className="text-gray-500">
          Loading purchases...
        </p>

      </div>
    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (isError) {

    return (
      <div className="p-6">

        <p className="text-red-600">
          Failed to load purchases:{" "}
          {error?.data?.message ||
            "Something went wrong"}
        </p>

      </div>
    );

  }


  // ==========================================
  // VIEW DETAILS
  // ==========================================

  if (viewingPurchase) {

    return (
      <PurchaseDetails
        purchaseId={viewingPurchase}
        onBack={() =>
          setViewingPurchase(null)
        }
      />
    );

  }


  return (

    <div className="p-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-2xl font-semibold">
            Purchases
          </h1>

          <p className="text-gray-500 mt-1">
            Manage purchases and incoming stock
          </p>

        </div>


        <button
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition"
        >
          + New Purchase
        </button>

      </div>


      {/* ======================================
          SUMMARY
      ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        <div className="border rounded-xl p-5 bg-white">

          <p className="text-sm text-gray-500">
            Total Purchases
          </p>

          <p className="text-2xl font-semibold mt-2">
            {totalPurchases}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            All recorded purchases
          </p>

        </div>


        <div className="border rounded-xl p-5 bg-white">

          <p className="text-sm text-gray-500">
            Total Purchase Value
          </p>

          <p className="text-2xl font-semibold mt-2">
            Rs.{" "}
            {totalAmount.toLocaleString("en-PK")}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Total value of purchased stock
          </p>

        </div>

      </div>


      {/* ======================================
          SEARCH
      ====================================== */}

      <div className="mb-5">

        <input
          type="text"
          placeholder="Search by invoice number or supplier..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-200"
        />

      </div>


      {/* ======================================
          RESULT COUNT
      ====================================== */}

      <p className="text-sm text-gray-500 mb-3">

        Showing{" "}

        <span className="font-medium text-gray-700">
          {filteredPurchases.length}
        </span>{" "}

        of{" "}

        <span className="font-medium text-gray-700">
          {purchases.length}
        </span>{" "}

        purchases

      </p>


      {/* ======================================
          TABLE
      ====================================== */}

      <div className="border rounded-xl overflow-hidden bg-white">

        <div className="overflow-x-auto">

          <table className="w-full min-w-200">

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Invoice
                </th>

                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Supplier
                </th>

                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Purchase Date
                </th>

                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Total Amount
                </th>

                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Created
                </th>

                <th className="text-right p-4 text-sm font-medium text-gray-600">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredPurchases.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center p-10"
                  >

                    <p className="text-gray-500">
                      No purchases found
                    </p>

                    {search && (
                      <p className="text-sm text-gray-400 mt-1">
                        Try changing your search
                      </p>
                    )}

                  </td>

                </tr>

              ) : (

                filteredPurchases.map(
                  (purchase) => (

                    <tr
                      key={purchase.id}
                      className="border-t hover:bg-gray-50 transition"
                    >

                      {/* INVOICE */}

                      <td className="p-4">

                        <p className="font-medium">
                          {purchase.invoiceNumber}
                        </p>

                        <p className="text-xs text-gray-400">
                          Purchase #{purchase.id}
                        </p>

                      </td>


                      {/* SUPPLIER */}

                      <td className="p-4">

                        <p className="font-medium">
                          {purchase.supplierName || "-"}
                        </p>

                      </td>


                      {/* DATE */}

                      <td className="p-4 text-gray-600">
                        {purchase.purchaseDate}
                      </td>


                      {/* TOTAL */}

                      <td className="p-4">

                        <span className="font-medium">
                          Rs.{" "}
                          {Number(
                            purchase.totalAmount || 0
                          ).toLocaleString("en-PK")}
                        </span>

                      </td>


                      {/* CREATED */}

                      <td className="p-4 text-gray-500">

                        {purchase.createdAt
                          ? new Date(
                              purchase.createdAt
                            ).toLocaleDateString(
                              "en-PK"
                            )
                          : "-"}

                      </td>


                      {/* ACTION */}

                      <td className="p-4 text-right">

                        <button
                          onClick={() =>
                            setViewingPurchase(
                              purchase.id
                            )
                          }
                          className="border px-3 py-1.5 rounded-lg hover:bg-gray-100"
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ======================================
          PURCHASE FORM
      ====================================== */}

      {showForm && (

        <PurchaseForm
          onClose={() =>
            setShowForm(false)
          }
        />

      )}

    </div>

  );
};


export default Purchases;