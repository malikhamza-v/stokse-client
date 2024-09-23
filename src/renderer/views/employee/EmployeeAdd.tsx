/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Flatpickr from 'react-flatpickr';
import {
  BackButton,
  PrimaryButton,
} from '../../components/commonComponents/buttons';
import { LabelInput } from '../../components/commonComponents';
import useCreate from '../../utils/hooks/useCreate';
import { formatDateIntoYYMMDD } from '../../utils/methods';

interface UserInputInterface {
  name: string;
  email: string;
  phone: string;
  role: string | null;
  can_perform_services: boolean;
  address: string | null;
  date_of_birth: string | null;
  date_joined: string | null;
}

interface ErrorMsgInterface {
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  can_perform_services: string | null;
  address: string | null;
  date_of_birth: string | null;
  date_joined: string | null;
}

export default function EmployeeAdd() {
  // [info]: constants
  const employeeStatus = ['Admin', 'Manager', 'Staff'];
  const [errorMsg, setErrorMsg] = useState<ErrorMsgInterface>({
    name: null,
    email: null,
    phone: null,
    role: null,
    can_perform_services: null,
    address: null,
    date_of_birth: null,
    date_joined: null,
  });
  const [cProductLoading, setCProductLoading] = useState(false);

  const [userInput, setUserInput] = useState<UserInputInterface>({
    name: '',
    email: '',
    phone: '',
    role: null,
    can_perform_services: false,
    address: null,
    date_joined: null,
    date_of_birth: null,
  });

  const { createData: createEmployee } = useCreate();
  const navigate = useNavigate();

  // [info]: methods
  const resetErrorMsg = () => {
    setErrorMsg({
      name: null,
      email: null,
      phone: null,
      role: null,
      can_perform_services: null,
      address: null,
      date_of_birth: null,
      date_joined: null,
    });
  };

  const handleUserInput = (key: string, value: string) => {
    setUserInput({
      ...userInput,
      [key]: value,
    });
  };

  const handleCreateEmployee = () => {
    setCProductLoading(true);
    resetErrorMsg();
    const payload = {
      name: userInput.name,
      email: userInput.email || null,
      phone: userInput.phone || null,
      role: userInput.role,
      can_perform_services: userInput.can_perform_services,
      address: userInput.address,
      date_of_birth: userInput.date_of_birth
        ? formatDateIntoYYMMDD(userInput.date_of_birth)
        : null,
      date_joined: userInput.date_joined
        ? formatDateIntoYYMMDD(userInput.date_joined)
        : null,
    };

    // eslint-disable-next-line promise/catch-or-return
    createEmployee('/employee/', payload, false)
      .then(async (res) => {
        if (res.status === 200) {
          toast.success('Employee created successfully!');
          navigate('/employees');
        } else if (res.status === 400) {
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
        } else {
          toast.error('Something went wrong!');
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

  return (
    <div className=" flex flex-col gap-4 px-4 md:px-10 py-10 h-full w-full bg-slate-50 overflow-y-scroll">
      <BackButton />
      <h2 className="mb-5 text-left  text-4xl font-semibold font-sans">
        Add employee for your store:
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row bg-slate-100 rounded-3xl border border-gray-400">
          <div className="w-full md:w-2/5 p-8">
            <span className="text-xl font-semibold block">Employee Info</span>
            <span className="text-gray-600">
              This information will be linked to your employee
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
                    placeholder="Employee name"
                    required
                    onChange={(e) => handleUserInput('name', e.target.value)}
                  />
                </LabelInput>
              </div>

              <div className="pb-6">
                <LabelInput
                  errorMsg={errorMsg.email}
                  label="Email"
                  loading={false}
                  required
                >
                  <input
                    type="email"
                    id="email"
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                    placeholder="Employee email"
                    required
                    onChange={(e) => handleUserInput('email', e.target.value)}
                  />
                </LabelInput>
              </div>

              <div className="pb-6">
                <LabelInput
                  errorMsg={errorMsg.phone}
                  label="Phone"
                  loading={false}
                  required
                >
                  <input
                    type="number"
                    id="phone"
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                    placeholder="Employee number"
                    required
                    onChange={(e) => handleUserInput('phone', e.target.value)}
                  />
                </LabelInput>
              </div>

              <div className="pb-6">
                <LabelInput
                  errorMsg={errorMsg.role}
                  label="Employee role"
                  required
                  loading={false}
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
                      onChange={(e) => handleUserInput('role', e.target.value)}
                      value={userInput?.role ? userInput?.role : ''}
                      className="appearance-none hover:placeholder-shown:bg-emerald-500 relative text-pink-400 bg-transparent ring-0 outline-none  placeholder-violet-700 text-sm font-bold rounded-full p-4 focus:ring-violet-500 focus:border-violet-500 block w-full"
                      id="role"
                    >
                      <option value="" disabled>
                        Select role
                      </option>
                      {employeeStatus.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </LabelInput>
              </div>

              <div className="form-control w-fit ">
                <LabelInput
                  label="Can perform services?"
                  errorMsg={errorMsg.can_perform_services}
                  loading={false}
                  required={false}
                  isInline={true}
                  htmlfor="can_perform_services"
                >
                  <input
                    type="checkbox"
                    id="can_perform_services"
                    className="checkbox ml-4"
                    onChange={(e) =>
                      handleUserInput('can_perform_services', e.target.checked)
                    }
                  />
                </LabelInput>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row bg-slate-100 rounded-3xl border border-gray-400">
          <div className="w-full md:w-2/5 p-8">
            <span className="text-xl font-semibold block">Additional Info</span>
            <span className="text-gray-600">
              Add additional info of your employee
            </span>
          </div>
          <div className="w-full md:w-3/5 p-4 md:p-8">
            <div className="bg-white rounded-2xl shadow-sm border border-pink-500 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <LabelInput
                    errorMsg={errorMsg.date_of_birth}
                    label="Date of birth"
                    loading={false}
                    required={false}
                  >
                    <Flatpickr
                      value={
                        userInput.date_of_birth ? userInput.date_of_birth : ''
                      }
                      placeholder="DOB"
                      onChange={([date]: any) => {
                        handleUserInput('date_of_birth', date);
                      }}
                    />
                  </LabelInput>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <LabelInput
                    errorMsg={null}
                    label="Joining date"
                    loading={false}
                    required={false}
                  >
                    <Flatpickr
                      value={userInput.date_joined ? userInput.date_joined : ''}
                      placeholder="Joining Date"
                      onChange={([date]: any) => {
                        handleUserInput('date_joined', date);
                      }}
                    />
                  </LabelInput>
                </div>

                <div className="pb-6 pt-2 col-span-2">
                  <LabelInput
                    errorMsg={errorMsg.address}
                    label="Address"
                    loading={false}
                    required={false}
                  >
                    <div className="mx-auto">
                      <textarea
                        id="address"
                        rows={2}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 resize-none"
                        placeholder="Employee address"
                        onChange={(e) =>
                          handleUserInput('address', e.target.value)
                        }
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
            onClickAction={handleCreateEmployee}
          />
        </div>
      </div>
    </div>
  );
}
