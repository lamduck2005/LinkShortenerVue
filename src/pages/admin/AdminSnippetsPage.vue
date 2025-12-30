<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="card-title mb-0">Quản lý snippet</h3>
      </div>

      <div class="mb-3">
        <div class="row g-2">
          <div class="col-md-3">
            <label class="form-label">User ID</label>
            <input
              v-model="filters.userId"
              type="number"
              class="form-control"
              placeholder="Lọc theo id người dùng"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Short code</label>
            <input
              v-model="filters.shortCode"
              type="text"
              class="form-control"
              placeholder="Tìm theo shortCode"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Mật khẩu</label>
            <select v-model="filters.hasPassword" class="form-select">
              <option value="">Tất cả</option>
              <option value="true">Có mật khẩu</option>
              <option value="false">Không mật khẩu</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Trạng thái hết hạn</label>
            <select v-model="filters.expired" class="form-select">
              <option value="">Tất cả</option>
              <option value="true">Đã hết hạn</option>
              <option value="false">Chưa hết hạn / không có hạn</option>
            </select>
          </div>
        </div>
        <div class="mt-2 d-flex justify-content-end gap-2">
          <button class="btn btn-outline-secondary btn-sm" type="button" @click="resetFilters">
            Xóa bộ lọc
          </button>
          <button class="btn btn-primary btn-sm" type="button" @click="applyFilters">
            Áp dụng
          </button>
        </div>
      </div>

      <LoadingSpinner v-if="isLoading" />

      <div v-else>
        <EmptyState v-if="snippets.length === 0" message="Không có snippet nào." />

        <div v-else class="table-responsive">
          <table class="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Short code</th>
                <th scope="col">Short URL</th>
                <th scope="col">Loại</th>
                <th scope="col">Mật khẩu</th>
                <th scope="col">Lượt click</th>
                <th scope="col">Hết hạn</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Người tạo</th>
                <th scope="col">Ngày tạo</th>
                <th scope="col" class="text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in snippets" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.shortCode }}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-link p-0 text-decoration-none"
                    data-bs-toggle="modal"
                    data-bs-target="#snippetDetailModal"
                    @click="loadDetail(item.id)"
                  >
                    {{ item.shortUrl }}
                  </button>
                </td>
                <td>{{ item.contentType }}</td>
                <td>
                  <StatusBadge type="password" :status="item.hasPassword" />
                </td>
                <td>{{ item.clickCount }}</td>
                <td>{{ formatInstant(item.expiresAt) }}</td>
                <td>
                  <StatusBadge type="expired" :status="!item.isExpired" />
                </td>
                <td>
                  <div class="small">
                    <div><strong>{{ item.ownerUsername }}</strong></div>
                    <div class="text-muted">{{ item.ownerEmail }}</div>
                  </div>
                </td>
                <td>{{ formatInstant(item.createdAt) }}</td>
                <td class="text-end">
                  <div class="btn-group btn-group-sm" role="group">
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#snippetDetailModal"
                      @click="loadDetail(item.id)"
                    >
                      Chi tiết
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-primary"
                      @click="changePassword(item)"
                    >
                      Mật khẩu
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-primary"
                      @click="changeExpires(item)"
                    >
                      Hết hạn
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      @click="deleteSnippet(item)"
                    >
                      Xóa
                    </button>
                  </div>
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

  <SnippetDetailModal
    :snippet="detailSnippet"
    :show-owner="true"
    :show-status="true"
    @show-clicks="handleShowClicks"
  />

  <SnippetClicksModal
    ref="clicksModalRef"
    :snippet-id="currentSnippetId"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth-service';
import adminSnippetService from '@/services/admin/admin-snippet-service';
import snippetService from '@/services/snippet-service';
import { showError, confirmAction, showToast, promptInput, promptDateTime } from '@/services/alert-service';
import { formatInstant } from '@/others/utils';
import PaginationControls from '@/components/common/PaginationControls.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import SnippetDetailModal from '@/components/features/snippets/SnippetDetailModal.vue';
import SnippetClicksModal from '@/components/features/snippets/SnippetClicksModal.vue';
import StatusBadge from '@/components/common/StatusBadge.vue';

