import { useEffect, useMemo, useState } from "react";

import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  RotateCcw,
  RefreshCcw,
} from "lucide-react";

import {
  useGetProductsQuery,
} from "../../services/productApi";

import ProductForm from "./ProductForm";
import ProductStats from "./ProductStats";
import ProductTable from "./ProductTable";

import Loader from "../loader/Loader";
import ErrorState from "../loader/ErrorState";

import usePagination from "../../components/customHooks/usePagination";
import Pagination from "../../components/customHooks/Pagination";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


const PRODUCTS_PER_PAGE = 7;


const Products = () => {

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
  } = useGetProductsQuery();


  // =====================================================
  // STATE
  // =====================================================

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [categoryFilter, setCategoryFilter] =
    useState("all");


  // =====================================================
  // DATA
  // =====================================================

  const products = data?.products || [];


  // =====================================================
  // STOCK STATUS
  // =====================================================

  const getStockStatus = (product) => {

    const quantity =
      Number(product.quantity || 0);

    const reorderLevel =
      Number(product.reorderLevel || 0);

    if (quantity === 0) {
      return "out";
    }

    if (quantity <= reorderLevel) {
      return "low";
    }

    return "in";
  };


  // =====================================================
  // PRODUCT STATS
  // =====================================================

  const stats = useMemo(() => {

    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let inactive = 0;

    products.forEach((product) => {

      if (!product.isActive) {
        inactive++;
        return;
      }

      const status =
        getStockStatus(product);

      if (status === "in") {
        inStock++;
      }

      if (status === "low") {
        lowStock++;
      }

      if (status === "out") {
        outOfStock++;
      }

    });

    return {
      total: products.length,
      inStock,
      lowStock,
      outOfStock,
      inactive,
    };

  }, [products]);


  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = useMemo(() => {

    return [
      ...new Set(
        products
          .map(
            (product) =>
              product.categoryName
          )
          .filter(Boolean)
      ),
    ];

  }, [products]);


  // =====================================================
  // FILTERED PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {

    const searchValue =
      search.toLowerCase().trim();

    return products.filter((product) => {

      // SEARCH

      const matchesSearch =
        !searchValue ||
        product.name
          ?.toLowerCase()
          .includes(searchValue) ||
        product.sku
          ?.toLowerCase()
          .includes(searchValue);


      // STATUS

      let matchesStatus = true;

      if (statusFilter === "active") {

        matchesStatus =
          product.isActive === true;

      }

      if (statusFilter === "inactive") {

        matchesStatus =
          product.isActive === false;

      }

      if (statusFilter === "in-stock") {

        matchesStatus =
          product.isActive &&
          getStockStatus(product) === "in";

      }

      if (statusFilter === "low-stock") {

        matchesStatus =
          product.isActive &&
          getStockStatus(product) === "low";

      }

      if (statusFilter === "out-of-stock") {

        matchesStatus =
          product.isActive &&
          getStockStatus(product) === "out";

      }


      // CATEGORY

      const matchesCategory =
        categoryFilter === "all" ||
        product.categoryName ===
          categoryFilter;


      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );

    });

  }, [
    products,
    search,
    statusFilter,
    categoryFilter,
  ]);


  // =====================================================
  // PAGINATION
  // =====================================================

  const {
    currentpage,
    totalPages,
    currentData: currentProducts,
    nextPage,
    prevPage,
    gotoPage,
  } = usePagination(
    filteredProducts,
    PRODUCTS_PER_PAGE
  );


  // =====================================================
  // RESET PAGE WHEN FILTERS CHANGE
  // =====================================================

  useEffect(() => {

    gotoPage(1);

  }, [
    search,
    statusFilter,
    categoryFilter,
  ]);


  // =====================================================
  // HANDLERS
  // =====================================================

  const handleAdd = () => {

    setEditingProduct(null);
    setShowForm(true);

  };


  const handleEdit = (product) => {

    setEditingProduct(product);
    setShowForm(true);

  };


  const closeForm = () => {

    setShowForm(false);
    setEditingProduct(null);

  };


  const clearFilters = () => {

    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");

  };


  const hasFilters =
    Boolean(search) ||
    statusFilter !== "all" ||
    categoryFilter !== "all";


  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {

    return (
      <Loader text="Loading Products..." />
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {

    return (
      <ErrorState
        title="Failed to load products"
        message={
          error?.data?.message ||
          "Something went wrong while fetching products."
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

      <div className="
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      ">

        <div>

          <div className="flex items-center gap-3">

            <div className="
              rounded-xl
              bg-emerald-100
              p-2.5
              text-emerald-600
            ">

              <Package className="h-6 w-6" />

            </div>


            <div>

              <h1 className="
                text-2xl
                font-bold
                tracking-tight
                md:text-3xl
              ">
                Products
              </h1>

              <p className="
                text-sm
                text-muted-foreground
              ">
                Manage products, pricing and stock
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
            title="Refresh products"
            className="
              h-9
              w-9
              hover:border-emerald-400
              hover:bg-emerald-50
              hover:text-emerald-600
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


          {/* ADD PRODUCT */}

          <Button
            onClick={handleAdd}
            className="gap-2"
          >

            <Plus className="h-4 w-4" />

            <span>
              Add Product
            </span>

          </Button>

        </div>

      </div>


      {/* =================================================
          PRODUCT STATS
      ================================================= */}

      <ProductStats stats={stats} />


      {/* =================================================
          FILTER SECTION
      ================================================= */}

      <Card className="border-0 shadow-sm">

        <CardContent className="p-5">

          {/* FILTER HEADER */}

          <div className="
            mb-4
            flex
            items-center
            gap-3
          ">

            <div className="
              rounded-lg
              bg-emerald-100
              p-2
              text-emerald-600
            ">

              <SlidersHorizontal className="h-4 w-4" />

            </div>


            <div>

              <h2 className="text-sm font-semibold">
                Search & Filters
              </h2>

              <p className="
                text-xs
                text-muted-foreground
              ">
                Find products quickly
              </p>

            </div>

          </div>


          {/* FILTERS */}

          <div className="
            flex
            flex-col
            gap-3
            lg:flex-row
          ">

            {/* SEARCH */}

            <div className="relative flex-1">

              <Search className="
                absolute
                left-3.5
                top-1/2
                h-4.5
                w-4.5
                -translate-y-1/2
                text-muted-foreground
              " />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="
                  Search by product name or SKU...
                "
                className="
                  w-full
                  rounded-xl
                  border
                  border-input
                  bg-background
                  py-2.5
                  pl-10
                  pr-4
                  text-sm
                  outline-none
                  transition
                  focus:border-emerald-400
                  focus:ring-2
                  focus:ring-emerald-100
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
                w-full
                rounded-xl
                border
                border-input
                bg-background
                px-4
                py-2.5
                text-sm
                outline-none
                transition
                focus:border-emerald-400
                focus:ring-2
                focus:ring-emerald-100
                lg:w-48
              "
            >

              <option value="all">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="in-stock">
                In Stock
              </option>

              <option value="low-stock">
                Low Stock
              </option>

              <option value="out-of-stock">
                Out of Stock
              </option>

              <option value="inactive">
                Inactive
              </option>

            </select>


            {/* CATEGORY */}

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
              className="
                w-full
                rounded-xl
                border
                border-input
                bg-background
                px-4
                py-2.5
                text-sm
                outline-none
                transition
                focus:border-emerald-400
                focus:ring-2
                focus:ring-emerald-100
                lg:w-48
              "
            >

              <option value="all">
                All Categories
              </option>

              {categories.map((category) => (

                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>

              ))}

            </select>


            {/* CLEAR */}

            {hasFilters && (

              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
                className="
                  w-full
                  gap-2
                  hover:border-emerald-400
                  hover:bg-emerald-50
                  hover:text-emerald-600
                  lg:w-auto
                "
              >

                <RotateCcw className="h-4 w-4" />

                Clear

              </Button>

            )}

          </div>


          {/* RESULTS */}

          <div className="
            mt-4
            flex
            flex-col
            gap-2
            border-t
            pt-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          ">

            <p className="
              text-xs
              text-muted-foreground
            ">

              Showing{" "}

              <span className="
                font-semibold
                text-foreground
              ">
                {filteredProducts.length === 0
                  ? 0
                  : (currentpage - 1) *
                      PRODUCTS_PER_PAGE +
                    1}
              </span>

              {" - "}

              <span className="
                font-semibold
                text-foreground
              ">
                {Math.min(
                  currentpage *
                    PRODUCTS_PER_PAGE,
                  filteredProducts.length
                )}
              </span>

              {" of "}

              <span className="
                font-semibold
                text-foreground
              ">
                {filteredProducts.length}
              </span>

              {" "}products

            </p>


            {hasFilters && (

              <span className="
                w-fit
                rounded-full
                bg-emerald-50
                px-3
                py-1
                text-xs
                font-medium
                text-emerald-600
              ">
                Filters applied
              </span>

            )}

          </div>

        </CardContent>

      </Card>


      {/* =================================================
          PRODUCT TABLE
      ================================================= */}

      <Card className="
        border-0
        shadow-sm
      ">

        <CardContent className="p-0">

          {/* TABLE HEADER */}

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
                Product Inventory
              </h2>

              <p className="
                text-sm
                text-muted-foreground
              ">
                View and manage your products
              </p>

            </div>


            <Button
              variant="outline"
              onClick={handleAdd}
              className="
                w-full
                gap-2
                hover:border-emerald-400
                hover:bg-emerald-50
                hover:text-emerald-600
                sm:w-auto
              "
            >

              <Plus className="h-4 w-4" />

              New Product

            </Button>

          </div>


          {/* TABLE */}

          <ProductTable
            products={currentProducts}
            getStockStatus={getStockStatus}
            onEdit={handleEdit}
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
          PRODUCT FORM
      ================================================= */}

      {showForm && (

        <ProductForm
          product={editingProduct}
          onClose={closeForm}
        />

      )}

    </div>

  );

};


export default Products;