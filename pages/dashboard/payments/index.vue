<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="animate-fade-in">
        <h1 class="text-2xl font-bold text-gray-900">Payments Dashboard</h1>
        <p class="text-gray-500 mt-1">Track and manage all your transaction history</p>
      </div>
      <div class="flex flex-wrap gap-3 animate-slide-in-right">
        <div class="relative">
          <select 
            v-model="timeFilter" 
            class="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
        <button 
          @click="exportPaymentsData" 
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300"
        >
          <Download class="h-4 w-4 mr-2" />
          Export
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Payments Card -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 animate-fade-in">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-violet-100">
            <CreditCard class="h-6 w-6 text-violet-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Payments</p>
            <p class="text-2xl font-semibold text-gray-900">{{ loading ? '...' : payments.length }}</p>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <span class="text-green-600 text-sm font-medium flex items-center">
            <TrendingUp class="h-4 w-4 mr-1" />
            {{ loading ? '...' : getRecentPaymentsCount() }} recent
          </span>
        </div>
      </div>

      <!-- Total Revenue Card -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 animate-fade-in" style="animation-delay: 100ms;">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-emerald-100">
            <DollarSign class="h-6 w-6 text-emerald-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Revenue</p>
            <p class="text-2xl font-semibold text-gray-900">{{ loading ? '...' : formatCurrency(getTotalRevenue()) }}</p>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <span class="text-green-600 text-sm font-medium flex items-center">
            <TrendingUp class="h-4 w-4 mr-1" />
            {{ loading ? '...' : formatCurrency(getRecentRevenue()) }} recent
          </span>
        </div>
      </div>

      <!-- Success Rate Card -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 animate-fade-in" style="animation-delay: 200ms;">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <CheckCircle class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Success Rate</p>
            <p class="text-2xl font-semibold text-gray-900">{{ loading ? '...' : getSuccessRate() }}%</p>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-500" 
              :style="{ width: loading ? '0%' : `${getSuccessRate()}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Average Transaction Card -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 animate-fade-in" style="animation-delay: 300ms;">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-amber-100">
            <Calculator class="h-6 w-6 text-amber-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Avg. Transaction</p>
            <p class="text-2xl font-semibold text-gray-900">{{ loading ? '...' : formatCurrency(getAverageTransaction()) }}</p>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <span class="text-sm font-medium text-gray-500">
            Based on {{ loading ? '...' : payments.length }} transactions
          </span>
        </div>
      </div>
    </div>

    <!-- Payments Table Section -->
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900">Transaction History</h2>
        <div class="mt-3 sm:mt-0 flex flex-wrap gap-2">
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search transactions..." 
              class="pl-9 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
            />
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div class="relative">
            <select 
              v-model="statusFilter" 
              class="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300"
            >
              <option value="all">All Status</option>
              <option value="successful">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="animate-pulse">
        <div class="h-12 bg-gray-200 rounded mb-4"></div>
        <div v-for="i in 5" :key="i" class="h-16 bg-gray-200 rounded mb-3"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!payments || payments.length === 0" class="flex flex-col items-center justify-center py-12 animate-fade-in">
        <CreditCard class="h-16 w-16 text-gray-300 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-1">No Transactions Yet</h3>
        <p class="text-gray-500 text-center max-w-md">When you process your first payment, it will appear here.</p>
      </div>

      <!-- Payments Table -->
      <div v-else-if="filteredPayments.length === 0" class="flex flex-col items-center justify-center py-12 animate-fade-in">
        <Search class="h-16 w-16 text-gray-300 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-1">No Matching Transactions</h3>
        <p class="text-gray-500 text-center max-w-md">Try adjusting your search or filter criteria.</p>
      </div>

      <!-- Payments Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="payment in filteredPayments" :key="payment._id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-violet-600">{{ payment.transactionId }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ formatDate(payment.createdAt) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate">{{ payment.description || 'N/A' }}</div>
                <div v-if="payment.metadata" class="text-xs text-gray-500">
                  {{ getMetadataString(payment.metadata) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                    <component 
                      :is="getPaymentMethodIcon(payment.paymentMethod)" 
                      class="h-4 w-4 text-gray-600" 
                    />
                  </span>
                  <span class="text-sm text-gray-900">{{ payment.paymentMethod }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ formatCurrency(payment.amount) }}</div>
                <div v-if="payment.feeCharged" class="text-xs text-gray-500">
                  Fee: {{ formatCurrency(payment.feeCharged) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                  :class="{
                    'bg-green-100 text-green-800': payment.status === 'successful',
                    'bg-yellow-100 text-yellow-800': payment.status === 'pending',
                    'bg-red-100 text-red-800': payment.status === 'failed'
                  }">
                  {{ capitalizeFirstLetter(payment.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="viewPaymentDetails(payment)" class="text-violet-600 hover:text-violet-900 mr-3 transition-colors duration-200">
                  <Eye class="h-4 w-4" />
                </button>
                <button @click="downloadReceipt(payment)" class="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  <FileText class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && payments.length > 0" class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
        <div class="flex flex-1 justify-between sm:hidden">
          <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ paginationStart }}</span> to <span class="font-medium">{{ paginationEnd }}</span> of <span class="font-medium">{{ filteredPayments.length }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="sr-only">Previous</span>
                <ChevronLeft class="h-5 w-5" />
              </button>
              <button v-for="page in displayedPages" :key="page" @click="currentPage = page" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium" :class="currentPage === page ? 'z-10 bg-violet-50 border-violet-500 text-violet-600' : 'text-gray-500 hover:bg-gray-50'">
                {{ page }}
              </button>
              <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="sr-only">Next</span>
                <ChevronRight class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Details Modal -->
    <Transition name="modal">
      <div v-if="selectedPayment" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="selectedPayment = null">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-scale-in">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center justify-between">
                    <span>Transaction Details</span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="{
                      'bg-green-100 text-green-800': selectedPayment.status === 'successful',
                      'bg-yellow-100 text-yellow-800': selectedPayment.status === 'pending',
                      'bg-red-100 text-red-800': selectedPayment.status === 'failed'
                    }">
                      {{ capitalizeFirstLetter(selectedPayment.status) }}
                    </span>
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div class="border-b pb-4">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Transaction ID:</span>
                        <span class="text-sm font-medium text-gray-900">{{ selectedPayment.transactionId }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Date:</span>
                        <span class="text-sm font-medium text-gray-900">{{ formatDate(selectedPayment.createdAt) }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Amount:</span>
                        <span class="text-sm font-medium text-gray-900">{{ formatCurrency(selectedPayment.amount) }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Payment Method:</span>
                        <span class="text-sm font-medium text-gray-900">{{ selectedPayment.paymentMethod }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Reference:</span>
                        <span class="text-sm font-medium text-gray-900">{{ selectedPayment.paymentReference || 'N/A' }}</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">Fee Charged:</span>
                        <span class="text-sm font-medium text-gray-900">{{ formatCurrency(selectedPayment.feeCharged || 0) }}</span>
                      </div>
                    </div>
                    
                    <div v-if="selectedPayment.description">
                      <h4 class="text-sm font-medium text-gray-900 mb-2">Description</h4>
                      <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded">{{ selectedPayment.description }}</p>
                    </div>
                    
                    <div v-if="selectedPayment.gatewayResponse">
                      <h4 class="text-sm font-medium text-gray-900 mb-2">Gateway Response</h4>
                      <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded">{{ selectedPayment.gatewayResponse }}</p>
                    </div>
                    
                    <div v-if="selectedPayment.metadata && Object.keys(selectedPayment.metadata).length > 0">
                      <h4 class="text-sm font-medium text-gray-900 mb-2">Metadata</h4>
                      <div class="bg-gray-50 p-3 rounded">
                        <div v-for="(value, key) in selectedPayment.metadata" :key="key" class="flex justify-between text-sm">
                          <span class="text-gray-500">{{ key }}:</span>
                          <span class="text-gray-900">{{ value }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="downloadReceipt(selectedPayment)" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200">
                Download Receipt
              </button>
              <button @click="selectedPayment = null" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useFetchAllPayments } from "@/composables/modules/payments/useFetchPayments"
import { 
  Plus, CreditCard, DollarSign, MoreVertical, ChevronDown, Download,
  TrendingUp, CheckCircle, Calculator, Search, Eye, FileText,
  ChevronLeft, ChevronRight, CreditCard as CreditCardIcon, 
  DollarSign as DollarSignIcon, Smartphone, Landmark, Globe
} from 'lucide-vue-next'

// Fetch data from composables
const { payments, loading } = useFetchAllPayments()

// UI state
const timeFilter = ref('all')
const searchQuery = ref('')
const statusFilter = ref('all')
const selectedPayment = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Computed properties
const filteredPayments = computed(() => {
  if (!payments.value || !Array.isArray(payments.value)) return []
  
  let filtered = [...payments.value]
  
  // Apply status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(payment => payment.status === statusFilter.value)
  }
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(payment => 
      payment.transactionId.toLowerCase().includes(query) ||
      (payment.description && payment.description.toLowerCase().includes(query)) ||
      payment.paymentMethod.toLowerCase().includes(query)
    )
  }
  
  // Apply time filter (this would need actual implementation based on your requirements)
  // For now, we'll just return all filtered payments
  
  return filtered
})

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPayments.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredPayments.value.length / itemsPerPage.value) || 1
})

const displayedPages = computed(() => {
  const pages = []
  const maxPagesToShow = 5
  
  if (totalPages.value <= maxPagesToShow) {
    // Show all pages if there are fewer than maxPagesToShow
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)
    
    // Calculate start and end of pages to show
    let start = Math.max(2, currentPage.value - 1)
    let end = Math.min(totalPages.value - 1, currentPage.value + 1)
    
    // Adjust if we're at the beginning or end
    if (currentPage.value <= 2) {
      end = Math.min(totalPages.value - 1, maxPagesToShow - 1)
    } else if (currentPage.value >= totalPages.value - 1) {
      start = Math.max(2, totalPages.value - maxPagesToShow + 2)
    }
    
    // Add ellipsis if needed
    if (start > 2) {
      pages.push('...')
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Add ellipsis if needed
    if (end < totalPages.value - 1) {
      pages.push('...')
    }
    
    // Always show last page
    if (totalPages.value > 1) {
      pages.push(totalPages.value)
    }
  }
  
  return pages
})

const paginationStart = computed(() => {
  return filteredPayments.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, filteredPayments.value.length)
})

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const capitalizeFirstLetter = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const getMetadataString = (metadata) => {
  if (!metadata || Object.keys(metadata).length === 0) return ''
  return Object.entries(metadata)
    .map(([key, value]) => `${key}: ${value}`)
    .join(' • ')
}

const getPaymentMethodIcon = (method) => {
  if (!method) return CreditCardIcon
  
  const methodLower = method.toLowerCase()
  if (methodLower.includes('credit') || methodLower.includes('card')) return CreditCardIcon
  if (methodLower.includes('paypal')) return DollarSignIcon
  if (methodLower.includes('mobile') || methodLower.includes('phone')) return Smartphone
  if (methodLower.includes('bank') || methodLower.includes('transfer')) return Landmark
  if (methodLower.includes('online')) return Globe
  
  return CreditCardIcon
}

// Statistics functions
const getRecentPaymentsCount = () => {
  if (!payments.value || !Array.isArray(payments.value)) return 0
  
  // Count payments from the last 7 days
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  return payments.value.filter(payment => {
    const paymentDate = new Date(payment.createdAt)
    return paymentDate >= oneWeekAgo
  }).length
}

const getTotalRevenue = () => {
  if (!payments.value || !Array.isArray(payments.value)) return 0
  
  return payments.value.reduce((total, payment) => {
    if (payment.status === 'successful') {
      return total + payment.amount
    }
    return total
  }, 0)
}

const getRecentRevenue = () => {
  if (!payments.value || !Array.isArray(payments.value)) return 0
  
  // Calculate revenue from the last 7 days
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  return payments.value.reduce((total, payment) => {
    const paymentDate = new Date(payment.createdAt)
    if (payment.status === 'successful' && paymentDate >= oneWeekAgo) {
      return total + payment.amount
    }
    return total
  }, 0)
}

const getSuccessRate = () => {
  if (!payments.value || !Array.isArray(payments.value) || payments.value.length === 0) return 0
  
  const successfulPayments = payments.value.filter(payment => payment.status === 'successful').length
  return Math.round((successfulPayments / payments.value.length) * 100)
}

const getAverageTransaction = () => {
  if (!payments.value || !Array.isArray(payments.value) || payments.value.length === 0) return 0
  
  const successfulPayments = payments.value.filter(payment => payment.status === 'successful')
  if (successfulPayments.length === 0) return 0
  
  const totalAmount = successfulPayments.reduce((total, payment) => total + payment.amount, 0)
  return totalAmount / successfulPayments.length
}

// Action functions
const viewPaymentDetails = (payment) => {
  selectedPayment.value = payment
}

const downloadReceipt = (payment) => {
  // In a real application, this would generate a PDF receipt
  alert(`Downloading receipt for transaction ${payment.transactionId}...`)
}

const exportPaymentsData = () => {
  // In a real application, this would generate a CSV or Excel file
  alert('Exporting payments data...')
}

// Watch for changes in filters to reset pagination
watch([searchQuery.value, statusFilter.value, timeFilter.value], () => {
  currentPage.value = 1
})

definePageMeta({
  layout: 'dashboard'
})
</script>

<style scoped>
/* Animations */
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-in-right {
  animation: slideInRight 0.5s ease-in-out;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>