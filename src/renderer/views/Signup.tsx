/* eslint-disable jsx-a11y/label-has-associated-control */
import { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LabelInput } from '../components/commonComponents';
import useCreate from '../utils/hooks/useCreate';
import { ArrowLongLeft, ArrowLongRight } from '../utils/svg';
import { setUser, setBusiness } from '../../store/slices/appSlice';
import VerifyCode from '../components/viewComponents/signup/verifyCode';
import AdminInfo from '../components/viewComponents/signup/adminInfo';
import SetupBusiness from '../components/viewComponents/signup/setupBusiness';
import { setSignupStep } from '../../store/slices/signupSlice';
import SetupStore from '../components/viewComponents/signup/setupStore';
import Waiting from '../components/viewComponents/signup/waiting';

function Signup() {
  const [userInput, setUserInput] = useState({
    code: '',
    name: '',
    business_name: '',
    phone: '',
    email: '',
    password: '',
    retypePassword: '',
  });

  const [errorMsg, setErrorMsg] = useState<{
    code: string | null;
    email: string | null;
    name: string | null;
    business_name: string | null;
    phone: string | null;
    password: string | null;
    retypePassword: string | null;
  }>({
    code: null,
    email: null,
    phone: null,
    name: null,
    business_name: null,
    password: null,
    retypePassword: null,
  });
  const [isCodeTrue, setIsCodeTrue] = useState(false);
  const {
    loading: registerLoading,
    createData: register,
    setLoading: setRegisterLoading,
  } = useCreate();
  const { createData: businessCreate } = useCreate();

  const signupSetp = useSelector((state: any) => state.signup.signupStep);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //   [info]: methods

  const handleGoBack = () => {
    dispatch(setSignupStep(signupSetp - 1));
  };

  const handleRegister = async () => {
    if (
      userInput.email.length <= 0 ||
      userInput.password.length <= 0 ||
      userInput.retypePassword.length <= 0 ||
      userInput.name.length <= 0 ||
      userInput.business_name.length <= 0 ||
      userInput.phone.length <= 0
    ) {
      let errors = { ...errorMsg };
      if (userInput.email.length <= 0) {
        errors = { ...errors, email: 'This field is required.' };
      }
      if (userInput.password.length <= 0) {
        errors = { ...errors, password: 'This field is required.' };
      }
      if (userInput.retypePassword.length <= 0) {
        errors = { ...errors, retypePassword: 'This field is required.' };
      }
      if (userInput.name.length <= 0) {
        errors = { ...errors, name: 'This field is required.' };
      }
      if (userInput.business_name.length <= 0) {
        errors = { ...errors, business_name: 'This field is required.' };
      }
      if (userInput.phone.length <= 0) {
        errors = { ...errors, phone: 'This field is required.' };
      }
      setErrorMsg(errors);
      return;
    }
    if (userInput.password !== userInput.retypePassword) {
      toast.error('Password do not match!');
      return;
    }

    const payload = {
      code: userInput.code,
      name: userInput.name,
      email: userInput.email,
      phone: userInput.phone,
      password: userInput.password,
      role: 'Admin',
    };

    const registerRes = await register('/auth/register/', payload, false);
    if (registerRes.status === 400) {
      const firstError = Object.keys(registerRes.data)[0];
      if (firstError) {
        setTimeout(() => {
          if (document.getElementById(firstError)) {
            document.getElementById(firstError)?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
            document.getElementById(firstError)?.focus();
          }
        }, 50);
      }
      toast.error(registerRes.data.message);

      setErrorMsg(registerRes.data);
    } else if (registerRes.status === 200) {
      setRegisterLoading(true);
      localStorage.setItem('token', registerRes.data.token);
      localStorage.setItem('user', JSON.stringify(registerRes.data.user));
      dispatch(setUser(registerRes.data.user));
      const createBusinessPayload = {
        name: userInput.business_name,
        admin: registerRes.data.user.id,
      };
      const businessRes = await businessCreate(
        '/business/',
        createBusinessPayload,
        false,
      );
      if (businessRes.status === 200) {
        setRegisterLoading(false);
        // localStorage.setItem('token', registerRes.data.token);
        // localStorage.setItem('user', JSON.stringify(registerRes.data.user));
        localStorage.setItem('business', JSON.stringify(businessRes.data));
        dispatch(setBusiness(businessRes.data));
        navigate('/setup/store');
      }
      setRegisterLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      <div
        className={`flex flex-col px-20 xl:px-40 flex-1 overflow-y-auto h-screen py-14 ${
          signupSetp !== 1 && signupSetp !== 3 ? 'justify-center' : ''
        }`}
      >
        <div>
          <p className="text-3xl font-bold text-blue-600">Ready to register!</p>
          <p>Enter your signup code sent to your email</p>
        </div>

        {signupSetp === 0 ? (
          <VerifyCode />
        ) : signupSetp === 1 ? (
          <AdminInfo />
        ) : signupSetp === 2 ? (
          <SetupBusiness />
        ) : signupSetp === 3 ? (
          <SetupStore />
        ) : (
          <Waiting />
        )}

        <div className="flex items-center justify-between w-full">
          {signupSetp > 0 && (
            <div>
              <button
                type="button"
                className="flex items-center gap-2 justify-end ml-auto my-4 text-blue-600"
                onClick={handleGoBack}
              >
                <ArrowLongLeft />
                <p>Back</p>
              </button>
            </div>
          )}
          <Link to="/sign-in" className="ml-auto">
            <button
              type="button"
              className="flex items-center gap-2 justify-end ml-auto my-4 text-blue-600"
            >
              <p>Back to login</p>
              <ArrowLongRight />
            </button>
          </Link>
        </div>
      </div>

      <div className="h-screen w-1/2">
        <img
          src="https://placehold.co/500x900"
          className="h-full w-full object-cover"
          alt="POS With inventory"
        />
      </div>
    </div>
    // <div className="flex h-screen w-full justify-between">
    //   <div
    //     className="overflow-y-scroll w-1/2 bg-white text-black py-14 flex justify-center"
    //     // style={{
    //     //   height: 'calc(100vh)',
    //     //   maxHeight: 'calc(100vh)',
    //     // }}
    //   >
    //     <div className="mx-auto flex w-2/3 flex-col xl:w-1/2 h-full">
    //       <div>
    //         <p className="text-3xl font-bold text-blue-600">
    //           Ready to register!
    //         </p>
    //         <p>Enter your signup code sent to your email</p>
    //       </div>

    //       {signupSetp === 0 ? (
    //         <VerifyCode />
    //       ) : signupSetp === 1 ? (
    //         <AdminInfo />
    //       ) : signupSetp === 2 ? (
    //         <SetupBusiness />
    //       ) : null}

    //       <div className="flex items-center justify-between w-full">
    //         {signupSetp > 0 && (
    //           <div>
    //             <button
    //               type="button"
    //               className="flex items-center gap-2 justify-end ml-auto my-4 text-blue-600"
    //               onClick={handleGoBack}
    //             >
    //               <ArrowLongLeft />
    //               <p>Back</p>
    //             </button>
    //           </div>
    //         )}
    //         <Link to="/sign-in" className="ml-auto">
    //           <button
    //             type="button"
    //             className="flex items-center gap-2 justify-end ml-auto my-4 text-blue-600"
    //           >
    //             <p>Back to login</p>
    //             <ArrowLongRight />
    //           </button>
    //         </Link>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="h-screen w-1/2">
    //     <img
    //       src="https://placehold.co/500x900"
    //       className="h-full w-full object-cover"
    //       alt="POS With inventory"
    //     />
    //   </div>
    // </div>
  );
}

export default Signup;
