<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">LinkShortener</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link" aria-current="page" to="/">Trang chủ</RouterLink>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/me">Thông tin cá nhân</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/about">Giới thiệu</RouterLink>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto align-items-center">
          <li v-if="!isAuthenticated" class="nav-item me-2">
            <RouterLink class="btn btn-outline-primary btn-sm" to="/login">Đăng nhập</RouterLink>
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <RouterLink class="btn btn-primary btn-sm" to="/signup">Đăng ký</RouterLink>
          </li>
          <li v-else class="nav-item d-flex align-items-center">
            <span class="navbar-text me-2">
              Xin chào, <strong>{{ username }}</strong>
            </span>
            <button class="btn btn-outline-danger btn-sm" type="button" @click="handleLogout">
              Đăng xuất
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';
import { toast, confirmAction } from '@/services/alertService';

const router = useRouter();

const isAuthenticated = computed(() => authService.isAuthenticated.value);
const username = computed(() => authService.getUsernameFromToken() || 'User');

const handleLogout = async () => {
  const confirmed = await confirmAction('Xác nhận đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?');
  if (!confirmed) {
    return;
  }
  authService.logout();
  toast('success', 'Đã đăng xuất');
  router.push('/');
};
</script>
