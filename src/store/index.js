import { configureStore } from '@reduxjs/toolkit';
import appData from './slices/appSlice';

const store = configureStore({
  reducer: {
    appData,
  },
});

export default store;
