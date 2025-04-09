/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFetch } from '../../utils/hooks';
import {
  AddSVG,
  DeleteSVG,
  EditSVG,
  ErrorSVG,
  SearchSVG,
  ViewSVG,
} from '../../utils/svg';
import useRemove from '../../utils/hooks/useRemove';

/* eslint-disable jsx-a11y/control-has-associated-label */
export default function Employees() {
  let currentUrl = '/employee/';
  const tableBody = useRef<HTMLTableSectionElement>(null);
  const [employees, setEmployees] = useState<any>([]);
  const [userInput, setUserInput] = useState({
    email: '',
    filter: 'all',
  });
  const [preDeleteItem, setPreDeleteItem] = useState<any>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { loading: fetchLoading, fetchData: employeesFetch } = useFetch();
  const { loading: rProductLoading, removeData: removeProduct } = useRemove();

  // [info]: method

  const fetchEmployees = (endpoint: string) => {
    employeesFetch(endpoint)
      .then((res) => {
        if (res?.status === 200) {
          setEmployees(res?.data);
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const constructUrl = (email: string, filter: string) => {
    let params: any = {};
    if (email) {
      params = { ...params, email };
    }
    if (filter && filter !== 'all') {
      params = { ...params, filter };
    }

    Object.keys(params).forEach((key, index) => {
      if (index === 0) {
        currentUrl += `?${key}=${params[key]}`;
      } else {
        currentUrl += `&${key}=${params[key]}`;
      }
    });
  };

  const handleFilter = (filter: string) => {
    setUserInput({ ...userInput, filter });
    constructUrl(userInput.email, filter);
    fetchEmployees(currentUrl);
  };

  const handleDeleteItem = () => {
    if (preDeleteItem.id) {
      removeProduct(`/employee/${preDeleteItem.id}/`, false)
        .then((res) => {
          if (res.status === 204) {
            toast.success('Employee deleted successfully!');
            setShowDeleteModal(false);
            fetchEmployees(currentUrl);
          } else if (res.status === 400) {
            toast.error(res.data);
            setShowDeleteModal(false);
            fetchEmployees(currentUrl);
          }
          return true;
        })
        .catch(() => {
          return false;
        });
    }
  };

  const handleEmployeeDelete = (customer: any) => {
    setShowDeleteModal(true);
    setPreDeleteItem(customer);
  };

  // [info]: lifecyles
  useEffect(() => {
    fetchEmployees(currentUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="py-10 px-4 mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="text-gray-800 font-bold text-2xl">Employees</h2>

            <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full  ">
              {employees?.length} employees
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500 ">
            These are the employees in your store.
          </p>
        </div>

        <div className="flex items-center mt-4 gap-x-3 text-xs md:text-sm">
          <button
            type="button"
            className="flex items-center justify-center px-5 py-2 text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_3098_154395)">
                <path
                  d="M13.3333 13.3332L9.99997 9.9999M9.99997 9.9999L6.66663 13.3332M9.99997 9.9999V17.4999M16.9916 15.3249C17.8044 14.8818 18.4465 14.1806 18.8165 13.3321C19.1866 12.4835 19.2635 11.5359 19.0351 10.6388C18.8068 9.7417 18.2862 8.94616 17.5555 8.37778C16.8248 7.80939 15.9257 7.50052 15 7.4999H13.95C13.6977 6.52427 13.2276 5.61852 12.5749 4.85073C11.9222 4.08295 11.104 3.47311 10.1817 3.06708C9.25943 2.66104 8.25709 2.46937 7.25006 2.50647C6.24304 2.54358 5.25752 2.80849 4.36761 3.28129C3.47771 3.7541 2.70656 4.42249 2.11215 5.23622C1.51774 6.04996 1.11554 6.98785 0.935783 7.9794C0.756025 8.97095 0.803388 9.99035 1.07431 10.961C1.34523 11.9316 1.83267 12.8281 2.49997 13.5832"
                  stroke="currentColor"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_3098_154395">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <span>Export</span>
          </button>
          <Link to="/employee/add">
            <button
              type="button"
              className="flex items-center justify-center px-5 py-2 tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600"
            >
              <div className="border border-white rounded-full p-[1px]">
                <AddSVG />
              </div>

              <span>Add employee</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-6 md:flex md:items-center md:justify-between">
        <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse">
          <button
            type="button"
            className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${
              (!userInput.filter || userInput.filter === 'all') && 'bg-gray-100'
            } sm:text-sm`}
            onClick={() => handleFilter('all')}
          >
            View all
          </button>

          <button
            type="button"
            className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${
              userInput.filter === 'known' && 'bg-gray-100'
            } sm:text-sm`}
            onClick={() => handleFilter('known')}
          >
            Active
          </button>

          <button
            type="button"
            className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${
              userInput.filter === 'walk-in' && 'bg-gray-100'
            } sm:text-sm`}
            onClick={() => handleFilter('walk-in')}
          >
            Inactive
          </button>
        </div>

        <div className="relative flex items-center mt-4 md:mt-0">
          <span className="absolute">
            <SearchSVG />
          </span>

          <input
            type="text"
            placeholder="Search by email"
            className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          />
        </div>
      </div>

      <div className="flex flex-col mt-6">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 table w-full">
                <thead className="bg-gray-50 table w-full rounded-none">
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
                      Role
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
                  {fetchLoading ? (
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
                  ) : employees?.length > 0 ? (
                    <>
                      {employees.map((employee: any, index: number) => {
                        return (
                          <tr key={employee.id} className="table w-full">
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
                                  <span>{employee.name || 'Walk-In'}</span>
                                </p>
                              </div>
                            </td>
                            <td className="py-4 pl-4 pr-8 text-sm w-[20%]">
                              <div>
                                <h4 className="text-gray-700 ">
                                  <span>{employee.role}</span>
                                </h4>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm w-[20%]">
                              <div className="flex items-center">
                                <p className="text-gray-500 mt-2">
                                  {employee.email || 'NONE'}
                                </p>
                              </div>
                            </td>

                            <td className="px-4 py-4 text-sm whitespace-nowrap w-[10%]">
                              <div>{employee.phone || 'NONE'}</div>
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
                                <Link to={`/employee/edit/${employee.id}`}>
                                  <button
                                    type="button"
                                    className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                                    // onClick={() => handleProductForEdit(product)}
                                  >
                                    <EditSVG />
                                  </button>
                                </Link>

                                <button
                                  type="button"
                                  className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                                  onClick={() => handleEmployeeDelete(employee)}
                                >
                                  <DeleteSVG />
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
                        className="px-4 py-4 text-sm font-medium whitespace-pre-wrap w-[25%] text-center"
                      >
                        <div className="flex items-center justify-center gap-2 my-2">
                          <ErrorSVG />
                          <h2 className="font-medium text-gray-800  ">
                            No Employee Found
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

      {showDeleteModal && (
        <div className="flex items-center justify-center">
          <div>
            <div className="fixed inset-0 transition-opacity h-full ">
              <div className="absolute inset-0 bg-black opacity-60" />
            </div>

            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="w-full inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ErrorSVG />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3
                          className="text-lg leading-6 font-medium text-gray-900"
                          id="modal-headline"
                        >
                          {' '}
                          Delete Item{' '}
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            {' '}
                            Are you sure you want to delete{' '}
                            <span className="font-bold">
                              {preDeleteItem.name}
                            </span>
                            ? This action cannot be undone.{' '}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${
                        rProductLoading && 'opacity-50'
                      }`}
                      onClick={handleDeleteItem}
                      disabled={rProductLoading}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {rProductLoading && (
                          <div className="flex flex-row gap-1">
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
                          </div>
                        )}
                        {rProductLoading ? 'Loading' : 'Delete'}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {' '}
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
