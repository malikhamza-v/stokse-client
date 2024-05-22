import { BackButton } from '../../components/commonComponents/buttons';
import { SearchSVG } from '../../utils/svg';

function Logs() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-16 pt-16">
        <BackButton />
      </div>
      <div className="px-16 py-8 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl">App Logs</h2>
          <p className="text-gray-500">Manage payment methods of your store.</p>
        </div>
        <div className="relative flex items-center mt-4 md:mt-0">
          <span className="absolute">
            <SearchSVG />
          </span>

          <input
            type="text"
            placeholder="Search by payment method"
            className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          />
        </div>
      </div>
    </div>
  );
}

export default Logs;
