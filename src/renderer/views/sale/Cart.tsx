/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import { resetCart, setCart } from '../../../store/slices/cartSlice';
import { useCreate } from '../../utils/hooks';

import {
  AdditionalTax,
  CartDetail,
  CustomerDetail,
  PaymentCollection,
} from '../../components/viewComponents/cart';

function Cart() {
  // [info]: states
  const [discount, setDiscount] = useState<{
    percent: number | string;
    value: number | string;
  }>({
    percent: 0,
    value: 0,
  });
  const [showCartItemEditModal, setShowCartItemEditModal] = useState(false);
  const [showOrderConfirmationModal, setShowOrderConfirmationModal] =
    useState(false);
  const [recentCreatedOrder, setRecentCreatedOrder] = useState<any>({});

  const [showOrderSuccessfulModal, setShowOrderSuccessfulModal] =
    useState(false);

  const [orderConfirmationState, setOrderConfirmationState] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // [info]: hooks
  const dispatch = useDispatch();

  const cartItems = useSelector((state: any) => state.cart.items);
  const calculations = useSelector((state: any) => state.cart.calculations);

  useEffect(() => {
    console.log(calculations);
  }, [calculations]);
  const customer = useSelector((state: any) => state.cart.customer);
  const user = useSelector((state: any) => state.app.user);

  const { loading: cOrderLoading, createData: orderCreate } = useCreate();

  // [info]: methods
  const handleSendInvoice = () => {};

  const handleCloseOrderSuccessModal = () => {
    setShowOrderSuccessfulModal(false);
    setRecentCreatedOrder({});
  };

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

    setOrderConfirmationState(1);
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
              discount: {
                discounted_price:
                  item.sale_price === discountedPrice && discountedPrice
                    ? null
                    : discountedPrice,
                percent: discount.percent || null,
                amount: discount.value || null,
              },
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

  const handleNext = () => {
    if (orderConfirmationState === 3) {
      if (calculations.total - (calculations.payment?.total || 0) > 0) {
        toast.error('Cart has remaining balance!');
        return;
      }

      const payload = {
        items: cartItems,
        sub_total: calculations.subTotal,
        order_discount: 0,
        tip: 0,
        tax: calculations.order_tax?.taxes || [],
        total: calculations.total,
        payment_methods: calculations.payment?.methods || [],
        payment_status: 'completed',
        status: 'completed',
        created_by: user.id,
        customer_email: customer.email,
        customer_name: customer.name,
        customer_phone: customer.phone,
      };
      orderCreate('/orders/', payload, false)
        .then((res) => {
          if (res.status === 200) {
            toast.success('Order created successfully!');
            setShowOrderConfirmationModal(false);
            setShowOrderSuccessfulModal(true);
            dispatch(resetCart());
            setRecentCreatedOrder(res.data);
          }
          return true;
        })
        .catch(() => {
          return false;
        });
      return;
    }
    setOrderConfirmationState(orderConfirmationState + 1);
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

  const cancelCart = () => {
    dispatch(resetCart());
  };

  // [info]: lifecycles

  useEffect(() => {
    if (cartItems.length > 0) {
      const subTotal = cartItems.reduce((total: number, item: any) => {
        let itemSubtotal;
        if (item.discount.discounted_price) {
          itemSubtotal = parseFloat(item.discount.discounted_price) * item.qty;
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
      console.log(calculations);
      dispatch(
        setCart({
          calculations: {
            subTotal: calculatedSubTotal,
            item_tax: calculatedItemTax,
            // [info]: subTotal already contain the taxes
            total: (
              parseFloat(calculatedSubTotal) +
              parseFloat(calculations.order_tax?.total || 0)
            ).toFixed(2),
          },
        }),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

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
                        item.discount.discounted_price && 'line-through'
                      }`}
                    >
                      {item.total_price} USD
                    </button>
                    {item.discount.discounted_price && (
                      <button
                        type="button"
                        className="border border-blue-500 text-blue-500 rounded-full px-4 text-sm"
                      >
                        {item.discount.discounted_price} USD
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
            <p className="text-gray-400 text-md">Subtotal (incl. taxes)</p>
            <p className="font-medium">{calculations?.subTotal} USD</p>
          </div>

          <div className="flex justify-between items-center mb-6 mt-4">
            <p className="text-lg font-bold">Total</p>
            <p className="font-medium">{calculations?.total} USD</p>
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
          <div className="max-w-2xl  my-10 bg-white rounded-xl fixed z-10 inset-0 overflow-y-scroll flex flex-col mx-auto h-fit max-h-[90%]">
            <div className="flex flex-col justify-center h-fit ">
              <div className="relative sm:max-w-2xl sm:mx-auto h-full w-full">
                <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 rounded-3xl sm:p-10 h-full w-full">
                  <div className="mx-auto flex flex-col h-full ">
                    <div className="flex items-center space-x-5">
                      <div className="block font-semibold text-xl self-start text-gray-700">
                        <h2 className="leading-relaxed">Order Confirmation</h2>
                        <p className="text-sm text-gray-500 font-normal leading-relaxed">
                          Add taxes, customer detail and payment method for your
                          order.
                        </p>
                      </div>
                    </div>
                    <CartDetail />
                    <div className=" text-base leading-6 text-gray-700 sm:text-lg sm:leading-7 flex flex-col flex-grow flex-auto h-full">
                      {orderConfirmationState === 1 && <AdditionalTax />}
                      {orderConfirmationState === 2 && <CustomerDetail />}

                      {orderConfirmationState === 3 && <PaymentCollection />}
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
                        className={`bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none ${
                          cOrderLoading && 'opacity-50'
                        }`}
                        onClick={handleNext}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {cOrderLoading && (
                            <div className="flex flex-row gap-1">
                              <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                              <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
                              <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
                            </div>
                          )}
                          {cOrderLoading ? 'Loading' : 'Next'}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showOrderSuccessfulModal && (
        <div className="flex items-center justify-center">
          <div
            className="fixed inset-0 transition-opacity h-full"
            onClick={() => setShowOrderConfirmationModal(false)}
          >
            <div className="absolute inset-0 bg-black opacity-60" />
          </div>
          <div className="max-w-3xl my-10 bg-white rounded-xl fixed z-10 inset-0 overflow-y-scroll flex flex-col mx-auto h-fit max-h-[90%]">
            <div className="flex flex-col justify-center h-fit">
              <div className="relative w-full sm:mx-auto h-full">
                <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 rounded-3xl sm:p-10 h-full">
                  <div className="max-w-full mx-auto flex flex-col h-full">
                    <div className="flex items-center space-x-5">
                      <div className="block font-semibold text-xl self-start text-gray-700">
                        <h2 className="leading-relaxed">
                          Order has been placed successfully!
                        </h2>
                      </div>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200 table w-full my-4">
                      <thead className="bg-gray-50 table w-full">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 px-4 text-sm font-normal text-gray-500 w-[10%]"
                          >
                            <button
                              type="button"
                              className="flex items-center gap-x-3 focus:outline-none"
                            >
                              <span>Sr.</span>
                            </button>
                          </th>

                          <th
                            scope="col"
                            className="py-3.5 px-3 text-sm font-normal text-left text-gray-500 w-[20%]"
                          >
                            Name
                          </th>

                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-8 text-sm font-normal text-left rtl:text-right text-gray-500 w-[15%] "
                          >
                            Sale Price
                          </th>

                          <th
                            scope="col"
                            className="py-3.5 px-3 text-sm font-normal text-left rtl:text-right text-gray-500 w-[15%] "
                          >
                            Tax
                          </th>

                          <th
                            scope="col"
                            className="py-3.5 px-3 text-sm font-normal text-left rtl:text-right text-gray-500 w-[20%] "
                          >
                            Discount
                          </th>

                          <th
                            scope="col"
                            className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 w-[10%]"
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 overflow-y-scroll">
                        {recentCreatedOrder?.items.map(
                          (item: any, index: number) => (
                            <tr key={item.id} className="table w-full">
                              <td className="px-4 py-4 text-sm font-medium whitespace-pre-wrap w-[10%]">
                                <div>
                                  <p className="text-sm text-wrap  font-normal text-gray-600 mt-2">
                                    <span>{index + 1}</span>
                                  </p>
                                </div>
                              </td>

                              <td className="py-3.5 px-1 text-sm font-medium w-[20%]">
                                <div className="py-1 px-3 text-sm font-normal rounded-full w-32">
                                  <p className="text-sm text-wrap font-normal text-gray-600 capitalize">
                                    <span>{item.name}</span>
                                  </p>
                                </div>
                              </td>

                              <td className="py-4 pl-8 pr-8 text-sm w-[15%]">
                                <div>
                                  <h4 className="text-gray-700 ">
                                    <span>
                                      {parseFloat(item?.sale_price).toFixed(
                                        2,
                                      ) || (0).toFixed(2)}
                                    </span>
                                  </h4>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-sm w-[15%]">
                                <div className="flex items-center">
                                  <span>
                                    {parseFloat(item?.total_tax_amount).toFixed(
                                      2,
                                    ) || (0).toFixed(2)}
                                  </span>
                                </div>
                              </td>

                              <td className="px-7 py-3.5 text-sm whitespace-nowrap w-[20%]">
                                <div>
                                  {item?.discount?.amount || (0).toFixed(2)}
                                </div>
                              </td>

                              <td className="w-[10%] px-4 text-sm py-3.5">
                                <div className="flex items-center">
                                  <span>
                                    {parseFloat(item?.total_price).toFixed(2) ||
                                      (0).toFixed(2)}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                    <div className="flex justify-between text-sm text-gray-600 my-4">
                      <div>
                        <div className="flex flex-col gap-1">
                          <p className="text-base font-medium">
                            Customer Detail:
                          </p>
                          <div className="flex flex-col text-sm text-gray-600">
                            <div className="flex gap-2 items-center mb-2">
                              <p>Name:</p>
                              <p>
                                {recentCreatedOrder.customer.name || 'Walk-In'}
                              </p>
                            </div>
                            <div className="flex gap-2 items-center mb-2">
                              <p>Email:</p>
                              <p>
                                {recentCreatedOrder.customer.email || 'None'}
                              </p>
                            </div>
                            <div className="flex gap-2 items-center mb-2">
                              <p>Phone:</p>
                              <p>
                                {recentCreatedOrder.customer.phone || 'None'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-base font-medium">Order Detail:</p>
                        <div className="flex flex-col w-fit ml-auto text-sm text-gray-600">
                          <div className="flex justify-between gap-4 items-center mb-2">
                            <p>Subtotal:</p>
                            <p>{recentCreatedOrder.sub_total} USD</p>
                          </div>
                          <div className="flex justify-between gap-4 items-center mb-2">
                            <p>Total:</p>
                            <p>{recentCreatedOrder.total} USD</p>
                          </div>
                          <div className="flex justify-between gap-4 items-center mb-2">
                            <p>Change:</p>
                            <p>{recentCreatedOrder.total} USD</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-col gap-1">
                          <p className="text-base font-medium">Payment By:</p>
                          {recentCreatedOrder.payment_methods.map(
                            (method: { method: string; amount: string }) => (
                              <div
                                key={`${method.method}-${method.amount}`}
                                className="flex justify-between gap-4 items-center"
                              >
                                <p>{method.method}:</p>
                                <p>{method.amount} USD</p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center space-x-4">
                      <button
                        type="button"
                        className="flex gap-2 border justify-center items-center w-full text-gray-900 px-4 py-3 rounded-md focus:outline-none"
                        onClick={handleCloseOrderSuccessModal}
                      >
                        <CloseSvg />
                        Cancel
                      </button>
                      <Link
                        className="w-full"
                        to={`/order/edit/${recentCreatedOrder.id}`}
                      >
                        <button
                          type="button"
                          className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                        >
                          <div className="flex items-center justify-center gap-2">
                            View Order
                          </div>
                        </button>
                      </Link>
                      <button
                        type="button"
                        className={`bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none ${
                          cOrderLoading && 'opacity-50'
                        }`}
                        onClick={handleSendInvoice}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {cOrderLoading && (
                            <div className="flex flex-row gap-1">
                              <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                              <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
                              <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
                            </div>
                          )}
                          Send Invoice
                        </div>
                      </button>
                    </div>
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

export default Cart;
