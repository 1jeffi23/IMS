import React from "react";

import {
  VscHistory,
  VscCheck,
  VscEye,
} from "react-icons/vsc";

const UserTable = ({
  users,
  selectedRoles,
  updatingUserId,
  onRoleChange,
  onUpdateRole,
  onViewHistory,
}) => {

  
  // ROLE STYLE
  

  const getRoleStyle = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700 border-purple-200";

      case "manager":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "cashier":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";

      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  
  // TABLE
  

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="w-full min-w-212.5 text-left">

          {/* TABLE HEADER */}

          <thead className="border-b border-gray-200 bg-gray-50">

            <tr>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                User
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Role
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Created
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>

            </tr>

          </thead>

          {/* TABLE BODY */}

          <tbody className="divide-y divide-gray-100">

            {users.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="px-5 py-12 text-center"
                >

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <VscHistory size={23} />
                  </div>

                  <p className="mt-3 text-sm font-medium text-gray-700">
                    No users found
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    There are no users to display.
                  </p>

                </td>

              </tr>

            ) : (

              users.map((user) => {

                const selectedRole =
                  selectedRoles[user.id] ||
                  user.role;

                const hasChanged =
                  selectedRole !== user.role;

                const isUserUpdating =
                  updatingUserId === user.id;

                return (

                  <tr
                    key={user.id}
                    className="group transition hover:bg-gray-50"
                  >

                    {/* USER */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            flex h-10 w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-linear-to-br
                            from-gray-800
                            to-gray-950
                            text-sm
                            font-bold
                            text-white
                            shadow-sm
                          "
                        >
                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-gray-900">
                            {user.name ||
                              "Unknown"}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            User ID:{" "}
                            {String(user.id).slice(
                              0,
                              8
                            )}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* EMAIL */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-gray-600">
                        {user.email}
                      </span>

                    </td>

                    {/* ROLE */}

                    <td className="px-5 py-4">

                      <div className="flex flex-wrap items-center gap-2">

                        <select
                          value={selectedRole}
                          disabled={isUserUpdating}
                          onChange={(e) =>
                            onRoleChange(
                              user.id,
                              e.target.value
                            )
                          }
                          className="
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            px-3
                            py-2
                            text-sm
                            font-medium
                            text-gray-700
                            outline-none
                            transition
                            hover:border-gray-400
                            focus:border-gray-600
                            focus:ring-2
                            focus:ring-gray-200
                            disabled:cursor-not-allowed
                            disabled:bg-gray-100
                          "
                        >

                          <option value="admin">
                            Admin
                          </option>

                          <option value="manager">
                            Manager
                          </option>

                          <option value="cashier">
                            Cashier
                          </option>

                        </select>

                        {!hasChanged && (

                          <span
                            className={`
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-[11px]
                              font-semibold
                              capitalize
                              ${getRoleStyle(
                                user.role
                              )}
                            `}
                          >
                            {user.role}
                          </span>

                        )}

                      </div>

                    </td>

                    {/* CREATED */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-gray-500">

                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "-"}

                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">

                      <div className="flex items-center justify-end gap-2">

                        {/* UPDATE ROLE */}

                        <button
                          type="button"
                          disabled={
                            !hasChanged ||
                            isUserUpdating
                          }
                          onClick={() =>
                            onUpdateRole(user)
                          }
                          className="
                            flex
                            items-center
                            gap-1.5
                            rounded-lg
                            bg-gray-900
                            px-3
                            py-2
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-gray-700
                            disabled:cursor-not-allowed
                            disabled:bg-gray-100
                            disabled:text-gray-400
                          "
                        >

                          {hasChanged &&
                          !isUserUpdating ? (
                            <VscCheck
                              size={16}
                            />
                          ) : null}

                          {isUserUpdating
                            ? "Updating..."
                            : "Update"}

                        </button>

                        {/* VIEW HISTORY */}

                        <button
                          type="button"
                          onClick={() =>
                            onViewHistory(user)
                          }
                          title="View user history"
                          className="
                            flex
                            items-center
                            gap-1.5
                            rounded-lg
                            border
                            border-purple-200
                            bg-purple-50
                            px-3
                            py-2
                            text-sm
                            font-medium
                            text-purple-700
                            transition
                            hover:border-purple-300
                            hover:bg-purple-100
                          "
                        >

                          <VscEye size={17} />

                          <span className="hidden sm:inline">
                            History
                          </span>

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
  );
};

export default UserTable;