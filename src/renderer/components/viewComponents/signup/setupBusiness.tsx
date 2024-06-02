import { ChangeEvent, useState } from 'react';
import { LabelInput } from '../../commonComponents';
import { useDispatch, useSelector } from 'react-redux';
import {
  setBusinessInfo,
  setSignupStep,
} from '../../../../store/slices/signupSlice';

function SetupBusiness() {
  const [userInput, setUserInput] = useState({
    business_name: '',
  });

  const [errorMsg, setErrorMsg] = useState<{
    business_name: string | null;
  }>({
    business_name: null,
  });

  const signupStep = useSelector((state: any) => state.signup.signupStep);
  const dispatch = useDispatch();

  //   [info]: methods
  const handleInput = (e: ChangeEvent<HTMLInputElement>, type: string) => {
    setUserInput({ ...userInput, [type]: e.target.value });
  };

  const handleSaveBusinessInfo = () => {
    if (userInput.business_name.length <= 0) {
      setErrorMsg({ business_name: 'This field is required.' });
    } else {
      dispatch(
        setBusinessInfo({
          name: userInput.business_name,
        }),
      );
      dispatch(setSignupStep(signupStep + 1));
    }
  };

  return (
    <div className="mt-10">
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

      <button
        type="button"
        className="w-full rounded-full mt-6 bg-purple-600 font-bold text-white p-5 hover:bg-purple-700 flex items-center justify-center gap-2"
        onClick={handleSaveBusinessInfo}
      >
        Continue
      </button>
    </div>
  );
}

export default SetupBusiness;
