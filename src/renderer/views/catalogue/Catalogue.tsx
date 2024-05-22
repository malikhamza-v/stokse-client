/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import { useState } from 'react';
import { Customers } from '../customer';
import Orders from '../orders/Orders';

/* eslint-disable jsx-a11y/control-has-associated-label */
export default function Catalogue() {
  const [selectedCatalogue, setSelectedCatalogue] = useState('order');

  return (
    <div className="grid grid-cols-12 w-full">
      <div className="col-span-2 border-r ">
        <p className="font-medium pt-8 px-8">Catalogue</p>
        <div className="px-2 mt-4">
          <div
            className={`hover:bg-slate-100 cursor-pointer transition-all duration-300 p-4 rounded-lg px-6 ${
              selectedCatalogue === 'order'
                ? 'bg-purple-100 hover:bg-purple-100'
                : 'bg-transparent'
            }`}
            onClick={() => setSelectedCatalogue('order')}
          >
            <p className="font-light text-sm">Orders</p>
          </div>
          <div
            className={`hover:bg-slate-100 mt-2 cursor-pointer transition-all duration-300 p-4 rounded-lg px-6 ${
              selectedCatalogue === 'customer'
                ? 'bg-purple-100 hover:bg-purple-100'
                : 'bg-transparent'
            }`}
            onClick={() => setSelectedCatalogue('customer')}
          >
            <p className="font-light text-sm">Customers</p>
          </div>
        </div>
      </div>
      <div className="col-span-10 ">
        {selectedCatalogue === 'order' ? <Orders /> : <Customers />}
      </div>
    </div>
  );
}
