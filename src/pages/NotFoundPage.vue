<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 mx-auto text-center">
        <div class="card card-body">
          <h1 class="display-1 text-danger">404</h1>
          <h2 class="mb-3">Không tìm thấy</h2>
          <p class="lead">
            Rất tiếc, link rút gọn
            <code v-if="shortCode">{{ shortCode }}</code>
            không tồn tại hoặc đã bị xóa.
          </p>
          <RouterLink to="/" class="btn btn-primary mt-3">
            Quay về Trang chủ
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const shortCode = computed(() => route.query.code);
</script>
