import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  useCreateCustomerMutation,
} from "../../services/customerApi";

const CustomerForm = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const [
    createCustomer,
    {
      isLoading: isCreating,
    },
  ] = useCreateCustomerMutation();

  const onSubmit = async (data) => {
    try {
      await createCustomer({
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
      }).unwrap();

      reset();
      onClose();

    } catch (error) {
      console.error(error);

      alert(
        error?.data?.message ||
        "Failed to create customer"
      );
    }
  };

  useEffect(() => {
    return () => reset();
  }, [reset]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Add Customer
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Add a new customer to your records
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl"
          >
            ×
          </button>

        </div>


        {/* FORM */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-5"
        >

          {/* NAME */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Customer Name
            </label>

            <input
              {...register("name", {
                required: "Customer name is required",
              })}
              placeholder="Enter customer name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            />

            {errors.name && (
              <p className="text-xs text-red-600 mt-1">
                {errors.name.message}
              </p>
            )}

          </div>


          {/* PHONE */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone
            </label>

            <input
              {...register("phone")}
              placeholder="e.g. 03001234567"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            />

          </div>


          {/* EMAIL */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>

            <input
              type="email"
              {...register("email")}
              placeholder="customer@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            />

          </div>


          {/* BUTTONS */}

          <div className="flex justify-end gap-3 pt-3 border-t">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCreating || isSubmitting}
              className="px-4 py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {isCreating
                ? "Saving..."
                : "Save Customer"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CustomerForm;