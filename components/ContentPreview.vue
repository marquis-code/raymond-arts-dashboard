<template>
    <div class="space-y-2">
      <h5 class="text-sm font-medium text-gray-700">{{ title }}</h5>
      <div 
        class="text-sm text-gray-600 bg-gray-50 rounded p-3 max-h-32 overflow-y-auto"
        v-html="content"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    title: string
    content: string
  }
  
  defineProps<Props>()
  </script>
  