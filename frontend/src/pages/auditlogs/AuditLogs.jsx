import React, { useState } from "react";
import {
  VscSearch,
  VscRefresh,
} from "react-icons/vsc";

import { useGetAuditLogsQuery } from "../../services/auditLogApi";
import Loader from "../loader/Loader";

const AuditLogs = () => {
  const {
    data: logs = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAuditLogsQuery();

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");


  // FILTER LOGS


  const filteredLogs = logs.filter((log) => {

    const searchText = search.toLowerCase();

    const matchesSearch =
      log.userName?.toLowerCase().includes(searchText) ||
      log.userEmail?.toLowerCase().includes(searchText) ||
      log.description?.toLowerCase().includes(searchText);

    const matchesAction =
      actionFilter === "all" ||
      log.action === actionFilter;

    const matchesModule =
      moduleFilter === "all" ||
      log.module === moduleFilter;

    return (
      matchesSearch &&
      matchesAction &&
      matchesModule
    );
  });



  // FORMAT DATE


  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };


  return (
    <div className="p-6">

      {/* HEADER */}

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Audit Logs
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor user activities across the system
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          disabled={isFetching}
          className="
            flex items-center gap-2
            rounded-lg
            border border-gray-300
            bg-white
            px-4 py-2.5
            text-sm font-medium
            text-gray-700
            hover:bg-gray-50
            disabled:opacity-50
            cursor-pointer
          "
        >
          <VscRefresh
            size={18}
            className={isFetching ? "animate-spin" : ""}
          />

          Refresh
        </button>

      </div>


      {/* FILTERS */}

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* SEARCH */}

          <div className="relative">

            <VscSearch
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Search user or activity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                rounded-lg
                border border-gray-300
                py-2.5
                pl-10 pr-4
                text-sm
                outline-none
                focus:border-[#6D28D9]
                focus:ring-2
                focus:ring-[#6D28D9]/20
              "
            />

          </div>


          {/* ACTION */}

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="
              rounded-lg
              border border-gray-300
              px-4 py-2.5
              text-sm
              text-gray-700
              outline-none
              focus:border-[#6D28D9]
            "
          >
            <option value="all">
              All Actions
            </option>

            <option value="LOGIN">
              Login
            </option>

            <option value="LOGOUT">
              Logout
            </option>

            <option value="CREATE">
              Create
            </option>

            <option value="UPDATE">
              Update
            </option>

            <option value="DELETE">
              Delete
            </option>
          </select>


          {/* MODULE */}

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="
              rounded-lg
              border border-gray-300
              px-4 py-2.5
              text-sm
              text-gray-700
              outline-none
              focus:border-[#6D28D9]
            "
          >
            <option value="all">
              All Modules
            </option>

            <option value="AUTH">
              Authentication
            </option>

            <option value="PRODUCT">
              Products
            </option>

            <option value="CATEGORY">
              Categories
            </option>

            <option value="BATCH">
              Batches
            </option>

            <option value="SUPPLIER">
              Suppliers
            </option>

            <option value="CUSTOMER">
              Customers
            </option>

            <option value="PURCHASE">
              Purchases
            </option>

            <option value="SALE">
              Sales
            </option>

            <option value="USER">
              Users
            </option>

          </select>

        </div>

      </div>


      {/* ERROR */}

      {isError && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          Failed to load audit logs.
        </div>
      )}


      {/* LOADING */}

      {isLoading ? (

         <Loader text="Loading AuditLogs..." />

      ) : (

        /* TABLE */

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="border-b border-gray-200 bg-gray-50">

                <tr>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Module
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Description
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {filteredLogs.length === 0 ? (

                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-12 text-center text-sm text-gray-500"
                    >
                      No audit logs found.
                    </td>
                  </tr>

                ) : (

                  filteredLogs.map((log) => (

                    <tr
                      key={log.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* USER */}

                      <td className="px-5 py-4">

                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {log.userName || "Unknown User"}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            {log.userEmail || ""}
                          </p>
                        </div>

                      </td>


                      {/* ACTION */}

                      <td className="px-5 py-4">

                        <span className="
                          inline-flex
                          rounded-full
                          bg-gray-100
                          px-2.5 py-1
                          text-xs
                          font-medium
                          text-gray-700
                        ">
                          {log.action}
                        </span>

                      </td>


                      {/* MODULE */}

                      <td className="px-5 py-4">

                        <span className="text-sm text-gray-600">
                          {log.module}
                        </span>

                      </td>


                      {/* DESCRIPTION */}

                      <td className="px-5 py-4">

                        <p className="max-w-md text-sm text-gray-700">
                          {log.description}
                        </p>

                      </td>


                      {/* DATE */}

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {formatDate(log.createdAt)}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
};

export default AuditLogs;