/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import LineChart from '../components/viewComponents/chart/LineChart';
import { useFetch } from '../utils/hooks';
import { BagSVG, CashSVG, ColorCirclesSVG, PersonSVG } from '../utils/svg';
import { ConvertIntoDecimal } from '../utils/methods';

function Dashboard() {
  // [info]: states
  const [analyticsSale, setAnalyticsSale] = useState(null);
  const [analyticsCustomer, setAnalyticsCustomer] = useState(null);
  const [analyticsItemsSold, setAnalyticsItemsSold] = useState(null);

  const [selectedButton, setSelectedButton] = useState({
    sale: 1,
    customer: 1,
    itemsSold: 1,
  });
  // [info]: hooks
  const { loading: analyticsSaleLoading, fetchData: analyticsSaleFetch } =
    useFetch();

  const {
    loading: analyticsCustomerLoading,
    fetchData: analyticsCustomerFetch,
  } = useFetch();

  const {
    loading: analyticsItemsSoldLoading,
    fetchData: analyticsItemsSoldFetch,
  } = useFetch();

  // [info]: methods
  const fetchAnalyticsSale = (days: number) => {
    analyticsSaleFetch(`/store/analytics/sales/?days=${days}`)
      .then((res) => {
        if (res.status === 200) {
          setAnalyticsSale(res?.data);
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const fetchAnalyticsCustomer = (days: number) => {
    analyticsCustomerFetch(`/store/analytics/customers/?days=${days}`)
      .then((res) => {
        if (res.status === 200) {
          setAnalyticsCustomer(res?.data);
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const fetchAnalyticsItemsSold = (days: number) => {
    analyticsItemsSoldFetch(`/store/analytics/items-sold/?days=${days}`)
      .then((res) => {
        if (res.status === 200) {
          setAnalyticsItemsSold(res?.data);
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  // [info]: lifecycles
  useEffect(() => {
    fetchAnalyticsSale(selectedButton.sale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedButton.sale]);

  useEffect(() => {
    fetchAnalyticsCustomer(selectedButton.customer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedButton.customer]);

  useEffect(() => {
    fetchAnalyticsItemsSold(selectedButton.itemsSold);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedButton.itemsSold]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="w-full overflow-y-scroll">
      <div>
        <div className="px-6 pt-6 2xl:container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2 lg:col-span-1">
              <div className="h-full py-8 px-6 space-y-6 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <h5 className="text-xl text-purple-800 font-medium">
                    Store Sale
                  </h5>
                  <div className="flex items-center gap-2 z-20">
                    <button
                      type="button"
                      className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                        selectedButton.sale === 1 &&
                        'opacity-70 border-blue-500 border-2'
                      }`}
                      disabled={selectedButton.sale === 1}
                      onClick={() =>
                        setSelectedButton({
                          ...selectedButton,
                          sale: 1,
                        })
                      }
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                        selectedButton.sale === 7 &&
                        'opacity-70 border-blue-500 border-2'
                      }`}
                      disabled={selectedButton.sale === 7}
                      onClick={() =>
                        setSelectedButton({
                          ...selectedButton,
                          sale: 7,
                        })
                      }
                    >
                      This Week
                    </button>
                    <button
                      type="button"
                      className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                        selectedButton.sale === 30 &&
                        'opacity-70 border-blue-500 border-2'
                      }`}
                      disabled={selectedButton.sale === 30}
                      onClick={() =>
                        setSelectedButton({
                          ...selectedButton,
                          sale: 30,
                        })
                      }
                    >
                      This Month
                    </button>
                  </div>
                </div>
                <div className="relative ">
                  <div
                    className="animate-spin"
                    style={{ animationDuration: '4s' }}
                  >
                    <ColorCirclesSVG />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <CashSVG />
                  </div>
                </div>
                <div>
                  {analyticsSaleLoading ? (
                    <div className="my-2 flex justify-center gap-4">
                      <div className="text-sm text-wrap  font-normal text-gray-600">
                        <div
                          className="h-2 bg-gray-300 rounded-2xl animate-pulse w-8"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="my-2 flex items-center justify-center gap-4">
                      <h3 className="text-3xl font-bold text-gray-700">
                        ${ConvertIntoDecimal(analyticsSale?.total_sale)}
                      </h3>

                      <div className="flex items-end gap-1 text-green-500">
                        <svg
                          className={`w-3 ${
                            analyticsSale?.percentage_change < 0 &&
                            'rotate-180 my-auto mb-1.5'
                          }`}
                          viewBox="0 0 12 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.00001 0L12 8H-3.05176e-05L6.00001 0Z"
                            fill="currentColor"
                          />
                        </svg>
                        <span>{analyticsSale?.percentage_change}%</span>
                      </div>
                    </div>
                  )}
                  {analyticsSaleLoading ? (
                    <div className="my-2 flex justify-center gap-4">
                      <div className="text-sm text-wrap  font-normal text-gray-600">
                        <div
                          className="h-2 bg-gray-300 rounded-2xl animate-pulse w-28"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="block text-center text-gray-500">
                      Compared to last{' '}
                      <span className="font-semibold">
                        {selectedButton.sale === 1
                          ? 'day'
                          : selectedButton.sale === 7
                          ? 'week'
                          : 'month'}{' '}
                      </span>
                      ${ConvertIntoDecimal(analyticsSale?.prev_total_sale)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-1">
              <div className="h-full py-8 px-6 space-y-6 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <h5 className="text-xl text-purple-800 font-medium">
                    Store Customer
                  </h5>
                  <div className="flex items-center gap-2 z-20">
                    <button
                      type="button"
                      className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                        selectedButton.customer === 1 &&
                        'opacity-70 border-blue-500 border-2'
                      }`}
                      disabled={selectedButton.customer === 1}
                      onClick={() =>
                        setSelectedButton({
                          ...selectedButton,
                          customer: 1,
                        })
                      }
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                        selectedButton.customer === 7 &&
                        'opacity-70 border-blue-500 border-2'
                      }`}
                      disabled={selectedButton.customer === 7}
                      onClick={() =>
                        setSelectedButton({
                          ...selectedButton,
                          customer: 7,
                        })
                      }
                    >
                      This Week
                    </button>
                    <button
                      type="button"
                      className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                        selectedButton.customer === 30 &&
                        'opacity-70 border-blue-500 border-2'
                      }`}
                      disabled={selectedButton.customer === 30}
                      onClick={() =>
                        setSelectedButton({
                          ...selectedButton,
                          customer: 30,
                        })
                      }
                    >
                      This Month
                    </button>
                  </div>
                </div>
                <div className="relative ">
                  <div
                    className="animate-spin"
                    style={{
                      animationDuration: '5s',
                      animationDelay: '0.2s',
                    }}
                  >
                    <ColorCirclesSVG />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <PersonSVG />
                  </div>
                </div>
                <div>
                  {analyticsCustomerLoading ? (
                    <div className="my-2 flex justify-center gap-4">
                      <div className="text-sm text-wrap  font-normal text-gray-600">
                        <div
                          className="h-2 bg-gray-300 rounded-2xl animate-pulse w-8"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="my-2 flex items-center justify-center gap-4">
                      <h3 className="text-3xl font-bold text-gray-700">
                        {analyticsCustomer?.total_customers}
                      </h3>

                      <div className="flex items-end gap-1 text-green-500">
                        <svg
                          className={`w-3 ${
                            analyticsCustomer?.percentage_change < 0 &&
                            'rotate-180 my-auto mb-1.5'
                          }`}
                          viewBox="0 0 12 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.00001 0L12 8H-3.05176e-05L6.00001 0Z"
                            fill="currentColor"
                          />
                        </svg>
                        <span>{analyticsCustomer?.percentage_change}%</span>
                      </div>
                    </div>
                  )}
                  {analyticsCustomerLoading ? (
                    <div className="my-2 flex justify-center gap-4">
                      <div className="text-sm text-wrap  font-normal text-gray-600">
                        <div
                          className="h-2 bg-gray-300 rounded-2xl animate-pulse w-28"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="block text-center text-gray-500">
                      Compared to last{' '}
                      <span className="font-semibold">
                        {selectedButton.customer === 1
                          ? 'day'
                          : selectedButton.customer === 7
                          ? 'week'
                          : 'month'}{' '}
                      </span>
                      {analyticsCustomer?.prev_total_customers}{' '}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-1">
              <div className="h-full py-8 px-6 space-y-6 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <h5 className="text-xl text-purple-800 font-medium">
                    items Sold
                  </h5>
                  <div className="flex items-center gap-2 z-20">
                    <button
                      type="button"
                      className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                        selectedButton.itemsSold === 1 &&
                        'opacity-70 border-blue-500 border-2'
                      }`}
                      disabled={selectedButton.itemsSold === 1}
                      onClick={() =>
                        setSelectedButton({
                          ...selectedButton,
                          itemsSold: 1,
                        })
                      }
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                        selectedButton.itemsSold === 7 &&
                        'opacity-70 border-blue-500 border-2'
                      }`}
                      disabled={selectedButton.itemsSold === 7}
                      onClick={() =>
                        setSelectedButton({
                          ...selectedButton,
                          itemsSold: 7,
                        })
                      }
                    >
                      This Week
                    </button>
                    <button
                      type="button"
                      className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                        selectedButton.itemsSold === 30 &&
                        'opacity-70 border-blue-500 border-2'
                      }`}
                      disabled={selectedButton.itemsSold === 30}
                      onClick={() =>
                        setSelectedButton({
                          ...selectedButton,
                          itemsSold: 30,
                        })
                      }
                    >
                      This Month
                    </button>
                  </div>
                </div>
                <div className="relative ">
                  <div
                    className="animate-spin"
                    style={{
                      animationDuration: '6s',
                      animationDelay: '0.4s',
                    }}
                  >
                    <ColorCirclesSVG />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <BagSVG />
                  </div>
                </div>
                <div>
                  {analyticsItemsSoldLoading ? (
                    <div className="my-2 flex justify-center gap-4">
                      <div className="text-sm text-wrap  font-normal text-gray-600">
                        <div
                          className="h-2 bg-gray-300 rounded-2xl animate-pulse w-8"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="my-2 flex items-center justify-center gap-4">
                      <h3 className="text-3xl font-bold text-gray-700">
                        {analyticsItemsSold?.total_items_sold}
                      </h3>

                      <div className="flex items-end gap-1 text-green-500">
                        <svg
                          className={`w-3 ${
                            analyticsItemsSold?.percentage_change < 0 &&
                            'rotate-180 my-auto mb-1.5'
                          }`}
                          viewBox="0 0 12 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.00001 0L12 8H-3.05176e-05L6.00001 0Z"
                            fill="currentColor"
                          />
                        </svg>
                        <span>{analyticsItemsSold?.percentage_change}%</span>
                      </div>
                    </div>
                  )}
                  {analyticsItemsSoldLoading ? (
                    <div className="my-2 flex justify-center gap-4">
                      <div className="text-sm text-wrap  font-normal text-gray-600">
                        <div
                          className="h-2 bg-gray-300 rounded-2xl animate-pulse w-28"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="block text-center text-gray-500">
                      Compared to last{' '}
                      <span className="font-semibold">
                        {selectedButton.itemsSold === 1
                          ? 'day'
                          : selectedButton.itemsSold === 7
                          ? 'week'
                          : 'month'}{' '}
                      </span>
                      {analyticsItemsSold?.prev_total_items_sold}{' '}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
            <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
              <div>
                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-1">
                  Top Transactions Today
                </h6>
                <p className="antialiased font-sans text-sm leading-normal flex items-center gap-1 font-normal text-blue-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-4 w-4 text-blue-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <strong>30 done</strong> this month
                </p>
              </div>
            </div>
            <div className="p-6 overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        companies
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        budget
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        completion
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <div className="flex items-center gap-4">
                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                          Material XD Version
                        </p>
                      </div>
                    </td>

                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600">
                        $14,000
                      </p>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <div className="w-10/12">
                        <p className="antialiased font-sans mb-1 block text-xs font-medium text-blue-gray-600">
                          60%
                        </p>
                        <div className="flex flex-start bg-blue-gray-50 overflow-hidden w-full rounded-sm font-sans text-xs font-medium h-1">
                          <div
                            className="flex justify-center items-center h-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white"
                            style={{ width: '60%' }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <div className="flex items-center gap-4">
                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                          Add Progress Track
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600">
                        $3,000
                      </p>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <div className="w-10/12">
                        <p className="antialiased font-sans mb-1 block text-xs font-medium text-blue-gray-600">
                          10%
                        </p>
                        <div className="flex flex-start bg-blue-gray-50 overflow-hidden w-full rounded-sm font-sans text-xs font-medium h-1">
                          <div
                            className="flex justify-center items-center h-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white"
                            style={{ width: '10%' }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <div className="flex items-center gap-4">
                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                          Fix Platform Errors
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600">
                        Not set
                      </p>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <div className="w-10/12">
                        <p className="antialiased font-sans mb-1 block text-xs font-medium text-blue-gray-600">
                          100%
                        </p>
                        <div className="flex flex-start bg-blue-gray-50 overflow-hidden w-full rounded-sm font-sans text-xs font-medium h-1">
                          <div
                            className="flex justify-center items-center h-full bg-gradient-to-tr from-green-600 to-green-400 text-white"
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <div className="flex items-center gap-4">
                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                          Launch our Mobile App
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600">
                        $20,500
                      </p>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <div className="w-10/12">
                        <p className="antialiased font-sans mb-1 block text-xs font-medium text-blue-gray-600">
                          100%
                        </p>
                        <div className="flex flex-start bg-blue-gray-50 overflow-hidden w-full rounded-sm font-sans text-xs font-medium h-1">
                          <div
                            className="flex justify-center items-center h-full bg-gradient-to-tr from-green-600 to-green-400 text-white"
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <div className="flex items-center gap-4">
                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                          Add the New Pricing Page
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600">
                        $500
                      </p>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <div className="w-10/12">
                        <p className="antialiased font-sans mb-1 block text-xs font-medium text-blue-gray-600">
                          25%
                        </p>
                        <div className="flex flex-start bg-blue-gray-50 overflow-hidden w-full rounded-sm font-sans text-xs font-medium h-1">
                          <div
                            className="flex justify-center items-center h-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white"
                            style={{ width: '25%' }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <LineChart />
    </div>
  );
}

export default Dashboard;
