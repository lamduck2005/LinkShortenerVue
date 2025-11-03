<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">LinkShortener</RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link active" aria-current="page" to="/">Trang chủ</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/about">Giới thiệu</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
