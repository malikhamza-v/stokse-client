/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import JsBarcode from 'jsbarcode';
import {
  BackButton,
  PrimaryButton,
} from '../../components/commonComponents/buttons';
import { LabelInput } from '../../components/commonComponents';
import useCreate from '../../utils/hooks/useCreate';
// import useBucket from '../../utils/hooks/useBucket';
import {
  setCategories as setGlobalCategories,
  setBrands as setGlobalBrands,
  setTaxes as setGlobalTaxes,
  setProducts,
} from '../../../store/slices/appData';
import { useFetch } from '../../utils/hooks';
import { AddSVG, DeleteSVG, ErrorSVG } from '../../utils/svg';
import { noTaxOptions } from '../../utils/constant';
import {
  calculateTaxAmount,
  calculateTaxPercent,
  getTotalPrice,
} from '../../utils/methods';

interface UserInputInterface {
  name: string;
  category: string;
  brand: string;
  description: string | null;
  cost_price: number | null;
  sale_price: number | null;
  stock_quantity: number | null;
  enable_low_stock_notification: boolean;
  low_stock_level: number | null;
  taxes: {
    name: string;
    percent: string;
    amount: string;
    [key: string]: string;
  }[];
  reorder_quantity: number | null;
  additional_notes: string | null;
}

interface ErrorMsgInterface {
  name: string | null;
  category: string | null;
  brand: string | null;
  cost_price: string | null;
  sale_price: string | null;
  stock_quantity: string | null;
  low_stock_level: string | null;
  [key: string]: string | null;
}

