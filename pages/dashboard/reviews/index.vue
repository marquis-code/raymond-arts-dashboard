<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
              <h1 class="text-xl font-bold text-gray-900">Review Manager</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <span class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{{ approvedCount }} Approved</span>
              </span>
              <span class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>{{ pendingCount }} Pending</span>
              </span>
              <span class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{{ rejectedCount }} Rejected</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters and Search -->
      <div class="mb-8 space-y-4">
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search reviews by comment, product, or user..."
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <!-- Status Filter -->
          <div class="sm:w-48">
            <select
              v-model="statusFilter"
              class="block w-full px-3 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Reviews</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <!-- Rating Filter -->
          <div class="sm:w-48">
            <select
              v-model="ratingFilter"
              class="block w-full px-3 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <!-- View Toggle -->
          <div class="flex items-center bg-white border border-gray-300 rounded-xl p-1">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Bulk Actions -->
        <div v-if="selectedReviews.length > 0" class="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <span class="text-sm font-medium text-blue-900">
            {{ selectedReviews.length }} review{{ selectedReviews.length !== 1 ? 's' : '' }} selected
          </span>
          <div class="flex space-x-2">
            <button
              @click="bulkApprove"
              class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
            >
              Approve Selected
            </button>
            <button
              @click="bulkReject"
              class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
            >
              Reject Selected
            </button>
            <button
              @click="clearSelection"
              class="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews Grid -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="filteredReviews.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No reviews found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="review in filteredReviews"
          :key="review.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
          :class="{
            'ring-2 ring-blue-500': selectedReviews.includes(review.id),
            'border-green-200 bg-green-50': review.status === 'approved',
            'border-yellow-200 bg-yellow-50': review.status === 'pending',
            'border-red-200 bg-red-50': review.status === 'rejected'
          }"
        >
          <!-- Card Header -->
          <div class="p-4 border-b border-gray-100">
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-3">
                <input
                  type="checkbox"
                  :checked="selectedReviews.includes(review.id)"
                  @change="toggleSelection(review.id)"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div>
                  <h3 class="text-sm font-medium text-gray-900 truncate">
                    {{ review.productId.name }}
                  </h3>
                  <p class="text-xs text-gray-500">{{ review.userName }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800': review.status === 'approved',
                    'bg-yellow-100 text-yellow-800': review.status === 'pending',
                    'bg-red-100 text-red-800': review.status === 'rejected'
                  }"
                >
                  {{ review.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-4">
            <!-- Star Rating -->
            <div class="flex items-center space-x-1 mb-3">
              <div class="flex">
                <svg
                  v-for="star in 5"
                  :key="star"
                  class="w-4 h-4 transition-colors duration-200"
                  :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
              <span class="text-sm text-gray-600 ml-2">{{ review.rating }}/5</span>
            </div>

            <!-- Comment -->
            <p class="text-sm text-gray-700 mb-4 line-clamp-3">{{ review.comment }}</p>

            <!-- Date -->
            <p class="text-xs text-gray-500 mb-4">
              {{ formatDate(review.createdAt) }}
            </p>

            <!-- Actions -->
            <div v-if="review.status === 'pending'" class="flex space-x-2">
              <button
                @click="showConfirmModal('approve', review)"
                :disabled="processingReviews.includes(review.id)"
                class="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <span v-if="processingReviews.includes(review.id)" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else>Approve</span>
              </button>
              <button
                @click="showConfirmModal('reject', review)"
                :disabled="processingReviews.includes(review.id)"
                class="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <span v-if="processingReviews.includes(review.id)" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else>Reject</span>
              </button>
            </div>

            <div v-else class="flex items-center justify-center py-2">
              <span class="text-sm text-gray-500">
                {{ review.status === 'approved' ? 'Review approved' : 'Review rejected' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    :checked="selectedReviews.length === filteredReviews.length && filteredReviews.length > 0"
                    @change="toggleSelectAll"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="review in filteredReviews"
                :key="review.id"
                class="hover:bg-gray-50 transition-colors duration-200"
                :class="{
                  'bg-blue-50': selectedReviews.includes(review.id),
                  'bg-green-50': review.status === 'approved',
                  'bg-yellow-50': review.status === 'pending',
                  'bg-red-50': review.status === 'rejected'
                }"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    :checked="selectedReviews.includes(review.id)"
                    @change="toggleSelection(review.id)"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ review.productId.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ review.userName }}</div>
                  <div class="text-sm text-gray-500">{{ review.userRole }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex">
                      <svg
                        v-for="star in 5"
                        :key="star"
                        class="w-4 h-4"
                        :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                      </svg>
                    </div>
                    <span class="ml-2 text-sm text-gray-600">{{ review.rating }}/5</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate">{{ review.comment }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': review.status === 'approved',
                      'bg-yellow-100 text-yellow-800': review.status === 'pending',
                      'bg-red-100 text-red-800': review.status === 'rejected'
                    }"
                  >
                    {{ review.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(review.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div v-if="review.status === 'pending'" class="flex space-x-2">
                    <button
                      @click="showConfirmModal('approve', review)"
                      :disabled="processingReviews.includes(review.id)"
                      class="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </button>
                    <button
                      @click="showConfirmModal('reject', review)"
                      :disabled="processingReviews.includes(review.id)"
                      class="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  <div v-else class="text-gray-400">
                    {{ review.status === 'approved' ? 'Approved' : 'Rejected' }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="closeModal"
        ></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
              :class="{
                'bg-green-100': modalAction === 'approve',
                'bg-red-100': modalAction === 'reject'
              }"
            >
              <svg
                v-if="modalAction === 'approve'"
                class="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <svg
                v-else
                class="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ modalAction === 'approve' ? 'Approve Review' : 'Reject Review' }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to {{ modalAction }} this review for "{{ selectedReview?.productId.name }}"?
                </p>
                <div class="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-700 font-medium">{{ selectedReview?.userName }}</p>
                  <div class="flex items-center mt-1">
                    <div class="flex">
                      <svg
                        v-for="star in 5"
                        :key="star"
                        class="w-4 h-4"
                        :class="star <= (selectedReview?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                      </svg>
                    </div>
                    <span class="ml-2 text-sm text-gray-600">{{ selectedReview?.rating }}/5</span>
                  </div>
                  <p class="text-sm text-gray-600 mt-2">{{ selectedReview?.comment }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              @click="confirmAction"
              :disabled="processingModal"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              :class="{
                'bg-green-600 hover:bg-green-700 focus:ring-green-500': modalAction === 'approve',
                'bg-red-600 hover:bg-red-700 focus:ring-red-500': modalAction === 'reject'
              }"
            >
              <span v-if="processingModal" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
              <span v-else>
                {{ modalAction === 'approve' ? 'Approve' : 'Reject' }}
              </span>
            </button>
            <button
              @click="closeModal"
              :disabled="processingModal"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm transform transition-all duration-300 ease-in-out"
        :class="{
          'border-green-200 bg-green-50': toast.type === 'success',
          'border-red-200 bg-red-50': toast.type === 'error',
          'border-blue-200 bg-blue-50': toast.type === 'info'
        }"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              v-if="toast.type === 'success'"
              class="h-5 w-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <svg
              v-else-if="toast.type === 'error'"
              class="h-5 w-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <svg
              v-else
              class="h-5 w-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium" :class="{
              'text-green-800': toast.type === 'success',
              'text-red-800': toast.type === 'error',
              'text-blue-800': toast.type === 'info'
            }">
              {{ toast.message }}
            </p>
          </div>
          <div class="ml-auto pl-3">
            <button
              @click="removeToast(toast.id)"
              class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGetAllReviews } from "@/composables/modules/reviews/useGetAllReviews"
import { useGetPendingReviews } from "@/composables/modules/reviews/useGetPendingReviews"
import { useRejectReview } from "@/composables/modules/reviews/useRejectReview"
import { useDeleteReview } from "@/composables/modules/reviews/useDeleteReview"
const { reviews, loading: fetchingReviews } = useGetAllReviews()
const { reviews: pendingReviews, loading: fetchingPendingReviews } = useGetPendingReviews()
const { rejectReview, loading: rejecting } = useRejectReview()
const { loading: deleting, deleteReview } = useDeleteReview()
interface Product {
  _id: string
  name: string
  discountPercentage: number
  id: string
}

interface Review {
  _id: string
  productId: Product
  userId: string
  userName: string
  userRole: string
  rating: number
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
  id: string
}

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

// Reactive state
// const reviews = ref<Review[]>([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('all')
const ratingFilter = ref('all')
const selectedReviews = ref<string[]>([])
const processingReviews = ref<string[]>([])
const viewMode = ref<'grid' | 'list'>('grid')
const toasts = ref<Toast[]>([])
const showModal = ref(false)
const modalAction = ref<'approve' | 'reject'>('approve')
const selectedReview = ref<Review | null>(null)
const processingModal = ref(false)

// Sample data - replace with your actual API calls
const sampleReviews: Review[] = [
  {
    "_id": "687c9c3451b23dd3ffac0078",
    "productId": {
      "_id": "684aa2c2a1708d756091adbe",
      "name": "Fort Bragg CA 1",
      "discountPercentage": 0,
      "id": "684aa2c2a1708d756091adbe"
    },
    "userId": "67fa8e31b42b0ed1af9e1a0f",
    "userName": "raymond@gmail.com",
    "userRole": "admin",
    "rating": 5,
    "comment": "Absolutely breathtaking. The colours and detail are so vivid, it feels alive on my wall.",
    "status": "approved",
    "createdAt": "2025-07-20T07:35:16.629Z",
    "updatedAt": "2025-07-20T07:35:16.629Z",
    "id": "687c9c3451b23dd3ffac0078"
  },
  {
    "_id": "687c9c3451b23dd3ffac0079",
    "productId": {
      "_id": "684aa2c2a1708d756091adbf",
      "name": "Sunset Beach Canvas",
      "discountPercentage": 10,
      "id": "684aa2c2a1708d756091adbf"
    },
    "userId": "67fa8e31b42b0ed1af9e1a10",
    "userName": "sarah@example.com",
    "userRole": "customer",
    "rating": 4,
    "comment": "Beautiful artwork, but the shipping took longer than expected. Overall satisfied with the quality.",
    "status": "pending",
    "createdAt": "2025-07-19T15:22:10.123Z",
    "updatedAt": "2025-07-19T15:22:10.123Z",
    "id": "687c9c3451b23dd3ffac0079"
  },
  {
    "_id": "687c9c3451b23dd3ffac0080",
    "productId": {
      "_id": "684aa2c2a1708d756091adc0",
      "name": "Mountain Landscape Print",
      "discountPercentage": 5,
      "id": "684aa2c2a1708d756091adc0"
    },
    "userId": "67fa8e31b42b0ed1af9e1a11",
    "userName": "mike.johnson@email.com",
    "userRole": "customer",
    "rating": 3,
    "comment": "The print quality is decent but not as vibrant as shown in the photos. Frame was nice though.",
    "status": "pending",
    "createdAt": "2025-07-18T09:45:33.456Z",
    "updatedAt": "2025-07-18T09:45:33.456Z",
    "id": "687c9c3451b23dd3ffac0080"
  },
  {
    "_id": "687c9c3451b23dd3ffac0081",
    "productId": {
      "_id": "684aa2c2a1708d756091adc1",
      "name": "Abstract Art Collection",
      "discountPercentage": 15,
      "id": "684aa2c2a1708d756091adc1"
    },
    "userId": "67fa8e31b42b0ed1af9e1a12",
    "userName": "emma.wilson@test.com",
    "userRole": "customer",
    "rating": 2,
    "comment": "Not what I expected. The colors were completely different from the website images. Very disappointed.",
    "status": "rejected",
    "createdAt": "2025-07-17T14:30:22.789Z",
    "updatedAt": "2025-07-17T14:30:22.789Z",
    "id": "687c9c3451b23dd3ffac0081"
  },
  {
    "_id": "687c9c3451b23dd3ffac0082",
    "productId": {
      "_id": "684aa2c2a1708d756091adc2",
      "name": "Vintage City Poster",
      "discountPercentage": 0,
      "id": "684aa2c2a1708d756091adc2"
    },
    "userId": "67fa8e31b42b0ed1af9e1a13",
    "userName": "alex.brown@demo.com",
    "userRole": "customer",
    "rating": 5,
    "comment": "Perfect addition to my home office! The vintage style is exactly what I was looking for. Fast shipping too!",
    "status": "approved",
    "createdAt": "2025-07-16T11:15:45.321Z",
    "updatedAt": "2025-07-16T11:15:45.321Z",
    "id": "687c9c3451b23dd3ffac0082"
  },
  {
    "_id": "687c9c3451b23dd3ffac0083",
    "productId": {
      "_id": "684aa2c2a1708d756091adc3",
      "name": "Modern Minimalist Art",
      "discountPercentage": 20,
      "id": "684aa2c2a1708d756091adc3"
    },
    "userId": "67fa8e31b42b0ed1af9e1a14",
    "userName": "lisa.garcia@sample.com",
    "userRole": "customer",
    "rating": 4,
    "comment": "Clean and elegant design. Fits perfectly with my minimalist decor. Would recommend to others.",
    "status": "pending",
    "createdAt": "2025-07-15T16:42:18.654Z",
    "updatedAt": "2025-07-15T16:42:18.654Z",
    "id": "687c9c3451b23dd3ffac0083"
  }
]

// Computed properties
const filteredReviews = computed(() => {
  let filtered = reviews.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(review =>
      review.comment.toLowerCase().includes(query) ||
      review.productId.name.toLowerCase().includes(query) ||
      review.userName.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(review => review.status === statusFilter.value)
  }

  // Filter by rating
  if (ratingFilter.value !== 'all') {
    filtered = filtered.filter(review => review.rating === parseInt(ratingFilter.value))
  }

  return filtered
})

const pendingCount = computed(() => reviews.value.filter(r => r.status === 'pending').length)
const approvedCount = computed(() => reviews.value.filter(r => r.status === 'approved').length)
const rejectedCount = computed(() => reviews.value.filter(r => r.status === 'rejected').length)

// Methods
const loadReviews = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    reviews.value = sampleReviews
  } catch (error) {
    showToast('Failed to load reviews', 'error')
  } finally {
    loading.value = false
  }
}

