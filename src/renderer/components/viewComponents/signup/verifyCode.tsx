import { ChangeEvent, useState } from 'react';
import { LabelInput } from '../../commonComponents';
import { useCreate } from '../../../utils/hooks';
import { toast } from 'react-toastify';

function VerifyCode() {
  const [userInput, setUserInput] = useState({
    code: '',
  });

  const [errorMsg, setErrorMsg] = useState({
    code: null,
  });

  const { loading: verifyTokenLoading, createData: verifyToken } = useCreate();

  //   [info]: methods
  const handleInput = (e: ChangeEvent<HTMLInputElement>, type: string) => {
    setErrorMsg({ ...errorMsg, [type]: null });
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
          // setIsCodeTrue(true);
        } else if (res.status === 400) {
          toast.error(data.message);
        }
        return true;
      })
      .catch(() => {
        toast.error('Something went wrong!');
      });
  };

  return (
    <div className="mt-10">
      <LabelInput
        label="Sign Up Code"
        errorMsg={errorMsg.code}
        required
        loading={false}
      >
        <input
          type="text"
          id="code"
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
          placeholder="Enter code"
          value={userInput.code}
          onChange={(e) => handleInput(e, 'code')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleVerifyToken();
            }
          }}
        />
      </LabelInput>

      <button
        type="button"
        className={`w-full rounded-full bg-purple-600 mt-6 font-bold text-white p-5 hover:bg-purple-700 flex items-center justify-center gap-2 ${
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
    </div>
  );
}

export default VerifyCode;
