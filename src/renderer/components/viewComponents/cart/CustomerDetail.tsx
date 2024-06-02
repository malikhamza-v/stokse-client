import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { LabelInput } from '../../commonComponents';
import { setCustomer } from '../../../../store/slices/cartSlice';

function CustomerDetail() {
  // [info]: states
  const [userInput, setUserInput] = useState({
    name: '',
    phone: '',
    email: '',
  });

  // [info]: hooks
  const dispatch = useDispatch();

  //   [info]: methods
  const handleUserInput = (key: string, value: string) => {
    setUserInput({
      ...userInput,
      [key]: value,
    });
    dispatch(
      setCustomer({
        ...userInput,
        [key]: value,
      }),
    );
  };
  return (
    <div className="text-base flex flex-col gap-2">
      <p className="font-bold my-4">Customer Detail:</p>
      <div className="flex gap-2 items-center justify-between">
        <LabelInput
          label="Customer Name"
          errorMsg={null}
          loading={false}
          required={false}
        >
          <input
            type="text"
            className="p-2.5 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 "
            placeholder="Customer Name"
            value={userInput.name}
            // value={discount.percent}
            onChange={(e) => handleUserInput('name', e.target.value)}
          />
        </LabelInput>

        <LabelInput
          label="Customer Phone"
          errorMsg={null}
          loading={false}
          required={false}
        >
          <input
            type="number"
            className="p-2.5 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 "
            placeholder="Customer Phone"
            value={userInput.phone}
            onChange={(e) => handleUserInput('phone', e.target.value)}
          />
        </LabelInput>
      </div>
      <LabelInput
        label="Customer Email"
        errorMsg={null}
        loading={false}
        required={false}
      >
        <input
          type="email"
          className="p-2.5 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
          placeholder="Customer Email"
          value={userInput.email}
          onChange={(e) => handleUserInput('email', e.target.value)}
        />
      </LabelInput>

      <p className="text-gray-500 text-sm">
        * This information is required for sending invoice to customer email.
      </p>
    </div>
  );
}

export default CustomerDetail;
