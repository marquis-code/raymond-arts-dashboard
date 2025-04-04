<template>
    <div class="space-y-6">
      <!-- Header with actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Invoice Management</h1>
          <p class="text-gray-500 mt-1">Create and manage invoices for your artwork sales</p>
        </div>
        <div class="flex gap-3">
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search invoices..." 
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <button @click="isCreateInvoiceModalOpen = true" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            <Plus class="h-4 w-4 mr-2" />
            Create Invoice
          </button>
        </div>
      </div>
  
      <!-- Invoice Filters -->
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select id="status-filter" v-model="filters.status" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500">
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
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
            <label for="customer" class="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select id="customer" v-model="filters.customer" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500">
              <option value="all">All Customers</option>
              <option value="John Doe">John Doe</option>
              <option value="Sarah Smith">Sarah Smith</option>
              <option value="Michael Johnson">Michael Johnson</option>
              <option value="Emily Williams">Emily Williams</option>
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
  
      <!-- Invoices Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
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
                  Due Date
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
              <tr v-for="invoice in filteredInvoices" :key="invoice.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-violet-600">
                  #{{ invoice.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ invoice.date }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ invoice.customer }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${{ invoice.amount.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ invoice.dueDate }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="{
                      'bg-gray-100 text-gray-800': invoice.status === 'Draft',
                      'bg-blue-100 text-blue-800': invoice.status === 'Sent',
                      'bg-green-100 text-green-800': invoice.status === 'Paid',
                      'bg-red-100 text-red-800': invoice.status === 'Overdue',
                      'bg-gray-100 text-gray-800': invoice.status === 'Cancelled'
                    }">
                    {{ invoice.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button @click="viewInvoice(invoice)" class="text-violet-600 hover:text-violet-900">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button @click="editInvoice(invoice)" class="text-blue-600 hover:text-blue-900">
                      <Edit class="h-4 w-4" />
                    </button>
                    <button @click="downloadInvoice(invoice)" class="text-gray-600 hover:text-gray-900">
                      <Download class="h-4 w-4" />
                    </button>
                    <button @click="deleteInvoice(invoice)" class="text-red-600 hover:text-red-900">
                      <Trash2 class="h-4 w-4" />
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
                Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">{{ invoices.length }}</span> results
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
  
      <!-- Create/Edit Invoice Modal -->
      <div v-if="isCreateInvoiceModalOpen || isEditInvoiceModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
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
                    {{ isEditInvoiceModalOpen ? 'Edit Invoice' : 'Create New Invoice' }}
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div>
                      <label for="invoice-customer" class="block text-sm font-medium text-gray-700">Customer</label>
                      <select id="invoice-customer" v-model="currentInvoice.customer" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500">
                        <option value="">Select a customer</option>
                        <option value="John Doe">John Doe</option>
                        <option value="Sarah Smith">Sarah Smith</option>
                        <option value="Michael Johnson">Michael Johnson</option>
                        <option value="Emily Williams">Emily Williams</option>
                        <option value="Robert Brown">Robert Brown</option>
                      </select>
                    </div>
                    <div>
                      <label for="invoice-date" class="block text-sm font-medium text-gray-700">Invoice Date</label>
                      <input type="date" id="invoice-date" v-model="currentInvoice.date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500" />
                    </div>
                    <div>
                      <label for="invoice-due-date" class="block text-sm font-medium text-gray-700">Due Date</label>
                      <input type="date" id="invoice-due-date" v-model="currentInvoice.dueDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Items</label>
                      <div v-for="(item, index) in currentInvoice.items" :key="index" class="flex items-center space-x-2 mb-2">
                        <input type="text" v-model="item.description" placeholder="Description" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500" />
                        <input type="number" v-model="item.quantity" placeholder="Qty" class="w-16 rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500" />
                        <input type="number" v-model="item.price" placeholder="Price" class="w-24 rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500" />
                        <button @click="removeInvoiceItem(index)" class="text-red-500 hover:text-red-700">
                          <X class="h-4 w-4" />
                        </button>
                      </div>
                      <button @click="addInvoiceItem" class="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-violet-700 bg-violet-100 hover:bg-violet-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
                        <Plus class="h-4 w-4 mr-1" />
                        Add Item
                      </button>
                    </div>
                    <div>
                      <label for="invoice-notes" class="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea id="invoice-notes" v-model="currentInvoice.notes" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="saveInvoice" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm">
                {{ isEditInvoiceModalOpen ? 'Update Invoice' : 'Create Invoice' }}
              </button>
              <button @click="closeInvoiceModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- View Invoice Modal -->
      <div v-if="selectedInvoice" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      Invoice #{{ selectedInvoice.id }}
                    </h3>
                    <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                      :class="{
                        'bg-gray-100 text-gray-800': selectedInvoice.status === 'Draft',
                        'bg-blue-100 text-blue-800': selectedInvoice.status === 'Sent',
                        'bg-green-100 text-green-800': selectedInvoice.status === 'Paid',
                        'bg-red-100 text-red-800': selectedInvoice.status === 'Overdue',
                        'bg-gray-100 text-gray-800': selectedInvoice.status === 'Cancelled'
                      }">
                      {{ selectedInvoice.status }}
                    </span>
                  </div>
                  
                  <div class="border-t border-gray-200 py-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">From</h4>
                        <p class="text-sm font-medium text-gray-900 mt-1">Art Gallery Studio</p>
                        <p class="text-sm text-gray-500">123 Art Street</p>
                        <p class="text-sm text-gray-500">New York, NY 10001</p>
                        <p class="text-sm text-gray-500">studio@artgallery.com</p>
                      </div>
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Bill To</h4>
                        <p class="text-sm font-medium text-gray-900 mt-1">{{ selectedInvoice.customer }}</p>
                        <p class="text-sm text-gray-500">{{ selectedInvoice.address }}</p>
                        <p class="text-sm text-gray-500">{{ selectedInvoice.email }}</p>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Invoice Date</h4>
                        <p class="text-sm text-gray-900 mt-1">{{ selectedInvoice.date }}</p>
                      </div>
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Due Date</h4>
                        <p class="text-sm text-gray-900 mt-1">{{ selectedInvoice.dueDate }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="border-t border-gray-200 py-4">
                    <h4 class="text-sm font-medium text-gray-900 mb-3">Invoice Items</h4>
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th scope="col" class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                          <th scope="col" class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th scope="col" class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(item, index) in selectedInvoice.items" :key="index">
                          <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ item.description }}</td>
                          <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">{{ item.quantity }}</td>
                          <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">${{ item.price.toFixed(2) }}</td>
                          <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">${{ (item.quantity * item.price).toFixed(2) }}</td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <div class="mt-4 flex justify-end">
                      <div class="w-64 space-y-2">
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Subtotal:</span>
                          <span class="text-sm font-medium text-gray-900">${{ calculateSubtotal(selectedInvoice.items).toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Tax (8%):</span>
                          <span class="text-sm font-medium text-gray-900">${{ calculateTax(selectedInvoice.items).toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between border-t pt-2">
                          <span class="text-sm font-medium text-gray-900">Total:</span>
                          <span class="text-sm font-medium text-gray-900">${{ selectedInvoice.amount.toFixed(2) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="border-t border-gray-200 py-4">
                    <h4 class="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                    <p class="text-sm text-gray-500">{{ selectedInvoice.notes || 'No notes provided.' }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="downloadInvoice(selectedInvoice)" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm">
                <Download class="h-4 w-4 mr-2" />
                Download
              </button>
              <button @click="selectedInvoice = null" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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
    Search, Plus, Eye, Edit, Download, Trash2, X,
    ChevronLeft, ChevronRight
  } from 'lucide-vue-next'
  
  // Search and filters
  const searchQuery = ref('')
  const filters = ref({
    status: 'all',
    dateRange: 'all',
    customer: 'all',
    minAmount: null as number | null,
    maxAmount: null as number | null
  })
  
  // Modal states
  const isCreateInvoiceModalOpen = ref(false)
  const isEditInvoiceModalOpen = ref(false)
  const selectedInvoice = ref(null as any)
  
  // Current invoice being edited or created
  const currentInvoice = ref({
    id: '',
    customer: '',
    date: '',
    dueDate: '',
    amount: 0,
    status: 'Draft',
    items: [] as { description: string; quantity: number; price: number }[],
    notes: '',
    address: '',
    email: ''
  })
  
  // Sample invoices data
  const invoices = ref([
    {
      id: '2025-001',
      date: '2025-04-02',
      customer: 'John Doe',
      email: 'john.doe@example.com',
      address: '123 Main St, New York, NY 10001',
      amount: 394.00,
      dueDate: '2025-05-02',
      status: 'Sent',
      items: [
        { description: 'Abstract Sunset - Original Painting', quantity: 1, price: 350.00 }
      ],
      notes: 'Thank you for your purchase!'
    },
    {
      id: '2025-002',
      date: '2025-04-01',
      customer: 'Sarah Smith',
      email: 'sarah.smith@example.com',
      address: '456 Oak Ave, San Francisco, CA 94102',
      amount: 145.88,
      dueDate: '2025-05-01',
      status: 'Paid',
      items: [
        { description: 'Landscape Print - Medium', quantity: 1, price: 125.00 }
      ],
      notes: 'Payment received. Thank you!'
    },
    {
      id: '2025-003',
      date: '2025-03-30',
      customer: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      address: '789 Pine St, Chicago, IL 60601',
      amount: 566.25,
      dueDate: '2025-04-29',
      status: 'Overdue',
      items: [
        { description: 'Portrait Commission - Custom Size', quantity: 1, price: 500.00 }
      ],
      notes: 'Please remit payment as soon as possible.'
    },
    {
      id: '2025-004',
      date: '2025-03-29',
      customer: 'Emily Williams',
      email: 'emily.williams@example.com',
      address: '321 Maple Rd, Austin, TX 78701',
      amount: 86.60,
      dueDate: '2025-04-28',
      status: 'Paid',
      items: [
        { description: 'Digital Art Print - Small', quantity: 1, price: 75.00 }
      ],
      notes: 'Payment received. Thank you!'
    },
    {
      id: '2025-005',
      date: '2025-03-28',
      customer: 'Robert Brown',
      email: 'robert.brown@example.com',
      address: '654 Elm St, Seattle, WA 98101',
      amount: 507.80,
      dueDate: '2025-04-27',
      status: 'Cancelled',
      items: [
        { description: 'Abstract Sculpture - Bronze', quantity: 1, price: 450.00 }
      ],
      notes: 'Order cancelled at customer request.'
    },
    {
      id: '2025-006',
      date: '2025-03-27',
      customer: 'Jennifer Davis',
      email: 'jennifer.davis@example.com',
      address: '987 Cedar Ln, Miami, FL 33101',
      amount: 196.56,
      dueDate: '2025-04-26',
      status: 'Draft',
      items: [
        { description: 'Watercolor Landscape - Original', quantity: 1, price: 125.00 },
        { description: 'Mini Print Set - Collection of 3', quantity: 1, price: 45.00 }
      ],
      notes: 'Draft invoice - not yet sent.'
    }
  ])
  
  // Filtered invoices based on search and filters
  const filteredInvoices = computed(() => {
    return invoices.value.filter(invoice => {
      // Search query
      if (searchQuery.value && !invoice.id.includes(searchQuery.value) && 
          !invoice.customer.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        return false
      }
      
      // Status filter
      if (filters.value.status !== 'all' && 
          invoice.status.toLowerCase() !== filters.value.status.toLowerCase()) {
        return false
      }
      
      // Customer filter
      if (filters.value.customer !== 'all' && 
          invoice.customer !== filters.value.customer) {
        return false
      }
      
      // Amount range filter
      if (filters.value.minAmount !== null && invoice.amount < filters.value.minAmount) {
        return false
      }
      if (filters.value.maxAmount !== null && invoice.amount > filters.value.maxAmount) {
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
      customer: 'all',
      minAmount: null,
      maxAmount: null
    }
  }
  
  const applyFilters = () => {
    // Filters are already applied via the computed property
  }
  
  // Invoice actions
  const viewInvoice = (invoice: any) => {
    selectedInvoice.value = invoice
  }
  
  const editInvoice = (invoice: any) => {
    currentInvoice.value = JSON.parse(JSON.stringify(invoice)) // Deep copy
    isEditInvoiceModalOpen.value = true
  }
  
  const downloadInvoice = (invoice: any) => {
    alert(`Downloading invoice #${invoice.id}`)
  }
  
  const deleteInvoice = (invoice: any) => {
    if (confirm(`Are you sure you want to delete invoice #${invoice.id}?`)) {
      const index = invoices.value.findIndex(i => i.id === invoice.id)
      if (index !== -1) {
        invoices.value.splice(index, 1)
      }
    }
  }
  
  // Invoice item functions
  const addInvoiceItem = () => {
    currentInvoice.value.items.push({
      description: '',
      quantity: 1,
      price: 0
    })
  }
  
  const removeInvoiceItem = (index: number) => {
    currentInvoice.value.items.splice(index, 1)
  }
  
  // Calculate subtotal
  const calculateSubtotal = (items: any[]) => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0)
  }
  
  // Calculate tax (8%)
  const calculateTax = (items: any[]) => {
    return calculateSubtotal(items) * 0.08
  }
  
  // Save invoice
  const saveInvoice = () => {
    // Calculate amount
    const subtotal = calculateSubtotal(currentInvoice.value.items)
    const tax = calculateTax(currentInvoice.value.items)
    currentInvoice.value.amount = subtotal + tax
    
    if (isEditInvoiceModalOpen.value) {
      // Update existing invoice
      const index = invoices.value.findIndex(i => i.id === currentInvoice.value.id)
      if (index !== -1) {
        invoices.value[index] = { ...currentInvoice.value }
      }
    } else {
      // Add new invoice
      const newInvoice = {
        ...currentInvoice.value,
        id: `2025-${(invoices.value.length + 1).toString().padStart(3, '0')}`,
        email: `${currentInvoice.value.customer.toLowerCase().replace(' ', '.')}@example.com`,
        address: '123 Customer Address, City, State 12345'
      }
      invoices.value.push(newInvoice)
    }
    closeInvoiceModal()
  }
  
  const closeInvoiceModal = () => {
    isCreateInvoiceModalOpen.value = false
    isEditInvoiceModalOpen.value = false
    currentInvoice.value = {
      id: '',
      customer: '',
      date: '',
      dueDate: '',
      amount: 0,
      status: 'Draft',
      items: [],
      notes: '',
      address: '',
      email: ''
    }
  }
  </script>