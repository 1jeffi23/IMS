import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  History,
  LogIn,
  LogOut,
  ArrowLeft,
} from "lucide-react";

import { useGetUserAuditLogsQuery } from "../../services/auditLogApi";

import usePagination from "../../components/customHooks/usePagination";
import Pagination from "../../components/customHooks/Pagination";

const LOGS_PER_PAGE = 7;

const UserHistory = () => {

  const { userId } = useParams();
  const navigate = useNavigate();

  console.log("USER HISTORY COMPONENT LOADED");
  console.log("User ID:", userId);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetUserAuditLogsQuery(userId);

  console.log("History API data:", data);
  console.log("History API error:", error);

  const logs = Array.isArray(data)
    ? data
    : data?.logs ||
      data?.auditLogs ||
      [];

  console.log("Processed logs:", logs);

  // =====================================================
  // COUNTS
  // =====================================================

  const loginCount = logs.filter(
    (log) =>
      log.action?.toUpperCase() === "LOGIN"
  ).length;

  const logoutCount = logs.filter(
    (log) =>
      log.action?.toUpperCase() === "LOGOUT"
  ).length;

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
    logs,
    LOGS_PER_PAGE
  );

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <div className="p-6">

        <div className="
          flex
          min-h-60
          items-center
          justify-center
        ">

          <div className="text-center">

            <div className="
              mx-auto
              mb-3
              h-8
              w-8
              animate-spin
              rounded-full
              border-4
              border-gray-200
              border-t-emerald-600
            " />

            <p className="text-sm text-gray-500">
              Loading user history...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {

    console.error(
      "User history error:",
      error
    );

    return (
      <div className="p-6">

        <div className="
          rounded-2xl
          border
          border-red-200
          bg-red-50
          p-6
          text-center
        ">

          <p className="
            text-sm
            font-medium
            text-red-700
          ">
            Unable to load user history.
          </p>

          <p className="
            mt-1
            text-xs
            text-red-500
          ">
            {error?.data?.message ||
              "Something went wrong while fetching activity history."}
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6 p-4 md:p-6">

      <div className="mx-auto max-w-8xl space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        ">

          <div>

            <div className="flex items-center gap-3">

              <div className="
                rounded-xl
                bg-emerald-100
                p-2.5
                text-emerald-600
              ">

                <History className="h-6 w-6" />

              </div>

              <div>

                <h1 className="
                  text-2xl
                  font-bold
                  tracking-tight
                  md:text-3xl
                ">
                  User History
                </h1>

                <p className="text-sm text-muted-foreground">
                  View user activity and login history
                </p>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={() => navigate("/users")}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-gray-700
              transition
              hover:border-emerald-400
              hover:bg-emerald-50
              hover:text-emerald-600
              sm:w-auto
            "
          >

            <ArrowLeft className="h-4 w-4" />

            Back to Users

          </button>

        </div>


        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-3
        ">

          {/* TOTAL */}

          <div className="
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-5
            shadow-sm
          ">

            <div className="
              flex
              items-start
              justify-between
            ">

              <div>

                <p className="
                  text-sm
                  font-medium
                  text-muted-foreground
                ">
                  Total Activities
                </p>

                <p className="
                  mt-2
                  text-2xl
                  font-bold
                ">
                  {logs.length}
                </p>

                <p className="
                  mt-1
                  text-xs
                  text-muted-foreground
                ">
                  Recorded activities
                </p>

              </div>

              <div className="
                rounded-xl
                bg-emerald-100
                p-2.5
                text-emerald-600
              ">

                <History className="h-5 w-5" />

              </div>

            </div>

          </div>


          {/* LOGIN */}

          <div className="
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-5
            shadow-sm
          ">

            <div className="
              flex
              items-start
              justify-between
            ">

              <div>

                <p className="
                  text-sm
                  font-medium
                  text-muted-foreground
                ">
                  Login Count
                </p>

                <p className="
                  mt-2
                  text-2xl
                  font-bold
                  text-emerald-600
                ">
                  {loginCount}
                </p>

                <p className="
                  mt-1
                  text-xs
                  text-muted-foreground
                ">
                  Successful logins
                </p>

              </div>

              <div className="
                rounded-xl
                bg-emerald-100
                p-2.5
                text-emerald-600
              ">

                <LogIn className="h-5 w-5" />

              </div>

            </div>

          </div>


          {/* LOGOUT */}

          <div className="
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-5
            shadow-sm
          ">

            <div className="
              flex
              items-start
              justify-between
            ">

              <div>

                <p className="
                  text-sm
                  font-medium
                  text-muted-foreground
                ">
                  Logout Count
                </p>

                <p className="
                  mt-2
                  text-2xl
                  font-bold
                  text-orange-600
                ">
                  {logoutCount}
                </p>

                <p className="
                  mt-1
                  text-xs
                  text-muted-foreground
                ">
                  Recorded logouts
                </p>

              </div>

              <div className="
                rounded-xl
                bg-orange-100
                p-2.5
                text-orange-600
              ">

                <LogOut className="h-5 w-5" />

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            HISTORY TABLE
        ================================================= */}

        <div className="
          overflow-hidden
          rounded-2xl
          border
          border-gray-100
          bg-white
          shadow-sm
        ">

          {/* HEADER */}

          <div className="
            flex
            flex-col
            gap-2
            border-b
            border-gray-100
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
                Complete activity record for this user
              </p>

            </div>

            <div className="
              rounded-full
              bg-emerald-50
              px-3
              py-1.5
              text-xs
              font-medium
              text-emerald-600
            ">

              {logs.length}{" "}
              {logs.length === 1
                ? "Activity"
                : "Activities"}

            </div>

          </div>


          {/* EMPTY */}

          {logs.length === 0 ? (

            <div className="p-12 text-center">

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

                <History className="h-6 w-6" />

              </div>

              <p className="
                mt-3
                text-sm
                font-medium
                text-gray-700
              ">
                No activity history found.
              </p>

              <p className="
                mt-1
                text-xs
                text-gray-400
              ">
                This user has no recorded activity yet.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="
                w-full
                min-w-225
                text-left
              ">

                <thead className="
                  border-b
                  border-gray-200
                  bg-gray-50
                ">

                  <tr>

                    <th className="
                      px-5
                      py-4
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    ">
                      Date & Time
                    </th>

                    <th className="
                      px-5
                      py-4
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    ">
                      Action
                    </th>

                    <th className="
                      px-5
                      py-4
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    ">
                      Module
                    </th>

                    <th className="
                      px-5
                      py-4
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    ">
                      Description
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {currentLogs.map((log) => (

                    <tr
                      key={log.id}
                      className="
                        transition
                        hover:bg-gray-50
                      "
                    >

                      {/* DATE */}

                      <td className="
                        px-5
                        py-4
                        text-sm
                        text-gray-500
                      ">

                        {log.createdAt
                          ? new Date(
                              log.createdAt
                            ).toLocaleString()
                          : "-"}

                      </td>


                      {/* ACTION */}

                      <td className="px-5 py-4">

                        <span className="
                          inline-flex
                          rounded-full
                          bg-emerald-50
                          px-2.5
                          py-1
                          text-xs
                          font-semibold
                          text-emerald-700
                        ">

                          {log.action || "Activity"}

                        </span>

                      </td>


                      {/* MODULE */}

                      <td className="
                        px-5
                        py-4
                        text-sm
                        text-gray-600
                      ">

                        {log.module || "-"}

                      </td>


                      {/* DESCRIPTION */}

                      <td className="
                        max-w-md
                        px-5
                        py-4
                        text-sm
                        text-gray-600
                      ">

                        {log.description || "-"}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>


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

    </div>
  );
};

export default UserHistory;