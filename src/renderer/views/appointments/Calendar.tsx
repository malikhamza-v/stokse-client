import { Calendar as Calendaroo, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Drawer from '../../components/commonComponents/drawer/Drawer';
import { useState } from 'react';

const localizer = momentLocalizer(moment);
function Calendar() {
  const [isCreateAppoinmentDrawerOpen, setIsCreateAppoinmentDrawerOpen] =
    useState(false);
  const handleSelectSlot = (e) => {
    // console.log('===event', e);
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
      ></Drawer>
    </div>
  );
}

export default Calendar;
