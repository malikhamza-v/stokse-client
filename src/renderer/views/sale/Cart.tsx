/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import {
  SecondaryButton,
  PrimaryButton,
} from '../../components/commonComponents/buttons';
import {
  AddSVG,
  ArrowLongLeft,
  CloseSvg,
  DeleteSVG,
  EditSVG,
  InfoSVG,
  MinusSVG,
} from '../../utils/svg';
import {
  resetCart,
  setCart,
  setTaxes as setGlobalTaxes,
} from '../../../store/slices/appData';
import { LabelInput, Toast } from '../../components/commonComponents';
import { useFetch } from '../../utils/hooks';
import { noTaxOptions } from '../../utils/constant';

// import { colourOptions } from '../data';

function Cart() {
  // [info]: constant

  const cartItems = useSelector((state: any) => state.appData.cart.items);
  const calculations = useSelector(
    (state: any) => state.appData.cart.calculations,
  );
  const globalTaxes = useSelector((state: any) => state.appData.taxes);

  const [discount, setDiscount] = useState<{
    percent: number | string;
    value: number | string;
  }>({
    percent: 0,
    value: 0,
  });
  const [showCartItemEditModal, setShowCartItemEditModal] = useState(false);
  const [userInput, setUserInput] = useState({
    taxes: [{ name: '', percent: '', amount: '' }],
  });
  const [errorMsg, setErrorMsg] = useState({});
  const [taxes, setTaxes] = useState([{ label: '', value: '' }]);

  const [isAdditionalTaxInclude, setIsAdditionalTaxInclude] = useState(false);
  const [showOrderConfirmationModal, setShowOrderConfirmationModal] =
    useState(false);
  const [orderConfirmationState, setOrderConfirmationState] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { loading: taxFetchLoading, fetchData: taxesFetch } = useFetch();

  const dispatch = useDispatch();

  // [info]: methods
  const handleDiscount = (key: string, value: string) => {
    if (key === 'percent') {
      setDiscount({
        percent: parseFloat(value) || '',
        value: value
          ? parseFloat(
              ((selectedProduct.sale_price * parseFloat(value)) / 100)
                .toFixed(2)
                .toString(),
            )
          : 0,
      });
    } else {
      setDiscount({
        value: parseFloat(value) || '',
        percent: parseFloat(value)
          ? parseFloat(
              ((parseFloat(value) / selectedProduct.sale_price) * 100)
                .toFixed(2)
                .toString(),
            )
          : 0,
      });
    }
  };

  const handleOpenOrderConfirmationModal = () => {
    if (cartItems.length <= 0) {
      toast.error('Your cart is empty');
      return;
    }
    setShowOrderConfirmationModal(true);
  };

  const removeItemFromCart = (id: number) => {
    const items = [...cartItems];
    const indexToRemove = items.findIndex((item) => item.id === id);
    if (indexToRemove !== -1) {
      items.splice(indexToRemove, 1);
    }
    dispatch(
      setCart({
        items,
      }),
    );
  };

  const handleEditCartItem = (product: any) => {
    setSelectedProduct(product);
    setDiscount({
      percent: product.percent || 0,
      value: product.value || 0,
    });
    setShowCartItemEditModal(true);
  };

  const handleSaveCartItemEdit = () => {
    const productIndex = cartItems.findIndex(
      (item: any) => item.id === selectedProduct.id,
    );
    if (productIndex !== -1) {
      const updatedCartItems = cartItems.map((item: any, index: number) => {
        if (index === productIndex) {
          if (item.qty > 0) {
            const discountedPrice = (
              parseFloat(item.total_price) -
              parseFloat(discount.value.toString() || '0')
            ).toFixed(2);

            return {
              ...item,
              discounted_price:
                item.sale_price === discountedPrice && discountedPrice
                  ? null
                  : discountedPrice,
              ...discount,
            };
          }
        }
        return item;
      });

      dispatch(
        setCart({
          items: updatedCartItems,
        }),
      );
    }
    setShowCartItemEditModal(false);
  };

  const calculateTaxAmount = (salePrice: number, taxPercent: number) => {
    return (salePrice * taxPercent) / 100;
  };

  const calculateTaxPercent = (salePrice: number, taxAmount: number) => {
    return (taxAmount / salePrice) * 100;
  };

  const increaseItemQty = (id: number) => {
    const productIndex = cartItems.findIndex((item: any) => item.id === id);

    if (productIndex !== -1) {
      const updatedCartItems = cartItems.map((item: any, index: number) => {
        if (index === productIndex) {
          return { ...item, qty: item.qty + 1 };
        }
        return item;
      });

      dispatch(
        setCart({
          items: updatedCartItems,
        }),
      );
    }
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
      setIsAdditionalTaxInclude(false);
      return;
    }
    const taxesCopy = [...userInput.taxes];
    taxesCopy.splice(index, 1);
    setUserInput({
      ...userInput,
      taxes: taxesCopy,
    });
  };

  const descreaseItemQty = (id: number) => {
    const productIndex = cartItems.findIndex((item: any) => item.id === id);
    if (productIndex !== -1) {
      const updatedCartItems = cartItems.map((item: any, index: number) => {
        if (index === productIndex) {
          if (item.qty > 1) {
            return { ...item, qty: item.qty - 1 };
          }
        }
        return item;
      });

      dispatch(
        setCart({
          items: updatedCartItems,
        }),
      );
    }
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

  const handleUserInputTax = (key: string, value: string, index: number) => {
    const newTaxes = [...userInput.taxes];

    if (index >= 0 && index < newTaxes.length) {
      newTaxes[index][key] = value;
      if (calculations.subTotal) {
        if (key === 'percent') {
          newTaxes[index].amount = calculateTaxAmount(
            calculations.subTotal,
            parseInt(value || '0', 10),
          ) as unknown as string;
        }
        if (key === 'amount') {
          newTaxes[index].percent = calculateTaxPercent(
            calculations.subTotal,
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

  const cancelCart = () => {
    dispatch(resetCart());
  };

  // [info]: lifecycles

  useEffect(() => {
    if (cartItems.length > 0) {
      const subTotal = cartItems.reduce((total: number, item: any) => {
        let itemSubtotal;
        if (item.discounted_price) {
          itemSubtotal = parseFloat(item.discounted_price) * item.qty;
        } else {
          itemSubtotal = parseFloat(item.total_price) * item.qty;
        }
        return total + itemSubtotal;
      }, 0);

      const calculateTotalTax = () => {
        let totalTax = 0;
        cartItems.forEach((product: any) => {
          if (product.taxes) {
            product.taxes.forEach((tax: any) => {
              totalTax += parseFloat((tax.amount * product.qty).toString());
            });
          }
        });
        return parseFloat(totalTax.toString()).toFixed(2);
      };

      const calculatedSubTotal = parseFloat(subTotal || 0).toFixed(2);
      const calculatedItemTax = calculateTotalTax();

      dispatch(
        setCart({
          calculations: {
            subTotal: calculatedSubTotal,
            item_tax: calculatedItemTax,
            total: (
              parseFloat(calculatedSubTotal) + parseFloat(calculatedItemTax)
            ).toFixed(2),
          },
        }),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

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
    <div className="border h-screen flex flex-col justify-between">
      <p className="font-bold text-2xl px-12 pb-4 pt-8 border-b">Cart</p>
      <div className="overflow-y-scroll h-full">
        {cartItems.length > 0 ? (
          cartItems.map((item: any, index: number) => {
            return (
              <div
                key={`${index + 1}-${item.name}`}
                className="border-b py-4 px-12 rounded-lg flex items-start justify-between relative cursor-pointer hover:bg-slate-50"
              >
                <div>
                  <div className="flex flex-col gap-1 mb-2">
                    <p className="font-medium text-md">{item.name}</p>
                    <div>
                      <p className="text-xs text-gray-400">
                        <strong>Category:</strong> {item.category?.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-[2px]">
                        <strong>Brand:</strong> {item.brand?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    <button
                      type="button"
                      className={`border border-blue-500 text-blue-500 rounded-full px-4 text-sm ${
                        item.discounted_price && 'line-through'
                      }`}
                    >
                      {item.total_price} USD
                    </button>
                    {item.discounted_price && (
                      <button
                        type="button"
                        className="border border-blue-500 text-blue-500 rounded-full px-4 text-sm"
                      >
                        {item.discounted_price} USD
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex flex-col h-full bg-black">
                  <div className="flex bg-white">
                    <button
                      type="button"
                      className="border rounded-l px-2"
                      onClick={() => descreaseItemQty(item.id)}
                    >
                      <MinusSVG />
                    </button>
                    <input
                      type="number"
                      className="w-10 outline-none border text-center"
                      disabled
                      value={item.qty}
                    />
                    <button
                      type="button"
                      className="border rounded-r px-2"
                      onClick={() => increaseItemQty(item.id)}
                    >
                      <AddSVG />
                    </button>
                  </div>
                  <div className="flex items-center flex-1 gap-2 absolute bottom-4 right-12">
                    <button
                      type="button"
                      className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                      onClick={() => handleEditCartItem(item)}
                    >
                      <EditSVG />
                    </button>

                    <button
                      type="button"
                      className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                      onClick={() => removeItemFromCart(item.id)}
                    >
                      <DeleteSVG />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-4 px-12 rounded-lg flex gap-2 items-center justify-center text-gray-600">
            <InfoSVG />
            <p>Cart is empty</p>
          </div>
        )}
      </div>
      <div className="border-t px-8 py-4 border-gray-300 flex-1 flex-grow">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-md">Item</p>
            <p className="font-medium">{cartItems.length} (items)</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-md">Subtotal</p>
            <p className="font-medium">{calculations.subTotal} USD</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-md">Taxes</p>
            <p className="font-extralight">{calculations.item_tax} USD</p>
          </div>
          <div className="flex justify-between items-center mb-6 mt-4">
            <p className="text-lg font-bold">Total</p>
            <p className="font-medium">{calculations.total} USD</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <PrimaryButton
            label="Pay Now"
            loading={false}
            onClickAction={handleOpenOrderConfirmationModal}
          />
          <SecondaryButton
            label="Cancel"
            loading={false}
            onClickAction={cancelCart}
          />
        </div>
      </div>
      {showCartItemEditModal && selectedProduct && (
        <div className="flex items-center justify-center">
          <div
            className="fixed inset-0 transition-opacity h-full"
            onClick={() => setShowCartItemEditModal(false)}
          >
            <div className="absolute inset-0 bg-black opacity-60" />
          </div>
          <div className="max-w-2xl my-10 bg-white rounded-xl fixed z-10 inset-0 overflow-y-auto flex flex-col mx-auto w-fit h-fit">
            <div className="flex flex-col justify-center">
              <div className="relative sm:max-w-xl sm:mx-auto">
                <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
                  <div className="max-w-md mx-auto">
                    <div className="flex items-center space-x-5">
                      <div className="p-4 bg-slate-200 rounded-full flex flex-shrink-0 justify-center items-center text-slate-500 text-2xl font-mono">
                        <InfoSVG />
                      </div>
                      <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                        <h2 className="leading-relaxed">Edit Cart Item</h2>
                        <p className="text-sm text-gray-500 font-normal leading-relaxed">
                          Modify product details, add discounts or additional
                          notes.
                        </p>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                        <div className="flex flex-col">
                          <label htmlFor="item_name" className="leading-loose">
                            Item Name
                          </label>
                          <input
                            type="text"
                            id="item_name"
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                            placeholder="Item Name"
                            value={selectedProduct.name}
                            disabled
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <div className="flex flex-col">
                            <label className="leading-loose">Sale Price</label>
                            <input
                              type="number"
                              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              placeholder="Sale Price"
                              value={selectedProduct.sale_price}
                              disabled
                            />
                          </div>

                          <div className="flex flex-col">
                            <label className="leading-loose">
                              Available Stock
                            </label>
                            <input
                              type="number"
                              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              placeholder="Available Stock"
                              value={selectedProduct.stock_quantity}
                              disabled
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 items-center">
                          <div className="flex flex-col">
                            <label className="leading-loose">
                              Discount Percent
                            </label>
                            <input
                              type="number"
                              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              placeholder="Discount Percent"
                              value={discount.percent}
                              onChange={(e) =>
                                handleDiscount('percent', e.target.value)
                              }
                            />
                          </div>

                          <div className="flex flex-col">
                            <label className="leading-loose">
                              Discount Value
                            </label>
                            <input
                              type="number"
                              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              placeholder="Discount Value"
                              value={discount.value}
                              onChange={(e) =>
                                handleDiscount('value', e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <label className="leading-loose">
                            Additional Notes
                          </label>
                          <input
                            type="text"
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                            placeholder="Add any personalized note for the item and customer"
                          />
                        </div>
                      </div>
                      <div className="pt-4 flex items-center space-x-4">
                        <button
                          type="button"
                          className="flex justify-center items-center w-full text-gray-900 px-4 py-3 rounded-md focus:outline-none"
                          onClick={() => setShowCartItemEditModal(false)}
                        >
                          <svg
                            className="w-6 h-6 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>{' '}
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                          onClick={handleSaveCartItemEdit}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showOrderConfirmationModal && (
        <div className="flex items-center justify-center">
          <div
            className="fixed inset-0 transition-opacity h-full"
            onClick={() => setShowOrderConfirmationModal(false)}
          >
            <div className="absolute inset-0 bg-black opacity-60" />
          </div>
          <div className="max-w-2xl my-10 bg-white rounded-xl fixed z-10 inset-0 overflow-y-scroll flex flex-col mx-auto w-fit h-fit max-h-[90%]">
            <div className="flex flex-col justify-center h-fit">
              <div className="relative sm:max-w-xl sm:mx-auto h-full">
                <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 rounded-3xl sm:p-10 h-full">
                  <div className="max-w-md mx-auto flex flex-col h-full">
                    <div className="flex items-center space-x-5">
                      <div className="block font-semibold text-xl self-start text-gray-700">
                        <h2 className="leading-relaxed">Order Confirmation</h2>
                        <p className="text-sm text-gray-500 font-normal leading-relaxed">
                          Add taxes, customer detail and payment method for your
                          order.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 mb-6">
                      <p>Order Detail</p>
                      <div className="divide-y divide-gray-200">
                        <div className="flex flex-col gap-2 border-b">
                          <div className="flex justify-between items-center">
                            <p className="text-gray-400 text-md">Item</p>
                            <p className="font-medium">
                              {cartItems.length} (items)
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-gray-400 text-md">Subtotal</p>
                            <p className="font-medium">
                              {calculations.subTotal} USD
                            </p>
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="text-gray-400 text-md">Taxes</p>
                            <p className="font-extralight">
                              {calculations.item_tax} USD
                            </p>
                          </div>

                          <div className="flex justify-between items-center mb-6 mt-4">
                            <p className="text-lg font-bold">Total</p>
                            <p className="font-medium">
                              {calculations.subTotal} USD
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" text-base leading-6 text-gray-700 sm:text-lg sm:leading-7 flex flex-col flex-grow flex-auto h-full">
                      {orderConfirmationState === 1 && (
                        <div>
                          <div className="mb-4">
                            <div className="flex gap-4 justify-between items-center">
                              <p>Include Additional Tax</p>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={isAdditionalTaxInclude}
                                  onChange={(event) => {
                                    setIsAdditionalTaxInclude(
                                      event.target.checked,
                                    );
                                  }}
                                />
                                <span className="slider" />
                              </label>
                            </div>
                          </div>
                          {isAdditionalTaxInclude &&
                            userInput.taxes.map((tax: any, index) => (
                              <div
                                className="py-4 space-y-4 text-base"
                                key={`${tax.name}-${index + 1}`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1">
                                    <LabelInput
                                      required
                                      label="Tax Name"
                                      loading={false}
                                      errorMsg={null}
                                    >
                                      <CreatableSelect
                                        isClearable
                                        options={
                                          taxes[0].value.length > 0
                                            ? taxes
                                            : noTaxOptions
                                        }
                                        className=""
                                        placeholder="Tax Name"
                                        value={{
                                          value: '',
                                          label: userInput.taxes[index].name,
                                        }}
                                        onChange={(selectedTax) =>
                                          handleSelectDefaultTax(
                                            selectedTax,
                                            index,
                                          )
                                        }
                                        onCreateOption={(name) =>
                                          handleUserInputTax(
                                            'name',
                                            name,
                                            index,
                                          )
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
                                      errorMsg={
                                        errorMsg[`taxes_percent[${index}]`]
                                      }
                                    >
                                      <input
                                        type="number"
                                        id="tax_percent"
                                        className="bg-white border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                                      errorMsg={
                                        errorMsg[`taxes_amount[${index}]`]
                                      }
                                    >
                                      <input
                                        type="number"
                                        id="tax_amount"
                                        className="bg-white border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                                <button
                                  type="button"
                                  className="text-blue-600 flex items-center gap-2 ml-auto"
                                  onClick={handleAddTax}
                                >
                                  <AddSVG />
                                  <p>Add another</p>
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                      {orderConfirmationState === 2 && (
                        <div className="text-base flex flex-col gap-2">
                          <p className="font-bold my-4">Customer Detail:</p>
                          <div className="flex gap-2 items-center">
                            <LabelInput
                              label="Customer Name"
                              errorMsg={null}
                              loading={false}
                              required={false}
                            >
                              <input
                                type="number"
                                className="p-2.5 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                placeholder="Customer Name"
                                // value={discount.percent}
                                // onChange={(e) =>
                                //   handleDiscount('percent', e.target.value)
                                // }
                              />
                            </LabelInput>

                            <LabelInput
                              label="Customer Phone"
                              errorMsg={null}
                              loading={false}
                              required={false}
                            >
                              <input
                                type="number"
                                className="p-2.5 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                placeholder="Customer Phone"
                                // value={discount.percent}
                                // onChange={(e) =>
                                //   handleDiscount('percent', e.target.value)
                                // }
                              />
                            </LabelInput>
                          </div>
                          <LabelInput
                            label="Customer Email"
                            errorMsg={null}
                            loading={false}
                            required={false}
                          >
                            <input
                              type="number"
                              className="p-2.5 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              placeholder="Customer Email"
                              // value={discount.percent}
                              // onChange={(e) =>
                              //   handleDiscount('percent', e.target.value)
                              // }
                            />
                          </LabelInput>

                          <p className="text-gray-500 text-sm">
                            * This information is required for sending invoice
                            to customer email.
                          </p>
                        </div>
                      )}

                      {orderConfirmationState === 3 && (
                        <div className="text-base">
                          <p className="font-bold my-4">Collect Payment:</p>
                          <div className="text-base !font-thin flex flex-col gap-2">
                            <LabelInput
                              required
                              label="Collected Amount"
                              loading={false}
                              errorMsg={null}
                            >
                              <input
                                type="number"
                                className="p-2.5 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                placeholder="Amount"
                                // value={discount.percent}
                                // onChange={(e) =>
                                //   handleDiscount('percent', e.target.value)
                                // }
                              />
                            </LabelInput>
                            <LabelInput
                              required
                              label="Payment Method"
                              loading={false}
                              errorMsg={errorMsg[`taxes_name[8]`]}
                            >
                              <CreatableSelect
                                isClearable
                                options={taxes}
                                className=""
                                placeholder="Tax Name"
                                value={{
                                  value: '',
                                  label: userInput.taxes[0].name,
                                }}
                                onChange={(selectedTax) =>
                                  handleSelectDefaultTax(selectedTax, 0)
                                }
                                onCreateOption={(name) =>
                                  handleUserInputTax('name', name, 0)
                                }
                              />
                            </LabelInput>
                          </div>
                        </div>
                      )}

                      {/* <div className="flex flex-col">
                        <label className="leading-loose">
                          Additional Notes
                        </label>
                        <input
                          type="text"
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Add any personalized note for the item and customer"
                        />
                      </div> */}
                    </div>
                    <div className="pt-4 flex items-center space-x-4">
                      <button
                        type="button"
                        className="flex gap-2 border justify-center items-center w-full text-gray-900 px-4 py-3 rounded-md focus:outline-none"
                        onClick={() =>
                          orderConfirmationState === 1
                            ? setShowOrderConfirmationModal(false)
                            : setOrderConfirmationState(
                                orderConfirmationState - 1,
                              )
                        }
                      >
                        {orderConfirmationState === 1 ? (
                          <CloseSvg />
                        ) : (
                          <ArrowLongLeft />
                        )}
                        {orderConfirmationState === 1 ? 'Cancel' : 'Back'}
                      </button>
                      <button
                        type="button"
                        className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                        onClick={() =>
                          setOrderConfirmationState(orderConfirmationState + 1)
                        }
                      >
                        Next
                      </button>
                    </div>
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

export default Cart;
