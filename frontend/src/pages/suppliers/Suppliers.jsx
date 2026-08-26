import { useMemo, useState, useEffect } from "react";

import {
  Mail,
  Phone,
  Plus,
  RefreshCcw,
  Search,
  Users,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

import { useGetSuppliersQuery } from "../../services/supplierApi";

import SupplierForm from "./SupplierForm";
import SupplierTable from "./SupplierTable";

import Loader from "../loader/Loader";
import ErrorState from "../loader/ErrorState";

import usePagination from "../../components/customHooks/usePagination";
import Pagination from "../../components/customHooks/Pagination";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";


const SUPPLIERS_PER_PAGE = 7;


const Suppliers = () => {

  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");


  // =====================================================
  // GET SUPPLIERS
  // =====================================================

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetSuppliersQuery();


  const suppliers = data?.suppliers || [];


  // =====================================================
  // FORM HANDLERS
  // =====================================================

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


  // =====================================================
  // FILTER SUPPLIERS
  // =====================================================

  const filteredSuppliers = useMemo(() => {

    const searchText =
      search.toLowerCase().trim();


    return suppliers.filter((supplier) => {

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


      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          supplier.isActive === true) ||
        (statusFilter === "inactive" &&
          supplier.isActive === false);


      return (
        matchesSearch &&
        matchesStatus
      );

    });

  }, [
    suppliers,
    search,
    statusFilter,
  ]);


  // =====================================================
  // PAGINATION
  // =====================================================

  const {
    currentpage,
    totalPages,
    currentData: currentSuppliers,
    nextPage,
    prevPage,
    gotoPage,
  } = usePagination(
    filteredSuppliers,
    SUPPLIERS_PER_PAGE
  );


  // =====================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =====================================================

  useEffect(() => {

    gotoPage(1);

  }, [search, statusFilter]);


  // =====================================================
  // SUMMARY
  // =====================================================

  const {
    totalSuppliers,
    activeSuppliers,
    inactiveSuppliers,
  } = useMemo(() => {

    const total = suppliers.length;

    const active =
      suppliers.filter(
        (supplier) =>
          supplier.isActive === true
      ).length;

    return {
      totalSuppliers: total,
      activeSuppliers: active,
      inactiveSuppliers:
        total - active,
    };

  }, [suppliers]);


  // =====================================================
  // FILTER HANDLERS
  // =====================================================

  const handleSearch = (value) => {

    setSearch(value);
    gotoPage(1);

  };


  const handleStatusChange = (value) => {

    setStatusFilter(value);
    gotoPage(1);

  };


  const clearFilters = () => {

    setSearch("");
    setStatusFilter("all");
    gotoPage(1);

  };


  const hasFilters =
    Boolean(search) ||
    statusFilter !== "all";


  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {

    return (
      <Loader text="Loading Suppliers..." />
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {

    return (
      <ErrorState
        title="Failed to load suppliers"
        message={
          error?.data?.message ||
          "Something went wrong while fetching suppliers."
        }
      />
    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="space-y-6 p-4 md:p-6">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">

              <Users className="h-6 w-6" />

            </div>


            <div>

              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Suppliers
              </h1>

              <p className="text-sm text-muted-foreground">
                Manage your supplier information
              </p>

            </div>

          </div>

        </div>


        <div className="flex items-center gap-2">

          {/* REFRESH */}

          <Button
            variant="outline"
            size="icon"
            onClick={refetch}
            disabled={isFetching}
            title="Refresh"
          >

            <RefreshCcw
              className={`h-4 w-4 ${
                isFetching
                  ? "animate-spin"
                  : ""
              }`}
            />

          </Button>


          {/* ADD SUPPLIER */}

          <Button
            onClick={handleAdd}
            className="gap-2"
          >

            <Plus className="h-4 w-4" />

            <span>
              Add Supplier
            </span>

          </Button>

        </div>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">


        {/* TOTAL SUPPLIERS */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Total Suppliers
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight">
                  {totalSuppliers.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  All registered suppliers
                </p>

              </div>


              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">

                <Users className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>


        {/* ACTIVE SUPPLIERS */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Active Suppliers
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">
                  {activeSuppliers.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Currently available
                </p>

              </div>


              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">

                <UserCheck className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>


        {/* INACTIVE SUPPLIERS */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Inactive Suppliers
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-muted-foreground">
                  {inactiveSuppliers.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Currently inactive
                </p>

              </div>


              <div className="rounded-xl bg-muted p-2.5 text-muted-foreground">

                <UserX className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>

      </div>


      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <Card className="border-0 shadow-sm">

        <CardContent className="p-4">

          <div className="flex flex-col gap-3 md:flex-row">


            {/* SEARCH */}

            <div className="relative flex-1">

              <Search
                className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  handleSearch(e.target.value)
                }
                placeholder="Search by name, phone, email or address..."
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  border-input
                  bg-background
                  pl-9
                  pr-3
                  text-sm
                  outline-none
                  transition
                  placeholder:text-muted-foreground
                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-500/20
                "
              />

            </div>


            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value
                )
              }
              className="
                h-10
                w-full
                rounded-lg
                border
                border-input
                bg-background
                px-3
                text-sm
                outline-none
                transition
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-500/20
                md:w-44
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

              <Button
                variant="outline"
                onClick={clearFilters}
                className="
                  h-10
                  w-full
                  gap-2
                  sm:w-auto
                "
              >

                <X className="h-4 w-4" />

                Clear

              </Button>

            )}

          </div>


          {/* RESULT INFO */}

          <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-muted-foreground">

              Showing{" "}

              <span className="font-medium text-foreground">

                {filteredSuppliers.length === 0
                  ? 0
                  : (currentpage - 1) *
                      SUPPLIERS_PER_PAGE +
                    1}

              </span>

              {" "}–{" "}

              <span className="font-medium text-foreground">

                {Math.min(
                  currentpage *
                    SUPPLIERS_PER_PAGE,
                  filteredSuppliers.length
                )}

              </span>

              {" "}of{" "}

              <span className="font-medium text-foreground">

                {filteredSuppliers.length}

              </span>

              {" "}suppliers

            </p>


            {hasFilters && (

              <p className="text-xs text-muted-foreground">
                Filtered results
              </p>

            )}

          </div>

        </CardContent>

      </Card>


      {/* =================================================
          SUPPLIER TABLE
      ================================================= */}

      <SupplierTable
        suppliers={currentSuppliers}
        hasFilters={hasFilters}
        onEdit={handleEdit}
        onClearFilters={clearFilters}
      />


      {/* =================================================
          PAGINATION
      ================================================= */}

      <Pagination
        currentpage={currentpage}
        totalPages={totalPages}
        nextPage={nextPage}
        prevPage={prevPage}
        gotoPage={gotoPage}
      />


      {/* =================================================
          SUPPLIER FORM
      ================================================= */}

      {showForm && (

        <SupplierForm
          supplier={editingSupplier}
          onClose={closeForm}
        />

      )}

    </div>

  );

};


export default Suppliers;