/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../components/viewComponents/chart/LineChart';
import { useFetch } from '../utils/hooks';
import {
  ArrowLeft,
  ArrowRight,
  BagSVG,
  CashSVG,
  ColorCirclesSVG,
  ErrorSVG,
  PersonSVG,
  ViewSVG,
} from '../utils/svg';
import { ConvertIntoDecimal } from '../utils/methods';
import BarChart from '../components/viewComponents/chart/BarChart';

function Dashboard() {
  // [info]: states
  const [analyticsSale, setAnalyticsSale] = useState<any>(null);
  const [analyticsCustomer, setAnalyticsCustomer] = useState<any>(null);
  const [analyticsItemsSold, setAnalyticsItemsSold] = useState<any>(null);
  const [analyticsTopTransactions, setAnalyticsTopTransactions] =
    useState<any>(null);
  const [topTransactionsChartData, setTopTransactionsChartData] = useState({
    data: [],
    label: [],
  });
  const [topCustomers, setTopCustomers] = useState<any>(null);
  const [topCustomersChartData, setTopCustomersChartData] = useState({
    data: [],
    label: [],
  });

  const [topProducts, setTopProducts] = useState<any>(null);
  const [topProductsChartData, setTopProductsChartData] = useState({
    data: [],
    label: [],
  });

  const [overallAnalyticsChartData, setOverallAnalyticsChartData] = useState({
    total_sales: [],
    no_of_customers: [],
    sale_volumn: [],
  });

  const [selectedButton, setSelectedButton] = useState({
    sale: 1,
    customer: 1,
    itemsSold: 1,
    topTransactions: 1,
    topCustomers: 1,
    topProducts: 1,
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

  const {
    loading: analyticsTopTransactionsLoading,
    fetchData: analyticsTopTransactionsFetch,
  } = useFetch();

  const {
    loading: analyticsTopCustomersLoading,
    fetchData: topCustomersFetch,
  } = useFetch();

  const { loading: topProductsLoading, fetchData: topProductsFetch } =
    useFetch();

  const { fetchData: overallAnalyticsFetch } = useFetch();

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

  const fetchAnalyticsTopTransactions = (days: number) => {
    analyticsTopTransactionsFetch(
      `/store/analytics/top-transactions/?days=${days}`,
    )
      .then((res) => {
        if (res.status === 200) {
          setAnalyticsTopTransactions(res?.data);
          const label = res.data.map(
            (transaction: any) => `order-${transaction.id}`,
          );
          const data = res.data.map((transaction: any) =>
            parseFloat(transaction.total),
          );
          setTopTransactionsChartData({
            data,
            label,
          });
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const fetchTopCustomers = (days: number) => {
    topCustomersFetch(`/store/analytics/top-customers/?days=${days}`)
      .then((res) => {
        if (res.status === 200) {
          setTopCustomers(res.data);
          const label = res.data.map(
            (customer: any) => customer.name || 'Walk-In',
          );
          const data = res.data.map((customer: any) =>
            parseFloat(customer.total_spent),
          );
          setTopCustomersChartData({
            data,
            label,
          });
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const fetchTopProducts = (days: number) => {
    topProductsFetch(`/store/analytics/top-products/?days=${days}`)
      .then((res) => {
        if (res.status === 200) {
          setTopProducts(res.data);
          const label = res.data.map((product: any) => {
            const name = product.name || 'NONE';
            return name.length > 10 ? name.slice(0, 10) + '...' : name;
          });
          const data = res.data.map((product: any) =>
            parseFloat(product.sold_amount),
          );
          setTopProductsChartData({
            data,
            label,
          });
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const fetchOverallAnalytics = () => {
    overallAnalyticsFetch(
      `/store/analytics/overall/?date=${new Date().toISOString().slice(0, 10)}`,
    )
      .then((res) => {
        if (res.status === 200) {
          setOverallAnalyticsChartData({
            no_of_customers: res.data.num_customers,
            total_sales: res.data.total_sale,
            sale_volumn: res.data.total_products_sold,
          });
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
    fetchAnalyticsTopTransactions(selectedButton.topTransactions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedButton.topTransactions]);

  useEffect(() => {
    fetchTopCustomers(selectedButton.topCustomers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedButton.topCustomers]);

  useEffect(() => {
    fetchTopProducts(selectedButton.topProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedButton.topProducts]);

  useEffect(() => {
    fetchOverallAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="w-full overflow-y-auto h-full">
      <div>
        <div className="px-4 md:px-6 pt-6 2xl:container">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <div className="col-span-1">
              <div className="h-full py-8 px-6 space-y-6 rounded-xl border border-gray-200 bg-white">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <h5 className="text-xl text-purple-800 font-medium">Sales</h5>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
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
                        ${ConvertIntoDecimal(analyticsSale?.total_sale || 0)}
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
                        <span>
                          {ConvertIntoDecimal(
                            analyticsSale?.percentage_change || 0,
                          )}
                          %
                        </span>
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
                      ${ConvertIntoDecimal(analyticsSale?.prev_total_sale || 0)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <div className="h-full py-8 px-6 space-y-6 rounded-xl border border-gray-200 bg-white">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <h5 className="text-xl text-purple-800 font-medium">
                    Customers
                  </h5>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
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
                        {analyticsCustomer?.total_customers || 0}
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
                        <span>
                          {ConvertIntoDecimal(
                            analyticsCustomer?.percentage_change || 0,
                          )}
                          %
                        </span>
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
                      {analyticsCustomer?.prev_total_customers || 0}{' '}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <div className="h-full py-8 px-6 space-y-6 rounded-xl border border-gray-200 bg-white">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <h5 className="text-xl text-purple-800 font-medium">
                    Sales Volumn
                  </h5>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
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
                        {analyticsItemsSold?.total_items_sold || 0}
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
                        <span>
                          {ConvertIntoDecimal(
                            analyticsItemsSold?.percentage_change || 0,
                          )}
                          %
                        </span>
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
                      {analyticsItemsSold?.prev_total_items_sold || 0}{' '}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 md:px-6 mt-20 flex flex-col xl:flex-row items-center justify-between">
        <div className="w-full lg:w-3/5">
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-3 w-full">
            <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
              <div className="flex flex-col md:flex-row items-center justify-between w-full">
                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-1">
                  Top Transactions{' '}
                  {selectedButton.topTransactions === 1
                    ? 'Today'
                    : selectedButton.topTransactions === 7
                    ? 'This Week'
                    : 'This Month'}
                </h6>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <button
                    type="button"
                    className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                      selectedButton.topTransactions === 1 &&
                      'opacity-70 border-blue-500 border-2'
                    }`}
                    disabled={selectedButton.topTransactions === 1}
                    onClick={() =>
                      setSelectedButton({
                        ...selectedButton,
                        topTransactions: 1,
                      })
                    }
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                      selectedButton.topTransactions === 7 &&
                      'opacity-70 border-blue-500 border-2'
                    }`}
                    disabled={selectedButton.topTransactions === 7}
                    onClick={() =>
                      setSelectedButton({
                        ...selectedButton,
                        topTransactions: 7,
                      })
                    }
                  >
                    This Week
                  </button>
                  <button
                    type="button"
                    className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                      selectedButton.topTransactions === 30 &&
                      'opacity-70 border-blue-500 border-2'
                    }`}
                    disabled={selectedButton.topTransactions === 30}
                    onClick={() =>
                      setSelectedButton({
                        ...selectedButton,
                        topTransactions: 30,
                      })
                    }
                  >
                    This Month
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Order ID
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Total
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Items Sold
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Action
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsTopTransactionsLoading ? (
                    <>
                      {[...Array(5).keys()].map((key) => (
                        <tr key={key}>
                          <td className="py-3 px-5 border-b border-blue-gray-50">
                            <div
                              className="h-2 w-16 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>

                          <td className="py-3 px-5 border-b border-blue-gray-50">
                            <div
                              className="h-2 w-16 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>
                          <td className="py-3 px-5 border-b border-blue-gray-50">
                            <div
                              className="h-2 w-16 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>
                          <td className="py-3 px-5 border-b border-blue-gray-50">
                            <div
                              className="h-2 w-16 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : analyticsTopTransactions?.length <= 0 ? (
                    <tr>
                      <td colSpan={4} className="pt-4 text-center">
                        <div className="flex items-center justify-center gap-2 my-2">
                          <ErrorSVG />
                          <h2 className="font-medium text-gray-800  ">
                            No Data Available
                          </h2>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    analyticsTopTransactions?.map((transactions: any) => (
                      <tr key={transactions.id}>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <div className="flex items-center gap-4">
                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                              {transactions.id}
                            </p>
                          </div>
                        </td>

                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600">
                            ${transactions.total}
                          </p>
                        </td>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <div className="w-4/6">
                            <p className="antialiased font-sans mb-1 block text-xs font-medium text-blue-gray-600">
                              {transactions.items.length}{' '}
                              {transactions.items.length > 1 ? 'items' : 'item'}{' '}
                              in cart
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <Link to={`/order/edit/${transactions.id}`}>
                            <button
                              type="button"
                              className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                            >
                              <ViewSVG />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <BarChart
          loading={analyticsTopTransactionsLoading}
          data={topTransactionsChartData}
          position="right"
        />
      </div>

      <div className="px-4 md:px-6 mt-20 flex flex-col xl:flex-row items-center justify-between">
        <BarChart
          loading={analyticsTopCustomersLoading}
          data={topCustomersChartData}
          position="left"
        />
        <div className="w-full lg:w-3/5 mt-4 md:mt-0">
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-3 w-full">
            <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
              <div className="flex flex-col md:flex-row items-center justify-between w-full">
                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-1">
                  Top Customers{' '}
                  {selectedButton.topCustomers === 1
                    ? 'Today'
                    : selectedButton.topCustomers === 7
                    ? 'This Week'
                    : 'This Month'}
                </h6>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <button
                    type="button"
                    className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                      selectedButton.topCustomers === 1 &&
                      'opacity-70 border-blue-500 border-2'
                    }`}
                    disabled={selectedButton.topCustomers === 1}
                    onClick={() =>
                      setSelectedButton({
                        ...selectedButton,
                        topCustomers: 1,
                      })
                    }
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                      selectedButton.topCustomers === 7 &&
                      'opacity-70 border-blue-500 border-2'
                    }`}
                    disabled={selectedButton.topCustomers === 7}
                    onClick={() =>
                      setSelectedButton({
                        ...selectedButton,
                        topCustomers: 7,
                      })
                    }
                  >
                    This Week
                  </button>
                  <button
                    type="button"
                    className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                      selectedButton.topCustomers === 30 &&
                      'opacity-70 border-blue-500 border-2'
                    }`}
                    disabled={selectedButton.topCustomers === 30}
                    onClick={() =>
                      setSelectedButton({
                        ...selectedButton,
                        topCustomers: 30,
                      })
                    }
                  >
                    This Month
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Customer ID
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Name
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Email
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Amount Spent
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Action
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsTopCustomersLoading ? (
                    <>
                      {[...Array(5).keys()].map((key) => (
                        <tr key={key}>
                          <td className="py-3 px-5 border-b border-blue-gray-50">
                            <div
                              className="h-2 w-16 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>

                          <td className="py-3 px-5 border-b border-blue-gray-50">
                            <div
                              className="h-2 w-16 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>
                          <td className="py-3 px-5 border-b border-blue-gray-50">
                            <div
                              className="h-2 w-16 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>
                          <td className="py-3 px-5 border-b border-blue-gray-50">
                            <div
                              className="h-2 w-16 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>
                          <td className="py-3 px-5 border-b border-blue-gray-50">
                            <div
                              className="h-2 w-16 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : topCustomers?.length <= 0 ? (
                    <tr>
                      <td colSpan={5} className="pt-4 text-center">
                        <div className="flex items-center justify-center gap-2 my-2">
                          <ErrorSVG />
                          <h2 className="font-medium text-gray-800  ">
                            No Data Available
                          </h2>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    topCustomers?.map((customer: any) => (
                      <tr key={customer.id}>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <div className="flex items-center gap-4">
                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                              {customer.id}
                            </p>
                          </div>
                        </td>

                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600">
                            {customer.name || 'Walk-In'}
                          </p>
                        </td>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <div className="w-4/6">
                            <p className="antialiased font-sans mb-1 block text-xs font-medium text-blue-gray-600">
                              {customer.email || 'None'}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <div className="w-4/6">
                            <p className="antialiased font-sans mb-1 block text-xs font-medium text-blue-gray-600">
                              $
                              {ConvertIntoDecimal(customer.total_spent) ||
                                'None'}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <Link to={`/customer/edit/${customer.id}`}>
                            <button
                              type="button"
                              className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                            >
                              <ViewSVG />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 mt-20 flex flex-col xl:flex-row items-center justify-between">
        <div className="w-full lg:w-3/5">
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-3 w-full">
            <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
              <div className="flex flex-col md:flex-row items-center justify-between w-full">
                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-1">
                  Top Products{' '}
                  {selectedButton.topProducts === 1
                    ? 'Today'
                    : selectedButton.topProducts === 7
                    ? 'This Week'
                    : 'This Month'}
                </h6>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <button
                    type="button"
                    className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                      selectedButton.topProducts === 1 &&
                      'opacity-70 border-blue-500 border-2'
                    }`}
                    disabled={selectedButton.topProducts === 1}
                    onClick={() =>
                      setSelectedButton({
                        ...selectedButton,
                        topProducts: 1,
                      })
                    }
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                      selectedButton.topProducts === 7 &&
                      'opacity-70 border-blue-500 border-2'
                    }`}
                    disabled={selectedButton.topProducts === 7}
                    onClick={() =>
                      setSelectedButton({
                        ...selectedButton,
                        topProducts: 7,
                      })
                    }
                  >
                    This Week
                  </button>
                  <button
                    type="button"
                    className={`bg-slate-50 px-2 py-1 rounded-lg border text-sm ${
                      selectedButton.topProducts === 30 &&
                      'opacity-70 border-blue-500 border-2'
                    }`}
                    disabled={selectedButton.topProducts === 30}
                    onClick={() =>
                      setSelectedButton({
                        ...selectedButton,
                        topProducts: 30,
                      })
                    }
                  >
                    This Month
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Product ID
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Name
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Sales volumn
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Action
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topProductsLoading ? (
                    <>
                      {[...Array(5).keys()].map((key) => (
                        <tr key={key}>
                          <td className="py-3 px-5 border-b border-blue-gray-50">
                            <div
                              className="h-2 w-16 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>

                          <td className="py-3 px-5 border-b border-blue-gray-50">
                            <div
                              className="h-2 w-16 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>
                          <td className="py-3 px-5 border-b border-blue-gray-50">
                            <div
                              className="h-2 w-16 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>
                          <td className="py-3 px-5 border-b border-blue-gray-50">
                            <div
                              className="h-2 w-16 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : topProducts?.length <= 0 ? (
                    <tr>
                      <td colSpan={4} className="pt-4 text-center">
                        <div className="flex items-center justify-center gap-2 my-2">
                          <ErrorSVG />
                          <h2 className="font-medium text-gray-800  ">
                            No Data Available
                          </h2>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    topProducts?.map((product: any) => (
                      <tr key={product.id}>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <div className="flex items-center gap-4">
                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                              {product.product_id}
                            </p>
                          </div>
                        </td>

                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600">
                            {product.name}
                          </p>
                        </td>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <div className="w-4/6">
                            <p className="antialiased font-sans mb-1 block text-xs font-medium text-blue-gray-600">
                              {product.sold_amount}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <Link to={`/order/edit/${product.id}`}>
                            <button
                              type="button"
                              className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                            >
                              <ViewSVG />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <BarChart
          loading={topProductsLoading}
          data={topProductsChartData}
          position="right"
        />
      </div>

      <div className="px-4 md:px-10 pb-5 mt-20">
        <div className="flex items-center justify-end gap-2 py-5">
          <button type="button" className="bg-slate-50 p-2 rounded-full">
            <ArrowLeft />
          </button>
          <button
            type="button"
            className="bg-slate-50 px-2 py-1 rounded-lg border text-sm"
          >
            This Month
          </button>
          <button type="button" className="bg-slate-50 p-2 rounded-full">
            <ArrowRight />
          </button>
        </div>
        <LineChart data={overallAnalyticsChartData} />
      </div>
    </div>
  );
}

export default Dashboard;
