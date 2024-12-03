import { createSlice } from '@reduxjs/toolkit';
import { calculateTotalPaymentAmount } from '../../renderer/utils/methods';

const initialState = {
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

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      return { ...state, ...action.payload };
    },
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    setPayment: (state, action) => {
      if (action.payload) {
        const total = calculateTotalPaymentAmount(action.payload);
        const balance = (state.calculations.total - total).toFixed(2);
        state.calculations.payment = {
          total,
          balance,
          methods: action.payload,
        };
      }
    },

    setOrderLevelTaxes: (state, action) => {
      state.calculations.order_tax = {
        total: action.payload.total,
        taxes: action.payload.taxes,
      };
    },

    resetCart: () => {
      return initialState;
    },
  },
});

export const {
  setCart,
  setCustomer,
  setPayment,
  setOrderLevelTaxes,
  resetCart,
} = cartSlice.actions;
export default cartSlice.reducer;
