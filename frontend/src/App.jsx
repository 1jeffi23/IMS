import { useState } from 'react'
import Signup from './components/auth/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/auth/Login'
import Forgetpass from './components/auth/Forgetpass'
import Resetpass from './components/auth/Resetpass'
import { Toaster } from 'sonner'
import ProtectedRoute from './contexts/ProtectedRoute'
import Dashboard from './components/pages/Dashboard'
import CreateProduct from './components/pages/products/createProduct'
import Products from './components/pages/products/Products'
import EditProduct from './components/pages/products/EditProduct'
import ViewProductBatches from './components/pages/products/ViewProductBatches'
import AddProductBatch from './components/pages/products/AddProductBatch'
import EditProductBatch from './components/pages/products/EditProductBatch'





function App() {


  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<Forgetpass />} />
          <Route path='/reset-password' element={<Resetpass />} />
          {/* <Route element={<ProtectedRoute/>}> */}
          <Route path='/' element={<Dashboard />} />

          <Route path='/products' element={<Products />} />
          <Route path='/addProduct' element={<CreateProduct />} />
          <Route path='/products/edit/:id' element={<EditProduct />} />

          <Route path='/product-batches' element={<ViewProductBatches />} />
          <Route path='/product-batches/add' element={<AddProductBatch />} />
          <Route path='/product-batches/update-batch/:id' element={<EditProductBatch />} />

          {/* </Route> */}

        </Routes>

      </BrowserRouter>

      <Toaster />


    </>
  )
}

export default App
