<template>
  <div class="min-h-screen">
    <!-- Animated Header -->
    <div class="mb-8 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div class="animate-slide-in-left">
          <div class="flex items-center gap-4 mb-2">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
              <BookOpenIcon class="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Course Management
              </h1>
              <p class="text-gray-600 font-medium">Manage your courses, sections, and lessons</p>
            </div>
          </div>
        </div>
        
        <div class="animate-slide-in-right">
          <NuxtLink 
            to="/dashboard/courses/new" 
            class="group inline-flex items-center px-6 py-3 text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"
          >
            <PlusIcon class="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Create New Course
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Enhanced Filters Section -->
    <div class="mb-8 animate-slide-in-up">
      <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden backdrop-blur-sm">
        <div class="p-6">
          <div class="flex flex-col lg:flex-row lg:items-center gap-6">
            <!-- Search Bar -->
            <div class="flex-1 group">
              <div class="relative">
                <SearchIcon class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors duration-300" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search courses by title, description..."
                  class="w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-lg transition-all duration-300 font-medium"
                  @input="debouncedSearch"
                />
                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <!-- Filter Controls -->
            <div class="flex flex-wrap gap-4">
              <div class="relative group">
                <select 
                  v-model="filters.status" 
                  class="appearance-none px-4 py-3 pr-10 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 font-medium cursor-pointer hover:shadow-md"
                  @change="applyFilters"
                >
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
                <ChevronDownIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors duration-300" />
              </div>

              <div class="relative group">
                <select 
                  v-model="filters.level" 
                  class="appearance-none px-4 py-3 pr-10 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 font-medium cursor-pointer hover:shadow-md"
                  @change="applyFilters"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <ChevronDownIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors duration-300" />
              </div>

              <button 
                @click="resetFilters" 
                class="group px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300 font-medium"
                title="Reset Filters"
              >
                <RefreshCwIcon class="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-fade-in-delayed">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin"></div>
          <div class="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p class="mt-4 text-gray-600 font-medium">Loading courses...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="courses.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 animate-bounce">
          <BookOpenIcon class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
        <p class="text-gray-600 mb-8 max-w-md">
          {{ searchQuery ? 'Try adjusting your search or filters to find what you\'re looking for' : 'Get started by creating your first course and begin sharing knowledge' }}
        </p>
        <NuxtLink 
          to="/dashboard/courses/new" 
          class="group inline-flex items-center px-6 py-3 text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <PlusIcon class="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Create Your First Course
        </NuxtLink>
      </div>

      <!-- Courses Grid/Table -->
      <div v-else class="overflow-hidden">
        <!-- Desktop Table View -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Course</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Level</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Students</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Rating</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Price</th>
                <th class="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr 
                v-for="(course, index) in courses" 
                :key="course._id" 
                class="group hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 animate-fade-in-up"
                :style="{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }"
              >
                <td class="px-6 py-6">
                  <div class="flex items-center group-hover:transform group-hover:scale-105 transition-transform duration-300">
                    <div class="h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                      <img 
                        v-if="course.thumbnail" 
                        :src="course.thumbnail" 
                        :alt="course.title"
                        class="h-14 w-14 object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                      <div v-else class="h-14 w-14 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <BookOpenIcon class="h-7 w-7 text-indigo-500" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                        {{ course.title }}
                      </div>
                      <div class="text-sm text-gray-600 line-clamp-2 mt-1">
                        {{ course.description }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-6">
                  <span 
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm transform group-hover:scale-105 transition-all duration-300" 
                    :class="getStatusClasses(course.status)"
                  >
                    <div class="w-2 h-2 rounded-full mr-2" :class="getStatusDotClasses(course.status)"></div>
                    {{ course.status.charAt(0).toUpperCase() + course.status.slice(1) }}
                  </span>
                </td>
                <td class="px-6 py-6">
                  <span class="text-sm font-medium text-gray-700 capitalize bg-gray-100 px-3 py-1 rounded-lg">
                    {{ course.level }}
                  </span>
                </td>
                <td class="px-6 py-6">
                  <div class="flex items-center">
                    <UsersIcon class="w-4 h-4 text-gray-400 mr-2" />
                    <span class="text-sm font-semibold text-gray-900">{{ course.enrollmentCount || 0 }}</span>
                  </div>
                </td>
                <td class="px-6 py-6">
                  <div class="flex items-center">
                    <div class="flex items-center">
                      <StarIcon class="h-4 w-4 text-yellow-400 fill-current" />
                      <span class="ml-1 text-sm font-semibold text-gray-900">
                        {{ course.averageRating?.toFixed(1) || '0.0' }}
                      </span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-6">
                  <span class="text-lg font-bold text-green-600">${{ course.price.toFixed(2) }}</span>
                </td>
                <td class="px-6 py-6">
                  <div class="flex items-center justify-end space-x-3">
                    <NuxtLink 
                      :to="`/dashboard/courses/${course._id}`" 
                      class="group/edit p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-300 transform hover:scale-110"
                      title="Edit Course"
                    >
                      <EditIcon class="h-5 w-5 group-hover/edit:rotate-12 transition-transform duration-300" />
                    </NuxtLink>
                    <button 
                      @click="confirmDelete(course)" 
                      class="group/delete p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 transform hover:scale-110"
                      title="Delete Course"
                    >
                      <TrashIcon class="h-5 w-5 group-hover/delete:rotate-12 transition-transform duration-300" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="lg:hidden p-4 space-y-4">
          <div 
            v-for="(course, index) in courses" 
            :key="course._id"
            class="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
            :style="{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }"
          >
            <div class="lg:flex items-start lg:space-x-4">
              <div class="h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
                <img 
                  v-if="course.thumbnail" 
                  :src="course.thumbnail" 
                  :alt="course.title"
                  class="h-16 w-16 object-cover" 
                />
                <div v-else class="h-16 w-16 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <BookOpenIcon class="h-8 w-8 text-indigo-500" />
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="lg:flex items-start justify-between">
                  <div class="lg:flex-1">
                    <h3 class="text-lg font-bold text-gray-900 truncate">{{ course.title }}</h3>
                    <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ course.description }}</p>
                  </div>
                  
                  <div class="flex lg:space-x-2 lg:ml-4">
                    <NuxtLink 
                      :to="`/dashboard/courses/${course._id}`" 
                      class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300"
                    >
                      <EditIcon class="h-5 w-5" />
                    </NuxtLink>
                    <button 
                      @click="confirmDelete(course)" 
                      class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                    >
                      <TrashIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div class="mt-4 flex flex-wrap items-center gap-3">
                  <span 
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold" 
                    :class="getStatusClasses(course.status)"
                  >
                    <div class="w-1.5 h-1.5 rounded-full mr-1.5" :class="getStatusDotClasses(course.status)"></div>
                    {{ course.status.charAt(0).toUpperCase() + course.status.slice(1) }}
                  </span>
                  
                  <span class="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full capitalize">
                    {{ course.level }}
                  </span>
                  
                  <div class="flex items-center text-xs text-gray-600">
                    <UsersIcon class="w-3 h-3 mr-1" />
                    {{ course.enrollmentCount || 0 }}
                  </div>
                  
                  <div class="flex items-center text-xs text-gray-600">
                    <StarIcon class="h-3 w-3 text-yellow-400 fill-current mr-1" />
                    {{ course.averageRating?.toFixed(1) || '0.0' }}
                  </div>
                  
                  <span class="text-sm font-bold text-green-600">${{ course.price.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Pagination -->
        <div class="px-6 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <!-- Mobile Pagination -->
            <div class="flex justify-between sm:hidden w-full">
              <button 
                @click="prevPage" 
                :disabled="pagination.page <= 1" 
                :class="[
                  'flex items-center px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all duration-300',
                  pagination.page <= 1 
                    ? 'opacity-50 cursor-not-allowed border-gray-200 text-gray-400' 
                    : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transform hover:scale-105'
                ]"
              >
                <ChevronLeftIcon class="w-4 h-4 mr-1" />
                Previous
              </button>
              <button 
                @click="nextPage" 
                :disabled="pagination.page >= pagination.totalPages" 
                :class="[
                  'flex items-center px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all duration-300',
                  pagination.page >= pagination.totalPages 
                    ? 'opacity-50 cursor-not-allowed border-gray-200 text-gray-400' 
                    : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transform hover:scale-105'
                ]"
              >
                Next
                <ChevronRightIcon class="w-4 h-4 ml-1" />
              </button>
            </div>

            <!-- Desktop Pagination -->
            <div class="hidden sm:flex items-center justify-between w-full">
              <div>
                <p class="text-sm text-gray-700 font-medium">
                  Showing <span class="font-bold text-indigo-600">{{ startItem }}</span> to 
                  <span class="font-bold text-indigo-600">{{ endItem }}</span> of 
                  <span class="font-bold text-indigo-600">{{ pagination.totalItems }}</span> results
                </p>
              </div>
              
              <nav class="flex items-center space-x-1">
                <button 
                  @click="prevPage" 
                  :disabled="pagination.page <= 1" 
                  :class="[
                    'p-2 rounded-xl border-2 transition-all duration-300',
                    pagination.page <= 1 
                      ? 'opacity-50 cursor-not-allowed border-gray-200 text-gray-400' 
                      : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transform hover:scale-110'
                  ]"
                >
                  <ChevronLeftIcon class="h-5 w-5" />
                </button>
                
                <button 
                  v-for="page in displayedPages" 
                  :key="page" 
                  @click="goToPage(page)" 
                  :class="[
                    'px-4 py-2 text-sm font-bold rounded-xl border-2 transition-all duration-300 transform hover:scale-105',
                    page === pagination.page 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-500 text-white shadow-lg' 
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  ]"
                  :disabled="page === '...'"
                >
                  {{ page }}
                </button>
                
                <button 
                  @click="nextPage" 
                  :disabled="pagination.page >= pagination.totalPages" 
                  :class="[
                    'p-2 rounded-xl border-2 transition-all duration-300',
                    pagination.page >= pagination.totalPages 
                      ? 'opacity-50 cursor-not-allowed border-gray-200 text-gray-400' 
                      : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transform hover:scale-110'
                  ]"
                >
                  <ChevronRightIcon class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Delete Modal -->
    <Teleport to="body">
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="showDeleteModal" 
          class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4"
          @click="showDeleteModal = false"
        >
          <div 
            class="bg-white rounded-2xl shadow-2xl transform transition-all duration-300 max-w-md w-full"
            :class="showDeleteModal ? 'scale-100 opacity-100' : 'scale-90 opacity-0'"
            @click.stop
          >
            <div class="p-6">
              <div class="flex items-start">
                <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangleIcon class="h-6 w-6 text-red-600" />
                </div>
                <div class="ml-4 flex-1">
                  <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Course</h3>
                  <p class="text-sm text-gray-600 leading-relaxed">
                    Are you sure you want to delete the course 
                    <span class="font-semibold text-gray-900">"{{ courseToDelete?.title }}"</span>? 
                    This action cannot be undone and will permanently remove all associated data.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="px-6 py-4 bg-gray-50 rounded-b-2xl flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button 
                @click="showDeleteModal = false" 
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300"
              >
                Cancel
              </button>
              <button 
                @click="deleteCourse" 
                :disabled="deleteLoading"
                class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <LoaderIcon v-if="deleteLoading" class="animate-spin -ml-1 mr-2 h-4 w-4" />
                Delete Course
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  PlusIcon, SearchIcon, RefreshCwIcon, BookOpenIcon, StarIcon,
  EditIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon,
  AlertTriangleIcon, LoaderIcon, UsersIcon
} from 'lucide-vue-next'
import { definePageMeta } from '#imports'

