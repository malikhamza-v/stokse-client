import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SideBar from '../../commonComponents/sideBar/SideBar';
import { setStore, setUser } from '../../../../store/slices/appData';

function MainLayout({ children }: any) {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const storeData = localStorage.getItem('store');

    if (user && storeData) {
      dispatch(setUser(JSON.parse(user)));
      dispatch(setStore(JSON.parse(storeData)));
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
