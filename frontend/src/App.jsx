import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Forgetpass from "./components/auth/Forgetpass";
import Resetpass from "./components/auth/Resetpass";

import Dashboard from "./components/layout/Dashboard";
import Products from "./pages/products/Products";
import Batches from "./pages/batches/Batches";
import Suppliers from "./pages/suppliers/Suppliers";
import Sale from "./pages/sales/Sales";
import POS from "./pages/POS/POS";
import Category from "./pages/category/Category";
import Customers from "./pages/customers/Customers";
import Purchases from "./pages/purchases/Purchases";
import AuditLogs from "./pages/auditlogs/AuditLogs";

import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./contexts/ProtectedRoute";
import UserHistory from "./pages/users/UserHistory";
import Users from "./pages/users/Users";
import Expenses from "./pages/expenses/Expenses";
import Accounting from "./pages/accounting/Accounting";
import Chat from "./pages/chat/Chat";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* ================= ROOT ================= */}

          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />


          {/* ================= AUTH ================= */}

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/forgot-password"
            element={<Forgetpass />}
          />

          <Route
            path="/reset-password"
            element={<Resetpass />}
          />


          {/* ================= PROTECTED IMS ================= */}

          <Route
            element={
              <ProtectedRoute
                allowedRoles={["admin", "manager", "cashier"]}
              >
                <AdminLayout />
              </ProtectedRoute>
            }
          >

            {/* Dashboard */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />


            {/* POS */}

            <Route
              path="/pos"
              element={<POS />}
            />


            {/* Products */}

            <Route
              path="/products"
              element={<Products />}
            />


            {/* Categories */}

            <Route
              path="/categories"
              element={<Category />}
            />


            {/* Batches */}

            <Route
              path="/batches"
              element={<Batches />}
            />


            {/* Suppliers */}

            <Route
              path="/suppliers"
              element={<Suppliers />}
            />


            {/* Customers */}

            <Route
              path="/customers"
              element={<Customers />}
            />


            {/* Sales */}

            <Route
              path="/sales"
              element={<Sale />}
            />

            <Route
              path="/chat"
              element={<Chat />}
            />


            {/* Purchases */}

            <Route
              path="/purchases"
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "manager"]}
                >
                  <Purchases />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <Users />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users/:userId/history"
              element={
                <ProtectedRoute
                  allowedRoles={["admin"]}
                >
                  <UserHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/expenses"
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "manager"]}
                >
                  <Expenses />
                </ProtectedRoute>
              }
            />

            <Route
              path="/accounting"
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "manager"]}
                >
                  <Accounting />
                </ProtectedRoute>
              }
            />


            {/* Audit Logs */}

            <Route
              path="/audit-logs"
              element={
                <ProtectedRoute
                  allowedRoles={["admin"]}
                >
                  <AuditLogs />
                </ProtectedRoute>
              }
            />

          </Route>




          {/* ================= FALLBACK ================= */}

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />

        </Routes>
      </BrowserRouter>

      <Toaster />
    </>
  );
}

export default App;