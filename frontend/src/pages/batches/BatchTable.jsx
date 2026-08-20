import {
  Boxes,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Search,
  Pencil,
  Trash2,
  MapPin,
  Package,
} from "lucide-react";

const BatchTable = ({
  batches,
  filteredBatches,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  getBatchStatus,
  handleEdit,
  handleDelete,
  isDeleting,
}) => {
  // Status label
  const getStatusLabel = (status) => {
    if (status === "expired") return "Expired";
    if (status === "expiring") return "Expiring Soon";
    return "OK";
  };

  // Status style
  const getStatusStyle = (status) => {
    if (status === "expired") {
      return "bg-red-50 text-red-700 border-red-100";
    }

    if (status === "expiring") {
      return "bg-orange-50 text-orange-700 border-orange-100";
    }

    return "bg-green-50 text-green-700 border-green-100";
  };

  return (
    <>
      {/* Search and filter */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-5">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search product, SKU or batch number..."
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none bg-white focus:border-gray-400 cursor-pointer lg:w-52"
          >
            <option value="all">
              All Status
            </option>

            <option value="ok">
              OK
            </option>

            <option value="expiring">
              Expiring Soon
            </option>

            <option value="expired">
              Expired
            </option>
          </select>

          {(search || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredBatches.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {batches.length}
            </span>{" "}
            batches
          </p>

          {statusFilter !== "all" && (
            <span className="text-xs text-gray-500">
              Filter:{" "}
              <span className="font-medium text-gray-700">
                {getStatusLabel(statusFilter)}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-287.5">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Product
                </th>

                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  SKU
                </th>

                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Batch
                </th>

                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Quantity
                </th>

                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Cost Price
                </th>

                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Received
                </th>

                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Expiry
                </th>

                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>

                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Location
                </th>

                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredBatches.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-16"
                  >
                    <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                      <Boxes
                        size={25}
                        className="text-gray-400"
                      />
                    </div>

                    <p className="font-medium text-gray-700 mt-4">
                      No batches found
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      Try changing your search or filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBatches.map((batch) => {
                  const status =
                    getBatchStatus(batch);

                  return (
                    <tr
                      key={batch.id}
                      className={`border-b last:border-b-0 transition ${
                        status === "expired"
                          ? "bg-red-50/40 hover:bg-red-50"
                          : status === "expiring"
                          ? "bg-orange-50/20 hover:bg-orange-50/50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              status === "expired"
                                ? "bg-red-100 text-red-600"
                                : status === "expiring"
                                ? "bg-orange-100 text-orange-600"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            <Package size={17} />
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {batch.productName}
                            </p>

                            <p className="text-xs text-gray-400 mt-0.5">
                              Product #{batch.productId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-600">
                          {batch.sku || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-mono text-xs">
                          {batch.batchNumber}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-semibold text-gray-800">
                          {batch.quantity}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-gray-700">
                          Rs.{" "}
                          {Number(
                            batch.costPrice || 0
                          ).toLocaleString("en-PK")}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-600">
                          {batch.receivedDate || "-"}
                        </span>
                      </td>

                      <td
                        className={`px-5 py-4 text-sm ${
                          status === "expired"
                            ? "text-red-600 font-semibold"
                            : status === "expiring"
                            ? "text-orange-600 font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {batch.expiryDate || "No expiry"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium ${getStatusStyle(
                            status
                          )}`}
                        >
                          {status === "expired" && (
                            <AlertTriangle size={13} />
                          )}

                          {status === "expiring" && (
                            <Clock3 size={13} />
                          )}

                          {status === "ok" && (
                            <CheckCircle2 size={13} />
                          )}

                          {getStatusLabel(status)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <MapPin
                            size={14}
                            className="text-gray-400"
                          />

                          {batch.storageLocation || "-"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(batch)
                            }
                            className="inline-flex items-center gap-1.5 border border-gray-200 bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() =>
                              handleDelete(batch.id)
                            }
                            className="inline-flex items-center gap-1.5 border border-red-100 bg-white text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={14} />

                            {isDeleting
                              ? "Deleting..."
                              : "Delete"}
                          </button>
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

export default BatchTable;