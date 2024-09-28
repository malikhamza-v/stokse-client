import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import cartReducer from './slices/cartSlice';
import appReducer from './slices/appSlice';
import signupReducer from './slices/signupSlice';

const persistConfig = {
  key: 'app',
  storage,
  whitelist: ['calendar'],
};

const persistedReducer = persistReducer(persistConfig, appReducer);

const rootReducer = combineReducers({
  cart: cartReducer,
  app: persistedReducer,
  signup: signupReducer,
});

export default rootReducer;
