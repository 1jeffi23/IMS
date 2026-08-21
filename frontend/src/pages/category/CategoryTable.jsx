const CategoryTable = ({
  categories,
  filteredCategories,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onEdit,
  onDeactivate,
  deactivatingId,
}) => {
  
  // CLEAR FILTERS

  const handleClear = () => {
    setSearch("");
    setStatusFilter("all");
  };

  return (
    <>
      {/*
          SEARCH + FILTER
     = */}

      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">

          {/* SEARCH */}

          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />

              <path d="M20 20l-4-4" />
            </svg>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search category or description..."
              className="w-full border rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border rounded-lg px-4 py-2.5 text-sm bg-white outline-none md:w-48"
          >
            <option value="all">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>

          {/* CLEAR */}

          {(search ||
            statusFilter !== "all") && (
            <button
              onClick={handleClear}
              className="border rounded-lg px-4 py-2.5 text-sm hover:bg-gray-50 transition"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-3 text-xs text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-700">
            {filteredCategories.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-700">
            {categories.length}
          </span>{" "}
          categories
        </div>
      </div>

      {/*
          TABLE
      */}

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">

          <table className="w-full min-w-187.5">

            <thead className="bg-gray-50 border-b">
              <tr>

                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Category
                </th>

                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Description
                </th>

                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Created
                </th>

                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>

                <th className="text-right px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredCategories.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-14 px-5"
                  >

                    <div className="w-12 h-12 mx-auto rounded-xl bg-gray-100 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M4 5h16v14H4z" />
                        <path d="M8 9h8M8 13h5" />
                      </svg>
                    </div>

                    <p className="font-medium text-gray-700 mt-4">
                      No categories found
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      Try changing your search or filter.
                    </p>

                  </td>
                </tr>

              ) : (

                filteredCategories.map((item) => {

                  const isDeactivating =
                    deactivatingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition"
                    >

                      {/* CATEGORY */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
                            {item.name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {item.name}
                            </p>

                            <p className="text-xs text-gray-400 mt-0.5">
                              Category #{item.id}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* DESCRIPTION */}

                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-600 max-w-sm line-clamp-2">
                          {item.description ||
                            "No description"}
                        </p>
                      </td>

                      {/* CREATED */}

                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-600">
                          {item.createdAt
                            ? new Date(
                                item.createdAt
                              ).toLocaleDateString(
                                "en-PK",
                                {
                                  dateStyle: "medium",
                                }
                              )
                            : "-"}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        {item.isActive ? (

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700">

                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />

                            Active

                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">

                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />

                            Inactive

                          </span>

                        )}

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end items-center gap-2">

                          <button
                            onClick={() =>
                              onEdit(item)
                            }
                            className="border border-gray-200 px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
                          >
                            Edit
                          </button>

                          {item.isActive && (
                            <button
                              disabled={
                                isDeactivating
                              }
                              onClick={() =>
                                onDeactivate(
                                  item.id
                                )
                              }
                              className="border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-sm hover:bg-red-50 transition disabled:opacity-50"
                            >
                              {isDeactivating
                                ? "..."
                                : "Deactivate"}
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>
        </div>
      </div>
    </>
  );
};

export default CategoryTable;