import {
  useGetProductsQuery,
} from "../services/productApi";

import {
  useGetSalesQuery,
} from "../services/saleApi";

import {
  Package,
  ShoppingCart,
  AlertTriangle,
  Boxes,
  ArrowUpRight,
  Plus,
  Receipt,
} from "lucide-react";

import { useNavigate } from "react-router-dom";


const Dashboard = () => {

  const navigate = useNavigate();


  // ==========================================
  // API
  // ==========================================

  const {
    data: productData,
    isLoading: productsLoading,
    isError: productsError,
  } = useGetProductsQuery();


  const {
    data: salesData,
    isLoading: salesLoading,
    isError: salesError,
  } = useGetSalesQuery();


  const products =
    productData?.products || [];

  const sales =
    salesData?.sales || [];


  // ==========================================
  // CALCULATIONS
  // ==========================================

  const activeProducts =
    products.filter(
      (product) => product.isActive
    );


  const lowStockProducts =
    activeProducts.filter(
      (product) =>
        Number(product.quantity || 0) <=
        Number(product.reorderLevel || 0)
    );


  const outOfStockProducts =
    activeProducts.filter(
      (product) =>
        Number(product.quantity || 0) === 0
    );


  const healthyStockProducts =
    activeProducts.filter(
      (product) =>
        Number(product.quantity || 0) >
        Number(product.reorderLevel || 0)
    );


  const totalStock =
    activeProducts.reduce(
      (total, product) =>
        total +
        Number(product.quantity || 0),
      0
    );


  const totalSales =
    sales.reduce(
      (total, sale) =>
        total +
        Number(sale.total || 0),
      0
    );


  const recentSales =
    [...sales]
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 5);


  // ==========================================
  // PERCENTAGES
  // ==========================================

  const healthyPercentage =
    activeProducts.length
      ? Math.round(
          (healthyStockProducts.length /
            activeProducts.length) *
            100
        )
      : 0;


  const lowStockPercentage =
    activeProducts.length
      ? Math.round(
          (lowStockProducts.length /
            activeProducts.length) *
            100
        )
      : 0;


  const outOfStockPercentage =
    activeProducts.length
      ? Math.round(
          (outOfStockProducts.length /
            activeProducts.length) *
            100
        )
      : 0;


  // ==========================================
  // LOADING
  // ==========================================

  const isLoading =
    productsLoading ||
    salesLoading;


  if (isLoading) {

    return (

      <div className="p-4 sm:p-6">

        <div className="max-w-7xl mx-auto">

          {/* HEADER SKELETON */}

          <div className="mb-8">

            <div className="h-8 w-44 bg-gray-200 rounded-lg animate-pulse" />

            <div className="h-4 w-72 bg-gray-100 rounded mt-2 animate-pulse" />

          </div>


          {/* STATS SKELETON */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {[1, 2, 3, 4].map(
              (item) => (

                <div
                  key={item}
                  className="bg-white border border-gray-200 rounded-2xl p-5"
                >

                  <div className="h-11 w-11 bg-gray-100 rounded-xl animate-pulse" />

                  <div className="h-4 w-28 bg-gray-100 rounded mt-5 animate-pulse" />

                  <div className="h-7 w-20 bg-gray-200 rounded mt-2 animate-pulse" />

                  <div className="h-3 w-32 bg-gray-100 rounded mt-2 animate-pulse" />

                </div>

              )
            )}

          </div>


          {/* CONTENT SKELETON */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

            <div className="lg:col-span-2 h-80 bg-white border border-gray-200 rounded-2xl animate-pulse" />

            <div className="h-80 bg-white border border-gray-200 rounded-2xl animate-pulse" />

          </div>

        </div>

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (productsError || salesError) {

    return (

      <div className="p-4 sm:p-6">

        <div className="max-w-7xl mx-auto">

          <div className="bg-white border border-red-200 rounded-2xl p-10 text-center">

            <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center">

              <AlertTriangle
                size={26}
                className="text-red-500"
              />

            </div>


            <h2 className="text-lg font-semibold text-gray-900 mt-4">
              Unable to load dashboard
            </h2>


            <p className="text-sm text-gray-500 mt-1">
              There was a problem loading inventory or sales data.
            </p>


            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 px-4 py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
            >
              Try Again
            </button>

          </div>

        </div>

      </div>

    );

  }


  // ==========================================
  // STAT CARDS
  // ==========================================

  const stats = [

    {
      title: "Total Products",
      value: activeProducts.length.toLocaleString("en-PK"),
      description: "Active products",
      icon: Package,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },

    {
      title: "Total Stock",
      value: totalStock.toLocaleString("en-PK"),
      description: "Units currently available",
      icon: Boxes,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },

    {
      title: "Low Stock",
      value: lowStockProducts.length.toLocaleString("en-PK"),
      description:
        lowStockProducts.length > 0
          ? "Products need attention"
          : "Stock levels look good",
      icon: AlertTriangle,
      iconBg:
        lowStockProducts.length > 0
          ? "bg-red-50"
          : "bg-green-50",
      iconColor:
        lowStockProducts.length > 0
          ? "text-red-600"
          : "text-green-600",
    },

    {
      title: "Total Sales",
      value: `Rs. ${totalSales.toLocaleString("en-PK")}`,
      description: `${sales.length} completed sales`,
      icon: ShoppingCart,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },

  ];


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="p-4 sm:p-6">

      <div className="max-w-8xl mx-auto">


        {/* =====================================
            HEADER
        ====================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>

            <div className="flex items-center gap-2">

              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>

              <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                Live
              </span>

            </div>


            <p className="text-sm text-gray-500 mt-1">
              Here's an overview of your inventory and sales.
            </p>

          </div>


          {/* QUICK ACTIONS */}

          <div className="flex flex-col sm:flex-row gap-3">

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition"
            >

              <Plus size={17} />

              Add Product

            </button>


            <button
              type="button"
              onClick={() =>
                navigate("/pos")
              }
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >

              <ShoppingCart size={17} />

              New Sale

            </button>

          </div>

        </div>


        {/* =====================================
            STAT CARDS
        ====================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {stats.map(
            (stat) => {

              const Icon =
                stat.icon;


              return (

                <div
                  key={stat.title}
                  className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
                >

                  <div className="flex items-center justify-between">

                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconBg}`}
                    >

                      <Icon
                        size={22}
                        className={stat.iconColor}
                      />

                    </div>

                  </div>


                  <p className="text-sm text-gray-500 mt-5">
                    {stat.title}
                  </p>


                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {stat.value}
                  </p>


                  <p className="text-xs text-gray-400 mt-1">
                    {stat.description}
                  </p>

                </div>

              );

            }
          )}

        </div>


        {/* =====================================
            RECENT SALES + STOCK OVERVIEW
        ====================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">


          {/* ==================================
              RECENT SALES
          =================================== */}

          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl overflow-hidden">

            <div className="px-5 py-4 border-b flex items-center justify-between">

              <div>

                <h2 className="font-semibold text-gray-900">
                  Recent Sales
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Latest completed transactions
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  navigate("/sales")
                }
                className="text-sm font-medium text-gray-600 hover:text-black transition"
              >
                View all
              </button>

            </div>


            {recentSales.length === 0 ? (

              <div className="py-14 px-5 text-center">

                <div className="w-12 h-12 mx-auto rounded-xl bg-purple-50 flex items-center justify-center">

                  <Receipt
                    size={23}
                    className="text-purple-600"
                  />

                </div>


                <p className="font-medium text-gray-700 mt-4">
                  No sales yet
                </p>


                <p className="text-sm text-gray-400 mt-1">
                  Completed sales will appear here.
                </p>


                <button
                  type="button"
                  onClick={() =>
                    navigate("/pos")
                  }
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700"
                >

                  <Plus size={16} />

                  Create Sale

                </button>

              </div>

            ) : (

              <div>

                {recentSales.map(
                  (sale) => (

                    <div
                      key={sale.id}
                      className="px-5 py-4 border-b last:border-b-0 flex items-center justify-between gap-4 hover:bg-gray-50 transition"
                    >

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-10 h-10 shrink-0 rounded-xl bg-purple-50 flex items-center justify-center">

                          <ShoppingCart
                            size={18}
                            className="text-purple-600"
                          />

                        </div>


                        <div className="min-w-0">

                          <p className="font-medium text-sm text-gray-800">
                            Sale #{sale.id}
                          </p>


                          <p className="text-xs text-gray-400 mt-0.5 truncate">

                            {sale.customerName ||
                              "Walk-in Customer"}

                          </p>

                        </div>

                      </div>


                      <div className="text-right shrink-0">

                        <p className="font-semibold text-sm text-gray-900">

                          Rs.{" "}
                          {Number(
                            sale.total || 0
                          ).toLocaleString(
                            "en-PK"
                          )}

                        </p>


                        <p className="text-xs text-gray-400 capitalize mt-0.5">
                          {sale.paymentMethod || "-"}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>


          {/* ==================================
              STOCK OVERVIEW
          =================================== */}

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

            <div className="px-5 py-4 border-b">

              <h2 className="font-semibold text-gray-900">
                Stock Overview
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Current inventory status
              </p>

            </div>


            <div className="p-5 space-y-6">


              {/* HEALTHY STOCK */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-2">

                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />

                    <span className="text-sm text-gray-600">
                      Healthy Stock
                    </span>

                  </div>


                  <span className="font-semibold text-sm text-gray-800">
                    {healthyStockProducts.length}
                  </span>

                </div>


                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{
                      width: `${healthyPercentage}%`,
                    }}
                  />

                </div>


                <p className="text-xs text-gray-400 mt-1">
                  {healthyPercentage}% of active products
                </p>

              </div>


              {/* LOW STOCK */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-2">

                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />

                    <span className="text-sm text-gray-600">
                      Low Stock
                    </span>

                  </div>


                  <span className="font-semibold text-sm text-gray-800">
                    {lowStockProducts.length}
                  </span>

                </div>


                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-yellow-500 rounded-full transition-all"
                    style={{
                      width: `${lowStockPercentage}%`,
                    }}
                  />

                </div>


                <p className="text-xs text-gray-400 mt-1">
                  {lowStockPercentage}% of active products
                </p>

              </div>


              {/* OUT OF STOCK */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-2">

                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />

                    <span className="text-sm text-gray-600">
                      Out of Stock
                    </span>

                  </div>


                  <span className="font-semibold text-sm text-gray-800">
                    {outOfStockProducts.length}
                  </span>

                </div>


                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-red-500 rounded-full transition-all"
                    style={{
                      width: `${outOfStockPercentage}%`,
                    }}
                  />

                </div>


                <p className="text-xs text-gray-400 mt-1">
                  {outOfStockPercentage}% of active products
                </p>

              </div>


              {/* ATTENTION BUTTON */}

              {lowStockProducts.length > 0 && (

                <button
                  type="button"
                  onClick={() =>
                    navigate("/products")
                  }
                  className="w-full flex items-center justify-between rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700 hover:bg-red-100 transition"
                >

                  <span className="flex items-center gap-2">

                    <AlertTriangle size={17} />

                    {lowStockProducts.length}{" "}
                    {lowStockProducts.length === 1
                      ? "product needs"
                      : "products need"}{" "}
                    attention

                  </span>


                  <ArrowUpRight size={17} />

                </button>

              )}

            </div>

          </div>

        </div>


        {/* =====================================
            LOW STOCK PRODUCTS
        ====================================== */}

        {lowStockProducts.length > 0 && (

          <div className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">

            <div className="px-5 py-4 border-b flex items-center justify-between">

              <div>

                <h2 className="font-semibold text-gray-900">
                  Products Requiring Attention
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Products at or below their reorder level
                </p>

              </div>


              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">

                <AlertTriangle
                  size={19}
                  className="text-red-500"
                />

              </div>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-gray-50 border-b">

                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Product
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      SKU
                    </th>

                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Current Stock
                    </th>

                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Reorder Level
                    </th>

                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {lowStockProducts
                    .slice(0, 5)
                    .map(
                      (product) => {

                        const quantity =
                          Number(
                            product.quantity || 0
                          );

                        const reorderLevel =
                          Number(
                            product.reorderLevel || 0
                          );

                        const outOfStock =
                          quantity === 0;


                        return (

                          <tr
                            key={product.id}
                            className="border-b last:border-b-0 hover:bg-gray-50"
                          >

                            <td className="px-5 py-4">

                              <p className="font-medium text-sm text-gray-800">
                                {product.name}
                              </p>

                            </td>


                            <td className="px-5 py-4 text-sm text-gray-500">
                              {product.sku}
                            </td>


                            <td className="px-5 py-4 text-right">

                              <span
                                className={`font-semibold ${
                                  outOfStock
                                    ? "text-red-600"
                                    : "text-yellow-600"
                                }`}
                              >
                                {quantity}
                              </span>

                            </td>


                            <td className="px-5 py-4 text-right text-sm text-gray-500">
                              {reorderLevel}
                            </td>


                            <td className="px-5 py-4 text-right">

                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                                  outOfStock
                                    ? "bg-red-50 text-red-700"
                                    : "bg-yellow-50 text-yellow-700"
                                }`}
                              >

                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    outOfStock
                                      ? "bg-red-500"
                                      : "bg-yellow-500"
                                  }`}
                                />

                                {outOfStock
                                  ? "Out of Stock"
                                  : "Low Stock"}

                              </span>

                            </td>

                          </tr>

                        );

                      }
                    )}

                </tbody>

              </table>

            </div>


            {/* MORE PRODUCTS */}

            {lowStockProducts.length > 5 && (

              <div className="px-5 py-3 border-t bg-gray-50">

                <button
                  type="button"
                  onClick={() =>
                    navigate("/products")
                  }
                  className="text-sm font-medium text-gray-700 hover:text-black"
                >

                  View all{" "}
                  {lowStockProducts.length}{" "}
                  low-stock products →

                </button>

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );

};


export default Dashboard;