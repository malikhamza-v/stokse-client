import { ReactNode } from 'react';

interface AppButton {
  loading?: boolean;
  icon?: any;
  classes?: string;
  size: 'sm' | 'md' | 'lg';
  type: 'primary' | 'secondary';
  onClickAction: any;
  children?: ReactNode;
}

function AppButton({
  loading,
  icon,
  classes,
  size,
  type,
  onClickAction,
  children,
}: AppButton) {
  return (
    <button
      type="button"
      onClick={onClickAction}
      disabled={loading}
      className={`bg-transparent border ${`btn-${size}`} text-xs px-4 ${type === 'secondary' ? 'btn-outline' : ''} w-fit h-fit border-black font-medium rounded-lg flex items-center justify-center duration-150 ${classes || ''} ${
        loading && 'opacity-50 hover:bg-transparent hover:text-black'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {loading && (
          <div className="flex flex-row gap-1">
            <div className="w-1 h-1 rounded-full bg-black animate-bounce" />
            <div className="w-1 h-1 rounded-full bg-black animate-bounce [animation-delay:-.3s]" />
            <div className="w-1 h-1 rounded-full bg-black animate-bounce [animation-delay:-.5s]" />
          </div>
        )}
        {icon || null}

        {loading ? 'Loading' : children}
      </div>
    </button>
  );
}

export default AppButton;
