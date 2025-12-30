<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="card-title mb-0">Quản lý người dùng</h3>
        <button
          type="button"
          class="btn btn-primary btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#createUserModal"
          @click="openCreateModal"
        >
          Tạo user mới
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
      </div>

      <div v-else>
        <div v-if="users.length === 0" class="alert alert-info mb-0">
          Không có người dùng nào.
        </div>

        <div v-else class="table-responsive">
          <table class="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Vai trò</th>
                <th scope="col">Ngày tạo</th>
                <th scope="col">Cập nhật</th>
                <th scope="col" class="text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in users" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.username }}</td>
                <td>{{ item.email }}</td>
                <td>
                  <span v-if="item.isActive" class="badge bg-success">Hoạt động</span>
                  <span v-else class="badge bg-danger">Không hoạt động</span>
                </td>
                <td>
                  <span
                    v-for="role in item.roles"
                    :key="role"
                    class="badge bg-primary me-1"
                  >
                    {{ role }}
                  </span>
                </td>
                <td>{{ formatInstant(item.createdAt) }}</td>
                <td>{{ formatInstant(item.updatedAt) }}</td>
                <td class="text-end">
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#createUserModal"
                    @click="openEditModal(item)"
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <PaginationControls
          :current-page="currentPage"
          :page-size="pageSize"
          :total-pages="totalPages"
          :has-next-page="hasNextPage"
          :is-loading="isLoading"
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </div>
    </div>
  </div>

  <!-- Modal tạo / sửa user -->
  <div
    class="modal fade"
    id="createUserModal"
    tabindex="-1"
    aria-labelledby="createUserModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createUserModalLabel">
            {{ isEditMode ? 'Cập nhật user' : 'Tạo user mới' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label for="username" class="form-label">Username</label>
              <input
                v-model="formData.username"
                type="text"
                id="username"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-6">
              <label for="email" class="form-label">Email</label>
              <input
                v-model="formData.email"
                type="email"
                id="email"
                class="form-control"
                required
              />
            </div>
          </div>

          <div class="row g-3 mt-2" v-if="!isEditMode">
            <div class="col-md-6">
              <label for="password" class="form-label">Mật khẩu</label>
              <input
                v-model="formData.password"
                type="password"
                id="password"
                class="form-control"
                required
              />
            </div>
          </div>

          <div class="row g-3 mt-3">
            <div class="col-md-6">
              <div class="form-check form-switch">
                <input
                  v-model="formData.isAdmin"
                  class="form-check-input"
                  type="checkbox"
                  id="isAdmin"
                />
                <label class="form-check-label" for="isAdmin">
                  Quyền quản trị viên
                </label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-check form-switch">
                <input
                  v-model="formData.isActive"
                  class="form-check-input"
                  type="checkbox"
                  id="isActive"
                />
                <label class="form-check-label" for="isActive">
                  Hoạt động
                </label>
              </div>
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
            :disabled="isSubmitting"
            @click="submitUserForm"
          >
            <span
              v-if="isSubmitting"
              class="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
            <span v-else>Lưu</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth-service';
import adminUserService from '@/services/admin/admin-user-service';
import { showError, confirmAction, showToast } from '@/services/alert-service';
import { formatInstant } from '@/others/utils';
import PaginationControls from '@/components/common/PaginationControls.vue';

const router = useRouter();

const isLoading = ref(false);
const users = ref([]);
const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(0);
const totalElements = ref(0);
const hasNextPage = ref(false);

const isSubmitting = ref(false);
const isEditMode = ref(false);
const editingUser = ref(null);

const formData = ref({
  email: '',
  username: '',
  password: '',
  isAdmin: false,
  isActive: true,
});

const loadData = async () => {
  if (!authService.isAuthenticated.value) {
    showError('Chưa đăng nhập', 'Vui lòng đăng nhập với tài khoản admin.');
    router.push('/login');
    return;
  }

  isLoading.value = true;

  const response = await adminUserService.getAdminUsers(currentPage.value, pageSize.value);

  if (response.success) {
    const data = response.data || {};
    users.value = data.content || [];
    currentPage.value = data.page ?? 0;
    pageSize.value = data.size ?? pageSize.value;
    totalPages.value = data.totalPages ?? 0;
    totalElements.value = data.totalElements ?? 0;
    hasNextPage.value = totalPages.value > 0 && currentPage.value + 1 < totalPages.value;
  } else {
    showError(response.error.error || 'Lỗi', response.error.message);
  }

  isLoading.value = false;
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const handlePageSizeChange = (newPageSize) => {
  pageSize.value = newPageSize;
  currentPage.value = 0;
};

onMounted(loadData);

watch(currentPage, () => {
  loadData();
});

watch(pageSize, () => {
  currentPage.value = 0;
  loadData();
});

const openCreateModal = () => {
  isEditMode.value = false;
  editingUser.value = null;
  formData.value = {
    email: '',
    username: '',
    password: '',
    isAdmin: false,
    isActive: true,
  };
};

const openEditModal = (user) => {
  isEditMode.value = true;
  editingUser.value = user;
  formData.value = {
    email: user.email,
    username: user.username,
    password: '',
    isAdmin: user.roles?.includes('ROLE_ADMIN') || false,
    isActive: user.isActive,
  };
  const modalElement = document.getElementById('createUserModal');
  if (modalElement) {
    const modal = window.bootstrap?.Modal.getOrCreateInstance(modalElement);
    modal?.show();
  }
};

const submitUserForm = async () => {
  if (!formData.value.email || !formData.value.username) {
    showError('Thiếu dữ liệu', 'Vui lòng nhập đầy đủ email và username.');
    return;
  }

  if (!isEditMode.value && !formData.value.password) {
    showError('Thiếu mật khẩu', 'Vui lòng nhập mật khẩu cho user mới.');
    return;
  }

  const confirmTitle = isEditMode.value ? 'Xác nhận cập nhật user' : 'Xác nhận tạo user mới';
  const confirmText = isEditMode.value
    ? 'Bạn có chắc chắn muốn cập nhật thông tin user này?'
    : 'Bạn có chắc chắn muốn tạo user mới với các thông tin đã nhập?';

  const confirmed = await confirmAction(confirmTitle, confirmText);
  if (!confirmed) {
    return;
  }

  isSubmitting.value = true;

  try {
    if (isEditMode.value && editingUser.value) {
      const payload = {
        email: formData.value.email,
        username: formData.value.username,
        isAdmin: formData.value.isAdmin,
        isActive: formData.value.isActive,
      };
      const response = await adminUserService.updateAdminUser(editingUser.value.id, payload);

      if (!response.success) {
        showError(response.error.error || 'Cập nhật user thất bại', response.error.message);
      } else {
        showToast('success', 'Cập nhật user thành công.');
        await loadData();
      }
    } else {
      const payload = {
        email: formData.value.email,
        username: formData.value.username,
        password: formData.value.password,
        isAdmin: formData.value.isAdmin,
        isActive: formData.value.isActive,
      };
      const response = await adminUserService.createAdminUser(payload);

      if (!response.success) {
        showError(response.error.error || 'Tạo user thất bại', response.error.message);
      } else {
        showToast('success', 'Tạo user mới thành công.');
        await loadData();
      }
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>


