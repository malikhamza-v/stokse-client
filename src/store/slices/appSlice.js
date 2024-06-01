import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [], // [info]: store products data
  editProduct: null, // [info]: single product data for edit
  editCustomer: null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  business: JSON.parse(localStorage.getItem('business')) || null,
  store: JSON.parse(localStorage.getItem('store') || null) || null,

  categories: [],
  brands: [],
  taxes: [],
  managers: [],
  stores: [],
  paymentMethods: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setEditProduct: (state, action) => {
      state.editProduct = action.payload;
    },
    setEditCustomer: (state, action) => {
      state.editCustomer = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setBusiness: (state, action) => {
      state.business = action.payload;
    },
    setStore: (state, action) => {
      state.store = action.payload;
    },

    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
    setTaxes: (state, action) => {
      state.taxes = action.payload;
    },
    setManagers: (state, action) => {
      state.managers = action.payload;
    },
    setStores: (state, action) => {
      state.stores = action.payload;
    },
    setPaymentMethods: (state, action) => {
      state.paymentMethods = action.payload;
    },
  },
});

export const {
  setProducts,
  setEditProduct,
  setEditCustomer,
  setUser,
  setBusiness,
  setStore,
  setCategories,
  setBrands,
  setTaxes,
  setManagers,
  setStores,
  setPaymentMethods,
} = appSlice.actions;

export default appSlice.reducer;
