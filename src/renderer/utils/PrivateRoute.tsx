import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

function PrivateRoute() {
  const token = localStorage.getItem('token') || null;
  const user = useSelector((state: any) => state.app.user);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/sign-in" />;
  }

  if (
    user?.role !== 'Admin' &&
    (location.pathname === '/setting/stores' ||
      location.pathname === '/setting/stores/add' ||
      location.pathname === '/setting/managers')
  ) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default PrivateRoute;
