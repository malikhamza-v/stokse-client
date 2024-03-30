import { createSlice } from '@reduxjs/toolkit';

const appData = createSlice({
  name: 'appData',
  initialState: {
    products: [], // [info]: store products data
    editProduct: null, // [info]: single product data for edit
    editCustomer: null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    store: null,
    cart: {
      items: [],
      customer: { name: '', phone: '', email: '' },
      calculations: {
        payment: {
          balance: null,
          total: null,
          methods: [],
        },
        subTotal: null,
        item_tax: null,
        total: null,
        order_tax: {
          total: null,
          taxes: [],
        },
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
    setEditCustomer: (state, action) => {
      state.editCustomer = action.payload;
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
    setCustomer: (state, action) => {
      state.cart.customer = action.payload;
    },
    setPayment: (state, action) => {
      state.cart.calculations.payment = action.payload;
    },
    setOrderLevelTaxes: (state, action) => {
      state.cart.calculations.order_tax = {
        total: action.payload.total,
        taxes: action.payload.taxes,
      };
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
        customer: { name: '', phone: '', email: '' },
        calculations: {
          payment: {
            balance: null,
            total: null,
            methods: [],
          },
          subTotal: null,
          item_tax: null,
          total: null,
          order_tax: {
            total: null,
            taxes: [],
          },
        },
      };
    },
  },
});

export const {
  setProducts,
  setEditProduct,
  setEditCustomer,
  setUser,
  setStore,
  setCart,
  setOrderLevelTaxes,
  setPayment,
  setCustomer,
  setCategories,
  setBrands,
  setTaxes,
  setPaymentMethods,
  resetCart,
} = appData.actions;

export default appData.reducer;
