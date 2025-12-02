
import Swal from 'sweetalert2';
import flatpickr from 'flatpickr';

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

/**
 * Hiển thị hộp thoại xác nhận, trả về Promise<boolean> (true nếu người dùng xác nhận)
 * @param {string} title
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export const confirmAction = (title, text) => {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        reverseButtons: true
    }).then((result) => result.isConfirmed);
};

/**
 * Hiển thị ô nhập một dòng (text/password/datetime...) trả về Promise<string|null>
 * null nếu người dùng hủy.
 * @param {object} options
 *  - title: string
 *  - text: string
 *  - input: 'text' | 'password' | 'datetime-local' | ...
 *  - inputPlaceholder?: string
 *  - inputValue?: string
 */
export const promptInput = (options) => {
    const {
        title,
        text,
        input,
        inputPlaceholder,
        inputValue
    } = options;

    return Swal.fire({
        title,
        text,
        input,
        inputPlaceholder,
        inputValue,
        showCancelButton: true,
        confirmButtonText: 'Lưu',
        cancelButtonText: 'Hủy',
        inputAttributes: {
            autocomplete: 'off'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            return result.value ?? '';
        }
        return null;
    });
};

/**
 * Prompt chọn ngày giờ bằng flatpickr bên trong SweetAlert2.
 * Trả về Promise<string | null> (chuỗi ISO theo format Z hoặc null nếu hủy).
 */
export const promptDateTime = (options) => {
    const {
        title,
        text,
        initialValue
    } = options;

    return Swal.fire({
        title,
        html: `
            <div class="mb-2 text-start small">${text || ''}</div>
            <input
              id="swal-datetime"
              class="swal2-input"
              placeholder="Chọn ngày giờ hoặc để trống để bỏ hết hạn"
            />
            <button
              type="button"
              id="swal-clear-datetime"
              class="btn btn-outline-secondary btn-sm mt-2"
            >
              Xóa thời gian hết hạn
            </button>
        `,
        showCancelButton: true,
        confirmButtonText: 'Lưu',
        cancelButtonText: 'Hủy',
        width: '32rem',
        focusConfirm: false,
        didOpen: () => {
            const input = document.getElementById('swal-datetime');
            if (!input) return;

            const fp = flatpickr(input, {
                enableTime: true,
                dateFormat: 'Z',
                altInput: true,
                altFormat: 'd/m/Y H:i',
                defaultDate: initialValue || null,
                time_24hr: true
            });

            const clearBtn = document.getElementById('swal-clear-datetime');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    fp.clear();
                });
            }
        },
        preConfirm: () => {
            const input = document.getElementById('swal-datetime');
            return input ? input.value : '';
        }
    }).then((result) => {
        if (result.isConfirmed) {
            return result.value || '';
        }
        return null;
    });
};