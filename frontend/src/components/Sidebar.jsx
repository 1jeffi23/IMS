import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  VscDashboard,
  VscPackage,
  VscArchive,
  VscOrganization,
  VscGraph,
  VscMenu,
  VscSignOut,
  VscListUnordered,
  VscAccount,
} from "react-icons/vsc";

import { AuthContext } from "../contexts/authContext";

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  const navigate = useNavigate();

  const {
    user,
    logout,
    isLoading,
  } = useContext(AuthContext);

  // ==========================================
  // MENU ITEMS
  // ==========================================

  const menuItems = [
    {
      icon: <VscDashboard size={21} />,
      label: "Dashboard",
      path: "/dashboard",
    },

    {
      icon: <VscGraph size={21} />,
      label: "POS",
      path: "/pos",
    },

    {
      icon: <VscPackage size={21} />,
      label: "Products",
      path: "/products",
    },

    {
      icon: <VscListUnordered size={21} />,
      label: "Categories",
      path: "/categories",
    },

    {
      icon: <VscArchive size={21} />,
      label: "Batches",
      path: "/batches",
    },

    {
      icon: <VscOrganization size={21} />,
      label: "Suppliers",
      path: "/suppliers",
    },

    {
      icon: <VscAccount size={21} />,
      label: "Customers",
      path: "/customers",
    },

    {
      icon: <VscGraph size={21} />,
      label: "Sales",
      path: "/sales",
    },
  ];

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ==========================================
  // USER INITIAL
  // ==========================================

  const userInitial =
    user?.name
      ?.charAt(0)
      ?.toUpperCase() || "U";

  return (
    <aside
      className={`
        sticky top-0
        flex h-screen
        flex-col
        justify-between
        shrink-0
        border-r border-gray-200
        bg-white
        text-gray-800
        transition-all duration-300
        ${open ? "w-64" : "w-20"}
      `}
    >

      {/* ======================================
          TOP SECTION
      ======================================= */}

      <div>

        {/* HEADER */}

        <div
          className={`
            flex h-20
            items-center
            border-b border-gray-100
            ${open
              ? "justify-between px-5"
              : "justify-center"
            }
          `}
        >

          {open && (
            <div>

              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                Inventory
                <span className="text-gray-400">
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
              items-center justify-center
              rounded-lg
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-900
              cursor-pointer
            "
          >
            <VscMenu size={23} />
          </button>

        </div>


        {/* NAVIGATION */}

        <nav className="px-3 pt-6">

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

            {menuItems.map((item) => (

              <li key={item.path}>

                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    group relative
                    flex items-center
                    h-11
                    rounded-lg
                    transition-all duration-200

                    ${open
                      ? "gap-3 px-3"
                      : "justify-center"
                    }

                    ${isActive
                      ? `
                          bg-gray-900
                          text-white
                          shadow-sm
                        `
                      : `
                          text-gray-600
                          hover:bg-gray-100
                          hover:text-gray-900
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

                      ${open
                        ? "opacity-100"
                        : "w-0 overflow-hidden opacity-0"
                      }
                    `}
                  >
                    {item.label}
                  </span>


                  {/* TOOLTIP WHEN COLLAPSED */}

                  {!open && (
                    <span
                      className="
                        pointer-events-none
                        absolute
                        left-16
                        z-50
                        whitespace-nowrap
                        rounded-md
                        bg-gray-900
                        px-3 py-2
                        text-xs
                        font-medium
                        text-white
                        opacity-0
                        translate-x-1
                        shadow-lg
                        transition-all duration-200
                        group-hover:opacity-100
                        group-hover:translate-x-0
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


      {/* ======================================
          BOTTOM SECTION
      ======================================= */}

      <div className="border-t border-gray-200 p-3">

        <div
          className={`
            flex items-center
            ${open
              ? "justify-between"
              : "justify-center"
            }
          `}
        >

          {/* USER */}

          <div
            onClick={() => navigate("/profile")}
            className={`
              flex items-center
              gap-3
              rounded-lg
              p-2
              cursor-pointer
              transition
              hover:bg-gray-100
              ${open
                ? "flex-1 min-w-0"
                : ""
              }
            `}
          >

            {/* AVATAR */}

            {user?.image ? (

              <img
                src={user.image}
                alt={user.name || "User"}
                className="
                  h-9 w-9
                  shrink-0
                  rounded-full
                  object-cover
                  border border-gray-200
                "
              />

            ) : (

              <div
                className="
                  flex h-9 w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-900
                  text-sm
                  font-semibold
                  text-white
                "
              >
                {userInitial}
              </div>

            )}


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

          </div>


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
                items-center
                justify-center
                rounded-lg
                text-gray-400
                transition
                hover:bg-red-50
                hover:text-red-600
                disabled:opacity-50
                cursor-pointer
              "
            >
              <VscSignOut size={21} />
            </button>

          )}

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;