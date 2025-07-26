<template>
    <div class="form-field">
      <label v-if="label" class="form-label">
        {{ label }}
        <span v-if="required" class="text-red-500 ml-1">*</span>
      </label>
      
      <div class="relative">
        <slot />
        
        <div 
          v-if="tooltip"
          class="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <Icon 
            name="heroicons:information-circle" 
            class="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help"
            :title="tooltip"
          />
        </div>
      </div>
      
      <p v-if="error" class="form-error">
        {{ error }}
      </p>
      
      <p v-if="hint" class="form-hint">
        {{ hint }}
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    label?: string
    required?: boolean
    error?: string
    hint?: string
    tooltip?: string
  }
  
  defineProps<Props>()
  </script>
  
  <style scoped>
  .form-field {
    @apply space-y-1;
  }
  
  .form-label {
    @apply block text-sm font-medium text-gray-700;
  }
  
  .form-error {
    @apply text-sm text-red-600;
  }
  
  .form-hint {
    @apply text-sm text-gray-500;
  }
  </style>
  