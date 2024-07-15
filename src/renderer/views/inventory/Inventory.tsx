/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import { useLocation, useNavigate } from 'react-router-dom';

/* eslint-disable jsx-a11y/control-has-associated-label */
export default function Inventory({ children }: { children: any }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="flex w-full h-full">
      <div className="w-1/5 border-r hidden md:block">
        <p className="font-medium pt-8 px-8">Inventory</p>
        <div className="px-2 mt-4">
          <div
            className={`hover:bg-slate-100 cursor-pointer transition-all duration-300 p-4 rounded-lg px-6 ${
              pathname.includes('products')
                ? 'bg-purple-100 hover:bg-purple-100'
                : 'bg-transparent'
            }`}
            onClick={() => navigate('/inventory/products')}
          >
            <p className="font-light text-sm">Products</p>
          </div>
          <div
            className={`hover:bg-slate-100 mt-2 cursor-pointer transition-all duration-300 p-4 rounded-lg px-6 ${
              pathname.includes('services')
                ? 'bg-purple-100 hover:bg-purple-100'
                : 'bg-transparent'
            }`}
            onClick={() => navigate('/inventory/services')}
          >
            <p className="font-light text-sm">Services</p>
          </div>
        </div>
      </div>
      <div className="col-span-full md:col-span-10 w-full">{children}</div>
    </div>
  );
}
