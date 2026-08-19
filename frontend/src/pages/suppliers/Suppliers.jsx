import { useState } from "react";

import {
  useGetSuppliersQuery,
} from "../../services/supplierApi";

import SupplierForm from "./SupplierForm";

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

  // ==========================================
  // ADD
  // ==========================================

  const handleAdd = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      supplier.name
        ?.toLowerCase()
        .includes(searchText) ||
      supplier.phone
        ?.toLowerCase()
        .includes(searchText) ||
      supplier.email
        ?.toLowerCase()
        .includes(searchText) ||
      supplier.address
        ?.toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && supplier.isActive) ||
      (statusFilter === "inactive" && !supplier.isActive);

    return matchesSearch && matchesStatus;
  });

  // ==========================================
  // SUMMARY
  // ==========================================

  const totalSuppliers = suppliers.length;

  const activeSuppliers = suppliers.filter(
    (supplier) => supplier.isActive
  ).length;

  const inactiveSuppliers = suppliers.filter(
    (supplier) => !supplier.isActive
  ).length;

  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">
          Loading suppliers...
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
          Failed to load suppliers:{" "}
          {error?.data?.message ||
            "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-semibold">
            Suppliers
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your suppliers and supplier information
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          + Add Supplier
        </button>

      </div>


      {/* ==========================================
          SUMMARY CARDS
      ========================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        {/* TOTAL */}

        <div className="border rounded-xl p-5 bg-white">

          <p className="text-sm text-gray-500">
            Total Suppliers
          </p>

          <p className="text-2xl font-semibold mt-2">
            {totalSuppliers}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            All registered suppliers
          </p>

        </div>


        {/* ACTIVE */}

        <div className="border rounded-xl p-5 bg-white">

          <p className="text-sm text-gray-500">
            Active Suppliers
          </p>

          <p className="text-2xl font-semibold text-green-600 mt-2">
            {activeSuppliers}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Currently available suppliers
          </p>

        </div>


        {/* INACTIVE */}

        <div className="border rounded-xl p-5 bg-white">

          <p className="text-sm text-gray-500">
            Inactive Suppliers
          </p>

          <p className="text-2xl font-semibold text-gray-500 mt-2">
            {inactiveSuppliers}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Currently inactive suppliers
          </p>

        </div>

      </div>


      {/* ==========================================
          SEARCH + FILTER
      ========================================== */}

      <div className="flex flex-col md:flex-row gap-3 mb-5">

        <div className="flex-1">

          <input
            type="text"
            placeholder="Search by name, phone, email or address..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-200"
          />

        </div>


        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="border rounded-lg px-3 py-2.5 md:w-48 outline-none"
        >

          <option value="all">
            All Status
          </option>

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>

        </select>

      </div>


      {/* ==========================================
          RESULT COUNT
      ========================================== */}

      <div className="flex justify-between items-center mb-3">

        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-700">
            {filteredSuppliers.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-700">
            {suppliers.length}
          </span>{" "}
          suppliers
        </p>

      </div>


      {/* ==========================================
          TABLE
      ========================================== */}

      <div className="border rounded-xl overflow-hidden bg-white">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Supplier
                </th>

                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Phone
                </th>

                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Email
                </th>

                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Address
                </th>

                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Status
                </th>

                <th className="text-right p-4 text-sm font-medium text-gray-600">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredSuppliers.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center p-10"
                  >

                    <p className="text-gray-500">
                      No suppliers found
                    </p>

                    {search || statusFilter !== "all" ? (
                      <p className="text-sm text-gray-400 mt-1">
                        Try changing your search or filter
                      </p>
                    ) : null}

                  </td>

                </tr>

              ) : (

                filteredSuppliers.map((supplier) => (

                  <tr
                    key={supplier.id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    {/* SUPPLIER */}

                    <td className="p-4">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-medium">
                          {supplier.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <div>

                          <p className="font-medium">
                            {supplier.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            Supplier #{supplier.id}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* PHONE */}

                    <td className="p-4 text-gray-600">
                      {supplier.phone || "-"}
                    </td>


                    {/* EMAIL */}

                    <td className="p-4 text-gray-600">
                      {supplier.email || "-"}
                    </td>


                    {/* ADDRESS */}

                    <td className="p-4 text-gray-600 max-w-xs">
                      <span className="line-clamp-2">
                        {supplier.address || "-"}
                      </span>
                    </td>


                    {/* STATUS */}

                    <td className="p-4">

                      {supplier.isActive ? (

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">

                          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />

                          Active

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">

                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />

                          Inactive

                        </span>

                      )}

                    </td>


                    {/* ACTIONS */}

                    <td className="p-4 text-right">

                      <button
                        onClick={() =>
                          handleEdit(supplier)
                        }
                        className="border px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100 transition"
                      >
                        Edit
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ==========================================
          FORM
      ========================================== */}

      {showForm && (

        <SupplierForm
          supplier={editingSupplier}
          onClose={() => {
            setShowForm(false);
            setEditingSupplier(null);
          }}
        />

      )}

    </div>
  );
};

export default Suppliers;