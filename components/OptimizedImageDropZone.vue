<template>
    <div
      class="optimized-drop-zone"
      :class="{ 
        'border-orange-500 bg-orange-50': isDragging,
        'border-gray-300': !isDragging,
        'opacity-50 pointer-events-none': isUploading
      }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInputRef"
        type="file"
        multiple
        accept="image/*"
        class="hidden"
        :disabled="isUploading"
        @change="handleFileSelect"
      />
  
      <div class="text-center">
        <!-- Upload Icon with Animation -->
        <div class="relative mb-4">
          <Icon 
            name="heroicons:cloud-arrow-up" 
            class="mx-auto h-16 w-16 transition-all duration-300"
            :class="{ 
              'text-orange-500 animate-bounce': isDragging,
              'text-gray-400': !isDragging && !isUploading,
              'text-blue-500 animate-pulse': isUploading
            }"
          />
          
          <!-- Loading Spinner Overlay -->
          <div 
            v-if="isUploading"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
        
        <div class="space-y-2">
          <h4 class="text-lg font-medium text-gray-700">
            {{ isUploading ? 'Uploading Images...' : 'Upload Artwork Images' }}
          </h4>
          
          <p class="text-sm text-gray-500">
            {{ isUploading ? 'Please wait while we process your images' : 'Drag and drop your images here, or' }}
            <span 
              v-if="!isUploading"
              class="text-orange-600 font-medium cursor-pointer hover:text-orange-700 transition-colors duration-200"
            >
              click to browse
            </span>
          </p>
          
          <p class="text-xs text-gray-400">
            PNG, JPG, GIF up to 10MB each • Multiple images supported • Batch upload available
          </p>
        </div>
  
        <!-- Progress Bar -->
        <div v-if="isUploading" class="mt-6">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              :style="{ width: `${uploadProgress}%` }"
            />
          </div>
          <p class="text-xs text-blue-600 mt-2">
            {{ Math.round(uploadProgress) }}% complete
          </p>
        </div>
  
        <!-- Action Buttons -->
        <div v-if="!isUploading" class="mt-6 flex justify-center gap-3">
          <button
            type="button"
            class="btn-outline"
            @click.stop="triggerFileInput"
          >
            <Icon name="heroicons:folder-open" class="h-4 w-4 mr-2" />
            Choose Files
          </button>
          
          <button
            type="button"
            class="btn-outline"
            @click.stop="triggerFileInput"
          >
            <Icon name="heroicons:photo" class="h-4 w-4 mr-2" />
            Batch Upload
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  interface Props {
    isUploading: boolean
    uploadProgress: number
  }
  
  interface Emits {
    (e: 'filesSelected', event: Event): void
    (e: 'filesDropped', event: DragEvent): void
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  
  const fileInputRef = ref<HTMLInputElement>()
  const isDragging = ref(false)
  
  const triggerFileInput = () => {
    if (!props.isUploading) {
      fileInputRef.value?.click()
    }
  }
  
  const handleFileSelect = (event: Event) => {
    emit('filesSelected', event)
  }
  
  const handleDragOver = (event: DragEvent) => {
    if (props.isUploading) return
    event.preventDefault()
    isDragging.value = true
  }
  
  const handleDragLeave = (event: DragEvent) => {
    event.preventDefault()
    isDragging.value = false
  }
  
  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    isDragging.value = false
    
    if (props.isUploading) return
    emit('filesDropped', event)
  }
  </script>
  
  <style scoped>
  .optimized-drop-zone {
    @apply border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50;
    min-height: 200px;
  }
  
  .optimized-drop-zone:hover:not(.opacity-50) {
    @apply border-orange-400;
  }
  
  .btn-outline {
    @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200;
  }
  </style>
  