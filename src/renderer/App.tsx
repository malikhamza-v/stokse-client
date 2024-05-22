import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import MainLayout from './components/layout';
import Dashboard from './views/Dashboard';
import './App.css';
import Inventory from './views/inventory/Inventory';
import { CustomerEdit, Customers } from './views/customer';
import InventoryAdd from './views/inventory/InventoryAdd';
import Signin from './views/Signin';
import PrivateRoute from './utils/PrivateRoute';
import InventoryEdit from './views/inventory/InventoryEdit';
import store from '../store';
import Sale from './views/sale/Sale';
import Setting from './views/setting/Setting';
import Categories from './views/setting/Categories';
import Brands from './views/setting/Brands';
import PaymentMethods from './views/setting/PaymentMethods';
import Taxes from './views/setting/Taxes';
import Signup from './views/Signup';
import {
  Brand,
  Category,
  PaymentMethod as SetupPaymentMethod,
} from './views/setup';
import Catalogue from './views/catalogue/Catalogue';
import Orders from './views/orders/Orders';
import OrderEdit from './views/orders/OrderEdit';
import Employees from './views/employee/Employees';
import Store from './views/setup/Store';
import EmployeeAdd from './views/employee/EmployeeAdd';
import Stores from './views/setting/Stores';
import StoreAdd from './views/setting/StoreAdd';
import Managers from './views/setting/Managers';
import { Toast } from './components/commonComponents';
import EmployeeEdit from './views/employee/EmployeeEdit';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toast />
        <Routes>
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />

          <Route element={<PrivateRoute />}>
            <Route path="/setup/store" element={<Store />} />
            <Route path="/setup/business/category" element={<Category />} />
            <Route path="/setup/business/brand" element={<Brand />} />
            <Route
              path="/setup/business/payment-method"
              element={<SetupPaymentMethod />}
            />
            <Route
              path="/"
              element={
                <MainLayout>
                  <Dashboard />
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
              path="/inventory"
              element={
                <MainLayout>
                  <Inventory />
                </MainLayout>
              }
            />
            <Route
              path="/inventory/add"
              element={
                <MainLayout>
                  <InventoryAdd />
                </MainLayout>
              }
            />
            <Route
              path="/inventory/edit/:id"
              element={
                <MainLayout>
                  <InventoryEdit />
                </MainLayout>
              }
            />
            <Route
              path="/catalogue/"
              element={
                <MainLayout>
                  <Catalogue />
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

            {/* [info]: orders */}
            <Route
              path="/orders/"
              element={
                <MainLayout>
                  <Orders />
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
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}
