import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';

export const useModels = () => {
  const [models, setModels] = useState([]);
  const [params, setParams] = useState({});

  const { loading, error, request, clearError } = useApi();

  const fetchModels = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      console.log()
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value);
        }
      });

      const data = await request({
        url: `/models?${queryParams}`,
        method: 'GET'
      });

      if (data.success) {
        setModels(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch models:', err);
    }
  }, [params, request]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const refresh = useCallback(() => {
    fetchModels();
  }, [fetchModels]);

  return {
    models,
    params,
    loading,
    error,
    updateParams,
    refresh,
    clearError
  };
};