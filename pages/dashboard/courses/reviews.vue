<template>
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 ">Reviews</h1>
          <p class="mt-1 text-sm text-gray-900">Manage and moderate course reviews</p>
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
                placeholder="Search reviews..." 
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
              v-model="filters.rating" 
              class="px-3 py-2 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
              @change="applyFilters"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select 
              v-model="filters.isApproved" 
              class="px-3 py-2 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
              @change="applyFilters"
            >
              <option value="">All Status</option>
              <option value="true">Approved</option>
              <option value="false">Pending</option>
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
        
        <div v-else-if="reviews.length === 0" class="p-8 text-center">
          <div class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <StarIcon class="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">No reviews found</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ searchQuery || Object.values(filters).some(v => v) ? 'Try adjusting your search or filters' : 'No reviews have been submitted yet' }}
          </p>
        </div>
        
        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div 
            v-for="review in reviews" 
            :key="review._id" 
            class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
          >
            <div class="flex flex-col md:flex-row md:items-start gap-4">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                  <UserIcon class="h-6 w-6 text-gray-400" />
                </div>
              </div>

              <div class="flex-1">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ review.user?.name || 'Anonymous User' }}
                    </h3>
                    <div class="flex items-center mt-1">
                      <div class="flex">
                        <StarIcon 
                          v-for="i in 5" 
                          :key="i" 
                          :class="[
                            i <= review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600',
                            'h-4 w-4'
                          ]"
                        />
                      </div>
                      <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        {{ formatDate(review.createdAt) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <span 
                      :class="[
                        review.isApproved 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                        'px-2 py-1 text-xs font-medium rounded-full'
                      ]"
                    >
                      {{ review.isApproved ? 'Approved' : 'Pending' }}
                    </span>
                  </div>
                </div>
                
                <div class="mt-2">
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    {{ review.comment }}
                  </p>
                </div>
                
                <div class="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Course: <span class="font-medium text-gray-700 dark:text-gray-300">{{ review.course?.title || 'Unknown Course' }}</span>
                </div>
                
                <div class="mt-4 flex flex-wrap gap-2">
                  <button 
                    v-if="!review.isApproved"
                    @click="approveReview(review)" 
                    class="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    <CheckIcon class="w-3 h-3 mr-1" />
                    Approve
                  </button>
                  <button 
                    v-else
                    @click="unapproveReview(review)" 
                    class="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors duration-200"
                  >
                    <XIcon class="w-3 h-3 mr-1" />
                    Unapprove
                  </button>
                  <button 
                    @click="confirmDeleteReview(review)" 
                    class="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                  >
                    <TrashIcon class="w-3 h-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
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
                      Delete Review
                    </h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this review? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  @click="deleteReview" 
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
  import { 
    SearchIcon, RefreshCwIcon, StarIcon, UserIcon, CheckIcon, 
    XIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, 
    AlertTriangleIcon, LoaderIcon
  } from 'lucide-vue-next'
  
  // Composables
  import { useGetCourses } from '@/composables/modules/courses/useGetCourses'
  
  // State
  const searchQuery = ref('')
  const filters = ref({
    courseId: '',
    rating: '',
    isApproved: ''
  })
  const showDeleteModal = ref(false)
  const reviewToDelete = ref<any>(null)
  const deleteLoading = ref(false)
  
  // Pagination
  const pagination = ref({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  })
  
  // Mock data for reviews
  const loading = ref(true)
  
  // Get courses
  const { courses, getCourses } = useGetCourses()
  
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
  
  const reviews = ref<any[]>([])
  
  // Methods
  const fetchReviews = async () => {
    try {
      loading.value = true
      
      // In a real app, you would call an API to fetch reviews
      // const params = {
      //   page: pagination.value.page,
      //   limit: pagination.value.limit,
      //   ...filters.value
      // }
      // 
      // if (searchQuery.value) {
      //   params.search = searchQuery.value
      // }
      // 
      // const response = await getReviews(params)
      // reviews.value = response.data
      // pagination.value.totalItems = response.totalItems
      // pagination.value.totalPages = response.totalPages
      
      // For now, we'll just simulate the API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Generate mock reviews
      const mockReviews = []
      const totalItems = 35
      
      for (let i = 1; i <= totalItems; i++) {
        const courseIndex = i % courses.value.length
        const course = courses.value[courseIndex] || { _id: `course-${i}`, title: `Course ${i}` }
        
        mockReviews.push({
          _id: `review-${i}`,
          user: {
            _id: `user-${i}`,
            name: `User ${i}`,
            email: `user${i}@example.com`
          },
          course: course,
          rating: Math.floor(Math.random() * 5) + 1,
          comment: `This is a ${['great', 'good', 'average', 'poor', 'terrible'][Math.floor(Math.random() * 5)]} course. ${
            Math.random() > 0.5 ? 'I learned a lot from it.' : 'I would recommend it to others.'
          } ${
            Math.random() > 0.7 ? 'The instructor was very knowledgeable and explained concepts clearly.' : ''
          }`,
          isApproved: Math.random() > 0.3,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
        })
      }
      
      // Apply filters
      let filteredReviews = [...mockReviews]
      
      if (filters.value.courseId) {
        filteredReviews = filteredReviews.filter(review => review.course._id === filters.value.courseId)
      }
      
      if (filters.value.rating) {
        filteredReviews = filteredReviews.filter(review => review.rating === parseInt(filters.value.rating))
      }
      
      if (filters.value.isApproved === 'true') {
        filteredReviews = filteredReviews.filter(review => review.isApproved)
      } else if (filters.value.isApproved === 'false') {
        filteredReviews = filteredReviews.filter(review => !review.isApproved)
      }
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filteredReviews = filteredReviews.filter(review => 
          review.comment.toLowerCase().includes(query) || 
          review.user.name.toLowerCase().includes(query) ||
          review.course.title.toLowerCase().includes(query)
        )
      }
      
      // Apply pagination
      const start = (pagination.value.page - 1) * pagination.value.limit
      const end = start + pagination.value.limit
      
      reviews.value = filteredReviews.slice(start, end)
      pagination.value.totalItems = filteredReviews.length
      pagination.value.totalPages = Math.ceil(filteredReviews.length / pagination.value.limit)
      
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      loading.value = false
    }
  }
  
  const fetchCourses = async () => {
    try {
      await getCourses()
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
        fetchReviews()
      }, 300)
    }
  })()
  
  const applyFilters = () => {
    pagination.value.page = 1 // Reset to first page when filters change
    fetchReviews()
  }
  
  const resetFilters = () => {
    searchQuery.value = ''
    filters.value = {
      courseId: '',
      rating: '',
      isApproved: ''
    }
    pagination.value.page = 1
    fetchReviews()
  }
  
  const prevPage = () => {
    if (pagination.value.page > 1) {
      pagination.value.page--
      fetchReviews()
    }
  }
  
  const nextPage = () => {
    if (pagination.value.page < pagination.value.totalPages) {
      pagination.value.page++
      fetchReviews()
    }
  }
  
  const goToPage = (page: number | string) => {
    if (typeof page === 'number') {
      pagination.value.page = page
      fetchReviews()
    }
  }
  
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }
  
  const approveReview = async (review: any) => {
    try {
      // In a real app, you would call an API to approve the review
      // await approveReviewAction(review._id)
      
      // For now, we'll just update the local state
      review.isApproved = true
    } catch (err) {
      console.error('Error approving review:', err)
    }
  }
  
  const unapproveReview = async (review: any) => {
    try {
      // In a real app, you would call an API to unapprove the review
      // await unapproveReviewAction(review._id)
      
      // For now, we'll just update the local state
      review.isApproved = false
    } catch (err) {
      console.error('Error unapproving review:', err)
    }
  }
  
  const confirmDeleteReview = (review: any) => {
    reviewToDelete.value = review
    showDeleteModal.value = true
  }
  
  const deleteReview = async () => {
    if (!reviewToDelete.value) return
    
    try {
      deleteLoading.value = true
      
      // In a real app, you would call an API to delete the review
      // await deleteReviewAction(reviewToDelete.value._id)
      
      // For now, we'll just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Remove the review from the list
      reviews.value = reviews.value.filter(review => review._id !== reviewToDelete.value._id)
      
      showDeleteModal.value = false
    } catch (err) {
      console.error('Error deleting review:', err)
    } finally {
      deleteLoading.value = false
    }
  }
  
  // Lifecycle hooks
  onMounted(() => {
    fetchCourses().then(() => fetchReviews())
  })
  
  // Watch for changes in pagination
  watch(() => pagination.value.page, () => {
    fetchReviews()
  })

  definePageMeta({
    layout: 'dashboard'
})

  </script>