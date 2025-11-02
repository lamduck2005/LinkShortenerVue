
import Swal from 'sweetalert2';

/**
 * Hiển thị thông báo Toast (nhỏ, góc trên bên phải)
 * @param {'success' | 'error' | 'warning' | 'info'} icon
 * @param {string} title
 */
export const toast = (icon, title) => {
    Swal.fire({
        icon: icon,
        title: title,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        showCloseButton: true,
        timer: 3000,
        timerProgressBar: true,
        showClass: {
            popup: 'swal2-show',
            backdrop: 'swal2-backdrop-show',
            icon: 'swal2-icon-show'
        },
        hideClass: {
            popup: 'swal2-hide',
            backdrop: 'swal2-backdrop-hide',
            icon: 'swal2-icon-hide'
        },
        customClass: {
            popup: 'custom-toast-animation'
        }
    });
};

/**
 * @param {string} title
 * @param {string} text
 */
export const showError = (title, text) => {
    Swal.fire({
        icon: 'error',
        title: title,
        text: text
    });
};

/**
 * @param {string} title
 * @param {string} text
 */
export const showSuccess = (title, text) => {
    Swal.fire({
        icon: 'success',
        title: title,
        text: text
    });
};