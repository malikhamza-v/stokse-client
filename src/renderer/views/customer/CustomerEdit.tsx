/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LabelInput } from '../../components/commonComponents';
import {
  BackButton,
  PrimaryButton,
} from '../../components/commonComponents/buttons';
import useEdit from '../../utils/hooks/useEdit';
import { useFetch } from '../../utils/hooks';
import Accordion from '../../components/commonComponents/accordian/Accordian';

interface UserInputInterface {
  name: string;
  email: string;
  phone: string;
  orders: [];
}

interface ErrorMsgInterface {
  name: string | null;
  email: string | null;
  phone: string | null;
}

export default function CustomerEdit() {
  const [errorMsg, setErrorMsg] = useState<ErrorMsgInterface>({
    name: null,
    email: null,
    phone: null,
  });

  const [userInput, setUserInput] = useState<UserInputInterface>({
    name: '',
    email: '',
    phone: '',
    orders: [],
  });

  const { loading: cProductLoading, editData: editProduct } = useEdit();

  const params = useParams();

  const product = useSelector((state: any) => state.app.editProduct);

  const { fetchData: brandsFetch, loading: customerLoading } = useFetch();

  // [info]: helpers
  const resetErrorMsg = () => {
    setErrorMsg({
      name: null,
      email: null,
      phone: null,
    });
  };

  const handleUserInput = (key: string, value: string) => {
    setUserInput({
      ...userInput,
      [key]: value,
    });
  };

  const fetchCustomer = (id: number) => {
    brandsFetch(`/customer/${id}/`)
      .then((res) => {
        if (res?.status === 200) {
          setUserInput({
            email: res.data.email,
            phone: res.data.phone,
            name: res.data.name,
            orders: res.data.orders,
          });
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const handleEditCustomer = () => {
    resetErrorMsg();
    const payload = {
      name: userInput.name,
      email: userInput.email,
      phone: userInput.phone,
    };

    editProduct(`/customer/${params.id}/`, payload, false)
      .then((res) => {
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
          // navigate('/inventory');
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  // [info]: lifecycle
  useEffect(() => {
    if (params.id) {
      fetchCustomer(params.id as unknown as number);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className=" flex flex-col gap-4 px-10 py-10 h-full w-full bg-slate-50 overflow-y-scroll">
      <BackButton />
      <h2 className="mb-5 text-left  text-4xl font-semibold font-sans">
        Edit {product?.name || 'Walk-In customer'}:
      </h2>
      <div className="flex bg-slate-100 rounded-3xl border border-gray-400">
        <div className="w-2/5 p-8">
          <span className="text-xl font-semibold block">Customer Info</span>
          <span className="text-gray-600">
            This information is linked to your customer
          </span>
        </div>
        <div className="w-3/5 p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-pink-500 p-6">
            <div className="pb-6">
              <LabelInput
                errorMsg={errorMsg.name}
                loading={customerLoading}
                label="Name"
                required
              >
                <input
                  type="text"
                  id="name"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                  placeholder="Customer Name"
                  required
                  value={userInput.name}
                  onChange={(e) => handleUserInput('name', e.target.value)}
                />
              </LabelInput>
            </div>

            <div className="pb-6">
              <LabelInput
                errorMsg={errorMsg.email}
                loading={customerLoading}
                label="Email"
                required
              >
                <input
                  type="email"
                  id="email"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                  placeholder="Customer Email"
                  required
                  value={userInput.email}
                  onChange={(e) => handleUserInput('email', e.target.value)}
                />
              </LabelInput>
            </div>

            <div className="pb-6">
              <LabelInput
                errorMsg={errorMsg.phone}
                loading={customerLoading}
                label="Phone"
                required
              >
                <input
                  type="number"
                  id="phone"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                  placeholder="Customer Phone"
                  required
                  value={userInput.phone}
                  onChange={(e) => handleUserInput('phone', e.target.value)}
                />
              </LabelInput>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-slate-100 rounded-3xl border border-gray-400">
        <div className="w-2/5 p-8">
          <span className="text-xl font-semibold block">Customer Orders</span>
          <span className="text-gray-600">
            These are the orders placed by this customer
          </span>
        </div>
        <div className="w-full p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-pink-500 p-6">
            <Accordion orders={userInput.orders} />
          </div>
        </div>
      </div>

      <div className="flex justify-end w-40 ml-auto">
        <PrimaryButton
          loading={cProductLoading}
          label="Edit"
          onClickAction={handleEditCustomer}
        />
      </div>
    </div>
  );
}
