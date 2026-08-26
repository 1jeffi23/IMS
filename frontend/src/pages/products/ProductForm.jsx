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

  // =====================================================
  // FILL FORM WHILE EDITING
  // =====================================================

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

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

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

  // =====================================================
  // SUBMIT
  // =====================================================

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

  const isSubmitting =
    isCreating || isUpdating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      {/* MODAL */}

      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing
                ? "Edit Product"
                : "Add Product"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? "Update product information"
                : "Add a new product to your inventory"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            ✕
          </button>

        </div>

        {/* =================================================
            SCROLLABLE FORM AREA
        ================================================= */}

        <div className="overflow-y-auto">

          <form
            onSubmit={handleSubmit}
            className="space-y-4 p-6"
          >

            {/* PRODUCT NAME */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Product Name
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                placeholder="e.g. Coca Cola 500ml"
              />
            </div>

            {/* SKU */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                SKU
              </label>

              <input
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                placeholder="e.g. COKE-500"
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>

              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                disabled={categoriesLoading}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
              >
                <option value="">
                  {categoriesLoading
                    ? "Loading categories..."
                    : "Select category"}
                </option>

                {categories
                  .filter(
                    (category) =>
                      category.isActive
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
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Unit
              </label>

              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
              >
                <option value="piece">
                  Piece
                </option>

                <option value="kg">
                  Kilogram (kg)
                </option>

                <option value="g">
                  Gram (g)
                </option>

                <option value="liter">
                  Liter (L)
                </option>

                <option value="ml">
                  Milliliter (ml)
                </option>

                <option value="pack">
                  Pack
                </option>

                <option value="box">
                  Box
                </option>

                <option value="dozen">
                  Dozen
                </option>
              </select>
            </div>

            {/* SELLING PRICE */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                placeholder="0"
              />
            </div>

            {/* REORDER LEVEL */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Reorder Level
              </label>

              <input
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                placeholder="10"
              />
            </div>

            {/* STORAGE TIME */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Storage Time (days)
              </label>

              <input
                type="number"
                name="storageTime"
                value={formData.storageTime}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                placeholder="e.g. 30"
              />
            </div>

            {/* STATUS */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>

              <select
                name="isActive"
                value={
                  formData.isActive
                    ? "true"
                    : "false"
                }
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
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

            <div className="flex justify-end gap-3 border-t pt-5">

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
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

    </div>
  );
};

export default ProductForm;