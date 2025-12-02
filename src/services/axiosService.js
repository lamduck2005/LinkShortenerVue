import axios from 'axios';

// Lấy Base URL từ file .env (Ví dụ: VITE_BASE_URL=http://localhost:8080)
const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: baseUrl
});

// === CẤU HÌNH INTERCEPTOR REQUEST (GẮN JWT NẾU CÓ) ===
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === CẤU HÌNH INTERCEPTOR (XỬ LÝ LỖI TẬP TRUNG) ===
api.interceptors.response.use(
  (response) => {
    return {
      success: true,
      data: response.data
    };
  },
  (error) => {
    return Promise.resolve({
      success: false,
      error: error.response?.data || {
        status: 503,
        error: "Service Unavailable",
        message: "Không thể kết nối tới máy chủ hoặc máy chủ không phản hồi."
      }
    });
  }
);
// ===================================================

export default api;
