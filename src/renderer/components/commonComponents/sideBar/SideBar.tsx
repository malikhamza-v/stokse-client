/* eslint-disable jsx-a11y/control-has-associated-label */
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SettingSVG } from '../../../utils/svg';
import Navbar from '../../../utils/constant';

function SideBar() {
  const [toolTip, setToolTip] = useState('');
  return (
    <aside className="fixed h-full inset-y-0 z-10 flex flex-shrink-0 bg-white border-r  md:static  focus:outline-none">
      <nav className="flex flex-col flex-shrink-0 h-full px-2 py-4 ">
        <div className="flex-shrink-0">
          <img
            src="https://placehold.co/55x55"
            className="rounded-full mx-auto"
            alt="business-logo"
          />
        </div>
        <div className="flex flex-col items-center justify-center flex-1 space-y-4">
          {Navbar.map((nav) => {
            return (
              <Link
                key={nav.label}
                to={nav.link}
                onMouseEnter={() => setToolTip(nav.label)}
                onMouseLeave={() => setToolTip('')}
                className="p-4 h-14 w-14 flex justify-center items-center text-white transition-colors duration-200 bg-slate-100 rounded-full hover:bg-slate-200 dark:hover:text-light dark:bg-dark focus:outline-none"
              >
                <div className="relative flex items-center">
                  <nav.icon stroke="#000000" />
                  {toolTip === nav.label && (
                    <div className="popover absolute left-0 bg-gray-600 border shadow-md px-4 ml-[3.5rem] py-2 rounded-lg">
                      <p className="text-white">{nav.label}</p>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="relative flex items-center">
          <Link
            to="/setting"
            onMouseEnter={() => setToolTip('Setting')}
            onMouseLeave={() => setToolTip('')}
            className="p-4 h-14 w-14 flex justify-center items-center text-white transition-colors duration-200 bg-slate-100 rounded-full hover:bg-slate-200 dark:hover:text-light dark:bg-dark focus:outline-none"
          >
            <SettingSVG stroke="#000000" />
          </Link>
          {toolTip === 'Setting' && (
            <div className="popover absolute bg-gray-600 border shadow-md ml-[4.5rem] px-4 py-2 rounded-lg w-fit">
              <p className="text-white">Setting</p>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

export default SideBar;
