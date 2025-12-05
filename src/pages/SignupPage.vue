<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 mx-auto">
        <div class="card card-body">
          <h2 class="mb-4 text-center">Đăng ký tài khoản</h2>

          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                v-model="formData.email"
                type="email"
                id="email"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label for="username" class="form-label">Tên đăng nhập</label>
              <input
                v-model="formData.username"
                type="text"
                id="username"
                class="form-control"
                required
                minlength="3"
                maxlength="100"
              />
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Mật khẩu</label>
              <div class="input-group">
                <input
                  v-model="formData.password"
                  :type="passwordFieldType"
                  id="password"
                  class="form-control"
                  required
                  minlength="6"
                  maxlength="100"
                />
                <button class="btn btn-outline-secondary" type="button" @click="togglePasswordVisibility">
                  <EyeIcon v-if="passwordFieldType === 'password'" class="hero-icon" />
                  <EyeSlashIcon v-else class="hero-icon" />
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
              <span v-else>Đăng ký</span>
            </button>
          </form>

          <hr />

          <p class="text-center mb-0">
            Đã có tài khoản?
            <RouterLink to="/login">Đăng nhập</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';
import { showError, showSuccess } from '@/services/alertService';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';

const router = useRouter();

const formData = ref({
  email: '',
  username: '',
  password: ''
});

const isLoading = ref(false);
const passwordFieldType = ref('password');

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
};

const handleSubmit = async () => {
  isLoading.value = true;

  const response = await authService.signup(formData.value);

  if (response.success) {
    showSuccess('Đăng ký thành công', 'Vui lòng đăng nhập để tiếp tục.');
    router.push('/login');
  } else {
    showError(response.error.error || 'Đăng ký thất bại', response.error.message);
  }

  isLoading.value = false;
};
</script>


