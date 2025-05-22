<template>
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 ">Enrollments</h1>
          <p class="mt-1 text-sm text-gray-900">Manage student enrollments in your courses</p>
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
                placeholder="Search by student or course..." 
                class="w-full pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                @input="debouncedSearch"
              />
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <select
              v-model="filters.courseId"
              class="px-3 py-2 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
              @change="applyFilters"
            >
              <option value="">All Courses</option>
              <option v-for="course in courses" :key="course._id" :value="course._id">
                {{ course.title }}
              </option>
            </select>
            <select 
              v-model="filters.isCompleted" 
              class="px-3 py-2 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
              @change="applyFilters"
            >
              <option value="">All Status</option>
              <option value="true">Completed</option>
              <option value="false">In Progress</option>
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
        
        <div v-else-if="enrollments.length === 0" class="p-8 text-center">
          <div class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <UsersIcon class="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">No enrollments found</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ searchQuery ? 'Try adjusting your search or filters' : 'No students have enrolled in your courses yet' }}
          </p>
        </div>
        
        <div v-else>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Progress
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Enrolled On
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Accessed
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr 
                  v-for="enrollment in enrollments" 
                  :key="enrollment._id" 
                  class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div class="h-10 w-10 flex items-center justify-center">
                          <UserIcon class="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ enrollment.user?.name || 'Unknown User' }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          {{ enrollment.user?.email || 'No email' }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ enrollment.course?.title || 'Unknown Course' }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ enrollment.course?.level || 'N/A' }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2 max-w-[100px]">
                        <div 
                          class="bg-primary h-2.5 rounded-full" 
                          :style="{ width: `${enrollment.progressPercentage || 0}%` }"
                        ></div>
                      </div>
                      <span class="text-sm text-gray-500 dark:text-gray-400">
                        {{ enrollment.progressPercentage || 0 }}%
                      </span>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span v-if="enrollment.isCompleted" class="text-green-500 font-medium">Completed</span>
                      <span v-else>In Progress</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(enrollment.createdAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ enrollment.lastAccessedAt ? formatDate(enrollment.lastAccessedAt) : 'Never' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end space-x-2">
                      <button 
                        @click="viewEnrollmentDetails(enrollment)" 
                        class="text-primary hover:text-primary/80 transition-colors duration-200"
                        title="View Details"
                      >
                        <EyeIcon class="h-4 w-4" />
                      </button>
                      <button 
                        @click="confirmUnenroll(enrollment)" 
                        class="text-red-500 hover:text-red-700 transition-colors duration-200"
                        title="Unenroll"
                      >
                        <UserMinusIcon class="h-4 w-4" />
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
                :disabled="pagination.page &lt;= 1" 
                :class="[
                  pagination.page &lt;= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700',
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
                    :disabled="pagination.page &lt;= 1" 
                    :class="[
                      pagination.page &lt;= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700',
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
        <div v-if="showDetailsModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDetailsModal = false"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      Enrollment Details
                    </h3>
                    
                    <div v-if="selectedEnrollment" class="mt-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Student</h4>
                          <p class="mt-1 text-sm text-gray-900 dark:text-white">
                            {{ selectedEnrollment.user?.name || 'Unknown User' }}
                          </p>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            {{ selectedEnrollment.user?.email || 'No email' }}
                          </p>
                        </div>
                        
                        <div>
                          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Course</h4>
                          <p class="mt-1 text-sm text-gray-900 dark:text-white">
                            {{ selectedEnrollment.course?.title || 'Unknown Course' }}
                          </p>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            {{ selectedEnrollment.course?.level || 'N/A' }} Level
                          </p>
                        </div>
                        
                        <div>
                          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Enrollment Date</h4>
                          <p class="mt-1 text-sm text-gray-900 dark:text-white">
                            {{ formatDate(selectedEnrollment.createdAt) }}
                          </p>
                        </div>
                        
                        <div>
                          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Accessed</h4>
                          <p class="mt-1 text-sm text-gray-900 dark:text-white">
                            {{ selectedEnrollment.lastAccessedAt ? formatDate(selectedEnrollment.lastAccessedAt) : 'Never' }}
                          </p>
                        </div>
                        
                        <div class="md:col-span-2">
                          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</h4>
                          <div class="mt-2 flex items-center">
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                              <div 
                                class="bg-primary h-2.5 rounded-full" 
                                :style="{ width: `${selectedEnrollment.progressPercentage || 0}%` }"
                              ></div>
                            </div>
                            <span class="text-sm text-gray-700 dark:text-gray-300">
                              {{ selectedEnrollment.progressPercentage || 0 }}%
                            </span>
                          </div>
                          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <span v-if="selectedEnrollment.isCompleted" class="text-green-500 font-medium">Completed</span>
                            <span v-else>In Progress</span>
                          </p>
                        </div>
                      </div>
                      
                      <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Completed Lessons</h4>
                        
                        <div v-if="!selectedEnrollment.completedLessons || selectedEnrollment.completedLessons.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
                          No lessons completed yet.
                        </div>
                        
                        <div v-else class="space-y-2 max-h-60 overflow-y-auto pr-2">
                          <div 
                            v-for="(lesson, index) in selectedEnrollment.completedLessons" 
                            :key="index" 
                            class="flex items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
                          >
                            <CheckCircleIcon class="h-5 w-5 text-green-500 mr-2" />
                            <div class="text-sm text-gray-700 dark:text-gray-300">
                              {{ lesson.lessonTitle || `Lesson ${index + 1}` }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  @click="showDetailsModal = false" 
                  type="button" 
                  class="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
                <button 
                  @click="confirmUnenroll(selectedEnrollment)" 
                  type="button" 
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Unenroll Student
                </button>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
      
      <Teleport to="body">
        <div v-if="showUnenrollModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showUnenrollModal = false"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangleIcon class="h-6 w-6 text-red-600" />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      Unenroll Student
                    </h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to unenroll this student from the course? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  @click="unenrollStudent" 
                  type="button" 
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  :disabled="unenrollLoading"
                >
                  <LoaderIcon v-if="unenrollLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Unenroll
                </button>
                <button 
                  @click="showUnenrollModal = false" 
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
  import { 
    SearchIcon, RefreshCwIcon, UsersIcon, UserIcon, EyeIcon, 
    UserMinusIcon, ChevronLeftIcon, ChevronRightIcon, 
    CheckCircleIcon, AlertTriangleIcon, LoaderIcon
  } from 'lucide-vue-next'
  
  // Composables
  import { useGetCourses } from '@/composables/modules/courses/useGetCourses'
  import { useCourseEnrollments } from '@/composables/modules/courses/useCourseEnrollments'
  import { useUserEnrollments } from '@/composables/modules/courses/useUserEnrollments'
  import { useDebounce } from '@vueuse/core';
  
  // State
  const searchQuery = ref('')
  const filters = ref({
    courseId: '',
    isCompleted: ''
  })
  const showDetailsModal = ref(false)
  const showUnenrollModal = ref(false)
  const selectedEnrollment = ref<any>(null)
  const unenrollLoading = ref(false)
  
  // Pagination
  const pagination = ref({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  })
  
  // Get courses and enrollments
  const { courses, getCourses } = useGetCourses()
  const { enrollments, loading, getCourseEnrollments } = useCourseEnrollments()
  const { enrollments: userEnrollments, getUserEnrollments } = useUserEnrollments()
  
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
  const fetchEnrollments = async () => {
    try {
      const params = {
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...filters.value
      }
      
      if (searchQuery.value) {
        params.search = searchQuery.value
      }
      
      if (filters.value.courseId) {
        await getCourseEnrollments(filters.value.courseId, params)
      } else {
        await getUserEnrollments(params)
      }
      
      // Update pagination from response
      if (pagination.value) {
        pagination.value = {
          ...pagination.value,
          totalItems: pagination.value.totalItems,
          totalPages: pagination.value.totalPages
        }
      }
    } catch (err) {
      console.error('Error fetching enrollments:', err)
    }
  }
  
  const fetchCourses = async () => {
    try {
      await getCourses()
    } catch (err) {
      console.error('Error fetching courses:', err)
    }
  }
  
  const debouncedSearch = useDebounce(() => {
    pagination.value.page = 1;
    fetchEnrollments();
  }, 300);
  
  const applyFilters = () => {
    pagination.value.page = 1 // Reset to first page when filters change
    fetchEnrollments()
  }
  
  const resetFilters = () => {
    searchQuery.value = ''
    filters.value = {
      courseId: '',
      isCompleted: ''
    }
    pagination.value.page = 1
    fetchEnrollments()
  }
  
  const prevPage = () => {
    if (pagination.value.page > 1) {
      pagination.value.page--
      fetchEnrollments()
    }
  }
  
  const nextPage = () => {
    if (pagination.value.page < pagination.value.totalPages) {
      pagination.value.page++
      fetchEnrollments()
    }
  }
  
  const goToPage = (page: number | string) => {
    if (typeof page === 'number') {
      pagination.value.page = page
      fetchEnrollments()
    }
  }
  
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  const viewEnrollmentDetails = (enrollment: any) => {
    selectedEnrollment.value = enrollment
    showDetailsModal.value = true
  }
  
  const confirmUnenroll = (enrollment: any) => {
    selectedEnrollment.value = enrollment
    showUnenrollModal.value = true
    showDetailsModal.value = false
  }
  
  const unenrollStudent = async () => {
    if (!selectedEnrollment.value) return
    
    try {
      unenrollLoading.value = true
      // In a real app, you would call an API to unenroll the student
      // await unenrollStudentAction(selectedEnrollment.value._id)
      
      // For now, we'll just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showUnenrollModal.value = false
      fetchEnrollments() // Refresh the list
    } catch (err) {
      console.error('Error unenrolling student:', err)
    } finally {
      unenrollLoading.value = false
    }
  }
  
  // Lifecycle hooks
  onMounted(() => {
    fetchCourses()
    fetchEnrollments()
  })
  
  // Watch for changes in pagination
  watch(() => pagination.value.page, () => {
    fetchEnrollments()
  })

  definePageMeta({
    layout: 'dashboard'
})
  </script>