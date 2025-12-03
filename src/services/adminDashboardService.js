import api from './axiosService';

export const getAdminDashboard = (days) => {
  if (days && Number(days) > 0) {
    return api.get(`/api/v1/admin/dashboard?days=${days}`);
  }
  return api.get('/api/v1/admin/dashboard');
};

const adminDashboardService = {
  getAdminDashboard,
};

export default adminDashboardService;


