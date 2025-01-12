/* eslint-disable jsx-a11y/label-has-associated-control */
import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LabelInput } from '../components/commonComponents';
import useCreate from '../utils/hooks/useCreate';
import { ArrowLongRight } from '../utils/svg';
import SignInScreenImage from '../assets/images/signin-screen.svg';

function Signin() {
  const [userInput, setUserInput] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState<{
    email: string | null;
    password: string | null;
  }>({ email: null, password: null });
  const { loading: loginLoading, createData: login } = useCreate();

  const navigate = useNavigate();

  //   [info]: methods
  const handleInput = (e: ChangeEvent<HTMLInputElement>, type: string) => {
    setUserInput({ ...userInput, [type]: e.target.value });
    setErrorMsg({ ...errorMsg, [type]: null });
  };

  const handleLogin = () => {
    if (userInput.email.length <= 0 || userInput.password.length <= 0) {
      let errors = { ...errorMsg };
      if (userInput.email.length <= 0) {
        errors = { ...errors, email: 'Email cannot be empty.' };
      }
      if (userInput.password.length <= 0) {
        errors = { ...errors, password: 'Password cannot be empty.' };
      }
      setErrorMsg(errors);
      return;
    }

    const payload = {
      email: userInput.email,
      password: userInput.password,
    };
    login('/auth/login/', payload, false)
      .then((res) => {
        const { data } = res;
        if (res.status === 200) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          localStorage.setItem('store', JSON.stringify(data.data.store));
          localStorage.setItem('business', JSON.stringify(data.data.business));

          toast.success(data.message);
          navigate('/');
        } else if (res.status === 400) {
          toast.error(data.message);
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  return (
    <div className="relative flex h-full w-full">
      <div className="h-screen w-1/2 bg-white text-black">
        <div className="mx-auto flex h-full w-2/3 flex-col justify-center  xl:w-1/2">
          <div>
            <p className="text-3xl font-bold text-blue-600">Welcome Back</p>
            <p>Enter your email and password to sign in</p>
          </div>

          <div className="mt-10">
            <div>
              <LabelInput
                label="Email"
                errorMsg={errorMsg.email}
                required
                loading={false}
                isInline={false}
                htmlfor="email"
              >
                <input
                  type="email"
                  id="email"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                  placeholder="Enter email"
                  value={userInput.email}
                  onChange={(e) => handleInput(e, 'email')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin();
                    }
                  }}
                />
              </LabelInput>
            </div>
            <div className="mt-4">
              <LabelInput
                label="Password"
                errorMsg={errorMsg.password}
                required
                loading={false}
                isInline={false}
                htmlfor="password"
              >
                <input
                  type="password"
                  id="password"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                  placeholder="Enter password"
                  value={userInput.password}
                  onChange={(e) => handleInput(e, 'password')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin();
                    }
                  }}
                />
              </LabelInput>
            </div>

            <div className="my-10">
              <button
                type="button"
                className={`w-full rounded-full bg-purple-600 font-bold text-white p-5 hover:bg-purple-700 flex items-center justify-center gap-2 ${
                  loginLoading && 'opacity-50'
                }`}
                onClick={handleLogin}
                disabled={loginLoading}
              >
                {loginLoading && (
                  <div className="flex flex-row gap-1">
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
                  </div>
                )}
                {loginLoading ? 'Loading' : 'Login'}
              </button>
              <Link to="/sign-up">
                <button
                  type="button"
                  className="flex items-center gap-2 justify-end ml-auto my-4 text-blue-600"
                >
                  <p>Ready to join? Sign up here!</p>
                  <ArrowLongRight />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="h-screen w-1/2">
        <img
          src={SignInScreenImage}
          className="h-full w-full object-cover"
          alt="POS With inventory"
        />
      </div>
    </div>
  );
}

export default Signin;
