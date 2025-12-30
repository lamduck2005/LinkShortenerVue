<template>
  <span :class="badgeClass">
    {{ badgeText }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['password', 'active', 'expired'].includes(value)
  },
  status: {
    type: [Boolean, String],
    required: true
  }
});

const badgeClass = computed(() => {
  const baseClass = 'badge';
  
  if (props.type === 'password') {
    return props.status 
      ? `${baseClass} bg-warning text-dark`
      : `${baseClass} bg-secondary`;
  }
  
  if (props.type === 'active') {
    return props.status 
      ? `${baseClass} bg-success`
      : `${baseClass} bg-danger`;
  }
  
  if (props.type === 'expired') {
    return props.status 
      ? `${baseClass} bg-success`
      : `${baseClass} bg-danger`;
  }
  
  return baseClass;
});

const badgeText = computed(() => {
  if (props.type === 'password') {
    return props.status ? 'Có mật khẩu' : 'Không mật khẩu';
  }
  
  if (props.type === 'active') {
    return props.status ? 'Hoạt động' : 'Không hoạt động';
  }
  
  if (props.type === 'expired') {
    return props.status ? 'Còn hiệu lực' : 'Đã hết hạn';
  }
  
  return '';
});
</script>

