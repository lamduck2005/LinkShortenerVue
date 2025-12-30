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
              <PasswordInput
                v-model="formData.password"
                id="password"
                required
                minlength="6"
                maxlength="100"
              />
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
import authService from '@/services/auth-service';
import { showError, showSuccess, showToast } from '@/services/alert-service';
import PasswordInput from '@/components/common/PasswordInput.vue';

const router = useRouter();

const formData = ref({
  email: '',
  username: '',
  password: ''
});

const isLoading = ref(false);

const handleSubmit = async () => {
  isLoading.value = true;

  const response = await authService.signup(formData.value);

  if (response.success) {
    const userData = response.data;
    
    if (userData && userData.id && userData.username && userData.email) {
      const loginResponse = await authService.login({
        username: formData.value.username,
        password: formData.value.password
      });

      if (loginResponse.success) {
        const token = loginResponse.data.token;
        console.log("🚀 ~ handleSubmit ~ token:", token)

        authService.setToken(token);

        showToast('success', 'Đăng ký thành công');
        router.push('/');
      } else {
        router.push('/login');
      }
    } else {
      showSuccess('Đăng ký thành công', 'Vui lòng đăng nhập để tiếp tục.');
      router.push('/login');
    }
  } else {
    showError(response.error.error || 'Đăng ký thất bại', response.error.message);
  }

  isLoading.value = false;
};
</script>


