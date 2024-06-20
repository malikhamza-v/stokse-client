import { useState } from 'react';
import { LabelInput } from '../../commonComponents';
import { useCreate } from '../../../utils/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  setSignupStep,
  setStoreInfo,
} from '../../../../store/slices/signupSlice';

function SetupStore() {
  const [userInput, setUserInput] = useState<{
    logo: string | Blob;
    name: string;
    description: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    address: string;
  }>({
    logo: '',
    name: '',
    description: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    address: '',
  });

  const [errorMsg, setErrorMsg] = useState<{
    logo: string | null;
    name: string | null;
    description: string | null;
    email: string | null;
    phone: string | null;
    city: string | null;
    country: string | null;
    address: string | null;
  }>({
    logo: null,
    name: null,
    description: null,
    email: null,
    phone: null,
    city: null,
    country: null,
    address: null,
  });

  const { createData: validateStore, loading: validateLoading } = useCreate();

  const signupCode = useSelector((state: any) => state.signup.code);
  const signupStep = useSelector((state: any) => state.signup.signupStep);
  const dispatch = useDispatch();
  // [methods]:
  const handleInput = (key: string, value: string) => {
    setErrorMsg({ ...errorMsg, [key]: null });
    setUserInput({
      ...userInput,
      [key]: value,
    });
  };

  const handleSaveStoreInfo = async () => {
    const { name, description, email, phone, city, country, address } =
      userInput;
    if (
      name.length <= 0 ||
      description.length <= 0 ||
      email.length <= 0 ||
      phone.length <= 0 ||
      city.length <= 0 ||
      country.length <= 0 ||
      address.length <= 0
    ) {
      let errors = { ...errorMsg };

      if (name.length <= 0) {
        errors = { ...errors, name: 'This field is required' };
      }
      if (description.length <= 0) {
        errors = { ...errors, description: 'This field is required' };
      }
      if (email.length <= 0) {
        errors = { ...errors, email: 'This field is required' };
      }
      if (phone.length <= 0) {
        errors = { ...errors, phone: 'This field is required' };
      }
      if (city.length <= 0) {
        errors = { ...errors, city: 'This field is required' };
      }
      if (country.length <= 0) {
        errors = { ...errors, country: 'This field is required' };
      }
      if (address.length <= 0) {
        errors = { ...errors, address: 'This field is required' };
      }
      setErrorMsg(errors);
      return;
    }

    try {
      const payload = {
        code: signupCode,
        name,
        email,
        description,
        phone,
        city,
        country,
        address,
      };
      const res = await validateStore('/validate-store/', payload, false);
      if (res.status === 400) {
        const firstError = Object.keys(res.data)[0];
        if (firstError) {
          setTimeout(() => {
            if (document.getElementById(firstError)) {
              document.getElementById(firstError)?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
              document.getElementById(firstError)?.focus();
            }
          }, 50);
        }
        toast.error(res.data.message);

        setErrorMsg(res.data);
      } else if (res.status === 200) {
        dispatch(setSignupStep(signupStep + 1));
        dispatch(
          setStoreInfo({
            logo: null,
            name: userInput.name,
            description: userInput.description,
            email: userInput.email,
            phone: userInput.phone,
            city: userInput.city,
            country: userInput.country,
            address: userInput.address,
          }),
        );
      }
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div>
      <div className="mt-10 ">
        <LabelInput
          label="Store name"
          errorMsg={errorMsg.name}
          required
          loading={false}
        >
          <input
            type="text"
            id="name"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
            placeholder="Enter store name"
            value={userInput.name}
            onChange={(e) => handleInput('name', e.target.value)}
          />
        </LabelInput>
      </div>

      <div className="mt-4">
        <LabelInput
          label="Store description"
          errorMsg={errorMsg.description}
          required
          loading={false}
        >
          <input
            type="text"
            id="description"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
            placeholder="Enter store description"
            value={userInput.description}
            onChange={(e) => handleInput('description', e.target.value)}
          />
        </LabelInput>
      </div>
      <div className="mt-4">
        <LabelInput
          label="Store email"
          errorMsg={errorMsg.email}
          required
          loading={false}
        >
          <input
            type="email"
            id="email"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
            placeholder="Enter store email"
            value={userInput.email}
            onChange={(e) => handleInput('email', e.target.value)}
          />
        </LabelInput>
      </div>

      <div className="mt-4">
        <LabelInput
          label="Store phone"
          errorMsg={errorMsg.phone}
          required
          loading={false}
        >
          <input
            type="tel"
            id="phone"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
            placeholder="Enter store phone"
            value={userInput.phone}
            onChange={(e) => handleInput('phone', e.target.value)}
          />
        </LabelInput>
      </div>

      <div className="mt-4">
        <LabelInput
          label="Store city"
          errorMsg={errorMsg.city}
          required
          loading={false}
        >
          <input
            type="text"
            id="city"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
            placeholder="Enter store city"
            value={userInput.city}
            onChange={(e) => handleInput('city', e.target.value)}
          />
        </LabelInput>
      </div>

      <div className="mt-4">
        <LabelInput
          label="Store country"
          errorMsg={errorMsg.country}
          required
          loading={false}
        >
          <input
            type="text"
            id="country"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
            placeholder="Enter store country"
            value={userInput.country}
            onChange={(e) => handleInput('country', e.target.value)}
          />
        </LabelInput>
      </div>

      <div className="mt-4">
        <LabelInput
          label="Store address"
          errorMsg={errorMsg.address}
          required
          loading={false}
        >
          <input
            type="text"
            id="address"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
            placeholder="Enter store address"
            value={userInput.address}
            onChange={(e) => handleInput('address', e.target.value)}
          />
        </LabelInput>
      </div>

      <button
        type="button"
        className={`w-full rounded-full mt-10 bg-purple-600 font-bold text-white p-5 hover:bg-purple-700 flex items-center justify-center gap-2 ${
          validateLoading && 'opacity-50'
        }`}
        onClick={handleSaveStoreInfo}
        disabled={validateLoading}
      >
        {validateLoading && (
          <div className="flex flex-row gap-1">
            <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
          </div>
        )}
        {validateLoading ? 'Loading' : 'Register'}
      </button>
    </div>
  );
}

export default SetupStore;
