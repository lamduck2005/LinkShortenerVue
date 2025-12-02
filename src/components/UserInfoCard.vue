<template>
  <div class="card mb-4">
    <div class="card-body">
      <h2 class="card-title mb-3">Thông tin cá nhân</h2>

      <div v-if="userLoading" class="text-muted">
        Đang tải thông tin người dùng...
      </div>

      <div v-else-if="user">
        <table class="table table-borderless mb-0 align-middle">
          <tbody>
            <tr>
              <th class="text-muted fw-semibold" style="width: 160px;">
                Tên đăng nhập
              </th>
              <td>{{ user.username }}</td>
            </tr>
            <tr>
              <th class="text-muted fw-semibold">Email</th>
              <td>{{ user.email }}</td>
            </tr>
            <tr>
              <th class="text-muted fw-semibold">Trạng thái</th>
              <td>
                <span v-if="user.isActive" class="badge bg-success">Hoạt động</span>
                <span v-else class="badge bg-secondary">Bị khóa</span>
              </td>
            </tr>
            <tr>
              <th class="text-muted fw-semibold">Ngày tạo</th>
              <td>{{ formatInstant(user.createdAt) }}</td>
            </tr>
            <tr>
              <th class="text-muted fw-semibold">Cập nhật lần cuối</th>
              <td>{{ formatInstant(user.updatedAt) }}</td>
            </tr>
            <tr>
              <th class="text-muted fw-semibold">Vai trò</th>
              <td>
                <span
                  v-for="role in user.roles"
                  :key="role"
                  class="badge bg-primary me-1"
                >
                  {{ role }}
                </span>
              </td>
            </tr>
            <tr>
              <th class="text-muted fw-semibold">Thao tác</th>
              <td>
                <div class="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#changePasswordModal"
                  >
                    Đổi mật khẩu
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm"
                    @click="handleChangeEmail"
                  >
                    Đổi email
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal đổi mật khẩu -->
  <div
    class="modal fade"
    id="changePasswordModal"
    tabindex="-1"
    aria-labelledby="changePasswordModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="changePasswordModalLabel">Đổi mật khẩu</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="currentPassword" class="form-label">Mật khẩu hiện tại</label>
            <div class="input-group">
              <input
                :type="showCurrentPassword ? 'text' : 'password'"
                id="currentPassword"
                v-model="currentPassword"
                class="form-control"
              />
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
              >
                {{ showCurrentPassword ? 'Ẩn' : 'Hiện' }}
              </button>
            </div>
          </div>
          <div class="mb-3">
            <label for="newPassword" class="form-label">Mật khẩu mới</label>
            <div class="input-group">
              <input
                :type="showNewPassword ? 'text' : 'password'"
                id="newPassword"
                v-model="newPassword"
                class="form-control"
              />
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="showNewPassword = !showNewPassword"
              >
                {{ showNewPassword ? 'Ẩn' : 'Hiện' }}
              </button>
            </div>
          </div>
          <div class="mb-0">
            <label for="confirmPassword" class="form-label">Xác nhận mật khẩu mới</label>
            <div class="input-group">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="confirmPassword"
                class="form-control"
              />
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                {{ showConfirmPassword ? 'Ẩn' : 'Hiện' }}
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Hủy
          </button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="isSubmittingPassword"
            @click="submitChangePassword"
          >
            <span
              v-if="isSubmittingPassword"
              class="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
            <span v-else>Xác nhận</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';
import userService from '@/services/userService';
import { showError, toast, confirmAction, promptInput } from '@/services/alertService';
import { formatInstant } from '@/utils/utils';

const router = useRouter();

const user = ref(null);
const userLoading = ref(true);

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const isSubmittingPassword = ref(false);

const loadUser = async () => {
  if (!authService.isAuthenticated.value) {
    showError('Chưa đăng nhập', 'Vui lòng đăng nhập để xem thông tin cá nhân.');
    router.push('/login');
    return;
  }

  userLoading.value = true;
  const response = await userService.getCurrentUser();

  if (response.success) {
    user.value = response.data;
  } else {
    showError(response.error.error || 'Lỗi', response.error.message);
  }

  userLoading.value = false;
};

const resetPasswordForm = () => {
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
  showCurrentPassword.value = false;
  showNewPassword.value = false;
  showConfirmPassword.value = false;
};

const submitChangePassword = async () => {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    showError('Thiếu thông tin', 'Vui lòng nhập đầy đủ các trường mật khẩu.');
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    showError('Không khớp mật khẩu', 'Mật khẩu mới và xác nhận mật khẩu không trùng khớp.');
    return;
  }

  const confirmed = await confirmAction(
    'Xác nhận đổi mật khẩu',
    'Bạn có chắc chắn muốn đổi mật khẩu tài khoản này?'
  );

  if (!confirmed) {
    return;
  }

  isSubmittingPassword.value = true;

  const response = await userService.changePassword({
    currentPassword: currentPassword.value,
    newPassword: newPassword.value
  });

  if (response.success) {
    toast('success', 'Đổi mật khẩu thành công.');
    resetPasswordForm();
  } else {
    showError(response.error.error || 'Đổi mật khẩu thất bại', response.error.message);
  }

  isSubmittingPassword.value = false;
};

const handleChangeEmail = async () => {
  const value = await promptInput({
    title: 'Đổi email',
    text: 'Nhập email mới cho tài khoản của bạn.',
    input: 'email',
    inputPlaceholder: 'email-moi@example.com',
    inputValue: user.value?.email || ''
  });

  if (value === null) {
    return;
  }

  const newEmail = value.trim();
  if (!newEmail) {
    showError('Email không hợp lệ', 'Email mới không được để trống.');
    return;
  }

  const confirmed = await confirmAction(
    'Xác nhận đổi email',
    `Bạn có chắc chắn muốn đổi email thành "${newEmail}"?`
  );

  if (!confirmed) {
    return;
  }

  const response = await userService.changeEmail({ newEmail });

  if (response.success) {
    toast('success', 'Đổi email thành công.');
    await loadUser();
  } else {
    showError(response.error.error || 'Đổi email thất bại', response.error.message);
  }
};

onMounted(loadUser);
</script>


