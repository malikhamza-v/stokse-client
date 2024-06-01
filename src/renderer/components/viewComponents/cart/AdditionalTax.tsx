/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useDispatch, useSelector } from 'react-redux';
import { LabelInput } from '../../commonComponents';
import { setTaxes as setGlobalTaxes } from '../../../../store/slices/appSlice';
import {
  setCart,
  setOrderLevelTaxes,
} from '../../../../store/slices/cartSlice';
import { useFetch } from '../../../utils/hooks';
import {
  calculateTaxAmount,
  calculateTaxPercent,
  calculateTotalTaxAmount,
} from '../../../utils/methods';
import { AddSVG, DeleteSVG } from '../../../utils/svg';
import { noTaxOptions } from '../../../utils/constant';

function AdditionalTax() {
  // [info]: states
  const [userInput, setUserInput] = useState([
    {
      name: '',
      percent: '',
      amount: '',
    },
  ]);
  const [isAdditionalTaxInclude, setIsAdditionalTaxInclude] = useState(false);
  const [taxes, setTaxes] = useState([{ label: '', value: '' }]);

  //   [info]: hooks
  const dispatch = useDispatch();
  const globalTaxes = useSelector((state: any) => state.appData.taxes);
  const { loading: taxFetchLoading, fetchData: taxesFetch } = useFetch();
  const calculations = useSelector(
    (state: any) => state.appData.cart.calculations,
  );
  const cartTaxes = useSelector(
    (state: any) => state.appData.cart.calculations.order_tax,
  );

  //   [info]: methods
  const handleTaxIncludeToggle = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    if (!event.target.checked) {
      setUserInput([
        {
          name: '',
          percent: '',
          amount: '',
        },
      ]);
      dispatch(
        setCart({
          calculations: {
            ...calculations,
            total: (parseFloat(calculations.subTotal) + 0).toFixed(2),
          },
        }),
      );

      dispatch(
        setOrderLevelTaxes({
          total: 0,
          taxes: [],
        }),
      );
    }
    setIsAdditionalTaxInclude(event.target.checked);
  };

  const handleSelectDefaultTax = (selectedTax: any, index: number) => {
    const newTaxes = [...userInput];

    if (index >= 0 && index < newTaxes.length && selectedTax) {
      newTaxes[index].name = selectedTax.label;
      newTaxes[index].percent = selectedTax.value;
      newTaxes[index].amount = calculateTaxAmount(
        calculations.subTotal || 0,
        selectedTax.value,
      ) as unknown as string;
    }

    dispatch(
      setCart({
        calculations: {
          ...calculations,
          total: (
            parseFloat(calculations.subTotal) +
            parseFloat(calculateTotalTaxAmount(newTaxes))
          ).toFixed(2),
        },
      }),
    );

    dispatch(
      setOrderLevelTaxes({
        total: calculateTotalTaxAmount(newTaxes),
        taxes: newTaxes,
      }),
    );

    setUserInput(newTaxes);
  };

  const handleRemoveTax = (index: number) => {
    if (userInput.length === 1 && index === 0) {
      setUserInput([
        {
          name: '',
          percent: '',
          amount: '',
        },
      ]);
      dispatch(
        setCart({
          calculations: {
            ...calculations,
            total: (parseFloat(calculations.subTotal) + 0).toFixed(2),
          },
        }),
      );

      dispatch(
        setOrderLevelTaxes({
          total: 0,
          taxes: [],
        }),
      );

      setIsAdditionalTaxInclude(false);
      return;
    }
    const taxesCopy = [...userInput];
    taxesCopy.splice(index, 1);
    setUserInput(taxesCopy);
    dispatch(
      setOrderLevelTaxes({
        total: calculateTotalTaxAmount(taxesCopy),
        taxes: taxesCopy,
      }),
    );
  };

  const handleAddTax = () => {
    setUserInput([
      ...userInput,
      {
        name: '',
        percent: '',
        amount: '',
      },
    ]);
  };

  const handleUserInput = (key: string, value: string, index: number) => {
    const newTaxes = [...userInput];

    if (index >= 0 && index < newTaxes.length) {
      newTaxes[index] = {
        ...newTaxes[index],
        [key]: value,
      };

      if (calculations.subTotal) {
        if (key === 'percent') {
          newTaxes[index].amount = calculateTaxAmount(
            calculations.subTotal,
            parseInt(value || '0', 10),
          ) as unknown as string;
        } else if (key === 'amount') {
          newTaxes[index].percent = calculateTaxPercent(
            calculations.subTotal,
            parseFloat(value || '0'),
          ) as unknown as string;
        }
      }
    }

    dispatch(
      setCart({
        calculations: {
          ...calculations,
          total: (
            parseFloat(calculations.subTotal) +
            parseFloat(calculateTotalTaxAmount(newTaxes))
          ).toFixed(2),
        },
      }),
    );

    dispatch(
      setOrderLevelTaxes({
        total: calculateTotalTaxAmount(newTaxes),
        taxes: newTaxes,
      }),
    );

    setUserInput(newTaxes);
  };

  const fetchTaxes = () => {
    taxesFetch('/tax/')
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data.length > 0) {
            const modifiedTaxes = res?.data.map((tax: any) => {
              return {
                label: tax.name,
                value: tax.percent,
              };
            });

            setTaxes(modifiedTaxes);
            dispatch(setGlobalTaxes(res.data));
          }
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  //   [info]: lifecycles
  useEffect(() => {
    if (globalTaxes.length > 0) {
      setTaxes(globalTaxes);
      dispatch(setGlobalTaxes(globalTaxes));
    } else {
      fetchTaxes();
    }

    if (cartTaxes?.taxes.length > 0) {
      setIsAdditionalTaxInclude(true);
      setUserInput(cartTaxes?.taxes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <div className="mb-4">
        <div className="flex gap-4 justify-between items-center">
          <label htmlFor="include_additional_tax">
            <p className="font-bold my-4 text-base">Include Additional Tax</p>
          </label>
          <label className="switch">
            <input
              id="include_additional_tax"
              type="checkbox"
              checked={isAdditionalTaxInclude}
              onChange={handleTaxIncludeToggle}
            />
            <span className="slider" />
          </label>
        </div>
      </div>
      {isAdditionalTaxInclude &&
        userInput.map((tax: any, index) => (
          <div
            className="py-4 space-y-4 text-base"
            key={`${tax.name}-${index + 1}`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <LabelInput
                  required
                  label="Tax Name"
                  loading={taxFetchLoading}
                  errorMsg={null}
                >
                  <CreatableSelect
                    isClearable
                    options={taxes[0].value ? taxes : noTaxOptions}
                    className=""
                    placeholder="Tax Name"
                    value={{
                      value: '',
                      label: userInput[index].name,
                    }}
                    onChange={(selectedTax) =>
                      handleSelectDefaultTax(selectedTax, index)
                    }
                    onCreateOption={(name) =>
                      handleUserInput('name', name, index)
                    }
                  />
                </LabelInput>
              </div>
              <div
                className="mt-8 cursor-pointer"
                onClick={() => handleRemoveTax(index)}
              >
                <DeleteSVG />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <LabelInput
                  required
                  label="Tax Percent (%)"
                  loading={false}
                  errorMsg={null}
                >
                  <input
                    type="number"
                    id="tax_percent"
                    className="bg-white border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Tax Percent"
                    required
                    value={userInput[index].percent}
                    onChange={(e) =>
                      handleUserInput('percent', e.target.value, index)
                    }
                  />
                </LabelInput>
              </div>

              <div>
                <LabelInput
                  required
                  label="Tax Amount"
                  loading={false}
                  errorMsg={null}
                >
                  <input
                    type="number"
                    id="tax_amount"
                    className="bg-white border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Tax Amount"
                    required
                    value={userInput[index].amount}
                    onChange={(e) =>
                      handleUserInput('amount', e.target.value, index)
                    }
                  />
                </LabelInput>
              </div>
            </div>
            <button
              type="button"
              className="text-blue-600 flex items-center gap-2 ml-auto"
              onClick={handleAddTax}
            >
              <AddSVG />
              <p>Add another</p>
            </button>
          </div>
        ))}
    </div>
  );
}

export default AdditionalTax;
