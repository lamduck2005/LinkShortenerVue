
/**
 * Trả về một object rỗng, chuẩn cho form tạo Snippet.
 * Khớp với CreateSnippetRequest DTO của Backend.
 * @returns {object}
 */
export const newSnippetRequest = () => ({
    content: "",
    type: "URL", // Đặt giá trị mặc định
    customCode: null,
    password: null,
    expiresAt: null
});

