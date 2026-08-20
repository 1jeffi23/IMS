import { useState } from "react";
import {
  useGetProductBatchesQuery,
  useDeleteProductBatchMutation,
} from "../../services/productBatchApi";
import BatchForm from "./BatchForm";
import BatchTable from "./BatchTable";
import {
  Boxes,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Plus,
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

  // Get batch status
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
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    if (expiry <= thirtyDaysFromNow) {
      return "expiring";
    }

    return "ok";
  };

  // Status counts
  const okCount = batches.filter(
    (batch) => getBatchStatus(batch) === "ok"
  ).length;

  const expiringCount = batches.filter(
    (batch) => getBatchStatus(batch) === "expiring"
  ).length;

  const expiredCount = batches.filter(
    (batch) => getBatchStatus(batch) === "expired"
  ).length;

  // Filter batches
  const filteredBatches = batches.filter((batch) => {
    const searchText = search.toLowerCase().trim();

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

    const status = getBatchStatus(batch);

    const matchesStatus =
      statusFilter === "all" ||
      status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Add batch
  const handleAdd = () => {
    setEditingBatch(null);
    setShowForm(true);
  };

  // Edit batch
  const handleEdit = (batch) => {
    setEditingBatch(batch);
    setShowForm(true);
  };

  // Delete batch
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

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-full">
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
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-12 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
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

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
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

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition shadow-sm"
          >
            <Plus size={18} />
            Add Batch
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
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

        <BatchTable
          batches={batches}
          filteredBatches={filteredBatches}
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          getBatchStatus={getBatchStatus}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          isDeleting={isDeleting}
        />

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