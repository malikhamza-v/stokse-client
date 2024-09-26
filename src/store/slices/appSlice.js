import { createSlice } from '@reduxjs/toolkit';
import {
  addTimeAndDuration,
  formatDateIntoYYMMDD,
} from '../../renderer/utils/methods';

const appointmentInitialState = {
  services: [],
  customer: null,
  total: 0,
  total_duration: null,
  slot: {
    time: null,
  },
  appointment_status: 'booked',
};

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

  calendar: {
    selectedEmployee: null,
  },

  appointment: appointmentInitialState,
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

    // [info]: calendar
    handleSelectEmployeeForCalendar: (state, action) => {
      state.calendar.selectedEmployee = action.payload;
    },

    // [info]: view appointment
    handleFillAppointmentData: (state, action) => {
      state.appointment = action.payload;
    },

    // [info]: create appointment
    handleAddServiceToCreatedAppointment: (state, action) => {
      const allServices = state.appointment.services;
      const selectedService = {
        ...action.payload,
        start_time: addTimeAndDuration(
          allServices[allServices.length - 1]?.start_time
            ? `${formatDateIntoYYMMDD(state.appointment.slot.time)} ${allServices[allServices.length - 1]?.start_time}`
            : state.appointment.slot.time?.toString(),
          allServices[allServices.length - 1]?.duration || '0min',
          '12',
        ),
      };

      state.appointment.services = [
        ...state.appointment.services,
        selectedService,
      ];
    },

    handleRemoveServiceFromAppointment: (state, action) => {
      const { id, start_time: startTime } = action.payload;
      state.appointment.services = state.appointment.services.filter(
        (service) => !(service.id === id && service.start_time === startTime),
      );
    },

    handleAddCustomerToCreateAppointment: (state, action) => {
      state.appointment.customer = action.payload;
    },

    handleTotalOfCreateAppointment: (state, action) => {
      state.appointment.total = action.payload;
    },

    handleTotalDurationOfCreateAppointment: (state, action) => {
      state.appointment.total_duration = action.payload;
    },

    handleAddSlotToCreateAppointment: (state, action) => {
      state.appointment.slot = {
        ...state.appointment.slot,
        ...action.payload,
      };
    },

    handleUpdateAppointmentStatus: (state, action) => {
      state.appointment.appointment_status = action.payload;
    },

    resetCreateAppointmentData: (state) => {
      state.appointment = appointmentInitialState;
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
  handleRemoveServiceFromAppointment,
  handleAddCustomerToCreateAppointment,
  handleTotalOfCreateAppointment,
  handleTotalDurationOfCreateAppointment,
  handleAddSlotToCreateAppointment,
  resetCreateAppointmentData,

  handleUpdateAppointmentStatus,

  handleFillAppointmentData,
} = appSlice.actions;

export default appSlice.reducer;
