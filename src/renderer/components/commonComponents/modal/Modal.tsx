import { ErrorSVG } from '../../../utils/svg';

function Modal({
  title,
  description,
  onCancel,
  onConfirm,
  confirmLoading,
  cancelText,
  confirmText,
}: {
  title: string;
  description: any;
  onCancel: any;
  onConfirm: any;
  confirmLoading: boolean;
  cancelText: string;
  confirmText: string;
}) {
  return (
    <div className="flex items-center justify-center z-50">
      <div>
        <div className="fixed inset-0 transition-opacity h-full ">
          <div className="absolute inset-0 bg-black opacity-60" />
        </div>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="w-full inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ErrorSVG />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      {title}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{description()}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    confirmLoading && 'opacity-50'
                  }`}
                  onClick={() => onConfirm()}
                  disabled={confirmLoading}
                >
                  <div className="flex items-center justify-center gap-2">
                    {confirmLoading && (
                      <div className="flex flex-row gap-1">
                        <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
                        <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
                      </div>
                    )}
                    {confirmLoading ? 'Loading' : confirmText}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => onCancel()}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
