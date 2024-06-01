import { LabelInput } from '../../commonComponents';

function VerifyCode() {
  return (
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
  );
}

export default VerifyCode;
