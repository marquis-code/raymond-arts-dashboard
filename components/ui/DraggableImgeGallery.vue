<template>
    <div>
      <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Icon name="lucide:image" class="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
        Image Gallery
        <span v-if="images.length > 0" class="ml-2 text-sm text-gray-500">({{ images.length }})</span>
      </h3>
      
      <div v-if="images.length === 0" class="text-center py-8 sm:py-12 bg-gray-50 rounded-xl border border-gray-200">
        <Icon name="lucide:image" class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 text-sm sm:text-base">No images uploaded yet</p>
        <p class="text-xs sm:text-sm text-gray-400">Upload images to see them here</p>
      </div>
      
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div
          v-for="(image, index) in images"
          :key="`image-${index}`"
          :draggable="true"
          @dragstart="handleDragStart(index, $event)"
          @dragover.prevent
          @dragenter.prevent
          @drop="handleDrop(index, $event)"
          @dragend="handleDragEnd"
          :class="[
            'relative group cursor-move transition-all duration-200',
            draggedIndex === index ? 'opacity-50 scale-95' : '',
            dropTargetIndex === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''
          ]"
        >
          <img
            :src="image"
            :alt="`Product image ${index + 1}`"
            class="w-full h-24 sm:h-32 object-cover rounded-lg border border-gray-200 transition-transform duration-200 group-hover:scale-105"
          />
          
          <!-- Overlay with controls -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
            <div class="opacity-0 group-hover:opacity-100 flex items-center space-x-2 transition-opacity duration-200">
              <button
                @click="removeImage(index)"
                class="p-1.5 sm:p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg"
                title="Remove image"
              >
                <Icon name="lucide:trash-2" class="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                @click="setAsMain(index)"
                v-if="index !== 0"
                class="p-1.5 sm:p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 shadow-lg"
                title="Set as main image"
              >
                <Icon name="lucide:star" class="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
          
          <!-- Position indicator -->
          <div class="absolute top-2 left-2 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-black bg-opacity-50 text-white text-xs rounded flex items-center">
            <Icon v-if="index === 0" name="lucide:star" class="w-3 h-3 mr-1 text-yellow-400" />
            {{ index + 1 }}
          </div>
          
          <!-- Drag handle -->
          <div class="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Icon name="lucide:grip-vertical" class="w-3 h-3" />
          </div>
        </div>
      </div>
      
      <!-- Drag instructions -->
      <div v-if="images.length > 1" class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-blue-800 text-xs sm:text-sm flex items-center">
          <Icon name="lucide:info" class="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Drag and drop images to reorder them. The first image will be used as the main product image.
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import Icon from '@/components/Icon.vue'
  
  interface Props {
    images: string[]
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits(['update:images', 'remove-image'])
  
  const draggedIndex = ref<number | null>(null)
  const dropTargetIndex = ref<number | null>(null)
  
  const handleDragStart = (index: number, event: DragEvent) => {
    draggedIndex.value = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/html', index.toString())
    }
  }
  
  const handleDrop = (targetIndex: number, event: DragEvent) => {
    event.preventDefault()
    
    if (draggedIndex.value === null || draggedIndex.value === targetIndex) {
      return
    }
    
    const newImages = [...props.images]
    const draggedImage = newImages[draggedIndex.value]
    
    // Remove the dragged image
    newImages.splice(draggedIndex.value, 1)
    
    // Insert at new position
    const insertIndex = draggedIndex.value < targetIndex ? targetIndex - 1 : targetIndex
    newImages.splice(insertIndex, 0, draggedImage)
    
    emit('update:images', newImages)
    
    // Reset drag state
    draggedIndex.value = null
    dropTargetIndex.value = null
  }
  
  const handleDragEnd = () => {
    draggedIndex.value = null
    dropTargetIndex.value = null
  }
  
  const removeImage = (index: number) => {
    emit('remove-image', index)
  }
  
  const setAsMain = (index: number) => {
    const newImages = [...props.images]
    const selectedImage = newImages[index]
    
    // Remove from current position
    newImages.splice(index, 1)
    
    // Add to beginning
    newImages.unshift(selectedImage)
    
    emit('update:images', newImages)
  }
  </script>
  