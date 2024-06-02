import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SideBar from '../../commonComponents/sideBar/SideBar';
import {
  setBusiness,
  setStore,
  setUser,
} from '../../../../store/slices/appSlice';
import NavBar from '../../commonComponents/navbar/Navbar';
import { useLocation } from 'react-router-dom';

function MainLayout({ children }: any) {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const storeData = localStorage.getItem('store');
    const businessData = localStorage.getItem('business');

    if (user && storeData && businessData) {
      dispatch(setUser(JSON.parse(user)));
      dispatch(setStore(JSON.parse(storeData)));
      dispatch(setBusiness(JSON.parse(businessData)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex h-screen overflow-y-hidden">
      <SideBar />
      <div
        className={`w-full flex flex-col  ${
          location.pathname === '/sale' ? 'overflow-y-auto' : ''
        }`}
      >
        <NavBar />
        <div
          className={`${
            location.pathname !== '/sale' ? 'overflow-y-auto' : ''
          } `}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
