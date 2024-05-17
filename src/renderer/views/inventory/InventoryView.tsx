/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import Drawer from '../../components/commonComponents/drawer/Drawer';

function InventoryView({
  isViewOpen,
  handleCloseView,
}: {
  isViewOpen: boolean;
  handleCloseView: any;
}) {
  // [info]: states
  const [currentView, setCurrentView] = useState('detail');

  //   [info]: methods

  const handleSelectView = (view: string) => {
    setCurrentView(view);
  };

  useEffect(() => {
    if (!isViewOpen) {
      setCurrentView('detail');
    }
  }, [isViewOpen]);
  return (
    <Drawer id="inventory_view" isOpen={isViewOpen} close={handleCloseView}>
      <div className="grid grid-cols-3 h-full">
        <div className="bg-white col-span-1 border-r h-full">
          <div className="flex flex-col justify-between h-full py-12">
            <p className="font-semibold text-center text-2xl truncate">
              Product Name
            </p>
            <div className="flex flex-col gap-4">
              <div
                className={`p-4 rounded-lg mx-4 cursor-pointer hover:bg-gray-100 ${
                  currentView === 'detail'
                    ? 'bg-purple-200 hover:bg-purple-200'
                    : 'bg-transparent'
                }`}
                onClick={() => handleSelectView('detail')}
              >
                <p className="">Product details</p>
              </div>

              <div
                className={`p-4 rounded-lg mx-4 cursor-pointer hover:bg-gray-100 ${
                  currentView === 'order'
                    ? 'bg-purple-200 hover:bg-purple-200'
                    : 'bg-transparent'
                }`}
                onClick={() => handleSelectView('order')}
              >
                <p>Stock Order</p>
              </div>

              <div
                className={`p-4 rounded-lg mx-4 cursor-pointer hover:bg-gray-100 ${
                  currentView === 'sale'
                    ? 'bg-purple-200 hover:bg-purple-200'
                    : 'bg-transparent'
                }`}
                onClick={() => handleSelectView('sale')}
              >
                <p>Sales</p>
              </div>

              <div
                className={`p-4 rounded-lg mx-4 cursor-pointer hover:bg-gray-100 ${
                  currentView === 'history'
                    ? 'bg-purple-200 hover:bg-purple-200'
                    : 'bg-transparent'
                }`}
                onClick={() => handleSelectView('history')}
              >
                <p>Stock History</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 col-span-2 overflow-y-auto">
          <div>
            <p className="font-semibold text-2xl pl-8 pt-8">Product Details</p>

            <div className="bg-white m-8 p-4 rounded-lg">
              <div className="flex items-center justify-between border-b">
                <p className="font-semibold text-base">Basic info</p>
                <button type="button" className="btn btn-link no-underline">
                  Edit
                </button>
              </div>
              <div className="flex flex-col gap-2 py-4 border-b">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Product barcode</p>
                  <p>Id quae est mollit u</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Brand</p>
                  <p>-</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Product category</p>
                  <p>-</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Supplier</p>
                  <p>-</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Amount</p>
                  <p>-</p>
                </div>
              </div>
              <div className="py-4 flex flex-col gap-4">
                <div>
                  <p className="font-medium">Short description</p>
                  <p>
                    Rerum consequatur impedit soluta reprehenderit elit neque
                    sed quo ullamco non omnis dolore ea
                  </p>
                </div>
                <div>
                  <p className="font-medium">Product description</p>
                  <p>
                    Iure error dolor culpa ex quia velit animi eius nisi est
                    impedit nisi
                  </p>
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
                  <p className="font-medium">Primary SKU</p>
                  <p>Id u</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">In stock</p>
                  <p>-</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Supply price</p>
                  <p>-</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Retail price</p>
                  <p>-</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Total stock cost</p>
                  <p>-</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export default InventoryView;
