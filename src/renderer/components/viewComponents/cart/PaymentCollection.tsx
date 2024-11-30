/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import { SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useDispatch, useSelector } from 'react-redux';
import { LabelInput } from '../../commonComponents';
import { setPayment } from '../../../../store/slices/cartSlice';
import { useFetch } from '../../../utils/hooks';
import { noTaxOptions } from '../../../utils/constant';
import { AddSVG, DeleteSVG } from '../../../utils/svg';
import { calculateTotalPaymentAmount } from '../../../utils/methods';

function PaymentCollection() {
  const calculations = useSelector((state: any) => state.cart.calculations);

  // [info]: states
  const [userInput, setUserInput] = useState([
    {
      amount: '',
      method: '',
    },
  ]);
  const [paymentMethods, setPaymentMethods] = useState<
    { label: string; value: string }[]
  >([]);

  const [amountOptions, setAmountOptions] = useState<any>([]);

  //   [info]: hooks
  const dispatch = useDispatch();
  const { loading: fetchLoading, fetchData: paymentMethodFetch } = useFetch();

  //   [info]: methods
  const handleRemoveMethod = (index: number) => {
    if (userInput.length === 1 && index === 0) {
      return;
    }
    const methodsCopy = [...userInput];
    methodsCopy.splice(index, 1);
    setUserInput(methodsCopy);
    dispatch(
      setPayment({
        total: calculateTotalPaymentAmount(methodsCopy),
        methods: methodsCopy,
      }),
    );
    if (index === 1) {
      calculateAmountOptions(parseFloat(calculations.total) || 0);
    }
  };

  const handleSelectDefaultMethod = (
    selectedMethod: SingleValue<{ value: string; label: string }>,
    index: number,
  ) => {
    const newMethods = [...userInput];

    if (index >= 0 && index < newMethods.length && selectedMethod) {
      newMethods[index] = {
        ...newMethods[index],
        method: selectedMethod.value,
      };
    }
    setUserInput(newMethods);
    dispatch(
      setPayment({
        total: calculateTotalPaymentAmount(newMethods),
        methods: newMethods,
      }),
    );
  };

  const handleUserInput = (key: string, value: string, index: number) => {
    const newMethods = [...userInput];

    if (index >= 0 && index < newMethods.length) {
      newMethods[index] = {
        ...newMethods[index],
        [key]: value,
      };
    }

    setUserInput(newMethods);

    dispatch(
      setPayment({
        total: calculateTotalPaymentAmount(newMethods),
        methods: newMethods,
      }),
    );
  };

  const handleAddMethod = () => {
    setUserInput([
      ...userInput,
      {
        amount: '',
        method: '',
      },
    ]);
    setAmountOptions([]);
  };

  const fetchPaymentMethods = () => {
    paymentMethodFetch('/payment-method/')
      .then((res) => {
        if (res?.status === 200) {
          const methods = res?.data.map((method: any) => {
            return {
              label: method.name,
              value: method.name,
            };
          });
          setPaymentMethods(methods);
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const handleSelectOption = (amount, index) => {
    // const numAmount = amount)
    handleUserInput('amount', amount, index);
  };

  const calculateAmountOptions = (totalAmount: number) => {
    const options: string[] = [];
    // Push the exact amount
    options.push(totalAmount?.toFixed(2));

    // Push the next rounded-up amount
    const roundedUp = Math.ceil(totalAmount);
    options.push(roundedUp.toFixed(2));

    // Push increments
    options.push((Math.ceil(roundedUp / 5) * 5 + 5).toFixed(2)); // Nearest multiple of 5 + 5
    options.push((Math.ceil(roundedUp / 10) * 10 + 10).toFixed(2)); // Nearest multiple of 10 + 10
    options.push((Math.ceil(roundedUp / 50) * 50 + 50).toFixed(2)); // Nearest multiple of 50 + 50

    // Set options
    setAmountOptions(options);
  };

  //   [info]: lifecycle
  useEffect(() => {
    if (paymentMethods.length <= 0) return;
    handleUserInput('amount', calculations.total, 0);
    setTimeout(() => {
      handleUserInput('method', paymentMethods[0].label, 0);
    }, 500);

    calculateAmountOptions(parseFloat(calculations.total) || 0);
  }, [calculations.total, paymentMethods]);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return (
    <div className="text-base w-full">
      <p className="font-bold my-4">Collect Payment:</p>
      {userInput.map((tax: any, index) => (
        <div
          className="py-4 space-y-4 text-base"
          key={`${tax.name}-${index + 1}`}
        >
          <div className="flex flex-col gap-2">
            <LabelInput
              required
              label="Collected Amount"
              loading={false}
              errorMsg={null}
            >
              <input
                type="number"
                className="p-2.5 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-black"
                placeholder="Amount"
                value={userInput[index].amount}
                onChange={(e) =>
                  handleUserInput('amount', e.target.value, index)
                }
                onWheel={(e) => e.target.blur()}
              />
            </LabelInput>
            {amountOptions.length > 0 ? (
              <div className="flex items-center gap-2 overflow-x-auto py-2">
                {amountOptions.map((option: string) => (
                  <div
                    onClick={() => handleSelectOption(option, index)}
                    className="border min-w-fit px-4 py-1 rounded-full text-sm font-semibold cursor-pointer"
                  >
                    <span>{option} USD</span>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="flex justify-between items-center gap-2">
              <div className="flex-1">
                <LabelInput
                  required
                  label="Payment Method"
                  loading={fetchLoading}
                  errorMsg={null}
                >
                  <CreatableSelect
                    isClearable
                    options={
                      paymentMethods[0]?.value.length > 0
                        ? paymentMethods
                        : noTaxOptions
                    }
                    className=""
                    placeholder="Payment Method"
                    value={{
                      value: '',
                      label: userInput[index].method,
                    }}
                    onChange={(selectedMethod) =>
                      handleSelectDefaultMethod(selectedMethod, index)
                    }
                    onCreateOption={(name) =>
                      handleUserInput('method', name, index)
                    }
                  />
                </LabelInput>
              </div>
              {userInput.length > 1 ? (
                <div
                  className="mt-8 cursor-pointer"
                  onClick={() => handleRemoveMethod(index)}
                >
                  <DeleteSVG />
                </div>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            className="text-blue-600 flex items-center gap-2 ml-auto"
            onClick={handleAddMethod}
          >
            <AddSVG />
            <p>Add another</p>
          </button>
        </div>
      ))}
    </div>
  );
}

export default PaymentCollection;
