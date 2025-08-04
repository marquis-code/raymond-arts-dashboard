<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  ListBulletIcon,
  Squares2X2Icon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  PhotoIcon,
  CloudArrowUpIcon,
  EyeIcon,
} from '@heroicons/vue/24/outline'
import { definePageMeta } from '#imports'

// Destructure composables directly as provided by the user
import { useCreateOriginal } from "@/composables/modules/originals/useCreateOriginal"
import { useDeleteOriginal } from "@/composables/modules/originals/useDeleteOriginal"
import { useFetchOriginalById } from "@/composables/modules/originals/useFetchOriginalById"
import { useFetchOriginals } from "@/composables/modules/originals/useFetchOriginals"
import { useReorderOriginals } from "@/composables/modules/originals/useReorderOriginals"
import { useUpdateOriginal } from "@/composables/modules/originals/useUpdateOriginal"
import { useSingleUploadFile } from '@/composables/core/useSingleUpload'
import { useBatchUploadFile } from '@/composables/core/useBatchUploads'

const { createOriginal, loading: creatingOriginal, error: createError } = useCreateOriginal()
const { deleteOriginal, loading: deletingOriginal, error: deleteError } = useDeleteOriginal()
const { fetchOriginalById, original: fetchedOriginalData, loading: fetchingOriginalById, error: fetchByIdError } = useFetchOriginalById()
const { fetchOriginals, originals: fetchedOriginalsData, loading: fetchingOriginals, error: fetchAllError } = useFetchOriginals()
const { 
  loading: reorderLoading, 
  error: reorderError, 
  success: reorderSuccess, 
  reorderFromSortedArray,
  resetState: resetReorderState 
} = useReorderOriginals()
const { updateOriginal, loading: updatingOriginal, error: updateError } = useUpdateOriginal()
const { 
  singleUploadFile, 
  loading: uploadingSingle, 
  uploadResponse: singleUploadResponse, 
  error: singleUploadError 
} = useSingleUploadFile()
const { 
  batchUploadFile, 
  loading: uploadingBatch, 
  uploadResponse: batchUploadResponse, 
  error: batchUploadError 
} = useBatchUploadFile()

// --- UI State Management ---
type ViewMode = 'list' | 'grid'
const viewMode = ref<ViewMode>('grid') // Default view mode
const isCreateEditModalOpen = ref(false)
const isConfirmDeleteModalOpen = ref(false)
const selectedOriginal = ref<any | null>(null) // For update and delete
const originalToDelete = ref<any | null>(null) // Specific original for delete confirmation

const formState = reactive({
  name: '',
  description: '',
  images: [] as string[], // Existing/manual image URLs
})

const newImageFiles = ref<File[]>([]) // For new file uploads
const uploadedImageUrls = ref<string[]>([]) // URLs from successful uploads
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error'>('success')

// Local state for draggable list
const draggableOriginals = ref<any[]>([])

// Drag and Drop specific states (matching LabCast pattern)
const draggedIndex = ref<number | null>(null)
const dropTargetIndex = ref<number | null>(null)
const isDragOverUploadArea = ref(false)

// Watch for changes in fetchedOriginalsData and update draggableOriginals
watch(fetchedOriginalsData, (newOriginals) => {
  if (newOriginals) {
    // Ensure we're working with a copy and sort by position
    draggableOriginals.value = [...newOriginals].sort((a, b) => a.position - b.position)
  }
}, { immediate: true })

// --- Form & Modal Logic ---
const openCreateModal = () => {
  selectedOriginal.value = null
  formState.name = ''
  formState.description = ''
  formState.images = []
  newImageFiles.value = []
  uploadedImageUrls.value = []
  isCreateEditModalOpen.value = true
}

const openEditModal = async (originalId: string) => {
  await fetchOriginalById(originalId)
  if (fetchedOriginalData.value) {
    selectedOriginal.value = fetchedOriginalData.value
    formState.name = fetchedOriginalData.value.name
    formState.description = fetchedOriginalData.value.description
    formState.images = fetchedOriginalData.value.images ? [...fetchedOriginalData.value.images] : []
    newImageFiles.value = []
    uploadedImageUrls.value = []
    isCreateEditModalOpen.value = true
  } else {
    showToast('Error fetching original for edit.', 'error')
  }
}

