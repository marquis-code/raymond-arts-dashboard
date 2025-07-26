<template>
    <div v-if="showStatus" class="space-y-3">
      <!-- Single Upload Status -->
      <div 
        v-if="singleResponse || uploadingSingle"
        class="p-3 rounded-lg border"
        :class="getSingleStatusClasses()"
      >
        <div class="flex items-center gap-2">
          <Icon 
            :name="getSingleStatusIcon()" 
            class="h-4 w-4"
            :class="getSingleIconClasses()"
          />
          <span class="text-sm font-medium">
            {{ getSingleStatusMessage() }}
          </span>
        </div>
        
        <!-- Single Upload Details -->
        <div v-if="singleResponse && Array.isArray(singleResponse) && singleResponse.length > 0" class="mt-2 text-xs text-gray-600">
          <div v-for="(item, index) in singleResponse" :key="index" class="truncate">
            ✓ {{ item.originalName || item.name || `File ${index + 1}` }}
          </div>
        </div>
      </div>
  
      <!-- Batch Upload Status -->
      <div 
        v-if="batchResponse || uploadingBatch"
        class="p-3 rounded-lg border"
        :class="getBatchStatusClasses()"
      >
        <div class="flex items-center gap-2">
          <Icon 
            :name="getBatchStatusIcon()" 
            class="h-4 w-4"
            :class="getBatchIconClasses()"
          />
          <span class="text-sm font-medium">
            {{ getBatchStatusMessage() }}
          </span>
        </div>
        
        <!-- Batch Details -->
        <div v-if="batchResponse && Array.isArray(batchResponse) && batchResponse.length > 0" class="mt-2 text-xs text-gray-600">
          <p class="font-medium">Successfully uploaded {{ batchResponse.length }} images:</p>
          <div class="mt-1 space-y-1 max-h-20 overflow-y-auto">
            <div v-for="(item, index) in batchResponse" :key="index" class="truncate">
              ✓ {{ item.originalName || item.name || `File ${index + 1}` }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  interface Props {
    singleResponse: any[]
    batchResponse: any[]
    uploadingSingle: boolean
    uploadingBatch: boolean
  }
  
  const props = defineProps<Props>()
  
  const showStatus = computed(() => {
    return props.singleResponse?.length > 0 || props.batchResponse?.length > 0 || props.uploadingSingle || props.uploadingBatch
  })
  
  // Single Upload Methods
  const getSingleStatusClasses = () => {
    if (props.uploadingSingle) return 'bg-blue-50 border-blue-200'
    if (props.singleResponse?.length > 0) return 'bg-green-50 border-green-200'
    return 'bg-red-50 border-red-200'
  }
  
  const getSingleStatusIcon = () => {
    if (props.uploadingSingle) return 'heroicons:arrow-path'
    if (props.singleResponse?.length > 0) return 'heroicons:check-circle'
    return 'heroicons:x-circle'
  }
  
  const getSingleIconClasses = () => {
    if (props.uploadingSingle) return 'text-blue-600 animate-spin'
    if (props.singleResponse?.length > 0) return 'text-green-600'
    return 'text-red-600'
  }
  
  const getSingleStatusMessage = () => {
    if (props.uploadingSingle) return 'Uploading single image...'
    if (props.singleResponse?.length > 0) return 'Single image uploaded successfully'
    return 'Failed to upload image'
  }
  
  // Batch Upload Methods
  const getBatchStatusClasses = () => {
    if (props.uploadingBatch) return 'bg-blue-50 border-blue-200'
    if (props.batchResponse?.length > 0) return 'bg-green-50 border-green-200'
    return 'bg-red-50 border-red-200'
  }
  
  const getBatchStatusIcon = () => {
    if (props.uploadingBatch) return 'heroicons:arrow-path'
    if (props.batchResponse?.length > 0) return 'heroicons:check-circle'
    return 'heroicons:x-circle'
  }
  
  const getBatchIconClasses = () => {
    if (props.uploadingBatch) return 'text-blue-600 animate-spin'
    if (props.batchResponse?.length > 0) return 'text-green-600'
    return 'text-red-600'
  }
  
  const getBatchStatusMessage = () => {
    if (props.uploadingBatch) return 'Batch uploading images...'
    if (props.batchResponse?.length > 0) return `Batch upload completed: ${props.batchResponse.length} files`
    return 'Batch upload failed'
  }
  </script>
  