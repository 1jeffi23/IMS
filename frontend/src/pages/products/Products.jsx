import { useMemo, useState } from "react";

import {
  useGetProductsQuery,
} from "../../services/productApi";

import ProductForm from "./ProductForm";

import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Pencil,
  Boxes,
  RotateCcw,
} from "lucide-react";


const Products = () => {

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetProductsQuery();


  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);


  // ==========================================
  // SEARCH + FILTERS
  // ==========================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");


  const products = data?.products || [];


  // ==========================================
  // PRODUCT STATUS
  // ==========================================

  const getStockStatus = (product) => {

    const quantity = Number(
      product.quantity || 0
    );

    const reorderLevel = Number(
      product.reorderLevel || 0
    );


    if (quantity === 0) {
      return "out";
    }


    if (quantity <= reorderLevel) {
      return "low";
    }


    return "in";
  };


  // ==========================================
  // COUNTS
  // ==========================================

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


  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = useMemo(() => {

    const uniqueCategories =
      products
        .map(
          (product) =>
            product.categoryName
        )
        .filter(Boolean);


    return [
      ...new Set(uniqueCategories),
    ];

  }, [products]);


  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = useMemo(() => {

    return products.filter(
      (product) => {

        const searchValue =
          search
            .toLowerCase()
            .trim();


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


        if (
          statusFilter === "active"
        ) {

          matchesStatus =
            product.isActive === true;

        }


        if (
          statusFilter === "inactive"
        ) {

          matchesStatus =
            product.isActive === false;

        }


        if (
          statusFilter === "in-stock"
        ) {

          matchesStatus =
            product.isActive &&
            getStockStatus(product) ===
              "in";

        }


        if (
          statusFilter === "low-stock"
        ) {

          matchesStatus =
            product.isActive &&
            getStockStatus(product) ===
              "low";

        }


        if (
          statusFilter ===
          "out-of-stock"
        ) {

          matchesStatus =
            product.isActive &&
            getStockStatus(product) ===
              "out";

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

      }
    );

  }, [
    products,
    search,
    statusFilter,
    categoryFilter,
  ]);


  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (product) => {

    setEditingProduct(product);

    setShowForm(true);

  };


  // ==========================================
  // ADD
  // ==========================================

  const handleAdd = () => {

    setEditingProduct(null);

    setShowForm(true);

  };


  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {

    setSearch("");

    setStatusFilter("all");

    setCategoryFilter("all");

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {

    return (

      <div className="p-6">

        <div className="max-w-7xl mx-auto">

          <div className="mb-7">

            <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse" />

            <div className="h-4 w-72 bg-gray-100 rounded mt-2 animate-pulse" />

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {[1, 2, 3, 4].map(
              (item) => (

                <div
                  key={item}
                  className="bg-white border rounded-2xl p-5"
                >

                  <div className="h-11 w-11 bg-gray-100 rounded-xl animate-pulse" />

                  <div className="h-4 w-28 bg-gray-100 rounded mt-5 animate-pulse" />

                  <div className="h-7 w-16 bg-gray-200 rounded mt-2 animate-pulse" />

                </div>

              )
            )}

          </div>


          <div className="mt-6 bg-white border rounded-2xl p-5">

            <div className="h-11 bg-gray-100 rounded-lg animate-pulse" />

            <div className="space-y-3 mt-5">

              {[1, 2, 3, 4, 5].map(
                (item) => (

                  <div
                    key={item}
                    className="h-14 bg-gray-100 rounded-lg animate-pulse"
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

      <div className="p-6">

        <div className="max-w-7xl mx-auto">

          <div className="border border-red-200 bg-red-50 rounded-2xl p-6">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">

                <XCircle
                  size={21}
                  className="text-red-600"
                />

              </div>


              <div>

                <h2 className="font-semibold text-red-800">
                  Failed to load products
                </h2>

                <p className="text-sm text-red-600 mt-1">
                  {error?.data?.message ||
                    "Something went wrong"}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    );

  }


  // ==========================================
  // STAT CARDS
  // ==========================================

  const statCards = [

    {
      title: "Total Products",
      value: stats.total,
      label: "All products",
      icon: Package,
      wrapper:
        "bg-blue-50 border-blue-100",
      iconBg:
        "bg-blue-100",
      iconColor:
        "text-blue-600",
      valueColor:
        "text-blue-700",
    },

    {
      title: "In Stock",
      value: stats.inStock,
      label: "Healthy stock",
      icon: CheckCircle2,
      wrapper:
        "bg-green-50 border-green-100",
      iconBg:
        "bg-green-100",
      iconColor:
        "text-green-600",
      valueColor:
        "text-green-700",
    },

    {
      title: "Low Stock",
      value: stats.lowStock,
      label: "Needs reorder",
      icon: AlertTriangle,
      wrapper:
        "bg-orange-50 border-orange-100",
      iconBg:
        "bg-orange-100",
      iconColor:
        "text-orange-600",
      valueColor:
        "text-orange-700",
    },

    {
      title: "Out of Stock",
      value: stats.outOfStock,
      label: "Needs attention",
      icon: XCircle,
      wrapper:
        "bg-red-50 border-red-100",
      iconBg:
        "bg-red-100",
      iconColor:
        "text-red-600",
      valueColor:
        "text-red-700",
    },

  ];


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="p-6">

      <div className="max-w-8xl mx-auto">


        {/* =====================================
            HEADER
        ====================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">

                <Package
                  size={23}
                  className="text-blue-600"
                />

              </div>


              <div>

                <h1 className="text-2xl font-semibold text-gray-900">
                  Products
                </h1>

                <p className="text-sm text-gray-500 mt-0.5">
                  Manage products, pricing and stock
                </p>

              </div>

            </div>

          </div>


          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 active:scale-[0.98] transition shadow-sm shadow-blue-200"
          >

            <Plus size={18} />

            Add Product

          </button>

        </div>


        {/* =====================================
            SUMMARY CARDS
        ====================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {statCards.map(
            (stat) => {

              const Icon =
                stat.icon;


              return (

                <div
                  key={stat.title}
                  className={`border rounded-2xl p-5 ${stat.wrapper} hover:-translate-y-0.5 hover:shadow-md transition-all duration-200`}
                >

                  <div className="flex items-start justify-between">

                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconBg}`}
                    >

                      <Icon
                        size={21}
                        className={stat.iconColor}
                      />

                    </div>


                    <Boxes
                      size={18}
                      className="text-gray-300"
                    />

                  </div>


                  <p className="text-sm text-gray-600 mt-5">
                    {stat.title}
                  </p>


                  <div className="flex items-end justify-between mt-1">

                    <p
                      className={`text-2xl font-bold ${stat.valueColor}`}
                    >
                      {stat.value}
                    </p>

                    <span className="text-xs text-gray-500 mb-1">
                      {stat.label}
                    </span>

                  </div>

                </div>

              );

            }
          )}

        </div>


        {/* =====================================
            SEARCH + FILTERS
        ====================================== */}

        <div className="bg-white border border-gray-200 rounded-2xl p-4 mt-6 shadow-sm">

          <div className="flex items-center gap-2 mb-4">

            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">

              <SlidersHorizontal
                size={16}
                className="text-gray-600"
              />

            </div>


            <div>

              <h2 className="text-sm font-semibold text-gray-800">
                Search & Filters
              </h2>

              <p className="text-xs text-gray-400">
                Find products quickly
              </p>

            </div>

          </div>


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
                placeholder="Search by product name or SKU..."
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition"
              />

            </div>


            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition"
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
                setCategoryFilter(
                  e.target.value
                )
              }
              className="border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition"
            >

              <option value="all">
                All Categories
              </option>

              {categories.map(
                (category) => (

                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>

                )
              )}

            </select>


            {/* CLEAR */}

            {(search ||
              statusFilter !== "all" ||
              categoryFilter !== "all") && (

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
              >

                <RotateCcw size={15} />

                Clear

              </button>

            )}

          </div>

        </div>


        {/* =====================================
            RESULTS INFO
        ====================================== */}

        <div className="flex items-center justify-between mt-5 mb-3">

          <p className="text-sm text-gray-500">

            Showing{" "}

            <span className="font-semibold text-gray-800">
              {filteredProducts.length}
            </span>{" "}

            of{" "}

            <span className="font-semibold text-gray-800">
              {products.length}
            </span>{" "}

            products

          </p>


          {(search ||
            statusFilter !== "all" ||
            categoryFilter !== "all") && (

            <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-medium">

              Filters applied

            </span>

          )}

        </div>


        {/* =====================================
            PRODUCTS TABLE
        ====================================== */}

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Product
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    SKU
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Category
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Selling Price
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Stock
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Stock Status
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>

                  <th className="text-right px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredProducts.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="text-center py-16"
                    >

                      <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center">

                        <Package
                          size={26}
                          className="text-gray-400"
                        />

                      </div>


                      <p className="font-semibold text-gray-700 mt-4">
                        No products found
                      </p>


                      <p className="text-sm text-gray-400 mt-1">
                        Try changing your search or filters.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filteredProducts.map(
                    (item) => {

                      const stockStatus =
                        getStockStatus(
                          item
                        );


                      const isWarning =
                        item.isActive &&
                        (
                          stockStatus ===
                            "low" ||
                          stockStatus ===
                            "out"
                        );


                      return (

                        <tr
                          key={item.id}
                          className={`
                            border-b last:border-b-0
                            transition-colors duration-150
                            hover:bg-blue-50/40
                            ${isWarning
                              ? "bg-red-50/20"
                              : ""
                            }
                          `}
                        >

                          {/* PRODUCT */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                stockStatus === "out"
                                  ? "bg-red-100 text-red-600"
                                  : stockStatus === "low"
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-blue-100 text-blue-600"
                              }`}>

                                <Package
                                  size={18}
                                />

                              </div>


                              <div>

                                <p className="font-semibold text-gray-900">
                                  {item.name}
                                </p>

                                <p className="text-xs text-gray-400 mt-0.5">
                                  ID #{item.id}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* SKU */}

                          <td className="px-5 py-4">

                            <span className="inline-flex bg-gray-100 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600">
                              {item.sku}
                            </span>

                          </td>


                          {/* CATEGORY */}

                          <td className="px-5 py-4 text-sm text-gray-600">

                            {item.categoryName ? (

                              <span className="inline-flex bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                                {item.categoryName}
                              </span>

                            ) : (

                              <span className="text-gray-400">
                                —
                              </span>

                            )}

                          </td>


                          {/* PRICE */}

                          <td className="px-5 py-4">

                            <span className="font-semibold text-gray-800">
                              Rs.{" "}
                              {Number(
                                item.sellingPrice ||
                                  0
                              ).toLocaleString(
                                "en-PK"
                              )}
                            </span>

                          </td>


                          {/* STOCK */}

                          <td className="px-5 py-4">

                            <p
                              className={`font-semibold ${
                                stockStatus ===
                                "out"
                                  ? "text-red-600"
                                  : stockStatus ===
                                    "low"
                                  ? "text-orange-600"
                                  : "text-gray-900"
                              }`}
                            >

                              {item.quantity}{" "}

                              <span className="font-normal text-gray-400">
                                {item.unit}
                              </span>

                            </p>


                            <p className="text-xs text-gray-400 mt-1">
                              Reorder at{" "}
                              {item.reorderLevel}
                            </p>

                          </td>


                          {/* STOCK STATUS */}

                          <td className="px-5 py-4">

                            {stockStatus ===
                              "in" && (

                              <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">

                                <CheckCircle2
                                  size={14}
                                />

                                In Stock

                              </span>

                            )}


                            {stockStatus ===
                              "low" && (

                              <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700">

                                <AlertTriangle
                                  size={14}
                                />

                                Low Stock

                              </span>

                            )}


                            {stockStatus ===
                              "out" && (

                              <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700">

                                <XCircle
                                  size={14}
                                />

                                Out of Stock

                              </span>

                            )}

                          </td>


                          {/* PRODUCT STATUS */}

                          <td className="px-5 py-4">

                            {item.isActive ? (

                              <span className="inline-flex items-center gap-2 text-sm font-medium text-green-700">

                                <span className="w-2 h-2 rounded-full bg-green-500" />

                                Active

                              </span>

                            ) : (

                              <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-500">

                                <span className="w-2 h-2 rounded-full bg-gray-400" />

                                Inactive

                              </span>

                            )}

                          </td>


                          {/* ACTION */}

                          <td className="px-5 py-4 text-right">

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  item
                                )
                              }
                              className="inline-flex items-center gap-2 border border-gray-200 bg-white px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition"
                            >

                              <Pencil
                                size={15}
                              />

                              Edit

                            </button>

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


        {/* =====================================
            PRODUCT FORM
        ====================================== */}

        {showForm && (

          <ProductForm
            product={editingProduct}

            onClose={() => {

              setShowForm(false);

              setEditingProduct(
                null
              );

            }}
          />

        )}

      </div>

    </div>

  );

};


export default Products;