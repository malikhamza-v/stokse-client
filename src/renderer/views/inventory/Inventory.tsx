/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useFetch } from '../../utils/hooks';
import {
  AddSVG,
  DeleteSVG,
  EditSVG,
  ErrorSVG,
  SearchSVG,
  ViewSVG,
} from '../../utils/svg';
import useRemove from '../../utils/hooks/useRemove';
import { Toast } from '../../components/commonComponents';
import {
  setEditProduct,
  setProducts as setGlobalProducts,
} from '../../../store/slices/appData';
import useCreate from '../../utils/hooks/useCreate';
import Drawer from '../../components/commonComponents/drawer/Drawer';

/* eslint-disable jsx-a11y/control-has-associated-label */
export default function Inventory() {
  const noOfItemsPerPage = 15;
  const tableBody = useRef<HTMLTableSectionElement>(null);
  const [products, setProducts] = useState<any>([]);
  const [preDeleteItem, setPreDeleteItem] = useState<any>({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFilteredBtn, setSelectedFilteredBtn] = useState<string | null>(
    null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState({ upload: null });
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [paginatedProducts, setPaginatedProducts] = useState<{
    currentPage: number | null;
    totalPage: number | null;
    data: any;
  }>({
    currentPage: null,
    totalPage: null,
    data: [],
  });

  const { loading: fetchLoading, fetchData: productsFetch } = useFetch();
  const { loading: rProductLoading, removeData: removeProduct } = useRemove();
  const { loading: cProductLoading, createData: productCreate } = useCreate();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const globalProducts = useSelector((state: any) => state.appData.products);

  const { ipcRenderer } = window as any;

  // [info]: method
  const handleProductForEdit = (product: any) => {
    dispatch(setEditProduct(product));
    navigate(`/inventory/edit/${product.id}`);
  };

  const fetchProducts = () => {
    productsFetch('/products/')
      .then((res) => {
        if (res?.status === 200) {
          setProducts(res?.data);
          dispatch(setGlobalProducts(res?.data));
          setFilteredProducts(res?.data);
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const handleProductView = (product) => {
    setIsDrawerOpen(true);
  };

  const handleCloseProductView = () => {
    setIsDrawerOpen(false);
  };

  const handleSearch = (event: { target: { value: any } }) => {
    const { value } = event.target;
    if (!value) {
      setSearchedProducts(filteredProducts);
    } else {
      const foundItems = filteredProducts.filter((product: any) =>
        product.name.toLowerCase().includes(value.toLowerCase()),
      );

      setSearchedProducts(foundItems);
    }
  };

  const handlePagination = (direction: string) => {
    if (tableBody.current) {
      tableBody.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    if (direction === 'next') {
      setPaginatedProducts({
        ...paginatedProducts,
        currentPage: (paginatedProducts.currentPage || 1) + 1,
        data: filteredProducts.slice(
          (paginatedProducts.currentPage || 1) * noOfItemsPerPage,
          (paginatedProducts.currentPage || 1) * noOfItemsPerPage + 15,
        ),
      });
    } else {
      setPaginatedProducts({
        ...paginatedProducts,
        currentPage: (paginatedProducts.currentPage || 2) - 1, // Ensure currentPage is at least 1
        data: filteredProducts.slice(
          ((paginatedProducts.currentPage || 2) - 2) * noOfItemsPerPage,
          ((paginatedProducts.currentPage || 2) - 1) * noOfItemsPerPage,
        ),
      });
    }
  };

  const handleDeleteItem = () => {
    if (preDeleteItem.id) {
      removeProduct(`/products/${preDeleteItem.id}/`, false)
        .then((res) => {
          if (res.status === 204) {
            toast.success('Product deleted successfully!');
            setShowDeleteModal(false);
            fetchProducts();
          } else if (res.status === 400) {
            toast.error(res.data);
            setShowDeleteModal(false);
            fetchProducts();
          }
          return true;
        })
        .catch(() => {
          return false;
        });
    }
  };

  const handleSelectProductForDelete = (product: any) => {
    setShowDeleteModal(true);
    setPreDeleteItem(product);
  };

  const handleImageSelect = (event: any) => {
    setSelectedFile(event.target.files[0]);
    event.target.value = '';
  };

  const handleDownloadSampleFile = (file: string) => {
    if (file === 'csv') {
      ipcRenderer.send('download', {
        file: 'https://drive.google.com/uc?export=download&id=1ehEneeLKTNGWNC_h5ZMQuPk-VLjumpPe',
      });
    } else if (file === 'xlsx') {
      ipcRenderer.send('download', {
        file: 'https://drive.google.com/uc?export=download&id=1KPShWYQcHQHLl5GofOF8OqeF0FnV62og',
      });
    }
  };

  const handleImageUpload = () => {
    if (selectedFile) {
      productCreate('/upload-products/', selectedFile, false)
        .then((res) => {
          if (res.status === 400) {
            setErrorMsg({ upload: res.data.error });
            toast.error('Please fix your file errors!');
          } else if (res.status === 200) {
            toast.success('Items added successfully!');
            setShowUploadModal(false);
            setSelectedFile(null);
            fetchProducts();
          }
          return true;
        })
        .catch(() => {
          return false;
        });
    } else {
      toast.error('Please select a file first!');
    }
  };

  // [info]: lifecyles
  useEffect(() => {
    if (globalProducts.length > 0) {
      setProducts(globalProducts);
      setFilteredProducts(globalProducts);
    } else {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPaginatedProducts({
      currentPage: 1,
      totalPage: Math.ceil(filteredProducts.length / 15),
      data: filteredProducts.slice(0, noOfItemsPerPage),
    });
  }, [filteredProducts]);

  useEffect(() => {
    setPaginatedProducts({
      currentPage: 1,
      totalPage: Math.ceil(searchedProducts.length / 15),
      data: searchedProducts.slice(0, noOfItemsPerPage),
    });
  }, [searchedProducts]);

  useEffect(() => {
    if (selectedFilteredBtn) {
      let data;
      if (selectedFilteredBtn === 'in-stock') {
        data = products.filter((product: any) => {
          return product.stock_quantity > 0;
        });
        setFilteredProducts(data);
      } else if (selectedFilteredBtn === 'out-of-stock') {
        data = products.filter((product: any) => {
          return product.stock_quantity <= 0;
        });
        setFilteredProducts(data);
      } else {
        setFilteredProducts(products);
      }
    }
  }, [selectedFilteredBtn, products]);

  useEffect(() => {
    setErrorMsg({ upload: null });
  }, [selectedFile]);

  useEffect(() => {
    setSelectedFile(null);
  }, [showUploadModal]);

  return (
    <section className="container p-10 mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="text-gray-800 font-bold text-2xl">Products</h2>

            <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full  ">
              {filteredProducts?.length} products
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500 ">
            These are the products in your store.
          </p>
        </div>

        <div className="flex items-center mt-4 gap-x-3">
          <button
            type="button"
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100"
            onClick={() => setShowUploadModal(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_3098_154395)">
                <path
                  d="M13.3333 13.3332L9.99997 9.9999M9.99997 9.9999L6.66663 13.3332M9.99997 9.9999V17.4999M16.9916 15.3249C17.8044 14.8818 18.4465 14.1806 18.8165 13.3321C19.1866 12.4835 19.2635 11.5359 19.0351 10.6388C18.8068 9.7417 18.2862 8.94616 17.5555 8.37778C16.8248 7.80939 15.9257 7.50052 15 7.4999H13.95C13.6977 6.52427 13.2276 5.61852 12.5749 4.85073C11.9222 4.08295 11.104 3.47311 10.1817 3.06708C9.25943 2.66104 8.25709 2.46937 7.25006 2.50647C6.24304 2.54358 5.25752 2.80849 4.36761 3.28129C3.47771 3.7541 2.70656 4.42249 2.11215 5.23622C1.51774 6.04996 1.11554 6.98785 0.935783 7.9794C0.756025 8.97095 0.803388 9.99035 1.07431 10.961C1.34523 11.9316 1.83267 12.8281 2.49997 13.5832"
                  stroke="currentColor"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_3098_154395">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <span>Export</span>
          </button>
          <Link to="/inventory/add">
            <button
              type="button"
              className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600"
            >
              <div className="border border-white rounded-full p-[1px]">
                <AddSVG />
              </div>

              <span>Add product</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-6 md:flex md:items-center md:justify-between">
        <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse">
          <button
            type="button"
            className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${
              (!selectedFilteredBtn || selectedFilteredBtn === 'all') &&
              'bg-gray-100'
            } sm:text-sm`}
            onClick={() => setSelectedFilteredBtn('all')}
          >
            View all
          </button>

          <button
            type="button"
            className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${
              selectedFilteredBtn === 'in-stock' && 'bg-gray-100'
            } sm:text-sm`}
            onClick={() => setSelectedFilteredBtn('in-stock')}
          >
            In Stock
          </button>

          <button
            type="button"
            className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${
              selectedFilteredBtn === 'out-of-stock' && 'bg-gray-100'
            } sm:text-sm`}
            onClick={() => setSelectedFilteredBtn('out-of-stock')}
          >
            Out Of Stock
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

      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 table w-full">
                <thead className="bg-gray-50 table w-full">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 px-4 text-sm font-normal text-gray-500 w-[25%]"
                    >
                      <button
                        type="button"
                        className="flex items-center gap-x-3 focus:outline-none"
                      >
                        <span>Name</span>

                        <svg
                          className="h-3"
                          viewBox="0 0 10 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="0.1"
                          />
                          <path
                            d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="0.1"
                          />
                          <path
                            d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="0.3"
                          />
                        </svg>
                      </button>
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 px-8 text-sm font-normal text-left text-gray-500 w-[15%]"
                    >
                      Status
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-8 text-sm font-normal text-left rtl:text-right text-gray-500 w-[30%] "
                    >
                      About
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 w-[10%] "
                    >
                      Cost Price
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 w-[10%]"
                    >
                      Sale Price
                    </th>

                    <th scope="col" className="relative py-3.5 px-4">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody
                  ref={tableBody}
                  className="bg-white block h-[450px] divide-y divide-gray-200 overflow-y-scroll"
                >
                  {fetchLoading ? (
                    <>
                      {[...Array(5).keys()].map((index) => (
                        <tr className="table w-full" key={index}>
                          <td className="px-4 py-4 text-sm font-medium whitespace-pre-wrap w-[25%]">
                            <div>
                              <h2 className="font-medium text-gray-800  ">
                                <div
                                  className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                                  style={{ animationDelay: '0.2s' }}
                                />
                              </h2>
                              <div className="text-sm text-wrap  font-normal text-gray-600 mt-2">
                                <div
                                  className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                                  style={{ animationDelay: '0.2s' }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm font-medium w-[15%]">
                            <div
                              className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>
                          <td className="py-4 pl-4 pr-8 text-sm w-[30%]">
                            <div className="flex flex-col gap-2">
                              <div
                                className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                                style={{ animationDelay: '0.2s' }}
                              />
                              <div
                                className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                                style={{ animationDelay: '0.2s' }}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm w-[10%]">
                            <div
                              className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>

                          <td className="px-4 py-4 text-sm whitespace-nowrap w-[10%]">
                            <div
                              className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>

                          <td className="px-4 py-4 text-sm whitespace-nowrap" />
                        </tr>
                      ))}
                    </>
                  ) : paginatedProducts.data.length > 0 ? (
                    <>
                      {paginatedProducts.data.map((product: any) => {
                        return (
                          <tr key={product.id} className="table w-full">
                            <td className="px-4 py-4 text-sm font-medium whitespace-pre-wrap w-[25%]">
                              <div>
                                <h2 className="font-medium text-gray-800  ">
                                  {product.name}
                                </h2>
                                <p className="text-sm text-wrap  font-normal text-gray-600 mt-2">
                                  <span className="font-semibold text-gray-600">
                                    Brand:{' '}
                                  </span>
                                  <span>{product.brand?.name || 'NONE'}</span>
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm font-medium w-[15%]">
                              <div className="py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 w-32 text-center">
                                {product.stock_quantity <= 0
                                  ? 'Out Of Stock'
                                  : product.stock_quantity <=
                                    product.low_stock_level
                                  ? 'Low Stock Level'
                                  : 'In Stock'}
                              </div>
                            </td>
                            <td className="py-4 pl-4 pr-8 text-sm w-[30%]">
                              <div>
                                <h4 className="text-gray-700 ">
                                  <span>Category: </span>
                                  <span>{product.category.name}</span>
                                </h4>
                                <p className="text-gray-500 mt-2">
                                  {product.description}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm w-[10%]">
                              <div className="flex items-center">
                                {product.cost_price}
                              </div>
                            </td>

                            <td className="px-4 py-4 text-sm whitespace-nowrap w-[10%]">
                              <div>{product.sale_price}</div>
                            </td>

                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                                  onClick={() => handleProductView(product)}
                                >
                                  <ViewSVG />
                                </button>

                                <button
                                  type="button"
                                  className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                                  onClick={() => handleProductForEdit(product)}
                                >
                                  <EditSVG />
                                </button>

                                <button
                                  type="button"
                                  className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                                  onClick={() =>
                                    handleSelectProductForDelete(product)
                                  }
                                >
                                  <DeleteSVG />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    <tr className="table w-full">
                      <td
                        colSpan={6}
                        className="px-4 py-4 text-sm font-medium whitespace-pre-wrap w-[25%] text-center"
                      >
                        <div className="flex items-center justify-center gap-2 my-2">
                          <ErrorSVG />
                          <h2 className="font-medium text-gray-800  ">
                            No Product Found
                          </h2>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:flex sm:items-center sm:justify-between ">
        <div className="text-sm text-gray-500 ">
          Page{' '}
          <span className="font-medium text-gray-700 ">
            {paginatedProducts.currentPage} of {paginatedProducts.totalPage}
          </span>
        </div>

        <div className="flex items-center mt-4 gap-x-4 sm:mt-0">
          <button
            type="button"
            onClick={() => handlePagination('previous')}
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100"
            disabled={(paginatedProducts.currentPage || 1) < 2}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>

            <span>previous</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100"
            onClick={() => handlePagination('next')}
            disabled={
              (paginatedProducts.currentPage || 1) >=
              (paginatedProducts.totalPage || 0)
            }
          >
            <span>Next</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </button>
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
                        rProductLoading && 'opacity-50'
                      }`}
                      onClick={handleDeleteItem}
                      disabled={rProductLoading}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {rProductLoading && (
                          <div className="flex flex-row gap-1">
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
                          </div>
                        )}
                        {rProductLoading ? 'Loading' : 'Delete'}
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

      {showUploadModal && (
        <div className="flex items-center justify-center">
          <div
            className="fixed inset-0 transition-opacity h-full"
            onClick={() => setShowUploadModal(false)}
          >
            <div className="absolute inset-0 bg-black opacity-60" />
          </div>
          <div className="max-w-2xl my-10 p-10 bg-white rounded-xl fixed z-10 inset-0 overflow-y-auto flex flex-col mx-auto">
            <div className="text-center">
              <h2 className="mt-5 text-3xl font-bold text-gray-900">
                Import Products!
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Create products in bulk with <strong>csv</strong> or{' '}
                <strong>xlsx</strong> file.
              </p>
            </div>
            <div className="mt-8 space-y-3">
              <div className="grid grid-cols-1 space-y-2">
                <span className="text-sm font-bold text-gray-500 tracking-wide">
                  Upload File
                </span>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-uploader"
                    className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center"
                  >
                    <div className="h-full w-full text-center flex flex-col justify-center items-center  ">
                      <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                        <img
                          className="has-mask h-36 object-center"
                          style={{
                            position: 'absolute',
                            clip: 'rect(10px, 150px, 130px, 10px)',
                          }}
                          src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg"
                          alt="product upload"
                        />
                      </div>
                      <p className="pointer-none text-gray-500 ">
                        <span className="text-sm">Drag and drop</span> files
                        here <br /> or{' '}
                        <label
                          htmlFor="image-uploader"
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          select a file
                        </label>{' '}
                        from your computer
                      </p>
                    </div>

                    <input
                      type="file"
                      id="image-uploader"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </label>
                </div>
              </div>
              <div className="text-sm text-gray-400 flex justify-between items-center">
                <span>
                  <strong>File type:</strong> csv, xlsx types of files
                </span>
                <div>
                  <strong>Download Sample File:</strong>
                  <div className="flex items-center gap-2">
                    <span
                      className="underline text-blue-600 cursor-pointer"
                      onClick={() => handleDownloadSampleFile('csv')}
                    >
                      csv
                    </span>
                    <span
                      className="underline text-blue-600 cursor-pointer"
                      onClick={() => handleDownloadSampleFile('xlsx')}
                    >
                      xlsx
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                <strong>Note:</strong>
                <span>
                  {' '}
                  csv or xlsx file must contain the following columns
                </span>
                <div className="flex gap-2 items-center flex-wrap mt-2">
                  <button
                    type="button"
                    className="middle none center rounded-lg p-2 font-sans text-xs font-bold text-pink-500 transition-all bg-pink-500/10 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  >
                    name
                  </button>
                  <button
                    type="button"
                    className="middle none center rounded-lg p-2 font-sans text-xs font-bold text-pink-500 transition-all bg-pink-500/10 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  >
                    category
                  </button>
                  <button
                    type="button"
                    className="middle none center rounded-lg p-2 font-sans text-xs font-bold text-pink-500 transition-all bg-pink-500/10 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  >
                    brand
                  </button>
                  <button
                    type="button"
                    className="middle none center rounded-lg p-2 font-sans text-xs font-bold text-pink-500 transition-all bg-pink-500/10 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  >
                    stock_quantity
                  </button>
                  <button
                    type="button"
                    className="middle none center rounded-lg p-2 font-sans text-xs font-bold text-pink-500 transition-all bg-pink-500/10 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  >
                    sale_price
                  </button>
                  <button
                    type="button"
                    className="middle none center rounded-lg p-2 font-sans text-xs font-bold text-pink-500 transition-all bg-pink-500/10 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  >
                    cost_price
                  </button>
                </div>
              </div>
              {selectedFile && (
                <>
                  <div className="h-1" />
                  <div className="flex justify-between items-center border rounded-lg p-4 bg-slate-50">
                    <div>
                      <div className="flex flex-col">
                        <p className="flex items-center gap-2 text-gray-500">
                          <strong>Name:</strong>
                          {selectedFile.name}
                        </p>
                        <p className="flex items-center gap-2 text-gray-500">
                          <strong>Size:</strong>
                          {(selectedFile.size / 1000).toFixed(2)}kb
                        </p>
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                        onClick={() => setSelectedFile(null)}
                      >
                        <DeleteSVG />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {errorMsg.upload && (
                <p className="text-red-600 text-sm">{`[ERROR]: ${errorMsg.upload}`}</p>
              )}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="my-5 w-full flex justify-center bg-white  text-black p-4 rounded-full tracking-wide
                                    font-semibold focus:outline-none focus:shadow-outline hover:bg-slate-50 shadow-lg cursor-pointer transition ease-in duration-300"
                >
                  {' '}
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`my-5 w-full flex justify-center bg-blue-500 text-gray-100 p-4 rounded-full tracking-wide
                  font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300 ${
                    cProductLoading && 'opacity-50'
                  }`}
                  onClick={handleImageUpload}
                  disabled={cProductLoading}
                >
                  <div className="flex items-center justify-center gap-2">
                    {cProductLoading && (
                      <div className="flex flex-row gap-1">
                        <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
                        <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
                      </div>
                    )}
                    {cProductLoading ? 'Loading' : 'Upload'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toast />

      <Drawer
        id="inventory_view"
        isOpen={isDrawerOpen}
        close={handleCloseProductView}
      >
        <p>Hello</p>
      </Drawer>
    </section>
  );
}
