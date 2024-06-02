/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowLongLeft, ArrowLongRight } from '../utils/svg';
import VerifyCode from '../components/viewComponents/signup/verifyCode';
import AdminInfo from '../components/viewComponents/signup/adminInfo';
import SetupBusiness from '../components/viewComponents/signup/setupBusiness';
import { setSignupStep } from '../../store/slices/signupSlice';
import SetupStore from '../components/viewComponents/signup/setupStore';
import Waiting from '../components/viewComponents/signup/waiting';

function Signup() {
  const signupSetp = useSelector((state: any) => state.signup.signupStep);

  const dispatch = useDispatch();

  //   [info]: methods
  const handleGoBack = () => {
    dispatch(setSignupStep(signupSetp - 1));
  };

  useEffect(() => {
    dispatch(setSignupStep(0));
  }, []);

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
  );
}

export default Signup;
