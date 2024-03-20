import { Outlet, Navigate } from 'react-router-dom';

function PrivateRoute() {
  const token = localStorage.getItem('token') || null;

  return token ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default PrivateRoute;
