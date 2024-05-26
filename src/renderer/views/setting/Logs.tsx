import { useEffect, useState } from 'react';
import { BackButton } from '../../components/commonComponents/buttons';
import { useFetch } from '../../utils/hooks';
import { ErrorSVG, SearchSVG, ViewSVG } from '../../utils/svg';
import { formatTimestamp } from '../../utils/methods';
import { useNavigate } from 'react-router-dom';

interface Activity {
  action: string;
  description: string;
  id: number;
  module: string;
  module_id: number;
  store: number;
  timestamp: string;
  user: number;
}

function Logs() {
  let currentUrl = '/store/activity/?page_size=1';

  const { loading: activityFetchLoading, fetchData: activityFetch } =
    useFetch();

  const [activities, setActivities] = useState<{
    current_page: number;
    items_per_page: number;
    next: string | null;
    previous: string | null;
    results: Activity[];
    total_pages: number;
  } | null>(null);
  const navigate = useNavigate();

  // [methods]:
  const handlePagination = (direction: string) => {
    if (activities) {
      if (direction === 'next') {
        const [, url]: any = activities.next && activities.next.split('api');
        currentUrl = url;
        fetchActivity(currentUrl);
      } else {
        const [, url]: any =
          activities.previous && activities.previous.split('api');
        currentUrl = url;
        fetchActivity(currentUrl);
      }
    }
  };

  const handleViewActivity = (activity: Activity) => {
    if (activity.module === 'category') {
      navigate('/setting/categories');
    } else if (activity.module === 'product') {
      navigate(`/inventory/view/${activity.module_id}`);
    }
  };

  const fetchActivity = (url: string) => {
    activityFetch(url)
      .then((res) => {
        if (res?.status === 200) {
          console.log('res', res);
          setActivities(res.data);
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  useEffect(() => {
    fetchActivity(currentUrl);
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-16 pt-16">
        <BackButton />
      </div>
      <div className="px-16 py-8 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl">App Logs</h2>
          <p className="text-gray-500">View all activites on your store.</p>
        </div>
        <div className="relative flex items-center mt-4 md:mt-0">
          <span className="absolute">
            <SearchSVG />
          </span>

          <input
            type="text"
            placeholder="Search by payment method"
            className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          />
        </div>
      </div>

      <div className="px-16 pt-8 grid grid-cols-2 gap-4 overflow-y-auto">
        <div className="col-span-2">
          {activityFetchLoading ? (
            [...Array(5).keys()].map((key) => {
              return (
                <div className="w-full" key={key}>
                  <div
                    className="w-full h-10 bg-gray-200 rounded-lg animate-pulse mb-2"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              );
            })
          ) : activities && activities?.results?.length > 0 ? (
            activities?.results?.map((activity) => {
              return (
                <div key={activity.id}>
                  <div className="border flex items-center justify-between p-4 rounded-lg mb-2">
                    <div className="flex flex-col gap-1">
                      <p>{activity.description}</p>
                      <p className="text-gray-500">
                        {formatTimestamp(activity.timestamp)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg  hover:bg-gray-100"
                        onClick={() => handleViewActivity(activity)}
                      >
                        <ViewSVG />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="border flex items-center justify-center gap-2 p-4 rounded-lg mb-2">
              <ErrorSVG />
              <h2 className="font-medium text-gray-800  ">No activity found</h2>
            </div>
          )}
        </div>
      </div>

      <div className="px-16 py-8 mt-auto sm:flex sm:items-center sm:justify-between ">
        <div className="text-sm text-gray-500 ">
          Page{' '}
          <span className="font-medium text-gray-700 ">
            {activities?.current_page.toString()} of {activities?.total_pages}
          </span>
        </div>

        <div className="flex items-center mt-4 gap-x-4 sm:mt-0">
          <button
            type="button"
            onClick={() => handlePagination('previous')}
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100"
            disabled={(activities?.current_page || 1) < 2}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>

            <span>previous</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100"
            onClick={() => handlePagination('next')}
            disabled={
              (activities?.current_page || 1) >= (activities?.total_pages || 0)
            }
          >
            <span>Next</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logs;
