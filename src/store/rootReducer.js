import cartReducer from './slices/cartSlice';
import appReducer from './slices/appSlice';
import signupReducer from './slices/signupSlice';

const { combineReducers } = require('@reduxjs/toolkit');

const rootReducer = combineReducers({
  cart: cartReducer,
  app: appReducer,
  signup: signupReducer,
});

export default rootReducer;
