import { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useCreate, useFetch } from '../../../../utils/hooks';
import { useDispatch, useSelector } from 'react-redux';
import {
  handleAddServiceToCreatedAppointment,
  handleAddSlotToCreateAppointment,
  handleFillAppointmentData,
  handleTotalDurationOfCreateAppointment,
  handleTotalOfCreateAppointment,
  resetCreateAppointmentData,
} from '../../../../../store/slices/appSlice';
import { ServiceCard } from '../../../commonComponents/drawerContent';
import { AddSVG } from '../../../../utils/svg';
import SelectCustomer from '../selectCustomer/SelectCustomer';
import {
  formatDateIntoYYMMDD,
  getYYMMDD,
  handleCalculateTotalDuration,
  handleTimeForAPI,
} from '../../../../utils/methods';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingList from './LoadingList';
import { toast } from 'react-toastify';
import LoadingButton from '../../../commonComponents/loadingButton/LoadingButton';
import { APPOINTMENT_STATUS_COLOR } from '../../../../utils/constant';

function ViewAppointment({ isView }: { isView: boolean }) {
  const [services, setServices] = useState<any>([]);
  const [isIntendedToAddService, setIsIntendedToAddService] = useState(false);

  const { loading: appointmentFetchLoading, fetchData: appointmentFetch } =
    useFetch();
  const { loading: servicesFetchLoading, fetchData: servicesFetch } =
    useFetch();
  const { loading: cAppointmentLoading, createData: appointmentCreate } =
    useCreate();

  const dispatch = useDispatch();
  const selectedServices = useSelector(
    (state: any) => state.app.appointment.services,
  );
  const {
    customer: selectedCustomer,
    total,
    total_duration: totalDuration,
    slot,
    appointment_status,
  } = useSelector((state: any) => state.app.appointment);

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  //   [methods]:
  const handleAddService = (service: any) => {
    dispatch(handleAddServiceToCreatedAppointment(service));
    setIsIntendedToAddService(false);
  };

  const handleAppointmentTimeChange = (time: string) => {
    console.log(time);
    dispatch(handleAddSlotToCreateAppointment({ time: time }));
  };

  const handleSaveAppointment = () => {
    const payload = {
      customer: selectedCustomer?.id || null,
      // store: null,
      employee: 1, // [todo]: fix this employee
      // created_by: null,
      date: formatDateIntoYYMMDD(slot.time),
      start_time: handleTimeForAPI(slot.time),
      frequency_value: null,
      frequency_unit: null,
      frequency_end_value: null,
      services: selectedServices,
      total_price: total,
      total_duration: totalDuration,
      payment_status: 'unpaid',
      appointment_status: appointment_status,
      notes: null,
    };

    appointmentCreate('/appointments/', payload, false).then((res) => {
      if (res.status === 200) {
        dispatch(resetCreateAppointmentData());
        toast.success('Appointment set successfully!');
        navigate('/calendar');
      }
    });
  };

  const fetchServices = () => {
    servicesFetch('/services/')
      .then((res) => {
        if (res?.status === 200) {
          const categorizedServices = res?.data.reduce((acc, service) => {
            const categoryId = service.category.id;
            const categoryName = service.category.name;

            // If the category doesn't exist in the accumulator, create it
            if (!acc[categoryId]) {
              acc[categoryId] = {
                categoryName: categoryName,
                services: [],
              };
            }

            // Push the service to the appropriate category
            acc[categoryId].services.push(service);

            return acc;
          }, {});

          setServices(categorizedServices);
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const fetchSingleAppointment = (id: number) => {
    appointmentFetch(`/appointments/${id}`).then((res) => {
      if (res.status === 200) {
        const payloadToSet = {
          services: res.data.services,
          customer: res.data.customer,
          slot: {
            time: new Date(`${res.data.date} ${res.data.start_time}`),
          },
          appointment_status: res.data.appointment_status,
        };
        dispatch(handleFillAppointmentData(payloadToSet));
        console.log('====res', res.data);
      }
    });
  };

  //   [info]: lifecyles
  useEffect(() => {
    const totalAmount = selectedServices.reduce((sum, service) => {
      return sum + parseFloat(service.price);
    }, 0);
    const totalDuration = handleCalculateTotalDuration(selectedServices);
    dispatch(handleTotalOfCreateAppointment(totalAmount));
    dispatch(handleTotalDurationOfCreateAppointment(totalDuration));
  }, [selectedServices]);

  useEffect(() => {
    if (location.pathname.includes('create')) {
      if (!slot?.time) {
        navigate('/calendar');
      } else {
        fetchServices();
      }
    } else if (location.pathname.includes('view')) {
      if (params.id) {
        fetchSingleAppointment(parseInt(params?.id));
      } else {
        navigate('/calendar');
      }
    }
  }, [navigate]);

  return (
    <div className="flex h-full transition-all duration-300 box-border">
      <div
        className="flex-1 border-r transition-all duration-300 box-border"
        id="left_container"
      >
        <SelectCustomer />
      </div>

      <div className="min-w-[35vw] w-[35vw] max-w-[35vw]  overflow-y-auto ">
        {selectedServices.length > 0 && !isIntendedToAddService ? (
          <div className="h-full flex flex-col">
            <div
              className="px-8 pt-6 pb-2 border-b"
              style={{
                backgroundColor: location.pathname.includes('view')
                  ? APPOINTMENT_STATUS_COLOR[appointment_status]
                  : 'transparent',
              }}
            >
              <div className="text-3xl font-semibold flex items-center gap-1.5">
                <span>{getYYMMDD(new Date(slot?.time)).dayOfWeek},</span>
                <span>{getYYMMDD(new Date(slot?.time)).day}</span>
                <span>{getYYMMDD(new Date(slot?.time)).month}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* <p>{slot?.time || 'None'}</p> */}
                <div className="time_picker hover:underline">
                  <Flatpickr
                    placeholder="Time"
                    value={slot?.time || ''}
                    options={{
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: 'h:i K',
                    }}
                    onChange={handleAppointmentTimeChange}
                  />
                </div>
                <span className="mb-2">.</span>
                <p>Doesn't repeat</p>
              </div>
            </div>
            <div className="flex-1 p-8 overflow-y-auto hide-scrollbar h-full">
              <p className="font-semibold text-2xl">Services</p>
              <div className="mt-4">
                {selectedServices.map((service: any, index: any) => {
                  return (
                    <ServiceCard
                      key={index}
                      service={service}
                      isAdded
                      onClickAction={() => {}}
                    />
                  );
                })}
              </div>
              <div>
                <button
                  onClick={() => setIsIntendedToAddService(true)}
                  className="btn btn-outline rounded-full text-sm"
                >
                  <div className="border rounded-full border-black p-0.5">
                    <AddSVG />
                  </div>
                  Add service
                </button>
              </div>
            </div>
            <div className="p-8 text-lg border-t">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium">Total</p>
                <div className="flex items-center gap-4 text-base">
                  <p className="text-gray-500">
                    {totalDuration?.split(':')[0]}h{' '}
                    {totalDuration?.split(':')[1]}
                    min
                  </p>
                  <p className="font-semibold">PKR {total}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="btn btn-outline">Checkout</button>
                <LoadingButton
                  text="Save"
                  onConfirm={() => handleSaveAppointment()}
                  loading={cAppointmentLoading}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <p className="font-medium text-2xl">Select Service</p>
            <div className="mt-4">
              <label
                aria-label="search_service"
                htmlFor="search_service"
                className="input input-bordered flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  className="grow"
                  placeholder="Search service by name"
                  id="search_service"
                />
              </label>
            </div>

            <div className="mt-8 text-lg">
              {servicesFetchLoading ? (
                <LoadingList />
              ) : (
                Object.keys(services).map((cat, index) => {
                  const serviceCategory = services[cat];
                  return (
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-lg">
                          {serviceCategory.categoryName}
                        </p>
                        <span className="badge badge-outline">
                          {serviceCategory?.services?.length}
                        </span>
                      </div>

                      <div className="mt-4">
                        {serviceCategory.services.map((service: any) => {
                          return (
                            <ServiceCard
                              key={service.id}
                              service={service}
                              onClickAction={handleAddService}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewAppointment;
