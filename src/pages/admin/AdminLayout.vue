<template>
  <div class=" mt-5">
    <div class="row">
      <div class="col-12">
        <div class="card mb-4">
          <div class="card-body">
            <h2 class="card-title mb-0">Khu vực quản trị</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-2 mb-2 mb-md-0">
        <div class="list-group">
          <RouterLink
            to="/admin"
            class="list-group-item list-group-item-action"
            exact-active-class="active"
          >
            Tổng quan
          </RouterLink>
          <RouterLink
            to="/admin/users"
            class="list-group-item list-group-item-action"
            active-class="active"
          >
            Quản lý người dùng
          </RouterLink>
          <!-- Sau này có thể thêm các mục khác như /admin/snippets, /admin/settings, ... -->
        </div>
      </div>
      <div class="col-md-10">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
</script>


