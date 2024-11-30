function PrimaryButton({
  loading,
  label,
  icon,
  onClickAction,
}: {
  loading: boolean;
  label: string;
  icon: any;
  onClickAction: any;
}) {
  return (
    <button
      type="button"
      onClick={onClickAction}
      disabled={loading}
      className={`bg-gray-800 text-white px-4 py-3 w-full text-xl font-medium rounded-lg hover:scale-105 duration-150 ${
        loading && 'opacity-50'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {loading && (
          <div className="flex flex-row gap-1">
            <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
          </div>
        )}
        {icon || null}
        {loading ? 'Loading' : label}
      </div>
    </button>
  );
}

export default PrimaryButton;
