<template>
    <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <Icon :name="icon" class="h-5 w-5" :class="iconColor" />
          <h4 class="text-lg font-medium text-gray-800">{{ title }}</h4>
        </div>
        <span v-if="count !== undefined" class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {{ count }}
        </span>
      </div>
      
      <div class="space-y-3">
        <slot />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    title: string
    icon: string
    iconColor: string
    count?: number
  }
  
  defineProps<Props>()
  </script>
  