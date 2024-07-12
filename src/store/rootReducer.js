import { combineReducers } from '@reduxjs/toolkit';

import cartReducer from './slices/cartSlice';
import appReducer from './slices/appSlice';
import signupReducer from './slices/signupSlice';

const rootReducer = combineReducers({
  cart: cartReducer,
  app: appReducer,
  signup: signupReducer,
});

export default rootReducer;
