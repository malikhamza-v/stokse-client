import { configureStore } from '@reduxjs/toolkit';
import appData from './slices/appData';

const store = configureStore({
  reducer: {
    appData,
  },
});

export default store;
