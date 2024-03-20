import { useState } from 'react';
import api from '../axios';

const useEdit = () => {
  const [loading, setLoading] = useState(false);

  const editData = async (url: string, payload: any, silent: boolean) => {
    if (!silent) {
      setLoading(true);
    }
    try {
      const response = await api.put(url, payload);
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
