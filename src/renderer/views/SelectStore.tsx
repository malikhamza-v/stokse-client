import { useEffect, useState } from 'react';
import { useFetch } from '../utils/hooks';
import { StoreSVG } from '../utils/svg';
import { useDispatch } from 'react-redux';
import { resetAppData, setStore } from '../../store/slices/appSlice';
import { useNavigate } from 'react-router-dom';
import { Store } from './setting/Stores';

function SelectStore() {
  const [stores, setStores] = useState<Store[]>([]);
  const { fetchData: fetchStores, loading: storeLoading } = useFetch();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChangeStore = (store: Store) => {
    dispatch(resetAppData());
    localStorage.setItem('store', JSON.stringify(store));
    dispatch(setStore(store));
    navigate('/');
  };

  useEffect(() => {
    fetchStores('/auth/get-all-stores/').then((res) => {
      if (res.status === 200) {
        setStores(res.data);
      }
    });
  }, []);
  return (
    <section className="w-full">
      <div className="relative mx-auto h-full px-4 py-20 md:pb-10  md:px-24 lg:px-8">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex px-4 py-1.5 mx-auto rounded-full  ">
              <p className="text-4xl font-semibold tracking-widest text-g uppercase">
                Your Stores
              </p>
            </div>
            <p className="mt-4 text-base leading-relaxed text-gray-600 group-hover:text-white">
              Want to switch stores? Choose a different store below!
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 mt-12 sm:grid-cols-3 lg:mt-20   ">
            {storeLoading ? (
              <>
                <div className="skeleton h-32"></div>
                <div className="skeleton h-32"></div>
                <div className="skeleton h-32"></div>
              </>
            ) : (
              stores.map((store) => (
                <div
                  onClick={() => handleChangeStore(store)}
                  className="transition-all border rounded-lg cursor-pointer duration-500 bg-white hover:bg-blue-500 hover:shadow-xl m-2 p-4 relative group"
                >
                  <div className=" absolute  bg-blue-500/50 top-0 left-0 w-24 h-1 z-30 transition-all duration-200 group-hover:bg-white group-hover:w-1/2"></div>
                  <div className="py-2 px-9 relative  ">
                    <StoreSVG />
                    <h3 className="mt-8 text-lg font-semibold text-black group-hover:text-white ">
                      {store?.name}
                    </h3>
                    <p className="mt-4 text-base text-gray-600 group-hover:text-white">
                      {store.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SelectStore;
