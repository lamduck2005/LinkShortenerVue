import api from "./axiosService";

/**
 * Gọi API để tạo một Snippet mới.
 * Hàm này LUÔN trả về Promise giải quyết ra:
 * { success: true, data: CreateSnippetResponse } 
 * HOẶC 
 * { success: false, error: ErrorResponse }
 */
export const createSnippet = (snippetData) => {
    return api.post('/api/v1/snippets', snippetData);
};

/**
 * Lấy nội dung snippet (cho luồng redirect của Vue)
 */
export const getSnippetContent = (shortCode) => {
    return api.get(`/api/v1/snippets/${shortCode}`);
};

/**
 * Gửi mật khẩu để mở khóa
 */
export const unlockSnippet = (shortCode, password) => {
    return api.post('/api/v1/unlock', { shortCode, password });
};

/**
 * Lấy danh sách snippet của user hiện tại (có phân trang)
 */
export const getMySnippets = (page = 0, size = 10) => {
    return api.get(`/api/v1/snippets/me?page=${page}&size=${size}`);
};

/**
 * Xóa snippet theo id (chỉ cho owner)
 */
export const deleteSnippet = (id) => {
    return api.delete(`/api/v1/snippets/${id}`);
};

/**
 * Cập nhật mật khẩu snippet
 */
export const updateSnippetPassword = (id, newPassword) => {
    return api.patch(`/api/v1/snippets/${id}/password`, { newPassword });
};

/**
 * Cập nhật thời gian hết hạn snippet
 */
export const updateSnippetExpiresAt = (id, newExpiresAt) => {
    return api.patch(`/api/v1/snippets/${id}/expires-at`, { newExpiresAt });
};

const snippetService = {
    createSnippet,
    getSnippetContent,
    unlockSnippet,
    getMySnippets,
    deleteSnippet,
    updateSnippetPassword,
    updateSnippetExpiresAt
};

export default snippetService;
