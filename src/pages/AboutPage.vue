<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card card-body">
          <h1 class="mb-3">Giới thiệu dự án</h1>
          <p class="lead">
            Link Shortener là một hệ thống rút gọn liên kết cho phép bạn tạo các link rút gọn với tính năng nâng cao như đặt mật khẩu, thời gian hết hạn và tạo mã QR code. Hệ thống sử dụng Spring Boot và Vue 3 để xây dựng.
          </p>

          <p>
            Các chức năng chính của hệ thống:
          </p>
          <ul>
            <li>Tạo liên kết hoặc văn bản rút gọn</li>
            <li>Đặt mật khẩu cho liên kết</li>
            <li>Thiết lập thời gian hết hạn cho liên kết</li>
            <li>Tạo mã QR code cho liên kết</li>
            <li>Quản lý liên kết</li>
            <li>...</li>
          </ul>

          <div>
            <p>Liên kết tới các trang khác:</p>
            <ul>
              <li><a :href="`${baseUrl}/swagger-ui.html`">API Documentation</a></li>
            </ul>
          </div>

          <hr />

          <div class="d-flex flex-column flex-sm-row justify-content-between gap-2">
            <RouterLink to="/" class="btn btn-primary">
              Tạo link rút gọn mới
            </RouterLink>
            <a
              class="btn btn-secondary"
              href="https://github.com/lamduck2005/linkshortener"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mã nguồn dự án
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
</script>