const approveReview = async (reviewId: string) => {
  processingReviews.value.push(reviewId)
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const review = reviews.value.find(r => r.id === reviewId)
    if (review) {
      review.status = 'approved'
      review.updatedAt = new Date().toISOString()
      showToast('Review approved successfully', 'success')
    }
  } catch (error) {
    showToast('Failed to approve review', 'error')
  } finally {
    processingReviews.value = processingReviews.value.filter(id => id !== reviewId)
  }
}

const handleRejectReview = async (reviewId: string) => {
  processingReviews.value.push(reviewId)
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    rejectReview(reviewId, "")
    
    // const review = reviews.value.find(r => r.id === reviewId)
    // if (review) {
    //   review.status = 'rejected'
    //   review.updatedAt = new Date().toISOString()
    //   showToast('Review rejected su2        ccessfully', 'success')
    // }
  } catch (error) {
    showToast('Failed to reject review', 'error')
  } finally {
    processingReviews.value = processingReviews.value.filter(id => id !== reviewId)
  }
}

const bulkApprove = async () => {
  const reviewsToApprove = selectedReviews.value.filter(id => {
    const review = reviews.value.find(r => r.id === id)
    return review?.status === 'pending'
  })

  if (reviewsToApprove.length === 0) {
    showToast('No pending reviews selected', 'error')
    return
  }

  try {
    for (const reviewId of reviewsToApprove) {
      await approveReview(reviewId)
    }
    showToast(`${reviewsToApprove.length} reviews approved`, 'success')
    clearSelection()
  } catch (error) {
    showToast('Failed to approve some reviews', 'error')
  }
}

