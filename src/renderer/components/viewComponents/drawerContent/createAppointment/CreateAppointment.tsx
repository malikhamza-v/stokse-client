import { useEffect, useState } from 'react';
import { useFetch } from '../../../../utils/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { handleAddServiceToCreatedAppointment } from '../../../../../store/slices/appSlice';
import { ServiceCard } from '../../../commonComponents/drawerContent';
import { AddSVG } from '../../../../utils/svg';
import SelectCustomer from '../selectCustomer/SelectCustomer';

function CreateAppointment() {
  const [services, setServices] = useState<any>([]);
  const [isIntendedToAddService, setIsIntendedToAddService] = useState(false);

  const { loading: fetchLoading, fetchData: servicesFetch } = useFetch();

  const dispatch = useDispatch();
  const selectedServices = useSelector(
    (state: any) => state.app.createdAppointment.services,
  );

  //   [methods]:
  const handleAddService = (service: any) => {
    dispatch(handleAddServiceToCreatedAppointment(service));
    setIsIntendedToAddService(false);
  };

  const fetchServices = () => {
    servicesFetch('/services/')
      .then((res) => {
        if (res?.status === 200) {
          const categorizedServices = res?.data.reduce((acc, service) => {
            const categoryId = service.category.id;
            const categoryName = service.category.name;

            // If the category doesn't exist in the accumulator, create it
            if (!acc[categoryId]) {
              acc[categoryId] = {
                categoryName: categoryName,
                services: [],
              };
            }

            // Push the service to the appropriate category
            acc[categoryId].services.push(service);

            return acc;
          }, {});

          setServices(categorizedServices);
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  //   [info]: lifecyles
  useEffect(() => {
    fetchServices();
  }, []);
  return (
    <div
      className="flex h-full transition-all duration-300 box-border"
      id="create_appoint_container"
    >
      <div
        className="flex-1 border-r transition-all duration-300 box-border"
        id="left_container"
      >
        <SelectCustomer />
      </div>

      <div className="min-w-[35vw] w-[35vw] max-w-[35vw]  overflow-y-auto">
        {selectedServices.length > 0 && !isIntendedToAddService ? (
          <div className="h-full flex flex-col">
            <div className="p-8 border-b">
              <p className="text-2xl font-semibold">Wed 18 Sep</p>
              <div className="flex items-center gap-2">
                <p>2.05pm</p>
                <span className="mb-2">.</span>
                <p>Doesn't repeat</p>
              </div>
            </div>
            <div className="flex-1 p-8 overflow-y-auto h-full">
              <p className="font-semibold text-2xl">Services</p>
              <div className="mt-4">
                {selectedServices.map((service: any, index: any) => {
                  return (
                    <ServiceCard
                      key={index}
                      service={service}
                      onClickAction={() => {}}
                    />
                  );
                })}
              </div>
              <div>
                <button
                  onClick={() => setIsIntendedToAddService(true)}
                  className="btn btn-outline rounded-full text-sm"
                >
                  <div className="border rounded-full border-black p-0.5">
                    <AddSVG />
                  </div>
                  Add service
                </button>
              </div>
            </div>
            <div className="p-8 text-lg border-t">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium">Total</p>
                <div className="flex items-center gap-4 text-base">
                  <p className="text-gray-500">10min</p>
                  <p className="font-semibold">PKR 200</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="btn btn-outline">Checkout</button>
                <button className="btn btn-neutral">Save</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <p className="font-medium text-2xl">Select Service</p>
            <div className="mt-4">
              <label
                aria-label="search_service"
                htmlFor="search_service"
                className="input input-bordered flex items-center gap-2"
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
                  className="grow"
                  placeholder="Search service by name"
                  id="search_service"
                />
              </label>
            </div>

            <div className="mt-8 text-lg">
              {Object.keys(services).map((cat, index) => {
                const serviceCategory = services[cat];
                return (
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-lg">
                        {serviceCategory.categoryName}
                      </p>
                      <span className="badge badge-outline">
                        {serviceCategory?.services?.length}
                      </span>
                    </div>

                    <div className="mt-4">
                      {serviceCategory.services.map((service: any) => {
                        return (
                          <ServiceCard
                            key={service.id}
                            service={service}
                            onClickAction={handleAddService}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateAppointment;
