import { useMemo, useState } from "react";

import {
  CheckCircle2,
  FolderTree,
  Plus,
  RefreshCcw,
  XCircle,
} from "lucide-react";

import {
  useGetCategoriesQuery,
  useDeactivateCategoryMutation,
} from "../../services/categoryApi";

import CategoryForm from "./CategoryForm";
import CategoryTable from "./CategoryTable";

import ErrorState from "../loader/ErrorState";
import Loader from "../loader/Loader";

import usePagination from "../../components/customHooks/usePagination";
import Pagination from "../../components/customHooks/Pagination";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";


const CATEGORIES_PER_PAGE = 7;


const Category = () => {

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
  } = useGetCategoriesQuery();

  const [
    deactivateCategory,
    { isLoading: isDeactivating },
  ] = useDeactivateCategoryMutation();

  const categories = data?.categories || [];


  // =====================================================
  // STATE
  // =====================================================

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [deactivatingId, setDeactivatingId] = useState(null);


  // =====================================================
  // SUMMARY
  // =====================================================

  const {
    totalCategories,
    activeCategories,
    inactiveCategories,
  } = useMemo(() => {

    const total = categories.length;

    const active = categories.filter(
      (category) => category.isActive
    ).length;

    return {
      totalCategories: total,
      activeCategories: active,
      inactiveCategories: total - active,
    };

  }, [categories]);


  // =====================================================
  // ADD
  // =====================================================

  const handleAdd = () => {

    setEditingCategory(null);
    setShowForm(true);

  };


  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (category) => {

    setEditingCategory(category);
    setShowForm(true);

  };


  // =====================================================
  // DEACTIVATE
  // =====================================================

  const handleDeactivate = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to deactivate this category?"
    );

    if (!confirmed) return;

    try {

      setDeactivatingId(id);

      await deactivateCategory(id).unwrap();

    } catch (error) {

      console.error(
        "Failed to deactivate category:",
        error
      );

      alert(
        error?.data?.message ||
        "Failed to deactivate category"
      );

    } finally {

      setDeactivatingId(null);

    }

  };


  // =====================================================
  // FILTER
  // =====================================================

  const filteredCategories = useMemo(() => {

    const searchText =
      search.toLowerCase().trim();

    return categories.filter((category) => {

      const matchesSearch =
        !searchText ||
        category.name
          ?.toLowerCase()
          .includes(searchText) ||
        category.description
          ?.toLowerCase()
          .includes(searchText);

      let matchesStatus = true;

      if (statusFilter === "active") {

        matchesStatus =
          category.isActive === true;

      }

      if (statusFilter === "inactive") {

        matchesStatus =
          category.isActive === false;

      }

      return matchesSearch && matchesStatus;

    });

  }, [categories, search, statusFilter]);


  // =====================================================
  // PAGINATION
  // =====================================================

  const {
    currentpage,
    totalPages,
    currentData,
    nextPage,
    prevPage,
    gotoPage,
  } = usePagination(
    filteredCategories,
    CATEGORIES_PER_PAGE
  );


  // =====================================================
  // SEARCH / FILTER HANDLERS
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
      <Loader text="Loading Categories..." />
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {

    return (
      <ErrorState
        title="Failed to load categories"
        message={
          error?.data?.message ||
          "Something went wrong while fetching categories."
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

              <FolderTree className="h-6 w-6" />

            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Categories
              </h1>

              <p className="text-sm text-muted-foreground">
                Organize and manage your product categories
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


          {/* ADD CATEGORY */}

          <Button
            onClick={handleAdd}
            className="gap-2"
          >

            <Plus className="h-4 w-4" />

            <span>
              Add Category
            </span>

          </Button>

        </div>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">


        {/* TOTAL */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Total Categories
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight">
                  {totalCategories.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  All categories
                </p>

              </div>


              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">

                <FolderTree className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>


        {/* ACTIVE */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Active Categories
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">
                  {activeCategories.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Currently available
                </p>

              </div>


              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">

                <CheckCircle2 className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>


        {/* INACTIVE */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Inactive Categories
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-gray-500">
                  {inactiveCategories.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Currently disabled
                </p>

              </div>


              <div className="rounded-xl bg-gray-100 p-2.5 text-gray-500">

                <XCircle className="h-5 w-5" />

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

          <CategoryTable
            categories={currentData}
            filteredCategories={filteredCategories}
            search={search}
            setSearch={handleSearch}
            statusFilter={statusFilter}
            setStatusFilter={handleStatusChange}
            onEdit={handleEdit}
            onDeactivate={handleDeactivate}
            deactivatingId={deactivatingId}
            isDeactivating={isDeactivating}
          />

        </CardContent>

      </Card>


      {/* =================================================
          RESULT INFO
      ================================================= */}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-xs text-muted-foreground">

          Showing{" "}

          <span className="font-medium text-foreground">

            {filteredCategories.length === 0
              ? 0
              : (currentpage - 1) *
                  CATEGORIES_PER_PAGE +
                1}

          </span>

          {" "}–{" "}

          <span className="font-medium text-foreground">

            {Math.min(
              currentpage *
                CATEGORIES_PER_PAGE,
              filteredCategories.length
            )}

          </span>

          {" "}of{" "}

          <span className="font-medium text-foreground">
            {filteredCategories.length}
          </span>

          {" "}categories

        </p>


        {hasFilters && (

          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>

        )}

      </div>


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

        <CategoryForm
          category={editingCategory}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
        />

      )}

    </div>

  );

};


export default Category;