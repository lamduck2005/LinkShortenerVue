import api from './axiosService';

export const getCurrentUser = () => {
  return api.get('/api/v1/users/me');
};

export const changePassword = (payload) => {
  return api.patch('/api/v1/users/me/password', payload);
};

export const changeEmail = (payload) => {
  return api.patch('/api/v1/users/me/email', payload);
};

const userService = {
  getCurrentUser,
  changePassword,
  changeEmail
};

export default userService;


