import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import MainLayout from './components/layout';
import Dashboard from './views/Dashboard';
import './App.css';
import Inventory from './views/inventory/Inventory';
import Customers from './views/Customers';
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
import Business from './views/setup/Business';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />

          <Route element={<PrivateRoute />}>
            <Route path="/setup/business" element={<Business />} />

            <Route
              path="/"
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              }
            />
            <Route
              path="/customer"
              element={
                <MainLayout>
                  <Customers />
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
              path="/sale"
              element={
                <MainLayout>
                  <Sale />
                </MainLayout>
              }
            />
            <Route
              path="/setting"
              element={
                <MainLayout>
                  <Setting />
                </MainLayout>
              }
            />
            <Route
              path="/categories"
              element={
                <MainLayout>
                  <Categories />
                </MainLayout>
              }
            />
            <Route
              path="/brands"
              element={
                <MainLayout>
                  <Brands />
                </MainLayout>
              }
            />
            <Route
              path="/taxes"
              element={
                <MainLayout>
                  <Taxes />
                </MainLayout>
              }
            />
            <Route
              path="/payment-methods"
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
