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

      <div v-if="isLoading" class="text-center py-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
      </div>

      <div v-else>
        <div v-if="snippets.length === 0" class="alert alert-info mb-0">
          Không có snippet nào.
        </div>

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
                  <span v-if="item.hasPassword" class="badge bg-warning text-dark">Có mật khẩu</span>
                  <span v-else class="badge bg-secondary">Không mật khẩu</span>
                </td>
                <td>{{ item.clickCount }}</td>
                <td>{{ formatInstant(item.expiresAt) }}</td>
                <td>
                  <span v-if="item.isExpired" class="badge bg-danger">Đã hết hạn</span>
                  <span v-else class="badge bg-success">Còn hiệu lực</span>
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

  <!-- Modal chi tiết snippet -->
  <div
    class="modal fade"
    id="snippetDetailModal"
    tabindex="-1"
    aria-labelledby="snippetDetailModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content" v-if="detailSnippet">
        <div class="modal-header">
          <h5 class="modal-title" id="snippetDetailModalLabel">
            Chi tiết snippet #{{ detailSnippet.id }} - {{ detailSnippet.shortCode }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <table class="table table-borderless align-middle mb-0">
            <tbody>
              <tr>
                <th style="width: 160px;" class="text-muted fw-semibold">Short URL</th>
                <td>
                  <a :href="detailSnippet.shortUrl" target="_blank" rel="noopener noreferrer">
                    {{ detailSnippet.shortUrl }}
                  </a>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    @click="copyToClipboard(detailSnippet.shortUrl)"
                    title="Copy Short URL"
                  >
                    <ClipboardIcon class="hero-icon" />
                  </button>
                </td>
              </tr>
              <tr>
                <th class="text-muted fw-semibold">Loại</th>
                <td>{{ detailSnippet.contentType }}</td>
                <td></td>
              </tr>
              <tr>
                <th class="text-muted fw-semibold">Mật khẩu</th>
                <td>
                  <span v-if="detailSnippet.hasPassword" class="badge bg-warning text-dark">
                    Có mật khẩu
                  </span>
                  <span v-else class="badge bg-secondary">
                    Không mật khẩu
                  </span>
                </td>
                <td></td>
              </tr>
              <tr>
                <th class="text-muted fw-semibold">Người tạo</th>
                <td>
                  <div><strong>{{ detailSnippet.ownerUsername }}</strong></div>
                  <div class="text-muted">{{ detailSnippet.ownerEmail }}</div>
                </td>
                <td></td>
              </tr>
              <tr>
                <th class="text-muted fw-semibold">Ngày tạo</th>
                <td>{{ formatInstant(detailSnippet.createdAt) }}</td>
                <td></td>
              </tr>
              <tr>
                <th class="text-muted fw-semibold">Hết hạn</th>
                <td>{{ formatInstant(detailSnippet.expiresAt) }}</td>
                <td></td>
              </tr>
              <tr>
                <th class="text-muted fw-semibold">Trạng thái</th>
                <td>
                  <span v-if="detailSnippet.isExpired" class="badge bg-danger">Đã hết hạn</span>
                  <span v-else class="badge bg-success">Còn hiệu lực</span>
                </td>
                <td></td>
              </tr>
              <tr>
                <th class="text-muted fw-semibold">Lượt click</th>
                <td>{{ detailSnippet.clickCount }}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#snippetClicksModal"
                    @click="loadClicksDetail(detailSnippet.id)"
                    title="Xem chi tiết clicks"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
              <tr>
                <th class="text-muted fw-semibold align-top">Nội dung</th>
                <td>
                  <pre class="p-2 border rounded small mb-0" style="white-space:pre-wrap;">{{ detailSnippet.contentData }}</pre>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    @click="copyToClipboard(detailSnippet.contentData)"
                    title="Copy nội dung"
                  >
                    <ClipboardIcon class="hero-icon" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal chi tiết clicks -->
  <div
    class="modal fade"
    id="snippetClicksModal"
    tabindex="-1"
    aria-labelledby="snippetClicksModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="snippetClicksModalLabel">
            Chi tiết lượt click - Snippet #{{ detailSnippet?.id }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="isLoadingClicks" class="text-center py-4">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
          </div>
          <div v-else-if="clicksDetail.length === 0" class="alert alert-info mb-0">
            Không có lượt click nào.
          </div>
          <div v-else class="table-responsive">
            <table class="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Thời gian click</th>
                  <th scope="col">IP Address</th>
                  <th scope="col">User Agent</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="click in clicksDetail" :key="click.id">
                  <td>{{ click.id }}</td>
                  <td>{{ formatInstant(click.clickTime) }}</td>
                  <td>{{ click.ipAddress }}</td>
                  <td>
                    <span class="text-truncate d-inline-block" style="max-width: 400px;" :title="click.userAgent">
                      {{ click.userAgent }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Đóng
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
import adminSnippetService from '@/services/admin/admin-snippet-service';
import snippetService from '@/services/snippet-service';
import { showError, confirmAction, showToast, promptInput, promptDateTime } from '@/services/alert-service';
import { formatInstant, copyToClipboard } from '@/others/utils';
import { ClipboardIcon } from '@heroicons/vue/24/outline';
import PaginationControls from '@/components/common/PaginationControls.vue';

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
const clicksDetail = ref([]);
const isLoadingClicks = ref(false);

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

const loadClicksDetail = async (id) => {
  isLoadingClicks.value = true;
  clicksDetail.value = [];
  
  const response = await snippetService.getSnippetClicks(id);
  
  if (response.success) {
    clicksDetail.value = response.data || [];
  } else {
    showError(response.error.error || 'Lỗi', response.error.message);
  }
  
  isLoadingClicks.value = false;
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


