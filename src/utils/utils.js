import { TEXT_PREVIEW_LIMIT } from '@/constants'; // Import giới hạn

/**
 * Chuyển đổi chuỗi ISO (Instant) sang định dạng ngày giờ địa phương (vi-VN).
 */
export const formatInstant = (instantString) => {
    if (!instantString) {
        return 'Không có';
    }
    try {
        return new Date(instantString).toLocaleString('vi-VN', {
            dateStyle: 'short',
            timeStyle: 'medium'
        });
    } catch (error) {
        console.error("Lỗi format ngày:", error);
        return "Ngày không hợp lệ";
    }
};

/**
 * Sao chép một đoạn text vào clipboard (Hàm async).
 * Trả về true (thành công) hoặc false (thất bại).
 */
export const copyToClipboard = async (textToCopy) => {
    if (!navigator.clipboard) {
        // Fallback (cho http)
        try {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            return false;
        }
    }

    // Cách hiện đại (cho https)
    try {
        await navigator.clipboard.writeText(textToCopy);
        return true;
    } catch (err) {
        return false;
    }
};

/**
 * (MỚI) Kiểm tra xem text có cần rút gọn hay không (dùng cho UI)
 */
export const isTextTooLongForPreview = (text) => {
    if (!text) return false;
    return text.length > TEXT_PREVIEW_LIMIT;
};
