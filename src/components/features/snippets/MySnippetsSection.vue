<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="card-title mb-0">Danh sách link của tôi</h3>
      </div>

      <LoadingSpinner v-if="isLoading" />

      <div v-else>
        <EmptyState v-if="snippets.length === 0" message="Bạn chưa có link nào. Hãy tạo link rút gọn mới ở trang chủ." />

        <div v-else class="table-responsive">
          <table class="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Short URL</th>
                <th scope="col">Nội dung gốc</th>
                <th scope="col">Loại</th>
                <th scope="col">Trạng thái mật khẩu</th>
                <th scope="col">Lượt click</th>
                <th scope="col">Ngày tạo</th>
                <th scope="col">Hết hạn</th>
                <th scope="col" class="text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in snippets" :key="item.id">
                <td>{{ item.id }}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-link p-0 text-decoration-none"
                    data-bs-toggle="modal"
                    data-bs-target="#snippetDetailModal"
                    @click="loadDetail(item)"
                  >
                    {{ item.shortUrl }}
                  </button>
                </td>
                <td>
                  <span v-if="!isTextTooLongForPreview(item.originalContent)">
                    {{ item.originalContent }}
                  </span>
                  <span v-else>
                    {{ item.originalContent.slice(0, 100) }}...
                  </span>
                </td>
                <td>{{ item.contentType }}</td>
                <td>
                  <StatusBadge type="password" :status="item.hasPassword" />
                </td>
                <td>{{ item.clickCount }}</td>
                <td>{{ formatInstant(item.createdAt) }}</td>
                <td>{{ formatInstant(item.expiresAt) }}</td>
                <td class="text-end">
                  <div class="btn-group btn-group-sm" role="group">
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="copyToClipboard(item.shortUrl)"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-primary"
                      @click="handleChangePassword(item)"
                    >
                      Mật khẩu
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-primary"
                      @click="handleChangeExpiresAt(item)"
                    >
                      Hết hạn
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      @click="handleDelete(item)"
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
    :show-owner="false"
    :show-status="false"
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
import snippetService from '@/services/snippet-service';
import authService from '@/services/auth-service';
import { showError, confirmAction, showToast, promptInput, promptDateTime } from '@/services/alert-service';
import { formatInstant, copyToClipboard, isTextTooLongForPreview } from '@/others/utils';
import PaginationControls from '@/components/common/PaginationControls.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import StatusBadge from '@/components/common/StatusBadge.vue';
import SnippetDetailModal from '@/components/features/snippets/SnippetDetailModal.vue';
import SnippetClicksModal from '@/components/features/snippets/SnippetClicksModal.vue';

const router = useRouter();

const isLoading = ref(false);
const snippets = ref([]);
const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(0);
const totalElements = ref(0);
const hasNextPage = ref(false);
const detailSnippet = ref(null);
const clicksModalRef = ref(null);
const currentSnippetId = ref(null);

const loadData = async () => {
  if (!authService.isAuthenticated.value) {
    showError('Chưa đăng nhập', 'Vui lòng đăng nhập để xem danh sách link của bạn.');
    router.push('/login');
    return;
  }

  isLoading.value = true;

  const response = await snippetService.getMySnippets(currentPage.value, pageSize.value);

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

const handlePageChange = (page) => {
  currentPage.value = page;
};

const handlePageSizeChange = (newPageSize) => {
  pageSize.value = newPageSize;
  currentPage.value = 0;
};

const handleDelete = async (item) => {
  const confirmed = await confirmAction('Xác nhận xóa', `Bạn có chắc muốn xóa link ${item.shortUrl}?`);
  if (!confirmed) {
    return;
  }

  const response = await snippetService.deleteSnippet(item.id);

  if (response.success && response.data == null) {
    showToast('success', 'Đã xóa link thành công.');
    await loadData();
  } else if (response.success) {
    showToast('success', 'Đã xóa link thành công.');
    await loadData();
  } else {
    showError(response.error.error || 'Xóa thất bại', response.error.message);
  }
};

const handleChangePassword = async (item) => {
  const value = await promptInput({
    title: 'Cập nhật mật khẩu',
    text: 'Nhập mật khẩu mới cho link này (để trống để xóa mật khẩu).',
    input: 'password',
    inputPlaceholder: 'Mật khẩu mới hoặc để trống để xóa',
    inputValue: ''
  });

  if (value === null) {
    return;
  }

  const newPassword = value === '' ? null : value;

  const response = await snippetService.updateSnippetPassword(item.id, newPassword);

  if (response.success) {
    showToast('success', 'Đã cập nhật mật khẩu.');
    await loadData();
  } else {
    showError(response.error.error || 'Cập nhật mật khẩu thất bại', response.error.message);
  }
};

const handleChangeExpiresAt = async (item) => {
  const currentIso = item.expiresAt || '';
  const value = await promptDateTime({
    title: 'Cập nhật thời gian hết hạn',
    text: 'Chọn thời gian hết hạn mới (để trống để bỏ hết hạn).',
    initialValue: currentIso
  });

  if (value === null) {
    return;
  }

  const newExpiresAt = value === '' ? null : value;

  const response = await snippetService.updateSnippetExpiresAt(item.id, newExpiresAt);

  if (response.success) {
    showToast('success', 'Đã cập nhật thời gian hết hạn.');
    await loadData();
  } else {
    showError(response.error.error || 'Cập nhật thời gian hết hạn thất bại', response.error.message);
  }
};

const loadDetail = (item) => {
  detailSnippet.value = item;
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


