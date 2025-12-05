class ErrorResponse {
  constructor(timestamp, status, error, message, path) {
    this.timestamp = timestamp;
    this.status = status;
    this.error = error;
    this.message = message;
    this.path = path;
  }

  static default() {
    return new ErrorResponse(
      new Date().toISOString(),
      503,
      "Máy chủ không phản hồi.",
      "Không thể kết nối tới máy chủ hoặc máy chủ không phản hồi.",
      window.location.pathname
    );
  }

  static fromAxiosError(error) {
    if (!error.response || !error.response.status) {
      return ErrorResponse.default();
    }

    return new ErrorResponse(
      error.response.data?.timestamp || new Date().toISOString(),
      error.response.data?.status || error.response?.status || 503,
      error.response.data?.error || "Máy chủ không phản hồi.",
      error.response.data?.message || "Không thể kết nối tới máy chủ hoặc máy chủ không phản hồi.",
      error.response.data?.path || window.location.pathname
    );
  }
}

import router from '@/router';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: baseUrl
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return {
      success: true,
      data: response.data
    };
  },
  (error) => {
    const errorResponse = ErrorResponse.fromAxiosError(error);

    if (errorResponse.status === 401 && !window.location.pathname.includes('/login')) {
      router.push({ name: 'login' });
    }

    return Promise.resolve({
      success: false,
      error: errorResponse
    });
  }
);
// ===================================================

export default api;

