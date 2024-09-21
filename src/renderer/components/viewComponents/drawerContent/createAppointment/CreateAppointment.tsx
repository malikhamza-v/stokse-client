import { useEffect, useState } from 'react';
import { useFetch } from '../../../../utils/hooks';

function CreateAppointment() {
  const [services, setServices] = useState<any>([]);

  const { loading: fetchLoading, fetchData: servicesFetch } = useFetch();

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

  useEffect(() => {
    fetchServices();
  }, []);
  return (
    <div className="grid grid-cols-4 h-full">
      <div className="col-span-1 border-r p-8">
        <p>Select Customer</p>
      </div>

      <div className="col-span-3 p-8">
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
                      <div
                        key={service?.id}
                        className="flex items-center justify-between border-l-8 rounded-lg border-purple-300 px-4 py-2 mb-4 cursor-pointer hover:bg-slate-100 hover:rounded-l-none transition-all duration-300"
                      >
                        <div className="flex flex-col gap-2">
                          <p className="font-semibold">{service.name}</p>
                          <p className="text-gray-500">{service.duration}</p>
                        </div>
                        <p className="font-semibold">{service.price}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CreateAppointment;
