import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Calendar as Calendaroo, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Drawer from '../../components/commonComponents/drawer/Drawer';
import { CreateAppointment } from '../../components/viewComponents/drawerContent';
import { handleAddSlotToCreateAppointment } from '../../../store/slices/appSlice';
import { getDateAndTimeFromSlot } from '../../utils/methods';

const localizer = momentLocalizer(moment);
function Calendar() {
  const [isCreateAppoinmentDrawerOpen, setIsCreateAppoinmentDrawerOpen] =
    useState(false);

  const dispatch = useDispatch();

  const handleSelectSlot = (e: any) => {
    dispatch(
      handleAddSlotToCreateAppointment(getDateAndTimeFromSlot(e.slots[0])),
    );
    setIsCreateAppoinmentDrawerOpen(true);
  };

  return (
    <div className="p-4 h-full -z-10">
      <Calendaroo
        localizer={localizer}
        events={[]}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectSlot={handleSelectSlot}
        selectable
      />

      <Drawer
        id="create-appointment-drawer"
        isOpen={isCreateAppoinmentDrawerOpen}
        close={() => setIsCreateAppoinmentDrawerOpen(false)}
      >
        <CreateAppointment />
      </Drawer>
    </div>
  );
}

export default Calendar;
