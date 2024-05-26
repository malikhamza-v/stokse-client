/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  BackButton,
  PrimaryButton,
} from '../../components/commonComponents/buttons';
import { useFetch } from '../../utils/hooks';
import { ErrorSVG } from '../../utils/svg';
import { formatTimestamp } from '../../utils/methods';

function OrderEdit() {
  // [info]: state
  const [order, setOrder] = useState<any>(null);

  // [info]: hooks
  const { loading: orderFetchLoading, fetchData: orderFetch } = useFetch();
  const params = useParams();

  //   [info]: methods
  const fetchOrder = (id: number) => {
    orderFetch(`/order/${id}/`)
      .then((res) => {
        if (res?.status === 200) {
          setOrder(res.data);
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  // [info]: lifecycle
  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as unknown as number);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className=" flex flex-col gap-4 px-10 py-10 h-full w-full bg-slate-50 overflow-y-scroll">
      <BackButton />
      <h2 className="mb-5 text-left  text-4xl font-semibold font-sans">
        Edit :
      </h2>
      <div className="flex bg-slate-100 rounded-3xl border border-gray-400">
        <div className="w-2/5 p-8">
          <span className="text-xl font-semibold block">Order Info</span>
          <span className="text-gray-600">
            This information is of this order
          </span>
        </div>
        <div className="w-3/5 p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-pink-500 p-6">
            <div className="flex flex-col gap-4 text-gray-500">
              <div className="font-medium flex items-center justify-between">
                <p>Order ID</p>
                {orderFetchLoading ? (
                  <div className="skeleton h-4 w-28 ml-auto" />
                ) : (
                  <div className="py-1 text-sm font-normal rounded-full text-emerald-500 bg-emerald-100/60 w-32 text-center">
                    <p className="text-sm text-wrap  font-normal text-gray-600 capitalize">
                      {/* [todo] */}
                      <span>OR-{order?.id}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="font-medium flex items-center justify-between">
                <p>Order Status</p>
                {orderFetchLoading ? (
                  <div className="skeleton h-4 w-28 ml-auto" />
                ) : (
                  <div className="py-1 text-sm font-normal rounded-full text-emerald-500 bg-emerald-100/60 w-32 text-center">
                    <p className="text-sm text-wrap  font-normal text-gray-600 capitalize">
                      <span>{order?.payment_status}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="font-medium flex items-center justify-between">
                <p>Date</p>
                {orderFetchLoading ? (
                  <div className="skeleton h-4 w-40 ml-auto" />
                ) : (
                  <div className="py-1 px-4 text-sm font-normal rounded-full text-emerald-500 bg-emerald-100/60 w-fit text-center">
                    <p className="text-sm text-wrap font-normal text-gray-600">
                      <span>{formatTimestamp(order?.created_at)}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-slate-100 rounded-3xl border border-gray-400">
        <div className="w-full p-8">
          <span className="text-xl font-semibold block">Order Items</span>
          <span className="text-gray-600">
            These are the products placed under this order
          </span>
        </div>
        <div className="w-full p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-pink-500 p-6">
            <table className="min-w-full divide-y divide-gray-200 table w-full">
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
              <tbody className="bg-white block divide-y divide-gray-200 overflow-y-scroll">
                {orderFetchLoading ? (
                  <>
                    {[...Array(3).keys()].map((index) => (
                      <tr className="table w-full" key={index}>
                        <td className="px-4 py-4 text-sm font-medium whitespace-pre-wrap w-[10%]">
                          <div>
                            <h2 className="font-medium text-gray-800  ">
                              <div
                                className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                                style={{ animationDelay: '0.2s' }}
                              />
                            </h2>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm font-medium w-[20%]">
                          <div
                            className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                            style={{ animationDelay: '0.2s' }}
                          />
                        </td>
                        <td className="py-4 pl-4 pr-8 text-sm w-[15%]">
                          <div className="flex flex-col gap-2">
                            <div
                              className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm w-[15%]">
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

                        <td className="px-4 py-4 text-sm whitespace-nowrap w-[10%]">
                          <div
                            className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                            style={{ animationDelay: '0.2s' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : order?.items?.length > 0 ? (
                  order?.items?.map((item: any, index: number) => {
                    return (
                      <tr key={item.id} className="table w-full">
                        <td className="px-4 py-4 text-sm font-medium whitespace-pre-wrap w-[10%]">
                          <div>
                            <p className="text-sm text-wrap  font-normal text-gray-600 mt-2">
                              <span>{index + 1}</span>
                            </p>
                          </div>
                        </td>

                        <td className="py-4 text-sm font-medium w-[20%]">
                          <div className="py-1 px-3 text-sm font-normal rounded-full w-32">
                            <p className="text-sm text-wrap font-normal text-gray-600 capitalize">
                              <span>{item.name}</span>
                            </p>
                          </div>
                        </td>

                        <td className="py-4 pl-4 pr-8 text-sm w-[15%]">
                          <div>
                            <h4 className="text-gray-700 ">
                              <span>
                                {parseFloat(item?.sale_price).toFixed(2) ||
                                  (0).toFixed(2)}
                              </span>
                            </h4>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-sm w-[15%]">
                          <div className="flex items-center">
                            <span>
                              {parseFloat(item?.total_tax_amount).toFixed(2) ||
                                (0).toFixed(2)}
                            </span>
                          </div>
                        </td>

                        <td className="px-3 py-3.5 text-sm whitespace-nowrap w-[20%]">
                          <div>{item?.discount?.amount || (0).toFixed(2)}</div>
                        </td>

                        <td className="w-[10%] px-4 py-3.5">
                          <div className="flex items-center">
                            <span>
                              {parseFloat(item?.total_price).toFixed(2) ||
                                (0).toFixed(2)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="table w-full">
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-sm font-medium whitespace-pre-wrap w-[20%] text-center"
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
            <div className="flex justify-between text-sm text-gray-600 mb-4 mt-8">
              <div>
                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium mb-3">Customer Detail:</p>
                  <div className="flex flex-col text-sm text-gray-600">
                    <div className="flex gap-2 items-center mb-2">
                      <p>Name:</p>
                      {orderFetchLoading ? (
                        <div className="skeleton h-2 w-20 ml-auto" />
                      ) : (
                        <p>{order?.customer.name || 'Walk-In'}</p>
                      )}
                    </div>
                    <div className="flex gap-2 items-center mb-2">
                      <p>Email:</p>
                      {orderFetchLoading ? (
                        <div className="skeleton h-2 w-20 ml-auto" />
                      ) : (
                        <p>{order?.customer.email || 'None'}</p>
                      )}
                    </div>
                    <div className="flex gap-2 items-center mb-2">
                      <p>Phone:</p>
                      {orderFetchLoading ? (
                        <div className="skeleton h-2 w-20 ml-auto" />
                      ) : (
                        <p>{order?.customer.phone || 'None'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-base font-medium mb-3">Order Detail:</p>
                <div className="flex flex-col w-fit ml-auto text-sm text-gray-600">
                  <div className="flex justify-between gap-4 items-center mb-2">
                    <p>Subtotal:</p>
                    {orderFetchLoading ? (
                      <div className="skeleton h-2 w-20 ml-auto" />
                    ) : (
                      <p>{order?.sub_total} USD</p>
                    )}
                  </div>
                  <div className="flex justify-between gap-4 items-center mb-2">
                    <p>Total:</p>
                    {orderFetchLoading ? (
                      <div className="skeleton h-2 w-20 ml-auto" />
                    ) : (
                      <p>{order?.total} USD</p>
                    )}
                  </div>
                  <div className="flex justify-between gap-4 items-center mb-2">
                    <p>Change:</p>
                    {orderFetchLoading ? (
                      <div className="skeleton h-2 w-20 ml-auto" />
                    ) : (
                      <p>{order?.total} USD</p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium mb-3">Payment By:</p>
                  {orderFetchLoading ? (
                    <div className="flex flex-col gap-2">
                      <div className="skeleton h-2 w-full ml-auto " />
                      <div className="skeleton h-2 w-full ml-auto " />
                    </div>
                  ) : (
                    order?.payment_methods.map(
                      (method: { method: string; amount: string }) => (
                        <div
                          key={`${method.method}-${method.amount}`}
                          className="flex justify-between gap-4 items-center"
                        >
                          <p>{method.method}:</p>
                          <p>{method.amount} USD</p>
                        </div>
                      ),
                    )
                  )}
                </div>
              </div>
            </div>
            {/* <div>
              <div>
                <p>Subtotal:</p>
                <p>{order?.sub_total}</p>
              </div>
              <div>
                <p>Total:</p>
                <p>{order?.total}</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="flex justify-end w-40 ml-auto">
        <PrimaryButton loading={false} label="Edit" onClickAction={null} />
      </div>
    </div>
  );
}

export default OrderEdit;
