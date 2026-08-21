import { useState } from "react";

import {
  useGetPurchasesQuery,
} from "../../services/purchaseApi";

import PurchaseForm from "./PurchaseForm";
import PurchaseTable from "./PurchaseInvoiceButton";

import ErrorState from "../loader/ErrorState";
import Loader from "../loader/Loader";


const Purchases = () => {

  const [showForm, setShowForm] =
    useState(false);

  const [search, setSearch] =
    useState("");


  // GET PURCHASES

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetPurchasesQuery();


  const purchases =
    data?.purchases || [];


  // FILTER PURCHASES

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


  // SUMMARY

  const totalPurchases =
    purchases.length;


  const totalAmount =
    purchases.reduce(
      (total, purchase) =>
        total +
        Number(purchase.totalAmount || 0),
      0
    );


  // LOADING

  if (isLoading) {

    return (
      <Loader text="Loading Purchases..." />
    );

  }


  // ERROR

  if (isError) {

    return (
      <ErrorState
        title="Failed to load purchases"
        message={
          error?.data?.message ||
          "Something went wrong while fetching purchases."
        }
      />
    );

  }


  return (

    <div className="p-6">


      {/* HEADER */}

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


      {/* SUMMARY */}

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


      {/* SEARCH */}

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


      {/* RESULT COUNT */}

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


      {/* PURCHASE TABLE */}

      <PurchaseTable
        purchases={filteredPurchases}
        refetch={refetch}
        isFetching={isFetching}
      />


      {/* PURCHASE FORM */}

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