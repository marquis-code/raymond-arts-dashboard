<template>
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ isEditing ? 'Edit Content' : 'Create New Content' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
  
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Content Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Content Type *
          </label>
          <select
            v-model="formData.type"
            :disabled="isEditing"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            required
          >
            <option value="">Select content type</option>
            <option
              v-for="type in contentTypes"
              :key="type.value"
              :value="type.value"
            >
              {{ type.label }}
            </option>
          </select>
        </div>
  
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            v-model="formData.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter content title"
            required
          />
        </div>
  
        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            v-model="formData.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter content description"
          />
        </div>
  
        <!-- Images -->
        <div v-if="selectedTypeInfo">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Images
            <span v-if="selectedTypeInfo.imageCount > 0" class="text-sm text-gray-500">
              (Required: {{ selectedTypeInfo.imageCount }} image{{ selectedTypeInfo.imageCount > 1 ? 's' : '' }})
            </span>
          </label>
          
          <div class="space-y-4">
            <div
              v-for="(image, index) in formData.images"
              :key="index"
              class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
            >
              <div class="flex-1">
                <input
                  v-model="formData.images[index]"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter image URL or upload file"
                />
              </div>
              
              <div class="flex items-center space-x-2">
                <button
                  type="button"
                  @click="uploadImage(index)"
                  :disabled="uploadingSingle"
                  class="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ uploadingSingle ? 'Uploading...' : 'Upload' }}
                </button>
                
                <button
                  v-if="formData.images.length > (selectedTypeInfo.imageCount || 0)"
                  type="button"
                  @click="removeImage(index)"
                  class="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
  
            <button
              v-if="formData.images.length < (selectedTypeInfo.imageCount || 10)"
              type="button"
              @click="addImageField"
              class="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
            >
              + Add Image
            </button>
          </div>
        </div>
  
        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            v-model="formData.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option
              v-for="status in contentStatuses"
              :key="status.value"
              :value="status.value"
            >
              {{ status.label }}
            </option>
          </select>
        </div>
  
        <!-- Metadata (Dynamic based on content type) -->
        <div v-if="showMetadataFields" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Additional Information</h3>
          
          <!-- Contact Info Metadata -->
          <div v-if="formData.type === 'contact_info'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                v-model="formData.metadata.contactInfo.email.address"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="hello@example.com"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
              <input
                v-model="formData.metadata.contactInfo.email.responseTime"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="I'll respond within 24 hours"
              />
            </div>
          </div>
  
          <!-- About Section Metadata -->
          <div v-if="formData.type === 'about_section'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Biography Paragraphs</label>
              <div
                v-for="(paragraph, index) in formData.metadata.aboutInfo.biography"
                :key="index"
                class="flex items-start space-x-2 mb-2"
              >
                <textarea
                  v-model="formData.metadata.aboutInfo.biography[index]"
                  rows="3"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter biography paragraph"
                />
                <button
                  type="button"
                  @click="removeBiographyParagraph(index)"
                  class="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
              <button
                type="button"
                @click="addBiographyParagraph"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Paragraph
              </button>
            </div>
          </div>
        </div>
  
        <!-- Form Actions -->
        <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading || uploadingSingle"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? 'Saving...' : (isEditing ? 'Update Content' : 'Create Content') }}
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  import { useSingleUploadFile } from '@/composables/core/useSingleUpload'
  
  interface Props {
    contentTypes: any[]
    contentStatuses: any[]
    initialData?: any
    loading?: boolean
  }
  
  const props = withDefaults(defineProps<Props>(), {
    loading: false
  })
  
  const emit = defineEmits<{
    submit: [data: any]
    close: []
  }>()
  
  const { singleUploadFile, loading: uploadingSingle, uploadResponse: singleUploadResponse, error: uploadFileError } = useSingleUploadFile()
  
  const isEditing = computed(() => !!props.initialData)
  
  const formData = ref({
    type: '',
    title: '',
    description: '',
    images: [] as string[],
    status: 'draft',
    metadata: {
      contactInfo: {
        email: {
          address: '',
          responseTime: ''
        }
      },
      aboutInfo: {
        biography: ['']
      }
    }
  })
  
  const selectedTypeInfo = computed(() => {
    return props.contentTypes.find(type => type.value === formData.value.type)
  })
  
  const showMetadataFields = computed(() => {
    return ['contact_info', 'about_section', 'commission_info'].includes(formData.value.type)
  })
  
  // Initialize form data
  onMounted(() => {
    if (props.initialData) {
      formData.value = {
        ...formData.value,
        ...props.initialData,
        images: props.initialData.images || [],
        metadata: {
          ...formData.value.metadata,
          ...props.initialData.metadata
        }
      }
    }
  })
  
  // Watch for type changes to adjust image fields
  watch(() => formData.value.type, (newType) => {
    const typeInfo = props.contentTypes.find(type => type.value === newType)
    if (typeInfo && typeInfo.imageCount > 0) {
      // Ensure we have the required number of image fields
      const currentLength = formData.value.images.length
      if (currentLength < typeInfo.imageCount) {
        for (let i = currentLength; i < typeInfo.imageCount; i++) {
          formData.value.images.push('')
        }
      }
    }
  })
  
  const addImageField = () => {
    formData.value.images.push('')
  }
  
  const removeImage = (index: number) => {
    formData.value.images.splice(index, 1)
  }
  
  const uploadImage = async (index: number) => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          await singleUploadFile(file)
          if (singleUploadResponse.value?.url) {
            formData.value.images[index] = singleUploadResponse.value.url
          }
        }
      }
      input.click()
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }
  
  const addBiographyParagraph = () => {
    formData.value.metadata.aboutInfo.biography.push('')
  }
  
  const removeBiographyParagraph = (index: number) => {
    formData.value.metadata.aboutInfo.biography.splice(index, 1)
  }
  
  const handleSubmit = () => {
    // Clean up empty images
    formData.value.images = formData.value.images.filter(img => img.trim() !== '')
    
    // Clean up empty biography paragraphs
    if (formData.value.metadata.aboutInfo.biography) {
      formData.value.metadata.aboutInfo.biography = formData.value.metadata.aboutInfo.biography.filter(p => p.trim() !== '')
    }
    
    emit('submit', formData.value)
  }
  </script>
  