const closeCreateEditModal = () => {
  isCreateEditModalOpen.value = false
  selectedOriginal.value = null
  formState.name = ''
  formState.description = ''
  formState.images = []
  newImageFiles.value = []
  uploadedImageUrls.value = []
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    newImageFiles.value = Array.from(input.files)
    // Immediately upload the selected files
    await uploadSelectedFiles()
  }
}

const uploadSelectedFiles = async () => {
  if (newImageFiles.value.length === 0) return

  if (newImageFiles.value.length === 1) {
    // Single file upload
    await singleUploadFile(newImageFiles.value[0])
    if (singleUploadResponse.value && singleUploadResponse.value.url) {
      uploadedImageUrls.value.push(singleUploadResponse.value.url)
      showToast('Image uploaded successfully!', 'success')
    }
  } else {
    // Batch file upload
    await batchUploadFile(newImageFiles.value)
    if (batchUploadResponse.value && Array.isArray(batchUploadResponse.value)) {
      const urls = batchUploadResponse.value.map((item: any) => item.url).filter(Boolean)
      uploadedImageUrls.value.push(...urls)
      showToast(`${urls.length} images uploaded successfully!`, 'success')
    }
  }
}

const removeUploadedImage = (index: number) => {
  uploadedImageUrls.value.splice(index, 1)
}

const removeExistingImage = (index: number) => {
  formState.images.splice(index, 1)
}

const handleSubmit = async () => {
  // Aggregate all image URLs (existing + newly uploaded)
  const finalImageUrls: string[] = [
    ...formState.images.filter(url => url.trim() !== ''),
    ...uploadedImageUrls.value
  ]

  const payload = {
    name: formState.name,
    description: formState.description,
    images: finalImageUrls,
  }

  if (selectedOriginal.value) {
    // Update existing original
    await updateOriginal(selectedOriginal.value._id, payload)
    if (!updateError.value) {
      showToast('Original updated successfully!', 'success')
      await refreshOriginals()
      closeCreateEditModal()
    }
  } else {
    // Create new original
    await createOriginal(payload)
    if (!createError.value) {
      showToast('Original created successfully!', 'success')
      await refreshOriginals()
      closeCreateEditModal()
    }
  }
}

// --- Delete Logic ---
const openConfirmDeleteModal = (original: any) => {
  originalToDelete.value = original
  isConfirmDeleteModalOpen.value = true
}

const closeConfirmDeleteModal = () => {
  isConfirmDeleteModalOpen.value = false
  originalToDelete.value = null
}

const confirmDelete = async () => {
  if (originalToDelete.value) {
    await deleteOriginal(originalToDelete.value._id)
    if (!deleteError.value) {
      showToast('Original deleted successfully!', 'success')
      await refreshOriginals()
      closeConfirmDeleteModal()
    }
  }
}

// --- Drag & Drop Logic (matching LabCast pattern) ---
const handleDragStart = (event: DragEvent, index: number) => {
  if (reorderLoading.value) {
    event.preventDefault()
    return
  }
  
  draggedIndex.value = index
  event.dataTransfer!.effectAllowed = 'move'
  event.dataTransfer!.setData('text/html', '')
}

const handleDragEnd = () => {
  draggedIndex.value = null
  dropTargetIndex.value = null
}

const handleDragOver = (event: DragEvent, index: number) => {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
  
  if (draggedIndex.value !== null && draggedIndex.value !== index) {
    dropTargetIndex.value = index
  }
}

const handleDragLeave = (event: DragEvent) => {
  // Only clear drop target if we're actually leaving the element
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY
  
  // Check if mouse is outside the element bounds
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    dropTargetIndex.value = null
  }
}

const handleDrop = async (event: DragEvent, dropIndex: number) => {
  event.preventDefault()
  
  if (draggedIndex.value === null || draggedIndex.value === dropIndex || reorderLoading.value) {
    return
  }

  // Create a new array with the reordered items
  const reorderedItems = [...draggableOriginals.value]
  const draggedItem = reorderedItems[draggedIndex.value]
  
  // Remove the dragged item from its original position
  reorderedItems.splice(draggedIndex.value, 1)
  
  // Insert the dragged item at the new position
  reorderedItems.splice(dropIndex, 0, draggedItem)
  
  // Update local state immediately for better UX
  draggableOriginals.value = reorderedItems
  
  // Call the reorder API
  await reorderFromSortedArray(reorderedItems)
  
  if (reorderSuccess.value) {
    showToast('Originals reordered successfully!', 'success')
    // Refresh originals list
    await refreshOriginals()
  }
  
  draggedIndex.value = null
  dropTargetIndex.value = null
}

