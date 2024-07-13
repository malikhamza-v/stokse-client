/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useRef, useState } from 'react';
import Cart from './Cart';
import Items from './Items';
import { CartSVG, CloseSvg } from '../../utils/svg';

function Sale() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartContainer = useRef<HTMLDivElement>(null);

  const handleOpenCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  useEffect(() => {
    if (window.innerWidth < 1024 && cartContainer.current) {
      if (isCartOpen) {
        cartContainer.current.style.transform = 'translateX(0%)';
      } else {
        cartContainer.current.style.transform = 'translateX(-100%)';
      }
    }
  }, [isCartOpen]);

  useEffect(() => {
    const saleContainer = document.querySelector('.sale_window');
    if (saleContainer)
      saleContainer.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });

    window.addEventListener('resize', () => {
      if (cartContainer.current) {
        if (window.innerWidth > 1024) {
          setIsCartOpen(false);
          cartContainer.current.style.transform = 'translateX(0%)';
        } else {
          setIsCartOpen(false);
          cartContainer.current.style.transform = 'translateX(-100%)';
        }
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-12 ">
      <div className="col-span-12 lg:col-span-8">
        <Items />
      </div>
      <div
        ref={cartContainer}
        className="col-span-4 absolute -translate-x-full lg:translate-x-0 w-full md:w-[92%] lg:w-full bg-white top-0 lg:block lg:relative transition-all duration-300"
      >
        <Cart />
      </div>

      <div
        onClick={handleOpenCart}
        className={`lg:hidden border border-black rounded-full h-14 w-14 p-4 bg-emerald-100 flex items-center justify-center transition-all duration-300 absolute left-4 md:left-20 bottom-28 ${
          isCartOpen && 'top-2 !right-2 !left-auto'
        }`}
      >
        {isCartOpen ? <CloseSvg /> : <CartSVG />}
      </div>
    </div>
  );
}

export default Sale;
