import { useEffect, useState } from "react";

import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from "../../services/supplierApi";

const SupplierForm = ({
  supplier,
  onClose,
}) => {
  const isEditing = Boolean(supplier);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    isActive: true,
  });

  const [
    createSupplier,
    { isLoading: isCreating },
  ] = useCreateSupplierMutation();

  const [
    updateSupplier,
    { isLoading: isUpdating },
  ] = useUpdateSupplierMutation();


  // Fill form
  useEffect(() => {

    if (supplier) {

      setFormData({
        name: supplier.name ?? "",
        phone: supplier.phone ?? "",
        email: supplier.email ?? "",
        address: supplier.address ?? "",
        isActive:
          supplier.isActive ?? true,
      });

    } else {

      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        isActive: true,
      });

    }

  }, [supplier]);


  // Handle change
  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

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
        name: formData.name.trim(),

        phone:
          formData.phone.trim() || null,

        email:
          formData.email.trim() || null,

        address:
          formData.address.trim() || null,

        isActive:
          formData.isActive,
      };


      if (isEditing) {

        await updateSupplier({
          id: supplier.id,
          ...data,
        }).unwrap();

      } else {

        await createSupplier(data)
          .unwrap();

      }

      onClose();

    } catch (error) {

      console.error(error);

      alert(
        error?.data?.message ||
          "Failed to save supplier"
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
              ? "Edit Supplier"
              : "Add Supplier"}

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

          {/* NAME */}

          <div>

            <label className="block mb-1">
              Supplier Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Pepsi Distributor"
            />

          </div>


          {/* PHONE */}

          <div>

            <label className="block mb-1">
              Phone
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="03001234567"
            />

          </div>


          {/* EMAIL */}

          <div>

            <label className="block mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="supplier@example.com"
            />

          </div>


          {/* ADDRESS */}

          <div>

            <label className="block mb-1">
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded px-3 py-2"
              placeholder="Supplier address"
            />

          </div>


          {/* STATUS */}

          <div>

            <label className="block mb-1">
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
                ? "Update Supplier"
                : "Add Supplier"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default SupplierForm;