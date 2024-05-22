import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import Select, { MultiValue } from 'react-select';
import {
  setManagers as setGlobalManagers,
  setStores as setGlobalStores,
} from '../../../store/slices/appData';
import { LabelInput } from '../../components/commonComponents';
import {
  BackButton,
  PrimaryButton,
  SecondaryButton,
} from '../../components/commonComponents/buttons';
import { useCreate, useEdit, useFetch, useRemove } from '../../utils/hooks';
import { DeleteSVG, EditSVG, ErrorSVG, SearchSVG } from '../../utils/svg';

function Managers() {
  const [managers, setManagers] = useState<any>([]);
  const [stores, setStores] = useState<any>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preDeleteItem, setPreDeleteItem] = useState<any>({});
  const [preEditItem, setPreEditItem] = useState<any>(null);

  const [userInput, setUserInput] = useState<{
    name: string | null;
    email: string | null;
    phone: string | null;
    stores: number[] | null;
    password: string | null;
    confirm_password: string | null;
  }>({
    name: '',
    email: '',
    phone: '',
    stores: [],
    password: '',
    confirm_password: '',
  });
  const [errorMsg, setErrorMsg] = useState<{
    name: string | null;
    email: string | null;
    phone: string | null;
    store: string | null;
    password: string | null;
    confirm_password: string | null;
  }>({
    name: null,
    email: null,
    phone: null,
    store: null,
    password: null,
    confirm_password: null,
  });

  const { loading: fetchLoading, fetchData: managersFetch } = useFetch();
  const { loading: fetchStoreLoading, fetchData: storeFetch } = useFetch();
  const { createData: createManager, loading: cManagerLoading } = useCreate();
  const { loading: rManagerLoading, removeData: removeManager } = useRemove();
  const { loading: eManagerLoading, editData: editManager } = useEdit();

  const dispatch = useDispatch();
  const globalManagers = useSelector((state: any) => state.appData.managers);
  const globalStores = useSelector((state: any) => state.appData.stores);
  const user = useSelector((state: any) => state.appData.user);
  const business = useSelector((state: any) => state.appData.business);

  //   [info]: methods
  const resetErrorMsg = () => {
    setErrorMsg({
      name: null,
      email: null,
      phone: null,
      store: null,
      password: null,
      confirm_password: null,
    });
  };

  const resetUserInput = () => {
    setUserInput({
      name: '',
      email: '',
      phone: '',
      stores: [],
      password: '',
      confirm_password: '',
    });
  };

  const handleStoreData = (data: any) => {
    setStores(
      data.map((store: any) => ({
        label: store.name,
        value: store.id,
      })),
    );
  };

  const handleSearch = (event: { target: { value: any } }) => {
    const { value } = event.target;
    if (!value) {
      setManagers(globalManagers);
    } else {
      const foundItems = globalManagers.filter((product: any) =>
        product.name.toLowerCase().includes(value.toLowerCase()),
      );

      setManagers(foundItems);
    }
  };

  const fetchManagers = () => {
    managersFetch(`auth/managers-list/?business=${business.id}`)
      .then((res) => {
        if (res?.status === 200) {
          setManagers(res?.data);
          dispatch(setGlobalManagers(res?.data));
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const fetchStores = () => {
    storeFetch(`/store-list/?user=${user.id}`)
      .then((res) => {
        if (res?.status === 200) {
          handleStoreData(res?.data);
          // setStores(res?.data);
          dispatch(setGlobalStores(res?.data));
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const clientSideManagerRemove = (id: number) => {
    const items = [...globalManagers];
    const indexToRemove = items.findIndex((item) => item.id === id);
    if (indexToRemove !== -1) {
      items.splice(indexToRemove, 1);
    }
    setManagers(items);
    dispatch(setGlobalManagers(items));
  };

  const handleEditManager = () => {
    resetErrorMsg();
    const payload = {
      name: userInput.name,
      email: userInput.email,
      phone: userInput.phone,
      stores: userInput.stores?.map((store: any) => store.value),
      password: userInput.password,
    };
    editManager(`auth/update-manager/`, payload, false)
      .then((res) => {
        if (res.status === 400) {
          const firstError = Object.keys(res.data)[0];
          if (firstError) {
            setTimeout(() => {
              if (document.getElementById(firstError)) {
                document.getElementById(firstError)?.focus();
              }
            }, 50);
          }

          setErrorMsg(res.data);
        }
        if (res.status === 200) {
          toast.success('Manager edited successfully!');
          fetchManagers();
          setPreEditItem(null);
          resetUserInput();
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const handleDeleteManager = () => {
    if (preDeleteItem.id) {
      removeManager(`/auth/remove-manager/?manager=${preDeleteItem.id}`, false)
        .then((res) => {
          if (res.status === 204) {
            toast.success('Manager deleted successfully!');
            setShowDeleteModal(false);
            clientSideManagerRemove(preDeleteItem.id);
          } else if (res.status === 400) {
            toast.error(res.data);
            setShowDeleteModal(false);
            fetchManagers();
          }
          return true;
        })
        .catch(() => {
          return false;
        });
    }
  };

  const handleUserInput = (key: string, value: string | MultiValue<number>) => {
    setUserInput({
      ...userInput,
      [key]: value,
    });

    if (key === 'confirm_password' && userInput.password !== value) {
      setErrorMsg({ ...errorMsg, [key]: 'Password does not match' });
      return;
    }
    setErrorMsg({ ...errorMsg, [key]: null });
  };

  const handleCancelEdit = () => {
    setPreEditItem(null);
    resetUserInput();
  };

  const handleManagerForEdit = (manager: any) => {
    setPreEditItem(manager);
    setUserInput({
      name: manager.name,
      email: manager.email,
      phone: manager.phone,
      stores: manager.stores.map((store: any) => ({
        label: store.name,
        value: store.id,
      })),
      password: '',
      confirm_password: '',
    });
  };

  const handleSelectProductForDelete = (manager: any) => {
    setShowDeleteModal(true);
    setPreDeleteItem(manager);
  };

  const handleCreateManager = () => {
    if (userInput.password !== userInput.confirm_password) {
      toast.error('Password do not match!');
      return;
    }
    resetErrorMsg();
    const payload = {
      name: userInput.name,
      email: userInput.email,
      phone: userInput.phone,
      stores: userInput.stores?.map((store: any) => store.value),
      password: userInput.password,
    };
    // eslint-disable-next-line promise/catch-or-return
    createManager('/auth/create-manager/', payload, false)
      .then(async (res) => {
        if (res.status === 400) {
          const firstError = Object.keys(res.data)[0];
          if (firstError) {
            setTimeout(() => {
              if (document.getElementById(firstError)) {
                document.getElementById(firstError)?.focus();
              }
            }, 50);
          }
          setErrorMsg(res.data);
        }
        if (res.status === 200) {
          toast.success('Manager created successfully!');
          fetchManagers();
          resetUserInput();
        }
        return true;
      })
      .catch(() => {
        return false;
      })
      .finally(() => {});
  };

  // [info]: lifecyles
  useEffect(() => {
    if (globalManagers?.length > 0) {
      setManagers(globalManagers);
      dispatch(setGlobalManagers(globalManagers));
    } else {
      fetchManagers();
    }

    if (globalStores?.length > 0) {
      handleStoreData(globalStores);
      // setStores(globalStores);
      dispatch(setGlobalStores(globalStores));
    } else {
      fetchStores();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto">
      <div className="px-16 pt-16">
        <BackButton />
      </div>
      <div className="px-16 pt-8 sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="text-gray-800 font-bold text-2xl">Managers</h2>

            <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full  ">
              {managers?.length || 0}{' '}
              {managers?.length > 1 ? 'managers' : 'manager'}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500 ">
            Manage all of your managers in a store.
          </p>
        </div>
      </div>
      <div className="px-16 mt-6 md:flex md:items-center md:justify-between">
        <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse">
          <button
            type="button"
            className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm"

            // onClick={() => setSelectedFilteredBtn('all')}
          >
            View all
          </button>

          <button
            type="button"
            className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm"

            // onClick={() => setSelectedFilteredBtn('in-stock')}
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
        <div className="col-span-1">
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
              {managers?.length > 0 ? (
                managers.map((manager: any) => {
                  return (
                    <div
                      key={manager.id + manager.email}
                      className="border flex items-center justify-between p-4 rounded-lg mb-2"
                    >
                      <div className="flex flex-col gap-1">
                        <p>{manager.name}</p>
                        <p className="text-gray-500">{manager.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                          onClick={() => handleManagerForEdit(manager)}
                        >
                          <EditSVG />
                        </button>

                        <button
                          type="button"
                          className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                          onClick={() => handleSelectProductForDelete(manager)}
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
                    No Manager Found
                  </h2>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="border p-4 mb-8 rounded-lg flex flex-col justify-between h-fit">
          <h2 className="font-bold text-xl mb-8 text-gray-500">
            {preEditItem ? 'Edit Manager' : 'Add New Manager'}
          </h2>
          <div>
            <div className="flex flex-col gap-4">
              <LabelInput
                errorMsg={errorMsg.name}
                loading={false}
                label="Manager Name"
                required
              >
                <input
                  type="text"
                  id="name"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                  placeholder="Manager Name"
                  required
                  value={userInput.name || ''}
                  onChange={(e) => handleUserInput('name', e.target.value)}
                />
              </LabelInput>

              <LabelInput
                errorMsg={errorMsg.email}
                loading={false}
                label="Manager Email"
                required
              >
                <input
                  type="email"
                  id="email"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                  placeholder="Manager Email"
                  required
                  value={userInput.email || ''}
                  onChange={(e) => handleUserInput('email', e.target.value)}
                />
              </LabelInput>

              <LabelInput
                errorMsg={errorMsg.phone}
                loading={false}
                label="Manager Phone"
                required
              >
                <input
                  type="tel"
                  id="phone"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                  placeholder="Manager Phone"
                  required
                  value={userInput.phone || ''}
                  onChange={(e) => handleUserInput('phone', e.target.value)}
                />
              </LabelInput>

              <LabelInput
                errorMsg={errorMsg.store}
                loading={fetchStoreLoading}
                label="Select Store"
                required
              >
                <Select
                  closeMenuOnSelect={false}
                  isMulti
                  options={stores}
                  value={userInput.stores}
                  onChange={(e) => handleUserInput('stores', e)}
                />
              </LabelInput>

              <LabelInput
                errorMsg={errorMsg.password}
                loading={false}
                label={preEditItem ? 'Change Password' : 'Set Password'}
                required
              >
                <input
                  type="password"
                  id="password"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                  placeholder="Manager's Password"
                  required
                  value={userInput.password || ''}
                  onChange={(e) => handleUserInput('password', e.target.value)}
                />
              </LabelInput>

              <LabelInput
                errorMsg={errorMsg.confirm_password}
                loading={false}
                label="Confirm Password"
                required
              >
                <input
                  type="password"
                  id="confirm_password"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                  placeholder="Confirm Password"
                  required
                  value={userInput.confirm_password || ''}
                  onChange={(e) =>
                    handleUserInput('confirm_password', e.target.value)
                  }
                />
              </LabelInput>
            </div>
            {preEditItem ? (
              <div className="flex items-center w-fit ml-auto gap-2">
                <div className="w-fit ml-auto pt-4">
                  <SecondaryButton
                    label="Cancel"
                    loading={false}
                    onClickAction={handleCancelEdit}
                  />
                </div>
                <div className="w-fit ml-auto pt-4">
                  <PrimaryButton
                    label="Edit"
                    loading={eManagerLoading}
                    onClickAction={handleEditManager}
                  />
                </div>
              </div>
            ) : (
              <div className="w-fit ml-auto pt-4">
                <PrimaryButton
                  label="Save"
                  loading={cManagerLoading}
                  onClickAction={handleCreateManager}
                />
              </div>
            )}
          </div>
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
                              {preDeleteItem.name}
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
                        rManagerLoading && 'opacity-50'
                      }`}
                      onClick={handleDeleteManager}
                      disabled={rManagerLoading}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {rManagerLoading && (
                          <div className="flex flex-row gap-1">
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
                          </div>
                        )}
                        {rManagerLoading ? 'Loading' : 'Delete'}
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
    </div>
  );
}

export default Managers;
