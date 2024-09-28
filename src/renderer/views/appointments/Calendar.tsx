import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar as Calendaroo, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Drawer from '../../components/commonComponents/drawer/Drawer';
import { ViewAppointment } from '../../components/viewComponents/drawerContent';
import {
  handleAddSlotToCreateAppointment,
  handleSelectDateForCalendar,
  handleSelectEmployeeForCalendar,
  handleSelectViewForCalendar,
  resetCreateAppointmentData,
} from '../../../store/slices/appSlice';
import {
  addTimeAndDuration,
  convertTime,
  formatDateIntoYYMMDD,
} from '../../utils/methods';
import { useFetch } from '../../utils/hooks';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/commonComponents';
import LoadingSpinner from '../../components/commonComponents/loadingSpinner/LoadingSpinner';

const localizer = momentLocalizer(moment);

let selectedView = 'month';
let startDateGlobal: any = null;
let endDateGlobal: any = null;
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
  const { selectedEmployee, selectedView: selectedViewState } = useSelector(
    (state: any) => state.app.calendar,
  );

  const navigate = useNavigate();

  const handleSelectSlot = (e: any) => {
    dispatch(handleAddSlotToCreateAppointment({ time: e.slots[0] }));
    navigate('/calendar/appointment/create/');
  };

  const handleFetchServicePerformer = () => {
    employeeFetch('/employee/?type=service_performer').then((res) => {
      if (res.status === 200) {
        setServicePerformers(res.data);
      }
    });
  };

  const handleRangeChange = (e: any) => {
    let startTime;
    let endTime;
    if (selectedView === 'month' || selectedView === 'agenda') {
      startTime = e.start;
      endTime = e.end;
    } else if (selectedView === 'day') {
      startTime = e[0];
      endTime = e[0];
    } else {
      startTime = e[0];
      endTime = e[e.length - 1];
    }
    startDateGlobal = startTime;
    endDateGlobal = endTime;
    dispatch(
      handleSelectDateForCalendar({
        startDate: startTime,
        endDate: endTime,
      }),
    );
    fetchAppointments(selectedEmployee);
  };

  const handleViewChange = (e: any) => {
    if (e !== 'agenda') {
      if (!selectedEmployee || selectedEmployee === 'all') {
        dispatch(handleSelectEmployeeForCalendar(servicePerformers[0].id));
      }
    }
    selectedView = e;
    dispatch(handleSelectViewForCalendar(e));
  };

  const fetchAppointments = async (employee: any) => {
    try {
      const res = await appointFetch(
        `/appointments/?start_date=${formatDateIntoYYMMDD(startDateGlobal)}&end_date=${formatDateIntoYYMMDD(endDateGlobal)}${employee ? `&employee=${employee}` : ''}`,
      );
      if (res.status === 200) {
        const appointments: any = res.data;
        const filteredAppointments = appointments.flatMap(
          (appointment: any) => {
            const appointmentDate = appointment.date.split('-');

            return appointment.services.map((service: any) => {
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

              return {
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
              };
            });
          },
        );

        setAppointments(filteredAppointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
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

  const handleSelectEmployee = (e) => {
    if (e.target.value === 'all') {
      navigateToView('agenda');
    } else {
      fetchAppointments(e.target.value);
    }
    dispatch(handleSelectEmployeeForCalendar(e.target.value));
  };

  const navigateToView = (view: string) => {
    selectedView = view;
    const toolBar = document.querySelector('.rbc-toolbar');
    const btnGroup = toolBar?.querySelectorAll('.rbc-btn-group')[1];
    if (btnGroup) {
      let btn = btnGroup.querySelectorAll('button');
      if (view === 'month') {
        btn[0].click();
      } else if (view === 'week') {
        btn[1].click();
      } else if (view === 'day') {
        btn[2].click();
      } else {
        btn[3].click();
      }
    }
  };

  const hasClickedRef = useRef(false);
  useEffect(() => {
    if (!hasClickedRef.current) {
      if (selectedViewState) {
        navigateToView(selectedViewState);
      } else {
        navigateToView('month');
      }
      hasClickedRef.current = true;
    }
  }, [selectedViewState]);

  useEffect(() => {
    handleFetchServicePerformer();
  }, []);

  useEffect(() => {
    if (servicePerformers.length > 0 && !selectedEmployee) {
      dispatch(handleSelectEmployeeForCalendar(servicePerformers[0].id));
    }
  }, [servicePerformers]);

  return (
    <div className="px-4 pb-2 pt-2 h-full -z-10 flex flex-col">
      <div className="p-4 bg-[#F2F2F7] mb-4 shadow-sm rounded-lg relative">
        <select
          onChange={handleSelectEmployee}
          className="select select-sm select-accent w-full max-w-xs rounded-full"
          value={selectedEmployee}
        >
          <option value="all">All</option>
          {servicePerformers.map((employee: any, index) => (
            <option key={index} value={employee.id}>
              {employee?.name}
            </option>
          ))}
        </select>
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-lg text-gray-800">
          Appointments {selectedViewState}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto relative">
        <Calendaroo
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          onRangeChange={handleRangeChange}
          onView={handleViewChange}
          onSelectEvent={handleViewAppointment}
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectSlot={handleSelectSlot}
          selectable
        />
        {appointFetchLoading ? (
          <div className="absolute inset-0 transition-opacity h-[93%] mt-auto">
            <div className="absolute inset-0 bg-slate-400 opacity-15" />
            <div className="left-1/2 top-1/2 translate-x-full translate-y-full  absolute">
              <LoadingSpinner />
            </div>
          </div>
        ) : null}
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
          cancelText="Go Back"
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
