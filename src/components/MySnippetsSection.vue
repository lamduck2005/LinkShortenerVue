<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="card-title mb-0">Danh sách link của tôi</h3>
      </div>

      <div v-if="isLoading" class="text-center py-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
      </div>

      <div v-else>
        <div v-if="snippets.length === 0" class="alert alert-info mb-0">
          Bạn chưa có link nào. Hãy tạo link rút gọn mới ở trang chủ.
        </div>

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
                  <a :href="item.shortUrl" target="_blank" rel="noopener noreferrer">
                    {{ item.shortUrl }}
                  </a>
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
                  <span v-if="item.hasPassword" class="badge bg-warning text-dark">Có mật khẩu</span>
                  <span v-else class="badge bg-secondary">Không có mật khẩu</span>
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

        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-2">
          <div class="d-flex align-items-center gap-2">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              :disabled="currentPage === 0 || isLoading"
              @click="changePage(currentPage - 1)"
            >
              « Trang trước
            </button>
            <div class="input-group input-group-sm" style="max-width: 220px;">
              <span class="input-group-text">Trang</span>
              <input
                v-model.number="pageInput"
                type="number"
                min="1"
                class="form-control"
                @keyup.enter="goToPage"
                @blur="goToPage"
              />
              <span class="input-group-text">/ {{ totalPages || 1 }}</span>
            </div>
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              :disabled="!hasNextPage || isLoading"
              @click="changePage(currentPage + 1)"
            >
              Trang sau »
            </button>
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="text-muted small">Đang hiển thị</span>
            <select
              v-model.number="pageSize"
              class="form-select form-select-sm"
              style="width: auto;"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
            <span class="text-muted small">bản ghi mỗi trang</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import snippetService from '@/services/snippetService';
import authService from '@/services/authService';
import { showError, confirmAction, toast, promptInput, promptDateTime } from '@/services/alertService';
import { formatInstant, copyToClipboard, isTextTooLongForPreview } from '@/utils/utils';

const router = useRouter();

const isLoading = ref(false);
const snippets = ref([]);
const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(0);
const totalElements = ref(0);
const hasNextPage = ref(false);
const pageInput = ref(1);

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
    pageInput.value = (totalPages.value > 0 ? currentPage.value + 1 : 1);
  } else {
    showError(response.error.error || 'Lỗi', response.error.message);
  }

  isLoading.value = false;
};

const changePage = (page) => {
  if (page < 0) return;
  if (totalPages.value > 0 && page >= totalPages.value) return;
  currentPage.value = page;
};

const goToPage = () => {
  if (!pageInput.value || pageInput.value < 1) {
    pageInput.value = currentPage.value + 1;
    return;
  }
  const targetPage = pageInput.value - 1;
  if (targetPage === currentPage.value) return;
  if (targetPage < 0) return;
  if (totalPages.value > 0 && targetPage >= totalPages.value) {
    pageInput.value = totalPages.value;
    currentPage.value = totalPages.value - 1;
    return;
  }
  currentPage.value = targetPage;
};

const handleDelete = async (item) => {
  const confirmed = await confirmAction('Xác nhận xóa', `Bạn có chắc muốn xóa link ${item.shortUrl}?`);
  if (!confirmed) {
    return;
  }

  const response = await snippetService.deleteSnippet(item.id);

  if (response.success && response.data == null) {
    toast('success', 'Đã xóa link thành công.');
    await loadData();
  } else if (response.success) {
    toast('success', 'Đã xóa link thành công.');
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
    toast('success', 'Đã cập nhật mật khẩu.');
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
    toast('success', 'Đã cập nhật thời gian hết hạn.');
    await loadData();
  } else {
    showError(response.error.error || 'Cập nhật thời gian hết hạn thất bại', response.error.message);
  }
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


