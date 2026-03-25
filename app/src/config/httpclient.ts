import axios, {Axios} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from './apiConfig';

const loggingEnabled = true; // Set this to false to disable logging

const httpAxiosClient: Axios = axios.create({
  baseURL: API_URL,
  headers: {'Content-Type': 'application/json'},
});

httpAxiosClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (loggingEnabled) {
      console.log('Token in interceptor:', token);
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (loggingEnabled) {
      console.log(
        `[${new Date().toISOString()}] Request: ${config.method?.toUpperCase()} ${
          API_URL + config.url
        }`,
      );
    }
    return config;
  },
  error => {
    if (loggingEnabled) {
      console.error(`[${new Date().toISOString()}] Request Error:`, error);
    }
    return Promise.reject(error);
  },
);

// Response interceptor for handling errors
httpAxiosClient.interceptors.response.use(
  response => {
    if (loggingEnabled) {
      console.log(
        `[${new Date().toISOString()}] Response: ${response.status} ${
          response.config.url
        }`,
      );
    }
    return response;
  },
  async error => {
    if (loggingEnabled) {
      console.error(`[${new Date().toISOString()}] Response Error:`, error);
    }
    if (error.response && error.response.status === 401) {
      console.log('Logging out due to 401 error');
      doLogout();
    }
    return Promise.reject(error);
  },
);

// Logout function
const doLogout = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    return true;
  } catch (error) {
    throw new Error('Failed to logout');
  }
};

export default httpAxiosClient;