const router = useRouter();

const isLoading = ref(false);
const snippets = ref([]);

const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(0);
const totalElements = ref(0);
const hasNextPage = ref(false);

const filters = ref({
  userId: '',
  shortCode: '',
  hasPassword: '',
  expired: '',
});

const detailSnippet = ref(null);
const clicksModalRef = ref(null);
const currentSnippetId = ref(null);

const loadData = async () => {
  if (!authService.isAuthenticated.value) {
    showError('Chưa đăng nhập', 'Vui lòng đăng nhập với tài khoản admin.');
    router.push('/login');
    return;
  }

  isLoading.value = true;

  const params = {
    page: currentPage.value,
    size: pageSize.value,
    userId: filters.value.userId,
    shortCode: filters.value.shortCode,
    hasPassword: filters.value.hasPassword,
    expired: filters.value.expired,
  };

  const response = await adminSnippetService.getAdminSnippets(params);

  if (response.success) {
    const data = response.data || {};
    snippets.value = data.content || [];
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

const applyFilters = () => {
  currentPage.value = 0;
  loadData();
};

const resetFilters = () => {
  filters.value = {
    userId: '',
    shortCode: '',
    hasPassword: '',
    expired: '',
  };
  currentPage.value = 0;
  loadData();
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const handlePageSizeChange = (newPageSize) => {
  pageSize.value = newPageSize;
  currentPage.value = 0;
};

const loadDetail = async (id) => {
  const response = await adminSnippetService.getAdminSnippetDetail(id);
  if (!response.success) {
    showError(response.error.error || 'Lỗi', response.error.message);
    return;
  }
  detailSnippet.value = response.data;
};

const deleteSnippet = async (item) => {
  const confirmed = await confirmAction(
    'Xác nhận xóa snippet',
    `Bạn có chắc chắn muốn xóa snippet ${item.shortCode} (ID: ${item.id})?`
  );
  if (!confirmed) {
    return;
  }
  const response = await adminSnippetService.deleteAdminSnippet(item.id);
  if (response.success) {
    showToast('success', 'Đã xóa snippet thành công.');
    await loadData();
  } else {
    showError(response.error.error || 'Xóa snippet thất bại', response.error.message);
  }
};

const changePassword = async (item) => {
  const value = await promptInput({
    title: 'Cập nhật mật khẩu snippet',
    text: 'Nhập mật khẩu mới cho snippet này (để trống để xóa mật khẩu).',
    input: 'password',
    inputPlaceholder: 'Mật khẩu mới hoặc để trống để xóa',
    inputValue: '',
  });

  if (value === null) {
    return;
  }

  const newPassword = value === '' ? null : value;
  const response = await adminSnippetService.updateAdminSnippetPassword(item.id, newPassword);

  if (response.success) {
    showToast('success', 'Đã cập nhật mật khẩu snippet.');
    await loadData();
  } else {
    showError(response.error.error || 'Cập nhật mật khẩu thất bại', response.error.message);
  }
};

const changeExpires = async (item) => {
  const currentIso = item.expiresAt || '';
  const value = await promptDateTime({
    title: 'Cập nhật thời gian hết hạn snippet',
    text: 'Chọn thời gian hết hạn mới (để trống để bỏ hết hạn).',
    initialValue: currentIso,
  });

  if (value === null) {
    return;
  }

  const newExpiresAt = value === '' ? null : value;
  const response = await adminSnippetService.updateAdminSnippetExpiresAt(item.id, newExpiresAt);

  if (response.success) {
    showToast('success', 'Đã cập nhật thời gian hết hạn snippet.');
    await loadData();
  } else {
    showError(response.error.error || 'Cập nhật thời gian hết hạn thất bại', response.error.message);
  }
};

const handleShowClicks = (id) => {
  currentSnippetId.value = id;
};

onMounted(loadData);

watch(currentPage, () => {
  loadData();
});

watch(pageSize, () => {
  currentPage.value = 0;
  loadData();
});
</script>


