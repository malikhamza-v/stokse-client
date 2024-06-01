const { createSlice } = require('@reduxjs/toolkit');

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
      return { ...state.cart, ...action.payload };
    },
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    setPayment: (state, action) => {
      state.calculations.payment = action.payload;
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
