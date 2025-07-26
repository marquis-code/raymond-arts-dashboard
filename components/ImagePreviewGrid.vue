<template>
    <div class="space-y-4">
      <div 
        v-if="images.length > 0"
        class="grid grid-cols-2 sm:grid-cols-3 gap-4"
      >
        <ImagePreviewCard
          v-for="(image, index) in images"
          :key="`image-${index}`"
          :image="image"
          :index="index"
          :is-main="index === 0"
          :is-uploading="isUploading"
          @remove="$emit('removeImage', index)"
        />
      </div>
      
      <div 
        v-else
        class="flex items-center justify-center h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
      >
        <div class="text-center">
          <Icon name="heroicons:photo" class="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p class="text-sm text-gray-500">No images uploaded yet</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    images: string[]
    isUploading: boolean
  }
  
  interface Emits {
    (e: 'removeImage', index: number): void
    (e: 'reorderImages', newOrder: string[]): void
  }
  
  defineProps<Props>()
  defineEmits<Emits>()
  </script>
  