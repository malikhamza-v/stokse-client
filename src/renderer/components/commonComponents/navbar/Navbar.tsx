import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChangeSVG } from '../../../utils/svg';

function NavBar() {
  const store = useSelector((state: any) => state.app.store);

  return (
    <header>
      <div className="sticky z-10 top-0 h-16 border-b lg:py-2.5">
        <div className="px-6 flex items-center justify-between space-x-4 2xl:container">
          <div className="flex items-center gap-2">
            <h5 hidden className="text-xl text-gray-600 font-medium lg:block">
              {store.name}
            </h5>
            <Link to="/select-store">
              <div className="cursor-pointer">
                <ChangeSVG />
              </div>
            </Link>
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              aria-label="notification"
              title="Notifications"
              className="w-10 h-10 rounded-xl border bg-gray-100 focus:bg-gray-100 active:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 m-auto text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
