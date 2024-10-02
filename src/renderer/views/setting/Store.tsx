import { useEffect, useState } from 'react';
import { BackButton } from '../../components/commonComponents/buttons';
import { useFetch } from '../../utils/hooks';
import {
  convertTime,
  formatDateIntoYYMMDD,
  getYYMMDD,
} from '../../utils/methods';

function Store() {
  const [storeCreatedAt, setStoreCreatedAt] = useState();
  const {
    data: storeSettings,
    loading: storeSettingsLoading,
    fetchData: fetchStoreSettings,
  } = useFetch();

  useEffect(() => {
    fetchStoreSettings('store/');
  }, []);

  useEffect(() => {
    if (storeSettings?.data?.created_at) {
    }
    setStoreCreatedAt(getYYMMDD(new Date(storeSettings?.data?.created_at)));
  }, [storeSettings?.data?.created_at]);
  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-16 pt-16">
        <BackButton />
      </div>

      <div className="px-16 grid grid-cols-2 gap-4">
        <div className="mt-8 border rounded-lg flex flex-col gap-6">
          <div className="border-b border-gray-200 py-4">
            <div className="px-4 flex items-center justify-between">
              <p className="text-xl font-medium">Store Details</p>
              <button className="btn btn-sm btn-outline">Edit</button>
            </div>
          </div>
          <div className="py-4 px-6">
            <div className="flex items-center gap-6">
              <div>
                <div className="avatar">
                  <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                  </div>
                </div>
              </div>

              <div>
                <p className="font-bold text-2xl">
                  {storeSettings?.data?.name || 'None'}
                </p>
                {storeSettings?.data?.created_at ? (
                  <p className="text-gray-500">
                    Created On:{' '}
                    {`${storeCreatedAt.dayOfWeek}, ${storeCreatedAt.day} ${storeCreatedAt.month} ${storeCreatedAt.year}`}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border rounded-lg flex flex-col gap-6">
          <div className="border-b border-gray-200 py-4">
            <div className="px-4 flex items-center justify-between">
              <p className="text-xl font-medium">Store Timings</p>
              <button className="btn btn-sm btn-outline">Edit</button>
            </div>
          </div>
          <div className="py-4 px-6">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <p className="">Opening</p>
                <p className="text-gray-500">
                  {convertTime(
                    `1970-10-10 ${storeSettings?.data?.opening_time}`,
                    '12',
                  )}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <p className="">Closing</p>
                {convertTime(
                  `1970-10-10 ${storeSettings?.data?.closing_time}`,
                  '12',
                )}{' '}
              </div>
            </div>
            <p className="text-gray-500 text-center mt-4 text-xl">
              {storeSettings?.data?.from_day} — {storeSettings?.data?.to_day}
            </p>
          </div>
        </div>

        <div className="mt-8 border rounded-lg flex flex-col gap-6">
          <div className="border-b border-gray-200 py-4">
            <div className="px-4 flex items-center justify-between">
              <p className="text-xl font-medium">Store Currency</p>
              <button className="btn btn-sm btn-outline">Edit</button>
            </div>
          </div>
          <div className="py-4 px-6">
            <div className="flex items-center gap-6">
              <div>
                <p className="font-bold text-2xl">USD</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border rounded-lg flex flex-col gap-6">
          <div className="border-b border-gray-200 py-4">
            <div className="px-4 flex items-center justify-between">
              <p className="text-xl font-medium">Store Contact</p>
              <button className="btn btn-sm btn-outline">Edit</button>
            </div>
          </div>
          <div className="py-4 px-6">
            <div className="flex items-center gap-6">
              <div>
                <p className="font-bold text-2xl">+1 (555) 123-4567</p>
                <p>info@gourmetdelights.com</p>
                <p>gourmetdelights</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border rounded-lg flex flex-col gap-6 col-span-2">
          <div className="border-b border-gray-200 py-4">
            <div className="px-4 flex items-center justify-between">
              <p className="text-xl font-medium">Store Location</p>
              <button className="btn btn-sm btn-outline">Edit</button>
            </div>
          </div>
          <div className="py-4 px-6">
            <div className="flex items-center gap-6">
              <div>
                <p className="font-bold text-2xl">City</p>
                <p>Country</p>
                <p>Address</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Store;
