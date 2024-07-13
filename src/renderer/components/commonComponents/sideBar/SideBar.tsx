/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { MoreSVG, SettingSVG } from '../../../utils/svg';
import { Navbar } from '../../../utils/constant';

function SideBar() {
  const [toolTip, setToolTip] = useState<string>('');
  const moreOptionsContainer = useRef<HTMLDivElement>(null);
  const sideBarRef = useRef<HTMLElement>(null); // Ref for the SideBar component
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState<boolean>(false);

  const handleOpenMoreOptions = () => {
    setIsMoreOptionsOpen(!isMoreOptionsOpen);
  };

  useEffect(() => {
    if (isMoreOptionsOpen && moreOptionsContainer.current) {
      moreOptionsContainer.current.style.transform = 'translateY(0%)';
    } else if (moreOptionsContainer.current) {
      moreOptionsContainer.current.style.transform = 'translateY(100%)';
    }
  }, [isMoreOptionsOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sideBarRef.current &&
        !sideBarRef.current.contains(event.target as Node) &&
        moreOptionsContainer.current &&
        !moreOptionsContainer.current.contains(event.target as Node)
      ) {
        setIsMoreOptionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <aside
      ref={sideBarRef}
      className="absolute bottom-0 md:static h-fit md:h-full w-full md:w-fit md:inset-y-0 z-10 flex flex-shrink-0 bg-white border-t md:border-r focus:outline-none"
    >
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
                  onClick={() => setIsMoreOptionsOpen(false)}
                  className={`p-4 h-14 w-14 flex justify-center items-center text-white transition-colors duration-200 bg-slate-100 rounded-full hover:bg-slate-200 dark:hover:text-light dark:bg-dark focus:outline-none ${
                    nav.isHiddenForMobile ? 'hidden md:flex' : ''
                  } ${nav.label === 'Settings' ? 'absolute bottom-4' : ''} `}
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

          <div
            onClick={handleOpenMoreOptions}
            className="p-4 h-14 w-14 flex justify-center items-center text-white transition-colors duration-200 bg-slate-100 rounded-full hover:bg-slate-200 dark:hover:text-light dark:bg-dark focus:outline-none md:hidden"
          >
            <div className="relative flex items-center">
              <MoreSVG stroke="#000000" />
            </div>
          </div>

          <div
            ref={moreOptionsContainer}
            className="absolute bg-zinc-50 divide-y border pt-4 pb-24 bottom-0 left-0 right-0 w-full -z-10 px-4 translate-y-full transition-all duration-300 md:hidden"
          >
            {Navbar.map(
              (nav) =>
                nav.link &&
                nav.isHiddenForMobile && (
                  <Link
                    key={nav.label}
                    to={nav.link}
                    onMouseEnter={() => setToolTip(nav.label)}
                    onMouseLeave={() => setToolTip('')}
                    onClick={() => setIsMoreOptionsOpen(false)}
                    className="p-4  w-full flex justify-start text-black transition-colors duration-200 hover:bg-slate-200 dark:hover:text-light dark:bg-dark focus:outline-none"
                  >
                    <div className="relative flex flex-col">
                      <p className="font-semibold">{nav.label}</p>
                      <p className="text-gray-500 text-sm">{nav.description}</p>
                    </div>
                  </Link>
                ),
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}

export default SideBar;
