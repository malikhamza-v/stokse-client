import { useEffect } from 'react';
import Cart from './Cart';
import Items from './Items';

function Sale() {
  useEffect(() => {
    const saleContainer = document.querySelector('.sale_window');
    if (saleContainer)
      saleContainer.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
  }, []);

  return (
    <div className="flex justify-between w-full">
      <div className="flex-1">
        <Items />
      </div>
      <div className="w-[30%]">
        <Cart />
      </div>
    </div>
  );
}

export default Sale;
