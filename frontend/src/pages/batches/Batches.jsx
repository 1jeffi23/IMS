import { useState } from "react";

import {
  useGetProductBatchesQuery,
  useDeleteProductBatchMutation,
} from "../../services/productBatchApi";

import BatchForm from "./BatchForm";

const Batches = () => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetProductBatchesQuery();

  const [
    deleteProductBatch,
    { isLoading: isDeleting },
  ] = useDeleteProductBatchMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);

  const batches = data?.batches || [];

  // ==========================================
  // Add
  // ==========================================

  const handleAdd = () => {
    setEditingBatch(null);
    setShowForm(true);
  };

  // ==========================================
  // Edit
  // ==========================================

  const handleEdit = (batch) => {
    setEditingBatch(batch);
    setShowForm(true);
  };

  // ==========================================
  // Delete
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this batch?"
    );

    if (!confirmed) return;

    try {
      await deleteProductBatch(id).unwrap();
    } catch (error) {
      console.error(error);

      alert(
        error?.data?.message ||
          "Failed to delete batch"
      );
    }
  };

  if (isLoading) {
    return <p className="p-6">Loading batches...</p>;
  }

  if (isError) {
    return (
      <p className="p-6">
        Failed to load batches:{" "}
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
            Product Batches
          </h1>

          <p className="text-gray-500">
            Manage product stock batches
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Batch
        </button>

      </div>


      {/* TABLE */}

      <div className="border rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-3">
                Product
              </th>

              <th className="text-left p-3">
                SKU
              </th>

              <th className="text-left p-3">
                Batch Number
              </th>

              <th className="text-left p-3">
                Quantity
              </th>

              <th className="text-left p-3">
                Cost Price
              </th>

              <th className="text-left p-3">
                Received Date
              </th>

              <th className="text-left p-3">
                Expiry Date
              </th>

              <th className="text-left p-3">
                Location
              </th>

              <th className="text-left p-3">
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {batches.length === 0 ? (

              <tr>

                <td
                  colSpan="9"
                  className="text-center p-6"
                >
                  No batches found
                </td>

              </tr>

            ) : (

              batches.map((batch) => (

                <tr
                  key={batch.id}
                  className="border-t"
                >

                  <td className="p-3">
                    {batch.productName}
                  </td>

                  <td className="p-3">
                    {batch.sku}
                  </td>

                  <td className="p-3">
                    {batch.batchNumber}
                  </td>

                  <td className="p-3">
                    {batch.quantity}
                  </td>

                  <td className="p-3">
                    Rs. {batch.costPrice}
                  </td>

                  <td className="p-3">
                    {batch.receivedDate}
                  </td>

                  <td className="p-3">
                    {batch.expiryDate || "-"}
                  </td>

                  <td className="p-3">
                    {batch.storageLocation || "-"}
                  </td>

                  <td className="p-3">

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          handleEdit(batch)
                        }
                        className="border px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        disabled={isDeleting}
                        onClick={() =>
                          handleDelete(batch.id)
                        }
                        className="border px-3 py-1 rounded text-red-600"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>


      {/* FORM */}

      {showForm && (
        <BatchForm
          batch={editingBatch}
          onClose={() => {
            setShowForm(false);
            setEditingBatch(null);
          }}
        />
      )}

    </div>
  );
};

export default Batches;