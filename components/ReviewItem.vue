<template>
    <div class="flex" :class="compact ? 'text-sm' : ''">
      <span class="font-medium text-gray-700 min-w-[120px]">{{ label }}:</span>
      <span 
        class="text-gray-600 flex-1"
        :class="{ 'truncate': truncate }"
        :title="truncate ? value : undefined"
      >
        {{ value || 'Not specified' }}
      </span>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    label: string
    value: string | number
    compact?: boolean
    truncate?: boolean
  }
  
  defineProps<Props>()
  </script>
  