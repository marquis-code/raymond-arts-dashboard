<template>
    <div class="space-y-8">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Images & Media</h2>
        <p class="text-gray-600">Upload high-quality images to showcase your product</p>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column - Upload Area -->
        <div class="space-y-6">
          <!-- Single Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Main Product Image *
            </label>
            <div
              @drop="handleSingleDrop"
              @dragover.prevent
              @dragenter.prevent
              class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200"
              :class="{ 'border-blue-400 bg-blue-50': isDraggingSingle }"
            >
              <div v-if="!mainImage">
                <Icon name="lucide:upload-cloud" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600 mb-2">Drop your main image here, or</p>
                <button
                  type="button"
                  @click="triggerSingleUpload"
                  :disabled="uploadingSingle"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                >
                  <Icon v-if="uploadingSingle" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
                  {{ uploadingSingle ? 'Uploading...' : 'Browse Files' }}
                </button>
                <p class="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
              </div>
              
              <div v-else class="relative">
                <img :src="mainImage" alt="Main product image" class="w-full h-48 object-cover rounded-lg" />
                <button
                  @click="removeMainImage"
                  class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  <Icon name="lucide:x" class="w-4 h-4" />
                </button>
              </div>
            </div>
            <input
              ref="singleFileInput"
              type="file"
              accept="image/*"
              @change="handleSingleFileSelect"
              class="hidden"
            />
          </div>
  
          <!-- Multiple Images Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Additional Images
            </label>
            <div
              @drop="handleBatchDrop"
              @dragover.prevent
              @dragenter.prevent
              class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200"
              :class="{ 'border-blue-400 bg-blue-50': isDraggingBatch }"
            >
              <Icon name="lucide:images" class="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p class="text-gray-600 mb-2">Drop multiple images here, or</p>
              <button
                type="button"
                @click="triggerBatchUpload"
                :disabled="uploadingBatch"
                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
              >
                <Icon v-if="uploadingBatch" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
                {{ uploadingBatch ? 'Uploading...' : 'Browse Files' }}
              </button>
              <p class="text-xs text-gray-500 mt-2">Select multiple files</p>
            </div>
            <input
              ref="batchFileInput"
              type="file"
              accept="image/*"
              multiple
              @change="handleBatchFileSelect"
              class="hidden"
            />
          </div>
        </div>
  
        <!-- Right Column - Image Gallery -->
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Image Gallery</h3>
            
            <div v-if="localData.images.length === 0" class="text-center py-12 bg-gray-50 rounded-xl">
              <Icon name="lucide:image" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p class="text-gray-500">No images uploaded yet</p>
              <p class="text-sm text-gray-400">Upload images to see them here</p>
            </div>
            
            <div v-else class="grid grid-cols-2 gap-4">
              <div
                v-for="(image, index) in localData.images"
                :key="index"
                class="relative group"
              >
                <img
                  :src="image"
                  :alt="`Product image ${index + 1}`"
                  class="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <button
                    @click="removeImage(index)"
                    class="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                  >
                    <Icon name="lucide:trash-2" class="w-4 h-4" />
                  </button>
                </div>
                <div class="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                  {{ index + 1 }}
                </div>
              </div>
            </div>
          </div>
  
          <!-- Image Guidelines -->
          <div class="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 class="text-lg font-semibold text-blue-900 mb-3">📸 Image Guidelines</h3>
            <ul class="space-y-2 text-sm text-blue-800">
              <li class="flex items-start">
                <Icon name="lucide:check" class="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                Use high-resolution images (at least 1000x1000px)
              </li>
              <li class="flex items-start">
                <Icon name="lucide:check" class="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                Show product from multiple angles
              </li>
              <li class="flex items-start">
                <Icon name="lucide:check" class="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                Use good lighting and clean backgrounds
              </li>
              <li class="flex items-start">
                <Icon name="lucide:check" class="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                Include lifestyle shots showing product in use
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import Icon from '~~/components/Icon.vue'
  
  interface Props {
    modelValue: any
    uploadingSingle: boolean
    uploadingBatch: boolean
    singleUploadResponse: any
    batchUploadResponse: any
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits(['update:modelValue', 'validate', 'uploadSingle', 'uploadBatch'])
  
  const localData = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const singleFileInput = ref<HTMLInputElement | null>(null)
  const batchFileInput = ref<HTMLInputElement | null>(null)
  const isDraggingSingle = ref(false)
  const isDraggingBatch = ref(false)
  
  const mainImage = computed(() => {
    return localData.value.images[0] || null
  })
  
  const triggerSingleUpload = () => {
    singleFileInput.value?.click()
  }
  
  const triggerBatchUpload = () => {
    batchFileInput.value?.click()
  }
  
  const handleSingleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
      emit('uploadSingle', target.files[0])
    }
  }
  
  const handleBatchFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      emit('uploadBatch', Array.from(target.files))
    }
  }
  
  const handleSingleDrop = (event: DragEvent) => {
    event.preventDefault()
    isDraggingSingle.value = false
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      emit('uploadSingle', event.dataTransfer.files[0])
    }
  }
  
  const handleBatchDrop = (event: DragEvent) => {
    event.preventDefault()
    isDraggingBatch.value = false
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      emit('uploadBatch', Array.from(event.dataTransfer.files))
    }
  }
  
  const removeMainImage = () => {
    if (localData.value.images.length > 0) {
      localData.value.images.splice(0, 1)
    }
  }
  
  const removeImage = (index: number) => {
    localData.value.images.splice(index, 1)
  }
  
  // Watch for upload responses
  watch(() => props.singleUploadResponse, (response) => {
    if (response?.url) {
      if (localData.value.images.length === 0) {
        localData.value.images.push(response.url)
      } else {
        localData.value.images[0] = response.url
      }
    }
  })
  
  watch(() => props.batchUploadResponse, (response) => {
    if (response?.urls && Array.isArray(response.urls)) {
      localData.value.images.push(...response.urls)
    }
  })
  
  const validateStep = () => {
    const isValid = localData.value.images.length > 0
    emit('validate', isValid)
    return isValid
  }
  
  watch(() => localData.value.images, validateStep, { deep: true, immediate: true })
  </script>
  