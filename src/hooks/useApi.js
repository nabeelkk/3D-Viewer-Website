import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_BASE } from '../utils/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000, // 30 seconds
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api(config);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Something went wrong';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    loading,
    error,
    request,
    clearError
  };
};