const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
  signupStep: 0,
  code: null,
  adminInfo: {
    name: null,
    email: null,
    phone: null,
    password: null,
  },
  storeInfo: {
    logo: null,
    name: null,
    description: null,
    email: null,
    phone: null,
    city: null,
    country: null,
    address: null,
  },
  businessInfo: {
    name: null,
  },
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setSignupStep(state, action) {
      state.signupStep = action.payload;
    },

    setSignupCode(state, action) {
      state.code = action.payload;
    },

    setAdminInfo(state, action) {
      state.adminInfo = action.payload;
    },

    setStoreInfo(state, action) {
      state.storeInfo = action.payload;
    },

    setBusinessInfo(state, action) {
      state.businessInfo = action.payload;
    },
  },
});

export const {
  setSignupStep,
  setSignupCode,
  setAdminInfo,
  setBusinessInfo,
  setStoreInfo,
} = signupSlice.actions;

export default signupSlice.reducer;
