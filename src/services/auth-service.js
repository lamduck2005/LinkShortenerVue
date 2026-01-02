import { ref } from 'vue';
import api from './axios-service';

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_INFO_KEY = 'userInfo';

const isAuthenticated = ref(!!localStorage.getItem(ACCESS_TOKEN_KEY));

const setToken = (token, userInfo = null) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    if (userInfo) {
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
    }
    isAuthenticated.value = true;
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    isAuthenticated.value = false;
  }
};

const getToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

const getUserInfo = () => {
  const userInfoStr = localStorage.getItem(USER_INFO_KEY);
  if (!userInfoStr) return null;
  try {
    return JSON.parse(userInfoStr);
  } catch {
    return null;
  }
};

const setUserInfo = (userInfo) => {
  if (userInfo) {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  } else {
    localStorage.removeItem(USER_INFO_KEY);
  }
};

const logout = () => {
  setToken(null);
};

const getUsername = () => {
  const userInfo = getUserInfo();
  return userInfo?.username || null;
};

const getRolesFromToken = () => {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.roles) return [];
  return Array.isArray(userInfo.roles) ? userInfo.roles : [userInfo.roles];
};

const isAdmin = () => {
  const roles = getRolesFromToken();
  return roles.includes('ROLE_ADMIN');
};

const signup = (payload) => {
  return api.post('/api/v1/auth/signup', payload);
};

const login = (payload) => {
  return api.post('/api/v1/auth/login', payload);
};

const getOAuth2GoogleUrl = () => {
  return import.meta.env.VITE_BASE_URL + '/oauth2/authorization/google';
};

const getOAuth2GoogleUserinfo = () => {
  return api.get('/api/v1/auth/oauth2/userinfo',
    {
      withCredentials: true,
    }
  );
};

const authService = {
  signup,
  login,
  logout,
  setToken,
  getToken,
  getUserInfo,
  setUserInfo,
  getRolesFromToken,
  getUsername,
  isAdmin,
  isAuthenticated,
  getOAuth2GoogleUrl,
  getOAuth2GoogleUserinfo,
};

export default authService;


