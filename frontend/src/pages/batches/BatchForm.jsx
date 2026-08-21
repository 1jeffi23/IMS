import { useEffect, useState } from "react";

import {
  useCreateProductBatchMutation,
  useUpdateProductBatchMutation,
} from "../../services/productBatchApi";

import { useGetProductsQuery } from "../../services/productApi";

const BatchForm = ({ batch, onClose }) => {
  const isEditing = Boolean(batch);

  const [formData, setFormData] = useState({
    productId: "",
    batchNumber: "",
    quantity: "",
    costPrice: "",
    receivedDate: "",
    expiryDate: "",
    storageLocation: "",
  });

  const {
    data: productData,
    isLoading: productsLoading,
  } = useGetProductsQuery();

  const products = productData?.products || [];

  const [
    createProductBatch,
    { isLoading: isCreating },
  ] = useCreateProductBatchMutation();

  const [
    updateProductBatch,
    { isLoading: isUpdating },
  ] = useUpdateProductBatchMutation();


  // Fill form when editing

  useEffect(() => {

    if (batch) {

      setFormData({
        productId: batch.productId || "",
        batchNumber: batch.batchNumber || "",
        quantity: batch.quantity ?? "",
        costPrice: batch.costPrice ?? "",
        receivedDate: batch.receivedDate || "",
        expiryDate: batch.expiryDate || "",
        storageLocation:
          batch.storageLocation || "",
      });

    } else {

      setFormData({
        productId: "",
        batchNumber: "",
        quantity: "",
        costPrice: "",
        receivedDate: "",
        expiryDate: "",
        storageLocation: "",
      });

    }

  }, [batch]);

  // Handle change


  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // Submit

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = {
        productId: Number(formData.productId),

        batchNumber:
          formData.batchNumber.trim(),

        quantity: Number(formData.quantity),

        costPrice: Number(formData.costPrice),

        receivedDate:
          formData.receivedDate,

        expiryDate:
          formData.expiryDate || null,

        storageLocation:
          formData.storageLocation.trim() || null,
      };


      if (isEditing) {

        await updateProductBatch({
          id: batch.id,
          ...data,
        }).unwrap();

      } else {

        await createProductBatch(data).unwrap();

      }

      onClose();

    } catch (error) {

      console.error(error);

      alert(
        error?.data?.message ||
          "Failed to save product batch"
      );

    }

  };


  const isSubmitting =
    isCreating || isUpdating;


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-lg w-full max-w-lg p-6">

        {/* HEADER */}

        <div className="flex justify-between mb-6">

          <h2 className="text-xl font-semibold">
            {isEditing
              ? "Edit Product Batch"
              : "Add Product Batch"}
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

          {/* PRODUCT */}

          <div>

            <label className="block mb-1">
              Product
            </label>

            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
              disabled={
                productsLoading || isEditing
              }
              className="w-full border rounded px-3 py-2"
            >

              <option value="">
                Select product
              </option>

              {products
                .filter(
                  (product) =>
                    product.isActive
                )
                .map((product) => (

                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name} ({product.sku})
                  </option>

                ))}

            </select>

          </div>


          {/* BATCH NUMBER */}

          <div>

            <label className="block mb-1">
              Batch Number
            </label>

            <input
              type="text"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. COKE-001"
            />

          </div>


          {/* QUANTITY */}

          <div>

            <label className="block mb-1">
              Quantity
            </label>

            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              required
              className="w-full border rounded px-3 py-2"
            />

          </div>


          {/* COST PRICE */}

          <div>

            <label className="block mb-1">
              Cost Price
            </label>

            <input
              type="number"
              name="costPrice"
              value={formData.costPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="w-full border rounded px-3 py-2"
            />

          </div>


          {/* RECEIVED DATE */}

          <div>

            <label className="block mb-1">
              Received Date
            </label>

            <input
              type="date"
              name="receivedDate"
              value={formData.receivedDate}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />

          </div>


          {/* EXPIRY DATE */}

          <div>

            <label className="block mb-1">
              Expiry Date
            </label>

            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />

          </div>


          {/* STORAGE LOCATION */}

          <div>

            <label className="block mb-1">
              Storage Location
            </label>

            <input
              type="text"
              name="storageLocation"
              value={formData.storageLocation}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Shelf A1"
            />

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
                ? "Update Batch"
                : "Add Batch"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default BatchForm;