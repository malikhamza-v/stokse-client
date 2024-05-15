import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../axios';
import { constructURLWithStoreParam } from '../methods';

const useRemove = () => {
  const [loading, setLoading] = useState(false);
  const storeID = useSelector((state: any) => state.appData.store?.id);
  const businessID = useSelector((state: any) => state.appData.business?.id);

  const removeData = async (url: string, silent: boolean) => {
    if (!silent) {
      setLoading(true);
    }
    try {
      const urlWithStoreParam = constructURLWithStoreParam(
        url,
        storeID,
        businessID,
      );
      const response = await api.delete(urlWithStoreParam);
      return { status: 204, data: response.data };
    } catch (err: any) {
      return { status: 400, data: err.response?.data };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    removeData,
  };
};

export default useRemove;
