import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Calendar as Calendaroo, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Drawer from '../../components/commonComponents/drawer/Drawer';
import { ViewAppointment } from '../../components/viewComponents/drawerContent';
import {
  handleAddSlotToCreateAppointment,
  resetCreateAppointmentData,
} from '../../../store/slices/appSlice';
import {
  addTimeAndDuration,
  convertTime,
  getDateAndTimeFromSlot,
} from '../../utils/methods';
import { useFetch } from '../../utils/hooks';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/commonComponents';

const localizer = momentLocalizer(moment);

function CreateAppointmentCancelModalContent() {
  return (
    <p>
      If you close the appointment now,{' '}
      <span className="font-bold">the changes will be lost</span>. Do you wish
      to exit?
    </p>
  );
}

function Calendar({
  isView,
  isCreate,
}: {
  isView: boolean;
  isCreate: boolean;
}) {
  const [servicePerformers, setServicePerformers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isCancelingCreateAppointment, setIsCancelingCreateAppointment] =
    useState(false);

  const { loading: employeeFetchLoading, fetchData: employeeFetch } =
    useFetch();

  const { loading: appointFetchLoading, fetchData: appointFetch } = useFetch();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSelectSlot = (e: any) => {
    dispatch(
      handleAddSlotToCreateAppointment(getDateAndTimeFromSlot(e.slots[0])),
    );
    navigate('/calendar/appointment/create/');
    // setIsCreateAppoinmentDrawerOpen(true);
  };

  const handleFetchServicePerformer = () => {
    employeeFetch('/employee/?type=service_performer').then((res) => {
      if (res.status === 200) {
        setServicePerformers(res.data);
      }
    });
  };

  const fetchAppointments = () => {
    appointFetch('/appointments/').then((res) => {
      if (res.status === 200) {
        const filteredAppointments = [];
        res.data.forEach((appointment: any, index: number) => {
          const appointmentDate = appointment.date.split('-');

          appointment.services.forEach(
            (service: any, service_index: number) => {
              const serviceStartTime = convertTime(
                service.start_time,
                '24',
              ).split(':');
              const start = {
                year: appointmentDate[0],
                month: appointmentDate[1],
                day: appointmentDate[2],
                hour: serviceStartTime[0],
                minute: serviceStartTime[1],
              };
              const serviceEndTime = addTimeAndDuration(
                `${start.year}-${start.month}-${start.day} ${start.hour}:${start.minute}`,
                service.duration,
                '24',
              ).split(':');
              const end = {
                year: appointmentDate[0],
                month: appointmentDate[1],
                day: appointmentDate[2],
                hour: serviceEndTime[0],
                minute: serviceEndTime[1],
              };

              filteredAppointments.push({
                id: `${appointment.id}_${service.id}`,
                title: `${service.name} FOR ${appointment.customer || 'Walk-In'}`,
                start: new Date(
                  parseInt(start.year),
                  parseInt(start.month) - 1,
                  parseInt(start.day),
                  parseInt(start.hour || '0'),
                  parseInt(start.minute || '0'),
                  0,
                ),
                end: new Date(
                  parseInt(end.year),
                  parseInt(end.month) - 1,
                  parseInt(end.day),
                  parseInt(end.hour || '0'),
                  parseInt(end.minute || '0'),
                  0,
                ),
              });
            },
          );
        });

        setAppointments(filteredAppointments);
      }
    });
  };

  const handleCloseCreateAppointmentDrawer = () => {
    setIsCancelingCreateAppointment(true);
  };

  const handleCancelCreateAppointment = () => {
    setIsCancelingCreateAppointment(false);
    dispatch(resetCreateAppointmentData());
    navigate(-1);
  };

  const handleViewAppointment = (e: any) => {
    if (e.id) {
      navigate(`/calendar/appointment/view/${e.id.split('_')[0]}`);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [navigate]);

  useEffect(() => {
    handleFetchServicePerformer();
  }, []);

  return (
    <div className="px-4 pb-2 pt-2 h-full -z-10 flex flex-col">
      <div className="p-4 bg-[#F2F2F7] mb-4 shadow-sm rounded-lg relative">
        <select className="select select-sm select-accent w-full max-w-xs rounded-full">
          <option selected>All</option>
          {servicePerformers.map((employee: any, index) => (
            <option key={index}>{employee?.name}</option>
          ))}
        </select>
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-lg text-gray-800">
          Appointments
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Calendaroo
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          onSelectEvent={handleViewAppointment}
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectSlot={handleSelectSlot}
          selectable
        />
      </div>

      {isView ? (
        <Drawer
          id="view-appointment-drawer"
          isOpen={isView}
          close={() => navigate(-1)}
        >
          <ViewAppointment isView={true} />
        </Drawer>
      ) : null}

      {isCreate ? (
        <Drawer
          id="create-appointment-drawer"
          isOpen={isCreate}
          close={() => handleCloseCreateAppointmentDrawer()}
        >
          <ViewAppointment isView={false} />
        </Drawer>
      ) : null}

      {isCancelingCreateAppointment ? (
        <Modal
          title="Warning"
          description={CreateAppointmentCancelModalContent}
          cancelText="Cancel"
          confirmText="Confirm"
          onCancel={() => setIsCancelingCreateAppointment(false)}
          confirmLoading={false}
          onConfirm={() => handleCancelCreateAppointment()}
        />
      ) : null}
    </div>
  );
}

export default Calendar;
