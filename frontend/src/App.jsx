import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Forgetpass from "./components/auth/Forgetpass";
import Resetpass from "./components/auth/Resetpass";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/products/Products";
import Batches from "./pages/batches/Batches";
import Suppliers from "./pages/suppliers/Suppliers";
import Sale from "./pages/sales/Sales";
import POS from "./pages/POS/POS";
import AdminLayout from "./components/layout/AdminLayout";
import Category from "./pages/category/Category";
import Customers from "./pages/customers/Customers"


function App() {

  return (

    <>

      <BrowserRouter>

        <Routes>

          {/* ROOT */}

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />


          {/* AUTH */}

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


          {/* ADMIN */}

          <Route element={<AdminLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/pos"
              element={<POS />}
            />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/categories"
              element={<Category />}
            />

            <Route
              path="/batches"
              element={<Batches />}
            />

            <Route
              path="/suppliers"
              element={<Suppliers />}
            />

            <Route
              path="/sales"
              element={<Sale />}
            />

            <Route
              path="/customers"
              element={<Customers />}
            />

          </Route>

        </Routes>

      </BrowserRouter>


      <Toaster />

    </>

  );

}


export default App;