// Composables
import { useGetCourses } from '@/composables/modules/courses/useGetCourses'
import { useDeleteCourse } from '@/composables/modules/courses/useDeleteCourse'

// Router
const router = useRouter()

// State
const searchQuery = ref('')
const filters = ref({
  status: '',
  level: '',
})
const showDeleteModal = ref(false)
const courseToDelete = ref<any>(null)
const deleteLoading = ref(false)

// Pagination
const pagination = ref({
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0
})

// Get courses composable
const { courses, loading, error } = useGetCourses()
const { deleteCourse: deleteCourseAction, loading: deleteActionLoading, getCourses } = useDeleteCourse()

// Computed properties
const startItem = computed(() => {
  return (pagination.value.page - 1) * pagination.value.limit + 1
})

const endItem = computed(() => {
  return Math.min(pagination.value.page * pagination.value.limit, pagination.value.totalItems)
})

const displayedPages = computed(() => {
  const totalPages = pagination.value.totalPages
  const currentPage = pagination.value.page
  const pages = []

  if (totalPages <= 5) {
    // If 5 or fewer pages, show all
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    // Calculate start and end of page range
    let start = Math.max(2, currentPage - 1)
    let end = Math.min(totalPages - 1, currentPage + 1)

    // Adjust if at the beginning or end
    if (currentPage <= 2) {
      end = 4
    } else if (currentPage >= totalPages - 1) {
      start = totalPages - 3
    }

    // Add ellipsis if needed
    if (start > 2) {
      pages.push('...')
    }

    // Add page range
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis if needed
    if (end < totalPages - 1) {
      pages.push('...')
    }

    // Always show last page
    pages.push(totalPages)
  }

  return pages
})

