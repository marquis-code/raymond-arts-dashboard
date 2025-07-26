<template>
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-center gap-3 mb-3">
        <div class="animate-spin">
          <Icon name="heroicons:arrow-path" class="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p class="text-sm font-medium text-blue-800">
            {{ getUploadMessage() }}
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
      
      <div class="flex justify-between items-center mt-2">
        <p class="text-xs text-blue-600">
          {{ Math.round(progress) }}% complete
        </p>
        
        <div class="flex items-center gap-2 text-xs text-blue-600">
          <div 
            v-if="uploadingSingle"
            class="flex items-center gap-1"
          >
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Single Upload</span>
          </div>
          
          <div 
            v-if="uploadingBatch"
            class="flex items-center gap-1"
          >
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Batch Upload</span>
          </div>
        </div>
      </div>
      
      <!-- Upload Type Indicator -->
      <div class="mt-3 flex items-center justify-center">
        <div class="flex items-center gap-4 text-xs">
          <div 
            class="flex items-center gap-2 px-2 py-1 rounded-full"
            :class="uploadingSingle ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'"
          >
            <Icon name="heroicons:photo" class="h-3 w-3" />
            <span>Single</span>
          </div>
          
          <div 
            class="flex items-center gap-2 px-2 py-1 rounded-full"
            :class="uploadingBatch ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
          >
            <Icon name="heroicons:photo" class="h-3 w-3" />
            <span>Batch</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    progress: number
    uploadingSingle: boolean
    uploadingBatch: boolean
    filesCount: number
  }
  
  const props = defineProps<Props>()
  
  const getUploadMessage = () => {
    if (props.uploadingSingle) {
      return 'Uploading 1 image...'
    } else if (props.uploadingBatch) {
      return `Batch uploading ${props.filesCount} images...`
    }
    return `Processing ${props.filesCount} image${props.filesCount > 1 ? 's' : ''}...`
  }
  </script>
  