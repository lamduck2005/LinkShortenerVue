<template>
  <div class="text-center py-4">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">{{ message }}</span>
    </div>
    <p v-if="showText" class="mt-2 mb-0">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Đang tải...'
  },
  showText: {
    type: Boolean,
    default: false
  }
});
</script>

