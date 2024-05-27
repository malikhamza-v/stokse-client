/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import Drawer from '../../components/commonComponents/drawer/Drawer';
import { CustomerSVG, NotFound, SparklesSVG } from '../../utils/svg';
import { useFetch } from '../../utils/hooks';
import { formatTimestamp } from '../../utils/methods';
import { useParams } from 'react-router-dom';

function OrderView({
  isViewOpen,
  handleCloseView,
}: {
  isViewOpen: boolean;
  handleCloseView: any;
}) {
  // [info]: hooks

  const params = useParams();

  const { loading: singleOrderFetchLoading, fetchData: singleOrderFetch } =
    useFetch();

  const {
    loading: singleOrderActivityFetchLoading,
    fetchData: singleOrderActivityFetch,
  } = useFetch();

  // [info]: states
  const [currentView, setCurrentView] = useState('detail');
  const [order, setOrder] = useState<any>(null);
  const [orderActivity, setOrderActivity] = useState<any>(null);

  //   [info]: methods

  const handleSelectView = (view: string) => {
    setCurrentView(view);

    if (view === 'activity' && !orderActivity) {
      singleOrderActivityFetch(`order-activity/${params.id}/`)
        .then((res) => {
          if (res.status === 200) {
            setOrderActivity(res.data);
          }
          return true;
        })
        .catch(() => {
          return false;
        });
    }
  };

  useEffect(() => {
    if (!isViewOpen) {
      setCurrentView('detail');
    } else {
      singleOrderFetch(`order/${params.id}/`)
        .then((res) => {
          if (res.status === 200) {
            setOrder(res.data);
          }
          return true;
        })
        .catch(() => {
          return false;
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isViewOpen]);

  return (
    <Drawer id="inventory_view" isOpen={isViewOpen} close={handleCloseView}>
      <div className="grid grid-cols-3 h-full">
        <div className="bg-white col-span-1 border-r h-full">
          <div className="flex flex-col justify-between h-full py-12">
            <div className="flex flex-col gap-4">
              <div
                className={`p-4 rounded-lg mx-4 cursor-pointer hover:bg-gray-100 ${
                  currentView === 'detail'
                    ? 'bg-purple-200 hover:bg-purple-200'
                    : 'bg-transparent'
                }`}
                onClick={() => handleSelectView('detail')}
              >
                <p className="">Sale details</p>
              </div>

              <div
                className={`p-4 rounded-lg mx-4 cursor-pointer hover:bg-gray-100 ${
                  currentView === 'activity'
                    ? 'bg-purple-200 hover:bg-purple-200'
                    : 'bg-transparent'
                }`}
                onClick={() => handleSelectView('activity')}
              >
                <p>Sale Activity</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 col-span-2 overflow-y-auto">
          {currentView === 'detail' ? (
            <div>
              <p className="font-semibold text-2xl pl-8 pt-8">Sale Details</p>

              <div className="bg-white m-8 p-4 rounded-lg">
                <div className="flex items-center justify-between border-b pb-4">
                  {singleOrderFetchLoading ? (
                    <div className="flex flex-col gap-4 w-16">
                      <div className="skeleton h-2 w-full" />
                    </div>
                  ) : (
                    <p className="font-semibold text-base">
                      {order?.customer.name || 'Walk-In'}
                    </p>
                  )}
                  <div className="bg-blue-300 h-16 w-16 rounded-full p-4">
                    <CustomerSVG />
                  </div>
                </div>
                <div className="flex flex-col gap-2 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Customer name</p>
                    {singleOrderFetchLoading ? (
                      <div className="flex flex-col gap-4 w-10">
                        <div className="skeleton h-2 w-full" />
                      </div>
                    ) : (
                      <p>{order?.customer.name || 'Walk-In'}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Customer email</p>
                    {singleOrderFetchLoading ? (
                      <div className="flex flex-col gap-4 w-10">
                        <div className="skeleton h-2 w-full" />
                      </div>
                    ) : (
                      <p>{order?.customer?.email}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Customer phone</p>
                    {singleOrderFetchLoading ? (
                      <div className="flex flex-col gap-4 w-10">
                        <div className="skeleton h-2 w-full" />
                      </div>
                    ) : (
                      <p>{order?.customer?.phone}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Total orders</p>
                    {singleOrderFetchLoading ? (
                      <div className="flex flex-col gap-4 w-10">
                        <div className="skeleton h-2 w-full" />
                      </div>
                    ) : (
                      <p>{order?.customer?.total_orders || 0}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white m-8 p-4 rounded-lg">
                <div className="flex flex-col justify-between border-b pb-4">
                  {singleOrderFetchLoading ? (
                    <div className="flex flex-col gap-4 w-52">
                      <div className="skeleton h-2 w-1/2" />
                      <div className="skeleton h-2 w-full" />
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold text-base">
                        Order #{order?.id}
                      </p>
                      <p className="text-gray-500">
                        {formatTimestamp(order?.created_at)}
                      </p>
                    </>
                  )}
                </div>

                <div className="my-4 divide-y">
                  {singleOrderFetchLoading ? (
                    <div className="flex flex-col gap-4 w-full">
                      <div className="skeleton h-2 w-full" />
                      <div className="skeleton h-2 w-full" />
                      <div className="skeleton h-2 w-full" />
                    </div>
                  ) : (
                    order?.items?.map((item: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between "
                        >
                          <div>
                            <div className="flex flex-col gap-0.5">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-gray-600">
                                <span>Category: </span>
                                {item.category.name}
                              </p>
                            </div>
                            <p className="mt-2">
                              <span>Quantity: </span>
                              {item.qty}
                            </p>
                          </div>
                          <p>{item?.total_price}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <p className="font-semibold text-2xl pl-8 pt-8">Sale Activity</p>
              {singleOrderActivityFetchLoading ? (
                <div className="flex flex-col gap-4 w-full p-8">
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-full" />
                </div>
              ) : orderActivity?.length > 0 ? (
                <div className="m-8">
                  {orderActivity.map((activity: any) => {
                    return (
                      <div className="bg-white p-4 rounded-lg border flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                          <p className="font-medium">{activity?.description}</p>
                          <p>{formatTimestamp(activity?.timestamp)}</p>
                        </div>
                        <div>
                          <SparklesSVG />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg flex flex-col gap-2 justify-center items-center h-1/2 m-8">
                  <NotFound />
                  <p className="font-medium">No sale activity here yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}

export default OrderView;
