import { Calendar as Calendaroo, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);
function Calendar() {
  const handleSelectSlot = (e) => {
    console.log('===event', e);
  };

  return (
    <div className="p-4 h-full">
      <Calendaroo
        localizer={localizer}
        events={[]}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectSlot={handleSelectSlot}
        selectable
      />
    </div>
  );
}

export default Calendar;
