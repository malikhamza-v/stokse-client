import { Slide, ToastContainer } from 'react-toastify';

function Toast() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={1000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      toastStyle={{ width: 350 }}
      theme="light"
      transition={Slide}
    />
  );
}

export default Toast;
