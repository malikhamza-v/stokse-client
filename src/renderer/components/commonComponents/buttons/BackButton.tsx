import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="cursor-pointer duration-200 flex items-center gap-2 hover:gap-3 hover:last:underline"
      title="Go Back"
      onClick={() => navigate(-1)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="45px"
        height="45px"
        viewBox="0 0 24 24"
        className="stroke-gray-500"
      >
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="1.5"
          d="M11 6L5 12M5 12L11 18M5 12H19"
        />
      </svg>
      <p className="font-semibold text-gray-800 text-lg">Back</p>
    </button>
  );
}

export default BackButton;
