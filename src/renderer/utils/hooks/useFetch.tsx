import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../axios';
import { constructURLWithStoreParam } from '../methods';

const useFetch = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const storeID = useSelector((state: any) => state.appData.store?.id);
  const businessID = useSelector((state: any) => state.appData.business?.id);

  const fetchData = async (url: string) => {
    setLoading(true);
    try {
      const urlWithStoreParam = constructURLWithStoreParam(
        url,
        storeID,
        businessID,
      );
      const response = await api.get(urlWithStoreParam);
      setData(response);
      return { status: 200, data: response.data };
    } catch (error: any) {
      if (error.response.status === 403) {
        localStorage.clear();
      }
      return { status: 500 };
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    fetchData,
  };
};

export default useFetch;
