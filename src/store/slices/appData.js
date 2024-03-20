import { createSlice } from '@reduxjs/toolkit';

const appData = createSlice({
  name: 'appData',
  initialState: {
    products: [], // [info]: store products data
    editProduct: null, // [info]: single product data for edit
    user: null,
    store: null,
    cart: {
      items: [],
      calculations: {
        subTotal: null,
      },
    },
    categories: [],
    brands: [],
    taxes: [],
    paymentMethods: [],
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setEditProduct: (state, action) => {
      state.editProduct = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setStore: (state, action) => {
      state.store = action.payload;
    },
    setCart: (state, action) => {
      state.cart = { ...state.cart, ...action.payload };
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
    setPaymentMethods: (state, action) => {
      state.paymentMethods = action.payload;
    },
    resetCart: (state) => {
      state.cart = {
        items: [],
        calculations: {
          subTotal: null,
        },
      };
    },
  },
});

export const {
  setProducts,
  setEditProduct,
  setUser,
  setStore,
  setCart,
  setCategories,
  setBrands,
  setTaxes,
  setPaymentMethods,
  resetCart,
} = appData.actions;

export default appData.reducer;
