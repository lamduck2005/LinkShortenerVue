import api from "./axios-service";

export const createSnippet = (snippetData) => {
    return api.post('/api/v1/snippets', snippetData);
};

export const getSnippetContent = (shortCode) => {
    return api.get(`/api/v1/snippets/${shortCode}`);
};

export const unlockSnippet = (shortCode, password) => {
    return api.post(`/api/v1/snippets/${shortCode}/unlock`, { password });
};

export const getMySnippets = (page = 0, size = 10) => {
    return api.get(`/api/v1/snippets/me?page=${page}&size=${size}`);
};

export const deleteSnippet = (id) => {
    return api.delete(`/api/v1/snippets/${id}`);
};

export const updateSnippetPassword = (id, newPassword) => {
    return api.patch(`/api/v1/snippets/${id}/password`, { newPassword });
};

export const updateSnippetExpiresAt = (id, newExpiresAt) => {
    return api.patch(`/api/v1/snippets/${id}/expires-at`, { newExpiresAt });
};

export const getSnippetClicks = (id) => {
    return api.get(`/api/v1/snippets/${id}/clicks`);
};

const snippetService = {
    createSnippet,
    getSnippetContent,
    unlockSnippet,
    getMySnippets,
    deleteSnippet,
    updateSnippetPassword,
    updateSnippetExpiresAt,
    getSnippetClicks
};

export default snippetService;
