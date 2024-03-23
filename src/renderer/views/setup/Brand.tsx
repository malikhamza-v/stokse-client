import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setBrands as setGlobalBrands } from '../../../store/slices/appData';
import { LabelInput, Toast } from '../../components/commonComponents';
import {
  PrimaryButton,
  SecondaryButton,
} from '../../components/commonComponents/buttons';
import { useCreate, useEdit, useFetch, useRemove } from '../../utils/hooks';
import { DeleteSVG, EditSVG, ErrorSVG, FingerRight } from '../../utils/svg';

function Brand() {
  const [brands, setBrands] = useState<any>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preDeleteItem, setPreDeleteItem] = useState<any>({});
  const [preEditItem, setPreEditItem] = useState<any>(null);

  const [userInput, setUserInput] = useState<{ name: string | null }>({
    name: '',
  });
  const [errorMsg, setErrorMsg] = useState<{ name: string | null }>({
    name: null,
  });

  const { loading: fetchLoading, fetchData: brandsFetch } = useFetch();
  const { createData: createBrand, loading: cBrandLoading } = useCreate();
  const { loading: rBrandLoading, removeData: removeBrand } = useRemove();
  const { loading: eBrandLoading, editData: editBrand } = useEdit();

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const globalBrands = useSelector((state: any) => state.appData.brands);

  //   [info]: methods
  const resetErrorMsg = () => {
    setErrorMsg({
      name: null,
    });
  };

  const fetchBrands = () => {
    brandsFetch('/brand/')
      .then((res) => {
        if (res?.status === 200) {
          setBrands(res?.data);
          dispatch(setGlobalBrands(res?.data));
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const clientSideBrandRemove = (id: number) => {
    const items = [...globalBrands];
    const indexToRemove = items.findIndex((item) => item.id === id);
    if (indexToRemove !== -1) {
      items.splice(indexToRemove, 1);
    }
    setBrands(items);
    dispatch(setGlobalBrands(items));
  };

  const clientSideBrandEdit = (brand: any) => {
    const brandIndex = globalBrands.findIndex(
      (item: any) => item.id === brand.id,
    );
    if (brandIndex !== -1) {
      const updatedBrand = globalBrands.map((item: any, index: number) => {
        if (index === brandIndex) {
          return {
            ...item,
            ...brand,
          };
        }
        return item;
      });

      setBrands(updatedBrand);
      dispatch(setGlobalBrands(updatedBrand));
    } else {
      fetchBrands();
    }
  };

  const clientSideBrandCreate = (brand: any) => {
    const items = [...globalBrands];
    items.push(brand);
    setBrands(items);
    dispatch(setGlobalBrands(items));
  };

  const handleEditBrand = () => {
    resetErrorMsg();
    editBrand(`/brand/${preEditItem.id}/`, userInput, false)
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
          clientSideBrandEdit(res?.data);
          toast.success('Brand edited successfully!');
          setPreEditItem(null);
          setUserInput({ name: '' });
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const handleDeleteBrand = () => {
    if (preDeleteItem.id) {
      removeBrand(`/brand/${preDeleteItem.id}/`, false)
        .then((res) => {
          if (res.status === 204) {
            toast.success('Brand deleted successfully!');
            setShowDeleteModal(false);
            clientSideBrandRemove(preDeleteItem.id);
          } else if (res.status === 400) {
            toast.error(res.data);
            setShowDeleteModal(false);
            fetchBrands();
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

  const handleBrandForEdit = (brand: any) => {
    setPreEditItem(brand);
    setUserInput({ name: brand.name });
  };

  const handleSelectProductForDelete = (brand: any) => {
    setShowDeleteModal(true);
    setPreDeleteItem(brand);
  };

  const handleNext = () => {
    navigate('/setup/business/payment-method');
  };

  const handleCreateBrand = () => {
    resetErrorMsg();
    // eslint-disable-next-line promise/catch-or-return
    createBrand('/brand/', userInput, false)
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
          clientSideBrandCreate(res?.data);
          toast.success('Brand created successfully!');
          setUserInput({ name: '' });
        }
        return true;
      })
      .catch(() => {
        return false;
      })
      .finally(() => {});
  };

  return (
    <div className="h-screen container mx-auto flex flex-col">
      <div className="px-16 py-8 flex items-center gap-4">
        <FingerRight />
        <h1 className="text-left underline text-3xl font-bold my-4 text-gray-600">
          Let&apos;s setup brands for your products
        </h1>
      </div>
      <div className="px-16 py-8 h-full">
        <div className="px-16 py-8 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-2xl">Brands</h2>
            <p className="text-gray-500">Manage brands of your products.</p>
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
                {brands.length > 0 ? (
                  brands.map((brand: any) => {
                    return (
                      <div
                        key={brand.id}
                        className="border flex items-center justify-between p-4 rounded-lg mb-2"
                      >
                        <div>
                          <p>{brand.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                            onClick={() => handleBrandForEdit(brand)}
                          >
                            <EditSVG />
                          </button>

                          <button
                            type="button"
                            className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                            onClick={() => handleSelectProductForDelete(brand)}
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
                      Create your first brand
                    </h2>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="border p-4 rounded-lg flex flex-col justify-between h-fit">
            <h2 className="font-bold text-xl mb-8 text-gray-500">
              {preEditItem ? 'Edit Brand' : 'Add New Brand'}
            </h2>
            <div>
              <LabelInput
                errorMsg={errorMsg.name}
                loading={false}
                label="Brand Name"
                required
              >
                <input
                  type="text"
                  id="name"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                  placeholder="Brand Name"
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
                      loading={eBrandLoading}
                      onClickAction={handleEditBrand}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-fit ml-auto pt-4">
                  <PrimaryButton
                    label="Save"
                    loading={cBrandLoading}
                    onClickAction={handleCreateBrand}
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
                          rBrandLoading && 'opacity-50'
                        }`}
                        onClick={handleDeleteBrand}
                        disabled={rBrandLoading}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {rBrandLoading && (
                            <div className="flex flex-row gap-1">
                              <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                              <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
                              <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
                            </div>
                          )}
                          {rBrandLoading ? 'Loading' : 'Delete'}
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
      <div className="w-40 ml-auto pb-4">
        <PrimaryButton
          label="Next"
          loading={false}
          onClickAction={handleNext}
        />
      </div>
    </div>
  );
}

export default Brand;
