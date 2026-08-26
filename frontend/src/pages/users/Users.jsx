import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users as UsersIcon,
  UserCog,
  History,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} from "../../services/userApi";

import UserTable from "./UserTable";
import ErrorState from "../loader/ErrorState";
import Loader from "../loader/Loader";

import usePagination from "../../components/customHooks/usePagination";
import Pagination from "../../components/customHooks/Pagination";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const USERS_PER_PAGE = 7;

const Users = () => {
  const navigate = useNavigate();

  // =====================================================
  // USERS
  // =====================================================

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetUsersQuery();

  const [updateUserRole] = useUpdateUserRoleMutation();

  // =====================================================
  // STATE
  // =====================================================

  const [selectedRoles, setSelectedRoles] = useState({});
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const users = data?.users || [];

  // =====================================================
  // ROLE CHANGE
  // =====================================================

  const handleRoleChange = (userId, role) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  // =====================================================
  // UPDATE ROLE
  // =====================================================

  const handleUpdateRole = async (user) => {
    const newRole =
      selectedRoles[user.id] || user.role;

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
        const updated = {
          ...prev,
        };

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

  // =====================================================
  // VIEW HISTORY
  // =====================================================

  const handleViewHistory = (user) => {
    navigate(`/users/${user.id}/history`);
  };

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredUsers = useMemo(() => {
    const searchText = search
      .toLowerCase()
      .trim();

    return users.filter((user) => {
      const matchesSearch =
        !searchText ||
        user.name
          ?.toLowerCase()
          .includes(searchText) ||
        user.email
          ?.toLowerCase()
          .includes(searchText) ||
        user.role
          ?.toLowerCase()
          .includes(searchText);

      const matchesRole =
        roleFilter === "all" ||
        user.role?.toLowerCase() ===
          roleFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [
    users,
    search,
    roleFilter,
  ]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const {
    currentpage,
    totalPages,
    currentData: currentUsers,
    nextPage,
    prevPage,
    gotoPage,
  } = usePagination(
    filteredUsers,
    USERS_PER_PAGE
  );

  // =====================================================
  // RESET PAGE ON FILTER
  // =====================================================

  useEffect(() => {
    gotoPage(1);
  }, [
    search,
    roleFilter,
  ]);

  // =====================================================
  // ROLE COUNTS
  // =====================================================

  const roleStats = useMemo(() => {
    const admins = users.filter(
      (user) =>
        user.role?.toLowerCase() === "admin"
    ).length;

    const managers = users.filter(
      (user) =>
        user.role?.toLowerCase() === "manager"
    ).length;

    const staff = users.filter(
      (user) =>
        user.role?.toLowerCase() === "staff" ||
        user.role?.toLowerCase() === "cashier"
    ).length;

    return {
      admins,
      managers,
      staff,
    };
  }, [users]);

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("all");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <Loader text="Loading Users..." />
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

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

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6 p-4 md:p-6">

      <div className="mx-auto max-w-8xl space-y-6">

        {/* HEADER */}

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
                <UsersIcon className="h-6 w-6" />
              </div>

              <div>

                <h1 className="
                  text-2xl
                  font-bold
                  tracking-tight
                  md:text-3xl
                ">
                  Users
                </h1>

                <p className="text-sm text-muted-foreground">
                  Manage users, roles and activity history
                </p>

              </div>

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

        {/* SUMMARY */}

        <div className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-4
        ">

          {/* TOTAL */}

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-muted-foreground">
                    Total Users
                  </p>

                  <p className="mt-2 text-2xl font-bold tracking-tight">
                    {users.length.toLocaleString("en-PK")}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Registered users
                  </p>

                </div>

                <div className="
                  rounded-xl
                  bg-emerald-100
                  p-2.5
                  text-emerald-600
                ">
                  <UsersIcon className="h-5 w-5" />
                </div>

              </div>

            </CardContent>
          </Card>

          {/* ADMINS */}

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-muted-foreground">
                    Admins
                  </p>

                  <p className="
                    mt-2
                    text-2xl
                    font-bold
                    tracking-tight
                    text-emerald-600
                  ">
                    {roleStats.admins}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Full system access
                  </p>

                </div>

                <div className="
                  rounded-xl
                  bg-emerald-100
                  p-2.5
                  text-emerald-600
                ">
                  <ShieldCheck className="h-5 w-5" />
                </div>

              </div>

            </CardContent>
          </Card>

          {/* MANAGERS */}

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-muted-foreground">
                    Managers
                  </p>

                  <p className="
                    mt-2
                    text-2xl
                    font-bold
                    tracking-tight
                    text-blue-600
                  ">
                    {roleStats.managers}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Management access
                  </p>

                </div>

                <div className="
                  rounded-xl
                  bg-blue-100
                  p-2.5
                  text-blue-600
                ">
                  <UserCog className="h-5 w-5" />
                </div>

              </div>

            </CardContent>
          </Card>

          {/* STAFF */}

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-muted-foreground">
                    Staff
                  </p>

                  <p className="
                    mt-2
                    text-2xl
                    font-bold
                    tracking-tight
                    text-orange-600
                  ">
                    {roleStats.staff}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Staff accounts
                  </p>

                </div>

                <div className="
                  rounded-xl
                  bg-orange-100
                  p-2.5
                  text-orange-600
                ">
                  <UserCheck className="h-5 w-5" />
                </div>

              </div>

            </CardContent>
          </Card>

        </div>

        {/* SEARCH & FILTERS */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="mb-4 flex items-center gap-2">

              <div className="
                rounded-lg
                bg-emerald-100
                p-2
                text-emerald-600
              ">
                <SlidersHorizontal className="h-4 w-4" />
              </div>

              <div>

                <h2 className="text-sm font-semibold">
                  Search & Filters
                </h2>

                <p className="text-xs text-muted-foreground">
                  Find users and filter by role
                </p>

              </div>

            </div>

            <div className="
              flex
              flex-col
              gap-3
              lg:flex-row
            ">

              {/* SEARCH */}

              <div className="relative flex-1">

                <Search className="
                  absolute
                  left-3.5
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-muted-foreground
                " />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search by name, email or role..."
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

              {/* ROLE */}

              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
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
                  outline-none
                  transition
                  focus:border-emerald-400
                  focus:ring-4
                  focus:ring-emerald-50
                  lg:w-48
                "
              >

                <option value="all">
                  All Roles
                </option>

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

              {/* CLEAR */}

              {(search ||
                roleFilter !== "all") && (

                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  className="
                    w-full
                    gap-2
                    lg:w-auto
                    hover:border-emerald-400
                    hover:bg-emerald-50
                    hover:text-emerald-600
                  "
                >

                  <RotateCcw className="h-4 w-4" />

                  Clear

                </Button>

              )}

            </div>

            {/* RESULTS */}

            <div className="
              mt-4
              flex
              flex-col
              gap-2
              border-t
              pt-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            ">

              <p className="text-xs text-muted-foreground">

                Showing{" "}

                <span className="font-semibold text-foreground">
                  {filteredUsers.length}
                </span>

                {" "}of{" "}

                <span className="font-semibold text-foreground">
                  {users.length}
                </span>

                {" "}users

              </p>

              <div className="
                flex
                items-center
                gap-2
                text-xs
                text-muted-foreground
              ">

                <History className="h-3.5 w-3.5" />

                User activity tracking

              </div>

            </div>

          </CardContent>

        </Card>

        {/* USER TABLE */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-0">

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
                  User Management
                </h2>

                <p className="text-sm text-muted-foreground">
                  Manage roles and view user activity
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

                {filteredUsers.length}{" "}
                {filteredUsers.length === 1
                  ? "User"
                  : "Users"}

              </div>

            </div>

            <UserTable
              users={currentUsers}
              selectedRoles={selectedRoles}
              updatingUserId={updatingUserId}
              onRoleChange={handleRoleChange}
              onUpdateRole={handleUpdateRole}
              onViewHistory={handleViewHistory}
            />

          </CardContent>

        </Card>

        {/* PAGINATION */}

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

export default Users;