<template>
  <div class="input-group">
    <input
      :value="modelValue"
      :type="passwordFieldType"
      :id="id"
      :class="inputClass"
      :placeholder="placeholder"
      :required="required"
      :minlength="minlength"
      :maxlength="maxlength"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button class="btn btn-outline-secondary" type="button" @click="togglePasswordVisibility">
      <EyeIcon v-if="passwordFieldType === 'password'" class="hero-icon" />
      <EyeSlashIcon v-else class="hero-icon" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: 'password'
  },
  inputClass: {
    type: String,
    default: 'form-control'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  minlength: {
    type: [Number, String],
    default: null
  },
  maxlength: {
    type: [Number, String],
    default: null
  }
});

defineEmits(['update:modelValue']);

const passwordFieldType = ref('password');

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
};
</script>

