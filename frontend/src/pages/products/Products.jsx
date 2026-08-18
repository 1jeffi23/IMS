import { useState } from "react";

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

  const products = data?.products || [];

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
    return <p>Loading products...</p>;
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (isError) {
    return (
      <p>
        Failed to load products:{" "}
        {error?.data?.message ||
          "Something went wrong"}
      </p>
    );
  }

  return (
    <div className="p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-semibold">
            Products
          </h1>

          <p className="text-gray-500">
            Manage your shop products
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Product
        </button>

      </div>


      {/* TABLE */}

      <div className="border rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-3">
                Name
              </th>

              <th className="text-left p-3">
                SKU
              </th>

              <th className="text-left p-3">
                Category
              </th>

              <th className="text-left p-3">
                Selling Price
              </th>

              <th className="text-left p-3">
                Stock
              </th>

              <th className="text-left p-3">
                Status
              </th>

              <th className="text-left p-3">
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {products.length === 0 ? (

              <tr>
                <td
                  colSpan="7"
                  className="text-center p-6"
                >
                  No products found
                </td>
              </tr>

            ) : (

              products.map((item) => (

                <tr
                  key={item.id}
                  className="border-t"
                >

                  <td className="p-3">
                    {item.name}
                  </td>

                  <td className="p-3">
                    {item.sku}
                  </td>

                  <td className="p-3">
                    {item.categoryName}
                  </td>

                  <td className="p-3">
                    Rs. {item.sellingPrice}
                  </td>

                  <td className="p-3">
                    {item.quantity} {item.unit}
                  </td>

                  <td className="p-3">

                    {item.isActive ? (
                      <span className="text-green-600">
                        Active
                      </span>
                    ) : (
                      <span className="text-gray-500">
                        Inactive
                      </span>
                    )}

                  </td>

                  <td className="p-3">

                    <button
                      onClick={() =>
                        handleEdit(item)
                      }
                      className="border px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>


      {/* PRODUCT FORM */}

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