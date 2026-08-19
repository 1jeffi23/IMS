import { useState } from "react";

import {
  useGetProductBatchesQuery,
  useDeleteProductBatchMutation,
} from "../../services/productBatchApi";

import BatchForm from "./BatchForm";

import {
  Boxes,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Plus,
  Search,
  Pencil,
  Trash2,
  MapPin,
  Package,
} from "lucide-react";

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
    if (!batch.expiryDate) {
      return "ok";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(batch.expiryDate);
    expiry.setHours(0, 0, 0, 0);

    if (expiry < today) {
      return "expired";
    }

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
  // STATUS HELPERS
  // ==========================================

  const getStatusLabel = (status) => {
    if (status === "expired") return "Expired";
    if (status === "expiring") return "Expiring Soon";
    return "OK";
  };

  const getStatusStyle = (status) => {
    if (status === "expired") {
      return "bg-red-50 text-red-700 border-red-100";
    }

    if (status === "expiring") {
      return "bg-orange-50 text-orange-700 border-orange-100";
    }

    return "bg-green-50 text-green-700 border-green-100";
  };

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
  // SEARCH + FILTER
  // ==========================================

  const filteredBatches = batches.filter(
    (batch) => {
      const searchText = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchText ||
        batch.productName
          ?.toLowerCase()
          .includes(searchText) ||
        batch.sku
          ?.toLowerCase()
          .includes(searchText) ||
        batch.batchNumber
          ?.toLowerCase()
          .includes(searchText);

      const status =
        getBatchStatus(batch);

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

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
      <div className="p-2 bg-gray-50 min-h-full">
        <div className="max-w-7xl mx-auto">

          <div className="mb-7">
            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />

            <div className="h-4 w-72 bg-gray-100 rounded mt-2 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white border border-gray-200 rounded-2xl p-5"
              >
                <div className="h-11 w-11 bg-gray-100 rounded-xl animate-pulse" />

                <div className="h-4 w-24 bg-gray-100 rounded mt-5 animate-pulse" />

                <div className="h-7 w-16 bg-gray-200 rounded mt-2 animate-pulse" />

                <div className="h-3 w-28 bg-gray-100 rounded mt-2 animate-pulse" />
              </div>
            ))}
          </div>

          <div className="bg-white border rounded-2xl p-5 mb-5">
            <div className="h-11 bg-gray-100 rounded-lg animate-pulse" />
          </div>

          <div className="bg-white border rounded-2xl overflow-hidden">
            <div className="h-14 bg-gray-100 animate-pulse" />

            <div className="p-5 space-y-4">
              {[1, 2, 3, 4, 5].map(
                (item) => (
                  <div
                    key={item}
                    className="h-12 bg-gray-100 rounded-lg animate-pulse"
                  />
                )
              )}
            </div>
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
      <div className="p-6 bg-gray-50 min-h-full">
        <div className="max-w-7xl mx-auto">

          <div className="bg-white border border-red-200 rounded-2xl p-8 text-center">

            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle
                size={24}
                className="text-red-500"
              />
            </div>

            <h2 className="mt-4 font-semibold text-gray-800">
              Failed to load batches
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {error?.data?.message ||
                "Something went wrong while fetching batches."}
            </p>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="p-6 bg-gray-50 min-h-full">

      <div className="max-w-8xl mx-auto">

        {/* ======================================
            HEADER
        ======================================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <Boxes
                  size={23}
                  className="text-blue-600"
                />
              </div>

              <div>

                <h1 className="text-2xl font-semibold text-gray-900">
                  Product Batches
                </h1>

                <p className="text-sm text-gray-500 mt-0.5">
                  Manage stock batches and expiry dates
                </p>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition shadow-sm"
          >
            <Plus size={18} />
            Add Batch
          </button>

        </div>

        {/* ======================================
            SUMMARY CARDS
        ======================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

          {/* TOTAL */}

          <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition">

            <div className="flex items-start justify-between">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <Boxes
                  size={22}
                  className="text-blue-600"
                />
              </div>

              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                All
              </span>

            </div>

            <p className="text-sm text-gray-500 mt-5">
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

          <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition">

            <div className="flex items-start justify-between">

              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle2
                  size={22}
                  className="text-green-600"
                />
              </div>

              <span className="text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                Healthy
              </span>

            </div>

            <p className="text-sm text-gray-500 mt-5">
              Good Batches
            </p>

            <p className="text-2xl font-semibold text-green-600 mt-1">
              {okCount}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              No expiry concern
            </p>

          </div>

          {/* EXPIRING */}

          <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition">

            <div className="flex items-start justify-between">

              <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                <Clock3
                  size={22}
                  className="text-orange-600"
                />
              </div>

              <span className="text-xs font-medium text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full">
                Attention
              </span>

            </div>

            <p className="text-sm text-gray-500 mt-5">
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

          <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition">

            <div className="flex items-start justify-between">

              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle
                  size={22}
                  className="text-red-600"
                />
              </div>

              <span className="text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                Critical
              </span>

            </div>

            <p className="text-sm text-gray-500 mt-5">
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

        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-5">

          <div className="flex flex-col lg:flex-row gap-3">

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
                placeholder="Search product, SKU or batch number..."
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition"
              />

            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none bg-white focus:border-gray-400 cursor-pointer lg:w-52"
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

            {/* CLEAR */}

            {(search ||
              statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Clear
              </button>
            )}

          </div>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredBatches.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {batches.length}
              </span>{" "}
              batches
            </p>

            {statusFilter !== "all" && (
              <span className="text-xs text-gray-500">
                Filter:{" "}
                <span className="font-medium text-gray-700">
                  {getStatusLabel(
                    statusFilter
                  )}
                </span>
              </span>
            )}

          </div>

        </div>

        {/* ======================================
            TABLE
        ======================================= */}

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-287.5">

              <thead className="bg-gray-50 border-b border-gray-200">

                <tr>

                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Product
                  </th>

                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    SKU
                  </th>

                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Batch
                  </th>

                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Quantity
                  </th>

                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Cost Price
                  </th>

                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Received
                  </th>

                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Expiry
                  </th>

                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>

                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Location
                  </th>

                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredBatches.length === 0 ? (

                  <tr>

                    <td
                      colSpan="10"
                      className="text-center py-16"
                    >

                      <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">

                        <Boxes
                          size={25}
                          className="text-gray-400"
                        />

                      </div>

                      <p className="font-medium text-gray-700 mt-4">
                        No batches found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try changing your search or filter.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filteredBatches.map(
                    (batch) => {

                      const status =
                        getBatchStatus(
                          batch
                        );

                      return (
                        <tr
                          key={batch.id}
                          className={`border-b last:border-b-0 transition ${
                            status ===
                            "expired"
                              ? "bg-red-50/40 hover:bg-red-50"
                              : status ===
                                "expiring"
                              ? "bg-orange-50/20 hover:bg-orange-50/50"
                              : "hover:bg-gray-50"
                          }`}
                        >

                          {/* PRODUCT */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                  status ===
                                  "expired"
                                    ? "bg-red-100 text-red-600"
                                    : status ===
                                      "expiring"
                                    ? "bg-orange-100 text-orange-600"
                                    : "bg-blue-50 text-blue-600"
                                }`}
                              >
                                <Package
                                  size={17}
                                />
                              </div>

                              <div>

                                <p className="font-medium text-gray-900">
                                  {batch.productName}
                                </p>

                                <p className="text-xs text-gray-400 mt-0.5">
                                  Product #{batch.productId}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* SKU */}

                          <td className="px-5 py-4">

                            <span className="text-sm text-gray-600">
                              {batch.sku ||
                                "-"}
                            </span>

                          </td>

                          {/* BATCH */}

                          <td className="px-5 py-4">

                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-mono text-xs">
                              {batch.batchNumber}
                            </span>

                          </td>

                          {/* QUANTITY */}

                          <td className="px-5 py-4">

                            <span className="font-semibold text-gray-800">
                              {batch.quantity}
                            </span>

                          </td>

                          {/* COST */}

                          <td className="px-5 py-4">

                            <span className="text-sm font-medium text-gray-700">
                              Rs.{" "}
                              {Number(
                                batch.costPrice ||
                                  0
                              ).toLocaleString(
                                "en-PK"
                              )}
                            </span>

                          </td>

                          {/* RECEIVED */}

                          <td className="px-5 py-4">

                            <span className="text-sm text-gray-600">
                              {batch.receivedDate ||
                                "-"}
                            </span>

                          </td>

                          {/* EXPIRY */}

                          <td
                            className={`px-5 py-4 text-sm ${
                              status ===
                              "expired"
                                ? "text-red-600 font-semibold"
                                : status ===
                                  "expiring"
                                ? "text-orange-600 font-semibold"
                                : "text-gray-600"
                            }`}
                          >
                            {batch.expiryDate ||
                              "No expiry"}
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium ${getStatusStyle(
                                status
                              )}`}
                            >

                              {status ===
                                "expired" && (
                                <AlertTriangle
                                  size={13}
                                />
                              )}

                              {status ===
                                "expiring" && (
                                <Clock3
                                  size={13}
                                />
                              )}

                              {status ===
                                "ok" && (
                                <CheckCircle2
                                  size={13}
                                />
                              )}

                              {getStatusLabel(
                                status
                              )}

                            </span>

                          </td>

                          {/* LOCATION */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-1.5 text-sm text-gray-600">

                              <MapPin
                                size={14}
                                className="text-gray-400"
                              />

                              {batch.storageLocation ||
                                "-"}

                            </div>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">

                            <div className="flex items-center justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    batch
                                  )
                                }
                                className="inline-flex items-center gap-1.5 border border-gray-200 bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition"
                              >
                                <Pencil
                                  size={14}
                                />
                                Edit
                              </button>

                              <button
                                type="button"
                                disabled={
                                  isDeleting
                                }
                                onClick={() =>
                                  handleDelete(
                                    batch.id
                                  )
                                }
                                className="inline-flex items-center gap-1.5 border border-red-100 bg-white text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2
                                  size={14}
                                />

                                {isDeleting
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )

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

    </div>
  );
};

export default Batches;