import { useState } from 'react'
import Signup from './components/auth/Signup'
import {BrowserRouter,Route,Routes } from 'react-router-dom'
import Login from './components/auth/Login'
import Forgetpass from './components/auth/Forgetpass'
import Resetpass from './components/auth/Resetpass'
import { Toaster } from 'sonner'



function App() {
  

  return (
    <>
    <BrowserRouter>
   
      <Routes>
        <Route  path='/' element = {<Signup/>}    />
        <Route path='/login' element={<Login/>} />
        <Route  path='/forgot-password' element={<Forgetpass/>}  />
        <Route  path='/reset-password' element={<Resetpass/>}  />
      </Routes>

    </BrowserRouter>

       <Toaster />
    
    
    </>
  )
}

export default App
