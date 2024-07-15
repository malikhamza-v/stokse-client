/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/self-closing-comp */

import { useEffect, useState } from 'react';
import { CloseSvg } from '../../../utils/svg';

/* eslint-disable jsx-a11y/label-has-associated-control */
function Drawer({
  id,
  isOpen,
  close,
  children,
}: {
  id: string;
  isOpen: boolean;
  close: any;
  children: any;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  useEffect(() => {
    setIsDrawerOpen(isOpen);
  }, [isOpen]);
  return (
    <div className="drawer drawer-end z-40">
      <input
        id={id}
        type="checkbox"
        className="drawer-toggle"
        checked={isDrawerOpen}
        readOnly
      />

      <div className="drawer-side min-h-screen">
        <label
          htmlFor={id}
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={close}
        ></label>
        <ul className="menu p-0 bg-base-200 text-base-content category-drawer min-h-full h-full">
          {isOpen && (
            <button
              type="button"
              onClick={close}
              className="btn bg-transparent m-4 sm:bg-base-200 sm:btn-circle shadow-none sm:shadow-xl border-0 z-50 sm:border absolute category-close-btn"
            >
              <CloseSvg />
            </button>
          )}
          <div className="h-full">{children}</div>
        </ul>
      </div>
    </div>
  );
}

export default Drawer;