// File drag and drop for upload area
const handleUploadDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOverUploadArea.value = true
}

const handleUploadDragLeave = (event: DragEvent) => {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY
  
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    isDragOverUploadArea.value = false
  }
}

const handleUploadDrop = async (event: DragEvent) => {
  event.preventDefault()
  isDragOverUploadArea.value = false
  
  const files = Array.from(event.dataTransfer?.files || [])
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  
  if (imageFiles.length > 0) {
    newImageFiles.value = imageFiles
    await uploadSelectedFiles()
  }
}

// --- Data Fetching & Refresh ---
const refreshOriginals = async () => {
  await fetchOriginals()
}

onMounted(() => {
  refreshOriginals()
})

// --- Utility Functions ---
const showToast = (message: string, type: 'success' | 'error') => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 3000) // Hide after 3 seconds
}

// --- Computed Properties for UI ---
const isFormValid = computed(() => {
  return formState.name.trim() !== '' && formState.description.trim() !== ''
})

const isUploading = computed(() => uploadingSingle.value || uploadingBatch.value)

definePageMeta({
  layout: 'dashboard'
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Notification Toast -->
    <Transition
      enter-active-class="transition ease-out duration-300 transform"
      enter-from-class="opacity-0 translate-y-full scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-full scale-95"
    >
      <div
        v-if="showNotification"
        :class="{
          'fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 text-white backdrop-blur-sm': true,
          'bg-green-500/90': notificationType === 'success',
          'bg-red-500/90': notificationType === 'error',
        }"
        role="alert"
      >
        <CheckCircleIcon v-if="notificationType === 'success'" class="h-6 w-6 animate-pulse" />
        <ExclamationTriangleIcon v-if="notificationType === 'error'" class="h-6 w-6 animate-bounce" />
        <span class="font-medium">{{ notificationMessage }}</span>
        <button 
          @click="showNotification = false" 
          class="ml-auto p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </Transition>

    <header class="mb-8 flex items-center justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-extrabold text-gray-900 drop-shadow-sm">Originals Gallery</h1>
        <p class="text-gray-600">Manage and organize your original content</p>
      </div>
      <div class="flex items-center space-x-4">
        <button
          @click="openCreateModal"
          class="group inline-flex items-center text-sm rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          <PlusIcon class="mr-2 h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
          Create New Original
        </button>
        <div class="flex rounded-full bg-white p-1 shadow-md">
          <button
            @click="viewMode = 'list'"
            :class="{
              'rounded-full p-2 transition-all duration-200': true,
              'bg-indigo-500 text-white shadow-inner': viewMode === 'list',
              'text-gray-600 hover:bg-gray-100': viewMode === 'grid',
            }"
            aria-label="Switch to list view"
          >
            <ListBulletIcon class="h-6 w-6" />
          </button>
          <button
            @click="viewMode = 'grid'"
            :class="{
              'rounded-full p-2 transition-all duration-200': true,
              'bg-indigo-500 text-white shadow-inner': viewMode === 'grid',
              'text-gray-600 hover:bg-gray-100': viewMode === 'list',
            }"
            aria-label="Switch to grid view"
          >
            <Squares2X2Icon class="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="fetchingOriginals" class="flex flex-col items-center justify-center py-20 text-indigo-600">
      <ArrowPathIcon class="h-16 w-16 animate-spin" />
      <p class="mt-4 text-xl font-medium animate-pulse">Loading Originals...</p>
    </div>

    <!-- Empty State -->
    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
    >
      <div v-if="!fetchingOriginals && draggableOriginals.length === 0" class="rounded-lg bg-white p-12 text-center shadow-lg">
        <div class="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
          <PhotoIcon class="w-12 h-12 text-purple-500" />
        </div>
        <p class="text-2xl font-semibold text-gray-600 mb-2">No Originals found</p>
        <p class="text-gray-500 mb-8">Start by creating your first original content</p>
        <button
          @click="openCreateModal"
          class="group inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          <PlusIcon class="mr-2 h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
          Create First Original
        </button>
      </div>
    </Transition>

    <!-- Content -->
    <div v-if="!fetchingOriginals && draggableOriginals.length > 0">
      <!-- Grid View -->
      <TransitionGroup
        v-if="viewMode === 'grid'"
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 -translate-y-4"
        tag="div"
        class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
      >
        <div
          v-for="(original, index) in draggableOriginals"
          :key="original._id"
          :draggable="!reorderLoading"
          @dragstart="handleDragStart($event, index)"
          @dragover="handleDragOver($event, index)"
          @dragleave="handleDragLeave"
          @drop="handleDrop($event, index)"
          @dragend="handleDragEnd"
          class="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          :class="{
            'opacity-50 scale-95 rotate-2': draggedIndex === index,
            'border-2 border-amber-400 shadow-amber-200 scale-105': dropTargetIndex === index && draggedIndex !== index,
            'cursor-not-allowed opacity-60': reorderLoading
          }"
        >
          <!-- Drop Target Indicator -->
          <div v-if="dropTargetIndex === index && draggedIndex !== index" class="absolute inset-0 border-2 border-dashed border-amber-400 rounded-xl pointer-events-none z-20 animate-pulse">
            <div class="absolute inset-0 bg-amber-100/20 rounded-xl"></div>
          </div>

          <!-- Reorder Loading Indicator -->
          <div v-if="reorderLoading && dropTargetIndex === index" class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30 rounded-xl">
            <div class="animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
          </div>

          <div class="relative h-64 w-full overflow-hidden rounded-t-xl bg-gray-200">
            <img
              :src="original.images && original.images[0] ? original.images[0] : '/placeholder.svg?height=256&width=256&text=No Image'"
              :alt="original.name"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div class="absolute bottom-4 left-4 right-4 text-white opacity-0 transition-all duration-300 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0">
              <h3 class="text-xl font-bold">{{ original.name }}</h3>
              <p class="text-sm text-gray-200">{{ original.description.substring(0, 70) }}...</p>
            </div>
          </div>

          <div class="p-6">
            <h3 class="mb-2 text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">{{ original.name }}</h3>
            <p class="mb-4 text-gray-600 line-clamp-3">{{ original.description.substring(0, 100) }}...</p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Position: {{ original.position }}</span>
              <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  @click="openEditModal(original._id)"
                  :disabled="fetchingOriginalById"
                  class="rounded-full bg-blue-500 p-2 text-white shadow-md transition-all duration-200 hover:bg-blue-600 hover:shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                  aria-label="Edit original"
                >
                  <ArrowPathIcon v-if="fetchingOriginalById" class="h-5 w-5 animate-spin" />
                  <PencilIcon v-else class="h-5 w-5" />
                </button>
                <button
                  @click="openConfirmDeleteModal(original)"
                  class="rounded-full bg-red-500 p-2 text-white shadow-md transition-all duration-200 hover:bg-red-600 hover:shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300"
                  aria-label="Delete original"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
                <button
                  class="drag-handle cursor-grab rounded-full bg-gray-300 p-2 text-gray-700 shadow-md transition-all duration-200 hover:bg-gray-400 hover:shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-300 active:cursor-grabbing"
                  aria-label="Drag to reorder"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- List View -->
      <TransitionGroup
        v-else
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 -translate-x-4"
        tag="ul"
        class="divide-y divide-gray-200 rounded-lg bg-white shadow-lg overflow-hidden"
      >
        <li
          v-for="(original, index) in draggableOriginals"
          :key="original._id"
          :draggable="!reorderLoading"
          @dragstart="handleDragStart($event, index)"
          @dragover="handleDragOver($event, index)"
          @dragleave="handleDragLeave"
          @drop="handleDrop($event, index)"
          @dragend="handleDragEnd"
          class="relative flex items-center justify-between py-4 px-6 transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
          :class="{
            'opacity-50 scale-95': draggedIndex === index,
            'bg-amber-50 border-l-4 border-amber-400': dropTargetIndex === index && draggedIndex !== index,
            'cursor-not-allowed opacity-60': reorderLoading
          }"
        >
          <!-- Drop Target Indicator -->
          <div v-if="dropTargetIndex === index && draggedIndex !== index" class="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 animate-pulse"></div>

          <!-- Reorder Loading Indicator -->
          <div v-if="reorderLoading && dropTargetIndex === index" class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
            <div class="animate-spin rounded-full h-6 w-6 border-4 border-amber-500 border-t-transparent"></div>
          </div>

          <div class="flex items-center space-x-4">
            <button
              class="drag-handle cursor-grab text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 active:cursor-grabbing"
              aria-label="Drag to reorder"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <img
              :src="original.images && original.images[0] ? original.images[0] : '/placeholder.svg?height=64&width=64&text=No Image'"
              :alt="original.name"
              class="h-16 w-16 flex-shrink-0 rounded-md object-cover shadow-sm transition-transform duration-200 hover:scale-105"
            />
            <div>
              <h3 class="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-200">{{ original.name }}</h3>
              <p class="text-sm text-gray-600">{{ original.description.substring(0, 80) }}...</p>
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Position: {{ original.position }}</span>
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              @click="openEditModal(original._id)"
              :disabled="fetchingOriginalById"
              class="rounded-full bg-blue-500 p-2 text-white shadow-md transition-all duration-200 hover:bg-blue-600 hover:shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
              aria-label="Edit original"
            >
              <ArrowPathIcon v-if="fetchingOriginalById" class="h-5 w-5 animate-spin" />
              <PencilIcon v-else class="h-5 w-5" />
            </button>
            <button
              @click="openConfirmDeleteModal(original)"
              class="rounded-full bg-red-500 p-2 text-white shadow-md transition-all duration-200 hover:bg-red-600 hover:shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300"
              aria-label="Delete original"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </li>
      </TransitionGroup>
    </div>

    <!-- Create/Edit Original Modal -->
    <TransitionRoot appear :show="isCreateEditModalOpen" as="template">
      <Dialog as="div" @close="closeCreateEditModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-95 scale-95"
            >
              <DialogPanel
                class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all"
              >
                <DialogTitle as="h3" class="text-xl font-bold leading-6 text-gray-900 mb-6">
                  {{ selectedOriginal ? 'Edit Original' : 'Create New Original' }}
                </DialogTitle>

                <form @submit.prevent="handleSubmit" class="space-y-6">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      v-model="formState.name"
                      class="mt-1 block w-full border outline-none border-gray-200 rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:text-sm p-3 transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      id="description"
                      v-model="formState.description"
                      rows="4"
                      class="mt-1 block w-full border outline-none border-gray-200 rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:text-sm p-3 transition-all duration-200 resize-none"
                      required
                    ></textarea>
                  </div>

                  <!-- Existing Images Section (for editing) -->
                  <Transition
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                  >
                    <div v-if="selectedOriginal && formState.images.length > 0">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Existing Images</label>
                      <div class="grid grid-cols-3 gap-4">
                        <TransitionGroup
                          enter-active-class="transition-all duration-300 ease-out"
                          enter-from-class="opacity-0 scale-95"
                          enter-to-class="opacity-100 scale-100"
                          leave-active-class="transition-all duration-200 ease-in"
                          leave-from-class="opacity-100 scale-100"
                          leave-to-class="opacity-0 scale-95"
                        >
                          <div v-for="(image, index) in formState.images" :key="index" class="relative group">
                            <img :src="image" :alt="`Existing image ${index + 1}`" class="w-full h-24 object-cover rounded-md shadow-sm transition-transform duration-200 group-hover:scale-105" />
                            <button
                              type="button"
                              @click="removeExistingImage(index)"
                              class="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110"
                              aria-label="Remove existing image"
                            >
                              <XMarkIcon class="h-4 w-4" />
                            </button>
                          </div>
                        </TransitionGroup>
                      </div>
                    </div>
                  </Transition>

                  <!-- New Image Upload Section -->
                  <div>
                    <label for="file-upload" class="block text-sm font-medium text-gray-700 mb-2">Upload New Images</label>
                    
                    <!-- Upload Area -->
                    <div 
                      class="mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6 transition-all duration-300"
                      :class="{
                        'border-gray-300 hover:border-gray-400': !isDragOverUploadArea,
                        'border-indigo-400 bg-indigo-50': isDragOverUploadArea
                      }"
                      @dragover="handleUploadDragOver"
                      @dragleave="handleUploadDragLeave"
                      @drop="handleUploadDrop"
                    >
                      <div class="space-y-1 text-center">
                        <CloudArrowUpIcon 
                          class="mx-auto h-12 w-12 transition-colors duration-200"
                          :class="isDragOverUploadArea ? 'text-indigo-500' : 'text-gray-400'"
                        />
                        <div class="flex text-sm text-gray-600">
                          <label
                            for="file-upload"
                            class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500 transition-colors duration-200"
                          >
                            <span>Upload a file</span>
                            <input 
                              id="file-upload" 
                              name="file-upload" 
                              type="file" 
                              multiple 
                              accept="image/*"
                              class="sr-only" 
                              @change="handleFileChange" 
                            />
                          </label>
                          <p class="pl-1">or drag and drop</p>
                        </div>
                        <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>

                    <!-- Upload Progress -->
                    <Transition
                      enter-active-class="transition-all duration-300 ease-out"
                      enter-from-class="opacity-0 scale-95 translate-y-2"
                      enter-to-class="opacity-100 scale-100 translate-y-0"
                      leave-active-class="transition-all duration-200 ease-in"
                      leave-from-class="opacity-100 scale-100 translate-y-0"
                      leave-to-class="opacity-0 scale-95 -translate-y-2"
                    >
                      <div v-if="isUploading" class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div class="flex items-center space-x-3">
                          <ArrowPathIcon class="h-5 w-5 animate-spin text-blue-500" />
                          <span class="text-sm text-blue-700 font-medium">
                            Uploading {{ newImageFiles.length }} image{{ newImageFiles.length > 1 ? 's' : '' }}...
                          </span>
                        </div>
                        <div class="mt-2 w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                          <div class="bg-blue-600 h-2 rounded-full animate-pulse transition-all duration-1000" style="width: 100%"></div>
                        </div>
                      </div>
                    </Transition>

                    <!-- Successfully Uploaded Images Preview -->
                    <Transition
                      enter-active-class="transition-all duration-300 ease-out"
                      enter-from-class="opacity-0 scale-95"
                      enter-to-class="opacity-100 scale-100"
                    >
                      <div v-if="uploadedImageUrls.length > 0" class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Uploaded Images</label>
                        <div class="grid grid-cols-3 gap-4">
                          <TransitionGroup
                            enter-active-class="transition-all duration-300 ease-out"
                            enter-from-class="opacity-0 scale-95"
                            enter-to-class="opacity-100 scale-100"
                            leave-active-class="transition-all duration-200 ease-in"
                            leave-from-class="opacity-100 scale-100"
                            leave-to-class="opacity-0 scale-95"
                          >
                            <div v-for="(imageUrl, index) in uploadedImageUrls" :key="imageUrl" class="relative group">
                              <img :src="imageUrl" :alt="`Uploaded image ${index + 1}`" class="w-full h-24 object-cover rounded-md shadow-sm transition-transform duration-200 group-hover:scale-105" />
                              <button
                                type="button"
                                @click="removeUploadedImage(index)"
                                class="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110"
                                aria-label="Remove uploaded image"
                              >
                                <XMarkIcon class="h-4 w-4" />
                              </button>
                              <div class="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded animate-pulse">
                                Uploaded
                              </div>
                            </div>
                          </TransitionGroup>
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <div class="mt-8 flex justify-end space-x-4">
                    <button
                      type="button"
                      @click="closeCreateEditModal"
                      class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      :disabled="!isFormValid || creatingOriginal || updatingOriginal"
                      class="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                    >
                      <ArrowPathIcon v-if="creatingOriginal || updatingOriginal" class="h-5 w-5 animate-spin mr-2" />
                      {{ selectedOriginal ? (updatingOriginal ? 'Updating...' : 'Update Original') : (creatingOriginal ? 'Creating...' : 'Create Original') }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Confirmation Delete Modal -->
    <TransitionRoot appear :show="isConfirmDeleteModalOpen" as="template">
      <Dialog as="div" @close="closeConfirmDeleteModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-95 scale-95"
            >
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 animate-pulse">
                  <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <DialogTitle as="h3" class="mt-4 text-lg font-medium leading-6 text-gray-900 text-center">
                  Delete Original
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 text-center">
                    Are you sure you want to delete "<span class="font-semibold">{{ originalToDelete?.name }}</span>"? This action cannot be undone.
                  </p>
                </div>

                <div class="mt-6 flex justify-center space-x-4">
                  <button
                    type="button"
                    @click="closeConfirmDeleteModal"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    @click="confirmDelete"
                    :disabled="deletingOriginal"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                  >
                    <ArrowPathIcon v-if="deletingOriginal" class="h-5 w-5 animate-spin mr-2" />
                    {{ deletingOriginal ? 'Deleting...' : 'Delete' }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<style>
/* Enhanced drag and drop feedback */
.dragging-item {
  opacity: 0.5;
  border: 2px dashed #6366f1;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: rotate(2deg) scale(0.95);
}

.drag-over-item {
  background-color: #e0e7ff;
  border: 2px solid #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3);
  transform: scale(1.05);
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: transform, opacity, background-color, border-color, color, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Line clamp utility */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Disable image dragging */
img {
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
