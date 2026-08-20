import {
  Users,
  Pencil,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const SupplierTable = ({
  suppliers,
  hasFilters,
  onEdit,
  onClearFilters,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225">

          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Supplier
              </th>

              <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Phone
              </th>

              <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Email
              </th>

              <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Address
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
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-16 text-center">

                  <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-50 flex items-center justify-center">
                    <Users
                      size={25}
                      className="text-purple-400"
                    />
                  </div>

                  <p className="font-medium text-gray-700 mt-4">
                    No suppliers found
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    {hasFilters
                      ? "Try changing your search or filters."
                      : "Add your first supplier to get started."}
                  </p>

                  {hasFilters && (
                    <button
                      type="button"
                      onClick={onClearFilters}
                      className="mt-4 text-sm font-medium text-purple-600 hover:text-purple-700"
                    >
                      Clear filters
                    </button>
                  )}

                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => {
                const initial =
                  supplier.name
                    ?.charAt(0)
                    ?.toUpperCase() || "S";

                return (
                  <tr
                    key={supplier.id}
                    className="border-b last:border-b-0 hover:bg-purple-50/30 transition"
                  >

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-semibold shrink-0">
                          {initial}
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {supplier.name}
                          </p>

                          <p className="text-xs text-gray-400 mt-0.5">
                            Supplier #{supplier.id}
                          </p>
                        </div>

                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone
                          size={15}
                          className="text-gray-400"
                        />
                        {supplier.phone || "-"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail
                          size={15}
                          className="text-gray-400"
                        />

                        <span className="max-w-55 truncate">
                          {supplier.email || "-"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2 text-sm text-gray-600 max-w-xs">
                        <MapPin
                          size={15}
                          className="text-gray-400 mt-0.5 shrink-0"
                        />

                        <span className="line-clamp-2">
                          {supplier.address || "-"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {supplier.isActive ? (
                        <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onEdit(supplier)}
                        className="inline-flex items-center gap-2 border border-gray-200 bg-white px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 transition"
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

export default SupplierTable;