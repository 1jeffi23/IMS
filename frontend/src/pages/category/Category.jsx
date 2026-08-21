import { useState } from "react";

import {
  useGetCategoriesQuery,
  useDeactivateCategoryMutation,
} from "../../services/categoryApi";

import CategoryForm from "./CategoryForm";
import CategoryTable from "./CategoryTable";
import ErrorState from "../loader/ErrorState";
import Loader from "../loader/Loader";

const Category = () => {

  // DATA


  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCategoriesQuery();

  const [
    deactivateCategory,
    { isLoading: isDeactivating },
  ] = useDeactivateCategoryMutation();

  const categories = data?.categories || [];


  // STATE


  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [deactivatingId, setDeactivatingId] = useState(null);


  // SUMMARY


  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.isActive
  ).length;

  const inactiveCategories = categories.filter(
    (category) => !category.isActive
  ).length;


  // ADD


  const handleAdd = () => {
    setEditingCategory(null);
    setShowForm(true);
  };


  // EDIT


  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };


  // DEACTIVATE


  const handleDeactivate = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this category?"
    );

    if (!confirmed) return;

    try {
      setDeactivatingId(id);

      await deactivateCategory(id).unwrap();
    } catch (error) {
      console.error(
        "Failed to deactivate category:",
        error
      );

      alert(
        error?.data?.message ||
          "Failed to deactivate category"
      );
    } finally {
      setDeactivatingId(null);
    }
  };


  // FILTER


  const filteredCategories = categories.filter(
    (category) => {
      const searchText = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchText ||
        category.name
          ?.toLowerCase()
          .includes(searchText) ||
        category.description
          ?.toLowerCase()
          .includes(searchText);

      let matchesStatus = true;

      if (statusFilter === "active") {
        matchesStatus =
          category.isActive === true;
      }

      if (statusFilter === "inactive") {
        matchesStatus =
          category.isActive === false;
      }

      return matchesSearch && matchesStatus;
    }
  );


  // LOADING


  if (isLoading) {
    return <Loader text="Loading Categories..." />;
  }


  // ERROR


  if (isError) {
    return (
    <ErrorState
      title="Failed to load categories"
      message={
        error?.data?.message ||
        "Something went wrong while fetching categories."
      }
    />
  );
  }


  // UI

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-8xl mx-auto space-y-6">

        {/* 
            HEADER
        = */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Categories
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Organize and manage your product categories
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-sm"
          >
            <span className="text-lg leading-none">
              +
            </span>

            Add Category
          </button>
        </div>

        {/* 
            SUMMARY CARDS
        = */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* TOTAL */}

          <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Categories
                </p>

                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  {totalCategories}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  All categories
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 5h16v14H4z" />
                  <path d="M8 9h8M8 13h5" />
                </svg>
              </div>
            </div>
          </div>

          {/* ACTIVE */}

          <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Active Categories
                </p>

                <p className="text-3xl font-semibold text-green-600 mt-2">
                  {activeCategories}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Currently available
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12l4 4L19 6" />
                </svg>
              </div>
            </div>
          </div>

          {/* INACTIVE */}

          <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Inactive Categories
                </p>

                <p className="text-3xl font-semibold text-gray-500 mt-2">
                  {inactiveCategories}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Currently disabled
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  />

                  <path d="M8 12h8" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 
            TABLE + SEARCH
        = */}

        <CategoryTable
          categories={categories}
          filteredCategories={filteredCategories}
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onEdit={handleEdit}
          onDeactivate={handleDeactivate}
          deactivatingId={deactivatingId}
          isDeactivating={isDeactivating}
        />
      </div>

      {/* 
          FORM
      = */}

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
};

export default Category;