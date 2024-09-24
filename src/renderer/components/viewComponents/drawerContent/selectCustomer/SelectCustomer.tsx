import { useEffect, useState } from 'react';
import { useFetch } from '../../../../utils/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { handleAddCustomerToCreateAppointment } from '../../../../../store/slices/appSlice';
import LoadingList from '../viewAppointment/LoadingList';

function SelectCustomer() {
  const [isIntendedToAddCustomer, setIsIntendedToAddCustomer] = useState(false);
  const [customers, setCustomers] = useState([]);

  const { loading: customerFetchLoading, fetchData: customerFetch } =
    useFetch();

  const dispatch = useDispatch();
  const selectedCustomer = useSelector(
    (state: any) => state.app.appointment.customer,
  );
  // [info]: methods

  const handleSelectCustomer = (customer: any) => {
    dispatch(handleAddCustomerToCreateAppointment(customer));

    handleCloseCustomerSection(customer);
  };

  const handleCloseCustomerSection = (customer: any) => {
    if (!customer) {
      const drawer = document.querySelector('.category-drawer');
      if (drawer) {
        drawer.style.width = '45vw';
      }
    }
    setIsIntendedToAddCustomer(false);
  };

  const handleOpenCustomerSection = () => {
    const drawer = document.querySelector('.category-drawer');
    if (drawer) {
      drawer.style.width = '55vw';
    }
    setTimeout(() => {
      setIsIntendedToAddCustomer(true);
    }, 500);
  };

  const handleAddCustomer = () => {
    if (!isIntendedToAddCustomer && !selectedCustomer) {
      handleOpenCustomerSection();
      // handleCloseCustomerSection();
    } else {
    }
  };

  const fetchCustomer = () => {
    customerFetch('/customers/')
      .then((res) => {
        if (res?.status === 200) {
          setCustomers(res?.data?.results);
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  //   [info]: lifecycles
  useEffect(() => {
    if (selectedCustomer) {
      const drawer = document.querySelector('.category-drawer');
      if (drawer) {
        drawer.style.width = '55vw';
      }
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (isIntendedToAddCustomer) {
      fetchCustomer();
    }
  }, [isIntendedToAddCustomer]);

  return (
    <div
      className={`h-full ${isIntendedToAddCustomer || selectedCustomer ? '' : 'hover:bg-purple-100 cursor-pointer'} overflow-y-auto  max-w-[20vw]`}
      onClick={handleAddCustomer}
      role="button"
      tabIndex={0}
      aria-hidden="true"
    >
      {isIntendedToAddCustomer ? (
        <div className="py-8 w-full box-border block overflow-y-auto">
          <p className="font-semibold text-xl px-4">Select Customer</p>

          <div className="mt-4 px-4 w-full box-border max-w-full">
            <div className="box-border flex w-full">
              <label
                aria-label="search_customer"
                htmlFor="search_customer"
                className="input input-bordered flex items-center gap-2 max-w-full w-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  className=""
                  placeholder="Search customer"
                  id="search_customer"
                />
              </label>
            </div>
          </div>

          <div className="px-4 mt-4">
            <div
              className="flex items-center gap-3 bg-purple-100 mb-4 p-4 rounded-lg cursor-pointer"
              onClick={() => handleSelectCustomer(null)}
            >
              <img
                src="https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Adrian&radius=50"
                alt="customer image"
                className="w-10 h-10"
              />
              <div className="flex flex-col gap-1.5">
                <p>Walk In</p>
              </div>
            </div>
            {customerFetchLoading ? (
              <LoadingList />
            ) : (
              customers?.map((customer) => (
                <div
                  className="flex items-center gap-3 bg-purple-100 mb-4 p-4 rounded-lg cursor-pointer"
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <img
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${customer?.name || 'Walk-In'}&radius=50`}
                    alt="customer image"
                    className="w-10 h-10"
                  />
                  <div className="flex flex-col gap-1.5">
                    <p className="font-medium">{customer?.name || 'Walk-In'}</p>
                    {customer?.email ? (
                      <p className="text-gray-500">{customer?.email}</p>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 justify-center items-center py-8 ">
          {!selectedCustomer ? (
            <div className="flex flex-col items-center justify-center px-4">
              <div>
                <img
                  src="https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Adrian&radius=50"
                  alt="customer_avatar"
                  className="w-14 h-14"
                />
              </div>
              <p className="font-medium mt-2">Add Customer</p>
              <p className="text-center text-gray-500">
                Or leave empty for walk-ins
              </p>
            </div>
          ) : (
            <div className="w-full px-4">
              <div className="flex flex-col items-center justify-center border-b w-full pb-8">
                <img
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${selectedCustomer?.name || 'Walk-In'}&radius=50`}
                  alt="customer image"
                  className="w-16 h-16"
                />
                <div className="flex flex-col justify-center items-center gap-1.5 mt-4">
                  <p className="font-medium">
                    {selectedCustomer?.name || 'Walk-In'}
                  </p>
                  {selectedCustomer?.email ? (
                    <p className="text-gray-500">{selectedCustomer?.email}</p>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <button
                    className="btn btn-neutral btn-sm text-xs"
                    onClick={() => handleSelectCustomer(null)}
                  >
                    Cancel Customer
                  </button>
                  <button className="btn btn-outline btn-sm text-xs">
                    View Profile
                  </button>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <p className="font-medium">
                  Total Spent {selectedCustomer.total_spent}
                </p>
                <p className="font-medium">
                  Created {selectedCustomer.created_at}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SelectCustomer;
