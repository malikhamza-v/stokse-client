import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories as setGlobalCategories } from '../../../store/slices/appData';
import { LabelInput, Toast } from '../../components/commonComponents';
import {
  BackButton,
  PrimaryButton,
  SecondaryButton,
} from '../../components/commonComponents/buttons';
import { useCreate, useEdit, useFetch, useRemove } from '../../utils/hooks';
import { DeleteSVG, EditSVG, ErrorSVG, SearchSVG } from '../../utils/svg';

function Categories() {
  const [categories, setCategories] = useState<any>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preDeleteItem, setPreDeleteItem] = useState<any>({});
  const [preEditItem, setPreEditItem] = useState<any>(null);

  const [userInput, setUserInput] = useState<{ name: string | null }>({
    name: '',
  });
  const [errorMsg, setErrorMsg] = useState<{ name: string | null }>({
    name: null,
  });

  const { loading: fetchLoading, fetchData: categoriesFetch } = useFetch();
  const { createData: createCategory, loading: cCategoryLoading } = useCreate();
  const { loading: rCategoryLoading, removeData: removeCategory } = useRemove();
  const { loading: eCategoryLoading, editData: editCategory } = useEdit();

  const dispatch = useDispatch();
  const globalCategories = useSelector(
    (state: any) => state.appData.categories,
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
      setCategories(globalCategories);
    } else {
      const foundItems = globalCategories.filter((product: any) =>
        product.name.toLowerCase().includes(value.toLowerCase()),
      );

      setCategories(foundItems);
    }
  };

  const fetchCategories = () => {
    categoriesFetch('/category/')
      .then((res) => {
        if (res?.status === 200) {
          setCategories(res?.data);
          dispatch(setGlobalCategories(res?.data));
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const clientSideCategoryRemove = (id: number) => {
    const items = [...globalCategories];
    const indexToRemove = items.findIndex((item) => item.id === id);
    if (indexToRemove !== -1) {
      items.splice(indexToRemove, 1);
    }
    setCategories(items);
    dispatch(setGlobalCategories(items));
  };

  const clientSideCategoryEdit = (category: any) => {
    const categoryIndex = globalCategories.findIndex(
      (item: any) => item.id === category.id,
    );
    if (categoryIndex !== -1) {
      const updatedCategory = globalCategories.map(
        (item: any, index: number) => {
          if (index === categoryIndex) {
            return {
              ...item,
              ...category,
            };
          }
          return item;
        },
      );

      setCategories(updatedCategory);
      dispatch(setGlobalCategories(updatedCategory));
    } else {
      fetchCategories();
    }
  };

  const clientSideCategoryCreate = (category: any) => {
    const items = [...globalCategories];
    items.push(category);
    setCategories(items);
    dispatch(setGlobalCategories(items));
  };

  const handleEditCategory = () => {
    resetErrorMsg();
    editCategory(`/category/${preEditItem.id}/`, userInput, false)
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
          clientSideCategoryEdit(res?.data);
          toast.success('Category edited successfully!');
          setPreEditItem(null);
          setUserInput({ name: '' });
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const handleDeleteCategory = () => {
    if (preDeleteItem.id) {
      removeCategory(`/category/${preDeleteItem.id}/`, false)
        .then((res) => {
          if (res.status === 204) {
            toast.success('Category deleted successfully!');
            setShowDeleteModal(false);
            clientSideCategoryRemove(preDeleteItem.id);
          } else if (res.status === 400) {
            toast.error(res.data);
            setShowDeleteModal(false);
            fetchCategories();
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

  const handleCategoryForEdit = (category: any) => {
    setPreEditItem(category);
    setUserInput({ name: category.name });
  };

  const handleSelectProductForDelete = (category: any) => {
    setShowDeleteModal(true);
    setPreDeleteItem(category);
  };

  const handleCreateCategory = () => {
    resetErrorMsg();
    // eslint-disable-next-line promise/catch-or-return
    createCategory('/category/', userInput, false)
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
          clientSideCategoryCreate(res?.data);
          toast.success('Category created successfully!');
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
    if (globalCategories.length > 0) {
      setCategories(globalCategories);
      dispatch(setGlobalCategories(globalCategories));
    } else {
      fetchCategories();
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
          <h2 className="font-bold text-2xl">Categories</h2>
          <p className="text-gray-500">Manage categories of your products.</p>
        </div>
        <div className="relative flex items-center mt-4 md:mt-0">
          <span className="absolute">
            <SearchSVG />
          </span>

          <input
            type="text"
            placeholder="Search by category"
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
              {categories.length > 0 ? (
                categories.map((category: any) => {
                  return (
                    <div
                      key={category.id}
                      className="border flex items-center justify-between p-4 rounded-lg mb-2"
                    >
                      <div>
                        <p>{category.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                          onClick={() => handleCategoryForEdit(category)}
                        >
                          <EditSVG />
                        </button>

                        <button
                          type="button"
                          className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                          onClick={() => handleSelectProductForDelete(category)}
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
                    No Category Found
                  </h2>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="border p-4 rounded-lg flex flex-col justify-between h-fit">
          <h2 className="font-bold text-xl mb-8 text-gray-500">
            {preEditItem ? 'Edit Category' : 'Add New Category'}
          </h2>
          <div>
            <LabelInput errorMsg={errorMsg.name} label="Category Name" required>
              <input
                type="text"
                id="name"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                placeholder="Category Name"
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
                    loading={eCategoryLoading}
                    onClickAction={handleEditCategory}
                  />
                </div>
              </div>
            ) : (
              <div className="w-fit ml-auto pt-4">
                <PrimaryButton
                  label="Save"
                  loading={cCategoryLoading}
                  onClickAction={handleCreateCategory}
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
                        rCategoryLoading && 'opacity-50'
                      }`}
                      onClick={handleDeleteCategory}
                      disabled={rCategoryLoading}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {rCategoryLoading && (
                          <div className="flex flex-row gap-1">
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
                          </div>
                        )}
                        {rCategoryLoading ? 'Loading' : 'Delete'}
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

export default Categories;
