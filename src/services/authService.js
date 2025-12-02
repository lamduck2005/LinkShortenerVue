import { ref } from 'vue';
import api from './axiosService';

const ACCESS_TOKEN_KEY = 'accessToken';

const isAuthenticated = ref(!!localStorage.getItem(ACCESS_TOKEN_KEY));

const setToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    isAuthenticated.value = true;
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    isAuthenticated.value = false;
  }
};

const getToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

const logout = () => {
  setToken(null);
};

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const getUsernameFromToken = () => {
  const token = getToken();
  if (!token) return null;
  const payload = parseJwt(token);
  if (!payload) return null;
  return payload.sub || payload.username || null;
};

const signup = (payload) => {
  return api.post('/api/v1/auth/signup', payload);
};

const login = (payload) => {
  return api.post('/api/v1/auth/login', payload);
};

const authService = {
  signup,
  login,
  logout,
  setToken,
  getToken,
  getUsernameFromToken,
  isAuthenticated,
};

export default authService;


