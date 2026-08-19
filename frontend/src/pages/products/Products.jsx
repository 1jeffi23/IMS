import { useMemo, useState } from "react";

import {
  useGetProductsQuery,
} from "../../services/productApi";

import ProductForm from "./ProductForm";

const Products = () => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetProductsQuery();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Search + filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const products = data?.products || [];

  // ==========================================
  // PRODUCT STATUS
  // ==========================================

  const getStockStatus = (product) => {
    const quantity = Number(product.quantity || 0);
    const reorderLevel = Number(product.reorderLevel || 0);

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

      const status = getStockStatus(product);

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
    const uniqueCategories = products
      .map((product) => product.categoryName)
      .filter(Boolean);

    return [...new Set(uniqueCategories)];
  }, [products]);

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {

      // -----------------------------
      // SEARCH
      // -----------------------------

      const searchValue = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchValue ||
        product.name
          ?.toLowerCase()
          .includes(searchValue) ||
        product.sku
          ?.toLowerCase()
          .includes(searchValue);


      // -----------------------------
      // STATUS
      // -----------------------------

      let matchesStatus = true;

      if (statusFilter === "active") {
        matchesStatus = product.isActive === true;
      }

      if (statusFilter === "inactive") {
        matchesStatus = product.isActive === false;
      }

      if (
        statusFilter === "in-stock"
      ) {
        matchesStatus =
          product.isActive &&
          getStockStatus(product) === "in";
      }

      if (
        statusFilter === "low-stock"
      ) {
        matchesStatus =
          product.isActive &&
          getStockStatus(product) === "low";
      }

      if (
        statusFilter === "out-of-stock"
      ) {
        matchesStatus =
          product.isActive &&
          getStockStatus(product) === "out";
      }


      // -----------------------------
      // CATEGORY
      // -----------------------------

      const matchesCategory =
        categoryFilter === "all" ||
        product.categoryName === categoryFilter;


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
  // LOADING
  // ==========================================

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">
          Loading products...
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
        <div className="border border-red-200 bg-red-50 rounded-lg p-4 text-red-600">
          Failed to load products:{" "}
          {error?.data?.message ||
            "Something went wrong"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* ======================================
          HEADER
      ======================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-semibold">
            Products
          </h1>

          <p className="text-gray-500 mt-1">
            Manage products, pricing and stock
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition"
        >
          + Add Product
        </button>

      </div>


      {/* ======================================
          SUMMARY CARDS
      ======================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* TOTAL */}

        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Total Products
          </p>

          <div className="flex items-end justify-between mt-2">
            <h2 className="text-2xl font-semibold">
              {stats.total}
            </h2>

            <span className="text-sm text-gray-400">
              Products
            </span>
          </div>
        </div>


        {/* IN STOCK */}

        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            In Stock
          </p>

          <div className="flex items-end justify-between mt-2">
            <h2 className="text-2xl font-semibold text-green-600">
              {stats.inStock}
            </h2>

            <span className="text-sm text-green-600">
              Healthy
            </span>
          </div>
        </div>


        {/* LOW STOCK */}

        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Low Stock
          </p>

          <div className="flex items-end justify-between mt-2">
            <h2 className="text-2xl font-semibold text-orange-500">
              {stats.lowStock}
            </h2>

            <span className="text-sm text-orange-500">
              Reorder
            </span>
          </div>
        </div>


        {/* OUT OF STOCK */}

        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Out of Stock
          </p>

          <div className="flex items-end justify-between mt-2">
            <h2 className="text-2xl font-semibold text-red-600">
              {stats.outOfStock}
            </h2>

            <span className="text-sm text-red-600">
              Attention
            </span>
          </div>
        </div>

      </div>


      {/* ======================================
          SEARCH + FILTERS
      ======================================= */}

      <div className="bg-white border rounded-xl p-4">

        <div className="flex flex-col lg:flex-row gap-3">

          {/* SEARCH */}

          <div className="relative flex-1">

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by product name or SKU..."
              className="w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-gray-200"
            />

          </div>


          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border rounded-lg px-4 py-2.5 bg-white"
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
            className="border rounded-lg px-4 py-2.5 bg-white"
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

          {(search ||
            statusFilter !== "all" ||
            categoryFilter !== "all") && (

            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
              className="border rounded-lg px-4 py-2.5 hover:bg-gray-50"
            >
              Clear
            </button>

          )}

        </div>

      </div>


      {/* ======================================
          RESULTS INFO
      ======================================= */}

      <div className="flex justify-between items-center">

        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-700">
            {filteredProducts.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-700">
            {products.length}
          </span>{" "}
          products
        </p>

      </div>


      {/* ======================================
          PRODUCTS TABLE
      ======================================= */}

      <div className="bg-white border rounded-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="text-left px-5 py-4 text-sm font-medium text-gray-600">
                  Product
                </th>

                <th className="text-left px-5 py-4 text-sm font-medium text-gray-600">
                  SKU
                </th>

                <th className="text-left px-5 py-4 text-sm font-medium text-gray-600">
                  Category
                </th>

                <th className="text-left px-5 py-4 text-sm font-medium text-gray-600">
                  Selling Price
                </th>

                <th className="text-left px-5 py-4 text-sm font-medium text-gray-600">
                  Stock
                </th>

                <th className="text-left px-5 py-4 text-sm font-medium text-gray-600">
                  Stock Status
                </th>

                <th className="text-left px-5 py-4 text-sm font-medium text-gray-600">
                  Product Status
                </th>

                <th className="text-right px-5 py-4 text-sm font-medium text-gray-600">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredProducts.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="text-center py-12"
                  >

                    <p className="font-medium text-gray-700">
                      No products found
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredProducts.map((item) => {

                  const stockStatus =
                    getStockStatus(item);

                  const isWarning =
                    item.isActive &&
                    (stockStatus === "low" ||
                      stockStatus === "out");


                  return (
                    <tr
                      key={item.id}
                      className={`
                        border-b last:border-b-0
                        hover:bg-gray-50
                        transition
                        ${
                          isWarning
                            ? "bg-red-50/30"
                            : ""
                        }
                      `}
                    >

                      {/* PRODUCT */}

                      <td className="px-5 py-4">

                        <div className="font-medium text-gray-900">
                          {item.name}
                        </div>

                        <div className="text-xs text-gray-500 mt-1">
                          ID #{item.id}
                        </div>

                      </td>


                      {/* SKU */}

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {item.sku}
                      </td>


                      {/* CATEGORY */}

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {item.categoryName || "—"}
                      </td>


                      {/* PRICE */}

                      <td className="px-5 py-4 text-sm font-medium">
                        Rs. {item.sellingPrice}
                      </td>


                      {/* STOCK */}

                      <td className="px-5 py-4">

                        <span
                          className={`
                            font-medium
                            ${
                              stockStatus === "out"
                                ? "text-red-600"
                                : stockStatus === "low"
                                ? "text-orange-600"
                                : "text-gray-900"
                            }
                          `}
                        >
                          {item.quantity}{" "}
                          <span className="text-gray-500 font-normal">
                            {item.unit}
                          </span>
                        </span>

                        <div className="text-xs text-gray-400 mt-1">
                          Reorder at {item.reorderLevel}
                        </div>

                      </td>


                      {/* STOCK STATUS */}

                      <td className="px-5 py-4">

                        {stockStatus === "in" && (

                          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">

                            <span className="w-2 h-2 rounded-full bg-green-500" />

                            In Stock

                          </span>

                        )}


                        {stockStatus === "low" && (

                          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700">

                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />

                            Low Stock

                          </span>

                        )}


                        {stockStatus === "out" && (

                          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">

                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

                            Out of Stock

                          </span>

                        )}

                      </td>


                      {/* PRODUCT STATUS */}

                      <td className="px-5 py-4">

                        {item.isActive ? (

                          <span className="inline-flex items-center gap-2 text-sm text-green-700">

                            <span className="w-2 h-2 rounded-full bg-green-500" />

                            Active

                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-2 text-sm text-gray-500">

                            <span className="w-2 h-2 rounded-full bg-gray-400" />

                            Inactive

                          </span>

                        )}

                      </td>


                      {/* ACTION */}

                      <td className="px-5 py-4 text-right">

                        <button
                          onClick={() =>
                            handleEdit(item)
                          }
                          className="border px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100 transition"
                        >
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
          PRODUCT FORM
      ======================================= */}

      {showForm && (

        <ProductForm
          product={editingProduct}

          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />

      )}

    </div>
  );
};

export default Products;