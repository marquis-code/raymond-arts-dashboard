<template>
    <div class="relative group">
      <div class="aspect-square overflow-hidden rounded-lg border-2 bg-gray-100 transition-all duration-200"
           :class="{
             'border-green-300': isUploaded,
             'border-blue-300': !isUploaded && !isUploading,
             'border-orange-300': isUploading
           }">
        
        <img
          :src="displayImage"
          :alt="`Preview ${index + 1}`"
          class="w-full h-full object-cover transition-all duration-200"
          :class="{ 
            'opacity-50': isUploading,
            'group-hover:scale-105': !isUploading
          }"
          @error="handleImageError"
        />
        
        <!-- Upload Status Overlay -->
        <div 
          v-if="isUploading"
          class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40"
        >
          <div class="text-center text-white">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
            <p class="text-xs">Uploading...</p>
          </div>
        </div>
        
        <!-- Success Overlay -->
        <div 
          v-else-if="isUploaded"
          class="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1"
        >
          <Icon name="heroicons:check-circle" class="h-4 w-4" />
        </div>
        
        <!-- Action Overlay -->
        <div 
          v-else
          class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
        >
          <button
            type="button"
            class="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200"
            @click="$emit('remove')"
          >
            <Icon name="heroicons:trash" class="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <!-- Image Info -->
      <div class="mt-2 text-center">
        <p class="text-xs font-medium text-gray-700">
          Image {{ index + 1 }}
          <span v-if="isMain" class="text-orange-600">(Main)</span>
        </p>
        
        <div class="flex items-center justify-center gap-1 mt-1">
          <StatusBadge
            v-if="isUploaded"
            label="Uploaded"
            color="green"
            size="sm"
          />
          <StatusBadge
            v-else-if="isUploading"
            label="Uploading"
            color="orange"
            size="sm"
          />
          <StatusBadge
            v-else
            label="Preview"
            color="blue"
            size="sm"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  interface Props {
    image: string
    uploadedUrl?: string
    index: number
    isMain: boolean
    isUploading: boolean
  }
  
  interface Emits {
    (e: 'remove'): void
  }
  
  const props = defineProps<Props>()
  defineEmits<Emits>()
  
  const isUploaded = computed(() => {
    return props.uploadedUrl && props.uploadedUrl !== props.image
  })
  
  const displayImage = computed(() => {
    return props.uploadedUrl || props.image || '/placeholder.svg'
  })
  
  const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    img.src = '/placeholder.svg'
  }
  </script>
  