const bulkReject = async () => {
  const reviewsToReject = selectedReviews.value.filter(id => {
    const review = reviews.value.find(r => r.id === id)
    return review?.status === 'pending'
  })

  if (reviewsToReject.length === 0) {
    showToast('No pending reviews selected', 'error')
    return
  }

  try {
    for (const reviewId of reviewsToReject) {
      await rejectReview(reviewId, "")
    }
    showToast(`${reviewsToReject.length} reviews rejected`, 'success')
    clearSelection()
  } catch (error) {
    showToast('Failed to reject some reviews', 'error')
  }
}

const showConfirmModal = (action: 'approve' | 'reject', review: Review) => {
  modalAction.value = action
  selectedReview.value = review
  showModal.value = true
}

const closeModal = () => {
  if (!processingModal.value) {
    showModal.value = false
    selectedReview.value = null
  }
}

const confirmAction = async () => {
  if (!selectedReview.value) return
  
  processingModal.value = true
  try {
    if (modalAction.value === 'approve') {
      await approveReview(selectedReview.value.id)
    } else {
      await rejectReview(selectedReview.value.id)
    }
    closeModal()
  } catch (error) {
    // Error handling is done in the individual functions
  } finally {
    processingModal.value = false
  }
}

const toggleSelectAll = () => {
  if (selectedReviews.value.length === filteredReviews.value.length) {
    selectedReviews.value = []
  } else {
    selectedReviews.value = filteredReviews.value.map(review => review.id)
  }
}

const toggleSelection = (reviewId: string) => {
  const index = selectedReviews.value.indexOf(reviewId)
  if (index > -1) {
    selectedReviews.value.splice(index, 1)
  } else {
    selectedReviews.value.push(reviewId)
  }
}

const clearSelection = () => {
  selectedReviews.value = []
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const toast: Toast = {
    id: Date.now().toString(),
    message,
    type
  }
  toasts.value.push(toast)
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(toast.id)
  }, 5000)
}

const removeToast = (toastId: string) => {
  const index = toasts.value.findIndex(t => t.id === toastId)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

definePageMeta({
    layout: 'dashboard'
})

// Lifecycle
onMounted(() => {
  loadReviews()
})

// Head configuration
useHead({
  title: 'Review Management System',
  meta: [
    { name: 'description', content: 'Manage and moderate product reviews efficiently' }
  ]
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>