<template>
    <div
      class="image-drop-zone"
      :class="{ 
        'border-orange-500 bg-orange-50': isDragging,
        'border-gray-300': !isDragging 
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
        @change="handleFileSelect"
      />
  
      <div class="text-center">
        <Icon 
          name="heroicons:cloud-arrow-up" 
          class="mx-auto h-16 w-16 text-gray-400 mb-4"
          :class="{ 'text-orange-500': isDragging }"
        />
        
        <div class="space-y-2">
          <h4 class="text-lg font-medium text-gray-700">
            Upload Artwork Images
          </h4>
          
          <p class="text-sm text-gray-500">
            Drag and drop your images here, or 
            <span class="text-orange-600 font-medium cursor-pointer hover:text-orange-700">
              click to browse
            </span>
          </p>
          
          <p class="text-xs text-gray-400">
            PNG, JPG, GIF up to 10MB each • Multiple images supported
          </p>
        </div>
  
        <div class="mt-6 flex justify-center">
          <button
            type="button"
            class="btn-outline"
            @click.stop="triggerFileInput"
          >
            <Icon name="heroicons:folder-open" class="h-4 w-4 mr-2" />
            Choose Files
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  interface Emits {
    (e: 'filesSelected', files: FileList): void
    (e: 'filesDropped', files: File[]): void
  }
  
  const emit = defineEmits<Emits>()
  
  const fileInputRef = ref<HTMLInputElement>()
  const isDragging = ref(false)
  
  const triggerFileInput = () => {
    fileInputRef.value?.click()
  }
  
  const handleFileSelect = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      emit('filesSelected', input.files)
    }
  }
  
  const handleDragOver = (event: DragEvent) => {
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
    
    const files = Array.from(event.dataTransfer?.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      emit('filesDropped', imageFiles)
    }
  }
  </script>
  
  <style scoped>
  .image-drop-zone {
    @apply border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50;
  }
  </style>
  