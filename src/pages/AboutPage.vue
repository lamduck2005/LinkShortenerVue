<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card card-body">
          <h1 class="mb-3">Giới thiệu dự án</h1>
          <p class="lead">
            Đây là một ứng dụng rút gọn liên kết (Link Shortener) xây dựng với Vue,
            cho phép bạn tạo các link ngắn gọn, có thể đặt mật khẩu và thiết lập thời gian hết hạn.
          </p>

          <p>
            Sau khi tạo link, bạn có thể chia sẻ cho người khác. Hệ thống sẽ tự xử lý:
          </p>
          <ul>
            <li>Chuyển hướng (redirect) tới URL gốc nếu là link.</li>
            <li>Hiển thị nội dung văn bản nếu là TEXT.</li>
            <li>Yêu cầu mật khẩu nếu link được bảo vệ.</li>
            <li>Thông báo khi link hết hạn hoặc không tồn tại.</li>
          </ul>

          <hr />

          <div class="d-flex flex-column flex-sm-row justify-content-between gap-2">
            <RouterLink to="/" class="btn btn-primary">
              Tạo link rút gọn mới
            </RouterLink>
            <a
              class="btn btn-outline-secondary"
              href="https://github.com/lamduck2005"
              target="_blank"
              rel="noopener noreferrer"
            >
              Xem GitHub của tôi
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>


