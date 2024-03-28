/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import { useEffect, useRef, useState } from 'react';
import { useFetch } from '../../../utils/hooks';
import { ArrowLongRight, EditSVG, ErrorSVG, ViewSVG } from '../../../utils/svg';

function RecentCustomers() {
  const tableBody = useRef<HTMLTableSectionElement>(null);
  const [customers, setCustomers] = useState<any>([]);

  const { loading: customerLoading, fetchData: customerFetch } = useFetch();

  // [info]: method

  const fetchCustomers = () => {
    customerFetch('/customers/')
      .then((res) => {
        if (res?.status === 200) {
          setCustomers(res?.data);
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  // [info]: lifecyles
  useEffect(() => {
    fetchCustomers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="text-gray-800 font-bold text-2xl">
              Recent Customers
            </h2>

            <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full  ">
              {customers.results?.length} customers
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500 ">
            These are the recent customers of your store.
          </p>
        </div>
      </div>

      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg mx-auto">
              <table className="min-w-full divide-y divide-gray-200 table w-full">
                <thead className="bg-gray-50 table w-full">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 px-4 text-sm font-normal text-gray-500 w-[10%]"
                    >
                      <button
                        type="button"
                        className="flex items-center gap-x-3 focus:outline-none"
                      >
                        <span>Sr.</span>
                      </button>
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 px-10 text-sm font-normal text-left text-gray-500 w-[20%]"
                    >
                      Name
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-8 text-sm font-normal text-left rtl:text-right text-gray-500 w-[20%] "
                    >
                      No. of orders
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 px-3 text-sm font-normal text-left rtl:text-right text-gray-500 w-[20%] "
                    >
                      Email
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 w-[10%]"
                    >
                      Phone
                    </th>

                    <th scope="col" className="relative py-3.5 px-4 w-full">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody
                  ref={tableBody}
                  className="bg-white block h-[450px] divide-y divide-gray-200 overflow-y-scroll"
                >
                  {customerLoading ? (
                    <>
                      {[...Array(7).keys()].map((index) => (
                        <tr className="table w-full" key={index}>
                          <td className="px-4 py-4 text-sm font-medium whitespace-pre-wrap w-[10%]">
                            <div>
                              <h2 className="font-medium text-gray-800  ">
                                <div
                                  className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                                  style={{ animationDelay: '0.2s' }}
                                />
                              </h2>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm font-medium w-[20%]">
                            <div
                              className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>
                          <td className="py-4 pl-4 pr-8 text-sm w-[20%]">
                            <div className="flex flex-col gap-2">
                              <div
                                className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                                style={{ animationDelay: '0.2s' }}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm w-[20%]">
                            <div
                              className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>

                          <td className="px-4 py-4 text-sm whitespace-nowrap w-[10%]">
                            <div
                              className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>

                          <td className="px-4 py-4 text-sm whitespace-nowrap">
                            <div
                              className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : customers.results?.length > 0 ? (
                    <>
                      {customers.results.map((customer: any, index: number) => {
                        return (
                          <tr key={customer.id} className="table w-full">
                            <td className="px-4 py-4 text-sm font-medium whitespace-pre-wrap w-[10%]">
                              <div>
                                <p className="text-sm text-wrap  font-normal text-gray-600 mt-2">
                                  <span>{index + 1}</span>
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm font-medium w-[20%]">
                              <div className="py-1 text-sm font-normal rounded-full text-emerald-500 bg-emerald-100/60 w-32 text-center">
                                <p className="text-sm text-wrap  font-normal text-gray-600 capitalize">
                                  <span>{customer.name || 'Walk-In'}</span>
                                </p>
                              </div>
                            </td>
                            <td className="py-4 pl-4 pr-8 text-sm w-[20%]">
                              <div>
                                <h4 className="text-gray-700 ">
                                  <span>
                                    {customer.total_orders}{' '}
                                    {customer.total_orders > 1
                                      ? 'orders'
                                      : 'order'}{' '}
                                    placed
                                  </span>
                                </h4>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm w-[20%]">
                              <div className="flex items-center">
                                <p className="text-gray-500 mt-2">
                                  {customer.email || 'NONE'}
                                </p>
                              </div>
                            </td>

                            <td className="px-4 py-4 text-sm whitespace-nowrap w-[10%]">
                              <div>{customer.phone || 'NONE'}</div>
                            </td>

                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                              <div className="flex items-center gap-2 justify-center">
                                <button
                                  type="button"
                                  className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                                  // onClick={() => handleProductForEdit(product)}
                                >
                                  <ViewSVG />
                                </button>

                                <button
                                  type="button"
                                  className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                                  // onClick={() =>
                                  //   handleSelectProductForDelete(product)
                                  // }
                                >
                                  <EditSVG />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    <tr className="table w-full">
                      <td
                        colSpan={6}
                        className="px-4 py-4 text-sm font-medium whitespace-pre-wrap w-[20%] text-center"
                      >
                        <div className="flex items-center justify-center gap-2 my-2">
                          <ErrorSVG />
                          <h2 className="font-medium text-gray-800  ">
                            No Customer Found
                          </h2>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="w-fit ml-auto my-4">
        <button
          type="button"
          className="border px-4 py-2 border-gray-500 rounded-lg font-medium hover:scale-105 duration-300"
        >
          <div className="flex items-center gap-2">
            See All
            <ArrowLongRight />
          </div>
        </button>
        {/* <SecondaryButton label="See all" loading={false} onClickAction={null} /> */}
      </div>
    </div>
  );
}

export default RecentCustomers;
