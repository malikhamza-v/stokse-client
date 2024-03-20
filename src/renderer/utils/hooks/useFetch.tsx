import { useState } from 'react';
import api from '../axios';

const useFetch = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = async (url: string) => {
    setLoading(true);
    try {
      const response = await api.get(url);
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
