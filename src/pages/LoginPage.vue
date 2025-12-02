<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 mx-auto">
        <div class="card card-body">
          <h2 class="mb-4 text-center">Đăng nhập</h2>

          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="username" class="form-label">Tên đăng nhập</label>
              <input
                v-model="formData.username"
                type="text"
                id="username"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Mật khẩu</label>
              <input
                v-model="formData.password"
                type="password"
                id="password"
                class="form-control"
                required
              />
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
              <span v-else>Đăng nhập</span>
            </button>
          </form>

          <hr />

          <p class="text-center mb-0">
            Chưa có tài khoản?
            <RouterLink to="/signup">Đăng ký ngay</RouterLink>
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
import { showError, toast } from '@/services/alertService';

const router = useRouter();

const formData = ref({
  username: '',
  password: ''
});

const isLoading = ref(false);

const handleSubmit = async () => {
  isLoading.value = true;

  const response = await authService.login(formData.value);

  if (response.success) {
    const token = response.data.token;
    const roles = response.data.roles || [];

    authService.setToken(token);
    toast('success', 'Đăng nhập thành công!');

    const isAdmin = Array.isArray(roles) && roles.includes('ROLE_ADMIN');
    if (isAdmin) {
      router.push('/admin');
    } else {
      router.push('/');
    }
  } else {
    showError(response.error.error || 'Đăng nhập thất bại', response.error.message);
  }

  isLoading.value = false;
};
</script>


