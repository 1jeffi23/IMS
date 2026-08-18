import { useState } from "react";

import {
  useGetSuppliersQuery,
} from "../../services/supplierApi";

import SupplierForm from "./SupplierForm";

const Suppliers = () => {

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetSuppliersQuery();

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    editingSupplier,
    setEditingSupplier,
  ] = useState(null);

  const suppliers =
    data?.suppliers || [];


  // Add
  const handleAdd = () => {

    setEditingSupplier(null);
    setShowForm(true);

  };


  // Edit
  const handleEdit = (supplier) => {

    setEditingSupplier(supplier);
    setShowForm(true);

  };


  if (isLoading) {
    return (
      <p className="p-6">
        Loading suppliers...
      </p>
    );
  }


  if (isError) {
    return (
      <p className="p-6">
        Failed to load suppliers:{" "}
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
            Suppliers
          </h1>

          <p className="text-gray-500">
            Manage your shop suppliers
          </p>

        </div>


        <button
          onClick={handleAdd}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Supplier
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
                Phone
              </th>

              <th className="text-left p-3">
                Email
              </th>

              <th className="text-left p-3">
                Address
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

            {suppliers.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="text-center p-6"
                >
                  No suppliers found
                </td>

              </tr>

            ) : (

              suppliers.map((item) => (

                <tr
                  key={item.id}
                  className="border-t"
                >

                  <td className="p-3">
                    {item.name}
                  </td>

                  <td className="p-3">
                    {item.phone || "-"}
                  </td>

                  <td className="p-3">
                    {item.email || "-"}
                  </td>

                  <td className="p-3">
                    {item.address || "-"}
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


      {/* FORM */}

      {showForm && (

        <SupplierForm
          supplier={editingSupplier}

          onClose={() => {
            setShowForm(false);
            setEditingSupplier(null);
          }}
        />

      )}

    </div>
  );
};

export default Suppliers;