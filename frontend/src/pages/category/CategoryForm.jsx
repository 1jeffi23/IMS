import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "../../services/categoryApi";

const CategoryForm = ({ category, onClose }) => {
  const isEditing = Boolean(category);

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();

  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const isSubmitting =
    isCreating || isUpdating;


  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });


  useEffect(() => {
    if (category) {
      reset({
        name: category.name || "",
        description: category.description || "",
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [category, reset]);


  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateCategory({
          id: category.id,
          name: data.name.trim(),
          description: data.description?.trim() || "",
        }).unwrap();
      } else {
        await createCategory({
          name: data.name.trim(),
          description: data.description?.trim() || "",
        }).unwrap();
      }

      onClose();

    } catch (error) {
      console.error(error);

      setError("name", {
        type: "server",
        message:
          error?.data?.message ||
          "Failed to save category",
      });
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">

        {/* HEADER */}

        <div className="flex items-center justify-between px-6 py-5 border-b">

          <div>

            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing
                ? "Edit Category"
                : "Add Category"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {isEditing
                ? "Update category information"
                : "Create a new product category"}
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            ✕
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
              Category Name
            </label>

            <input
              type="text"
              placeholder="e.g. Beverages"
              {...register("name", {
                required:
                  "Category name is required",
              })}
              className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-gray-200 ${
                errors.name
                  ? "border-red-400"
                  : "border-gray-300"
              }`}
            />

            {errors.name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}

          </div>


          {/* DESCRIPTION */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
              <span className="text-gray-400 font-normal">
                {" "}
                (optional)
              </span>
            </label>

            <textarea
              rows="4"
              placeholder="Describe this category..."
              {...register("description")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-gray-200 resize-none"
            />

          </div>


          {/* ACTIONS */}

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="border border-gray-300 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >

              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update Category"
                : "Create Category"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CategoryForm;