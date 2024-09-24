function LoadingButton({
  onConfirm,
  text,
  loading,
}: {
  onConfirm: any;
  text: string;
  loading: boolean;
}) {
  return (
    <div className="w-full">
      <button
        type="button"
        className="btn btn-neutral w-full"
        onClick={() => onConfirm()}
        disabled={loading}
      >
        <div className="flex items-center justify-center gap-2">
          {loading && (
            <div className="flex flex-row gap-1">
              <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
              <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
            </div>
          )}

          <span className={loading ? 'text-gray-600' : ''}>
            {loading ? 'Loading' : text}
          </span>
        </div>
      </button>
    </div>
  );
}

export default LoadingButton;
