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

const snippetService = {
    createSnippet,
    getSnippetContent,
    unlockSnippet
};

export default snippetService;
