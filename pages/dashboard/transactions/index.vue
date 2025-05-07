<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 animate-fade-in">Transactions Management</h1>
        <p class="text-gray-500 mt-1 animate-fade-in-delay">Track and manage all financial transactions</p>
      </div>
      <div class="flex gap-3 animate-slide-in-right">
        <div class="relative">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search transactions..." 
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
          />
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <div class="relative group">
          <button @click="toggleExportMenu" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300">
            <Download class="h-4 w-4 mr-2" />
            Export
          </button>
          <div v-if="showExportMenu" class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 animate-fade-in">
            <div class="py-1" role="menu" aria-orientation="vertical">
              <button @click="exportAsCSV" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" role="menuitem">
                Export as CSV
              </button>
              <button @click="exportAsPDF" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" role="menuitem">
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label for="date-range" class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select id="date-range" v-model="filters.dateRange" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select id="status" v-model="filters.status" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
            <option value="all">All Status</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <div>
          <label for="payment-method" class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select id="payment-method" v-model="filters.paymentMethod" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
            <option value="all">All Methods</option>
            <option value="credit card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
          </select>
        </div>
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
          <div class="flex items-center space-x-2">
            <input 
              type="number" 
              v-model="filters.minAmount" 
              placeholder="Min" 
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]"
            />
            <span>-</span>
            <input 
              type="number" 
              v-model="filters.maxAmount" 
              placeholder="Max" 
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]"
            />
          </div>
        </div>
      </div>
      <div class="mt-4 flex justify-end space-x-3">
        <button @click="resetFilters" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300">
          Reset
        </button>
        <button @click="applyFilters" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300">
          Apply Filters
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-20 animate-fade-in">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
    </div>

    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="transaction in paginatedTransactions" :key="transaction._id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-violet-600">
                {{ transaction.transactionId }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(transaction.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                {{ transaction.type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ formatCurrency(transaction.amount, transaction.currency) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center">
                  <component :is="getPaymentIcon(transaction.paymentMethod)" class="h-4 w-4 mr-2" />
                  {{ transaction.paymentMethod }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                  :class="{
                    'bg-green-100 text-green-800': transaction.status === 'successful',
                    'bg-yellow-100 text-yellow-800': transaction.status === 'pending',
                    'bg-red-100 text-red-800': transaction.status === 'failed',
                    'bg-gray-100 text-gray-800': transaction.status === 'refunded'
                  }">
                  {{ transaction.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button @click="viewTransaction(transaction)" class="text-violet-600 hover:text-violet-900 transition-colors duration-200" title="View">
                    <Eye class="h-4 w-4" />
                  </button>
                  <button @click="printReceipt(transaction)" class="text-gray-600 hover:text-gray-900 transition-colors duration-200" title="Print">
                    <Printer class="h-4 w-4" />
                  </button>
                  <button @click="downloadReceipt(transaction)" class="text-blue-600 hover:text-blue-900 transition-colors duration-200" title="Download">
                    <Download class="h-4 w-4" />
                  </button>
                  <button v-if="transaction.status === 'successful'" @click="openRefundModal(transaction)" class="text-red-600 hover:text-red-900 transition-colors duration-200" title="Refund">
                    <RefreshCcw class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            :class="{'opacity-50 cursor-not-allowed': currentPage === 1}"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            Previous
          </button>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            :class="{'opacity-50 cursor-not-allowed': currentPage === totalPages}"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ startIndex + 1 }}</span> to <span class="font-medium">{{ endIndex }}</span> of <span class="font-medium">{{ filteredTransactions.length }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1"
                :class="{'opacity-50 cursor-not-allowed': currentPage === 1}"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
              >
                <span class="sr-only">Previous</span>
                <ChevronLeft class="h-5 w-5" />
              </button>
              
              <template v-for="page in displayedPages" :key="page">
                <span v-if="page === '...'" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
                <button 
                  v-else
                  @click="goToPage(page)"
                  :class="{'bg-violet-50 text-violet-600': currentPage === page, 'bg-white text-gray-700': currentPage !== page}"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  {{ page }}
                </button>
              </template>
              
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                :class="{'opacity-50 cursor-not-allowed': currentPage === totalPages}"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
              >
                <span class="sr-only">Next</span>
                <ChevronRight class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Details Modal -->
    <Transition name="modal">
      <div v-if="selectedTransaction" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="selectedTransaction = null">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-scale-in">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <span>Transaction Details</span>
                    <span class="ml-2 px-2 py-1 text-xs rounded-full" 
                      :class="{
                        'bg-green-100 text-green-800': selectedTransaction.status === 'successful',
                        'bg-yellow-100 text-yellow-800': selectedTransaction.status === 'pending',
                        'bg-red-100 text-red-800': selectedTransaction.status === 'failed',
                        'bg-gray-100 text-gray-800': selectedTransaction.status === 'refunded'
                      }">
                      {{ selectedTransaction.status }}
                    </span>
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div class="border-b pb-4">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Transaction ID:</span>
                        <span class="text-sm font-medium text-gray-900">{{ selectedTransaction.transactionId }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Date:</span>
                        <span class="text-sm font-medium text-gray-900">{{ formatDate(selectedTransaction.createdAt) }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Type:</span>
                        <span class="text-sm font-medium text-gray-900 capitalize">{{ selectedTransaction.type }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Amount:</span>
                        <span class="text-sm font-medium text-gray-900">{{ formatCurrency(selectedTransaction.amount, selectedTransaction.currency) }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Fee Charged:</span>
                        <span class="text-sm font-medium text-gray-900">{{ formatCurrency(selectedTransaction.feeCharged, selectedTransaction.currency) }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Payment Method:</span>
                        <span class="text-sm font-medium text-gray-900">{{ selectedTransaction.paymentMethod }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Payment Reference:</span>
                        <span class="text-sm font-medium text-gray-900">{{ selectedTransaction.paymentReference }}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 class="text-sm font-medium text-gray-900 mb-2">Description</h4>
                      <p class="text-sm text-gray-700">{{ selectedTransaction.description }}</p>
                    </div>
                    
                    <div v-if="selectedTransaction.metadata">
                      <h4 class="text-sm font-medium text-gray-900 mb-2">Metadata</h4>
                      <div class="bg-gray-50 p-3 rounded-md">
                        <pre class="text-xs text-gray-700 overflow-x-auto">{{ JSON.stringify(selectedTransaction.metadata, null, 2) }}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="downloadReceipt(selectedTransaction)" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200">
                Download Receipt
              </button>
              <button @click="printReceipt(selectedTransaction)" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200">
                Print Receipt
              </button>
              <button @click="selectedTransaction = null" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Refund Modal -->
    <Transition name="modal">
      <div v-if="refundTransaction" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="cancelRefund">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-scale-in">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangle class="h-6 w-6 text-red-600" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Process Refund
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to refund this transaction? This action cannot be undone.
                    </p>
                    <div class="mt-4">
                      <label for="refund-amount" class="block text-sm font-medium text-gray-700">Refund Amount</label>
                      <div class="mt-1 relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-500 sm:text-sm">{{ refundTransaction.currency }}</span>
                        </div>
                        <input
                          type="number"
                          id="refund-amount"
                          v-model="refundAmount"
                          :max="refundTransaction.amount"
                          :step="0.01"
                          class="focus:ring-violet-500 border-[0.5px] outline-none focus:border-violet-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md py-2"
                          placeholder="0.00"
                        />
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <button 
                            @click="setFullRefund" 
                            type="button" 
                            class="text-xs text-violet-600 hover:text-violet-500 font-medium"
                          >
                            Full Amount
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="mt-4">
                      <label for="refund-reason" class="block text-sm font-medium text-gray-700">Reason for Refund (Optional)</label>
                      <div class="mt-1">
                        <textarea
                          id="refund-reason"
                          v-model="refundReason"
                          rows="3"
                          class="shadow-sm focus:ring-violet-500 p-3 outline-none border-[0.5px] focus:border-violet-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Enter reason for refund..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="processRefund" 
                type="button" 
                :disabled="!refundAmount || refundAmount <= 0 || refundAmount > refundTransaction.amount"
                :class="{'opacity-50 cursor-not-allowed': !refundAmount || refundAmount <= 0 || refundAmount > refundTransaction.amount}"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
              >
                Process Refund
              </button>
              <button 
                @click="cancelRefund" 
                type="button" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Export Menu Overlay -->
    <div v-if="showExportMenu" @click="toggleExportMenu" class="fixed inset-0 z-40"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useFetchTransactions } from "@/composables/modules/transactions/useFetchTransactions"
import { 
  Search, Download, Eye, Printer, RefreshCcw, 
  CreditCard, DollarSign, ChevronLeft, ChevronRight,
  AlertTriangle, FileText
} from 'lucide-vue-next'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
// import { definePageMeta } from 'nuxt/app'

// Fetch transactions from composable
const { transactions: transactionsList, loading } = useFetchTransactions()

// Search and filters
const searchQuery = ref('')
const filters = ref({
  dateRange: 'all',
  status: 'all',
  paymentMethod: 'all',
  minAmount: null as number | null,
  maxAmount: null as number | null
})

// Selected transaction for modal
const selectedTransaction = ref(null as any)
const refundTransaction = ref(null as any)
const refundAmount = ref(0)
const refundReason = ref('')
const showExportMenu = ref(false)

// Pagination
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Format currency
const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Filtered transactions based on search and filters
const filteredTransactions = computed(() => {
  if (!transactionsList.value || !Array.isArray(transactionsList.value)) return []
  
  return transactionsList.value.filter(transaction => {
    // Search query
    if (searchQuery.value && 
        !transaction.transactionId.toLowerCase().includes(searchQuery.value.toLowerCase()) && 
        !transaction.description?.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }
    
    // Status filter
    if (filters.value.status !== 'all' && 
        transaction.status.toLowerCase() !== filters.value.status.toLowerCase()) {
      return false
    }
    
    // Payment method filter
    if (filters.value.paymentMethod !== 'all' && 
        transaction.paymentMethod.toLowerCase() !== filters.value.paymentMethod.toLowerCase()) {
      return false
    }
    
    // Amount range filter
    if (filters.value.minAmount !== null && transaction.amount < filters.value.minAmount) {
      return false
    }
    if (filters.value.maxAmount !== null && transaction.amount > filters.value.maxAmount) {
      return false
    }
    
    // Date range filter
    if (filters.value.dateRange !== 'all') {
      const transactionDate = new Date(transaction.createdAt)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (filters.value.dateRange === 'today') {
        return transactionDate.toDateString() === today.toDateString()
      } else if (filters.value.dateRange === 'yesterday') {
        return transactionDate.toDateString() === yesterday.toDateString()
      } else if (filters.value.dateRange === 'week') {
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        return transactionDate >= weekStart
      } else if (filters.value.dateRange === 'month') {
        return transactionDate.getMonth() === today.getMonth() && 
               transactionDate.getFullYear() === today.getFullYear()
      } else if (filters.value.dateRange === 'year') {
        return transactionDate.getFullYear() === today.getFullYear()
      }
    }
    
    return true
  })
})

// Pagination calculations
const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage.value, filteredTransactions.value.length)
})

const paginatedTransactions = computed(() => {
  return filteredTransactions.value.slice(startIndex.value, endIndex.value)
})

// Calculate displayed pages for pagination
const displayedPages = computed(() => {
  const totalPagesCount = totalPages.value
  const current = currentPage.value
  const pages = []
  
  if (totalPagesCount <= 7) {
    // Less than 7 pages, show all
    for (let i = 1; i <= totalPagesCount; i++) {
      pages.push(i)
    }
  } else {
    // More than 7 pages, show with ellipsis
    pages.push(1)
    
    if (current > 3) {
      pages.push('...')
    }
    
    const start = Math.max(2, current - 1)
    const end = Math.min(totalPagesCount - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (current < totalPagesCount - 2) {
      pages.push('...')
    }
    
    pages.push(totalPagesCount)
  }
  
  return pages
})

// Get payment method icon
const getPaymentIcon = (method: string) => {
  switch (method.toLowerCase()) {
    case 'credit card':
      return CreditCard
    case 'paypal':
      return DollarSign
    case 'bank transfer':
      return RefreshCcw
    case 'cash':
      return DollarSign
    default:
      return DollarSign
  }
}

// Pagination functions
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

// Filter functions
const resetFilters = () => {
  filters.value = {
    dateRange: 'all',
    status: 'all',
    paymentMethod: 'all',
    minAmount: null,
    maxAmount: null
  }
  searchQuery.value = ''
}

const applyFilters = () => {
  // Filters are already applied via the computed property
  // Reset to first page when filters change
  currentPage.value = 1
}

// Transaction actions
const viewTransaction = (transaction: any) => {
  selectedTransaction.value = transaction
}

const printReceipt = (transaction: any) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank')
  if (!printWindow) return
  
  // Generate receipt HTML
  const receiptHTML = generateReceiptHTML(transaction)
  
  // Write to the new window
  printWindow.document.write(receiptHTML)
  printWindow.document.close()
  
  // Trigger print after content is loaded
  printWindow.onload = () => {
    printWindow.print()
  }
}

const downloadReceipt = (transaction: any) => {
  // Create PDF document
  const doc = new jsPDF()
  
  // Add company logo/header
  doc.setFontSize(20)
  doc.setTextColor(102, 45, 145) // Violet color
  doc.text('Transaction Receipt', 105, 20, { align: 'center' })
  
  // Add transaction details
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text(`Transaction ID: ${transaction.transactionId}`, 20, 40)
  doc.text(`Date: ${formatDate(transaction.createdAt)}`, 20, 50)
  doc.text(`Type: ${transaction.type}`, 20, 60)
  doc.text(`Amount: ${formatCurrency(transaction.amount, transaction.currency)}`, 20, 70)
  doc.text(`Payment Method: ${transaction.paymentMethod}`, 20, 80)
  doc.text(`Status: ${transaction.status}`, 20, 90)
  
  if (transaction.description) {
    doc.text(`Description: ${transaction.description}`, 20, 100)
  }
  
  // Add metadata if available
  if (transaction.metadata) {
    doc.text('Metadata:', 20, 110)
    const metadataLines = JSON.stringify(transaction.metadata, null, 2).split('\n')
    let yPos = 120
    metadataLines.forEach(line => {
      doc.text(line, 25, yPos)
      yPos += 10
    })
  }
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.text('This is an official receipt. Thank you for your business.', 105, 280, { align: 'center' })
  }
  
  // Save the PDF
  doc.save(`receipt-${transaction.transactionId}.pdf`)
}

// Generate HTML for receipt printing
const generateReceiptHTML = (transaction: any) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt - ${transaction.transactionId}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .receipt {
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #ddd;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #8b5cf6;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #8b5cf6;
          margin: 0;
        }
        .details {
          margin-bottom: 20px;
        }
        .details-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .details-label {
          font-weight: bold;
          color: #666;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        .status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }
        .status-successful {
          background-color: #dcfce7;
          color: #166534;
        }
        .status-pending {
          background-color: #fef9c3;
          color: #854d0e;
        }
        .status-failed {
          background-color: #fee2e2;
          color: #b91c1c;
        }
        .status-refunded {
          background-color: #f3f4f6;
          color: #4b5563;
        }
        @media print {
          body {
            padding: 0;
          }
          .receipt {
            border: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <h1>Transaction Receipt</h1>
          <p>${formatDate(transaction.createdAt)}</p>
        </div>
        
        <div class="details">
          <div class="details-row">
            <span class="details-label">Transaction ID:</span>
            <span>${transaction.transactionId}</span>
          </div>
          <div class="details-row">
            <span class="details-label">Type:</span>
            <span>${transaction.type}</span>
          </div>
          <div class="details-row">
            <span class="details-label">Amount:</span>
            <span>${formatCurrency(transaction.amount, transaction.currency)}</span>
          </div>
          <div class="details-row">
            <span class="details-label">Fee Charged:</span>
            <span>${formatCurrency(transaction.feeCharged, transaction.currency)}</span>
          </div>
          <div class="details-row">
            <span class="details-label">Payment Method:</span>
            <span>${transaction.paymentMethod}</span>
          </div>
          <div class="details-row">
            <span class="details-label">Payment Reference:</span>
            <span>${transaction.paymentReference}</span>
          </div>
          <div class="details-row">
            <span class="details-label">Status:</span>
            <span class="status status-${transaction.status}">${transaction.status}</span>
          </div>
          <div class="details-row">
            <span class="details-label">Description:</span>
            <span>${transaction.description}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>This is an official receipt. Thank you for your business.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Export functions
const toggleExportMenu = () => {
  showExportMenu.value = !showExportMenu.value
}

const exportAsCSV = () => {
  // Create CSV content
  let csvContent = 'Transaction ID,Date,Type,Amount,Currency,Payment Method,Status,Description\n'
  
  filteredTransactions.value.forEach(transaction => {
    const row = [
      transaction.transactionId,
      formatDate(transaction.createdAt),
      transaction.type,
      transaction.amount,
      transaction.currency,
      transaction.paymentMethod,
      transaction.status,
      transaction.description
    ].map(value => `"${value}"`).join(',')
    
    csvContent += row + '\n'
  })
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `transactions-export-${new Date().toISOString().slice(0, 10)}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Close export menu
  showExportMenu.value = false
}

const exportAsPDF = () => {
  // Create PDF document
  const doc = new jsPDF('l', 'pt', 'a4')
  
  // Add title
  doc.setFontSize(18)
  doc.setTextColor(102, 45, 145) // Violet color
  doc.text('Transactions Export', 40, 40)
  
  // Add date
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 60)
  
  // Create table data
  const tableColumn = ["Transaction ID", "Date", "Type", "Amount", "Payment Method", "Status"]
  const tableRows = filteredTransactions.value.map(transaction => [
    transaction.transactionId,
    formatDate(transaction.createdAt),
    transaction.type,
    formatCurrency(transaction.amount, transaction.currency),
    transaction.paymentMethod,
    transaction.status
  ])
  
  // Add table
  // @ts-ignore - jspdf-autotable types
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 80,
    styles: { fontSize: 10, cellPadding: 5 },
    headStyles: { fillColor: [102, 45, 145] }
  })
  
  // Save the PDF
  doc.save(`transactions-export-${new Date().toISOString().slice(0, 10)}.pdf`)
  
  // Close export menu
  showExportMenu.value = false
}

// Refund functions
const openRefundModal = (transaction: any) => {
  refundTransaction.value = transaction
  refundAmount.value = transaction.amount
  refundReason.value = ''
}

const setFullRefund = () => {
  if (refundTransaction.value) {
    refundAmount.value = refundTransaction.value.amount
  }
}

const cancelRefund = () => {
  refundTransaction.value = null
  refundAmount.value = 0
  refundReason.value = ''
}

const processRefund = () => {
  if (!refundTransaction.value) return
  
  // In a real application, you would call an API to process the refund
  // For this demo, we'll just update the transaction status
  const index = transactionsList.value.findIndex(t => t._id === refundTransaction.value._id)
  if (index !== -1) {
    // Create a copy of the transaction
    const updatedTransaction = { ...transactionsList.value[index] }
    
    // Update status to refunded
    updatedTransaction.status = 'refunded'
    
    // Update the transactions list
    transactionsList.value[index] = updatedTransaction
    
    // Show success message
    alert(`Transaction ${refundTransaction.value.transactionId} has been refunded for ${formatCurrency(refundAmount.value, refundTransaction.value.currency)}`)
  }
  
  // Close the refund modal
  cancelRefund()
}

// Watch for changes in filters and reset to page 1
watch([filters, searchQuery], () => {
  currentPage.value = 1
})

// Reset to page 1 when transactions list changes
watch(transactionsList, () => {
  currentPage.value = 1
})

// Set up click outside handler for export menu
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (showExportMenu.value && !target.closest('.export-menu')) {
      showExportMenu.value = false
    }
  })
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

.animate-fade-in-delay {
  animation: fadeIn 0.5s ease-in-out 0.2s both;
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