// Methods
const fetchCourses = async () => {
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...filters.value
    }

    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    await getCourses(params)

    // Update pagination from response
    if (pagination.value) {
      pagination.value = {
        ...pagination.value,
        totalItems: courses.value.totalItems,
        totalPages: courses.value.totalPages
      }
    }
  } catch (err) {
    console.error('Error fetching courses:', err)
  }
}

const debouncedSearch = (() => {
  let timeout: NodeJS.Timeout | null = null
  return () => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      pagination.value.page = 1 // Reset to first page on search
      fetchCourses()
    }, 300)
  }
})()

const applyFilters = () => {
  pagination.value.page = 1 // Reset to first page when filters change
  fetchCourses()
}

const resetFilters = () => {
  searchQuery.value = ''
  filters.value = {
    status: '',
    level: '',
  }
  pagination.value.page = 1
  fetchCourses()
}

const prevPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--
    fetchCourses()
  }
}

const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++
    fetchCourses()
  }
}

const goToPage = (page: number | string) => {
  if (typeof page === 'number') {
    pagination.value.page = page
    fetchCourses()
  }
}

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200'
    case 'draft':
      return 'bg-amber-100 text-amber-800 border border-amber-200'
    case 'archived':
      return 'bg-red-100 text-red-800 border border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200'
  }
}

