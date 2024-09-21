function ServiceCard({
  service,
  onClickAction,
}: {
  service: any;
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
        <p className="text-gray-500">{service.duration}</p>
      </div>
      <p className="font-semibold">{service.price}</p>
    </div>
  );
}

export default ServiceCard;
