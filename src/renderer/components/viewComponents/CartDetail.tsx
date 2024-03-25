import { useSelector } from 'react-redux';

function CartDetail() {
  // [info]: hooks
  const cartItems = useSelector((state: any) => state.appData.cart.items);
  const calculations = useSelector(
    (state: any) => state.appData.cart.calculations,
  );

  return (
    <div className="mt-4 mb-2">
      <p>Order Detail</p>
      <div className="divide-y divide-gray-200">
        <div className="flex flex-col gap-2 border-b">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-md">Item</p>
            <p className="font-medium">{cartItems.length} (items)</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-md">Subtotal (incl. taxes)</p>
            <p className="font-medium">{calculations.subTotal} USD</p>
          </div>

          {calculations.order_tax?.taxes.length > 0 && (
            <div className="flex flex-col justify-between ">
              <p className="my-1">Taxes</p>
              {calculations.order_tax?.taxes.map((tax: any, index: number) => (
                <div
                  key={`${tax.name}-${tax.value}-${index + 1}`}
                  className="flex items-center justify-between"
                >
                  <p className="text-gray-400 text-sm">
                    {tax.name} ({tax.percent}%)
                  </p>
                  <p className="font-extralight text-sm">
                    {tax.amount || (0).toFixed(2)} USD
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mb-6 mt-4">
            <p className="text-lg font-bold">Total</p>
            <p className="font-medium">{calculations.total} USD</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartDetail;
