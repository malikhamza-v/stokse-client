import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setStores as setGlobalStores } from '../../../store/slices/appData';
import { Toast } from '../../components/commonComponents';
import { BackButton } from '../../components/commonComponents/buttons';
import { useFetch, useRemove } from '../../utils/hooks';
import {
  AddSVG,
  DeleteSVG,
  EditSVG,
  ErrorSVG,
  SearchSVG,
} from '../../utils/svg';

interface Store {
  id: number;
  name: string;
  description: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

function Stores() {
  const [stores, setStores] = useState<any>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preDeleteItem, setPreDeleteItem] = useState<Store | null>(null);

  const { loading: fetchLoading, fetchData: storesFetch } = useFetch();
  const { loading: rStoreLoading, removeData: storeRemove } = useRemove();

  const dispatch = useDispatch();
  const globalStores = useSelector((state: any) => state.appData.stores);
  const user = useSelector((state: any) => state.appData.user);

  //   [info]: methods

  const handleOpenDeleteStore = (store: any) => {
    setPreDeleteItem(store);
    setShowDeleteModal(true);
  };

  const handleSearch = (event: { target: { value: any } }) => {
    const { value } = event.target;
    if (!value) {
      setStores(globalStores);
    } else {
      const foundItems = globalStores.filter((product: any) =>
        product.name.toLowerCase().includes(value.toLowerCase()),
      );

      setStores(foundItems);
    }
  };

  const fetchStores = () => {
    storesFetch(`/store-list/?user=${user.id}`)
      .then((res) => {
        if (res?.status === 200) {
          setStores(res?.data);
          dispatch(setGlobalStores(res?.data));
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const handleDeleteStore = () => {
    if (preDeleteItem && preDeleteItem.id) {
      // eslint-disable-next-line promise/catch-or-return
      storeRemove(`/store/${preDeleteItem.id}/`, false)
        .then((res) => {
          if (res.status === 200) {
            toast.success('Store deleted successfully!');
          }
          return true;
        })
        .catch(() => {
          toast.success('Something went wrong!');
          return false;
        })
        .finally(() => {
          setShowDeleteModal(false);
          fetchStores();
        });
    }
  };

  // [info]: lifecyles
  useEffect(() => {
    if (globalStores.length > 0) {
      setStores(globalStores);
      dispatch(setGlobalStores(globalStores));
    } else {
      fetchStores();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full w-full overflow-y-scroll">
      <div className="px-16 pt-16">
        <BackButton />
      </div>
      <div className="px-16 pt-8 sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="text-gray-800 font-bold text-2xl">Stores</h2>

            <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full  ">
              {stores?.length || 0} stores
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500 ">
            Manage all of your business&apos;s store.
          </p>
        </div>

        <div className="flex items-center mt-4 gap-x-3">
          <Link to="/setting/stores/add">
            <button
              type="button"
              className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600"
            >
              <div className="border border-white rounded-full p-[1px]">
                <AddSVG />
              </div>

              <span>Add store</span>
            </button>
          </Link>
        </div>
      </div>
      <div className="px-16 mt-6 md:flex md:items-center md:justify-between">
        <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse">
          <button
            type="button"
            className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm"
          >
            View all
          </button>

          <button
            type="button"
            className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm"
          >
            Active
          </button>
        </div>

        <div className="relative flex items-center mt-4 md:mt-0">
          <span className="absolute">
            <SearchSVG />
          </span>

          <input
            type="text"
            placeholder="Search by name"
            className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="px-16 pt-8 grid grid-cols-2 gap-4">
        <div className="col-span-2">
          {fetchLoading ? (
            [...Array(5).keys()].map((skeleton) => (
              <div key={skeleton} className="w-full ">
                <div
                  className="w-full h-10 bg-gray-200 rounded-lg animate-pulse mb-2"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            ))
          ) : (
            <div>
              {stores.length > 0 ? (
                stores.map((store: any) => {
                  return (
                    <div
                      key={store.id}
                      className="border flex items-center justify-between p-4 rounded-lg mb-2"
                    >
                      <div className="flex flex-col gap-1">
                        <p>{store.name}</p>
                        <p className="text-gray-500">
                          {store.city}-{store.country}
                        </p>
                        <p>{store.is_active ? 'Active' : 'Suspended'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                        >
                          <EditSVG />
                        </button>

                        <button
                          type="button"
                          className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                          onClick={() => handleOpenDeleteStore(store)}
                        >
                          <DeleteSVG />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="border flex items-center justify-center gap-2 p-4 rounded-lg mb-2">
                  <ErrorSVG />
                  <h2 className="font-medium text-gray-800  ">
                    No Store Found
                  </h2>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="flex items-center justify-center">
          <div>
            <div className="fixed inset-0 transition-opacity h-full ">
              <div className="absolute inset-0 bg-black opacity-60" />
            </div>

            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="w-full inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ErrorSVG />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3
                          className="text-lg leading-6 font-medium text-gray-900"
                          id="modal-headline"
                        >
                          {' '}
                          Delete Item{' '}
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            {' '}
                            Are you sure you want to delete{' '}
                            <span className="font-bold">
                              {preDeleteItem?.name}
                            </span>
                            ? This action cannot be undone.{' '}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${
                        rStoreLoading && 'opacity-50'
                      }`}
                      onClick={handleDeleteStore}
                      disabled={rStoreLoading}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {rStoreLoading && (
                          <div className="flex flex-row gap-1">
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
                          </div>
                        )}
                        {rStoreLoading ? 'Loading' : 'Delete'}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {' '}
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast />
    </div>
  );
}

export default Stores;