export default function InventoryAdd() {
  const [isLowLevelStock, setIsLowLevelStock] = useState(false);
  const [isTaxesInclude, setIsTaxesInclude] = useState(false);
  const [errorMsg, setErrorMsg] = useState<ErrorMsgInterface>({
    name: null,
    category: null,
    brand: null,
    cost_price: null,
    sale_price: null,
    stock_quantity: null,
    low_stock_level: null,
  });
  const [cProductLoading, setCProductLoading] = useState(false);

  const [userInput, setUserInput] = useState<UserInputInterface>({
    name: '',
    category: '',
    brand: '',
    description: null,
    cost_price: null,
    sale_price: null,
    stock_quantity: null,
    taxes: [{ name: '', percent: '', amount: '' }],
    enable_low_stock_notification: false,
    low_stock_level: null,
    reorder_quantity: null,
    additional_notes: null,
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [taxes, setTaxes] = useState([{ label: '', value: '' }]);

  const [delayForSetup, setSelayForSetup] = useState(true);

  const { createData: createProduct } = useCreate();

  const globalCategories = useSelector(
    (state: any) => state.appData.categories,
  );
  const globalBrands = useSelector((state: any) => state.appData.brands);
  const globalTaxes = useSelector((state: any) => state.appData.taxes);
  const products = useSelector((state: any) => state.appData.products);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { loading: categoryFetchLoading, fetchData: categoriesFetch } =
    useFetch();
  const { loading: brandFetchLoading, fetchData: brandsFetch } = useFetch();
  const { loading: taxFetchLoading, fetchData: taxesFetch } = useFetch();

  // [info]: methods

  const resetErrorMsg = () => {
    setErrorMsg({
      name: null,
      category: null,
      brand: null,
      cost_price: null,
      sale_price: null,
      stock_quantity: null,
      low_stock_level: null,
    });
  };

  const handleAddTax = () => {
    setUserInput({
      ...userInput,
      taxes: [
        ...userInput.taxes,
        {
          name: '',
          percent: '',
          amount: '',
        },
      ],
    });
  };

  const handleRemoveTax = (index: number) => {
    if (userInput.taxes.length === 1 && index === 0) {
      setIsTaxesInclude(false);
      return;
    }
    const taxesCopy = [...userInput.taxes];
    taxesCopy.splice(index, 1);
    setUserInput({
      ...userInput,
      taxes: taxesCopy,
    });
  };

  const fetchCategories = () => {
    categoriesFetch('/category/')
      .then((res: any) => {
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

  const fetchTaxes = () => {
    taxesFetch('/tax/')
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data.length > 0) {
            const modifiedTaxes = res?.data.map((tax: any) => {
              return {
                label: tax.name,
                percent: tax.percent,
              };
            });

            setTaxes(modifiedTaxes);
            dispatch(setGlobalTaxes(modifiedTaxes));
          }
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const handleUserInput = (key: string, value: string) => {
    if (key === 'sale_price') {
      if (value !== null) {
        const newTaxes = userInput.taxes.map((tax) => ({
          ...tax,
          amount: calculateTaxAmount(
            value as unknown as number,
            parseInt(tax.percent || '0', 10),
          ) as unknown as string,
        }));

        setUserInput({
          ...userInput,
          taxes: newTaxes,
          [key]: value as unknown as number,
        });
      }
      return;
    }
    setUserInput({
      ...userInput,
      [key]: value,
    });
  };

  const handleUserInputTax = (key: string, value: string, index: number) => {
    const newTaxes = [...userInput.taxes];

    if (index >= 0 && index < newTaxes.length) {
      newTaxes[index][key] = value;
      if (userInput.sale_price) {
        if (key === 'percent') {
          newTaxes[index].amount = calculateTaxAmount(
            userInput.sale_price,
            parseInt(value || '0', 10),
          ) as unknown as string;
        }
        if (key === 'amount') {
          newTaxes[index].percent = calculateTaxPercent(
            userInput.sale_price,
            parseFloat(value || '0'),
          ) as unknown as string;
        }
      }
    }

    setUserInput({
      ...userInput,
      taxes: newTaxes,
    });
  };

  const handleSelectDefaultTax = (selectedTax: any, index: number) => {
    const newTaxes = [...userInput.taxes];

    if (index >= 0 && index < newTaxes.length && selectedTax) {
      newTaxes[index].name = selectedTax.label;
      newTaxes[index].percent = selectedTax.percent;
      newTaxes[index].amount = calculateTaxAmount(
        userInput.sale_price || 0,
        selectedTax.percent,
      ) as unknown as string;
    }

    setUserInput({
      ...userInput,
      taxes: newTaxes,
    });
  };

  const handleCreateProductClient = (product: any) => {
    // eslint-disable-next-line camelcase
    const total_price = getTotalPrice({ ...product });
    // eslint-disable-next-line camelcase
    dispatch(setProducts([...products, { ...product, total_price }]));
  };

  const handleCreateProduct = () => {
    setCProductLoading(true);
    resetErrorMsg();
    const payload = {
      name: userInput.name,
      category: userInput.category,
      brand: userInput.brand,
      description: userInput.description,
      cost_price: userInput.cost_price,
      sale_price: userInput.sale_price,
      stock_quantity: userInput.stock_quantity,
      enable_low_stock_notification: isLowLevelStock,
      low_stock_level: userInput.low_stock_level,
      reorder_quantity: userInput.reorder_quantity,
      additional_notes: userInput.additional_notes,
      taxes: isTaxesInclude ? userInput.taxes : null,
    };
    // eslint-disable-next-line promise/catch-or-return
    createProduct('/products/', payload, false)
      .then(async (res) => {
        if (res.status === 400) {
          const firstError = Object.keys(res.data)[0];
          if (firstError) {
            setTimeout(() => {
              if (document.getElementById(firstError)) {
                document.getElementById(firstError)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                });
                document.getElementById(firstError)?.focus();
              }
            }, 50);
          }

          setErrorMsg(res.data);
        }
        if (res.status === 200) {
          JsBarcode('#barcode', `${res.data.id}-@${res.data.name}`, {
            format: 'CODE128',
            lineColor: '#0aa',
            fontSize: 12,
            displayValue: false,
          });

          handleCreateProductClient(res.data);

          navigate('/inventory');
        }
        return true;
      })
      .catch(() => {
        return false;
      })
      .finally(() => {
        setCProductLoading(false);
      });
  };

  useEffect(() => {
    if (brands.length > 0 && categories.length > 0) {
      JsBarcode('#barcode', 'Dummy Barcode', {
        format: 'CODE128',
        lineColor: '#0aa',
        fontSize: 12,
        displayValue: false,
      });
    }
  }, [brands, categories]);

  useEffect(() => {
    setTimeout(() => {
      setSelayForSetup(false);
    }, 200);
    if (globalCategories.length > 0) {
      setCategories(globalCategories);
      dispatch(setGlobalCategories(globalCategories));
    } else {
      fetchCategories();
    }

    if (globalBrands.length > 0) {
      setBrands(globalBrands);
      dispatch(setGlobalBrands(globalBrands));
    } else {
      fetchBrands();
    }

    if (globalTaxes.length > 0) {
      setTaxes(globalTaxes);
      dispatch(setGlobalTaxes(globalTaxes));
    } else {
      fetchTaxes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className=" flex flex-col gap-4 px-10 py-10 h-full w-full bg-slate-50 overflow-y-scroll">
      <BackButton />
      <h2 className="mb-5 text-left  text-4xl font-semibold font-sans">
        Add product in your inventory:
      </h2>
      {(!categoryFetchLoading && !delayForSetup && categories.length <= 0) ||
      (!brandFetchLoading && !delayForSetup && brands.length <= 0) ? (
        <div className="bg-slate-100 rounded-3xl border border-gray-400 w-full">
          <div className="p-8 flex flex-col justify-center items-center gap-4">
            <ErrorSVG />
            <span className="text-gray-600 text-center">
              Sorry, you can't add a product because your store lacks set up for
              {categories.length <= 0 && (
                <span className="font-bold"> Category </span>
              )}
              {categories.length <= 0 && brands.length <= 0 && 'and'}
              {brands.length <= 0 && <span className="font-bold"> Brand </span>}
              . Please configure these settings before creating a product.
            </span>
            <div className="flex items-center gap-4">
              <div className="w-fit">
                {categories.length <= 0 && (
                  <Link to="/setting/categories">
                    <button
                      type="button"
                      className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600"
                    >
                      <div className="border border-white rounded-full p-[1px]">
                        <AddSVG />
                      </div>
                      <span>Create Category</span>
                    </button>
                  </Link>
                )}
              </div>
              <div className="w-fit">
                {brands.length <= 0 && (
                  <Link to="/setting/brands">
                    <button
                      type="button"
                      className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600"
                    >
                      <div className="border border-white rounded-full p-[1px]">
                        <AddSVG />
                      </div>
                      <span>Create brand</span>
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex bg-slate-100 rounded-3xl border border-gray-400">
            <div className="w-2/5 p-8">
              <span className="text-xl font-semibold block">Product Info</span>
              <span className="text-gray-600">
                This information will be linked to your product
              </span>
            </div>
            <div className="w-3/5 p-8">
              <div className="bg-white rounded-2xl shadow-sm border border-pink-500 p-6">
                <div className="pb-6">
                  <LabelInput
                    errorMsg={errorMsg.name}
                    label="Name"
                    loading={false}
                    required
                  >
                    <input
                      type="text"
                      id="name"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                      placeholder="Product Name"
                      required
                      onChange={(e) => handleUserInput('name', e.target.value)}
                    />
                  </LabelInput>
                </div>
                <div>
                  <LabelInput
                    errorMsg={errorMsg.category}
                    label="Product Category"
                    loading={categoryFetchLoading}
                    required
                  >
                    <div className="relative group rounded-full overflow-hidden before:absolute w-full bg-white border border-gray-300">
                      <svg
                        y="0"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0"
                        width="100"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMid meet"
                        height="100"
                        className="w-8 h-8 absolute right-2 -rotate-45 stroke-pink-300 top-1/2 -translate-y-1/2 group-hover:rotate-0 duration-300"
                      >
                        <path
                          strokeWidth="4"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          fill="none"
                          d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"
                          className="svg-stroke-primary"
                        />
                      </svg>
                      <select
                        onChange={(e) =>
                          handleUserInput('category', e.target.value)
                        }
                        value={userInput.category}
                        className="appearance-none hover:placeholder-shown:bg-emerald-500 relative text-pink-400 bg-transparent ring-0 outline-none  placeholder-violet-700 text-sm font-bold rounded-full p-4 focus:ring-violet-500 focus:border-violet-500 block w-full"
                        id="category"
                      >
                        <option value="" disabled>
                          Select Product Category
                        </option>

                        {categories.map(
                          (category: { id: number; name: string }) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </LabelInput>
                  <Link to="/setting/categories">
                    <button
                      type="button"
                      className="text-sm text-violet-400 flex items-center gap-1 mt-2 ml-auto hover:text-black duration-300"
                    >
                      <AddSVG />
                      Add Category
                    </button>
                  </Link>
                </div>

                <div>
                  <LabelInput
                    errorMsg={errorMsg.brand}
                    label="Product Brand"
                    loading={brandFetchLoading}
                    required
                  >
                    <div className="relative group rounded-full overflow-hidden before:absolute w-full bg-white border border-gray-300">
                      <svg
                        y="0"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0"
                        width="100"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMid meet"
                        height="100"
                        className="w-8 h-8 absolute right-2 -rotate-45 stroke-pink-300 top-1/2 -translate-y-1/2 group-hover:rotate-0 duration-300"
                      >
                        <path
                          strokeWidth="4"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          fill="none"
                          d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"
                          className="svg-stroke-primary"
                        />
                      </svg>
                      <select
                        onChange={(e) =>
                          handleUserInput('brand', e.target.value)
                        }
                        value={userInput.brand}
                        className="appearance-none hover:placeholder-shown:bg-emerald-500 relative text-pink-400 bg-transparent ring-0 outline-none  placeholder-violet-700 text-sm font-bold rounded-full p-4 focus:ring-violet-500 focus:border-violet-500 block w-full"
                        id="brand"
                      >
                        <option value="" disabled>
                          Select Product Brand
                        </option>
                        {brands.map((brand: { id: number; name: string }) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </LabelInput>
                  <Link to="/setting/brands">
                    <button
                      type="button"
                      className="text-sm text-violet-400 flex items-center gap-1 mt-2 ml-auto hover:text-black duration-300"
                    >
                      <AddSVG />
                      Add Brand
                    </button>
                  </Link>
                </div>

                <div className="pb-6">
                  <LabelInput
                    errorMsg={null}
                    label="Product Description"
                    loading={false}
                    required={false}
                  >
                    <div className="mx-auto">
                      <textarea
                        id="message"
                        rows={4}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 resize-none"
                        placeholder="Product description"
                        onChange={(e) =>
                          handleUserInput('description', e.target.value)
                        }
                      />
                    </div>
                  </LabelInput>
                </div>
              </div>
            </div>
          </div>

          <div className="flex bg-slate-100 rounded-3xl border border-gray-400">
            <div className="w-2/5 p-8">
              <span className="text-xl font-semibold block">
                Pricing & Inventory
              </span>
              <span className="text-gray-600">
                Specify your product pricing and stock levels
              </span>
            </div>
            <div className="w-3/5 p-8">
              <div className="bg-white rounded-2xl shadow-sm border border-pink-500 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="">
                    <LabelInput
                      errorMsg={errorMsg.cost_price}
                      label="Cost Price"
                      loading={false}
                      required
                    >
                      <input
                        type="number"
                        id="cost_price"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                        placeholder="Cost Price"
                        required
                        onChange={(e) =>
                          handleUserInput('cost_price', e.target.value)
                        }
                      />
                    </LabelInput>
                  </div>
                  <div>
                    <LabelInput
                      required
                      label="Sale Price"
                      loading={false}
                      errorMsg={errorMsg.sale_price}
                    >
                      <input
                        type="number"
                        id="sale_price"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                        placeholder="Sale Price"
                        required
                        onChange={(e) =>
                          handleUserInput('sale_price', e.target.value)
                        }
                      />
                    </LabelInput>
                  </div>
                  <div className="pb-6 pt-2">
                    <LabelInput
                      errorMsg={errorMsg.stock_quantity}
                      loading={false}
                      label="Stock Quantity"
                      required
                    >
                      <input
                        type="number"
                        id="stock_quantity"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                        placeholder="Stock Quantity"
                        required
                        onChange={(e) =>
                          handleUserInput('stock_quantity', e.target.value)
                        }
                      />
                    </LabelInput>
                  </div>
                  {isLowLevelStock && (
                    <div className="pb-6 pt-2">
                      <LabelInput
                        errorMsg={errorMsg.low_stock_level}
                        loading={false}
                        label="Low Stock Level"
                        required
                      >
                        <input
                          type="number"
                          id="low_stock_level"
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                          placeholder="Low Stock Level"
                          required
                          onChange={(e) =>
                            handleUserInput('low_stock_level', e.target.value)
                          }
                        />
                      </LabelInput>
                    </div>
                  )}
                </div>
                <div className="flex gap-4 items-center">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isLowLevelStock}
                      onChange={(event) => {
                        setIsLowLevelStock(event.target.checked);
                      }}
                    />
                    <span className="slider" />
                  </label>
                  <p>Enable Low Stock Notification</p>
                </div>

                <div className="flex gap-4 items-center mb-4 mt-8">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isTaxesInclude}
                      onChange={(event) => {
                        setIsTaxesInclude(event.target.checked);
                      }}
                    />
                    <span className="slider" />
                  </label>
                  <p>Include Taxes</p>
                </div>

                {isTaxesInclude && (
                  <div>
                    {userInput.taxes.map((tax, index) => (
                      <div
                        className="py-4 space-y-4"
                        key={`${tax.name}-${index + 1}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1">
                            <LabelInput
                              required
                              label="Tax Name"
                              loading={taxFetchLoading}
                              errorMsg={errorMsg[`taxes_name[${index}]`]}
                            >
                              <CreatableSelect
                                isClearable
                                options={taxes[0].value ? taxes : noTaxOptions}
                                className="inventory_add_tax"
                                placeholder="Tax Name"
                                value={{
                                  value: '',
                                  label: userInput.taxes[index].name,
                                }}
                                onChange={(selectedTax) =>
                                  handleSelectDefaultTax(selectedTax, index)
                                }
                                onCreateOption={(name) =>
                                  handleUserInputTax('name', name, index)
                                }
                              />
                            </LabelInput>
                          </div>
                          <div
                            className="mt-8 cursor-pointer"
                            onClick={() => handleRemoveTax(index)}
                          >
                            <DeleteSVG />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <LabelInput
                              required
                              label="Tax Percent (%)"
                              loading={taxFetchLoading}
                              errorMsg={errorMsg[`taxes_percent[${index}]`]}
                            >
                              <input
                                type="number"
                                id="tax_percent"
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                                placeholder="Tax Percent"
                                required
                                value={userInput.taxes[index].percent}
                                onChange={(e) =>
                                  handleUserInputTax(
                                    'percent',
                                    e.target.value,
                                    index,
                                  )
                                }
                              />
                            </LabelInput>
                          </div>

                          <div>
                            <LabelInput
                              required
                              label="Tax Amount"
                              loading={taxFetchLoading}
                              errorMsg={errorMsg[`taxes_amount[${index}]`]}
                            >
                              <input
                                type="number"
                                id="tax_amount"
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                                placeholder="Tax Amount"
                                required
                                value={userInput.taxes[index].amount}
                                onChange={(e) =>
                                  handleUserInputTax(
                                    'amount',
                                    e.target.value,
                                    index,
                                  )
                                }
                              />
                            </LabelInput>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="text-blue-600 flex items-center gap-2 ml-auto"
                      onClick={handleAddTax}
                    >
                      <AddSVG />
                      <p>Add another</p>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex bg-slate-100 rounded-3xl border border-gray-400">
            <div className="w-2/5 p-8">
              <span className="text-xl font-semibold block">
                Additional Info
              </span>
              <span className="text-gray-600">
                Add additional info of your product
              </span>
            </div>
            <div className="w-3/5 p-8">
              <div className="bg-white rounded-2xl shadow-sm border border-pink-500 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="">
                    <LabelInput
                      errorMsg={null}
                      label="Reorder Quantity"
                      loading={false}
                      required={false}
                    >
                      <input
                        type="number"
                        id="reorder_quantity"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                        placeholder="Reorder Quantity"
                        required
                        onChange={(e) =>
                          handleUserInput('reorder_quantity', e.target.value)
                        }
                      />
                    </LabelInput>
                  </div>

                  <div className="pb-6 pt-2 col-span-2">
                    <LabelInput
                      errorMsg={null}
                      label="Additional Note"
                      loading={false}
                      required={false}
                    >
                      <div className="mx-auto">
                        <textarea
                          id="additional_notes"
                          rows={2}
                          className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 resize-none"
                          placeholder="Additional Note"
                          onChange={(e) =>
                            handleUserInput('additional_notes', e.target.value)
                          }
                        />
                      </div>
                    </LabelInput>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex bg-slate-100 rounded-3xl border border-gray-400">
            <div className="w-2/5 p-8">
              <span className="text-xl font-semibold block">Barcode</span>
              <span className="text-gray-600">
                Use this barcode to scan your product hassle free
              </span>
            </div>
            <div className="w-3/5 p-8">
              <div className="bg-white rounded-2xl shadow-sm border border-pink-500 p-6">
                <canvas id="barcode" className="w-full h-40" />
              </div>
            </div>
          </div>
          <div className="flex justify-end w-40 ml-auto mt-4">
            <PrimaryButton
              loading={cProductLoading}
              label="Save"
              onClickAction={handleCreateProduct}
            />
          </div>
        </div>
      )}
    </div>
  );
}
