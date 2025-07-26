<template>
    <div class="relative group">
      <div class="aspect-square overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100">
        <img
          :src="image || '/placeholder.svg'"
          :alt="`Preview ${index + 1}`"
          class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          :class="{ 'opacity-50': isUploading }"
        />
        
        <!-- Loading Overlay -->
        <div 
          v-if="isUploading"
          class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20"
        >
          <div class="animate-spin">
            <Icon name="heroicons:arrow-path" class="h-6 w-6 text-white" />
          </div>
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
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    image: string
    index: number
    isMain: boolean
    isUploading: boolean
  }
  
  interface Emits {
    (e: 'remove'): void
  }
  
  defineProps<Props>()
  defineEmits<Emits>()
  </script>
  