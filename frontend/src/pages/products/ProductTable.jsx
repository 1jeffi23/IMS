import {
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Pencil,
} from "lucide-react";

const ProductTable = ({
  products,
  getStockStatus,
  onEdit,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Product
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                SKU
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Category
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Selling Price
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Stock
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Stock Status
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Status
              </th>
              <th className="text-right px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-16">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Package size={26} className="text-gray-400" />
                  </div>

                  <p className="font-semibold text-gray-700 mt-4">
                    No products found
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    Try changing your search or filters.
                  </p>
                </td>
              </tr>
            ) : (
              products.map((item) => {
                const stockStatus = getStockStatus(item);

                const isWarning =
                  item.isActive &&
                  (stockStatus === "low" ||
                    stockStatus === "out");

                return (
                  <tr
                    key={item.id}
                    className={`border-b last:border-b-0 transition-colors duration-150 hover:bg-blue-50/40 ${
                      isWarning ? "bg-red-50/20" : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            stockStatus === "out"
                              ? "bg-red-100 text-red-600"
                              : stockStatus === "low"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <Package size={18} />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.name}
                          </p>

                          <p className="text-xs text-gray-400 mt-0.5">
                            ID #{item.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex bg-gray-100 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600">
                        {item.sku}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.categoryName ? (
                        <span className="inline-flex bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                          {item.categoryName}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-800">
                        Rs.{" "}
                        {Number(
                          item.sellingPrice || 0
                        ).toLocaleString("en-PK")}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <p
                        className={`font-semibold ${
                          stockStatus === "out"
                            ? "text-red-600"
                            : stockStatus === "low"
                            ? "text-orange-600"
                            : "text-gray-900"
                        }`}
                      >
                        {item.quantity}{" "}
                        <span className="font-normal text-gray-400">
                          {item.unit}
                        </span>
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Reorder at {item.reorderLevel}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      {stockStatus === "in" && (
                        <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                          <CheckCircle2 size={14} />
                          In Stock
                        </span>
                      )}

                      {stockStatus === "low" && (
                        <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700">
                          <AlertTriangle size={14} />
                          Low Stock
                        </span>
                      )}

                      {stockStatus === "out" && (
                        <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                          <XCircle size={14} />
                          Out of Stock
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {item.isActive ? (
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-green-700">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-500">
                          <span className="w-2 h-2 rounded-full bg-gray-400" />
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="inline-flex items-center gap-2 border border-gray-200 bg-white px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;