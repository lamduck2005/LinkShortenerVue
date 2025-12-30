<template>
  <button
    type="button"
    :class="buttonClass"
    @click="handleCopy"
    :title="title"
  >
    <ClipboardIcon class="hero-icon" />
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { ClipboardIcon } from '@heroicons/vue/24/outline';
import { copyToClipboard } from '@/others/utils';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'outline-secondary',
    validator: (value) => ['outline-secondary', 'secondary', 'primary', 'outline-primary'].includes(value)
  },
  title: {
    type: String,
    default: 'Copy'
  }
});

const buttonClass = computed(() => {
  const sizeClass = props.size === 'sm' ? 'btn-sm' : props.size === 'lg' ? 'btn-lg' : '';
  return `btn btn-${props.variant} ${sizeClass}`.trim();
});

const handleCopy = () => {
  copyToClipboard(props.text);
};
</script>

