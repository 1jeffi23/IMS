import React from 'react'
import { useContext } from 'react'
import { AuthContext } from './authContext'

import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const {user} = useContext(AuthContext);
  return  user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute