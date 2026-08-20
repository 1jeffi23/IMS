import { useMemo, useState } from "react";
import { useGetSuppliersQuery } from "../../services/supplierApi";
import SupplierForm from "./SupplierForm";
import SupplierTable from "./SupplierTable";

import {
  Users,
  UserCheck,
  UserX,
  Search,
  Plus,
  X,
} from "lucide-react";

const Suppliers = () => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetSuppliersQuery();

  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const suppliers = data?.suppliers || [];

  // Form handlers
  const handleAdd = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingSupplier(null);
  };

  // Filters
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        supplier.name?.toLowerCase().includes(searchText) ||
        supplier.phone?.toLowerCase().includes(searchText) ||
        supplier.email?.toLowerCase().includes(searchText) ||
        supplier.address?.toLowerCase().includes(searchText);

      let matchesStatus = true;

      if (statusFilter === "active") {
        matchesStatus = supplier.isActive === true;
      }

      if (statusFilter === "inactive") {
        matchesStatus = supplier.isActive === false;
      }

      return matchesSearch && matchesStatus;
    });
  }, [suppliers, search, statusFilter]);

  // Summary
  const totalSuppliers = suppliers.length;

  const activeSuppliers = suppliers.filter(
    (supplier) => supplier.isActive
  ).length;

  const inactiveSuppliers = suppliers.filter(
    (supplier) => !supplier.isActive
  ).length;

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const hasFilters =
    search || statusFilter !== "all";

  // Loading
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-full">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-gray-100 rounded mt-2 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white border rounded-2xl p-5"
              >
                <div className="h-10 w-10 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-4 w-28 bg-gray-100 rounded mt-5 animate-pulse" />
                <div className="h-7 w-16 bg-gray-200 rounded mt-2 animate-pulse" />
              </div>
            ))}
          </div>

          <div className="bg-white border rounded-2xl h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-full">
        <div className="max-w-7xl mx-auto">
          <div className="border border-red-200 bg-red-50 rounded-2xl p-5 text-red-600">
            <p className="font-medium">
              Failed to load suppliers
            </p>

            <p className="text-sm mt-1">
              {error?.data?.message || "Something went wrong"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-full">
      <div className="max-w-8xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
              <Users size={23} className="text-purple-600" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Suppliers
              </h1>

              <p className="text-sm text-gray-500 mt-0.5">
                Manage your supplier information
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 active:scale-[0.98] shadow-sm shadow-purple-200 transition"
          >
            <Plus size={18} />
            Add Supplier
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Suppliers
                </p>

                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  {totalSuppliers}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  All registered suppliers
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
                <Users size={21} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Active Suppliers
                </p>

                <p className="text-3xl font-semibold text-green-600 mt-2">
                  {activeSuppliers}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Currently available
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                <UserCheck size={21} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Inactive Suppliers
                </p>

                <p className="text-3xl font-semibold text-gray-500 mt-2">
                  {inactiveSuppliers}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Currently inactive
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                <UserX size={21} className="text-gray-500" />
              </div>
            </div>
          </div>

        </div>

        {/* Search and filters */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex flex-col md:flex-row gap-3">

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search by name, phone, email or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 md:w-48"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                <X size={16} />
                Clear
              </button>
            )}
          </div>

          <div className="mt-3">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredSuppliers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {suppliers.length}
              </span>{" "}
              suppliers
            </p>
          </div>
        </div>

        {/* Table */}
        <SupplierTable
          suppliers={filteredSuppliers}
          hasFilters={hasFilters}
          onEdit={handleEdit}
          onClearFilters={clearFilters}
        />

        {/* Form */}
        {showForm && (
          <SupplierForm
            supplier={editingSupplier}
            onClose={closeForm}
          />
        )}

      </div>
    </div>
  );
};

export default Suppliers;