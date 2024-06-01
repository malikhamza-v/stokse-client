import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setTaxes as setGlobalTaxes } from '../../../store/slices/appSlice';
import { LabelInput } from '../../components/commonComponents';
import {
  BackButton,
  PrimaryButton,
  SecondaryButton,
} from '../../components/commonComponents/buttons';
import { useCreate, useEdit, useFetch, useRemove } from '../../utils/hooks';
import { DeleteSVG, EditSVG, ErrorSVG, SearchSVG } from '../../utils/svg';

function Taxes() {
  const [taxes, setTaxes] = useState<any>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preDeleteItem, setPreDeleteItem] = useState<any>({});
  const [preEditItem, setPreEditItem] = useState<any>(null);

  const [userInput, setUserInput] = useState<{
    name: string | null;
    percent: string | null;
  }>({
    name: '',
    percent: '',
  });
  const [errorMsg, setErrorMsg] = useState<{
    name: string | null;
    percent: string | null;
  }>({
    name: null,
    percent: null,
  });

  const { loading: fetchLoading, fetchData: taxesFetch } = useFetch();
  const { createData: createTax, loading: cTaxLoading } = useCreate();
  const { loading: rTaxLoading, removeData: removeTax } = useRemove();
  const { loading: eTaxLoading, editData: editTax } = useEdit();

  const dispatch = useDispatch();
  const globalTaxes = useSelector((state: any) => state.app.taxes);

  //   [info]: methods
  const resetErrorMsg = () => {
    setErrorMsg({
      name: null,
      percent: null,
    });
  };

  const handleSearch = (event: { target: { value: any } }) => {
    const { value } = event.target;
    if (!value) {
      setTaxes(globalTaxes);
    } else {
      const foundItems = globalTaxes.filter((product: any) =>
        product.name.toLowerCase().includes(value.toLowerCase()),
      );

      setTaxes(foundItems);
    }
  };

  const fetchTaxes = () => {
    taxesFetch('/tax/')
      .then((res) => {
        if (res?.status === 200) {
          setTaxes(res?.data);
          dispatch(setGlobalTaxes(res?.data));
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const clientSideTaxRemove = (id: number) => {
    const items = [...globalTaxes];
    const indexToRemove = items.findIndex((item) => item.id === id);
    if (indexToRemove !== -1) {
      items.splice(indexToRemove, 1);
    }
    setTaxes(items);
    dispatch(setGlobalTaxes(items));
  };

  const clientSideTaxEdit = (tax: any) => {
    const taxIndex = globalTaxes.findIndex((item: any) => item.id === tax.id);
    if (taxIndex !== -1) {
      const updatedTax = globalTaxes.map((item: any, index: number) => {
        if (index === taxIndex) {
          return {
            ...item,
            ...tax,
          };
        }
        return item;
      });

      setTaxes(updatedTax);
      dispatch(setGlobalTaxes(updatedTax));
    } else {
      fetchTaxes();
    }
  };

  const clientSideTaxCreate = (tax: any) => {
    const items = [...globalTaxes];
    items.push(tax);
    setTaxes(items);
    dispatch(setGlobalTaxes(items));
  };

  const handleEditTax = () => {
    resetErrorMsg();
    editTax(`/tax/${preEditItem.id}/`, userInput, false)
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
          clientSideTaxEdit(res?.data);
          toast.success('Tax edited successfully!');
          setPreEditItem(null);
          setUserInput({ name: '', percent: '' });
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const handleDeleteTax = () => {
    if (preDeleteItem.id) {
      removeTax(`/tax/${preDeleteItem.id}/`, false)
        .then((res) => {
          if (res.status === 204) {
            toast.success('Tax deleted successfully!');
            setShowDeleteModal(false);
            clientSideTaxRemove(preDeleteItem.id);
          } else if (res.status === 400) {
            toast.error(res.data);
            setShowDeleteModal(false);
            fetchTaxes();
          }
          return true;
        })
        .catch(() => {
          return false;
        });
    }
  };

  const handleUserInput = (key: string, value: string) => {
    setUserInput({
      ...userInput,
      [key]: value,
    });
  };

  const handleCancelEdit = () => {
    setPreEditItem(null);
    setUserInput({ name: '', percent: '' });
  };

  const handleTaxForEdit = (tax: any) => {
    setPreEditItem(tax);
    setUserInput({ name: tax.name, percent: tax.percent });
  };

  const handleSelectProductForDelete = (tax: any) => {
    setShowDeleteModal(true);
    setPreDeleteItem(tax);
  };

  const handleCreateTax = () => {
    resetErrorMsg();
    // eslint-disable-next-line promise/catch-or-return
    createTax('/tax/', userInput, false)
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
          clientSideTaxCreate(res?.data);
          toast.success('Tax created successfully!');
          setUserInput({ name: '', percent: '' });
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
    if (globalTaxes.length > 0) {
      setTaxes(globalTaxes);
      dispatch(setGlobalTaxes(globalTaxes));
    } else {
      fetchTaxes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-16 pt-16">
        <BackButton />
      </div>
      <div className="px-16 py-8 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl">Taxes</h2>
          <p className="text-gray-500">Manage taxes of your products.</p>
        </div>
        <div className="relative flex items-center mt-4 md:mt-0">
          <span className="absolute">
            <SearchSVG />
          </span>

          <input
            type="text"
            placeholder="Search by tax"
            className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="px-16 grid grid-cols-2 gap-4">
        <div>
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
              {taxes.length > 0 ? (
                taxes.map((tax: any) => {
                  return (
                    <div
                      key={tax.id}
                      className="border flex items-center justify-between p-4 rounded-lg mb-2"
                    >
                      <div className="flex flex-col gap-1">
                        <p>{tax.name}</p>
                        <p className="text-gray-500">{tax.percent}%</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                          onClick={() => handleTaxForEdit(tax)}
                        >
                          <EditSVG />
                        </button>

                        <button
                          type="button"
                          className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                          onClick={() => handleSelectProductForDelete(tax)}
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
                  <h2 className="font-medium text-gray-800  ">No Tax Found</h2>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="border p-4 rounded-lg flex flex-col justify-between h-fit">
          <h2 className="font-bold text-xl mb-8 text-gray-500">
            {preEditItem ? 'Edit Tax' : 'Add New Tax'}
          </h2>
          <div>
            <div className="flex flex-col gap-4">
              <LabelInput
                errorMsg={errorMsg.name}
                loading={false}
                label="Tax Name"
                required
              >
                <input
                  type="text"
                  id="name"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                  placeholder="Tax Name"
                  required
                  value={userInput.name || ''}
                  onChange={(e) => handleUserInput('name', e.target.value)}
                />
              </LabelInput>

              <LabelInput
                errorMsg={errorMsg.percent}
                loading={false}
                label="Tax Percent"
                required
              >
                <input
                  type="number"
                  id="name"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                  placeholder="Tax Percent"
                  required
                  value={userInput.percent || ''}
                  onChange={(e) => handleUserInput('percent', e.target.value)}
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
                    loading={eTaxLoading}
                    onClickAction={handleEditTax}
                  />
                </div>
              </div>
            ) : (
              <div className="w-fit ml-auto pt-4">
                <PrimaryButton
                  label="Save"
                  loading={cTaxLoading}
                  onClickAction={handleCreateTax}
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
                        rTaxLoading && 'opacity-50'
                      }`}
                      onClick={handleDeleteTax}
                      disabled={rTaxLoading}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {rTaxLoading && (
                          <div className="flex flex-row gap-1">
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
                          </div>
                        )}
                        {rTaxLoading ? 'Loading' : 'Delete'}
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

export default Taxes;
