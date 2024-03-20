import { useState } from 'react';
import api from '../axios';

const useRemove = () => {
  const [loading, setLoading] = useState(false);

  const removeData = async (url: string, silent: boolean) => {
    if (!silent) {
      setLoading(true);
    }
    try {
      const response = await api.delete(url);
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
