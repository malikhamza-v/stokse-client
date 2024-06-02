import { ChangeEvent, useState } from 'react';
import { LabelInput } from '../../commonComponents';
import { toast } from 'react-toastify';
import { useCreate } from '../../../utils/hooks';
import { setUser } from '../../../../store/slices/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAdminInfo,
  setSignupStep,
} from '../../../../store/slices/signupSlice';

function AdminInfo() {
  const [userInput, setUserInput] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    retypePassword: '',
  });

  const [errorMsg, setErrorMsg] = useState<{
    email: string | null;
    name: string | null;
    phone: string | null;
    password: string | null;
    retypePassword: string | null;
  }>({
    name: null,
    email: null,
    phone: null,
    password: null,
    retypePassword: null,
  });

  const { loading: registerLoading, createData: register } = useCreate();

  const dispatch = useDispatch();
  const signupCode = useSelector((state: any) => state.signup.code);
  const signstep = useSelector((state: any) => state.signup.signupStep);

  //   [info]: methods
  const handleInput = (e: ChangeEvent<HTMLInputElement>, type: string) => {
    if (type === 'retypePassword') {
      if (e.target.value !== userInput.password) {
        setErrorMsg({
          ...errorMsg,
          retypePassword: 'Password does not match.',
        });
      } else {
        setErrorMsg({
          ...errorMsg,
          retypePassword: null,
        });
      }
    } else {
      setErrorMsg({ ...errorMsg, [type]: null });
    }
    setUserInput({ ...userInput, [type]: e.target.value });
  };

  const validateRegistration = async () => {
    if (
      userInput.email.length <= 0 ||
      userInput.password.length <= 0 ||
      userInput.retypePassword.length <= 0 ||
      userInput.name.length <= 0 ||
      userInput.phone.length <= 0
    ) {
      console.log(userInput);
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
      code: signupCode,
      name: userInput.name,
      email: userInput.email,
      phone: userInput.phone,
      password: userInput.password,
      role: 'Admin',
    };

    const registerRes = await register(
      '/auth/validate-register/',
      payload,
      false,
    );
    if (registerRes.status === 400) {
      console.log(registerRes);
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
      //   localStorage.setItem('token', registerRes.data.token);
      //   localStorage.setItem('user', JSON.stringify(registerRes.data.user));
      //   dispatch(setUser(registerRes.data.user));
      dispatch(
        setAdminInfo({
          name: userInput.name,
          email: userInput.email,
          phone: userInput.phone,
          password: userInput.password,
        }),
      );
      dispatch(setSignupStep(signstep + 1));
    }
  };

  return (
    <div>
      <div className="mt-10 ">
        <LabelInput
          label="Full name"
          errorMsg={errorMsg.name}
          required
          loading={false}
        >
          <input
            type="text"
            id="name"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
            placeholder="Enter full name"
            value={userInput.name}
            onChange={(e) => handleInput(e, 'name')}
          />
        </LabelInput>
      </div>

      <div className="mt-4">
        <LabelInput
          label="Email"
          errorMsg={errorMsg.email}
          required
          loading={false}
        >
          <input
            type="email"
            id="email"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
            placeholder="Enter Email"
            value={userInput.email}
            onChange={(e) => handleInput(e, 'email')}
          />
        </LabelInput>
      </div>
      <div className="mt-4">
        <LabelInput
          label="Phone number"
          errorMsg={errorMsg.phone}
          required
          loading={false}
        >
          <input
            type="number"
            id="phone"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
            placeholder="Enter Phone"
            value={userInput.phone}
            onChange={(e) => handleInput(e, 'phone')}
          />
        </LabelInput>
      </div>

      <div className="mt-4">
        <LabelInput
          label="Password"
          errorMsg={errorMsg.password}
          required
          loading={false}
        >
          <input
            type="password"
            id="password"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
            placeholder="Enter password"
            value={userInput.password}
            onChange={(e) => handleInput(e, 'password')}
          />
        </LabelInput>
      </div>
      <div className="mt-4">
        <LabelInput
          label="Re-type password"
          errorMsg={errorMsg.retypePassword}
          required
          loading={false}
        >
          <input
            type="password"
            id="retypepassword"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
            placeholder="Re-type password"
            value={userInput.retypePassword}
            onChange={(e) => handleInput(e, 'retypePassword')}
          />
        </LabelInput>
      </div>

      <button
        type="button"
        className={`w-full rounded-full mt-10 bg-purple-600 font-bold text-white p-5 hover:bg-purple-700 flex items-center justify-center gap-2 ${
          registerLoading && 'opacity-50'
        }`}
        onClick={validateRegistration}
        disabled={registerLoading}
      >
        {registerLoading && (
          <div className="flex flex-row gap-1">
            <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
          </div>
        )}
        {registerLoading ? 'Loading' : 'Register'}
      </button>
    </div>
  );
}

export default AdminInfo;
