<template>
    <div class="space-y-4">
      <!-- Image Grid -->
      <div 
        v-if="images.length > 0"
        class="grid grid-cols-2 sm:grid-cols-3 gap-4"
      >
        <OptimizedImagePreviewCard
          v-for="(image, index) in images"
          :key="`optimized-image-${index}`"
          :image="image"
          :uploaded-url="uploadedUrls[index]"
          :index="index"
          :is-main="index === 0"
          :is-uploading="isUploading"
          @remove="$emit('removeImage', index)"
        />
      </div>
      
      <!-- Empty State -->
      <div 
        v-else
        class="flex items-center justify-center h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
      >
        <div class="text-center">
          <Icon name="heroicons:photo" class="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p class="text-sm text-gray-500">No images uploaded yet</p>
          <p class="text-xs text-gray-400 mt-1">Upload images to see previews here</p>
        </div>
      </div>
      
      <!-- Grid Actions -->
      <div v-if="images.length > 0" class="flex items-center justify-between pt-4 border-t border-gray-200">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <Icon name="heroicons:photo" class="h-4 w-4" />
          <span>{{ images.length }} image{{ images.length > 1 ? 's' : '' }}</span>
          <span v-if="uploadedCount > 0" class="text-green-600">
            ({{ uploadedCount }} uploaded)
          </span>
        </div>
        
        <div class="flex items-center gap-2">
          <button
            v-if="images.length > 1"
            type="button"
            class="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200"
            @click="handleReorderImages"
          >
            Reorder Images
          </button>
          
          <button
            type="button"
            class="text-xs text-red-600 hover:text-red-800 transition-colors duration-200"
            @click="handleClearAll"
          >
            Clear All
          </button>
        </div>
      </div>
      
      <!-- Upload Statistics -->
      <div v-if="images.length > 0" class="bg-gray-50 rounded-lg p-3">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-lg font-semibold text-gray-800">{{ images.length }}</p>
            <p class="text-xs text-gray-600">Total Images</p>
          </div>
          
          <div>
            <p class="text-lg font-semibold text-green-600">{{ uploadedCount }}</p>
            <p class="text-xs text-gray-600">Uploaded</p>
          </div>
          
          <div>
            <p class="text-lg font-semibold text-blue-600">{{ pendingCount }}</p>
            <p class="text-xs text-gray-600">Pending</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  interface Props {
    images: string[]
    uploadedUrls: string[]
    isUploading: boolean
  }
  
  interface Emits {
    (e: 'removeImage', index: number): void
    (e: 'reorderImages', newOrder: string[]): void
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  
  const uploadedCount = computed(() => {
    return props.uploadedUrls.filter(url => url && url.length > 0).length
  })
  
  const pendingCount = computed(() => {
    return props.images.length - uploadedCount.value
  })
  
  const handleReorderImages = () => {
    // Simple reorder - move first image to last
    if (props.images.length > 1) {
      const newOrder = [...props.images.slice(1), props.images[0]]
      emit('reorderImages', newOrder)
    }
  }
  
  const handleClearAll = () => {
    if (confirm('Are you sure you want to remove all images?')) {
      // Emit remove for each image in reverse order
      for (let i = props.images.length - 1; i >= 0; i--) {
        emit('removeImage', i)
      }
    }
  }
  </script>
  