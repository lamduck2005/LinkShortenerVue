<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 mx-auto">

        <div v-if="isLoadingPage" class="text-center p-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Đang kiểm tra...</span>
          </div>
          <p class="mt-2">Đang kiểm tra link...</p>
        </div>

        <form v-if="!isLoadingPage && isValidLink && !unlockedContent" @submit.prevent="handleUnlock"
          class="card card-body">
          <h3 class="mb-3 text-center">
            <LockClosedIcon class="hero-icon me-2" />
            Link này được bảo vệ
          </h3>
          <p class="text-center">Vui lòng nhập mật khẩu để mở khóa mã: <code>{{ shortCode }}</code></p>

          <div class="mb-3">
            <label for="password" class="form-label">Mật khẩu:</label>
            <input v-model="password" type="password" id="password" class="form-control" required />
          </div>

          <button type="submit" class="btn btn-primary" :disabled="isLoadingSubmit">
            <span v-if="isLoadingSubmit" class="spinner-border spinner-border-sm"></span>
            <span v-else>Mở khóa</span>
          </button>
        </form>

        <div v-if="!isLoadingPage && unlockedContent" class="card card-body">
          <h3 class="text-success">Mở khóa thành công!</h3>
          <p>Nội dung của bạn:</p>
          <p class="original-content font-monospace p-2 rounded small">
            {{ unlockedContent }}
          </p>
          <div class="d-flex justify-content-between">
            <button class="btn btn-secondary" @click="copyToClipboard(unlockedContent)">
              <ClipboardIcon class="hero-icon" /> Sao chép
            </button>
            <RouterLink to="/" class="btn btn-primary">
              Tạo link mới
            </RouterLink>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import snippetService from '@/services/snippetService';
import { showError } from '@/services/alertService';
import { LockClosedIcon } from '@heroicons/vue/24/outline';
import { ClipboardIcon } from '@heroicons/vue/24/outline';
import { copyToClipboard } from '@/utils/utils';

const props = defineProps({
  shortCode: {
    type: String,
    required: true
  }
});

const router = useRouter();

const isLoadingPage = ref(true);
const isLoadingSubmit = ref(false);
const password = ref('');
const isValidLink = ref(false);
const unlockedContent = ref(null);

onMounted(async () => {
  const response = await snippetService.getSnippetContent(props.shortCode);

  if (response.success) {
    const status = response.data.status;

    if (status === 'PASSWORD_REQUIRED') {
      isValidLink.value = true;
    } else if (status === 'OK') {
      window.location.href = response.data.content;
    } else {
      router.push('/not-found?code=' + props.shortCode);
    }
  } else {
    showError('Lỗi máy chủ', response.error.message);
    router.push('/');
  }

  isLoadingPage.value = false;
});

const handleUnlock = async () => {
  isLoadingSubmit.value = true;
  const response = await snippetService.unlockSnippet(props.shortCode, password.value);

  if (response.success) {
    const content = response.data.content;
    const type = response.data.contentType;

    if (type === 'URL') {
      window.location.href = content;
    } else {
      unlockedContent.value = content;
    }
  } else {
    showError(response.error.error || 'Lỗi', response.error.message);
  }
  isLoadingSubmit.value = false;
};
</script>

<style scoped>
.hero-icon {
  width: 1.25rem;
  height: 1.25rem;
  vertical-align: middle;
  margin-bottom: 3px;
}

.original-content {
  background-color: var(--bs-secondary-bg);
  color: var(--bs-secondary-color);
  white-space: pre-wrap;
}
</style>
