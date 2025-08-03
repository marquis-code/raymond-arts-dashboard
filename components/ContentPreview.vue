<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-white">Content Preview</h2>
            <p class="text-blue-100 mt-1">{{ content?.title || 'Untitled' }}</p>
          </div>
          <button
            @click="$emit('close')"
            class="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
        <!-- Basic Info -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-900">{{ content?.title || 'Untitled' }}</h3>
            <span
              :class="getStatusBadgeClass(content?.status)"
              class="px-3 py-1 text-sm font-medium rounded-full"
            >
              {{ getStatusLabel(content?.status) }}
            </span>
          </div>
          
          <div class="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
              {{ getTypeLabel(content?.type) }}
            </span>
            <span>{{ content?.images?.length || 0 }} image{{ (content?.images?.length || 0) !== 1 ? 's' : '' }}</span>
            <span>Updated {{ formatDate(content?.updatedAt || new Date().toISOString()) }}</span>
          </div>
          
          <p v-if="content?.description" class="text-gray-700 leading-relaxed">
            {{ content.description }}
          </p>
        </div>

        <!-- Images -->
        <div v-if="content?.images && content.images.length > 0" class="mb-8">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Images</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(image, index) in content.images"
              :key="index"
              class="relative group"
            >
              <img
                :src="image"
                :alt="content.metadata?.altText?.[index] || `Image ${index + 1}`"
                class="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                @error="handleImageError"
              />
              <div v-if="content.metadata?.captions?.[index]" class="mt-2 text-sm text-gray-600">
                {{ content.metadata.captions[index] }}
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Info Preview -->
        <div v-if="content?.type === 'contact_info' && content.metadata?.contactInfo" class="mb-8">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
          
          <!-- Email -->
          <div v-if="content.metadata.contactInfo.email?.address" class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h5 class="font-medium text-gray-900 mb-2">Email</h5>
            <p class="text-gray-700">{{ content.metadata.contactInfo.email.address }}</p>
            <p v-if="content.metadata.contactInfo.email.responseTime" class="text-sm text-gray-600 mt-1">
              {{ content.metadata.contactInfo.email.responseTime }}
            </p>
          </div>

          <!-- Locations -->
          <div v-if="content.metadata.contactInfo.locations?.length" class="mb-6">
            <h5 class="font-medium text-gray-900 mb-3">Office Locations</h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="(location, index) in content.metadata.contactInfo.locations"
                :key="index"
                class="p-4 bg-gray-50 rounded-lg"
              >
                <h6 class="font-medium text-gray-900">{{ location.name }}</h6>
                <p class="text-gray-700 mt-1">{{ location.address }}</p>
                <p class="text-gray-600 mt-1">{{ location.phone }}</p>
              </div>
            </div>
          </div>

          <!-- Social Media -->
          <div v-if="content.metadata.contactInfo.socialMedia?.length" class="mb-6">
            <h5 class="font-medium text-gray-900 mb-3">Social Media</h5>
            <div class="flex flex-wrap gap-3">
              <a
                v-for="(social, index) in content.metadata.contactInfo.socialMedia"
                :key="index"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <span>{{ social.platform }}</span>
                <span v-if="social.username" class="text-blue-600">{{ social.username }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- About Info Preview -->
        <div v-if="content?.type === 'about_section' && content.metadata?.aboutInfo" class="mb-8">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">About Information</h4>
          
          <!-- Biography -->
          <div v-if="content.metadata.aboutInfo.biography?.length" class="mb-6">
            <h5 class="font-medium text-gray-900 mb-3">Biography</h5>
            <div class="space-y-4">
              <p
                v-for="(paragraph, index) in content.metadata.aboutInfo.biography"
                :key="index"
                class="text-gray-700 leading-relaxed"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="content.metadata.aboutInfo.birthYear" class="p-4 bg-gray-50 rounded-lg">
              <h6 class="font-medium text-gray-900 mb-2">Birth Year</h6>
              <p class="text-gray-700">{{ content.metadata.aboutInfo.birthYear }}</p>
            </div>
            
            <div v-if="content.metadata.aboutInfo.profession?.length" class="p-4 bg-gray-50 rounded-lg">
              <h6 class="font-medium text-gray-900 mb-2">Professions</h6>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="profession in content.metadata.aboutInfo.profession"
                  :key="profession"
                  class="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {{ profession }}
                </span>
              </div>
            </div>
            
            <div v-if="content.metadata.aboutInfo.artisticMediums?.length" class="p-4 bg-gray-50 rounded-lg">
              <h6 class="font-medium text-gray-900 mb-2">Artistic Mediums</h6>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="medium in content.metadata.aboutInfo.artisticMediums"
                  :key="medium"
                  class="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                >
                  {{ medium }}
                </span>
              </div>
            </div>
            
            <div v-if="content.metadata.aboutInfo.interests?.length" class="p-4 bg-gray-50 rounded-lg">
              <h6 class="font-medium text-gray-900 mb-2">Interests</h6>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="interest in content.metadata.aboutInfo.interests"
                  :key="interest"
                  class="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                >
                  {{ interest }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Commission Info Preview -->
        <div v-if="content?.type === 'commission_info'" class="mb-8">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Commission Information</h4>
          
          <!-- Sizes -->
          <div v-if="content.metadata?.sizes?.length" class="mb-6">
            <h5 class="font-medium text-gray-900 mb-3">Available Sizes</h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="(size, index) in content.metadata.sizes"
                :key="index"
                class="p-4 bg-gray-50 rounded-lg"
              >
                <h6 class="font-medium text-gray-900">{{ size.name }}</h6>
                <p class="text-gray-700">{{ size.dimensions }}</p>
                <p v-if="size.price" class="text-green-600 font-medium mt-1">${{ size.price }}</p>
              </div>
            </div>
          </div>

          <!-- Sections -->
          <div v-if="content.metadata?.sections?.length" class="mb-6">
            <h5 class="font-medium text-gray-900 mb-3">Information Sections</h5>
            <div class="space-y-6">
              <div
                v-for="section in sortedSections"
                :key="section.order"
                class="p-6 bg-gray-50 rounded-lg"
              >
                <h6 class="font-semibold text-gray-900 mb-3">{{ section.title }}</h6>
                <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ section.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            @click="$emit('close')"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Close
          </button>
          <button
            @click="$emit('edit', content)"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
          >
            Edit Content
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  content: any
  contentTypes?: any[]
  contentStatuses?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  contentTypes: () => [],
  contentStatuses: () => []
})

