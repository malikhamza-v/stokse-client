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
    <div className="grid grid-cols-12">
      <div className="col-span-12 lg:col-span-8">
        <Items />
      </div>
      <div className="col-span-4 hidden lg:block">
        <Cart />
      </div>
    </div>
  );
}

export default Sale;
