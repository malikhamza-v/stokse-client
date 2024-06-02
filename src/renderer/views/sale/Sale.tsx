import Cart from './Cart';
import Items from './Items';

function Sale() {
  return (
    <div className="flex justify-between w-full overflow-y-auto">
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
