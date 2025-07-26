<template>
    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 animate-fadeIn">
      {{ tag }}
      <button
        type="button"
        class="hover:bg-green-200 rounded-full p-0.5 transition-colors duration-200"
        @click="$emit('remove')"
      >
        <Icon name="heroicons:x-mark" class="h-3 w-3" />
      </button>
    </span>
  </template>
  
  <script setup lang="ts">
  interface Props {
    tag: string
  }
  
  interface Emits {
    (e: 'remove'): void
  }
  
  defineProps<Props>()
  defineEmits<Emits>()
  </script>
  
  <style scoped>
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  