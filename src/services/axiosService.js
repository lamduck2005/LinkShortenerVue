import axios from 'axios';

// Lấy Base URL từ file .env (Ví dụ: VITE_BASE_URL=http://localhost:8080)
const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: baseUrl
});

// === CẤU HÌNH INTERCEPTOR (XỬ LÝ LỖI TẬP TRUNG) ===
api.interceptors.response.use(
  
  /**
   * onFulfilled (Hàm chạy khi Backend trả về 2xx - Thành công)
   * * Nó nhận response gốc và bọc lại thành cấu trúc chuẩn của
   * frontend.
   */
  (response) => {
    return {
      success: true,
      data: response.data 
      // response.data là JSON { id, shortUrl, ... }
    };
  },
  
  /**
   * onRejected (Hàm chạy khi Backend trả về 4xx, 5xx - Lỗi)
   * * Nó "bắt" (catch) lỗi mà Axios ném ra, và bọc nó
   * lại thành một response thành công (để await không bị văng lỗi)
   * nhưng mang cờ "success: false".
   */
  (error) => {
    return Promise.resolve({ // Dùng Promise.resolve để component không bị crash
      success: false,
      error: error.response?.data || { 
        status: 503, 
        error: "Service Unavailable", 
        message: "Không thể kết nối tới máy chủ hoặc máy chủ không phản hồi." 
      }
      // error.response.data là JSON { timestamp, status, error, ... }
    });
  }
);
// ===================================================

export default api;
