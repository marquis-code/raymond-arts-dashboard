<template>
  <div class="space-y-8">
    <div class="flex items-center gap-2 mb-6">
      <Icon name="heroicons:photo" class="h-6 w-6 text-orange-500" />
      <h3 class="text-xl font-semibold text-gray-800">Artwork Images</h3>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Upload Area -->
      <div class="space-y-6">
        <OptimizedImageDropZone
          :is-uploading="isUploading"
          :upload-progress="uploadProgress"
          @files-selected="handleImageUpload"
          @files-dropped="handleFileDrop"
        />

        <UploadProgress
          v-if="isUploading"
          :progress="uploadProgress"
          :uploading-single="uploadingSingle"
          :uploading-batch="uploadingBatch"
          :files-count="uploadingFilesCount"
        />

        <ImageUploadInstructions />
      </div>

      <!-- Image Previews -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="text-lg font-medium text-gray-800">Image Previews</h4>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="heroicons:photo" class="h-4 w-4" />
              <span>{{ imagePreviewUrls.length }} image(s)</span>
            </div>
            <button
              v-if="imagePreviewUrls.length > 0"
              type="button"
              class="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
              @click="clearAllImages"
            >
              Clear All
            </button>
          </div>
        </div>

        <OptimizedImagePreviewGrid
          :images="imagePreviewUrls"
          :uploaded-urls="uploadedImageUrls"
          :is-uploading="isUploading"
          @remove-image="removeImage"
          @reorder-images="handleReorderImages"
        />
      </div>
    </div>

    <!-- Upload Status -->
    <UploadStatusSummary
      :single-response="singleUploadResponse"
      :batch-response="batchUploadResponse"
      :uploading-single="uploadingSingle"
      :uploading-batch="uploadingBatch"
    />

    <!-- Debug Info -->
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
      <h5 class="font-medium text-yellow-800 mb-2">Debug Info:</h5>
      <p class="text-yellow-700">Preview URLs: {{ imagePreviewUrls.length }}</p>
      <p class="text-yellow-700">Uploaded URLs: {{ uploadedImageUrls.length }}</p>
      <p class="text-yellow-700">Form Data Images: {{ formData.images.length }}</p>
      <div class="mt-2 max-h-20 overflow-y-auto">
        <p class="text-xs text-yellow-600">Uploaded URLs:</p>
        <div v-for="(url, index) in uploadedImageUrls" :key="index" class="text-xs text-yellow-600 truncate">
          {{ index + 1 }}: {{ url }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { ArtworkFormData } from '~/types/artwork'
// Use your existing composables
import { useSingleUploadFile } from '@/composables/core/useSingleUpload'
import { useBatchUploadFile } from '@/composables/core/useBatchUploads'
import OptimizedImageDropZone from '@/components/OptimizedImageDropZone.vue'
import UploadProgress from '@/components/UploadProgress.vue'
import ImageUploadInstructions from '~/components/ImageUploadInstructions.vue'
import OptimizedImagePreviewGrid from '@/components/OptimizedImagePreviewGrid.vue'
import UploadStatusSummary from '@/components/UploadStatusSummary.vue'
import Icon from '~/components/Icon.vue'

interface Props {
  formData: ArtworkFormData
}

interface Emits {
  (e: 'update:formData', data: Partial<ArtworkFormData>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Use your existing composables
const {
  singleUploadFile,
  loading: uploadingSingle,
  uploadResponse: singleUploadResponse,
} = useSingleUploadFile()

const {
  batchUploadFile,
  loading: uploadingBatch,
  uploadResponse: batchUploadResponse,
} = useBatchUploadFile()

// Local state
const imagePreviewUrls = ref<string[]>([]) // For immediate preview (blob URLs)
const uploadedImageUrls = ref<string[]>([]) // For actual uploaded URLs from API
const isDragging = ref(false)
const uploadingFilesCount = ref(0)

// Computed loading state
const isUploading = computed(() => uploadingSingle.value || uploadingBatch.value)
const uploadProgress = ref(0)

// Initialize with existing form data (only if they are actual URLs, not base64)
watch(() => props.formData.images, (newImages) => {
  if (newImages.length > 0) {
    // Filter out base64 data URLs and only keep actual URLs
    const actualUrls = newImages.filter(img => !img.startsWith('data:'))
    if (actualUrls.length > 0) {
      // Only set if different from current state to avoid infinite loops
      if (JSON.stringify(actualUrls) !== JSON.stringify(uploadedImageUrls.value)) {
        uploadedImageUrls.value = [...actualUrls]
        imagePreviewUrls.value = [...actualUrls]
      }
    }
  }
}, { immediate: true })

// Update form data with aggregated uploaded URLs
const updateFormData = () => {
  console.log('Updating form data with uploaded URLs:', uploadedImageUrls.value)
  emit('update:formData', { images: [...uploadedImageUrls.value] })
}

// Watch uploadedImageUrls and emit the complete array
watch(uploadedImageUrls, () => {
  updateFormData()
}, { deep: true })

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const files = Array.from(input.files)
  uploadingFilesCount.value = files.length

  // Create preview URLs immediately for UI feedback
  for (const file of files) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreviewUrls.value.push(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  await uploadFiles(files)
}

const handleFileDrop = async (event: DragEvent) => {
  isDragging.value = false
  if (!event.dataTransfer?.files) return

  const files = Array.from(event.dataTransfer.files).filter((file) =>
    file.type.startsWith("image/")
  )

  if (files.length === 0) return
  uploadingFilesCount.value = files.length

  // Create preview URLs immediately for UI feedback
  for (const file of files) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreviewUrls.value.push(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  await uploadFiles(files)
}

const uploadFiles = async (files: File[]) => {
  try {
    uploadProgress.value = 0
    
    if (files.length === 1) {
      // Single file upload using your composable
      await singleUploadFile(files[0])
    } else if (files.length > 1) {
      // Batch file upload using your composable
      await batchUploadFile(files)
    }
    
    uploadProgress.value = 100
  } catch (error) {
    console.error("Error uploading files:", error)
    showErrorNotification("Failed to upload images. Please try again.")
  }
}

// Extract URL from single upload response (object)
const extractUrlFromSingleResponse = (response: any): string | null => {
  if (!response || typeof response !== 'object') return null
  return response.url || null
}

// Extract URLs from batch upload response (array)
const extractUrlsFromBatchResponse = (response: any[]): string[] => {
  if (!Array.isArray(response)) return []
  
  return response.map(item => {
    if (typeof item === 'object' && item.url) {
      return item.url
    }
    return null
  }).filter(url => url !== null) as string[]
}

// Helper function to add new URLs to the uploaded array without duplicates
const addUploadedUrls = (newUrls: string[]) => {
  const uniqueNewUrls = newUrls.filter(url => !uploadedImageUrls.value.includes(url))
  if (uniqueNewUrls.length > 0) {
    uploadedImageUrls.value = [...uploadedImageUrls.value, ...uniqueNewUrls]
    console.log('Added new uploaded URLs:', uniqueNewUrls)
    console.log('Total uploaded URLs:', uploadedImageUrls.value)
  }
}

const removeImage = (index: number) => {
  // Revoke blob URL to prevent memory leaks
  if (imagePreviewUrls.value[index] && imagePreviewUrls.value[index].startsWith('blob:')) {
    URL.revokeObjectURL(imagePreviewUrls.value[index])
  }

  imagePreviewUrls.value.splice(index, 1)
  
  if (index < uploadedImageUrls.value.length) {
    uploadedImageUrls.value.splice(index, 1)
  }
}

const clearAllImages = () => {
  // Revoke all blob URLs
  imagePreviewUrls.value.forEach((url) => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })

  imagePreviewUrls.value = []
  uploadedImageUrls.value = []
}

const handleReorderImages = (newOrder: string[]) => {
  // Update both preview and uploaded URLs to maintain sync
  imagePreviewUrls.value = [...newOrder]
  
  // Only update uploaded URLs if the reordered items are actual URLs (not blob URLs)
  const actualUrls = newOrder.filter(url => !url.startsWith('blob:') && !url.startsWith('data:'))
  if (actualUrls.length > 0) {
    uploadedImageUrls.value = [...actualUrls]
  }
}

const showErrorNotification = (message: string) => {
  alert(message)
}

// Watch for successful single uploads (object response)
watch(singleUploadResponse, (newResponse) => {
  if (newResponse && !uploadingSingle.value) {
    console.log('Single upload completed:', newResponse)
    const url = extractUrlFromSingleResponse(newResponse)
    if (url) {
      addUploadedUrls([url])
    }
  }
}, { deep: true })

// Watch for successful batch uploads (array response)
watch(batchUploadResponse, (newResponse) => {
  if (newResponse && !uploadingBatch.value && Array.isArray(newResponse)) {
    console.log('Batch upload completed:', newResponse)
    const urls = extractUrlsFromBatchResponse(newResponse)
    if (urls.length > 0) {
      addUploadedUrls(urls)
    }
  }
}, { deep: true })

// Watch upload progress for visual feedback
watch([uploadingSingle, uploadingBatch], () => {
  if (uploadingSingle.value || uploadingBatch.value) {
    uploadProgress.value = 0
    const interval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
      if (!uploadingSingle.value && !uploadingBatch.value) {
        uploadProgress.value = 100
        setTimeout(() => {
          uploadProgress.value = 0
        }, 1000)
        clearInterval(interval)
      }
    }, 200)
  }
})
</script>