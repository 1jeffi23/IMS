import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tags,
  Archive,
  Truck,
  UsersRound,
  ShoppingBag,
  Receipt,
  Calculator,
  ClipboardList,
  UserCog,
  History,
  MessageCircle,
  Menu,
  LogOut,
} from "lucide-react";

import { AuthContext } from "../../contexts/authContext";
import ProfilePopup from "./ProfilePopup";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();

  const {
    user,
    logout,
    isLoading,
  } = useContext(AuthContext);

  // =====================================================
  // MENU ITEMS
  // =====================================================

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/dashboard",
      roles: ["admin", "manager", "cashier"],
    },

    {
      icon: <ShoppingCart size={20} />,
      label: "POS",
      path: "/pos",
      roles: ["admin", "manager", "cashier"],
    },

    {
      icon: <Package size={20} />,
      label: "Products",
      path: "/products",
      roles: ["admin", "manager", "cashier"],
    },

    {
      icon: <Tags size={20} />,
      label: "Categories",
      path: "/categories",
      roles: ["admin", "manager", "cashier"],
    },

    {
      icon: <Archive size={20} />,
      label: "Batches",
      path: "/batches",
      roles: ["admin", "manager", "cashier"],
    },

    {
      icon: <Truck size={20} />,
      label: "Suppliers",
      path: "/suppliers",
      roles: ["admin", "manager", "cashier"],
    },

    {
      icon: <UsersRound size={20} />,
      label: "Customers",
      path: "/customers",
      roles: ["admin", "manager", "cashier"],
    },

    {
      icon: <ShoppingBag size={20} />,
      label: "Purchases",
      path: "/purchases",
      roles: ["admin", "manager"],
    },

    {
      icon: <Receipt size={20} />,
      label: "Expenses",
      path: "/expenses",
      roles: ["admin", "manager"],
    },

    {
      icon: <Calculator size={20} />,
      label: "Accounting",
      path: "/accounting",
      roles: ["admin", "manager"],
    },

    {
      icon: <ClipboardList size={20} />,
      label: "Sales",
      path: "/sales",
      roles: ["admin", "manager", "cashier"],
    },

    // ===================================================
    // ADMIN ONLY
    // ===================================================

    {
      icon: <UserCog size={20} />,
      label: "Users",
      path: "/users",
      roles: ["admin"],
    },

    {
      icon: <History size={20} />,
      label: "Audit Logs",
      path: "/audit-logs",
      roles: ["admin"],
    },

    {
      icon: <MessageCircle size={20} />,
      label: "Chat",
      path: "/chat",
      roles: ["admin", "manager", "cashier"],
    },
  ];

  // =====================================================
  // FILTER MENU BY ROLE
  // =====================================================

  const visibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // =====================================================
  // USER INITIAL
  // =====================================================

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      <aside
        className={`
          sticky top-0
          flex h-screen
          shrink-0
          flex-col
          border-r border-gray-200
          bg-white
          text-gray-800
          transition-all duration-300
          ${open ? "w-64" : "w-20"}
        `}
      >
        {/* =================================================
            TOP SECTION
        ================================================= */}

        <div className="flex min-h-0 flex-1 flex-col">

          {/* =================================================
              HEADER
          ================================================= */}

          <div
            className={`
              flex h-20 shrink-0
              items-center
              border-b border-gray-100
              ${
                open
                  ? "justify-between px-5"
                  : "justify-center"
              }
            `}
          >
            {open && (
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">
                  Inventory
                  <span className="text-emerald-600">
                    .
                  </span>
                </h1>

                <p className="mt-0.5 text-xs text-gray-400">
                  Management System
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setOpen(!open)}
              title={
                open
                  ? "Collapse sidebar"
                  : "Expand sidebar"
              }
              className="
                flex h-10 w-10
                cursor-pointer
                items-center justify-center
                rounded-lg
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-gray-900
              "
            >
              <Menu size={22} />
            </button>
          </div>

          {/* =================================================
              SCROLLABLE NAVIGATION
          ================================================= */}

          <nav
            className="
              min-h-0
              flex-1
              overflow-y-auto
              px-3
              py-6

              scrollbar-thin
              scrollbar-thumb-gray-200
              scrollbar-track-transparent
            "
          >
            {open && (
              <p
                className="
                  mb-3
                  px-3
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-gray-400
                "
              >
                Main Menu
              </p>
            )}

            <ul className="space-y-1.5">
              {visibleMenuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `
                      group relative
                      flex h-11
                      items-center
                      rounded-xl
                      transition-all duration-200

                      ${
                        open
                          ? "gap-3 px-3"
                          : "justify-center"
                      }

                      ${
                        isActive
                          ? `
                              bg-emerald-600
                              text-white
                              shadow-sm
                              shadow-emerald-200
                            `
                          : `
                              text-gray-600
                              hover:bg-emerald-50
                              hover:text-emerald-600
                            `
                      }
                    `}
                  >
                    {/* ICON */}

                    <span className="shrink-0">
                      {item.icon}
                    </span>

                    {/* LABEL */}

                    <span
                      className={`
                        whitespace-nowrap
                        text-sm
                        font-medium
                        transition-all duration-200

                        ${
                          open
                            ? "opacity-100"
                            : "w-0 overflow-hidden opacity-0"
                        }
                      `}
                    >
                      {item.label}
                    </span>

                    {/* TOOLTIP */}

                    {!open && (
                      <span
                        className="
                          pointer-events-none
                          absolute
                          left-16
                          z-50
                          whitespace-nowrap
                          rounded-lg
                          bg-gray-900
                          px-3
                          py-2
                          text-xs
                          font-medium
                          text-white
                          opacity-0
                          translate-x-1
                          shadow-lg
                          transition-all duration-200
                          group-hover:translate-x-0
                          group-hover:opacity-100
                        "
                      >
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* =================================================
            BOTTOM USER SECTION
        ================================================= */}

        <div className="shrink-0 border-t border-gray-200 bg-white p-3">
          <div
            className={`
              flex items-center
              ${
                open
                  ? "justify-between"
                  : "justify-center"
              }
            `}
          >
            {/* PROFILE */}

            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className={`
                flex
                cursor-pointer
                items-center
                gap-3
                rounded-xl
                p-2
                text-left
                transition
                hover:bg-gray-100

                ${
                  open
                    ? "min-w-0 flex-1"
                    : ""
                }
              `}
            >
              {/* AVATAR */}

              <div
                className="
                  flex h-9 w-9
                  shrink-0
                  items-center justify-center
                  rounded-full
                  bg-emerald-600
                  text-sm
                  font-semibold
                  text-white
                "
              >
                {userInitial}
              </div>

              {/* USER INFO */}

              {open && (
                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-sm
                      font-semibold
                      text-gray-800
                    "
                  >
                    {user?.name || "User"}
                  </p>

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-xs
                      text-gray-400
                    "
                  >
                    {user?.email || ""}
                  </p>
                </div>
              )}
            </button>

            {/* LOGOUT */}

            {open && (
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoading}
                title="Logout"
                className="
                  ml-2
                  flex h-9 w-9
                  shrink-0
                  cursor-pointer
                  items-center justify-center
                  rounded-lg
                  text-gray-400
                  transition
                  hover:bg-red-50
                  hover:text-red-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* =================================================
          PROFILE POPUP
      ================================================= */}

      {profileOpen && (
        <ProfilePopup
          user={user}
          onClose={() => setProfileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;