    <template>
    <div class="container mt-5">
        <div class="row">
        <div class="col-md-8 mx-auto">
            <h1 class="mb-4 text-center">Tạo Link Rút Gọn Mới</h1>

            <form @submit.prevent="handleSubmit" class="card card-body shadow-sm">
            
            <div class="mb-3">
                <label for="content" class="form-label">Nội dung (Link hoặc Text):</label>
                <textarea
                v-model="formData.content"
                id="content"
                class="form-control"
                rows="4"
                placeholder="Dán link (ví dụ: https://...) hoặc văn bản vào đây..."
                required
                ></textarea>
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
                <label for="customCode" class="form-label">Link tùy chỉnh (Tùy chọn):</label>
                <div class="input-group">
                <span class="input-group-text">{{ baseUrl }}/</span>
                <input
                    v-model="formData.customCode"
                    type="text"
                    id="customCode"
                    class="form-control"
                    placeholder="custom-code"
                />
                </div>
            </div>

            <div class="mb-3">
                <label for="password" class="form-label">Mật khẩu (Tùy chọn):</label>
                <input
                v-model="formData.password"
                type="password"
                id="password"
                class="form-control"
                placeholder="Để trống nếu không cần mật khẩu"
                />
            </div>

            <div class="mb-3">
                <label for="expiresAt" class="form-label">Thời gian hết hạn (Tùy chọn):</label>
                <input
                v-model="formData.expiresAt"
                type="text"
                id="expiresAt"
                class="form-control"
                placeholder="Để trống nếu không hết hạn (Định dạng ISO: 2025-12-31T23:59:00Z)"
                />
            </div>
            
            <hr/>
            
            
            <div class="input-group mb-3">
                <button type="submit" class="btn btn-primary btn-lg form-control" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span v-else>Tạo link</span>
            </button>
                <button class="btn btn-danger" type="button" @click="resetForm"><span class="material-symbols-outlined">
delete
</span></button>
            </div>
            </form>

            <div v-if="result" class="card card-body shadow-sm mt-4 ">
            <h5 class="text-success">Tạo thành công!</h5>
            <label for="resultUrl" class="form-label">Link rút gọn của bạn:</label>
            <input
                :value="result.shortUrl"
                id="resultUrl"
                class="form-control form-control-lg text-center"
                readonly
            />
            
            </div>

        </div>
        </div>
    </div>
    </template>

    <script setup>
    import { ref } from 'vue';
    import { newSnippetRequest } from '@/models/snippet.model';
    import snippetService from '@/services/snippetService'; // Import cleaned service
    import { showError, showSuccess, toast } from '@/services/alertService';

    // Trạng thái của form
    const formData = ref(newSnippetRequest());

    // Trạng thái của UI
    const isLoading = ref(false);
    const result = ref(null); // Nơi lưu trữ CreateSnippetResponse
    const baseUrl = import.meta.env.VITE_BASE_URL;

    // Hàm xử lý khi nhấn nút Submit
    const handleSubmit = async () => {
    isLoading.value = true;
    result.value = null; 

    const response = await snippetService.createSnippet(formData.value);

    if (response.success) {
        // === LUỒNG THÀNH CÔNG ===
        result.value = response.data; // response.data là { id, shortUrl, ... }
        
        // Reset form (trừ content)
        formData.value.customCode = '';
        formData.value.password = '';
        formData.value.expiresAt = '';

        toast('success', "Tạo liên kết rút gọn thành công!");
    } else {
    showError('Tạo thất bại', response.error?.message || 'Một lỗi không xác định đã xảy ra.');
    }

    isLoading.value = false;
    };

    const resetForm = () => {
        formData.value = newSnippetRequest();
    }
    </script>

    <style scoped>
    .container {
    max-width: 900px;
    }

    </style>