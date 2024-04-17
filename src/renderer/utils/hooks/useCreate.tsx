import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../axios';

const useCreate = () => {
  const [loading, setLoading] = useState(false);
  const storeID = useSelector((state: any) => state.appData.store?.id);

  const createData = async (url: string, payload: any, silent: boolean) => {
    if (!silent) {
      setLoading(true);
    }
    try {
      let response;
      if (url.includes('upload')) {
        const formData = new FormData();
        formData.append('file', payload);
        response = await api.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await api.post(url, { ...payload, store: storeID });
      }
      return { status: 200, data: response.data };
    } catch (err: any) {
      return { status: 400, data: err.response?.data };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    setLoading,
    createData,
  };
};

export default useCreate;
