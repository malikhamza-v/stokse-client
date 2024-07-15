/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import Drawer from '../../components/commonComponents/drawer/Drawer';
import { NotFound, OrderBox } from '../../utils/svg';
import { useFetch } from '../../utils/hooks';
import { formatTimestamp } from '../../utils/methods';

function InventoryView({
  isViewOpen,
  handleCloseView,
  productID,
}: {
  isViewOpen: boolean;
  handleCloseView: any;
  productID: number;
}) {
  // [info]: hooks
  const { loading: singleProductFetchLoading, fetchData: singleProductFetch } =
    useFetch();

  const {
    loading: singleProductSaleFetchLoading,
    fetchData: singleProductSaleFetch,
  } = useFetch();

  // [info]: states
  const [currentView, setCurrentView] = useState('detail');
  const [product, setProduct] = useState<any>(null);
  const [productSale, setProductSale] = useState<any>(null);

  //   [info]: methods

  const handleSelectView = (view: string) => {
    setCurrentView(view);

    if (view === 'sale' && !productSale) {
      singleProductSaleFetch(`product/sales/${productID}/`)
        .then((res) => {
          if (res.status === 200) {
            setProductSale(res.data);
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
      singleProductFetch(`product/${productID}/`)
        .then((res) => {
          if (res.status === 200) {
            setProduct(res.data);
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
      <div className="flex flex-col md:flex-row h-full pt-12 md:pt-0">
        <div className="bg-white w-full md:w-1/3 border-r flex-shrink-0">
          <div className="flex flex-col justify-between h-full py-4 md:py-12">
            <div className="flex flex-col gap-4 items-center">
              <div className="h-28 w-28 hidden md:block">
                <OrderBox />
              </div>
              {singleProductFetchLoading ? (
                <div className="flex flex-col gap-4 mt-2 mx-12 w-3/4">
                  <div className="skeleton h-2 w-full" />
                  <div className="skeleton h-2 w-32 mx-auto" />
                </div>
              ) : (
                <>
                  <p className="font-semibold text-center text-wrap text-xl truncate px-8">
                    {product?.name}
                  </p>
                  <p className="border bg-green-100 w-fit p-1 mt-2 mb-4 md:mb-0">
                    {parseFloat(product?.stock_quantity || '0')} in stock
                  </p>
                </>
              )}
            </div>

            <div className="flex items-start w-screen px-4 md:w-full overflow-x-auto hide-scrollbar md:flex-col gap-4">
              <div
                className={`p-4 rounded-lg  cursor-pointer hover:bg-gray-100 ${
                  currentView === 'detail'
                    ? 'bg-purple-200 hover:bg-purple-200'
                    : 'bg-transparent'
                } w-full min-w-fit`}
                onClick={() => handleSelectView('detail')}
              >
                <p className="">Product details</p>
              </div>

              <div
                className={`p-4 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  currentView === 'order'
                    ? 'bg-purple-200 hover:bg-purple-200'
                    : 'bg-transparent'
                } w-full min-w-fit`}
                onClick={() => handleSelectView('order')}
              >
                <p>Stock Order</p>
              </div>

              <div
                className={`p-4 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  currentView === 'sale'
                    ? 'bg-purple-200 hover:bg-purple-200'
                    : 'bg-transparent'
                } w-full min-w-fit`}
                onClick={() => handleSelectView('sale')}
              >
                <p>Sales</p>
              </div>

              <div
                className={`p-4 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  currentView === 'history'
                    ? 'bg-purple-200 hover:bg-purple-200'
                    : 'bg-transparent'
                } w-full min-w-fit`}
                onClick={() => handleSelectView('history')}
              >
                <p>Stock History</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 w-full md:w-2/3 h-full overflow-y-auto hide-scrollbar mb-[4.5rem] md:mb-0">
          {currentView === 'detail' ? (
            <div>
              <p className="font-semibold text-2xl pl-8 pt-8">
                Product Details
              </p>

              <div className="bg-white m-8 p-4 rounded-lg">
                <div className="flex items-center justify-between border-b">
                  <p className="font-semibold text-base">Basic info</p>
                  <button type="button" className="btn btn-link no-underline">
                    Edit
                  </button>
                </div>
                <div className="flex flex-col gap-2 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Product ID</p>
                    {singleProductFetchLoading ? (
                      <div className="flex flex-col gap-4 w-10">
                        <div className="skeleton h-2 w-full" />
                      </div>
                    ) : (
                      <p>{product?.product_id}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Brand</p>
                    {singleProductFetchLoading ? (
                      <div className="flex flex-col gap-4 w-10">
                        <div className="skeleton h-2 w-full" />
                      </div>
                    ) : (
                      <p>{product?.brand?.name}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Product category</p>
                    {singleProductFetchLoading ? (
                      <div className="flex flex-col gap-4 w-10">
                        <div className="skeleton h-2 w-full" />
                      </div>
                    ) : (
                      <p>{product?.category?.name}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Reorder Quantity</p>
                    {singleProductFetchLoading ? (
                      <div className="flex flex-col gap-4 w-10">
                        <div className="skeleton h-2 w-full" />
                      </div>
                    ) : (
                      <p>{product?.reorder_quantity || 0}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Supplier</p>
                    {singleProductFetchLoading ? (
                      <div className="flex flex-col gap-4 w-10">
                        <div className="skeleton h-2 w-full" />
                      </div>
                    ) : (
                      <p>- -</p>
                    )}
                  </div>
                </div>
                <div className="py-4 flex flex-col gap-4">
                  <div>
                    <p className="font-medium">Description</p>
                    {singleProductFetchLoading ? (
                      <div className="flex flex-col gap-4 w-4/5 mt-4">
                        <div className="skeleton h-2 w-full" />
                      </div>
                    ) : (
                      <p className="mt-2">{product?.description}</p>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Notes</p>
                    {singleProductFetchLoading ? (
                      <div className="flex flex-col gap-4 w-4/5 mt-4">
                        <div className="skeleton h-2 w-full" />
                      </div>
                    ) : (
                      <p className="mt-2">{product?.addition_notes || '- -'}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white m-8 p-4 rounded-lg">
                <div className="flex items-center justify-between border-b">
                  <p className="font-semibold text-base">Stock Info</p>
                  <button type="button" className="btn btn-link no-underline">
                    Edit
                  </button>
                </div>
                <div className="flex flex-col gap-2 py-4 ">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">In stock</p>
                    {singleProductFetchLoading ? (
                      <div className="flex flex-col gap-4 mt-2">
                        <div className="skeleton h-2 w-10" />
                      </div>
                    ) : (
                      <p>{product?.stock_quantity}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Supply price</p>
                    {singleProductFetchLoading ? (
                      <div className="flex flex-col gap-4 mt-2">
                        <div className="skeleton h-2 w-10" />
                      </div>
                    ) : (
                      <p>{product?.cost_price}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Retail price</p>
                    {singleProductFetchLoading ? (
                      <div className="flex flex-col gap-4  mt-2">
                        <div className="skeleton h-2 w-10" />
                      </div>
                    ) : (
                      <p>{product?.sale_price}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Taxes </p>
                    {singleProductFetchLoading ? (
                      <div className="flex flex-col gap-4  mt-2">
                        <div className="skeleton h-2 w-10" />
                      </div>
                    ) : (
                      <p>
                        {product?.taxes && product?.taxes.length > 0
                          ? product.taxes.reduce(
                              (acc: number, current: any) =>
                                parseFloat(
                                  acc.toString() +
                                    parseFloat(current.amount || '0'),
                                ).toFixed(2),
                              0,
                            )
                          : '- -'}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Total stock cost</p>
                    {singleProductFetchLoading ? (
                      <div className="flex flex-col gap-4 mt-2">
                        <div className="skeleton h-2 w-10" />
                      </div>
                    ) : (
                      <p>
                        {(
                          parseFloat(product?.stock_quantity || '0') *
                          parseFloat(product?.cost_price || '0')
                        ).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : currentView === 'order' ? (
            <div className="flex flex-col h-full">
              <p className="font-semibold text-2xl pl-8 pt-8">Stock Orders</p>
              <div className="border border-gray-300 rounded-lg flex flex-col gap-2 justify-center items-center h-1/2 m-12">
                <NotFound />
                <p className="font-medium">No stock orders here yet</p>
              </div>
            </div>
          ) : currentView === 'sale' ? (
            <div className="flex flex-col h-full">
              <p className="font-semibold text-2xl pl-4 md:pl-8 pt-8">Sales</p>
              {singleProductSaleFetchLoading ? (
                <div className="flex flex-col gap-4 m-4 xl:m-12">
                  <div className="skeleton h-16 w-full" />
                  <div className="skeleton h-16 w-full" />
                  <div className="skeleton h-16 w-full" />
                  <div className="skeleton h-16 w-full" />
                </div>
              ) : productSale?.length > 0 ? (
                <div className="bg-white m-4 md:m-8 xl:m-12 divide-y">
                  {productSale?.map((sale: any) => {
                    return (
                      <div
                        key={sale?.id}
                        className="p-4 cursor-pointer flex flex-col gap-1"
                      >
                        <p>{sale?.id}</p>
                        <p>Created on {formatTimestamp(sale?.created_at)}</p>
                        <p>{sale?.created_by?.name || '- -'}</p>
                        <p className="font-semibold">{sale?.total || '0'}</p>
                        <p className="border bg-green-100 w-fit p-1 mt-2">
                          {sale?.status || 'Pending'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg flex flex-col gap-2 justify-center items-center h-1/2 m-12">
                  <NotFound />
                  <p className="font-medium">No sales here yet</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <p className="font-semibold text-2xl pl-4 md:pl-8 pt-8">
                Stock History
              </p>
              <div className="border border-gray-300 rounded-lg flex flex-col gap-2 justify-center items-center h-1/2 m-4 md:m-12">
                <NotFound />
                <p className="font-medium">No stock history here yet</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}

export default InventoryView;
