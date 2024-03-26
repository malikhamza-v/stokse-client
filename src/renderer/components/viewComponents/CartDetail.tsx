import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPayment } from '../../../store/slices/appData';

function CartDetail() {
  // [info]: state
  const [balance, setBalance] = useState(0);
  // [info]: hooks
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.appData.cart.items);
  const calculations = useSelector(
    (state: any) => state.appData.cart.calculations,
  );

  useEffect(() => {
    if (calculations.total && calculations.payment?.total) {
      const calculatedBalance = (
        calculations.total - calculations.payment.total
      ).toFixed(2);
      dispatch(
        setPayment({
          ...calculations.payment,
          balance: calculatedBalance as unknown as number,
        }),
      );
      setBalance(calculatedBalance as unknown as number);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculations.total, calculations.payment?.total]);

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

          <div className="flex justify-between items-center mb-2 mt-4">
            <p className="text-lg font-bold">Total</p>
            <p className="font-medium">{calculations.total} USD</p>
          </div>

          {calculations.payment?.methods?.length > 0 && (
            <div className="flex flex-col justify-between ">
              <p className="my-1">Paid By</p>
              {calculations.payment?.methods.map(
                (method: any, index: number) => (
                  <div
                    key={`${method.method}-${index + 1}`}
                    className="flex items-center mb-2 justify-between"
                  >
                    <p className="text-gray-400 text-sm">
                      {method.method || 'Others'}
                    </p>
                    <p className="font-extralight text-sm">
                      {(parseFloat(method.amount) || 0).toFixed(2)} USD
                    </p>
                  </div>
                ),
              )}
            </div>
          )}
          {calculations.total && calculations?.payment?.total && (
            <div className="flex justify-between items-center my-2">
              <p className="text-lg font-bold">
                {balance > 0 ? 'Balance' : 'Change'}
              </p>
              <p className="font-medium">
                {balance > 0 ? balance : balance * -1} USD
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartDetail;
