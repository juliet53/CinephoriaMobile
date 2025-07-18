import axios from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'https://cinephoriaappj-2943b0896e8f.herokuapp.com/api',
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('token');
      router.replace('/logout-auto');
    }
    return Promise.reject(error);
  }
);

export default api;
