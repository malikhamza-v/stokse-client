import LabelInput from '../labelInput/LabelInput';

interface SelectInputProps {
  selectedValue: string | number;
  id: string;
  options: { value: string | number; label: string }[];
  errorMessage: string;
  label: string | null;
  isLoading: boolean;
  handleChange: (value: string | number) => void;
}

const SelectInput = ({
  selectedValue,
  id,
  options,
  errorMessage,
  label,
  isLoading,
  handleChange,
}: SelectInputProps) => {
  return (
    <LabelInput
      errorMsg={errorMessage}
      label={label}
      loading={isLoading}
      required
      htmlfor={id}
      isInline={false}
    >
      <div className="relative group rounded-full overflow-hidden before:absolute w-full bg-white border border-gray-300">
        <svg
          y="0"
          xmlns="http://www.w3.org/2000/svg"
          x="0"
          width="100"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          height="100"
          className="w-8 h-8 absolute right-2 -rotate-45 stroke-pink-300 top-1/2 -translate-y-1/2 group-hover:rotate-0 duration-300"
        >
          <path
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
            d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"
            className="svg-stroke-primary"
          />
        </svg>
        <select
          id={id}
          onChange={(e) => handleChange(e.target.value)}
          value={selectedValue}
          className="appearance-none hover:placeholder-shown:bg-emerald-500 relative text-pink-400 bg-transparent ring-0 outline-none  placeholder-violet-700 text-sm font-bold rounded-full p-4 focus:ring-violet-500 focus:border-violet-500 block w-full"
        >
          <option value="" disabled className="capitalize">
            Select {id ? id.replace('_', ' ') : 'value'}
          </option>

          {(options||[]).map((option: { value: string | number; label: string }) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </LabelInput>
  );
};

export default SelectInput;
