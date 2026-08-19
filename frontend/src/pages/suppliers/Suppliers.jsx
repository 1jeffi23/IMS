import { useMemo, useState } from "react";
import {
  useGetSuppliersQuery,
} from "../../services/supplierApi";

import SupplierForm from "./SupplierForm";

import {
  Users,
  UserCheck,
  UserX,
  Search,
  Plus,
  X,
  Pencil,
  Mail,
  Phone,
  MapPin,
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

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
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
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const hasFilters =
    search || statusFilter !== "all";

  // ==========================================
  // LOADING
  // ==========================================

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

  // ==========================================
  // ERROR
  // ==========================================

  if (isError) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-full">
        <div className="max-w-7xl mx-auto">
          <div className="border border-red-200 bg-red-50 rounded-2xl p-5 text-red-600">
            <p className="font-medium">
              Failed to load suppliers
            </p>

            <p className="text-sm mt-1">
              {error?.data?.message ||
                "Something went wrong"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-full">

      <div className="max-w-8xl mx-auto space-y-6">

        {/* ======================================
            HEADER
        ======================================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
                <Users
                  size={23}
                  className="text-purple-600"
                />
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
          </div>

          <button
            onClick={handleAdd}
            className="
              inline-flex items-center justify-center gap-2
              bg-purple-600 text-white
              px-5 py-2.5 rounded-xl
              text-sm font-medium
              hover:bg-purple-700
              active:scale-[0.98]
              shadow-sm shadow-purple-200
              transition
            "
          >
            <Plus size={18} />
            Add Supplier
          </button>

        </div>


        {/* ======================================
            SUMMARY CARDS
        ======================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* TOTAL */}

          <div className="
            bg-white border border-gray-200
            rounded-2xl p-5
            hover:shadow-md hover:-translate-y-0.5
            transition-all
          ">

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
                <Users
                  size={21}
                  className="text-purple-600"
                />
              </div>

            </div>

          </div>


          {/* ACTIVE */}

          <div className="
            bg-white border border-gray-200
            rounded-2xl p-5
            hover:shadow-md hover:-translate-y-0.5
            transition-all
          ">

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
                <UserCheck
                  size={21}
                  className="text-green-600"
                />
              </div>

            </div>

          </div>


          {/* INACTIVE */}

          <div className="
            bg-white border border-gray-200
            rounded-2xl p-5
            hover:shadow-md hover:-translate-y-0.5
            transition-all
          ">

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
                <UserX
                  size={21}
                  className="text-gray-500"
                />
              </div>

            </div>

          </div>

        </div>


        {/* ======================================
            SEARCH + FILTER
        ======================================= */}

        <div className="
          bg-white border border-gray-200
          rounded-2xl p-4
        ">

          <div className="flex flex-col md:flex-row gap-3">

            {/* SEARCH */}

            <div className="relative flex-1">

              <Search
                size={18}
                className="
                  absolute left-3.5 top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Search by name, phone, email or address..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="
                  w-full
                  border border-gray-200
                  rounded-xl
                  pl-10 pr-4 py-2.5
                  text-sm
                  outline-none
                  focus:border-purple-400
                  focus:ring-2 focus:ring-purple-100
                  transition
                "
              />

            </div>


            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="
                border border-gray-200
                rounded-xl
                px-4 py-2.5
                text-sm
                outline-none
                bg-white
                focus:border-purple-400
                focus:ring-2 focus:ring-purple-100
                md:w-48
              "
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


            {/* CLEAR */}

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="
                  inline-flex items-center
                  justify-center gap-2
                  border border-gray-200
                  rounded-xl
                  px-4 py-2.5
                  text-sm text-gray-600
                  hover:bg-gray-50
                  transition
                "
              >
                <X size={16} />
                Clear
              </button>
            )}

          </div>


          {/* RESULT */}

          <div className="mt-3 flex items-center justify-between">

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


        {/* ======================================
            TABLE
        ======================================= */}

        <div className="
          bg-white
          border border-gray-200
          rounded-2xl
          overflow-hidden
          shadow-sm
        ">

          <div className="overflow-x-auto">

            <table className="w-full min-w-225">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Supplier
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Phone
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Email
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Address
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>

                  <th className="text-right px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredSuppliers.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="py-16 text-center"
                    >

                      <div className="
                        w-14 h-14 mx-auto
                        rounded-2xl
                        bg-purple-50
                        flex items-center justify-center
                      ">
                        <Users
                          size={25}
                          className="text-purple-400"
                        />
                      </div>

                      <p className="font-medium text-gray-700 mt-4">
                        No suppliers found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        {hasFilters
                          ? "Try changing your search or filters."
                          : "Add your first supplier to get started."}
                      </p>

                      {hasFilters && (
                        <button
                          onClick={clearFilters}
                          className="
                            mt-4
                            text-sm font-medium
                            text-purple-600
                            hover:text-purple-700
                          "
                        >
                          Clear filters
                        </button>
                      )}

                    </td>

                  </tr>

                ) : (

                  filteredSuppliers.map((supplier) => {

                    const initial =
                      supplier.name
                        ?.charAt(0)
                        ?.toUpperCase() || "S";

                    return (

                      <tr
                        key={supplier.id}
                        className="
                          border-b last:border-b-0
                          hover:bg-purple-50/30
                          transition
                        "
                      >

                        {/* SUPPLIER */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="
                              w-10 h-10
                              rounded-xl
                              bg-purple-100
                              text-purple-700
                              flex items-center justify-center
                              font-semibold
                              shrink-0
                            ">
                              {initial}
                            </div>

                            <div>

                              <p className="font-medium text-gray-900">
                                {supplier.name}
                              </p>

                              <p className="text-xs text-gray-400 mt-0.5">
                                Supplier #{supplier.id}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* PHONE */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2 text-sm text-gray-600">

                            <Phone
                              size={15}
                              className="text-gray-400"
                            />

                            {supplier.phone || "-"}

                          </div>

                        </td>


                        {/* EMAIL */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2 text-sm text-gray-600">

                            <Mail
                              size={15}
                              className="text-gray-400"
                            />

                            <span className="max-w-55 truncate">
                              {supplier.email || "-"}
                            </span>

                          </div>

                        </td>


                        {/* ADDRESS */}

                        <td className="px-5 py-4">

                          <div className="flex items-start gap-2 text-sm text-gray-600 max-w-xs">

                            <MapPin
                              size={15}
                              className="text-gray-400 mt-0.5 shrink-0"
                            />

                            <span className="line-clamp-2">
                              {supplier.address || "-"}
                            </span>

                          </div>

                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-4">

                          {supplier.isActive ? (

                            <span className="
                              inline-flex items-center gap-2
                              px-2.5 py-1.5
                              rounded-full
                              text-xs font-medium
                              bg-green-50
                              text-green-700
                              border border-green-100
                            ">

                              <span className="
                                w-1.5 h-1.5
                                rounded-full
                                bg-green-500
                              " />

                              Active

                            </span>

                          ) : (

                            <span className="
                              inline-flex items-center gap-2
                              px-2.5 py-1.5
                              rounded-full
                              text-xs font-medium
                              bg-gray-100
                              text-gray-600
                              border border-gray-200
                            ">

                              <span className="
                                w-1.5 h-1.5
                                rounded-full
                                bg-gray-400
                              " />

                              Inactive

                            </span>

                          )}

                        </td>


                        {/* ACTIONS */}

                        <td className="px-5 py-4 text-right">

                          <button
                            onClick={() =>
                              handleEdit(supplier)
                            }
                            className="
                              inline-flex items-center gap-2
                              border border-gray-200
                              bg-white
                              px-3 py-1.5
                              rounded-lg
                              text-sm
                              text-gray-600
                              hover:border-purple-200
                              hover:bg-purple-50
                              hover:text-purple-700
                              transition
                            "
                          >

                            <Pencil size={15} />

                            Edit

                          </button>

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
            FORM
        ======================================= */}

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

    </div>
  );
};

export default Suppliers;