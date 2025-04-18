<template>
    <div class="space-y-6">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Transactions Management</h1>
          <p class="text-gray-500 mt-1">Track and manage all financial transactions</p>
        </div>
        <div class="flex gap-3">
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search transactions..." 
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <button @click="exportTransactions" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            <Download class="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>
  

      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label for="payment-method" class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select id="payment-method" v-model="filters.paymentMethod" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
              <option value="all">All Methods</option>
              <option value="credit-card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank-transfer">Bank Transfer</option>
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
          <button @click="resetFilters" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            Reset
          </button>
          <button @click="applyFilters" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            Apply Filters
          </button>
        </div>
      </div>
  

      <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
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
                  Customer
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
              <tr v-for="transaction in filteredTransactions" :key="transaction.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-violet-600">
                  #{{ transaction.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ transaction.date }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ transaction.customer }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${{ transaction.amount.toFixed(2) }}
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
                      'bg-green-100 text-green-800': transaction.status === 'Completed',
                      'bg-yellow-100 text-yellow-800': transaction.status === 'Pending',
                      'bg-red-100 text-red-800': transaction.status === 'Failed',
                      'bg-gray-100 text-gray-800': transaction.status === 'Refunded'
                    }">
                    {{ transaction.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button @click="viewTransaction(transaction)" class="text-violet-600 hover:text-violet-900">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button @click="printReceipt(transaction)" class="text-gray-600 hover:text-gray-900">
                      <Printer class="h-4 w-4" />
                    </button>
                    <button v-if="transaction.status === 'Completed'" @click="refundTransaction(transaction)" class="text-red-600 hover:text-red-900">
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
            <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">{{ transactions.length }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Previous</span>
                  <ChevronLeft class="h-5 w-5" />
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-violet-50 text-sm font-medium text-violet-600 hover:bg-violet-100">
                  2
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  8
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  9
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  10
                </button>
                <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Next</span>
                  <ChevronRight class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
  

      <div v-if="selectedTransaction" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Transaction Details
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div class="border-b pb-4">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Transaction ID:</span>
                        <span class="text-sm font-medium text-gray-900">#{{ selectedTransaction.id }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Date:</span>
                        <span class="text-sm font-medium text-gray-900">{{ selectedTransaction.date }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Customer:</span>
                        <span class="text-sm font-medium text-gray-900">{{ selectedTransaction.customer }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Amount:</span>
                        <span class="text-sm font-medium text-gray-900">${{ selectedTransaction.amount.toFixed(2) }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Payment Method:</span>
                        <span class="text-sm font-medium text-gray-900">{{ selectedTransaction.paymentMethod }}</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">Status:</span>
                        <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                          :class="{
                            'bg-green-100 text-green-800': selectedTransaction.status === 'Completed',
                            'bg-yellow-100 text-yellow-800': selectedTransaction.status === 'Pending',
                            'bg-red-100 text-red-800': selectedTransaction.status === 'Failed',
                            'bg-gray-100 text-gray-800': selectedTransaction.status === 'Refunded'
                          }">
                          {{ selectedTransaction.status }}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 class="text-sm font-medium text-gray-900 mb-2">Items</h4>
                      <div v-for="(item, index) in selectedTransaction.items" :key="index" class="flex justify-between py-2 border-b border-gray-100">
                        <div class="flex items-center">
                          <div class="h-8 w-8 flex-shrink-0">
                            <img :src="item.image" :alt="item.name" class="h-8 w-8 rounded-md object-cover" />
                          </div>
                          <div class="ml-3">
                            <p class="text-sm font-medium text-gray-900">{{ item.name }}</p>
                            <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
                          </div>
                        </div>
                        <p class="text-sm font-medium text-gray-900">${{ (item.price * item.quantity).toFixed(2) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="selectedTransaction = null" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { 
    Search, Download, Eye, Printer, RefreshCcw, 
    CreditCard, DollarSign, ChevronLeft, ChevronRight
  } from 'lucide-vue-next'
  
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
  
  // Sample transactions data
  const transactions = ref([
    {
      id: '10089',
      date: 'Apr 2, 2025',
      customer: 'John Doe',
      amount: 350.00,
      paymentMethod: 'Credit Card',
      status: 'Completed',
      items: [
        { name: 'Abstract Sunset', quantity: 1, price: 350.00, image: 'https://i.pravatar.cc/300?img=1' }
      ]
    },
    {
      id: '10088',
      date: 'Apr 1, 2025',
      customer: 'Sarah Smith',
      amount: 125.00,
      paymentMethod: 'PayPal',
      status: 'Completed',
      items: [
        { name: 'Landscape Print', quantity: 1, price: 125.00, image: 'https://i.pravatar.cc/300?img=2' }
      ]
    },
    {
      id: '10087',
      date: 'Mar 30, 2025',
      customer: 'Michael Johnson',
      amount: 500.00,
      paymentMethod: 'Bank Transfer',
      status: 'Pending',
      items: [
        { name: 'Portrait Commission', quantity: 1, price: 500.00, image: 'https://i.pravatar.cc/300?img=3' }
      ]
    },
    {
      id: '10086',
      date: 'Mar 29, 2025',
      customer: 'Emily Williams',
      amount: 75.00,
      paymentMethod: 'Credit Card',
      status: 'Completed',
      items: [
        { name: 'Digital Art Print', quantity: 1, price: 75.00, image: 'https://i.pravatar.cc/300?img=4' }
      ]
    },
    {
      id: '10085',
      date: 'Mar 28, 2025',
      customer: 'Robert Brown',
      amount: 450.00,
      paymentMethod: 'PayPal',
      status: 'Failed',
      items: [
        { name: 'Abstract Sculpture', quantity: 1, price: 450.00, image: 'https://i.pravatar.cc/300?img=5' }
      ]
    },
    {
      id: '10084',
      date: 'Mar 27, 2025',
      customer: 'Jennifer Davis',
      amount: 225.00,
      paymentMethod: 'Credit Card',
      status: 'Refunded',
      items: [
        { name: 'Watercolor Landscape', quantity: 1, price: 225.00, image: 'https://i.pravatar.cc/300?img=6' }
      ]
    },
    {
      id: '10083',
      date: 'Mar 26, 2025',
      customer: 'David Wilson',
      amount: 180.00,
      paymentMethod: 'Cash',
      status: 'Completed',
      items: [
        { name: 'Charcoal Drawing', quantity: 2, price: 90.00, image: 'https://i.pravatar.cc/300?img=7' }
      ]
    }
  ])
  
  // Filtered transactions based on search and filters
  const filteredTransactions = computed(() => {
    return transactions.value.filter(transaction => {
      // Search query
      if (searchQuery.value && !transaction.id.includes(searchQuery.value) && 
          !transaction.customer.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        return false
      }
      
      // Status filter
      if (filters.value.status !== 'all' && 
          transaction.status.toLowerCase() !== filters.value.status) {
        return false
      }
      
      // Payment method filter
      if (filters.value.paymentMethod !== 'all' && 
          transaction.paymentMethod.toLowerCase().replace(' ', '-') !== filters.value.paymentMethod) {
        return false
      }
      
      // Amount range filter
      if (filters.value.minAmount !== null && transaction.amount && filters.value.minAmount) {
        return false
      }
      if (filters.value.maxAmount !== null && transaction.amount > filters.value.maxAmount) {
        return false
      }
      
      return true
    })
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
  
  // Filter functions
  const resetFilters = () => {
    filters.value = {
      dateRange: 'all',
      status: 'all',
      paymentMethod: 'all',
      minAmount: null,
      maxAmount: null
    }
  }
  
  const applyFilters = () => {
    // Filters are already applied via the computed property
  }
  
  // Transaction actions
  const viewTransaction = (transaction: any) => {
    selectedTransaction.value = transaction
  }
  
  const printReceipt = (transaction: any) => {
    alert(`Printing receipt for transaction #${transaction.id}`)
  }
  
  const refundTransaction = (transaction: any) => {
    if (confirm(`Are you sure you want to refund transaction #${transaction.id}?`)) {
      const index = transactions.value.findIndex(t => t.id === transaction.id)
      if (index !== -1) {
        transactions.value[index].status = 'Refunded'
      }
    }
  }
  
  // Export transactions function
  const exportTransactions = () => {
    // In a real application, this would generate a CSV or Excel file
    alert('Exporting transactions data...')
  }


  definePageMeta({
      layout: 'dashboard'
  })
  </script>