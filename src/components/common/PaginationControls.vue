<template>
  <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-2">
    <div class="d-flex align-items-center gap-2">
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        :disabled="currentPage === 0 || isLoading"
        @click="handlePreviousPage"
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
          @keyup.enter="handleGoToPage"
          @blur="handleGoToPage"
        />
        <span class="input-group-text">/ {{ totalPages || 1 }}</span>
      </div>
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        :disabled="!hasNextPage || isLoading"
        @click="handleNextPage"
      >
        Trang sau »
      </button>
    </div>
    <div class="d-flex align-items-center gap-2">
      <span class="text-muted small">Đang hiển thị</span>
      <select
        :value="pageSize"
        @change="handlePageSizeChange"
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
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  hasNextPage: {
    type: Boolean,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['pageChange', 'pageSizeChange']);

const pageInput = ref(props.totalPages > 0 ? props.currentPage + 1 : 1);

watch(() => props.totalPages, (newTotalPages) => {
  if (newTotalPages > 0) {
    pageInput.value = props.currentPage + 1;
  } else {
    pageInput.value = 1;
  }
});

watch(() => props.currentPage, (newCurrentPage) => {
  if (props.totalPages > 0) {
    pageInput.value = newCurrentPage + 1;
  } else {
    pageInput.value = 1;
  }
});

const handlePreviousPage = () => {
  if (props.currentPage > 0) {
    const newPage = props.currentPage - 1;
    emit('pageChange', newPage);
  }
};

const handleNextPage = () => {
  if (props.hasNextPage) {
    const newPage = props.currentPage + 1;
    emit('pageChange', newPage);
  }
};

const handleGoToPage = () => {
  if (!pageInput.value || pageInput.value < 1) {
    pageInput.value = props.totalPages > 0 ? props.currentPage + 1 : 1;
    return;
  }
  const targetPage = pageInput.value - 1;
  if (targetPage === props.currentPage) return;
  if (targetPage < 0) return;
  if (props.totalPages > 0 && targetPage >= props.totalPages) {
    pageInput.value = props.totalPages;
    const newPage = props.totalPages - 1;
    emit('pageChange', newPage);
    return;
  }
  emit('pageChange', targetPage);
};

const handlePageSizeChange = (event) => {
  const newPageSize = Number(event.target.value);
  emit('pageSizeChange', newPageSize);
};
</script>

