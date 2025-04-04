<template>
    <div class="space-y-6">
      <!-- Header with actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p class="text-gray-500 mt-1">Track and manage customer orders for your artwork</p>
        </div>
        <div class="flex gap-3">
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search orders..." 
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <button @click="exportOrders" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            <Download class="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>
  
      <!-- Order Filters -->
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select id="status-filter" v-model="filters.status" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label for="date-range" class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select id="date-range" v-model="filters.dateRange" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div>
            <label for="payment-status" class="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select id="payment-status" v-model="filters.paymentStatus" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500">
              <option value="all">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label for="amount-range" class="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
            <div class="flex items-center space-x-2">
              <input 
                type="number" 
                v-model="filters.minAmount" 
                placeholder="Min" 
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
              />
              <span>-</span>
              <input 
                type="number" 
                v-model="filters.maxAmount" 
                placeholder="Max" 
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
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
  
      <!-- Orders Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-violet-600">
                  #{{ order.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.date }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ order.customer }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.items }} item(s)
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${{ order.total.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="{
                      'bg-yellow-100 text-yellow-800': order.status === 'Pending',
                      'bg-blue-100 text-blue-800': order.status === 'Processing',
                      'bg-indigo-100 text-indigo-800': order.status === 'Shipped',
                      'bg-green-100 text-green-800': order.status === 'Delivered',
                      'bg-red-100 text-red-800': order.status === 'Cancelled'
                    }">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="{
                      'bg-green-100 text-green-800': order.paymentStatus === 'Paid',
                      'bg-yellow-100 text-yellow-800': order.paymentStatus === 'Unpaid',
                      'bg-gray-100 text-gray-800': order.paymentStatus === 'Refunded'
                    }">
                    {{ order.paymentStatus }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button @click="viewOrder(order)" class="text-violet-600 hover:text-violet-900">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button @click="updateOrderStatus(order)" class="text-blue-600 hover:text-blue-900">
                      <RefreshCw class="h-4 w-4" />
                    </button>
                    <button @click="printOrder(order)" class="text-gray-600 hover:text-gray-900">
                      <Printer class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
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
                Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">{{ orders.length }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Previous</span>
                  <ChevronLeft class="h-5 w-5" />
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-violet-50 text-sm font-medium text-violet-600 hover:bg-violet-100">
                  1
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
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
  
      <!-- Order Details Modal -->
      <div v-if="selectedOrder" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center justify-between">
                    <span>Order #{{ selectedOrder.id }}</span>
                    <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                      :class="{
                        'bg-yellow-100 text-yellow-800': selectedOrder.status === 'Pending',
                        'bg-blue-100 text-blue-800': selectedOrder.status === 'Processing',
                        'bg-indigo-100 text-indigo-800': selectedOrder.status === 'Shipped',
                        'bg-green-100 text-green-800': selectedOrder.status === 'Delivered',
                        'bg-red-100 text-red-800': selectedOrder.status === 'Cancelled'
                      }">
                      {{ selectedOrder.status }}
                    </span>
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div class="border-b pb-4">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Date:</span>
                        <span class="text-sm font-medium text-gray-900">{{ selectedOrder.date }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Customer:</span>
                        <span class="text-sm font-medium text-gray-900">{{ selectedOrder.customer }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Email:</span>
                        <span class="text-sm font-medium text-gray-900">{{ selectedOrder.email }}</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">Phone:</span>
                        <span class="text-sm font-medium text-gray-900">{{ selectedOrder.phone }}</span>
                      </div>
                    </div>
                    
                    <div class="border-b pb-4">
                      <h4 class="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                      <p class="text-sm text-gray-500">{{ selectedOrder.address }}</p>
                    </div>
                    
                    <div>
                      <h4 class="text-sm font-medium text-gray-900 mb-2">Order Items</h4>
                      <div v-for="(item, index) in selectedOrder.orderItems" :key="index" class="flex justify-between py-2 border-b border-gray-100">
                        <div class="flex items-center">
                          <div class="h-10 w-10 flex-shrink-0">
                            <img :src="item.image" :alt="item.name" class="h-10 w-10 rounded-md object-cover" />
                          </div>
                          <div class="ml-3">
                            <p class="text-sm font-medium text-gray-900">{{ item.name }}</p>
                            <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
                          </div>
                        </div>
                        <p class="text-sm font-medium text-gray-900">${{ (item.price * item.quantity).toFixed(2) }}</p>
                      </div>
                      
                      <div class="mt-4 space-y-2">
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Subtotal:</span>
                          <span class="text-sm font-medium text-gray-900">${{ selectedOrder.subtotal.toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Shipping:</span>
                          <span class="text-sm font-medium text-gray-900">${{ selectedOrder.shipping.toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Tax:</span>
                          <span class="text-sm font-medium text-gray-900">${{ selectedOrder.tax.toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between border-t pt-2">
                          <span class="text-sm font-medium text-gray-900">Total:</span>
                          <span class="text-sm font-medium text-gray-900">${{ selectedOrder.total.toFixed(2) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="selectedOrder = null" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Update Status Modal -->
      <div v-if="isUpdateStatusModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
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
                    Update Order Status
                  </h3>
                  <div class="mt-4">
                    <label for="order-status" class="block text-sm font-medium text-gray-700">Status</label>
                    <select id="order-status" v-model="newStatus" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500">
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div class="mt-4">
                    <label for="status-notes" class="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                    <textarea id="status-notes" v-model="statusNotes" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="saveOrderStatus" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm">
                Update Status
              </button>
              <button @click="isUpdateStatusModalOpen = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
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
    Search, Download, Eye, Printer, RefreshCw,
    ChevronLeft, ChevronRight
  } from 'lucide-vue-next'
  
  // Search and filters
  const searchQuery = ref('')
  const filters = ref({
    status: 'all',
    dateRange: 'all',
    paymentStatus: 'all',
    minAmount: null as number | null,
    maxAmount: null as number | null
  })
  
  // Modal states
  const selectedOrder = ref(null as any)
  const isUpdateStatusModalOpen = ref(false)
  const orderToUpdate = ref(null as any)
  const newStatus = ref('')
  const statusNotes = ref('')
  
  // Sample orders data
  const orders = ref([
    {
      id: '1089',
      date: 'Apr 2, 2025',
      customer: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Apt 4B, New York, NY 10001',
      items: 1,
      subtotal: 350.00,
      shipping: 15.00,
      tax: 29.00,
      total: 394.00,
      status: 'Pending',
      paymentStatus: 'Paid',
      orderItems: [
        { name: 'Abstract Sunset', quantity: 1, price: 350.00, image: 'https://i.pravatar.cc/300?img=1' }
      ]
    },
    {
      id: '1088',
      date: 'Apr 1, 2025',
      customer: 'Sarah Smith',
      email: 'sarah.smith@example.com',
      phone: '(555) 987-6543',
      address: '456 Oak Ave, San Francisco, CA 94102',
      items: 1,
      subtotal: 125.00,
      shipping: 10.00,
      tax: 10.88,
      total: 145.88,
      status: 'Processing',
      paymentStatus: 'Paid',
      orderItems: [
        { name: 'Landscape Print', quantity: 1, price: 125.00, image: 'https://i.pravatar.cc/300?img=2' }
      ]
    },
    {
      id: '1087',
      date: 'Mar 30, 2025',
      customer: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      phone: '(555) 456-7890',
      address: '789 Pine St, Chicago, IL 60601',
      items: 1,
      subtotal: 500.00,
      shipping: 25.00,
      tax: 41.25,
      total: 566.25,
      status: 'Shipped',
      paymentStatus: 'Paid',
      orderItems: [
        { name: 'Portrait Commission', quantity: 1, price: 500.00, image: 'https://i.pravatar.cc/300?img=3' }
      ]
    },
    {
      id: '1086',
      date: 'Mar 29, 2025',
      customer: 'Emily Williams',
      email: 'emily.williams@example.com',
      phone: '(555) 234-5678',
      address: '321 Maple Rd, Austin, TX 78701',
      items: 1,
      subtotal: 75.00,
      shipping: 5.00,
      tax: 6.60,
      total: 86.60,
      status: 'Delivered',
      paymentStatus: 'Paid',
      orderItems: [
        { name: 'Digital Art Print', quantity: 1, price: 75.00, image: 'https://i.pravatar.cc/300?img=4' }
      ]
    },
    {
      id: '1085',
      date: 'Mar 28, 2025',
      customer: 'Robert Brown',
      email: 'robert.brown@example.com',
      phone: '(555) 876-5432',
      address: '654 Elm St, Seattle, WA 98101',
      items: 1,
      subtotal: 450.00,
      shipping: 20.00,
      tax: 37.80,
      total: 507.80,
      status: 'Cancelled',
      paymentStatus: 'Refunded',
      orderItems: [
        { name: 'Abstract Sculpture', quantity: 1, price: 450.00, image: 'https://i.pravatar.cc/300?img=5' }
      ]
    },
    {
      id: '1084',
      date: 'Mar 27, 2025',
      customer: 'Jennifer Davis',
      email: 'jennifer.davis@example.com',
      phone: '(555) 345-6789',
      address: '987 Cedar Ln, Miami, FL 33101',
      items: 2,
      subtotal: 170.00,
      shipping: 12.00,
      tax: 14.56,
      total: 196.56,
      status: 'Delivered',
      paymentStatus: 'Paid',
      orderItems: [
        { name: 'Watercolor Landscape', quantity: 1, price: 125.00, image: 'https://i.pravatar.cc/300?img=6' },
        { name: 'Mini Print Set', quantity: 1, price: 45.00, image: 'https://i.pravatar.cc/300?img=7' }
      ]
    },
    {
      id: '1083',
      date: 'Mar 26, 2025',
      customer: 'David Wilson',
      email: 'david.wilson@example.com',
      phone: '(555) 567-8901',
      address: '753 Birch Dr, Denver, CO 80201',
      items: 2,
      subtotal: 180.00,
      shipping: 15.00,
      tax: 15.60,
      total: 210.60,
      status: 'Processing',
      paymentStatus: 'Unpaid',
      orderItems: [
        { name: 'Charcoal Drawing', quantity: 2, price: 90.00, image: 'https://i.pravatar.cc/300?img=8' }
      ]
    }
  ])
  
  // Filtered orders based on search and filters
  const filteredOrders = computed(() => {
    return orders.value.filter(order => {
      // Search query
      if (searchQuery.value && !order.id.includes(searchQuery.value) && 
          !order.customer.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        return false
      }
      
      // Status filter
      if (filters.value.status !== 'all' && 
          order.status.toLowerCase() !== filters.value.status) {
        return false
      }
      
      // Payment status filter
      if (filters.value.paymentStatus !== 'all' && 
          order.paymentStatus.toLowerCase() !== filters.value.paymentStatus) {
        return false
      }
      
      // Amount range filter
      if (filters.value.minAmount !== null && order.total < filters.value.minAmount) {
        return false
      }
      if (filters.value.maxAmount !== null && order.total > filters.value.maxAmount) {
        return false
      }
      
      return true
    })
  })
  
  // Filter functions
  const resetFilters = () => {
    filters.value = {
      status: 'all',
      dateRange: 'all',
      paymentStatus: 'all',
      minAmount: null,
      maxAmount: null
    }
  }
  
  const applyFilters = () => {
    // Filters are already applied via the computed property
  }
  
  // Order actions
  const viewOrder = (order: any) => {
    selectedOrder.value = order
  }
  
  const updateOrderStatus = (order: any) => {
    orderToUpdate.value = order
    newStatus.value = order.status
    statusNotes.value = ''
    isUpdateStatusModalOpen.value = true
  }
  
  const saveOrderStatus = () => {
    if (orderToUpdate.value) {
      const index = orders.value.findIndex(o => o.id === orderToUpdate.value.id)
      if (index !== -1) {
        orders.value[index].status = newStatus.value
      }
    }
    isUpdateStatusModalOpen.value = false
  }
  
  const printOrder = (order: any) => {
    alert(`Printing order #${order.id}`)
  }
  
  // Export orders function
  const exportOrders = () => {
    // In a real application, this would generate a CSV or Excel file
    alert('Exporting orders data...')
  }
  </script>