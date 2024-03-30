/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import { LabelInput } from '../../components/commonComponents';
import { PrimaryButton } from '../../components/commonComponents/buttons';
import { CameraSVG, FingerRight } from '../../utils/svg';
import { useCreate } from '../../utils/hooks';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Business() {
  const [isUploadImageHover, setIsUploadImageHover] = useState(false);
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

  const [loading, setLoading] = useState(false);

  const { createData: createStore } = useCreate();
  const { createData: createEmployee } = useCreate();

  const user = useSelector((state: any) => state.appData.user);
  const navigate = useNavigate();

  const handleUserInput = (key: string, value: string) => {
    setErrorMsg({ ...errorMsg, [key]: null });
    setUserInput({
      ...userInput,
      [key]: value,
    });
  };

  const handleLogoUpload = (e: any) => {
    const logo = e.target.files[0];
    setUserInput({ ...userInput, logo });
  };

  const handleSaveStoreDetail = async () => {
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

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        description,
        phone,
        city,
        country,
        address,
      };
      const res = await createStore('/store/', payload, false);
      if (res.status === 200) {
        const employeePayload = {
          role: 'Admin',
          user: user?.id,
          store: res.data.id,
          is_admin: true,
        };

        const employeeRes = await createEmployee(
          '/employee/',
          employeePayload,
          false,
        );
        if (employeeRes.status === 200) {
          localStorage.setItem('token', employeeRes.data.token);
          navigate('/setup/business/category');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen container mx-auto">
      <div className="px-16 py-8 h-full">
        <div className="flex items-center gap-4">
          <FingerRight />
          <h1 className="text-left underline text-3xl font-bold my-4 text-gray-600">
            Let setup your first store
          </h1>
        </div>
        <div>
          <div className="flex flex-wrap justify-center ">
            <div className="w-full flex justify-center">
              <div
                className="relative rounded-full overflow-hidden max-w-[150px] w-[150px] h-[150px]"
                onMouseEnter={() => setIsUploadImageHover(true)}
                onMouseLeave={() => setIsUploadImageHover(false)}
              >
                <img
                  src={
                    (userInput.logo &&
                      URL.createObjectURL(userInput.logo as Blob)) ||
                    'https://placehold.co/230x230'
                  }
                  className={`shadow-xl rounded-full align-middle border-none h-full w-full object-cover ${
                    isUploadImageHover && 'opacity-65'
                  }`}
                  alt="store-logo"
                />
                {isUploadImageHover && (
                  <>
                    <label htmlFor="logo-uploader" className="cursor-pointer">
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex flex-col justify-center items-center gap-2 py-4 bg-gray-200">
                        <CameraSVG />
                        <p className="text-xs">Upload Image</p>
                      </div>
                    </label>
                    <input
                      type="file"
                      id="logo-uploader"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1">
              {userInput.name || 'Your Store Name'}
            </h3>
            <div className="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
              {userInput.city || 'City'}, {userInput.country || 'Country'}
            </div>
          </div>
        </div>
        <div className="mt-6 py-6 border-t border-slate-200">
          <div className="flex flex-wrap justify-center">
            <div className="w-full">
              <div className="bg-white rounded-2xl shadow-sm py-6 grid grid-cols-1 gap-4 max-w-5xl mx-auto">
                <div className="gap-4">
                  <LabelInput
                    loading={false}
                    errorMsg={errorMsg.name}
                    label="Name"
                    required
                  >
                    <input
                      type="text"
                      id="name"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                      placeholder="Store Name"
                      required
                      onChange={(e) => handleUserInput('name', e.target.value)}
                    />
                  </LabelInput>
                </div>
                <div className="">
                  <LabelInput
                    loading={false}
                    errorMsg={errorMsg.description}
                    label="Store Description"
                    required
                  >
                    <input
                      type="text"
                      id="description"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                      placeholder="Store Description"
                      required
                      onChange={(e) =>
                        handleUserInput('description', e.target.value)
                      }
                    />
                  </LabelInput>
                </div>
                <div className="">
                  <LabelInput
                    loading={false}
                    errorMsg={errorMsg.email}
                    label="Store Email"
                    required
                  >
                    <input
                      type="email"
                      id="email"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                      placeholder="Store Email"
                      required
                      onChange={(e) => handleUserInput('email', e.target.value)}
                    />
                  </LabelInput>
                </div>
                <div className="">
                  <LabelInput
                    loading={false}
                    errorMsg={errorMsg.phone}
                    label="Store Phone"
                    required
                  >
                    <input
                      type="number"
                      id="phone"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                      placeholder="Store Phone"
                      required
                      onChange={(e) => handleUserInput('phone', e.target.value)}
                    />
                  </LabelInput>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="">
                    <LabelInput
                      loading={false}
                      errorMsg={errorMsg.city}
                      label="Store City"
                      required
                    >
                      <input
                        type="text"
                        id="city"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                        placeholder="Store City"
                        required
                        onChange={(e) =>
                          handleUserInput('city', e.target.value)
                        }
                      />
                    </LabelInput>
                  </div>
                  <div className="">
                    <LabelInput
                      loading={false}
                      errorMsg={errorMsg.country}
                      label="Store Country"
                      required
                    >
                      <input
                        type="text"
                        id="country"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                        placeholder="Store Country"
                        required
                        onChange={(e) =>
                          handleUserInput('country', e.target.value)
                        }
                      />
                    </LabelInput>
                  </div>
                </div>

                <div className="">
                  <LabelInput
                    loading={false}
                    errorMsg={errorMsg.address}
                    label="Store Address"
                    required
                  >
                    <input
                      type="text"
                      id="address"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                      placeholder="Store Address"
                      required
                      onChange={(e) =>
                        handleUserInput('address', e.target.value)
                      }
                    />
                  </LabelInput>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-40 ml-auto pb-4">
          <PrimaryButton
            label="Next"
            loading={loading}
            onClickAction={handleSaveStoreDetail}
          />
        </div>
      </div>{' '}
    </div>
  );
}

export default Business;
