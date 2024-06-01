import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../axios';
import { constructURLWithStoreParam } from '../methods';

const useEdit = () => {
  const [loading, setLoading] = useState(false);
  const storeID = useSelector((state: any) => state.app.store?.id);

  const editData = async (url: string, payload: any, silent: boolean) => {
    if (!silent) {
      setLoading(true);
    }
    try {
      const urlWithStoreParam = constructURLWithStoreParam(url, storeID);
      const response = await api.put(urlWithStoreParam, payload);
      return { status: 200, data: response.data };
    } catch (err: any) {
      return { status: 400, data: err.response?.data };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    editData,
  };
};

export default useEdit;
