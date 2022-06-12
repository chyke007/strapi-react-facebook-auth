import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
 
import auth from '../../utils/auth';
 

const PrivateRoute = () => {
  return auth.getToken() ? <Outlet /> : <Navigate to="/auth/login" />;
}
 
export default PrivateRoute;