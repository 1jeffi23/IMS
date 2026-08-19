import { useState } from "react";

import {
  useGetProductBatchesQuery,
  useDeleteProductBatchMutation,
} from "../../services/productBatchApi";

import BatchForm from "./BatchForm";

const Batches = () => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetProductBatchesQuery();

  const [
    deleteProductBatch,
    { isLoading: isDeleting },
  ] = useDeleteProductBatchMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const batches = data?.batches || [];


  // ==========================================
  // BATCH STATUS
  // ==========================================

  const getBatchStatus = (batch) => {
    // No expiry date = OK
    if (!batch.expiryDate) {
      return "ok";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(batch.expiryDate);
    expiry.setHours(0, 0, 0, 0);

    // Already expired
    if (expiry < today) {
      return "expired";
    }

    // Expiring within 30 days
    const thirtyDaysFromNow = new Date(today);

    thirtyDaysFromNow.setDate(
      today.getDate() + 30
    );

    if (expiry <= thirtyDaysFromNow) {
      return "expiring";
    }

    return "ok";
  };


  // ==========================================
  // STATUS LABEL
  // ==========================================

  const getStatusLabel = (status) => {
    switch (status) {
      case "expired":
        return "Expired";

      case "expiring":
        return "Expiring Soon";

      default:
        return "OK";
    }
  };


  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "expired":
        return "bg-red-100 text-red-700";

      case "expiring":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-green-100 text-green-700";
    }
  };


  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredBatches = batches.filter((batch) => {
    const searchText = search
      .toLowerCase()
      .trim();

    const matchesSearch =
      batch.productName
        ?.toLowerCase()
        .includes(searchText) ||
      batch.sku
        ?.toLowerCase()
        .includes(searchText) ||
      batch.batchNumber
        ?.toLowerCase()
        .includes(searchText);

    const status = getBatchStatus(batch);

    const matchesStatus =
      statusFilter === "all" ||
      status === statusFilter;

    return matchesSearch && matchesStatus;
  });


  // ==========================================
  // SUMMARY COUNTS
  // ==========================================

  const okCount = batches.filter(
    (batch) =>
      getBatchStatus(batch) === "ok"
  ).length;

  const expiringCount = batches.filter(
    (batch) =>
      getBatchStatus(batch) === "expiring"
  ).length;

  const expiredCount = batches.filter(
    (batch) =>
      getBatchStatus(batch) === "expired"
  ).length;


  // ==========================================
  // ADD
  // ==========================================

  const handleAdd = () => {
    setEditingBatch(null);
    setShowForm(true);
  };


  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (batch) => {
    setEditingBatch(batch);
    setShowForm(true);
  };


  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this batch?"
    );

    if (!confirmed) return;

    try {
      await deleteProductBatch(id).unwrap();
    } catch (error) {
      console.error(error);

      alert(
        error?.data?.message ||
          "Failed to delete batch"
      );
    }
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">
          Loading batches...
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
          Failed to load batches:{" "}
          {error?.data?.message ||
            "Something went wrong"}
        </p>
      </div>
    );
  }


  return (
    <div className="p-6 bg-gray-50 min-h-full">


      {/* ======================================
          HEADER
      ======================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-2xl font-semibold text-gray-900">
            Product Batches
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage stock batches and expiry dates
          </p>

        </div>


        <button
          onClick={handleAdd}
          className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          + Add Batch
        </button>

      </div>


      {/* ======================================
          SUMMARY CARDS
      ======================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">


        {/* TOTAL */}

        <div className="bg-white border rounded-xl p-4">

          <p className="text-sm text-gray-500">
            Total Batches
          </p>

          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {batches.length}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            All product batches
          </p>

        </div>


        {/* OK */}

        <div className="bg-white border rounded-xl p-4">

          <p className="text-sm text-gray-500">
            OK
          </p>

          <p className="text-2xl font-semibold text-green-600 mt-1">
            {okCount}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            No expiry concern
          </p>

        </div>


        {/* EXPIRING */}

        <div className="bg-white border rounded-xl p-4">

          <p className="text-sm text-gray-500">
            Expiring Soon
          </p>

          <p className="text-2xl font-semibold text-orange-600 mt-1">
            {expiringCount}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Within 30 days
          </p>

        </div>


        {/* EXPIRED */}

        <div className="bg-white border rounded-xl p-4">

          <p className="text-sm text-gray-500">
            Expired
          </p>

          <p className="text-2xl font-semibold text-red-600 mt-1">
            {expiredCount}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Requires attention
          </p>

        </div>

      </div>


      {/* ======================================
          SEARCH + FILTER
      ======================================= */}

      <div className="bg-white border rounded-xl p-4 mb-5">

        <div className="flex flex-col md:flex-row gap-3">


          {/* SEARCH */}

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search product, SKU or batch number..."
            className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-200"
          />


          {/* STATUS FILTER */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border rounded-lg px-4 py-2.5 text-sm outline-none md:w-52"
          >

            <option value="all">
              All Status
            </option>

            <option value="ok">
              OK
            </option>

            <option value="expiring">
              Expiring Soon
            </option>

            <option value="expired">
              Expired
            </option>

          </select>

        </div>


        {/* RESULT COUNT */}

        <div className="mt-3 text-xs text-gray-500">
          Showing {filteredBatches.length} of{" "}
          {batches.length} batches
        </div>

      </div>


      {/* ======================================
          TABLE
      ======================================= */}

      <div className="bg-white border rounded-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">


            {/* TABLE HEADER */}

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Product
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  SKU
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Batch
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Quantity
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Cost Price
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Received
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Expiry
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Location
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>

              </tr>

            </thead>


            {/* TABLE BODY */}

            <tbody>

              {filteredBatches.length === 0 ? (

                <tr>

                  <td
                    colSpan="10"
                    className="text-center py-12"
                  >

                    <p className="text-gray-500 text-sm">
                      No batches found
                    </p>

                    <p className="text-gray-400 text-xs mt-1">
                      Try changing your search or filter
                    </p>

                  </td>

                </tr>

              ) : (

                filteredBatches.map((batch) => {

                  const status =
                    getBatchStatus(batch);

                  return (

                    <tr
                      key={batch.id}
                      className={`border-b last:border-b-0 hover:bg-gray-50 transition ${
                        status === "expired"
                          ? "bg-red-50/50"
                          : status === "expiring"
                          ? "bg-orange-50/30"
                          : ""
                      }`}
                    >


                      {/* PRODUCT */}

                      <td className="px-4 py-4">

                        <div className="font-medium text-gray-900">
                          {batch.productName}
                        </div>

                      </td>


                      {/* SKU */}

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {batch.sku}
                      </td>


                      {/* BATCH NUMBER */}

                      <td className="px-4 py-4">

                        <span className="font-mono text-sm text-gray-700">
                          {batch.batchNumber}
                        </span>

                      </td>


                      {/* QUANTITY */}

                      <td className="px-4 py-4 text-sm text-gray-700">
                        {batch.quantity}
                      </td>


                      {/* COST PRICE */}

                      <td className="px-4 py-4 text-sm text-gray-700">
                        Rs. {batch.costPrice}
                      </td>


                      {/* RECEIVED DATE */}

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {batch.receivedDate}
                      </td>


                      {/* EXPIRY DATE */}

                      <td
                        className={`px-4 py-4 text-sm ${
                          status === "expired"
                            ? "text-red-600 font-semibold"
                            : status === "expiring"
                            ? "text-orange-600 font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {batch.expiryDate || "-"}
                      </td>


                      {/* STATUS */}

                      <td className="px-4 py-4">

                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                            status
                          )}`}
                        >

                          <span className="mr-1.5">
                            ●
                          </span>

                          {getStatusLabel(status)}

                        </span>

                      </td>


                      {/* LOCATION */}

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {batch.storageLocation || "-"}
                      </td>


                      {/* ACTIONS */}

                      <td className="px-4 py-4">

                        <div className="flex items-center gap-2">

                          <button
                            onClick={() =>
                              handleEdit(batch)
                            }
                            className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100 transition"
                          >
                            Edit
                          </button>

                          <button
                            disabled={isDeleting}
                            onClick={() =>
                              handleDelete(batch.id)
                            }
                            className="border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-sm hover:bg-red-50 transition disabled:opacity-50"
                          >
                            {isDeleting
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  );
                })

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ======================================
          BATCH FORM
      ======================================= */}

      {showForm && (

        <BatchForm
          batch={editingBatch}
          onClose={() => {
            setShowForm(false);
            setEditingBatch(null);
          }}
        />

      )}

    </div>
  );
};

export default Batches;