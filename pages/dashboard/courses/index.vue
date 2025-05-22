<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Courses</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your courses, sections, and lessons</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink 
          to="/dashboard/courses/new" 
          class="inline-flex items-center px-4 text-white py-2 text-sm font-medium bg-black rounded-lg shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          New Course
        </NuxtLink>
      </div>
    </div>

    <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <div class="flex-1">
          <div class="relative">
            <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search courses..."
              class="w-full pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
              @input="debouncedSearch"
            />
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <select 
            v-model="filters.status" 
            class="px-3 py-2 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
            @change="applyFilters"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <select 
            v-model="filters.level" 
            class="px-3 py-2 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
            @change="applyFilters"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <button 
            @click="resetFilters" 
            class="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <RefreshCwIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div v-if="loading" class="p-8 flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
      
      <div v-else-if="courses.length === 0" class="p-8 text-center">
        <div class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <BookOpenIcon class="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">No courses found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ searchQuery ? 'Try adjusting your search or filters' : 'Get started by creating a new course' }}
        </p>
        <NuxtLink 
          to="/dashboard/courses/new" 
          class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          New Course
        </NuxtLink>
      </div>
      
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Level
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Enrollments
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rating
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr 
                v-for="course in courses" 
                :key="course._id" 
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <img v-if="course.thumbnail" :src="course.thumbnail" alt="" class="h-10 w-10 object-cover" />
                      <div v-else class="h-10 w-10 flex items-center justify-center">
                        <BookOpenIcon class="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ course.title }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {{ course.description }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="getStatusClasses(course.status)">
                    {{ course.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {{ course.level }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ course.enrollmentCount || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <StarIcon class="h-4 w-4 text-yellow-400" />
                    <span class="ml-1 text-sm text-gray-500 dark:text-gray-400">
                      {{ course.averageRating?.toFixed(1) || '0.0' }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  ${{ course.price.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <NuxtLink 
                      :to="`/dashboard/courses/${course._id}`" 
                      class="text-primary hover:text-primary/80 transition-colors duration-200"
                      title="Edit"
                    >
                      <EditIcon class="h-4 w-4" />
                    </NuxtLink>
                    <button 
                      @click="confirmDelete(course)" 
                      class="text-red-500 hover:text-red-700 transition-colors duration-200"
                      title="Delete"
                    >
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div class="flex-1 flex justify-between sm:hidden">
            <button 
              @click="prevPage" 
              :disabled="pagination.page <= 1" 
              :class="[
                pagination.page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700',
                'relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800'
              ]"
            >
              Previous
            </button>
            <button 
              @click="nextPage" 
              :disabled="pagination.page >= pagination.totalPages" 
              :class="[
                pagination.page >= pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700',
                'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800'
              ]"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Showing <span class="font-medium">{{ startItem }}</span> to <span class="font-medium">{{ endItem }}</span> of <span class="font-medium">{{ pagination.totalItems }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  @click="prevPage" 
                  :disabled="pagination.page <= 1" 
                  :class="[
                    pagination.page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700',
                    'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400'
                  ]"
                >
                  <span class="sr-only">Previous</span>
                  <ChevronLeftIcon class="h-5 w-5" />
                </button>
                
                <button 
                  v-for="page in displayedPages" 
                  :key="page" 
                  @click="goToPage(page)" 
                  :class="[
                    page === pagination.page 
                      ? 'z-10 bg-primary/10 border-primary text-primary' 
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]"
                >
                  {{ page }}
                </button>
                
                <button 
                  @click="nextPage" 
                  :disabled="pagination.page >= pagination.totalPages" 
                  :class="[
                    pagination.page >= pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700',
                    'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400'
                  ]"
                >
                  <span class="sr-only">Next</span>
                  <ChevronRightIcon class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDeleteModal = false"></div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangleIcon class="h-6 w-6 text-red-600" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                    Delete Course
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete the course "{{ courseToDelete?.title }}"? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="deleteCourse" 
                type="button" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                :disabled="deleteLoading"
              >
                <LoaderIcon v-if="deleteLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Delete
              </button>
              <button 
                @click="showDeleteModal = false" 
                type="button" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  PlusIcon, SearchIcon, RefreshCwIcon, BookOpenIcon, StarIcon, 
  EditIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, 
  AlertTriangleIcon, LoaderIcon
} from 'lucide-vue-next'

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
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'draft':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    case 'archived':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
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