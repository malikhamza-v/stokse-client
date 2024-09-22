/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  BackButton,
  PrimaryButton,
} from '../../components/commonComponents/buttons';
import CreatableSelect from 'react-select/creatable';
import { LabelInput } from '../../components/commonComponents';
import useCreate from '../../utils/hooks/useCreate';
import {
  setCategories as setGlobalCategories,
  setProducts,
} from '../../../store/slices/appSlice';
import { useFetch } from '../../utils/hooks';
import { AddSVG } from '../../utils/svg';
import { calculateTaxAmount, getTotalPrice } from '../../utils/methods';
import { DURATION, DURATION_TYPE, noTaxOptions } from '../../utils/constant';

interface Employee {
  label: string;
  value: number;
}

interface UserInputInterface {
  name: string;
  category: string;
  description: string | null;
  price: number | null;
  price_type: string;
  duration: string;
  team: Employee[];
}

interface ErrorMsgInterface {
  name: string | null;
  category: string | null;
  price: string | null;
  price_type: string | null;
  duration: string | null;
}

export default function ServiceAdd() {
  const [errorMsg, setErrorMsg] = useState<ErrorMsgInterface>({
    name: null,
    category: null,
    price: null,
    price_type: null,
    duration: null,
  });
  const [cProductLoading, setCProductLoading] = useState(false);

  const [userInput, setUserInput] = useState<UserInputInterface>({
    name: '',
    category: '',
    description: null,
    price: null,
    price_type: 'fixed',
    duration: '1h',
    team: [],
  });
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState<any>([]);

  const { createData: createProduct } = useCreate();

  const globalCategories = useSelector((state: any) => state.app.categories);
  const products = useSelector((state: any) => state.app.products);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { loading: categoryFetchLoading, fetchData: categoriesFetch } =
    useFetch();

  const { loading: employeeFetchLoading, fetchData: employeeFetch } =
    useFetch();

  // [info]: methods

  const resetErrorMsg = () => {
    setErrorMsg({
      name: null,
      category: null,
      price: null,
      price_type: null,
      duration: null,
    });
  };

  const fetchEmployees = () => {
    employeeFetch('/employee/')
      .then((res) => {
        if (res?.status === 200) {
          const modifiedEmployees = res?.data?.map((employee) => {
            return {
              label: `${employee.name} - (${employee.email})`,
              value: employee.id,
            };
          });
          setEmployees(modifiedEmployees);
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const fetchCategories = () => {
    categoriesFetch('/category/?type=service')
      .then((res: any) => {
        if (res?.status === 200) {
          setCategories(res?.data);
          dispatch(setGlobalCategories(res?.data));
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const handleUserInput = (key: string, value: string) => {
    setUserInput({
      ...userInput,
      [key]: value,
    });
  };

  const handleCreateProductClient = (product: any) => {
    // eslint-disable-next-line camelcase
    const total_price = getTotalPrice({ ...product });
    // eslint-disable-next-line camelcase
    dispatch(setProducts([...products, { ...product, total_price }]));
  };

  const handleCreateProduct = () => {
    setCProductLoading(true);
    resetErrorMsg();
    const payload = {
      name: userInput.name,
      category: userInput.category,
      description: userInput.description,
      price: userInput.price,
      price_type: userInput.price_type,
      duration: userInput.duration,
      team: userInput.team.map((employee) => employee.value),
    };

    // eslint-disable-next-line promise/catch-or-return
    createProduct('/services/', payload, false)
      .then(async (res) => {
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

          setErrorMsg(res.data);
        }
        if (res.status === 200) {
          handleCreateProductClient(res.data);

          navigate('/inventory');
        }
        return true;
      })
      .catch(() => {
        return false;
      })
      .finally(() => {
        setCProductLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
    fetchEmployees();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className=" flex flex-col gap-4 px-4 md:px-10 py-10 h-full w-full bg-slate-50 overflow-y-scroll">
      <BackButton />
      <h2 className="mb-5 text-left  text-4xl font-semibold font-sans">
        Add service in your inventory:
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row bg-slate-100 rounded-3xl border border-gray-400">
          <div className="w-full md:w-2/5 p-8">
            <span className="text-xl font-semibold block">Service Info</span>
            <span className="text-gray-600">
              This information will be linked to your service
            </span>
          </div>
          <div className="w-full md:w-3/5 p-4 md:p-8">
            <div className="bg-white rounded-2xl shadow-sm border border-pink-500 p-6">
              <div className="pb-6">
                <LabelInput
                  errorMsg={errorMsg.name}
                  label="Name"
                  loading={false}
                  required
                >
                  <input
                    type="text"
                    id="name"
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                    placeholder="Service Name"
                    required
                    onChange={(e) => handleUserInput('name', e.target.value)}
                  />
                </LabelInput>
              </div>
              <div>
                <LabelInput
                  errorMsg={errorMsg.category}
                  label="Service Category"
                  loading={categoryFetchLoading}
                  required
                >
                  <div className="relative group rounded-full overflow-hidden before:absolute w-full bg-white border border-gray-300">
                    <svg
                      y="0"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0"
                      width="100"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="xMidYMid meet"
                      height="100"
                      className="w-8 h-8 absolute right-2 -rotate-45 stroke-pink-300 top-1/2 -translate-y-1/2 group-hover:rotate-0 duration-300"
                    >
                      <path
                        strokeWidth="4"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        fill="none"
                        d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"
                        className="svg-stroke-primary"
                      />
                    </svg>
                    <select
                      onChange={(e) =>
                        handleUserInput('category', e.target.value)
                      }
                      value={userInput.category}
                      className="appearance-none hover:placeholder-shown:bg-emerald-500 relative text-pink-400 bg-transparent ring-0 outline-none  placeholder-violet-700 text-sm font-bold rounded-full p-4 focus:ring-violet-500 focus:border-violet-500 block w-full"
                      id="category"
                    >
                      <option value="" disabled>
                        Select Service Category
                      </option>

                      {categories.map(
                        (category: { id: number; name: string }) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </LabelInput>
                <Link to="/setting/categories">
                  <button
                    type="button"
                    className="text-sm text-violet-400 flex items-center gap-1 mt-2 ml-auto hover:text-black duration-300"
                  >
                    <AddSVG />
                    Add Category
                  </button>
                </Link>
              </div>

              <div className="pb-6">
                <LabelInput
                  errorMsg={null}
                  label="Service Description"
                  loading={false}
                  required={false}
                >
                  <div className="mx-auto">
                    <textarea
                      id="message"
                      rows={4}
                      className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 resize-none"
                      placeholder="Service description"
                      onChange={(e) =>
                        handleUserInput('description', e.target.value)
                      }
                    />
                  </div>
                </LabelInput>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row bg-slate-100 rounded-3xl border border-gray-400">
          <div className="w-full md:w-2/5 p-4 md:p-8">
            <span className="text-xl font-semibold block">
              Pricing & Inventory
            </span>
            <span className="text-gray-600">
              Specify your product pricing and stock levels
            </span>
          </div>
          <div className="w-full md:w-3/5 p-4 md:p-8">
            <div className="bg-white rounded-2xl shadow-sm border border-pink-500 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <LabelInput
                    errorMsg={errorMsg.price}
                    label="Price"
                    loading={false}
                    required
                  >
                    <input
                      type="number"
                      id="price"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                      placeholder="Price"
                      required
                      onChange={(e) => handleUserInput('price', e.target.value)}
                    />
                  </LabelInput>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <LabelInput
                    required
                    label="Price Type"
                    loading={false}
                    errorMsg={errorMsg.price_type}
                  >
                    <div className="relative group rounded-full overflow-hidden before:absolute w-full bg-white border border-gray-300">
                      <svg
                        y="0"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0"
                        width="100"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMid meet"
                        height="100"
                        className="w-8 h-8 absolute right-2 -rotate-45 stroke-pink-300 top-1/2 -translate-y-1/2 group-hover:rotate-0 duration-300"
                      >
                        <path
                          strokeWidth="4"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          fill="none"
                          d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"
                          className="svg-stroke-primary"
                        />
                      </svg>
                      <select
                        onChange={(e) =>
                          handleUserInput('price_type', e.target.value)
                        }
                        value={userInput.price_type}
                        className="appearance-none hover:placeholder-shown:bg-emerald-500 relative text-pink-400 bg-transparent ring-0 outline-none  placeholder-violet-700 text-sm font-bold rounded-full p-4 focus:ring-violet-500 focus:border-violet-500 block w-full"
                        id="category"
                      >
                        <option value="" disabled>
                          Select Price Type
                        </option>

                        {DURATION_TYPE.map(
                          (duration_type: string, index: number) => (
                            <option key={index} value={duration_type}>
                              {duration_type}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </LabelInput>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <LabelInput
                    required
                    label="Duration"
                    loading={false}
                    errorMsg={errorMsg.duration}
                  >
                    <div className="relative group rounded-full overflow-hidden before:absolute w-full bg-white border border-gray-300">
                      <svg
                        y="0"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0"
                        width="100"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMid meet"
                        height="100"
                        className="w-8 h-8 absolute right-2 -rotate-45 stroke-pink-300 top-1/2 -translate-y-1/2 group-hover:rotate-0 duration-300"
                      >
                        <path
                          strokeWidth="4"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          fill="none"
                          d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"
                          className="svg-stroke-primary"
                        />
                      </svg>
                      <select
                        onChange={(e) =>
                          handleUserInput('duration', e.target.value)
                        }
                        value={userInput.duration}
                        className="appearance-none hover:placeholder-shown:bg-emerald-500 relative text-pink-400 bg-transparent ring-0 outline-none  placeholder-violet-700 text-sm font-bold rounded-full p-4 focus:ring-violet-500 focus:border-violet-500 block w-full"
                        id="duration"
                      >
                        <option value="" disabled>
                          Select Duration
                        </option>

                        {DURATION.map((duration: string, index: number) => (
                          <option key={index} value={duration}>
                            {duration}
                          </option>
                        ))}
                      </select>
                    </div>
                  </LabelInput>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row bg-slate-100 rounded-3xl border border-gray-400">
          <div className="w-full md:w-2/5 p-4 md:p-8">
            <span className="text-xl font-semibold block">Team Members</span>
            <span className="text-gray-600">
              Choose which team members will perform this service
            </span>
          </div>
          <div className="w-full md:w-3/5 p-4 md:p-8">
            <div className="bg-white rounded-2xl shadow-sm border border-pink-500 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="pb-6 pt-2 col-span-2">
                  <LabelInput
                    errorMsg={null}
                    label="Team Member"
                    loading={false}
                    required={false}
                  >
                    <div className="mt-3">
                      <CreatableSelect
                        isClearable={false}
                        isValidNewOption={() => false}
                        isMulti
                        options={employees ? employees : noTaxOptions}
                        className="service_team"
                        placeholder="Select Member"
                        value={userInput.team}
                        onChange={(selectedEmployee) => {
                          handleUserInput('team', selectedEmployee);
                        }}
                      />
                    </div>
                  </LabelInput>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end w-40 ml-auto mt-4">
          <PrimaryButton
            loading={cProductLoading}
            label="Save"
            onClickAction={handleCreateProduct}
          />
        </div>
      </div>
    </div>
  );
}
