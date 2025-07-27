<template>
    <div class="bg-white rounded-lg shadow-md">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Content Management</h2>
          <div class="flex items-center space-x-4">
            <button
              @click="$emit('seed-content')"
              :disabled="loading"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Seed Default Content
            </button>
            <button
              @click="$emit('create-new')"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              + Create New Content
            </button>
          </div>
        </div>
      </div>
  
      <!-- Filters -->
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <select
              v-model="filters.type"
              @change="$emit('filter-change', filters)"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option
                v-for="type in contentTypes"
                :key="type.value"
                :value="type.value"
              >
                {{ type.label }}
              </option>
            </select>
          </div>
          
          <div class="flex-1">
            <select
              v-model="filters.status"
              @change="$emit('filter-change', filters)"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
  
      <!-- Loading State -->
      <div v-if="loading" class="px-6 py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Loading contents...</p>
      </div>
  
      <!-- Empty State -->
      <div v-else-if="contents.length === 0" class="px-6 py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No content found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating your first content.</p>
        <div class="mt-6">
          <button
            @click="$emit('create-new')"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Content
          </button>
        </div>
      </div>
  
      <!-- Content List -->
      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="content in contents"
          :key="content._id"
          class="px-6 py-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <h3 class="text-lg font-medium text-gray-900">{{ content.title }}</h3>
                <span
                  :class="getStatusBadgeClass(content.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ getStatusLabel(content.status) }}
                </span>
              </div>
              
              <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span>{{ getTypeLabel(content.type) }}</span>
                <span>•</span>
                <span>{{ content.images?.length || 0 }} image{{ (content.images?.length || 0) !== 1 ? 's' : '' }}</span>
                <span>•</span>
                <span>Updated {{ formatDate(content.updatedAt) }}</span>
              </div>
              
              <p v-if="content.description" class="mt-2 text-sm text-gray-600 line-clamp-2">
                {{ content.description }}
              </p>
            </div>
  
            <div class="flex items-center space-x-2 ml-4">
              <!-- Status Toggle -->
              <select
                :value="content.status"
                @change="$emit('status-change', content._id, $event.target.value)"
                class="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option
                  v-for="status in contentStatuses"
                  :key="status.value"
                  :value="status.value"
                >
                  {{ status.label }}
                </option>
              </select>
  
              <!-- Actions -->
              <button
                @click="$emit('edit', content)"
                class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              
              <button
                @click="$emit('delete', content._id)"
                class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ ((currentPage - 1) * 10) + 1 }} to {{ Math.min(currentPage * 10, total) }} of {{ total }} results
          </div>
          
          <div class="flex items-center space-x-2">
            <button
              @click="$emit('page-change', currentPage - 1)"
              :disabled="currentPage <= 1"
              class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <span class="px-3 py-1 text-sm">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            
            <button
              @click="$emit('page-change', currentPage + 1)"
              :disabled="currentPage >= totalPages"
              class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
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
    'status-change': [id: string, status: string]
    'filter-change': [filters: any]
    'page-change': [page: number]
    'seed-content': []
  }>()
  
  const filters = ref({
    type: '',
    status: ''
  })
  
  const clearFilters = () => {
    filters.value = {
      type: '',
      status: ''
    }
    emit('filter-change', filters.value)
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
    return new Date(dateString).toLocaleDateString()
  }
  </script>
  
  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>
  