const getStatusDotClasses = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-emerald-500'
    case 'draft':
      return 'bg-amber-500'
    case 'archived':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

const confirmDelete = (course: any) => {
  courseToDelete.value = course
  showDeleteModal.value = true
}

const deleteCourse = async () => {
  if (!courseToDelete.value) return

  try {
    deleteLoading.value = true
    await deleteCourseAction(courseToDelete.value._id)
    showDeleteModal.value = false
    fetchCourses() // Refresh the list
  } catch (err) {
    console.error('Error deleting course:', err)
  } finally {
    deleteLoading.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchCourses()
})

// Watch for changes in pagination
watch(() => pagination.value.page, () => {
  fetchCourses()
})

definePageMeta({
  layout: 'dashboard'
})
</script>

<style scoped>
/* Custom animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-slide-in-left {
  animation: slide-in-left 0.6s ease-out;
}

.animate-slide-in-right {
  animation: slide-in-right 0.6s ease-out;
}

.animate-slide-in-up {
  animation: slide-in-up 0.6s ease-out;
}

.animate-fade-in-delayed {
  animation: fade-in 0.8s ease-out 0.2s both;
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

/* Line clamp utilities */
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

/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(to right, #6366f1, #8b5cf6);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to right, #4f46e5, #7c3aed);
}
</style>
