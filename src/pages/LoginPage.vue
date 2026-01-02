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
              <PasswordInput
                v-model="formData.password"
                id="password"
                required
              />
            </div>

            <div class="mb-3 d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <span class="fw-semibold">Tài khoản mặc định:</span>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-success" @click="fillDefaultAccount('admin')">Quản trị viên</button>
                <button type="button" class="btn btn-success" @click="fillDefaultAccount('user')">Người dùng</button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
              <span v-else>Đăng nhập</span>
            </button>
          </form>

          <hr />
          <button class="btn btn-light w-100" @click="handleGoogleLogin">
            Hoặc đăng nhập bằng 
            <b>
              <img src="https://img.icons8.com/?size=24&id=17949&format=png&color=000000" alt="">
              <span class="ms-2">Google</span>
            </b>
          </button>
          

          <p class="text-center mb-0 mt-3">
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
import authService from '@/services/auth-service';
import { showError, showToast } from '@/services/alert-service';
import PasswordInput from '@/components/common/PasswordInput.vue';

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
    const userInfo = response.data.userInfo;

    authService.setToken(token, userInfo);
    showToast('success', 'Đăng nhập thành công!');

    if (authService.isAdmin()) {
      router.push('/admin');
    } else {
      router.push('/');
    }
  } else {
    showError(response.error.error || 'Đăng nhập thất bại', response.error.message);
  }

  isLoading.value = false;
};

const fillDefaultAccount = (accountType) => {
  formData.value.username = accountType === 'admin' ? 'admin' : 'user';
  formData.value.password = '123456';
};

const handleGoogleLogin = () => {
  window.location.href = authService.getOAuth2GoogleUrl();
};
</script>


