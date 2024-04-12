/* eslint-disable jsx-a11y/label-has-associated-control */
import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LabelInput, Toast } from '../components/commonComponents';
import useCreate from '../utils/hooks/useCreate';
import { ArrowLongRight } from '../utils/svg';
import { setUser, setBusiness } from '../../store/slices/appData';

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
  const { loading: verifyTokenLoading, createData: verifyToken } = useCreate();
  const {
    loading: registerLoading,
    createData: register,
    setLoading: setRegisterLoading,
  } = useCreate();
  const { loading: cBusinessLoading, createData: businessCreate } = useCreate();

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleVerifyToken = () => {
    if (!userInput.code || userInput.code.length <= 0) {
      let errors = { ...errorMsg };
      if (!userInput.code || userInput.code.length <= 0) {
        errors = { ...errors, code: 'Code cannot be empty.' };
      }

      setErrorMsg(errors);
      return;
    }

    const payload = {
      code: userInput.code,
    };
    verifyToken('/auth/verify-code/', payload, false)
      .then((res) => {
        const { data } = res;
        if (res.status === 200) {
          setIsCodeTrue(true);
        } else if (res.status === 400) {
          toast.error(data.message);
        }
        return true;
      })
      .catch(() => {
        toast.error('Something went wrong!');
      });
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
      console.log('check');
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
      // localStorage.setItem('phone', userInput.phone);
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
        localStorage.setItem('token', registerRes.data.token);
        localStorage.setItem('user', JSON.stringify(registerRes.data.user));
        localStorage.setItem('business', JSON.stringify(businessRes.data));
        dispatch(setUser(registerRes.data.user));
        dispatch(setBusiness(businessRes.data));
        navigate('/setup/store');
      }
      setRegisterLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full justify-between ">
      <div
        className="flex-1 overflow-y-scroll py-12 w-1/2 bg-white text-black"
        style={{
          height: 'calc(100vh)',
          maxHeight: 'calc(100vh)',
        }}
      >
        <div
          className={`mx-auto flex w-2/3 flex-col justify-center xl:w-1/2 ${
            !isCodeTrue && 'h-full'
          }`}
        >
          <div>
            <p className="text-3xl font-bold text-blue-600">
              Ready to register!
            </p>
            <p>Enter your signup code sent to your email</p>
          </div>

          <div className="mt-10">
            <div>
              <LabelInput
                label="Sign Up Code"
                errorMsg={errorMsg.code}
                required
                loading={false}
              >
                <input
                  type="text"
                  id="code"
                  className={`bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4 ${
                    isCodeTrue && '!bg-slate-100'
                  }`}
                  placeholder="Enter code"
                  value={userInput.code}
                  disabled={isCodeTrue}
                  onChange={(e) => handleInput(e, 'code')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleVerifyToken();
                    }
                  }}
                />
              </LabelInput>
            </div>
            {isCodeTrue && (
              <div>
                <div className="mt-4">
                  <LabelInput
                    label="Name"
                    errorMsg={errorMsg.name}
                    required
                    loading={false}
                  >
                    <input
                      type="text"
                      id="name"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                      placeholder="Enter Name"
                      value={userInput.name}
                      onChange={(e) => handleInput(e, 'name')}
                    />
                  </LabelInput>
                </div>

                <div className="mt-4">
                  <LabelInput
                    label="Business Name"
                    errorMsg={errorMsg.business_name}
                    required
                    loading={false}
                  >
                    <input
                      type="text"
                      id="name"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                      placeholder="Enter Business Name"
                      value={userInput.business_name}
                      onChange={(e) => handleInput(e, 'business_name')}
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
                    label="Phone"
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
                    label="Re-type Password"
                    errorMsg={errorMsg.retypePassword}
                    required
                    loading={false}
                  >
                    <input
                      type="password"
                      id="retype- password"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                      placeholder="Re-type password"
                      value={userInput.retypePassword}
                      onChange={(e) => handleInput(e, 'retypePassword')}
                    />
                  </LabelInput>
                </div>
              </div>
            )}

            <div className="my-10">
              {!isCodeTrue ? (
                <button
                  type="button"
                  className={`w-full rounded-full bg-purple-600 font-bold text-white p-5 hover:bg-purple-700 flex items-center justify-center gap-2 ${
                    verifyTokenLoading && 'opacity-50'
                  }`}
                  onClick={handleVerifyToken}
                  disabled={verifyTokenLoading}
                >
                  {verifyTokenLoading && (
                    <div className="flex flex-row gap-1">
                      <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
                      <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
                    </div>
                  )}
                  {verifyTokenLoading ? 'Loading' : 'Verify'}
                </button>
              ) : (
                <button
                  type="button"
                  className={`w-full rounded-full bg-purple-600 font-bold text-white p-5 hover:bg-purple-700 flex items-center justify-center gap-2 ${
                    registerLoading && 'opacity-50'
                  }`}
                  onClick={handleRegister}
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
              )}
              <Link to="/sign-in">
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
        </div>
      </div>
      <div className="h-screen w-1/2">
        <img
          src="https://placehold.co/500x900"
          className="h-full w-full object-cover"
          alt="POS With inventory"
        />
      </div>
      <Toast />
    </div>
  );
}

export default Signup;
