import cartReducer from './slices/cartSlice';
import appReducer from './slices/appSlice';

const { combineReducers } = require('@reduxjs/toolkit');

const rootReducer = combineReducers({
  cart: cartReducer,
  app: appReducer,
});

export default rootReducer;
