import api from './axiosService';

export const getAdminSnippets = (params = {}) => {
  const {
    page = 0,
    size = 10,
    userId,
    shortCode,
    hasPassword,
    expired,
  } = params;

  const searchParams = new URLSearchParams();
  searchParams.set('page', String(page));
  searchParams.set('size', String(size));
  if (userId !== undefined && userId !== null && userId !== '') {
    searchParams.set('userId', String(userId));
  }
  if (shortCode) {
    searchParams.set('shortCode', shortCode);
  }
  if (hasPassword !== undefined && hasPassword !== null && hasPassword !== '') {
    searchParams.set('hasPassword', String(hasPassword));
  }
  if (expired !== undefined && expired !== null && expired !== '') {
    searchParams.set('expired', String(expired));
  }

  return api.get(`/api/v1/admin/snippets?${searchParams.toString()}`);
};

export const getAdminSnippetDetail = (id) => {
  return api.get(`/api/v1/admin/snippets/${id}`);
};

export const deleteAdminSnippet = (id) => {
  return api.delete(`/api/v1/admin/snippets/${id}`);
};

export const updateAdminSnippetExpiresAt = (id, newExpiresAt) => {
  return api.patch(`/api/v1/admin/snippets/${id}/expires-at`, { newExpiresAt });
};

export const updateAdminSnippetPassword = (id, newPassword) => {
  return api.patch(`/api/v1/admin/snippets/${id}/password`, { newPassword });
};

const adminSnippetService = {
  getAdminSnippets,
  getAdminSnippetDetail,
  deleteAdminSnippet,
  updateAdminSnippetExpiresAt,
  updateAdminSnippetPassword,
};

export default adminSnippetService;


