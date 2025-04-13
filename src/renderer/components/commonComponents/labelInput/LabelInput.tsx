/* eslint-disable jsx-a11y/label-has-associated-control */
export default function LabelInput({
  label,
  errorMsg,
  loading,
  required,
  isInline,
  htmlfor,
  children,
}: {
  label: string | null;
  errorMsg: string | null;
  loading: boolean;
  required: boolean;
  isInline: boolean;
  htmlfor: string;
  children: any;
}) {
  return (
    <div className={`w-full ${isInline ? 'flex' : ''}`}>
      {label && (
        <label
          htmlFor={htmlfor}
          className="block mb-2 font-medium text-gray-900 text-left"
        >
          {label}
          {required && <span className="text-gray-500 ml-1">*</span>}
        </label>
      )}
      {loading ? (
        <div>
          <div
            className="w-full h-10 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center font-medium text-gray-600"
            style={{ animationDelay: '0.2s' }}
          >
            Loading...
          </div>
        </div>
      ) : (
        children
      )}
      {errorMsg && (
        <span className="text-sm text-red-600 ml-4">{errorMsg}</span>
      )}
    </div>
  );
}