const emit = defineEmits<{
  close: []
  edit: [content: any]
}>()

const sortedSections = computed(() => {
  if (!props.content?.metadata?.sections) return []
  return [...props.content.metadata.sections].sort((a, b) => a.order - b.order)
})

const getStatusBadgeClass = (status?: string) => {
  if (!status || !props.contentStatuses?.length) {
    return 'bg-gray-100 text-gray-800'
  }
  
  const statusInfo = props.contentStatuses.find(s => s.value === status)
  const color = statusInfo?.color || 'gray'
  
  return {
    'bg-green-100 text-green-800': color === 'green',
    'bg-red-100 text-red-800': color === 'red',
    'bg-yellow-100 text-yellow-800': color === 'yellow',
    'bg-blue-100 text-blue-800': color === 'blue',
    'bg-gray-100 text-gray-800': color === 'gray' || !color,
  }
}

const getStatusLabel = (status?: string) => {
  if (!status || !props.contentStatuses?.length) return status || 'Unknown'
  return props.contentStatuses.find(s => s.value === status)?.label || status
}

const getTypeLabel = (type?: string) => {
  if (!type || !props.contentTypes?.length) return type || 'Unknown'
  return props.contentTypes.find(t => t.value === type)?.label || type
}

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return 'Invalid date'
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-image.svg'
}
</script>