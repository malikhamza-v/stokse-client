import {
  Routes,
  Route,
  Navigate,
  MemoryRouter,
  BrowserRouter,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import MainLayout from './components/layout';
import Dashboard from './views/Dashboard';
import './App.scss';
import Product from './views/products/Product';
import { CustomerEdit, Customers } from './views/customer';
import ProductAdd from './views/products/ProductAdd';
import Signin from './views/Signin';
import PrivateRoute from './utils/PrivateRoute';
import ProductEdit from './views/products/ProductEdit';
import { store, persistor } from '../store';
import Sale from './views/sale/Sale';
import Setting from './views/setting/Setting';
import Categories from './views/setting/Categories';
import Brands from './views/setting/Brands';
import PaymentMethods from './views/setting/PaymentMethods';
import Taxes from './views/setting/Taxes';
import Signup from './views/Signup';

import Catalogue from './views/catalogue/Catalogue';
import Orders from './views/orders/Orders';
import OrderEdit from './views/orders/OrderEdit';
import Employees from './views/employee/Employees';
import EmployeeAdd from './views/employee/EmployeeAdd';
import Stores from './views/setting/Stores';
import StoreAdd from './views/setting/StoreAdd';
import Managers from './views/setting/Managers';
import { Toast } from './components/commonComponents';
import EmployeeEdit from './views/employee/EmployeeEdit';
import Logs from './views/setting/Logs';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import SelectStore from './views/SelectStore';
import { isElectron } from './utils/methods';
import Calendar from './views/appointments/Calendar';
import Inventory from './views/inventory/Inventory';
import Service from './views/services/Services';
import ServiceAdd from './views/services/ServiceAdd';
import { PersistGate } from 'redux-persist/integration/react';
import Store from './views/setting/Store';

const RouterComponent = isElectron() ? MemoryRouter : BrowserRouter;

export default function App() {
  const toastId = useRef<any>(null);

  useEffect(() => {
    if (window.electron) {
      const { ipcRenderer } = window.electron;
      ipcRenderer.on('update-download-status', (message: any) => {
        if (toastId.current) {
          toast.update(toastId.current, {
            render: message,
            isLoading: true,
          });
        } else {
          toastId.current = toast.info(message, { isLoading: true });
        }
      });
    }
  }, []);
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div>
            <p>Loading</p>
          </div>
        }
        persistor={persistor}
      >
        <RouterComponent>
          <Toast />
          <Routes>
            <Route path="/sign-in" element={<Signin />} />
            <Route path="/sign-up" element={<Signup />} />

            <Route element={<PrivateRoute />}>
              <Route
                path="/select-store"
                element={
                  <MainLayout>
                    <SelectStore />
                  </MainLayout>
                }
              />

              <Route
                path="/"
                element={
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                }
              />
              {/* [info]: calendar */}
              <Route
                path="/calendar"
                element={
                  <MainLayout>
                    <Calendar isView={false} isCreate={false} />
                  </MainLayout>
                }
              />
              <Route
                path="/calendar/appointment/view/:id"
                element={
                  <MainLayout>
                    <Calendar isView={true} isCreate={false} />
                  </MainLayout>
                }
              />
              <Route
                path="/calendar/appointment/create/"
                element={
                  <MainLayout>
                    <Calendar isView={false} isCreate={true} />
                  </MainLayout>
                }
              />
              <Route
                path="/employees"
                element={
                  <MainLayout>
                    <Employees />
                  </MainLayout>
                }
              />
              <Route
                path="/employee/add"
                element={
                  <MainLayout>
                    <EmployeeAdd />
                  </MainLayout>
                }
              />
              <Route
                path="/employee/edit/:id"
                element={
                  <MainLayout>
                    <EmployeeEdit />
                  </MainLayout>
                }
              />
              <Route
                path="/inventory/"
                element={<Navigate to="/inventory/product-list" replace />}
              />

              <Route
                path="/inventory/product-list"
                element={
                  <MainLayout>
                    <Inventory>
                      <Product isView={false} />
                    </Inventory>
                  </MainLayout>
                }
              />
              <Route
                path="/inventory/product-list/view/:id"
                element={
                  <MainLayout>
                    <Inventory>
                      <Product isView={true} />
                    </Inventory>
                  </MainLayout>
                }
              />
              <Route
                path="/inventory/product-list/add"
                element={
                  <MainLayout>
                    <ProductAdd />
                  </MainLayout>
                }
              />
              <Route
                path="/inventory/product-list/edit/:id"
                element={
                  <MainLayout>
                    <ProductEdit />
                  </MainLayout>
                }
              />

              <Route
                path="/inventory/service-list"
                element={
                  <MainLayout>
                    <Inventory>
                      <Service isView={false} />
                    </Inventory>
                  </MainLayout>
                }
              />

              <Route
                path="/inventory/service-list/add"
                element={
                  <MainLayout>
                    <ServiceAdd isForEdit={false} />
                  </MainLayout>
                }
              />

              <Route
                path="/inventory/service-list/edit/:id"
                element={
                  <MainLayout>
                    <ServiceAdd isForEdit={true} />
                  </MainLayout>
                }
              />

              <Route
                path="/catalogue/"
                element={<Navigate to="/catalogue/order-list" replace />}
              />

              <Route
                path="/catalogue/order-list"
                element={
                  <MainLayout>
                    <Catalogue>
                      <Orders isView={false} />
                    </Catalogue>
                  </MainLayout>
                }
              />

              <Route
                path="/catalogue/order-list/view/:id"
                element={
                  <MainLayout>
                    <Catalogue>
                      <Orders isView={true} />
                    </Catalogue>
                  </MainLayout>
                }
              />

              <Route
                path="/catalogue/customers"
                element={
                  <MainLayout>
                    <Catalogue>
                      <Customers />
                    </Catalogue>
                  </MainLayout>
                }
              />
              {/* [info]: customers */}
              <Route
                path="/customers/"
                element={
                  <MainLayout>
                    <Customers />
                  </MainLayout>
                }
              />
              <Route
                path="/customer/edit/:id"
                element={
                  <MainLayout>
                    <CustomerEdit />
                  </MainLayout>
                }
              />

              <Route
                path="/order/edit/:id"
                element={
                  <MainLayout>
                    <OrderEdit />
                  </MainLayout>
                }
              />

              <Route
                path="/sale"
                element={
                  <MainLayout>
                    <Sale />
                  </MainLayout>
                }
              />
              {/* [info]: Setting */}
              <Route
                path="/setting"
                element={
                  <MainLayout>
                    <Setting />
                  </MainLayout>
                }
              />
              <Route
                path="/setting/categories"
                element={<Navigate to="/setting/categories/product" replace />}
              />
              <Route
                path="/setting/categories/product"
                element={
                  <MainLayout>
                    <Categories />
                  </MainLayout>
                }
              />
              <Route
                path="/setting/categories/service"
                element={
                  <MainLayout>
                    <Categories />
                  </MainLayout>
                }
              />
              <Route
                path="/setting/brands"
                element={
                  <MainLayout>
                    <Brands />
                  </MainLayout>
                }
              />
              <Route
                path="/setting/taxes"
                element={
                  <MainLayout>
                    <Taxes />
                  </MainLayout>
                }
              />
              <Route
                path="/setting/store"
                element={
                  <MainLayout>
                    <Store />
                  </MainLayout>
                }
              />
              <Route
                path="/setting/stores"
                element={
                  <MainLayout>
                    <Stores />
                  </MainLayout>
                }
              />
              <Route
                path="/setting/stores/add"
                element={
                  <MainLayout>
                    <StoreAdd />
                  </MainLayout>
                }
              />
              {/* [info]: Managers */}
              <Route
                path="/setting/managers"
                element={
                  <MainLayout>
                    <Managers />
                  </MainLayout>
                }
              />

              <Route
                path="/setting/payment-methods"
                element={
                  <MainLayout>
                    <PaymentMethods />
                  </MainLayout>
                }
              />

              {/* Logs */}
              <Route
                path="/setting/logs"
                element={
                  <MainLayout>
                    <Logs />
                  </MainLayout>
                }
              />
            </Route>
          </Routes>
        </RouterComponent>
      </PersistGate>
    </Provider>
  );
}
