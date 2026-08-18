import { useState } from 'react'
import Signup from './components/auth/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/auth/Login'
import Forgetpass from './components/auth/Forgetpass'
import Resetpass from './components/auth/Resetpass'
import { Toaster } from 'sonner'
import ProtectedRoute from './contexts/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Products from './pages/products/Products'
import Batches from './pages/batches/Batches'
import Suppliers from './pages/suppliers/Suppliers'






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
          <Route path="/batches" element={<Batches/>}/>
          <Route path="/suppliers" element={<Suppliers/>}/>
  

          {/* </Route> */}

        </Routes>

      </BrowserRouter>

      <Toaster />


    </>
  )
}

export default App
