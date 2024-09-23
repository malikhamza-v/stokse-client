import { createSlice } from '@reduxjs/toolkit';
import {
  addTimeAndDuration,
  formatDateIntoYYMMDD,
} from '../../renderer/utils/methods';

const initialState = {
  products: [], // [info]: store products data
  editProduct: null, // [info]: single product data for edit
  editCustomer: null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  business: JSON.parse(localStorage.getItem('business')) || null,
  store: JSON.parse(localStorage.getItem('store') || null) || null,

  categories: {
    product: [],
    service: [],
  },
  brands: [],
  taxes: [],
  managers: [],
  stores: [],
  paymentMethods: [],
  createdAppointment: {
    services: [],
    customer: null,
    total: 0,
    total_duration: null,
    slot: {
      time: null,
    },
  },
};

const appSlice = createSlice({
  name: 'app',
  initialState,
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
    setBusiness: (state, action) => {
      state.business = action.payload;
    },
    setStore: (state, action) => {
      state.store = action.payload;
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
    setManagers: (state, action) => {
      state.managers = action.payload;
    },
    setStores: (state, action) => {
      state.stores = action.payload;
    },
    setPaymentMethods: (state, action) => {
      state.paymentMethods = action.payload;
    },
    resetAppData() {
      return initialState;
    },

    // [info]: create appointment
    handleAddServiceToCreatedAppointment: (state, action) => {
      const allServices = state.createdAppointment.services;
      const selectedService = {
        ...action.payload,
        start_time: addTimeAndDuration(
          allServices[allServices.length - 1]?.start_time
            ? `${formatDateIntoYYMMDD(state.createdAppointment.slot.time)} ${allServices[allServices.length - 1]?.start_time}`
            : state.createdAppointment.slot.time?.toString(),
          allServices[allServices.length - 1]?.duration || '0min',
        ),
      };

      state.createdAppointment.services = [
        ...state.createdAppointment.services,
        selectedService,
      ];
    },

    handleAddCustomerToCreateAppointment: (state, action) => {
      state.createdAppointment.customer = action.payload;
    },

    handleTotalOfCreateAppointment: (state, action) => {
      state.createdAppointment.total = action.payload;
    },

    handleTotalDurationOfCreateAppointment: (state, action) => {
      state.createdAppointment.total_duration = action.payload;
    },

    handleAddSlotToCreateAppointment: (state, action) => {
      state.createdAppointment.slot = {
        ...state.createdAppointment.slot,
        ...action.payload,
      };
    },
  },
});

export const {
  setProducts,
  setEditProduct,
  setEditCustomer,
  setUser,
  setBusiness,
  setStore,
  setCategories,
  setBrands,
  setTaxes,
  setManagers,
  setStores,
  setPaymentMethods,
  resetAppData,

  handleAddServiceToCreatedAppointment,
  handleAddCustomerToCreateAppointment,
  handleTotalOfCreateAppointment,
  handleTotalDurationOfCreateAppointment,
  handleAddSlotToCreateAppointment,
} = appSlice.actions;

export default appSlice.reducer;
