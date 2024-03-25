/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import { SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useDispatch, useSelector } from 'react-redux';
import { LabelInput } from '../../commonComponents';
import { setPaymentMethods as setGlobalPaymentMethod } from '../../../../store/slices/appData';
import { useFetch } from '../../../utils/hooks';
import { noTaxOptions } from '../../../utils/constant';
import { AddSVG, DeleteSVG } from '../../../utils/svg';

function PaymentCollection() {
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

  //   [info]: hooks
  const dispatch = useDispatch();
  const globalPaymentMethods = useSelector(
    (state: any) => state.appData.paymentMethods,
  );
  const { loading: fetchLoading, fetchData: paymentMethodFetch } = useFetch();

  //   [info]: methods
  const handleRemoveMethod = (index: number) => {
    if (userInput.length === 1 && index === 0) {
      return;
    }
    const methodsCopy = [...userInput];
    methodsCopy.splice(index, 1);
    setUserInput(methodsCopy);
  };

  const handleSelectDefaultMethod = (
    selectedMethod: SingleValue<{ value: string; label: string }>,
    index: number,
  ) => {
    const newMethods = [...userInput];

    if (index >= 0 && index < newMethods.length && selectedMethod) {
      newMethods[index].method = selectedMethod.value;
    }

    setUserInput(newMethods);
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
  };

  const handleAddMethod = () => {
    setUserInput([
      ...userInput,
      {
        amount: '',
        method: '',
      },
    ]);
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
          dispatch(setGlobalPaymentMethod(res?.data));
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  //   [info]: lifecycle
  useEffect(() => {
    if (globalPaymentMethods.length > 0) {
      const methods = globalPaymentMethods.map((method: any) => {
        return {
          label: method.name,
          value: method.name,
        };
      });
      setPaymentMethods(methods);
      dispatch(setGlobalPaymentMethod(globalPaymentMethods));
    } else {
      fetchPaymentMethods();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-base">
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
              />
            </LabelInput>
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
              <div
                className="mt-8 cursor-pointer"
                onClick={() => handleRemoveMethod(index)}
              >
                <DeleteSVG />
              </div>
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
