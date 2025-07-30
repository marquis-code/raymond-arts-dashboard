<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
      <div class="lg:flex items-center space-y-4 lg:space-y-0 justify-between">
        <div>
          <h2 class="text-2xl font-bold text-white">Content Management</h2>
          <p class="text-blue-100 mt-1">Manage your website content efficiently</p>
        </div>
        <div class="flex items-center space-x-4">
          <button
            @click="$emit('seed-content')"
            :disabled="loading"
            class="px-6 py-2.5 bg-green-600 text-sm text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Seed Default Content
          </button>
          <button
            @click="$emit('create-new')"
            class="px-6 py-2.5 bg-white text-sm text-blue-600 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New Content
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="px-8 py-6 bg-gray-50 border-b border-gray-200">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex-1 min-w-[200px]">
          <select
            v-model="filters.type"
            @change="$emit('filter-change', filters)"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">All Content Types</option>
            <option
              v-for="type in contentTypes"
              :key="type.value"
              :value="type.value"
            >
              {{ type.label }}
            </option>
          </select>
        </div>
        
        <div class="flex-1 min-w-[200px]">
          <select
            v-model="filters.status"
            @change="$emit('filter-change', filters)"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">All Statuses</option>
            <option
              v-for="status in contentStatuses"
              :key="status.value"
              :value="status.value"
            >
              {{ status.label }}
            </option>
          </select>
        </div>

        <button
          @click="clearFilters"
          class="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="px-8 py-16 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      <p class="mt-4 text-gray-600 font-medium">Loading contents...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="contents.length === 0" class="px-8 py-16 text-center">
      <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No content found</h3>
      <p class="text-gray-500 mb-8">Get started by creating your first content or seeding default content.</p>
      <div class="flex items-center justify-center space-x-4">
        <button
          @click="$emit('create-new')"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
        >
          Create New Content
        </button>
        <button
          @click="$emit('seed-content')"
          class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium"
        >
          Seed Default Content
        </button>
      </div>
    </div>

    <!-- Content Grid -->
    <div v-else class="p-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TransitionGroup name="content-card" tag="div" class="contents">
          <div
            v-for="content in contents"
            :key="content._id"
            class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            <!-- Content Image -->
            <div class="relative h-48 bg-gray-100 overflow-hidden">
              <img
                v-if="content.images && content.images[0]"
                :src="content.images[0]"
                :alt="content.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                @error="handleImageError"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <!-- Status Badge -->
              <div class="absolute top-4 right-4">
                <span
                  :class="getStatusBadgeClass(content.status)"
                  class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm"
                >
                  {{ getStatusLabel(content.status) }}
                </span>
              </div>
              
              <!-- Image Count Badge -->
              <div v-if="content.images && content.images.length > 1" class="absolute bottom-4 left-4">
                <span class="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded-full">
                  {{ content.images.length }} images
                </span>
              </div>
            </div>

            <!-- Content Info -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {{ content.title }}
                  </h3>
                  <p class="text-sm text-blue-600 font-medium">
                    {{ getTypeLabel(content.type) }}
                  </p>
                </div>
              </div>
              
              <p v-if="content.description" class="text-gray-600 text-sm mb-4 line-clamp-2">
                {{ content.description }}
              </p>
              
              <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Updated {{ formatDate(content.updatedAt) }}</span>
                <span>{{ content.images?.length || 0 }} image{{ (content.images?.length || 0) !== 1 ? 's' : '' }}</span>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-2">
                <button
                  @click="$emit('preview', content)"
                  class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
                >
                  Preview
                </button>
                <button
                  @click="$emit('edit', content)"
                  class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium"
                >
                  Edit
                </button>
                <div class="relative">
                  <button
                    @click="toggleDropdown(content._id)"
                    class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  
                  <!-- Dropdown Menu -->
                  <Transition name="dropdown">
                    <div
                      v-if="activeDropdown === content._id"
                      class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10"
                    >
                      <div class="px-4 py-2 text-xs text-gray-500 font-medium uppercase tracking-wide">
                        Change Status
                      </div>
                      <button
                        v-for="status in contentStatuses"
                        :key="status.value"
                        @click="handleStatusChange(content._id, status.value)"
                        :class="[
                          'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors',
                          content.status === status.value ? 'text-blue-600 font-medium' : 'text-gray-700'
                        ]"
                      >
                        <span
                          :class="getStatusBadgeClass(status.value)"
                          class="inline-block w-2 h-2 rounded-full mr-2"
                        ></span>
                        {{ status.label }}
                      </button>
                      
                      <div class="border-t border-gray-200 my-2"></div>
                      
                      <button
                        @click="$emit('delete', content._id)"
                        class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="px-8 py-6 bg-gray-50 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ ((currentPage - 1) * 10) + 1 }} to {{ Math.min(currentPage * 10, total) }} of {{ total }} results
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="$emit('page-change', currentPage - 1)"
            :disabled="currentPage <= 1"
            class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          
          <div class="flex items-center space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="$emit('page-change', page)"
              :class="[
                'px-3 py-2 text-sm rounded-lg font-medium transition-all duration-200',
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="$emit('page-change', currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            Next
            <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  contents: any[]
  contentTypes: any[]
  contentStatuses: any[]
  loading?: boolean
  currentPage: number
  totalPages: number
  total: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'create-new': []
  'edit': [content: any]
  'delete': [id: string]
  'preview': [content: any]
  'status-change': [id: string, status: string]
  'filter-change': [filters: any]
  'page-change': [page: number]
  'seed-content': []
}>()

const filters = ref({
  type: '',
  status: ''
})

const activeDropdown = ref<string | null>(null)

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(props.totalPages, props.currentPage + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const clearFilters = () => {
  filters.value = {
    type: '',
    status: ''
  }
  emit('filter-change', filters.value)
}

const toggleDropdown = (contentId: string) => {
  activeDropdown.value = activeDropdown.value === contentId ? null : contentId
}

const handleStatusChange = (contentId: string, status: string) => {
  emit('status-change', contentId, status)
  activeDropdown.value = null
}

const getStatusBadgeClass = (status: string) => {
  const statusInfo = props.contentStatuses.find(s => s.value === status)
  const color = statusInfo?.color || 'gray'
  
  return {
    'bg-green-100 text-green-800': color === 'green',
    'bg-red-100 text-red-800': color === 'red',
    'bg-gray-100 text-gray-800': color === 'gray',
  }
}

const getStatusLabel = (status: string) => {
  return props.contentStatuses.find(s => s.value === status)?.label || status
}

const getTypeLabel = (type: string) => {
  return props.contentTypes.find(t => t.value === type)?.label || type
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-image.svg'
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    activeDropdown.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animation styles */
.content-card-enter-active,
.content-card-leave-active {
  transition: all 0.3s ease;
}

.content-card-enter-from,
.content-card-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
