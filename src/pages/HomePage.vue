  <template>
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8 mx-auto">
          <h1 class="mb-4 text-center">Tạo Link Rút Gọn Mới</h1>

          <form @submit.prevent="handleSubmit" class="card card-body">

            <div class="mb-3">
              <label for="content" class="form-label">Nội dung (Link hoặc Text):</label>
              <textarea v-model="formData.content" id="content" class="form-control" rows="4"
                placeholder="Dán link (ví dụ: https://...) hoặc văn bản vào đây..." required></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Loại nội dung:</label>
              <div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" id="typeURL" value="URL" v-model="formData.type">
                  <label class="form-check-label" for="typeURL">URL (Link)</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" id="typeTEXT" value="TEXT" v-model="formData.type">
                  <label class="form-check-label" for="typeTEXT">TEXT (Văn bản)</label>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label for="customCode" class="form-label">Mã tùy chỉnh (Tùy chọn):</label>
              <div class="input-group">
                <!-- <span class="input-group-text">website/</span> -->
                <input v-model="formData.customCode" type="text" id="customCode" class="form-control"
                  placeholder="link-rut-gon" />
              </div>
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Mật khẩu (Tùy chọn):</label>
              <div class="input-group">
                <input v-model="formData.password" :type="passwordFieldType" id="password" class="form-control"
                  placeholder="Để trống nếu không cần mật khẩu" />
                <button class="btn btn-outline-secondary" type="button" @click="togglePasswordVisibility">
                  <EyeIcon v-if="passwordFieldType === 'password'" class="hero-icon" />
                  <EyeSlashIcon v-else class="hero-icon" />
                </button>
              </div>
            </div>

            <div class="mb-3">
              <label for="expiresAt" class="form-label">Thời gian hết hạn (Tùy chọn):</label>
              <div class="input-group">
                <flat-pickr v-model="formData.expiresAt" :config="flatpickrConfig" class="form-control"
                  placeholder="Chọn ngày giờ hết hạn (bỏ trống nếu không cần)" id="expiresAt" />
                <button class="btn btn-outline-secondary" type="button" @click="clearExpiresAt">
                  <XMarkIcon class="hero-icon" />
                </button>
              </div>
            </div>

            <hr />

            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-outline-danger" @click="clearForm">
                <TrashIcon class="hero-icon" /> Reset
              </button>
              <button type="submit" class="btn btn-primary btn-lg" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span v-else>Xác nhận</span>
              </button>
            </div>
          </form>

          <div v-if="result" class="card card-body mt-4">
            <h5 class="text-success mb-3">Tạo thành công!</h5>

            <label for="resultUrl" class="form-label">Link rút gọn của bạn:</label>
            <div class="input-group mb-3">
              <input :value="result.shortUrl" id="resultUrl" class="form-control form-control-lg text-center" readonly />
              <button class="btn btn-outline-secondary" type="button" @click="copyToClipboard(result.shortUrl)">
                <ClipboardIcon class="hero-icon" /> Copy
              </button>
            </div>

            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between">
                <strong>Mã rút gọn (Short Code):</strong>
                <span class="badge bg-secondary p-2">{{ result.shortCode }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <strong>Loại (Content Type):</strong>
                <span>{{ result.contentType }}</span>
              </li>
              <li class="list-group-item">
                <strong>Nội dung gốc (Original Content):</strong>
                <p v-if="!isTextTooLongForPreview(result.originalContent)" class="original-content font-monospace p-2 rounded small"
                  >
                  {{ result.originalContent }}
                </p>
                <div v-else class="alert alert-secondary mt-2">
                  Nội dung quá dài ({{ result.originalContent.length }} ký tự), không thể xem trước tại đây.
                </div>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <strong>Ngày tạo (Created At):</strong>
                <span>{{ formatInstant(result.createdAt) }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <strong>Ngày hết hạn (Expires At):</strong>
                <span>{{ formatInstant(result.expiresAt) }}</span>
              </li>
              <li class="list-group-item d-flex flex-column flex-sm-row justify-content-between">
                <strong class="mb-2 mb-sm-0">QR Code:</strong>
                <div>
                  <span v-if="result.qrCode">
                    <img :src="result.qrCode" alt="QR Code" class="img-fluid qr-code" />
                  </span>
                  <span v-else>Không có</span>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue';

  import { newSnippetRequest } from '@/models/snippet.model';
  import snippetService from '@/services/snippetService';
  import { showError, toast } from '@/services/alertService';

  import FlatPickr from 'vue-flatpickr-component';

  import {
    EyeIcon,
    EyeSlashIcon,
    TrashIcon,
    ClipboardIcon,
    XMarkIcon
  } from '@heroicons/vue/24/outline';

  import { URL_MAX_LENGTH, TEXT_MAX_LENGTH } from '@/constants';
  import { formatInstant, copyToClipboard, isTextTooLongForPreview } from '@/utils/utils';

  const formData = ref(newSnippetRequest());
  const isLoading = ref(false);
  const result = ref(null);

  const flatpickrConfig = ref({
    enableTime: true,
    dateFormat: "Z",
    altInput: true,
    altFormat: "d/m/Y H:i",
    minDate: "today",
    time_24hr: true
  });

  const passwordFieldType = ref('password');

  const togglePasswordVisibility = () => {
    passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
  };

  const clearExpiresAt = () => {
    formData.value.expiresAt = null;
  };

  const clearForm = () => {
    formData.value = newSnippetRequest();
    result.value = null;
  };

  const handleSubmit = async () => {
    isLoading.value = true;
    result.value = null;

    const payload = { ...formData.value };
    if (payload.customCode === '') payload.customCode = null;
    if (payload.password === '') payload.password = null;

    if (payload.type === 'URL' && payload.content.length > URL_MAX_LENGTH) {
      showError('Lỗi Dữ liệu', `URL quá dài. Tối đa cho phép là ${URL_MAX_LENGTH} ký tự.`);
      isLoading.value = false;
      return;
    }
    if (payload.type === 'TEXT' && payload.content.length > TEXT_MAX_LENGTH) {
      showError('Lỗi Dữ liệu', `Nội dung TEXT quá dài. Tối đa cho phép là ${TEXT_MAX_LENGTH} ký tự.`);
      isLoading.value = false;
      return;
    }

    const response = await snippetService.createSnippet(payload);

    if (response.success) {
      result.value = response.data;

      formData.value.customCode = '';
      formData.value.password = '';
      formData.value.expiresAt = null;

      toast('success', "Tạo liên kết thành công!");
    } else {
      showError(response.error.error || 'Tạo thất bại', response.error.message);
    }

    isLoading.value = false;
  };
  </script>
  <style scoped>

  .original-content {
    background-color: var(--bs-secondary-bg);
    color: var(--bs-secondary-color);
  }
  </style>