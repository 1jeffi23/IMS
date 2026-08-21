import { useMemo, useState } from "react";
import { useGetProductsQuery } from "../../services/productApi";
import ProductForm from "./ProductForm";
import ProductStats from "./ProductStats";
import ProductTable from "./ProductTable";
import { Package, Plus, Search, SlidersHorizontal, RotateCcw, XCircle } from "lucide-react";
import ErrorState from "../loader/ErrorState";
import Loader from "../loader/Loader";

const Products = () => {
  const { data, isLoading, isError, error } = useGetProductsQuery();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const products = data?.products || [];

  const getStockStatus = (product) => {
    const quantity = Number(product.quantity || 0);
    const reorderLevel = Number(product.reorderLevel || 0);

    if (quantity === 0) return "out";
    if (quantity <= reorderLevel) return "low";

    return "in";
  };

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

      if (status === "in") inStock++;
      if (status === "low") lowStock++;
      if (status === "out") outOfStock++;
    });

    return {
      total: products.length,
      inStock,
      lowStock,
      outOfStock,
      inactive,
    };
  }, [products]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.categoryName)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        product.name?.toLowerCase().includes(searchValue) ||
        product.sku?.toLowerCase().includes(searchValue);

      let matchesStatus = true;

      if (statusFilter === "active") {
        matchesStatus = product.isActive === true;
      }

      if (statusFilter === "inactive") {
        matchesStatus = product.isActive === false;
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

      const matchesCategory =
        categoryFilter === "all" ||
        product.categoryName === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, search, statusFilter, categoryFilter]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  if (isLoading) {
     return <Loader text="Loading Products..." />;
  }

  if (isError) {
    return (
       <ErrorState
         title="Failed to load Products"
         message={
           error?.data?.message ||
           "Something went wrong while fetching products."
         }
       />
     );
  }

  return (
    <div className="p-6">
      <div className="max-w-8xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <Package size={23} className="text-blue-600" />
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

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 active:scale-[0.98] transition shadow-sm shadow-blue-200"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        <ProductStats stats={stats} />

        <div className="bg-white border border-gray-200 rounded-2xl p-4 mt-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <SlidersHorizontal size={16} className="text-gray-600" />
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
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name or SKU..."
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition"
            >
              <option value="all">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

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

        <ProductTable
          products={filteredProducts}
          getStockStatus={getStockStatus}
          onEdit={handleEdit}
        />

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
    </div>
  );
};

export default Products;