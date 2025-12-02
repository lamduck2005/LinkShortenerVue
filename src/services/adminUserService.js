import api from './axiosService';

/**
 * Lấy danh sách user cho admin (phân trang)
 * GET /api/v1/admin/users?page=0&size=10
 */
export const getAdminUsers = (page = 0, size = 10) => {
  return api.get(`/api/v1/admin/users?page=${page}&size=${size}`);
};

export const createAdminUser = (payload) => {
  return api.post('/api/v1/admin/users', payload);
};

export const updateAdminUser = (id, payload) => {
  return api.patch(`/api/v1/admin/users/${id}`, payload);
};

const adminUserService = {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
};

export default adminUserService;


