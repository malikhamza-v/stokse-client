import { useEffect, useState } from 'react';
import { BackButton } from '../../components/commonComponents/buttons';
import { useCreate, useEdit, useFetch } from '../../utils/hooks';
import { convertTime, getYYMMDD } from '../../utils/methods';
import { SelectInput } from '../../components/commonComponents/inputs';

interface Currency {
  id: number;
  symbol: string;
  label: string;
  position: string;
}

const SettingCard = ({ header, body }: { header: any; body: any }) => {
  return (
    <div className="mt-8 border rounded-lg flex flex-col gap-6">
      <div className="border-b border-gray-200 py-4">{header}</div>
      <div className="py-4 px-6">{body}</div>
    </div>
  );
};

function Store() {
  const [storeCreatedAt, setStoreCreatedAt] = useState();
  const [userInput, setUserInput] = useState({
    currency: ''
  })
  const [editStates, setEditStates] = useState<{ currency: Boolean }>({
    currency: false,
  });

  const {
    data: storeSettings,
    loading: storeSettingsLoading,
    fetchData: fetchStoreSettings,
  } = useFetch();

  const {
    data: allCurrencies,
    loading: allCurrenciesLoading,
    fetchData: fetchAllCurrencies,
  } = useFetch();

  const {editData: saveStoreSettings, loading: saveStoreSettingsLoading} = useEdit()

  // [info]: methods
  
  const handleUserInput = (key:string, value:string|number)=>{
    setUserInput({...userInput, [key]:value})
  }

  const handleSaveStoreSettings = ()=>{
const payload  = {
  name:storeData.name,
  description:storeData.description,
  city:storeData.city,
  country:storeData.country,
  address:storeData.address,
  phone:storeData.phone,
  email:storeData.email,
  // currency: userInput.currency
}

console.log("check store data", storeData)
    saveStoreSettings('/store/', payload, false)
  }
  
  const handleEdit = (type: keyof typeof editStates) => {
    const handleFetchCurrencies = () => {
      setUserInput({...userInput, currency: storeData.currency.id})
      fetchAllCurrencies('/universal/currencies');
    };


    if (!editStates.currency && type === 'currency') {
      handleFetchCurrencies();
    }else if(editStates.currency && type === 'currency'){
      handleSaveStoreSettings()
    }
    setEditStates({ ...editStates, [type]: !editStates[type] });
  };

  useEffect(() => {
    fetchStoreSettings('store/');
  }, []);

  useEffect(() => {
    if (storeSettings?.data?.created_at)
      setStoreCreatedAt(getYYMMDD(new Date(storeSettings.data.created_at)));
  }, [storeSettings?.data?.created_at]);

  const { data: storeData } = storeSettings || {};
  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-16 pt-16">
        <BackButton />
      </div>

      {storeData && (
        <div className="px-4 md:px-16 pb-24 md:pb-8 grid grid-cols-2 gap-4">
          <div className=" col-span-2">
            <SettingCard
              header={
                <div className="px-4 flex items-center justify-between">
                  <p className="text-xl font-medium">Store Details</p>
                  <button className="btn btn-sm btn-outline">Edit</button>
                </div>
              }
              body={
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
                    {storeSettings?.data?.created_at && storeCreatedAt ? (
                      <p className="text-gray-500">
                        Created On:{' '}
                        {`${storeCreatedAt.dayOfWeek}, ${storeCreatedAt.day} ${storeCreatedAt.month} ${storeCreatedAt.year}`}
                      </p>
                    ) : null}
                  </div>
                </div>
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 col-span-2 gap-8">
            <SettingCard
              header={
                <div className="px-4 flex items-center justify-between">
                  <p className="text-xl font-medium">Store Contact</p>
                  <button className="btn btn-sm btn-outline">Edit</button>
                </div>
              }
              body={
                <div className="flex items-center gap-6">
                  <div>
                    <p className="font-bold text-2xl">
                      {storeSettings?.data?.phone}
                    </p>
                    <p>{storeSettings?.data?.email}</p>
                  </div>
                </div>
              }
            />

            <SettingCard
              header={
                <div className="px-4 flex items-center justify-between">
                  <p className="text-xl font-medium">Store Timings</p>
                  <button className="btn btn-sm btn-outline">Edit</button>
                </div>
              }
              body={
                <>
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
                    {storeSettings?.data?.from_day} —{' '}
                    {storeSettings?.data?.to_day}
                  </p>
                </>
              }
            />

            <SettingCard
              header={
                <div className="px-4 flex items-center justify-between">
                  <p className="text-xl font-medium">Store Currency</p>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleEdit('currency')}
                  >
                    {editStates.currency? 'Save':'Edit'}
                  </button>
                </div>
              }
              body={
                <div>
                  {editStates.currency ? (
                    <div>
                      <SelectInput
                        id="store_currency"
                        options={
                          allCurrencies?.data?.map((currency: Currency) => ({
                            label: `${currency.symbol} ${currency.label}`,
                            value: currency.id,
                          })) || []
                        }
                        selectedValue={userInput.currency}
                        handleChange={(e) => handleUserInput('currency', e)}
                        errorMessage=""
                        isLoading={allCurrenciesLoading}
                        label={null}
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-2xl">
                        {storeData.currency?.symbol} {storeData.currency?.label}
                      </p>
                    </div>
                  )}
                </div>
              }
            />

            <SettingCard
              header={
                <div className="px-4 flex items-center justify-between">
                  <p className="text-xl font-medium">Store Location</p>
                  <button className="btn btn-sm btn-outline">Edit</button>
                </div>
              }
              body={
                <div>
                  <p className="font-bold text-2xl">City</p>
                  <p>Country</p>
                  <p>Address</p>
                </div>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Store;
