<template>
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-center gap-3 mb-3">
        <div class="animate-spin">
          <Icon name="heroicons:arrow-path" class="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p class="text-sm font-medium text-blue-800">
            Uploading {{ filesCount }} image{{ filesCount > 1 ? 's' : '' }}...
          </p>
          <p class="text-xs text-blue-600">
            Please wait while we process your images
          </p>
        </div>
      </div>
      
      <div class="w-full bg-blue-200 rounded-full h-2">
        <div 
          class="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          :style="{ width: `${progress}%` }"
        />
      </div>
      
      <p class="text-xs text-blue-600 mt-2 text-right">
        {{ Math.round(progress) }}% complete
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    progress: number
    filesCount: number
  }
  
  defineProps<Props>()
  </script>
  