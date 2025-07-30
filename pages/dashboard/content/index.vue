<template>
  <div class="min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Content Management</h1>
        <p class="mt-1 text-gray-600">Manage your website content including hero images, about sections, and contact information.</p>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          </div>
          <button
            @click="clearError"
            class="ml-auto text-red-400 hover:text-red-600"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Success Alert -->
      <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
        <div class="flex">
          <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
          </div>
          <button
            @click="successMessage = ''"
            class="ml-auto text-green-400 hover:text-green-600"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content List -->
      <ContentsList
        :contents="contents"
        :content-types="contentTypes"
        :content-statuses="contentStatuses"
        :loading="isLoading"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total="total"
        @create-new="showCreateForm"
        @edit="showEditForm"
        @delete="handleDelete"
        @preview="showPreview"
        @status-change="handleStatusChange"
        @filter-change="handleFilterChange"
        @page-change="handlePageChange"
        @seed-content="handleSeedContent"
      />

      <!-- Modal for Create/Edit Form -->
      <div
        v-if="showForm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
          <ContentForm
            :content-types="contentTypes"
            :content-statuses="contentStatuses"
            :initial-data="editingContent"
            :loading="isFormLoading"
            @submit="handleFormSubmit"
            @preview="handleFormPreview"
            @close="hideForm"
          />
        </div>
      </div>

      <!-- Preview Modal -->
      <ContentPreview
        v-if="showPreviewModal"
        :content="previewContent"
        :content-types="contentTypes"
        :content-statuses="contentStatuses"
        @close="hidePreview"
        @edit="editFromPreview"
      />

      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
          <p class="text-gray-600 mb-6">Are you sure you want to delete this content? This action cannot be undone.</p>
          <div class="flex items-center justify-end space-x-4">
            <button
              @click="showDeleteConfirm = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmDelete"
              :disabled="deleteLoading"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ deleteLoading ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCreateContent } from '@/composables/modules/content/useCreateContent'
import { useFetchContents } from '@/composables/modules/content/useFetchContents'
import { useUpdateContent } from '@/composables/modules/content/useUpdateContent'
import { useUpdateContentStatus } from '@/composables/modules/content/useUpdateContentStatus'
import { useDeleteContent } from '@/composables/modules/content/useDeleteContent'
import { useSeedDefaultContent } from '@/composables/modules/content/useSeedDefaultContent'
import { useContentTypes } from '@/composables/modules/content/useContentTypes'
import { useContentFilters } from '@/composables/modules/content/useContentFilters'
import { definePageMeta } from '#imports'

// Meta and layout
definePageMeta({
  layout: 'dashboard'
})

// Composables
const { createContent, loading: createLoading, error: createError } = useCreateContent()
const { fetchContents, contents, loading: fetchLoading, error: fetchError, currentPage, totalPages, total } = useFetchContents()
const { updateContent, loading: updateLoading, error: updateError } = useUpdateContent()
const { updateContentStatus, loading: statusLoading, error: statusError } = useUpdateContentStatus()
const { deleteContent, loading: deleteLoading, error: deleteError } = useDeleteContent()
const { seedDefaultContent, loading: seedLoading, error: seedError } = useSeedDefaultContent()
const { contentTypes, contentStatuses } = useContentTypes()
const { filters, activeFilters, setFilter, setPage } = useContentFilters()

// Local state
const showForm = ref(false)
const showPreviewModal = ref(false)
const showDeleteConfirm = ref(false)
const editingContent = ref(null)
const previewContent = ref(null)
const deletingContentId = ref('')
const successMessage = ref('')

// Computed properties
const isLoading = computed(() => fetchLoading.value || seedLoading.value)
const isFormLoading = computed(() => createLoading.value || updateLoading.value)
const error = computed(() => {
  return fetchError.value || createError.value || updateError.value || 
         statusError.value || deleteError.value || seedError.value
})

// Form handlers
const showCreateForm = () => {
  editingContent.value = null
  showForm.value = true
}

const showEditForm = (content: any) => {
  editingContent.value = content
  showForm.value = true
}

const hideForm = () => {
  showForm.value = false
  editingContent.value = null
}

const handleFormSubmit = async (formData: any) => {
  try {
    if (editingContent.value) {
      await updateContent(editingContent.value._id, formData)
      successMessage.value = 'Content updated successfully!'
    } else {
      await createContent(formData)
      successMessage.value = 'Content created successfully!'
    }
    hideForm()
    await fetchContents(activeFilters.value)
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Form submission error:', err)
  }
}

const handleFormPreview = (formData: any) => {
  previewContent.value = formData
  showPreviewModal.value = true
}

// Preview handlers
const showPreview = (content: any) => {
  previewContent.value = content
  showPreviewModal.value = true
}

const hidePreview = () => {
  showPreviewModal.value = false
  previewContent.value = null
}

const editFromPreview = (content: any) => {
  hidePreview()
  showEditForm(content)
}

// Delete handlers
const handleDelete = (contentId: string) => {
  deletingContentId.value = contentId
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  try {
    await deleteContent(deletingContentId.value)
    successMessage.value = 'Content deleted successfully!'
    showDeleteConfirm.value = false
    deletingContentId.value = ''
    await fetchContents(activeFilters.value)
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Delete error:', err)
    showDeleteConfirm.value = false
  }
}

// Status change handler
const handleStatusChange = async (contentId: string, newStatus: string) => {
  try {
    await updateContentStatus(contentId, newStatus)
    successMessage.value = 'Content status updated successfully!'
    await fetchContents(activeFilters.value)
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Status update error:', err)
  }
}

// Filter and pagination handlers
const handleFilterChange = (newFilters: any) => {
  Object.keys(newFilters).forEach(key => {
    setFilter(key, newFilters[key])
  })
  fetchContents(activeFilters.value)
}

const handlePageChange = (page: number) => {
  setPage(page)
  fetchContents(activeFilters.value)
}

// Seed content handler
const handleSeedContent = async () => {
  try {
    const result = await seedDefaultContent()
    successMessage.value = `${result.message} (${result.created} items created)`
    await fetchContents(activeFilters.value)
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (err) {
    console.error('Seed content error:', err)
  }
}

// Error handling
const clearError = () => {
  // Clear all error states
  createError.value = null
  fetchError.value = null
  updateError.value = null
  statusError.value = null
  deleteError.value = null
  seedError.value = null
}

// Initialize
onMounted(() => {
  fetchContents()
})
</script>
