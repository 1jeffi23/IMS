import { useMemo, useState, useEffect } from "react";

import {
  Boxes,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Plus,
  RefreshCcw,
} from "lucide-react";

import {
  useGetProductBatchesQuery,
  useDeleteProductBatchMutation,
} from "../../services/productBatchApi";

import BatchForm from "./BatchForm";
import BatchTable from "./BatchTable";

import Loader from "../loader/Loader";
import ErrorState from "../loader/ErrorState";

import usePagination from "../../components/customHooks/usePagination";
import Pagination from "../../components/customHooks/Pagination";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


const BATCHES_PER_PAGE = 7;


const Batches = () => {

  // =====================================================
  // DATA
  // =====================================================

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetProductBatchesQuery();

  const [
    deleteProductBatch,
    { isLoading: isDeleting },
  ] = useDeleteProductBatchMutation();


  // =====================================================
  // STATE
  // =====================================================

  const [showForm, setShowForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [deletingBatchId, setDeletingBatchId] =
    useState(null);


  // =====================================================
  // DATA
  // =====================================================

  const batches = data?.batches || [];


  // =====================================================
  // BATCH STATUS
  // =====================================================

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


  // =====================================================
  // SUMMARY
  // =====================================================

  const {
    totalBatches,
    okCount,
    expiringCount,
    expiredCount,
  } = useMemo(() => {

    let ok = 0;
    let expiring = 0;
    let expired = 0;

    batches.forEach((batch) => {

      const status = getBatchStatus(batch);

      if (status === "ok") {
        ok++;
      }

      if (status === "expiring") {
        expiring++;
      }

      if (status === "expired") {
        expired++;
      }

    });

    return {
      totalBatches: batches.length,
      okCount: ok,
      expiringCount: expiring,
      expiredCount: expired,
    };

  }, [batches]);


  // =====================================================
  // FILTER
  // =====================================================

  const filteredBatches = useMemo(() => {

    const searchText = search
      .toLowerCase()
      .trim();

    return batches.filter((batch) => {

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

      return (
        matchesSearch &&
        matchesStatus
      );

    });

  }, [batches, search, statusFilter]);


  // =====================================================
  // PAGINATION
  // =====================================================

  const {
    currentpage,
    totalPages,
    currentData: currentBatches,
    nextPage,
    prevPage,
    gotoPage,
  } = usePagination(
    filteredBatches,
    BATCHES_PER_PAGE
  );


  // =====================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =====================================================

  useEffect(() => {

    gotoPage(1);

  }, [search, statusFilter]);


  // =====================================================
  // HANDLERS
  // =====================================================

  const handleAdd = () => {

    setEditingBatch(null);
    setShowForm(true);

  };


  const handleEdit = (batch) => {

    setEditingBatch(batch);
    setShowForm(true);

  };


  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this batch?"
    );

    if (!confirmed) {
      return;
    }

    try {

      setDeletingBatchId(id);

      await deleteProductBatch(id).unwrap();

    } catch (error) {

      console.error(
        "Failed to delete batch:",
        error
      );

      alert(
        error?.data?.message ||
        "Failed to delete batch"
      );

    } finally {

      setDeletingBatchId(null);

    }

  };


  const closeForm = () => {

    setShowForm(false);
    setEditingBatch(null);

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {

    return (
      <Loader text="Loading Batches..." />
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {

    return (
      <ErrorState
        title="Failed to load batches"
        message={
          error?.data?.message ||
          "Something went wrong while fetching batches."
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

              <Boxes className="h-6 w-6" />

            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Product Batches
              </h1>

              <p className="text-sm text-muted-foreground">
                Manage stock batches and expiry dates
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
            className="
              h-9
              w-9
              hover:border-emerald-400
              hover:text-emerald-600
              hover:bg-emerald-50
            "
          >

            <RefreshCcw
              className={`h-4 w-4 ${
                isFetching
                  ? "animate-spin"
                  : ""
              }`}
            />

          </Button>


          {/* ADD */}

          <Button
            onClick={handleAdd}
            className="gap-2"
          >

            <Plus className="h-4 w-4" />

            <span>
              Add Batch
            </span>

          </Button>

        </div>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">


        {/* TOTAL */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Total Batches
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight">
                  {totalBatches.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  All product batches
                </p>

              </div>

              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">

                <Boxes className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>


        {/* GOOD */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Good Batches
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">
                  {okCount.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  No expiry concern
                </p>

              </div>

              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">

                <CheckCircle2 className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>


        {/* EXPIRING */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Expiring Soon
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-orange-600">
                  {expiringCount.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Within 30 days
                </p>

              </div>

              <div className="rounded-xl bg-orange-100 p-2.5 text-orange-600">

                <Clock3 className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>


        {/* EXPIRED */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Expired
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-red-600">
                  {expiredCount.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Requires attention
                </p>

              </div>

              <div className="rounded-xl bg-red-100 p-2.5 text-red-600">

                <AlertTriangle className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>

      </div>


      {/* =================================================
          BATCH TABLE SECTION
      ================================================= */}

      <Card className="border-0 shadow-sm">

        <CardContent className="p-0">

          {/* SECTION HEADER */}

          <div className="
            flex
            flex-col
            gap-3
            border-b
            p-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          ">

            <div>

              <h2 className="text-lg font-semibold">
                Batch Inventory
              </h2>

              <p className="text-sm text-muted-foreground">
                View and manage all product batches
              </p>

            </div>


            <Button
              variant="outline"
              onClick={handleAdd}
              className="
                w-full
                gap-2
                sm:w-auto
                hover:border-emerald-400
                hover:text-emerald-600
                hover:bg-emerald-50
              "
            >

              <Plus className="h-4 w-4" />

              New Batch

            </Button>

          </div>


          {/* TABLE */}

         <BatchTable
  batches={batches}
  filteredBatches={currentBatches}
  search={search}
  setSearch={setSearch}
  statusFilter={statusFilter}
  setStatusFilter={setStatusFilter}
  getBatchStatus={getBatchStatus}
  handleEdit={handleEdit}
  handleDelete={handleDelete}
  isDeleting={isDeleting}
  deletingBatchId={deletingBatchId}
/>

        </CardContent>

      </Card>


      {/* =================================================
          PAGINATION
      ================================================= */}

      {totalPages > 1 && (

        <Pagination
          currentpage={currentpage}
          totalPages={totalPages}
          nextPage={nextPage}
          prevPage={prevPage}
          gotoPage={gotoPage}
        />

      )}


      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (

        <BatchForm
          batch={editingBatch}
          onClose={closeForm}
        />

      )}

    </div>

  );

};


export default Batches;