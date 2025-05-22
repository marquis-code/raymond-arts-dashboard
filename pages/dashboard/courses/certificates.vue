<template>
    <div class="space-y-6">
      <!-- Header with actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Certificates</h1>
          <p class="mt-1 text-sm text-gray-900">Manage and issue course completion certificates</p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="showIssueModal = true" 
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black rounded-lg shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Issue Certificate
          </button>
        </div>
      </div>
  
      <!-- Filters and search -->
      <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <div class="flex-1">
            <div class="relative">
              <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search certificates..." 
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
            <input 
              v-model="filters.dateFrom" 
              type="date" 
              class="px-3 py-2 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
              @change="applyFilters"
            />
            <input 
              v-model="filters.dateTo" 
              type="date" 
              class="px-3 py-2 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
              @change="applyFilters"
            />
            <button 
              @click="resetFilters" 
              class="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <RefreshCwIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
  
      <!-- Certificates list -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div v-if="loading" class="p-8 flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        
        <div v-else-if="certificates.length === 0" class="p-8 text-center">
          <div class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <AwardIcon class="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">No certificates found</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ searchQuery || Object.values(filters).some(v => v) ? 'Try adjusting your search or filters' : 'No certificates have been issued yet' }}
          </p>
          <button 
            @click="showIssueModal = true" 
            class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Issue Certificate
          </button>
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
                    Certificate Number
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr 
                  v-for="certificate in certificates" 
                  :key="certificate._id" 
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
                          {{ certificate.user?.name || 'Unknown User' }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          {{ certificate.user?.email || 'No email' }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ certificate.course?.title || 'Unknown Course' }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ certificate.course?.level || 'N/A' }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ certificate.certificateNumber }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(certificate.issueDate) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end space-x-2">
                      <button 
                        @click="viewCertificate(certificate)" 
                        class="text-primary hover:text-primary/80 transition-colors duration-200"
                        title="View Certificate"
                      >
                        <EyeIcon class="h-4 w-4" />
                      </button>
                      <button 
                        @click="downloadCertificate(certificate)" 
                        class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                        title="Download Certificate"
                      >
                        <DownloadIcon class="h-4 w-4" />
                      </button>
                      <button 
                        @click="confirmRevokeCertificate(certificate)" 
                        class="text-red-500 hover:text-red-700 transition-colors duration-200"
                        title="Revoke Certificate"
                      >
                        <XCircleIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
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
      
      <!-- Issue Certificate Modal -->
      <Teleport to="body">
        <div v-if="showIssueModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showIssueModal = false"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      Issue New Certificate
                    </h3>
                    <div class="mt-4 space-y-4">
                      <div>
                        <label for="course-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Course <span class="text-red-500">*</span>
                        </label>
                        <select 
                          id="course-select" 
                          v-model="newCertificate.courseId" 
                          class="w-full px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                          @change="loadEligibleStudents"
                        >
                          <option value="">Select a course</option>
                          <option v-for="course in courses" :key="course._id" :value="course._id">
                            {{ course.title }}
                          </option>
                        </select>
                      </div>
                      
                      <div>
                        <label for="student-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Student <span class="text-red-500">*</span>
                        </label>
                        <select 
                          id="student-select" 
                          v-model="newCertificate.userId" 
                          class="w-full px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                          :disabled="!newCertificate.courseId || loadingStudents"
                        >
                          <option value="">{{ loadingStudents ? 'Loading students...' : 'Select a student' }}</option>
                          <option v-for="student in eligibleStudents" :key="student._id" :value="student._id">
                            {{ student.name }} ({{ student.email }})
                          </option>
                        </select>
                        <p v-if="newCertificate.courseId && !loadingStudents && eligibleStudents.length === 0" class="mt-1 text-sm text-red-500">
                          No eligible students found for this course.
                        </p>
                      </div>
                      
                      <div>
                        <label for="issue-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Issue Date <span class="text-red-500">*</span>
                        </label>
                        <input 
                          id="issue-date" 
                          v-model="newCertificate.issueDate" 
                          type="date" 
                          class="w-full px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  @click="issueCertificate" 
                  type="button" 
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                  :disabled="issueLoading || !isFormValid"
                >
                  <LoaderIcon v-if="issueLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Issue Certificate
                </button>
                <button 
                  @click="showIssueModal = false" 
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
      
      <!-- View Certificate Modal -->
      <Teleport to="body">
        <div v-if="showViewModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showViewModal = false"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div class="bg-white dark:bg-gray-800 p-6">
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                    Certificate Preview
                  </h3>
                  <button 
                    @click="showViewModal = false" 
                    class="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <XIcon class="h-6 w-6" />
                  </button>
                </div>
                
                <div v-if="selectedCertificate" class="border border-gray-200 dark:border-gray-700 p-6 rounded-lg bg-white">
                  <div class="relative">
                    <!-- Certificate border -->
                    <div class="absolute inset-0 border-8 border-double border-primary/20 rounded-lg pointer-events-none"></div>
                    
                    <!-- Certificate content -->
                    <div class="text-center py-8 px-4">
                      <div class="mb-6">
                        <AwardIcon class="h-16 w-16 text-primary mx-auto" />
                      </div>
                      
                      <h2 class="text-2xl font-bold text-gray-900 mb-2">Certificate of Completion</h2>
                      <p class="text-gray-600 mb-6">This is to certify that</p>
                      
                      <p class="text-xl font-bold text-gray-900 mb-2">
                        {{ selectedCertificate.user?.name || 'Student Name' }}
                      </p>
                      
                      <p class="text-gray-600 mb-6">has successfully completed the course</p>
                      
                      <p class="text-xl font-bold text-primary mb-6">
                        {{ selectedCertificate.course?.title || 'Course Title' }}
                      </p>
                      
                      <div class="flex justify-between items-center mt-8">
                        <div class="text-left">
                          <p class="text-sm text-gray-600">Issue Date</p>
                          <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedCertificate.issueDate) }}</p>
                        </div>
                        
                        <div class="text-right">
                          <p class="text-sm text-gray-600">Certificate Number</p>
                          <p class="text-sm font-medium text-gray-900">{{ selectedCertificate.certificateNumber }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-6 flex justify-end">
                  <button 
                    @click="downloadCertificate(selectedCertificate)" 
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
                  >
                    <DownloadIcon class="w-4 h-4 mr-2" />
                    Download Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
      
      <!-- Revoke Certificate Modal -->
      <Teleport to="body">
        <div v-if="showRevokeModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showRevokeModal = false"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangleIcon class="h-6 w-6 text-red-600" />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      Revoke Certificate
                    </h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to revoke this certificate? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  @click="revokeCertificate" 
                  type="button" 
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  :disabled="revokeLoading"
                >
                  <LoaderIcon v-if="revokeLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Revoke
                </button>
                <button 
                  @click="showRevokeModal = false" 
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
    PlusIcon, SearchIcon, RefreshCwIcon, AwardIcon, UserIcon, EyeIcon, 
    DownloadIcon, XCircleIcon, ChevronLeftIcon, ChevronRightIcon, 
    AlertTriangleIcon, LoaderIcon, XIcon, CheckIcon
  } from 'lucide-vue-next'
  
  // Composables
  import { useGetCourses } from '@/composables/modules/courses/useGetCourses'
  import { useUserCertificates } from '@/composables/modules/courses/useUserCertificates'
  import { useVerifyCertificate } from '@/composables/modules/courses/useVerifyCertificate'
  
  // State
  const searchQuery = ref('')
  const filters = ref({
    courseId: '',
    dateFrom: '',
    dateTo: ''
  })
  const showIssueModal = ref(false)
  const showViewModal = ref(false)
  const showRevokeModal = ref(false)
  const selectedCertificate = ref<any>(null)
  const issueLoading = ref(false)
  const revokeLoading = ref(false)
  const loadingStudents = ref(false)
  const eligibleStudents = ref<any[]>([])
  
  // New certificate form
  const newCertificate = ref({
    courseId: '',
    userId: '',
    issueDate: new Date().toISOString().split('T')[0]
  })
  
  // Pagination
  const pagination = ref({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  })
  
  // Get courses and certificates
  const { courses, getCourses } = useGetCourses()
  const { certificates, loading, getUserCertificates } = useUserCertificates()
  const { verifyCertificate } = useVerifyCertificate()
  
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
  
  const isFormValid = computed(() => {
    return newCertificate.value.courseId && 
           newCertificate.value.userId && 
           newCertificate.value.issueDate
  })
  
  // Methods
  const fetchCertificates = async () => {
    try {
      // In a real app, you would call an API to fetch certificates with filters
      // For now, we'll just call the getUserCertificates composable
      await getUserCertificates()
      
      // Apply filters to the certificates
      let filteredCertificates = [...certificates.value]
      
      if (filters.value.courseId) {
        filteredCertificates = filteredCertificates.filter(cert => 
          cert.course && cert.course._id === filters.value.courseId
        )
      }
      
      if (filters.value.dateFrom) {
        const fromDate = new Date(filters.value.dateFrom)
        filteredCertificates = filteredCertificates.filter(cert => 
          new Date(cert.issueDate) >= fromDate
        )
      }
      
      if (filters.value.dateTo) {
        const toDate = new Date(filters.value.dateTo)
        toDate.setHours(23, 59, 59, 999) // End of day
        filteredCertificates = filteredCertificates.filter(cert => 
          new Date(cert.issueDate) <= toDate
        )
      }
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filteredCertificates = filteredCertificates.filter(cert => 
          (cert.user?.name && cert.user.name.toLowerCase().includes(query)) ||
          (cert.user?.email && cert.user.email.toLowerCase().includes(query)) ||
          (cert.course?.title && cert.course.title.toLowerCase().includes(query)) ||
          cert.certificateNumber.toLowerCase().includes(query)
        )
      }
      
      // Update pagination
      pagination.value.totalItems = filteredCertificates.length
      pagination.value.totalPages = Math.ceil(filteredCertificates.length / pagination.value.limit)
      
      // Apply pagination
      const start = (pagination.value.page - 1) * pagination.value.limit
      const end = start + pagination.value.limit
      certificates.value = filteredCertificates.slice(start, end)
      
    } catch (err) {
      console.error('Error fetching certificates:', err)
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
        fetchCertificates()
      }, 300)
    }
  })()
  
  const applyFilters = () => {
    pagination.value.page = 1 // Reset to first page when filters change
    fetchCertificates()
  }
  
  const resetFilters = () => {
    searchQuery.value = ''
    filters.value = {
      courseId: '',
      dateFrom: '',
      dateTo: ''
    }
    pagination.value.page = 1
    fetchCertificates()
  }
  
  const prevPage = () => {
    if (pagination.value.page > 1) {
      pagination.value.page--
      fetchCertificates()
    }
  }
  
  const nextPage = () => {
    if (pagination.value.page < pagination.value.totalPages) {
      pagination.value.page++
      fetchCertificates()
    }
  }
  
  const goToPage = (page: number | string) => {
    if (typeof page === 'number') {
      pagination.value.page = page
      fetchCertificates()
    }
  }
  
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }
  
  const loadEligibleStudents = async () => {
    if (!newCertificate.value.courseId) {
      eligibleStudents.value = []
      return
    }
    
    try {
      loadingStudents.value = true
      
      // In a real app, you would call an API to fetch eligible students
      // For now, we'll just simulate the API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate mock students
      eligibleStudents.value = Array.from({ length: 5 }, (_, i) => ({
        _id: `student-${i + 1}`,
        name: `Student ${i + 1}`,
        email: `student${i + 1}@example.com`
      }))
      
    } catch (err) {
      console.error('Error loading eligible students:', err)
      eligibleStudents.value = []
    } finally {
      loadingStudents.value = false
    }
  }
  
  const issueCertificate = async () => {
    if (!isFormValid.value) return
    
    try {
      issueLoading.value = true
      
      // In a real app, you would call an API to issue a certificate
      // For now, we'll just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate a random certificate number
      const certificateNumber = `CERT-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
      
      // Find the course and student
      const course = courses.value.find(c => c._id === newCertificate.value.courseId)
      const student = eligibleStudents.value.find(s => s._id === newCertificate.value.userId)
      
      // Create a new certificate
      const newCert = {
        _id: `cert-${Date.now()}`,
        user: student,
        course: course,
        certificateNumber,
        issueDate: newCertificate.value.issueDate,
        certificateUrl: ''
      }
      
      // Add to the list
      certificates.value.unshift(newCert)
      
      // Reset form
      newCertificate.value = {
        courseId: '',
        userId: '',
        issueDate: new Date().toISOString().split('T')[0]
      }
      
      // Close modal
      showIssueModal.value = false
      
    } catch (err) {
      console.error('Error issuing certificate:', err)
    } finally {
      issueLoading.value = false
    }
  }
  
  const viewCertificate = (certificate: any) => {
    selectedCertificate.value = certificate
    showViewModal.value = true
  }
  
  const downloadCertificate = (certificate: any) => {
    // In a real app, you would generate and download a PDF
    // For now, we'll just show an alert
    alert(`Downloading certificate ${certificate.certificateNumber}...`)
  }
  
  const confirmRevokeCertificate = (certificate: any) => {
    selectedCertificate.value = certificate
    showRevokeModal.value = true
  }
  
  const revokeCertificate = async () => {
    if (!selectedCertificate.value) return
    
    try {
      revokeLoading.value = true
      
      // In a real app, you would call an API to revoke the certificate
      // For now, we'll just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Remove from the list
      certificates.value = certificates.value.filter(cert => cert._id !== selectedCertificate.value._id)
      
      // Close modal
      showRevokeModal.value = false
      
    } catch (err) {
      console.error('Error revoking certificate:', err)
    } finally {
      revokeLoading.value = false
    }
  }
  
  // Lifecycle hooks
  onMounted(() => {
    fetchCourses().then(() => fetchCertificates())
  })
  
  // Watch for changes in pagination
  watch(() => pagination.value.page, () => {
    fetchCertificates()
  })

  definePageMeta({
    layout: 'dashboard'
})
  </script>