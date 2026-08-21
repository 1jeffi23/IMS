import React, { useState } from "react";

import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} from "../../services/userApi";

import {
  useGetUserAuditLogsQuery,
} from "../../services/auditLogApi";

import {
  VscEye,
  VscClose,
  VscHistory,
} from "react-icons/vsc";

import UserTable from "./UserTable";
import ErrorState from "../loader/ErrorState";
import Loader from "../loader/Loader";

const Users = () => {
  
  // USERS
  

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetUsersQuery();

  const [updateUserRole] =
    useUpdateUserRoleMutation();

  
  // STATE
  

  const [selectedRoles, setSelectedRoles] =
    useState({});

  const [selectedUser, setSelectedUser] =
    useState(null);

  // Only the selected/updating user will show loader
  const [updatingUserId, setUpdatingUserId] =
    useState(null);

  const users = data?.users || [];

  
  // USER HISTORY
  

  const {
    data: historyData,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useGetUserAuditLogsQuery(
    selectedUser?.id,
    {
      skip: !selectedUser,
    }
  );

  const auditLogs = Array.isArray(historyData)
    ? historyData
    : historyData?.logs ||
      historyData?.auditLogs ||
      [];

  
  // ROLE CHANGE
  

  const handleRoleChange = (
    userId,
    role
  ) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  
  // UPDATE ROLE
  

  const handleUpdateRole = async (user) => {
    const newRole =
      selectedRoles[user.id] ||
      user.role;

    if (newRole === user.role) {
      return;
    }

    try {
      setUpdatingUserId(user.id);

      await updateUserRole({
        id: user.id,
        role: newRole,
      }).unwrap();

      setSelectedRoles((prev) => {
        const updated = { ...prev };

        delete updated[user.id];

        return updated;
      });
    } catch (error) {
      console.error(
        "Failed to update user role:",
        error
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  
  // AUDIT ACTION STYLE
  

  const getActionStyle = (action) => {
    const value =
      action?.toLowerCase() || "";

    if (
      value.includes("login") ||
      value.includes("sign_in")
    ) {
      return "bg-emerald-100 text-emerald-700";
    }

    if (
      value.includes("logout") ||
      value.includes("sign_out")
    ) {
      return "bg-orange-100 text-orange-700";
    }

    if (
      value.includes("update") ||
      value.includes("edit")
    ) {
      return "bg-blue-100 text-blue-700";
    }

    if (value.includes("delete")) {
      return "bg-red-100 text-red-700";
    }

    if (value.includes("create")) {
      return "bg-purple-100 text-purple-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  
  // FORMAT ACTION
  

  const formatAction = (action) => {
    if (!action) {
      return "Activity";
    }

    return action
      .replaceAll("_", " ")
      .replaceAll("-", " ")
      .replace(
        /\b\w/g,
        (char) => char.toUpperCase()
      );
  };

  
  // LOADING
  

  if (isLoading) {
    return <Loader text="Loading Users..." />;
  }

  
  // ERROR
  

  if (isError) {
    return (
       <ErrorState
         title="Failed to load users"
         message={
           error?.data?.message ||
           "Something went wrong while fetching users."
         }
       />
     );
  
  }

  
  // UI
  

  return (
    <>
      <div className="p-4 sm:p-6">

        {/*
            HEADER
       = */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <VscHistory size={24} />
              </div>

              <div>

                <h1 className="text-2xl font-semibold text-gray-900">
                  Users
                </h1>

                <p className="mt-0.5 text-sm text-gray-500">
                  Manage users, roles and activity history.
                </p>

              </div>

            </div>
          </div>

          {/* USER COUNT */}

          <div className="w-fit rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">

            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Total Users
            </p>

            <p className="mt-0.5 text-xl font-bold text-gray-900">
              {users.length}
            </p>

          </div>

        </div>

        {/*
            USER TABLE
       = */}

        <UserTable
          users={users}
          selectedRoles={selectedRoles}
          updatingUserId={updatingUserId}
          onRoleChange={handleRoleChange}
          onUpdateRole={handleUpdateRole}
          onViewHistory={setSelectedUser}
        />

      </div>

      {/*
          USER HISTORY MODAL
     */}

      {selectedUser && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
            backdrop-blur-sm
          "
          onClick={() =>
            setSelectedUser(null)
          }
        >

          <div
            className="
              flex
              max-h-[85vh]
              w-full
              max-w-3xl
              flex-col
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-700">

                  {selectedUser.name
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    "U"}

                </div>

                <div>

                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedUser.name ||
                      "User"}'s History
                  </h2>

                  <p className="text-xs text-gray-400">
                    {selectedUser.email}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-gray-700
                "
              >
                <VscClose size={21} />
              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="flex-1 overflow-y-auto p-5">

              {isHistoryLoading ? (

                <div className="py-12 text-center">

                  <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600" />

                  <p className="text-sm text-gray-500">
                    Loading activity history...
                  </p>

                </div>

              ) : isHistoryError ? (

                <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">

                  <p className="text-sm font-medium text-red-700">
                    Failed to load user history.
                  </p>

                </div>

              ) : auditLogs.length === 0 ? (

                <div className="py-12 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <VscHistory size={24} />
                  </div>

                  <p className="mt-3 text-sm font-medium text-gray-700">
                    No activity found
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    This user has no recorded activity yet.
                  </p>

                </div>

              ) : (

                <div className="relative">

                  {/* TIMELINE LINE */}

                  <div className="absolute bottom-0 left-5 top-0 w-px bg-gray-200" />

                  <div className="space-y-5">

                    {auditLogs.map(
                      (log, index) => {

                        const action =
                          log.action ||
                          log.event ||
                          log.type ||
                          "Activity";

                        return (

                          <div
                            key={
                              log.id ||
                              index
                            }
                            className="relative flex gap-4"
                          >

                            {/* TIMELINE DOT */}

                            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gray-100">

                              <div
                                className={`
                                  h-2.5
                                  w-2.5
                                  rounded-full
                                  ${
                                    action
                                      .toLowerCase()
                                      .includes("login")
                                      ? "bg-emerald-500"
                                      : action
                                          .toLowerCase()
                                          .includes("logout")
                                        ? "bg-orange-500"
                                        : "bg-purple-500"
                                  }
                                `}
                              />

                            </div>

                            {/* ACTIVITY */}

                            <div className="min-w-0 flex-1 rounded-xl border border-gray-100 bg-gray-50 p-4">

                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                <div className="flex flex-wrap items-center gap-2">

                                  <span
                                    className={`
                                      rounded-full
                                      px-2.5
                                      py-1
                                      text-xs
                                      font-semibold
                                      ${getActionStyle(
                                        action
                                      )}
                                    `}
                                  >
                                    {formatAction(
                                      action
                                    )}
                                  </span>

                                </div>

                                <span className="text-xs text-gray-400">

                                  {log.createdAt
                                    ? new Date(
                                        log.createdAt
                                      ).toLocaleString()
                                    : log.timestamp
                                      ? new Date(
                                          log.timestamp
                                        ).toLocaleString()
                                      : "-"}

                                </span>

                              </div>

                              {/* DESCRIPTION */}

                              {log.description && (

                                <p className="mt-2 text-sm text-gray-600">
                                  {log.description}
                                </p>

                              )}

                              {log.details && (

                                <p className="mt-2 text-xs text-gray-500">

                                  {typeof log.details ===
                                  "string"
                                    ? log.details
                                    : JSON.stringify(
                                        log.details
                                      )}

                                </p>

                              )}

                            </div>

                          </div>

                        );
                      }
                    )}

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </>
  );
};

export default Users;