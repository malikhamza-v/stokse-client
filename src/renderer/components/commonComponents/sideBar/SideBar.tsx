/* eslint-disable jsx-a11y/control-has-associated-label */
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { MoreSVG, SettingSVG } from '../../../utils/svg';
import { Navbar } from '../../../utils/constant';

function SideBar() {
  const [toolTip, setToolTip] = useState('');
  return (
    <aside className="absolute bottom-0 md:static h-fit md:h-full w-full md:w-fit md:inset-y-0 z-10 flex flex-shrink-0 bg-white border-t md:border-r focus:outline-none">
      <nav className="flex md:flex-col justify-around w-full flex-shrink-0 h-full px-2 py-2 md:py-4">
        <div className="flex-shrink-0 hidden md:block">
          <img
            src="https://placehold.co/55x55"
            className="rounded-full mx-auto"
            alt="business-logo"
          />
        </div>
        <div className="flex md:flex-col items-center justify-around md:justify-center flex-1 md:space-y-4">
          {Navbar.map(
            (nav) =>
              nav.link && (
                <Link
                  key={nav.label}
                  to={nav.link}
                  onMouseEnter={() => setToolTip(nav.label)}
                  onMouseLeave={() => setToolTip('')}
                  className={`p-4 h-14 w-14 flex justify-center items-center text-white transition-colors duration-200 bg-slate-100 rounded-full hover:bg-slate-200 dark:hover:text-light dark:bg-dark focus:outline-none ${
                    nav.isHiddenForMobile ? 'hidden md:flex' : ''
                  }`}
                >
                  <div className="relative flex items-center">
                    <nav.icon stroke="#000000" />
                    {toolTip === nav.label && window.innerWidth > 600 && (
                      <div className="popover absolute left-0 bg-gray-600 border shadow-md px-4 ml-[3.5rem] py-2 rounded-lg">
                        <p className="text-white">{nav.label}</p>
                      </div>
                    )}
                  </div>
                </Link>
              ),
          )}
          <div className=" hidden md:flex items-center absolute bottom-4">
            <Link
              to="/setting"
              onMouseEnter={() => setToolTip('Setting')}
              onMouseLeave={() => setToolTip('')}
              className="p-4 h-14 w-14 flex justify-center items-center text-white transition-colors duration-200 bg-slate-100 rounded-full hover:bg-slate-200 dark:hover:text-light dark:bg-dark focus:outline-none"
            >
              <SettingSVG stroke="#000000" />
            </Link>
            {toolTip === 'Setting' && window.innerWidth > 600 && (
              <div className="popover absolute bg-gray-600 border shadow-md ml-[4.5rem] px-4 py-2 rounded-lg w-fit">
                <p className="text-white">Setting</p>
              </div>
            )}
          </div>

          <div className="p-4 h-14 w-14 flex justify-center items-center text-white transition-colors duration-200 bg-slate-100 rounded-full hover:bg-slate-200 dark:hover:text-light dark:bg-dark focus:outline-none md:hidden">
            <div className="relative flex items-center">
              <MoreSVG stroke="#000000" />
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export default SideBar;
