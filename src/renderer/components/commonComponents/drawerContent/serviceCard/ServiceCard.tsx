import { useState } from 'react';
import { DeleteSVG } from '../../../../utils/svg';
import { useDispatch } from 'react-redux';
import { handleRemoveServiceFromAppointment } from '../../../../../store/slices/appSlice';

function ServiceCard({
  service,
  isAdded,
  onClickAction,
}: {
  service: any;
  isAdded: boolean;
  onClickAction: any;
}) {
  const [isEditIntended, setIsEditIntended] = useState(false);
  const dispatch = useDispatch();
  const handleRemoveAppointment = (id: number, start_time: string) => {
    dispatch(handleRemoveServiceFromAppointment({ id, start_time }));
  };

  return (
    <div
      className="flex items-center justify-between border-l-8 rounded-lg border-purple-300 px-4 py-2 mb-4 cursor-pointer hover:bg-slate-100 hover:rounded-l-none transition-all duration-300 text-base"
      onClick={() => onClickAction(service)}
      onMouseEnter={() => isAdded && setIsEditIntended(true)}
      onMouseLeave={() => setIsEditIntended(false)}
      role="button"
      tabIndex={0}
      aria-hidden="true"
    >
      <div className="flex flex-col gap-2">
        <p className="font-semibold">{service.name}</p>
        <div className="flex items-center gap-2 text-gray-500">
          {isAdded ? (
            <>
              <p>{service?.start_time || 'N/A'}</p>
              <span className="h-1.5 w-1.5 bg-slate-400 rounded-full" />
            </>
          ) : null}
          <p className="">{service.duration}</p>
        </div>
      </div>
      {isEditIntended ? (
        <div className="text-gray-600 transition-all duration-300">
          <div
            onClick={() =>
              handleRemoveAppointment(service.id, service.start_time)
            }
            role="button"
            aria-label="Save"
            aria-hidden="true"
          >
            <DeleteSVG />
          </div>
        </div>
      ) : (
        <p className="font-semibold">{service.price}</p>
      )}
    </div>
  );
}

export default ServiceCard;
