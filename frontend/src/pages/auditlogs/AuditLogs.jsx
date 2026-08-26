import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCcw,
  ShieldCheck,
  Activity,
  Users,
  FileText,
} from "lucide-react";

import { useGetAuditLogsQuery } from "../../services/auditLogApi";

import Loader from "../loader/Loader";
import ErrorState from "../loader/ErrorState";

import usePagination from "../../components/customHooks/usePagination";
import Pagination from "../../components/customHooks/Pagination";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


const LOGS_PER_PAGE = 10;


const AuditLogs = () => {

  // =====================================================
  // DATA
  // =====================================================

  const {
    data: logs = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAuditLogsQuery();


  // =====================================================
  // STATE
  // =====================================================

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");


  // =====================================================
  // FILTER LOGS
  // =====================================================

  const filteredLogs = useMemo(() => {

    const searchText = search.toLowerCase().trim();

    return logs.filter((log) => {

      const matchesSearch =
        log.userName
          ?.toLowerCase()
          .includes(searchText) ||

        log.userEmail
          ?.toLowerCase()
          .includes(searchText) ||

        log.description
          ?.toLowerCase()
          .includes(searchText);

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

  }, [
    logs,
    search,
    actionFilter,
    moduleFilter,
  ]);


  // =====================================================
  // SUMMARY
  // =====================================================

  const stats = useMemo(() => {

    const uniqueUsers = new Set(
      logs
        .map((log) => log.userEmail)
        .filter(Boolean)
    ).size;

    const loginCount = logs.filter(
      (log) =>
        log.action === "LOGIN"
    ).length;

    const changesCount = logs.filter(
      (log) =>
        ["CREATE", "UPDATE", "DELETE"].includes(
          log.action
        )
    ).length;

    return {
      total: logs.length,
      users: uniqueUsers,
      logins: loginCount,
      changes: changesCount,
    };

  }, [logs]);


  // =====================================================
  // PAGINATION
  // =====================================================

  const {
    currentpage,
    totalPages,
    currentData: currentLogs,
    nextPage,
    prevPage,
    gotoPage,
  } = usePagination(
    filteredLogs,
    LOGS_PER_PAGE
  );


  // =====================================================
  // RESET PAGE WHEN FILTERS CHANGE
  // =====================================================

  useEffect(() => {

    gotoPage(1);

  }, [
    search,
    actionFilter,
    moduleFilter,
  ]);


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString();

  };


  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {

    setSearch("");
    setActionFilter("all");
    setModuleFilter("all");

  };


  const hasFilters =
    search ||
    actionFilter !== "all" ||
    moduleFilter !== "all";


  // =====================================================
  // ACTION STYLE
  // =====================================================

  const getActionStyle = (action) => {

    switch (action) {

      case "LOGIN":
        return "bg-emerald-100 text-emerald-700";

      case "LOGOUT":
        return "bg-orange-100 text-orange-700";

      case "CREATE":
        return "bg-blue-100 text-blue-700";

      case "UPDATE":
        return "bg-purple-100 text-purple-700";

      case "DELETE":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {

    return (
      <Loader text="Loading Audit Logs..." />
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {

    return (
      <ErrorState
        title="Failed to load audit logs"
        message="Something went wrong while fetching audit logs."
      />
    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="space-y-6 p-4 md:p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">

            <ShieldCheck className="h-6 w-6" />

          </div>

          <div>

            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Audit Logs
            </h1>

            <p className="text-sm text-muted-foreground">
              Monitor user activities across the system
            </p>

          </div>

        </div>


        {/* REFRESH */}

        <Button
          variant="outline"
          onClick={refetch}
          disabled={isFetching}
          className="
            w-full
            gap-2
            sm:w-auto
            hover:border-emerald-400
            hover:bg-emerald-50
            hover:text-emerald-600
          "
        >

          <RefreshCcw
            className={`h-4 w-4 ${
              isFetching
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh

        </Button>

      </div>


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL LOGS */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Total Activities
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight">
                  {stats.total.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Recorded system activities
                </p>

              </div>

              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">

                <Activity className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>


        {/* USERS */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Active Users
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight">
                  {stats.users.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Users with recorded activity
                </p>

              </div>

              <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600">

                <Users className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>


        {/* LOGINS */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Login Activities
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">
                  {stats.logins.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Recorded login events
                </p>

              </div>

              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">

                <ShieldCheck className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>


        {/* CHANGES */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Data Changes
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-purple-600">
                  {stats.changes.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Create, update & delete
                </p>

              </div>

              <div className="rounded-xl bg-purple-100 p-2.5 text-purple-600">

                <FileText className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>

      </div>


      {/* =================================================
          FILTER SECTION
      ================================================= */}

      <Card className="border-0 shadow-sm">

        <CardContent className="p-5">

          <div className="mb-4">

            <h2 className="text-base font-semibold">
              Search & Filters
            </h2>

            <p className="text-sm text-muted-foreground">
              Find specific user activities quickly
            </p>

          </div>


          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

            {/* SEARCH */}

            <div className="relative">

              <Search
                className="
                  absolute
                  left-3.5
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <input
                type="text"
                placeholder="Search user or activity..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  py-2.5
                  pl-10
                  pr-4
                  text-sm
                  outline-none
                  transition
                  focus:border-emerald-400
                  focus:ring-4
                  focus:ring-emerald-50
                "
              />

            </div>


            {/* ACTION */}

            <select
              value={actionFilter}
              onChange={(e) =>
                setActionFilter(e.target.value)
              }
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-2.5
                text-sm
                text-gray-700
                outline-none
                transition
                focus:border-emerald-400
                focus:ring-4
                focus:ring-emerald-50
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
              onChange={(e) =>
                setModuleFilter(e.target.value)
              }
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-2.5
                text-sm
                text-gray-700
                outline-none
                transition
                focus:border-emerald-400
                focus:ring-4
                focus:ring-emerald-50
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


          {/* FILTER FOOTER */}

          <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-muted-foreground">

              Showing{" "}

              <span className="font-semibold text-foreground">
                {filteredLogs.length}
              </span>

              {" "}of{" "}

              <span className="font-semibold text-foreground">
                {logs.length}
              </span>

              {" "}activities

            </p>


            {hasFilters && (

              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="
                  w-full
                  sm:w-auto
                  hover:border-emerald-400
                  hover:bg-emerald-50
                  hover:text-emerald-600
                "
              >
                Clear Filters
              </Button>

            )}

          </div>

        </CardContent>

      </Card>


      {/* =================================================
          LOG TABLE
      ================================================= */}

      <Card className="border-0 shadow-sm">

        <CardContent className="p-0">

          {/* TABLE HEADER */}

          <div className="
            flex
            flex-col
            gap-2
            border-b
            p-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          ">

            <div>

              <h2 className="text-lg font-semibold">
                Activity History
              </h2>

              <p className="text-sm text-muted-foreground">
                Detailed record of system activities
              </p>

            </div>

            {hasFilters && (

              <span className="
                w-fit
                rounded-full
                bg-emerald-50
                px-3
                py-1
                text-xs
                font-medium
                text-emerald-600
              ">
                Filters Applied
              </span>

            )}

          </div>


          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left">

              <thead className="border-b bg-gray-50/80">

                <tr>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    User
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Action
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Module
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Description
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Date
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {currentLogs.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="px-5 py-14 text-center"
                    >

                      <div className="
                        mx-auto
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-gray-100
                        text-gray-400
                      ">

                        <Activity className="h-5 w-5" />

                      </div>

                      <p className="mt-3 text-sm font-medium text-gray-700">
                        No audit logs found
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Try adjusting your search or filters.
                      </p>

                    </td>

                  </tr>

                ) : (

                  currentLogs.map((log) => (

                    <tr
                      key={log.id}
                      className="transition hover:bg-gray-50/70"
                    >

                      {/* USER */}

                      <td className="px-5 py-4">

                        <div className="min-w-[180px]">

                          <p className="text-sm font-medium text-gray-900">
                            {log.userName || "Unknown User"}
                          </p>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {log.userEmail || ""}
                          </p>

                        </div>

                      </td>


                      {/* ACTION */}

                      <td className="px-5 py-4">

                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-2.5
                            py-1
                            text-xs
                            font-semibold
                            ${getActionStyle(log.action)}
                          `}
                        >
                          {log.action || "Activity"}
                        </span>

                      </td>


                      {/* MODULE */}

                      <td className="px-5 py-4">

                        <span className="
                          inline-flex
                          rounded-lg
                          bg-gray-100
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          text-gray-600
                        ">
                          {log.module || "-"}
                        </span>

                      </td>


                      {/* DESCRIPTION */}

                      <td className="px-5 py-4">

                        <p className="max-w-md text-sm text-gray-700">
                          {log.description || "-"}
                        </p>

                      </td>


                      {/* DATE */}

                      <td className="whitespace-nowrap px-5 py-4">

                        <p className="text-sm text-gray-600">
                          {formatDate(log.createdAt)}
                        </p>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </CardContent>

      </Card>


      {/* =================================================
          PAGINATION
      ================================================= */}

      {totalPages > 1 && (

        <Pagination
          currentpage={currentpage}
          totalPages={totalPages}
          nextPage={nextPage}
          prevPage={prevPage}
          gotoPage={gotoPage}
        />

      )}

    </div>

  );

};


export default AuditLogs;