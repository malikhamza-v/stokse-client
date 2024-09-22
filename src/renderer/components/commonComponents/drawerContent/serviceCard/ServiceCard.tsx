import { convertTimeInto12h } from '../../../../utils/methods';

function ServiceCard({
  service,
  isAdded,
  onClickAction,
}: {
  service: any;
  isAdded: boolean;
  onClickAction: any;
}) {
  return (
    <div
      className="flex items-center justify-between border-l-8 rounded-lg border-purple-300 px-4 py-2 mb-4 cursor-pointer hover:bg-slate-100 hover:rounded-l-none transition-all duration-300 text-base"
      onClick={() => onClickAction(service)}
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
      <p className="font-semibold">{service.price}</p>
    </div>
  );
}

export default ServiceCard;
