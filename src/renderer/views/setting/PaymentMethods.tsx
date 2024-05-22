import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setPaymentMethods as setGlobalPaymentMethod } from '../../../store/slices/appData';
import { LabelInput } from '../../components/commonComponents';
import {
  BackButton,
  PrimaryButton,
  SecondaryButton,
} from '../../components/commonComponents/buttons';
import { useCreate, useEdit, useFetch, useRemove } from '../../utils/hooks';
import { DeleteSVG, EditSVG, ErrorSVG, SearchSVG } from '../../utils/svg';

function PaymentMethod() {
  const [paymentMethods, setPaymentMethods] = useState<any>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preDeleteItem, setPreDeleteItem] = useState<any>({});
  const [preEditItem, setPreEditItem] = useState<any>(null);

  const [userInput, setUserInput] = useState<{ name: string | null }>({
    name: '',
  });
  const [errorMsg, setErrorMsg] = useState<{ name: string | null }>({
    name: null,
  });

  const { loading: fetchLoading, fetchData: paymentMethodFetch } = useFetch();
  const { createData: createPaymentMethod, loading: cPaymentMethodLoading } =
    useCreate();
  const { loading: rPaymentMethodLoading, removeData: removePaymentMethod } =
    useRemove();
  const { loading: ePaymentMethodLoading, editData: editPaymentMethod } =
    useEdit();

  const dispatch = useDispatch();
  const globalPaymentMethods = useSelector(
    (state: any) => state.appData.paymentMethods,
  );

  //   [info]: methods
  const resetErrorMsg = () => {
    setErrorMsg({
      name: null,
    });
  };

  const handleSearch = (event: { target: { value: any } }) => {
    const { value } = event.target;
    if (!value) {
      setPaymentMethods(globalPaymentMethods);
    } else {
      const foundItems = globalPaymentMethods.filter((product: any) =>
        product.name.toLowerCase().includes(value.toLowerCase()),
      );

      setPaymentMethods(foundItems);
    }
  };

  const fetchPaymentMethods = () => {
    paymentMethodFetch('/payment-method/')
      .then((res) => {
        if (res?.status === 200) {
          setPaymentMethods(res?.data);
          dispatch(setGlobalPaymentMethod(res?.data));
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const clientSidePaymentMethodRemove = (id: number) => {
    const items = [...globalPaymentMethods];
    const indexToRemove = items.findIndex((item) => item.id === id);
    if (indexToRemove !== -1) {
      items.splice(indexToRemove, 1);
    }
    setPaymentMethods(items);
    dispatch(setGlobalPaymentMethod(items));
  };

  const clientSidePaymentMethodEdit = (method: any) => {
    const methodIndex = globalPaymentMethods.findIndex(
      (item: any) => item.id === method.id,
    );
    if (methodIndex !== -1) {
      const updatedMethod = globalPaymentMethods.map(
        (item: any, index: number) => {
          if (index === methodIndex) {
            return {
              ...item,
              ...method,
            };
          }
          return item;
        },
      );

      setPaymentMethods(updatedMethod);
      dispatch(setGlobalPaymentMethod(updatedMethod));
    } else {
      fetchPaymentMethods();
    }
  };

  const clientSidePaymentMethodCreate = (method: any) => {
    const items = [...globalPaymentMethods];
    items.push(method);
    setPaymentMethods(items);
    dispatch(setGlobalPaymentMethod(items));
  };

  const handleEditPaymentMethod = () => {
    resetErrorMsg();
    editPaymentMethod(`/payment-method/${preEditItem.id}/`, userInput, false)
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
          clientSidePaymentMethodEdit(res?.data);
          toast.success('Payment method edited successfully!');
          setPreEditItem(null);
          setUserInput({ name: '' });
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const handleDeletePaymentMethod = () => {
    if (preDeleteItem.id) {
      removePaymentMethod(`/payment-method/${preDeleteItem.id}/`, false)
        .then((res) => {
          if (res.status === 204) {
            toast.success('Payment method deleted successfully!');
            setShowDeleteModal(false);
            clientSidePaymentMethodRemove(preDeleteItem.id);
          } else if (res.status === 400) {
            toast.error(res.data);
            setShowDeleteModal(false);
            fetchPaymentMethods();
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
    setUserInput({ name: '' });
  };

  const handlePaymentMethodForEdit = (method: any) => {
    setPreEditItem(method);
    setUserInput({ name: method.name });
  };

  const handleSelectPaymentMethodForDelete = (method: any) => {
    setShowDeleteModal(true);
    setPreDeleteItem(method);
  };

  const handlecreatePaymentMethod = () => {
    resetErrorMsg();
    // eslint-disable-next-line promise/catch-or-return
    createPaymentMethod('/payment-method/', userInput, false)
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
          clientSidePaymentMethodCreate(res?.data);
          toast.success('Payment method created successfully!');
          setUserInput({ name: '' });
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
    if (globalPaymentMethods.length > 0) {
      setPaymentMethods(globalPaymentMethods);
      dispatch(setGlobalPaymentMethod(globalPaymentMethods));
    } else {
      fetchPaymentMethods();
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
          <h2 className="font-bold text-2xl">Payment Method</h2>
          <p className="text-gray-500">Manage payment methods of your store.</p>
        </div>
        <div className="relative flex items-center mt-4 md:mt-0">
          <span className="absolute">
            <SearchSVG />
          </span>

          <input
            type="text"
            placeholder="Search by payment method"
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
              {paymentMethods.length > 0 ? (
                paymentMethods.map((method: any) => {
                  return (
                    <div
                      key={method.id}
                      className="border flex items-center justify-between p-4 rounded-lg mb-2"
                    >
                      <div>
                        <p>{method.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                          onClick={() => handlePaymentMethodForEdit(method)}
                        >
                          <EditSVG />
                        </button>

                        <button
                          type="button"
                          className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                          onClick={() =>
                            handleSelectPaymentMethodForDelete(method)
                          }
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
                    No Payment Method Found
                  </h2>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="border p-4 rounded-lg flex flex-col justify-between h-fit">
          <h2 className="font-bold text-xl mb-8 text-gray-500">
            {preEditItem ? 'Edit Payment Method' : 'Add New Payment Method'}
          </h2>
          <div>
            <LabelInput
              errorMsg={errorMsg.name}
              label="Payment Method Name"
              loading={false}
              required
            >
              <input
                type="text"
                id="name"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                placeholder="Payment Method Name"
                required
                value={userInput.name || ''}
                onChange={(e) => handleUserInput('name', e.target.value)}
              />
            </LabelInput>
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
                    loading={ePaymentMethodLoading}
                    onClickAction={handleEditPaymentMethod}
                  />
                </div>
              </div>
            ) : (
              <div className="w-fit ml-auto pt-4">
                <PrimaryButton
                  label="Save"
                  loading={cPaymentMethodLoading}
                  onClickAction={handlecreatePaymentMethod}
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
                        rPaymentMethodLoading && 'opacity-50'
                      }`}
                      onClick={handleDeletePaymentMethod}
                      disabled={rPaymentMethodLoading}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {rPaymentMethodLoading && (
                          <div className="flex flex-row gap-1">
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
                          </div>
                        )}
                        {rPaymentMethodLoading ? 'Loading' : 'Delete'}
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

export default PaymentMethod;
