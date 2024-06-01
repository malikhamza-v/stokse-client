import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SideBar from '../../commonComponents/sideBar/SideBar';
import {
  setBusiness,
  setStore,
  setUser,
} from '../../../../store/slices/appSlice';

function MainLayout({ children }: any) {
  const dispatch = useDispatch();

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
      {children}
    </div>
  );
}

export default MainLayout;
