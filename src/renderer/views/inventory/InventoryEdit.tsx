/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import JsBarcode from 'jsbarcode';
import CreatableSelect from 'react-select/creatable';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LabelInput } from '../../components/commonComponents';
import {
  BackButton,
  PrimaryButton,
} from '../../components/commonComponents/buttons';
import useEdit from '../../utils/hooks/useEdit';
import {
  setCategories as setGlobalCategories,
  setBrands as setGlobalBrands,
  setProducts,
} from '../../../store/slices/appSlice';
import { useFetch } from '../../utils/hooks';
import { AddSVG, DeleteSVG } from '../../utils/svg';

interface UserInputInterface {
  name: string;
  category: string;
  brand: string;
  description: string | null;
  cost_price: number | string;
  sale_price: number | string;
  stock_quantity: number | string;
  enable_low_stock_notification: boolean;
  low_stock_level: number | string;
  taxes: {
    name: string;
    percent: string;
    amount: string;
    [key: string]: string;
  }[];
  reorder_quantity: number | string;
  additional_notes: string;
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

export default function InventoryEdit() {
  const taxOptions = [
    { value: '10', label: 'GST' },
    { value: '18', label: 'PST' },
    { value: '19', label: 'FDP' },
  ];

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

  const [userInput, setUserInput] = useState<UserInputInterface>({
    name: '',
    category: '',
    brand: '',
    description: '',
    cost_price: '',
    sale_price: '',
    stock_quantity: '',
    taxes: [{ name: '', percent: '', amount: '' }],
    enable_low_stock_notification: false,
    low_stock_level: '',
    reorder_quantity: '',
    additional_notes: '',
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const { loading: cProductLoading, editData: editProduct } = useEdit();

  const globalCategories = useSelector((state: any) => state.app.categories);
  const globalBrands = useSelector((state: any) => state.app.brands);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = useSelector((state: any) => state.app.editProduct);
  const globalProducts = useSelector((state: any) => state.app.products);

  const { loading: categoryFetchLoading, fetchData: categoriesFetch } =
    useFetch();
  const { loading: brandFetchLoading, fetchData: brandsFetch } = useFetch();

  // [info]: helpers
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

  const handleRemoveTax = (index: number) => {
    if (userInput.taxes.length === 1 && index === 0) {
      setIsTaxesInclude(false);
      return;
    }
    const taxes = [...userInput.taxes];
    taxes.splice(index, 1);
    setUserInput({
      ...userInput,
      taxes,
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

  const handleUserInput = (key: string, value: string) => {
    setUserInput({
      ...userInput,
      [key]: value,
    });
  };

  const handleSelectDefaultTax = (selectedTax: any, index: number) => {
    const newTaxes = [...userInput.taxes];

    if (index >= 0 && index < newTaxes.length && selectedTax) {
      newTaxes[index].name = selectedTax.label;
      newTaxes[index].percent = selectedTax.value;
    }

    setUserInput({
      ...userInput,
      taxes: newTaxes,
    });
  };

  const calculateTaxAmount = (salePrice: number, taxPercent: number) => {
    return (salePrice * taxPercent) / 100;
  };

  const calculateTaxPercent = (salePrice: number, taxAmount: number) => {
    return (taxAmount / salePrice) * 100;
  };

  const handleUserInputTax = (key: string, value: string, index: number) => {
    const newTaxes = [...userInput.taxes];

    if (index >= 0 && index < newTaxes.length) {
      newTaxes[index][key] = value;
      if (userInput.sale_price) {
        if (key === 'percent') {
          newTaxes[index].amount = calculateTaxAmount(
            userInput.sale_price as number,
            parseInt(value || '0', 10),
          ) as unknown as string;
        }
        if (key === 'amount') {
          newTaxes[index].percent = calculateTaxPercent(
            userInput.sale_price as number,
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

  const handleEditProduct = () => {
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
      low_stock_level: !isLowLevelStock ? null : userInput.low_stock_level,
      reorder_quantity: userInput.reorder_quantity,
      additional_notes: userInput.additional_notes,
      taxes: userInput.taxes,
      store: product.store,
    };
    editProduct(`/products/${product.id}/`, payload, false)
      .then((res) => {
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
          const newProducts = globalProducts?.map(
            (singleGlobalProduct: any) => {
              if (singleGlobalProduct.id === res.data.id) {
                return res.data;
              }
              return singleGlobalProduct;
            },
          );
          dispatch(setProducts(newProducts));
          navigate('/inventory');
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  // [info]: lifecycle
  useEffect(() => {
    if (Object.keys(product).length > 0) {
      setUserInput({
        name: product.name,
        category: product.category.id,
        brand: product.brand?.id || null,
        description: product.description || '',
        cost_price: parseFloat(product.cost_price || 0),
        sale_price: parseFloat(product.sale_price || 0),
        stock_quantity: parseFloat(product.stock_quantity || 0),
        enable_low_stock_notification: product.enable_low_stock_notification,
        taxes: product.taxes || [],
        low_stock_level: parseFloat(product.low_stock_level || 0),
        reorder_quantity: parseFloat(product.reorder_quantity || 0),
        additional_notes: product.additional_notes || '',
      });
      if (product.taxes && product.taxes.length > 0) {
        setIsTaxesInclude(true);
      } else {
        setIsTaxesInclude(false);
      }
      setIsLowLevelStock(product.enable_low_stock_notification);
    }

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    JsBarcode('#barcode', `${product.id}-@${userInput.name}`, {
      format: 'CODE128',
      lineColor: '#0aa',
      fontSize: 12,
      width: 3,
      displayValue: false,
      // textMargin: 10,
    });
  }, [userInput.name, product.id]);
  return (
    <div className=" flex flex-col gap-4 px-10 py-10 h-full w-full bg-slate-50 overflow-y-scroll">
      <BackButton />
      <h2 className="mb-5 text-left  text-4xl font-semibold font-sans">
        Edit {product.name}:
      </h2>
      <div className="flex bg-slate-100 rounded-3xl border border-gray-400">
        <div className="w-2/5 p-8">
          <span className="text-xl font-semibold block">Product Info</span>
          <span className="text-gray-600">
            This information is linked to your product
          </span>
        </div>
        <div className="w-3/5 p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-pink-500 p-6">
            <div className="pb-6">
              <LabelInput
                errorMsg={null}
                label="Product ID"
                loading={false}
                required={false}
              >
                <input
                  type="text"
                  id="name"
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4 pointer-events-none"
                  placeholder="Product Name"
                  required
                  value={product.product_id}
                  disabled
                />
              </LabelInput>
            </div>
            <div className="pb-6">
              <LabelInput
                errorMsg={errorMsg.name}
                loading={false}
                label="Name"
                required
              >
                <input
                  type="text"
                  id="name"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                  placeholder="Product Name"
                  required
                  value={userInput.name}
                  onChange={(e) => handleUserInput('name', e.target.value)}
                />
              </LabelInput>
            </div>
            <div className="pb-6">
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
                    <option value={undefined} disabled>
                      Select Product Category
                    </option>

                    {categories?.map(
                      (category: { id: number; name: string }) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </LabelInput>
            </div>
            <div className="pb-6">
              <LabelInput
                errorMsg={errorMsg.brand}
                loading={brandFetchLoading}
                label="Product Brand"
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
                    value={userInput.brand}
                    onChange={(e) => handleUserInput('brand', e.target.value)}
                    className="appearance-none hover:placeholder-shown:bg-emerald-500 relative text-pink-400 bg-transparent ring-0 outline-none  placeholder-violet-700 text-sm font-bold rounded-full p-4 focus:ring-violet-500 focus:border-violet-500 block w-full"
                    id="brand"
                  >
                    <option value={undefined} disabled>
                      Select Product Brand
                    </option>
                    {brands?.map((brand: { id: number; name: string }) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </LabelInput>
            </div>

            <div className="pb-6">
              <LabelInput
                errorMsg={null}
                loading={false}
                label="Product Description"
                required={false}
              >
                <div className="mx-auto">
                  <textarea
                    value={userInput.description || ''}
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
                  loading={false}
                  label="Cost Price"
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
                    value={userInput.cost_price as number}
                  />
                </LabelInput>
              </div>
              <div>
                <LabelInput
                  required
                  label="Sale Price"
                  errorMsg={errorMsg.sale_price}
                  loading={false}
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
                    value={userInput.sale_price as number}
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
                    value={userInput.stock_quantity as number}
                  />
                </LabelInput>
              </div>
              {isLowLevelStock && (
                <div className="pb-6 pt-2">
                  <LabelInput
                    errorMsg={errorMsg.low_stock_level}
                    label="Low Stock Level"
                    loading={false}
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
                      value={userInput.low_stock_level}
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
                {userInput.taxes?.map((tax, index) => (
                  <div
                    className="py-4 space-y-4"
                    key={`${tax.name}-${index + 1}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <LabelInput
                          required
                          label="Tax Name"
                          loading={false}
                          errorMsg={errorMsg[`taxes_name[${index}]`]}
                        >
                          <CreatableSelect
                            isClearable
                            options={taxOptions}
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
                          loading={false}
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
                          loading={false}
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
          <span className="text-xl font-semibold block">Additional Info</span>
          <span className="text-gray-600">
            Edit additional info of your product
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
                    value={userInput.reorder_quantity}
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
                      value={userInput.additional_notes}
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
      <div className="flex justify-end w-40 ml-auto">
        <PrimaryButton
          loading={cProductLoading}
          label="Edit"
          onClickAction={handleEditProduct}
        />
      </div>
    </div>
  );
}
