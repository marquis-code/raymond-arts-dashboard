<template>
    <div class="flex items-center space-x-3">
      <div class="relative">
        <input
          :id="inputId"
          type="checkbox"
          :checked="checked"
          class="sr-only"
          @change="$emit('update:checked', $event.target.checked)"
        />
        <label
          :for="inputId"
          class="toggle-switch"
          :class="checked ? 'bg-green-600' : 'bg-gray-300'"
        >
          <span
            class="toggle-thumb"
            :class="checked ? 'translate-x-5' : 'translate-x-0'"
          />
        </label>
      </div>
      
      <label
        :for="inputId"
        class="text-sm font-medium text-gray-700 cursor-pointer"
      >
        {{ label }}
      </label>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    checked: boolean
    label: string
  }
  
  interface Emits {
    (e: 'update:checked', value: boolean): void
  }
  
  defineProps<Props>()
  defineEmits<Emits>()
  
  const inputId = `toggle-${Math.random().toString(36).substr(2, 9)}`
  </script>
  
  <style scoped>
  .toggle-switch {
    @apply relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer;
  }
  
  .toggle-thumb {
    @apply inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out;
  }
  </style>
  