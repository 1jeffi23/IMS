import { useMemo, useState } from "react";

import {
  CalendarDays,
  PackageCheck,
  Plus,
  RefreshCcw,
  Search,
} from "lucide-react";

import {
  useGetPurchasesQuery,
} from "../../services/purchaseApi";

import PurchaseForm from "./PurchaseForm";
import PurchaseTable from "./PurchaseInvoiceButton";

import ErrorState from "../loader/ErrorState";
import Loader from "../loader/Loader";

import usePagination from "../../components/customHooks/usePagination";
import Pagination from "../../components/customHooks/Pagination";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";


const PURCHASES_PER_PAGE = 5;


const Purchases = () => {

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");


  // GET PURCHASES

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetPurchasesQuery();


  const purchases = data?.purchases || [];


  // FILTER PURCHASES

  const filteredPurchases = useMemo(() => {

    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return purchases;
    }

    return purchases.filter((purchase) => {

      return (
        purchase.invoiceNumber
          ?.toLowerCase()
          .includes(searchText) ||

        purchase.supplierName
          ?.toLowerCase()
          .includes(searchText)
      );

    });

  }, [purchases, search]);


  // PAGINATION

  const {
    currentpage,
    totalPages,
    currentData,
    nextPage,
    prevPage,
    gotoPage,
  } = usePagination(
    filteredPurchases,
    PURCHASES_PER_PAGE
  );


  // SUMMARY

  const {
    totalPurchases,
    totalAmount,
  } = useMemo(() => {

    return {

      totalPurchases: purchases.length,

      totalAmount: purchases.reduce(
        (total, purchase) =>
          total +
          Number(purchase.totalAmount || 0),
        0
      ),

    };

  }, [purchases]);


  // SEARCH

  const handleSearch = (value) => {

    setSearch(value);
    gotoPage(1);

  };


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

    <div className="space-y-6 p-4 md:p-6">


      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">

              <PackageCheck className="h-6 w-6" />

            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Purchases
              </h1>

              <p className="text-sm text-muted-foreground">
                Manage purchases and incoming stock
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


          {/* NEW PURCHASE */}

          <Button
            onClick={() => setShowForm(true)}
            className="gap-2"
          >

            <Plus className="h-4 w-4" />

            <span>
              New Purchase
            </span>

          </Button>

        </div>

      </div>


      {/* SUMMARY */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">


        {/* TOTAL PURCHASES */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Total Purchases
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight">
                  {totalPurchases.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  All recorded purchases
                </p>

              </div>

              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">

                <PackageCheck className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>


        {/* TOTAL VALUE */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Total Purchase Value
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight">

                  Rs.{" "}

                  {totalAmount.toLocaleString("en-PK")}

                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Total value of purchased stock
                </p>

              </div>

              <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600">

                <CalendarDays className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>

      </div>


      {/* SEARCH */}

      <Card className="border-0 shadow-sm">

        <CardContent className="p-4">

          <div className="relative">

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
              placeholder="Search by invoice number or supplier..."
              value={search}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
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
                focus:ring-2
                focus:ring-emerald-500/20
                focus:border-emerald-500
              "
            />

          </div>


          {/* RESULT INFO */}

          <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-muted-foreground">

              Showing{" "}

              <span className="font-medium text-foreground">

                {filteredPurchases.length === 0
                  ? 0
                  : (currentpage - 1) *
                      PURCHASES_PER_PAGE +
                    1}

              </span>

              {" "}–{" "}

              <span className="font-medium text-foreground">

                {Math.min(
                  currentpage * PURCHASES_PER_PAGE,
                  filteredPurchases.length
                )}

              </span>

              {" "}of{" "}

              <span className="font-medium text-foreground">
                {filteredPurchases.length}
              </span>

              {" "}purchases

            </p>


            {search && (

              <p className="text-xs text-muted-foreground">
                Search results
              </p>

            )}

          </div>

        </CardContent>

      </Card>


      {/* PURCHASE TABLE */}

      <Card className="overflow-hidden border-0 shadow-sm">

        <CardContent className="p-0">

          <PurchaseTable
            purchases={currentData}
            refetch={refetch}
            isFetching={isFetching}
          />

        </CardContent>

      </Card>


      {/* PAGINATION */}

      <Pagination
        currentpage={currentpage}
        totalPages={totalPages}
        nextPage={nextPage}
        prevPage={prevPage}
        gotoPage={gotoPage}
      />


      {/* PURCHASE FORM */}

      {showForm && (

        <PurchaseForm
          onClose={() => setShowForm(false)}
        />

      )}

    </div>

  );

};


export default Purchases;