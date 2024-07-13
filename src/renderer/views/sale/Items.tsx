/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddSVG, EditSVG, ErrorSVG, SearchSVG } from '../../utils/svg';
import { setCart } from '../../../store/slices/cartSlice';
import {
  setProducts as setGlobalProducts,
  setCategories as setGlobalCategories,
} from '../../../store/slices/appSlice';
import { useFetch } from '../../utils/hooks';

function Items() {
  const noOfItemsPerPage = 8;
  const [products, setProducts] = useState<any>([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedFilteredBtn, setSelectedFilteredBtn] = useState<string | null>(
    null,
  );
  const [categories, setCategories] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [paginatedProducts, setPaginatedProducts] = useState<{
    currentPage: number | null;
    totalPage: number | null;
    data: any;
  }>({
    currentPage: null,
    totalPage: null,
    data: [],
  });

  const itemContainer = useRef<HTMLTableSectionElement>(null);

  const { loading: fetchLoading, fetchData: productsFetch } = useFetch();
  const { loading: categoryFetchLoading, fetchData: categoriesFetch } =
    useFetch();
  const dispatch = useDispatch();

  const globalProducts = useSelector((state: any) => state.app.products);
  const cartItems = useSelector((state: any) => state.cart.items);
  const globalCategories = useSelector((state: any) => state.app.categories);
  //   [info]: methods
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
    if (itemContainer.current) {
      itemContainer.current.scrollTo({
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
          (paginatedProducts.currentPage || 1) * noOfItemsPerPage +
            noOfItemsPerPage,
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

  const handleAddProductToCart = (product: any) => {
    const existingProductIndex = cartItems.findIndex(
      (item: any) => item.id === product.id,
    );

    if (existingProductIndex !== -1) {
      const updatedCartItems = cartItems.map((item: any, index: number) => {
        if (index === existingProductIndex) {
          return {
            ...item,
            qty: item.qty + 1,
            discount: {
              discounted_price: null,
              percent: null,
              amount: null,
            },
          };
        }
        return item;
      });

      dispatch(
        setCart({
          items: updatedCartItems,
        }),
      );

      return;
    }

    dispatch(
      setCart({
        items: [
          ...cartItems,
          {
            ...product,
            qty: 1,
            discount: {
              discounted_price: null,
              percent: null,
              amount: null,
            },
          },
        ],
      }),
    );
  };

  // [info]: lifecyles
  useEffect(() => {
    if (globalProducts.length > 0) {
      setProducts(globalProducts);
      setFilteredProducts(globalProducts);
    } else {
      fetchProducts();
    }

    if (globalCategories.length > 0) {
      setCategories(globalCategories);
      dispatch(setGlobalCategories(globalCategories));
    } else {
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPaginatedProducts({
      currentPage: 1,
      totalPage: Math.ceil(searchedProducts.length / noOfItemsPerPage),
      data: searchedProducts.slice(0, noOfItemsPerPage),
    });
  }, [searchedProducts]);

  useEffect(() => {
    setPaginatedProducts({
      currentPage: 1,
      totalPage: Math.ceil(filteredProducts.length / noOfItemsPerPage),
      data: filteredProducts.slice(0, noOfItemsPerPage),
    });
  }, [filteredProducts]);

  useEffect(() => {
    if (selectedFilteredBtn) {
      let data;
      if (selectedFilteredBtn === 'all') {
        setFilteredProducts(products);
      } else {
        data = products.filter((product: any) => {
          return product.category.id === selectedFilteredBtn;
        });
        setFilteredProducts(data);
      }
    }
  }, [selectedFilteredBtn, products]);

  return (
    <div className="flex flex-col h-screen">
      <div className="px-16 pt-16 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl">Making Orders</h2>
          <p className="text-gray-500">Quick orders, even quicker service.</p>
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
      {categoryFetchLoading ? (
        <div className="px-16 flex flex-wrap items-center gap-2 my-8">
          {[...Array(5).keys()].map((skeleton) => (
            <div key={skeleton}>
              <div
                className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"
                style={{ animationDelay: '0.2s' }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div>
          {categories.length > 0 ? (
            <div className="px-16 flex overflow-x-auto items-center gap-2 my-8">
              <div
                className="px-4 py-2 border min-w-fit text-center truncate cursor-pointer rounded-lg hover:bg-slate-50 font-light"
                onClick={() => setSelectedFilteredBtn('all')}
              >
                All
              </div>
              {categories.map((item: any) => (
                <div
                  key={item.name}
                  className="px-4 py-2 border min-w-fit text-center cursor-pointer rounded-lg hover:bg-slate-50 font-light"
                  onClick={() => setSelectedFilteredBtn(item.id)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-16 flex flex-wrap items-center gap-2 my-8">
              <div className="px-4 py-2 border cursor-pointer rounded-lg hover:bg-slate-50 font-light">
                Not Category Found
              </div>
            </div>
          )}
        </div>
      )}
      {/* [info]: Items */}
      <div className="px-16 flex-grow overflow-y-auto" ref={itemContainer}>
        {fetchLoading ? (
          <div className="grid grid-cols-4 gap-4 ">
            {[...Array(8).keys()].map((skeleton) => (
              <div key={skeleton} className="w-full ">
                <div
                  className="w-full h-64 bg-gray-200 rounded-lg animate-pulse"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {paginatedProducts.data.length > 0 ? (
              paginatedProducts.data.map((product: any) => (
                <div
                  key={product.id}
                  className="bg-white border hover:bg-neutral-100 duration-300 p-4 rounded-lg flex flex-col justify-between cursor-pointer"
                >
                  <div
                    onClick={() => handleAddProductToCart(product)}
                    className="flex flex-col justify-between flex-1 h-full gap-2"
                  >
                    <p className="font-medium min-h-16 max-h-fit">
                      {product.name}
                    </p>
                    <div className="text-sm text-gray-500 flex flex-col justify-between">
                      <div>
                        <p>
                          <strong>Category:</strong> {product.category?.name}
                        </p>
                        <p>
                          <strong>Brand:</strong> {product.brand?.name}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 my-2">
                        <button
                          type="button"
                          className="bg-gray-300 border border-blue-500 text-black font-medium rounded-full px-4 text-sm"
                        >
                          In Stock: {product.stock_quantity}
                        </button>
                        <button
                          type="button"
                          className="border border-black text-gray-600 font-medium rounded-full px-4 text-sm"
                        >
                          {product.total_price} USD
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end mt-4">
                    <button
                      type="button"
                      className="border border-black rounded-full p-2 hover:bg-black hover:text-white duration-200"
                    >
                      <EditSVG />
                    </button>
                    <button
                      type="button"
                      className="border border-black rounded-full p-2 hover:bg-black hover:text-white duration-200"
                      onClick={() => handleAddProductToCart(product)}
                    >
                      <AddSVG />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="border flex items-center justify-center w-full col-span-4 gap-2 p-4 rounded-lg mb-2">
                <ErrorSVG />
                <h2 className="font-medium text-gray-800  ">
                  No Product in your inventory
                </h2>
              </div>
            )}
          </div>
        )}
      </div>
      {paginatedProducts?.totalPage && paginatedProducts.totalPage > 1 ? (
        <div className="px-16 pb-8 mt-4 sm:flex sm:items-center sm:justify-between ">
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
      ) : null}
    </div>
  );
}

export default Items;
