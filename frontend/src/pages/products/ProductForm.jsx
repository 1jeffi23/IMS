import { useEffect, useState } from "react";

import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../services/productApi";

import { useGetCategoriesQuery } from "../../services/categoryApi";

const ProductForm = ({ product, onClose }) => {
  const isEditing = Boolean(product);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    categoryId: "",
    unit: "piece",
    sellingPrice: "",
    reorderLevel: 10,
    storageTime: "",
    isActive: true,
  });

  const {
    data: categoryData,
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery();

  const categories = categoryData?.categories || [];

  const [createProduct, { isLoading: isCreating }] =
    useCreateProductMutation();

  const [updateProduct, { isLoading: isUpdating }] =
    useUpdateProductMutation();

  // Fill form while editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name ?? "",
        sku: product.sku ?? "",
        categoryId: product.categoryId ?? "",
        unit: product.unit ?? "piece",
        sellingPrice: product.sellingPrice ?? "",
        reorderLevel: product.reorderLevel ?? 10,
        storageTime: product.storageTime ?? "",
        isActive: product.isActive ?? true,
      });
    } else {
      setFormData({
        name: "",
        sku: "",
        categoryId: "",
        unit: "piece",
        sellingPrice: "",
        reorderLevel: 10,
        storageTime: "",
        isActive: true,
      });
    }
  }, [product]);

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "isActive"
          ? value === "true"
          : value,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        name: formData.name,
        sku: formData.sku,
        categoryId: Number(formData.categoryId),
        unit: formData.unit,
        sellingPrice: Number(formData.sellingPrice),
        reorderLevel: Number(formData.reorderLevel),

        storageTime:
          formData.storageTime === ""
            ? null
            : Number(formData.storageTime),

        // IMPORTANT
        isActive: formData.isActive,
      };

      console.log("Product data being sent:", data);

      if (isEditing) {
        await updateProduct({
          id: product.id,
          ...data,
        }).unwrap();
      } else {
        await createProduct(data).unwrap();
      }

      onClose();
    } catch (error) {
      console.error("PRODUCT SAVE ERROR:", error);

      alert(
        error?.data?.message ||
          "Failed to save product"
      );
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-lg w-full max-w-lg p-6">

        {/* HEADER */}

        <div className="flex justify-between mb-6">

          <h2 className="text-xl font-semibold">
            {isEditing
              ? "Edit Product"
              : "Add Product"}
          </h2>

          <button
            type="button"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* PRODUCT NAME */}

          <div>
            <label className="block mb-1">
              Product Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Coca Cola 500ml"
            />
          </div>

          {/* SKU */}

          <div>
            <label className="block mb-1">
              SKU
            </label>

            <input
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. COKE-500"
            />
          </div>

          {/* CATEGORY */}

          <div>
            <label className="block mb-1">
              Category
            </label>

            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              disabled={categoriesLoading}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">
                Select category
              </option>

              {categories
                .filter(
                  (category) => category.isActive
                )
                .map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          {/* UNIT */}

          <div>
            <label className="block mb-1">
              Unit
            </label>

            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="piece">
                Piece
              </option>

              <option value="pack">
                Pack
              </option>

              <option value="bottle">
                Bottle
              </option>

              <option value="box">
                Box
              </option>

              <option value="kg">
                Kg
              </option>

              <option value="liter">
                Liter
              </option>
            </select>
          </div>

          {/* SELLING PRICE */}

          <div>
            <label className="block mb-1">
              Selling Price
            </label>

            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* REORDER LEVEL */}

          <div>
            <label className="block mb-1">
              Reorder Level
            </label>

            <input
              type="number"
              name="reorderLevel"
              value={formData.reorderLevel}
              onChange={handleChange}
              min="0"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* STORAGE TIME */}

          <div>
            <label className="block mb-1">
              Storage Time (days)
            </label>

            <input
              type="number"
              name="storageTime"
              value={formData.storageTime}
              onChange={handleChange}
              min="0"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* STATUS */}

          <div>
            <label className="block mb-1">
              Status
            </label>

            <select
              name="isActive"
              value={formData.isActive ? "true" : "false"}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="true">
                Active
              </option>

              <option value="false">
                Inactive
              </option>
            </select>
          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-4 py-2 rounded"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Product"
                : "Add Product"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default ProductForm;