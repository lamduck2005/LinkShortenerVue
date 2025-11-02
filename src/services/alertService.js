    // src/services/alertService.js

    import Swal from 'sweetalert2';

    /**
     * === 1. Cấu hình TOAST (Cho thông báo nhanh) ===
     * Mixin này đáp ứng Yêu cầu 1: Luôn ở top-end
     */
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end', // <-- YÊU CẦU 1: Luôn ở top-end
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
        // Ghi chú: Toast ở 'top-end' SẼ TỰ ĐỘNG trượt từ trên xuống (đúng ý bạn).
    });

    /**
     * === 2. Cấu hình MODAL (Cho thông báo lỗi/xác nhận lớn) ===
     * Mixin này đáp ứng Yêu cầu 2: Thay đổi hiệu ứng
     */
    const Modal = Swal.mixin({
       
    });

    // === 3. Export các hàm "sạch" để Component sử dụng ===

    /**
     * Hiển thị thông báo Toast (nhỏ, góc trên bên phải)
     * @param {'success' | 'error' | 'warning' | 'info'} icon
     * @param {string} title
     */
    export const toast = (icon, title) => {
        Toast.fire({
            icon: icon,
            title: title
        });
    };

    /**
     * Hiển thị Modal Lỗi (lớn, giữa màn hình, tắt lắc)
     * @param {string} title
     * @param {string} text
     */
    export const showError = (title, text) => {
        Modal.fire({
            icon: 'error',
            title: title,
            text: text
        });
    };

    /**
     * Hiển thị Modal Thành công (lớn, giữa màn hình)
     * @param {string} title
     * @param {string} text
     */
    export const showSuccess = (title, text) => {
        Modal.fire({
            icon: 'success',
            title: title,
            text: text
        });
    };