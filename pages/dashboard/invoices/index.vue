<template>
  <div class="space-y-6">
    <!-- Header with actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="animate-fade-in">
        <h1 class="text-2xl font-bold text-gray-900">Invoice Management</h1>
        <p class="text-gray-500 mt-1">Create and manage invoices for your products</p>
      </div>
      <div class="flex gap-3 animate-slide-in-right">
        <div class="relative">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search invoices..." 
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
          />
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <button 
          @click="isCreateInvoiceModalOpen = true" 
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200"
        >
          <Plus class="h-4 w-4 mr-2" />
          Create Invoice
        </button>
      </div>
    </div>

    <!-- Invoice Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="transition-all duration-200 hover:shadow-md p-2 rounded-md">
          <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            id="status-filter" 
            v-model="filters.status" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="transition-all duration-200 hover:shadow-md p-2 rounded-md">
          <label for="date-range" class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select 
            id="date-range" 
            v-model="filters.dateRange" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div class="transition-all duration-200 hover:shadow-md p-2 rounded-md">
          <label for="due-date" class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <select 
            id="due-date" 
            v-model="filters.dueDate" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
          >
            <option value="all">All Due Dates</option>
            <option value="overdue">Overdue</option>
            <option value="due-today">Due Today</option>
            <option value="due-this-week">Due This Week</option>
            <option value="due-next-week">Due Next Week</option>
            <option value="due-this-month">Due This Month</option>
          </select>
        </div>
        <div class="transition-all duration-200 hover:shadow-md p-2 rounded-md">
          <label for="amount-range" class="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
          <div class="flex items-center space-x-2">
            <input 
              type="number" 
              v-model="filters.minAmount" 
              placeholder="Min" 
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
            />
            <span>-</span>
            <input 
              type="number" 
              v-model="filters.maxAmount" 
              placeholder="Max" 
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
            />
          </div>
        </div>
      </div>
      <div class="mt-4 flex justify-end space-x-3">
        <button 
          @click="resetFilters" 
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200"
        >
          Reset
        </button>
        <button 
          @click="applyFilters" 
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200"
        >
          Apply Filters
        </button>
      </div>
    </div>

    <!-- Invoices Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div v-if="loading" class="p-8 flex justify-center items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700"></div>
      </div>
      <div v-else-if="!filteredInvoices.length" class="p-8 text-center text-gray-500">
        <FileX class="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p class="text-lg font-medium">No invoices found</p>
        <p class="mt-1">Try adjusting your filters or create a new invoice</p>
      </div>
      <div v-else class="overflow-x-auto">
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
                Order #
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
            <tr 
              v-for="invoice in paginatedInvoices" 
              :key="invoice._id" 
              class="hover:bg-gray-50 transition-colors duration-150 animate-fade-in"
              :style="{ animationDelay: `${paginatedInvoices.indexOf(invoice) * 0.05}s` }"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-violet-600">
                {{ invoice.invoiceNumber }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(invoice.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8 bg-violet-100 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-violet-700">{{ getInitials(invoice.customer.fullName) }}</span>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ invoice.customer.fullName }}</div>
                    <div class="text-xs text-gray-500">{{ invoice.customer.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ invoice.order.orderNumber }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${{ invoice.total.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center">
                  <span>{{ formatDate(invoice.dueDate) }}</span>
                  <span 
                    v-if="isOverdue(invoice.dueDate)" 
                    class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
                  >
                    Overdue
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors duration-200" 
                  :class="{
                    'bg-yellow-100 text-yellow-800': invoice.status === 'pending',
                    'bg-green-100 text-green-800': invoice.status === 'paid',
                    'bg-red-100 text-red-800': invoice.status === 'overdue',
                    'bg-gray-100 text-gray-800': invoice.status === 'cancelled'
                  }">
                  {{ capitalizeFirstLetter(invoice.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button 
                    @click="viewInvoice(invoice)" 
                    class="text-violet-600 hover:text-violet-900 transition-colors duration-200 p-1 rounded-full hover:bg-violet-50"
                    title="View Invoice"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                  <button 
                    @click="editInvoice(invoice)" 
                    class="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50"
                    title="Edit Invoice"
                  >
                    <Edit class="h-4 w-4" />
                  </button>
                  <button 
                    @click="downloadInvoicePDF(invoice)" 
                    class="text-emerald-600 hover:text-emerald-900 transition-colors duration-200 p-1 rounded-full hover:bg-emerald-50"
                    title="Download PDF"
                  >
                    <FileDown class="h-4 w-4" />
                  </button>
                  <button 
                    @click="markAsPaid(invoice)" 
                    v-if="invoice.status === 'pending'"
                    class="text-green-600 hover:text-green-900 transition-colors duration-200 p-1 rounded-full hover:bg-green-50"
                    title="Mark as Paid"
                  >
                    <CheckCircle class="h-4 w-4" />
                  </button>
                  <button 
                    @click="deleteInvoice(invoice)" 
                    class="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                    title="Delete Invoice"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="filteredInvoices.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            :class="[
              'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white transition-colors duration-200',
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            ]"
          >
            Previous
          </button>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            :class="[
              'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white transition-colors duration-200',
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            ]"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ paginationStart }}</span> to <span class="font-medium">{{ paginationEnd }}</span> of <span class="font-medium">{{ filteredInvoices.length }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="prevPage" 
                :disabled="currentPage === 1"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 transition-colors duration-200',
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                ]"
              >
                <span class="sr-only">Previous</span>
                <ChevronLeft class="h-5 w-5" />
              </button>
              
              <template v-for="page in displayedPages" :key="page">
                <button 
                  v-if="page !== '...'"
                  @click="goToPage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200',
                    currentPage === page 
                      ? 'bg-violet-50 border-violet-500 text-violet-600' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <span 
                  v-else
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                >
                  ...
                </span>
              </template>
              
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 transition-colors duration-200',
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                ]"
              >
                <span class="sr-only">Next</span>
                <ChevronRight class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Invoice Modal -->
    <Transition name="modal">
      <div v-if="isCreateInvoiceModalOpen || isEditInvoiceModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="closeInvoiceModal">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <FileText class="h-5 w-5 mr-2 text-violet-600" />
                    {{ isEditInvoiceModalOpen ? 'Edit Invoice' : 'Create New Invoice' }}
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label for="invoice-customer" class="block text-sm font-medium text-gray-700">Customer</label>
                        <select 
                          id="invoice-customer" 
                          v-model="currentInvoice.customerId" 
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
                        >
                          <option value="">Select a customer</option>
                          <option v-for="customer in customers" :key="customer._id" :value="customer._id">
                            {{ customer.fullName }}
                          </option>
                        </select>
                      </div>
                      <div>
                        <label for="invoice-order" class="block text-sm font-medium text-gray-700">Related Order</label>
                        <select 
                          id="invoice-order" 
                          v-model="currentInvoice.orderId" 
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
                        >
                          <option value="">Select an order</option>
                          <option v-for="order in orders" :key="order._id" :value="order._id">
                            {{ order.orderNumber }}
                          </option>
                        </select>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label for="invoice-date" class="block text-sm font-medium text-gray-700">Invoice Date</label>
                        <input 
                          type="date" 
                          id="invoice-date" 
                          v-model="currentInvoice.createdAt" 
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]" 
                        />
                      </div>
                      <div>
                        <label for="invoice-due-date" class="block text-sm font-medium text-gray-700">Due Date</label>
                        <input 
                          type="date" 
                          id="invoice-due-date" 
                          v-model="currentInvoice.dueDate" 
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Invoice Items</label>
                      <div class="bg-gray-50 p-3 rounded-md mb-3">
                        <div class="grid grid-cols-12 gap-2 mb-2 text-xs font-medium text-gray-500">
                          <div class="col-span-5">Description</div>
                          <div class="col-span-2 text-center">Quantity</div>
                          <div class="col-span-2 text-center">Price</div>
                          <div class="col-span-2 text-center">Total</div>
                          <div class="col-span-1"></div>
                        </div>
                        
                        <div 
                          v-for="(item, index) in currentInvoice.items" 
                          :key="index" 
                          class="grid grid-cols-12 gap-2 mb-2 items-center"
                        >
                          <div class="col-span-5">
                            <input 
                              type="text" 
                              v-model="item.description" 
                              placeholder="Item description" 
                              class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px] text-sm" 
                            />
                          </div>
                          <div class="col-span-2">
                            <input 
                              type="number" 
                              v-model="item.quantity" 
                              min="1" 
                              placeholder="Qty" 
                              class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px] text-sm text-center" 
                              @input="updateItemTotal(item)"
                            />
                          </div>
                          <div class="col-span-2">
                            <input 
                              type="number" 
                              v-model="item.price" 
                              min="0" 
                              step="0.01" 
                              placeholder="Price" 
                              class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px] text-sm text-center" 
                              @input="updateItemTotal(item)"
                            />
                          </div>
                          <div class="col-span-2 text-center text-sm font-medium">
                            ${{ item.total.toFixed(2) }}
                          </div>
                          <div class="col-span-1 flex justify-center">
                            <button 
                              @click="removeInvoiceItem(index)" 
                              class="text-red-500 hover:text-red-700 transition-colors duration-200"
                              title="Remove item"
                            >
                              <X class="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        @click="addInvoiceItem" 
                        class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-violet-700 bg-violet-100 hover:bg-violet-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors duration-200"
                      >
                        <Plus class="h-4 w-4 mr-1" />
                        Add Item
                      </button>
                      
                      <div class="mt-4 flex justify-end">
                        <div class="w-64 space-y-2">
                          <div class="flex justify-between">
                            <span class="text-sm text-gray-500">Subtotal:</span>
                            <span class="text-sm font-medium text-gray-900">${{ calculateSubtotal().toFixed(2) }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-sm text-gray-500">Tax:</span>
                            <span class="text-sm font-medium text-gray-900">${{ calculateTax().toFixed(2) }}</span>
                          </div>
                          <div class="flex justify-between border-t pt-2">
                            <span class="text-sm font-medium text-gray-900">Total:</span>
                            <span class="text-sm font-medium text-gray-900">${{ calculateTotal().toFixed(2) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label for="invoice-notes" class="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea 
                        id="invoice-notes" 
                        v-model="currentInvoice.notes" 
                        rows="3" 
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
                        placeholder="Add any notes or payment instructions..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="saveInvoice" 
                :disabled="updating"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="updating" class="mr-2">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isEditInvoiceModalOpen ? 'Update Invoice' : 'Create Invoice' }}
              </button>
              <button 
                @click="closeInvoiceModal" 
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

    <!-- View Invoice Modal -->
    <Transition name="modal">
      <div v-if="selectedInvoice" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="closeInvoiceDetails">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            <div id="invoice-print-area" class="bg-white p-8">
              <!-- Invoice Header -->
              <div class="flex justify-between items-start mb-8">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">INVOICE</h2>
                  <p class="text-gray-500 mt-1">{{ selectedInvoice.invoiceNumber }}</p>
                </div>
                <div class="text-right">
                  <div class="h-12 w-auto text-violet-600 font-bold text-xl">YOUR COMPANY</div>
                  <p class="text-gray-500">123 Business Street</p>
                  <p class="text-gray-500">New York, NY 10001</p>
                  <p class="text-gray-500">contact@yourcompany.com</p>
                </div>
              </div>
              
              <!-- Invoice Info -->
              <div class="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 class="text-gray-500 font-medium mb-2">Bill To:</h3>
                  <p class="font-medium">{{ selectedInvoice.customer.fullName }}</p>
                  <p>{{ selectedInvoice.billingAddress.address }}</p>
                  <p>{{ selectedInvoice.billingAddress.city }}, {{ selectedInvoice.billingAddress.state }} {{ selectedInvoice.billingAddress.postalCode }}</p>
                  <p>{{ selectedInvoice.billingAddress.country }}</p>
                  <p class="mt-2">{{ selectedInvoice.billingAddress.email }}</p>
                  <p>{{ selectedInvoice.billingAddress.phone }}</p>
                </div>
                <div class="text-right">
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div class="text-gray-500 font-medium">Invoice Number:</div>
                    <div>{{ selectedInvoice.invoiceNumber }}</div>
                    
                    <div class="text-gray-500 font-medium">Invoice Date:</div>
                    <div>{{ formatDate(selectedInvoice.createdAt) }}</div>
                    
                    <div class="text-gray-500 font-medium">Due Date:</div>
                    <div>{{ formatDate(selectedInvoice.dueDate) }}</div>
                    
                    <div class="text-gray-500 font-medium">Order Number:</div>
                    <div>{{ selectedInvoice.order.orderNumber }}</div>
                    
                    <div class="text-gray-500 font-medium">Status:</div>
                    <div>
                      <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                        :class="{
                          'bg-yellow-100 text-yellow-800': selectedInvoice.status === 'pending',
                          'bg-green-100 text-green-800': selectedInvoice.status === 'paid',
                          'bg-red-100 text-red-800': selectedInvoice.status === 'overdue',
                          'bg-gray-100 text-gray-800': selectedInvoice.status === 'cancelled'
                        }">
                        {{ capitalizeFirstLetter(selectedInvoice.status) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Invoice Items -->
              <div class="mb-8">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr class="bg-gray-50">
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                      <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(item, index) in selectedInvoice.items" :key="index">
                      <td class="px-6 py-4 text-sm text-gray-900">{{ item.description }}</td>
                      <td class="px-6 py-4 text-sm text-gray-500 text-center">{{ item.quantity }}</td>
                      <td class="px-6 py-4 text-sm text-gray-500 text-right">${{ item.price.toFixed(2) }}</td>
                      <td class="px-6 py-4 text-sm font-medium text-gray-900 text-right">${{ item.total.toFixed(2) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Invoice Summary -->
              <div class="flex justify-end mb-8">
                <div class="w-64 space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Subtotal:</span>
                    <span class="text-sm font-medium text-gray-900">${{ selectedInvoice.subtotal.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Tax:</span>
                    <span class="text-sm font-medium text-gray-900">${{ selectedInvoice.tax.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between border-t border-gray-200 pt-3">
                    <span class="text-base font-medium text-gray-900">Total:</span>
                    <span class="text-base font-medium text-gray-900">${{ selectedInvoice.total.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Notes -->
              <div class="border-t border-gray-200 pt-6">
                <h3 class="text-sm font-medium text-gray-900 mb-2">Notes:</h3>
                <p class="text-sm text-gray-500">{{ selectedInvoice.notes || 'No notes provided.' }}</p>
                
                <div class="mt-6 text-center text-gray-500 text-sm">
                  <p>Thank you for your business!</p>
                  <p class="mt-1">Payment is due by {{ formatDate(selectedInvoice.dueDate) }}</p>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="downloadInvoicePDF(selectedInvoice)" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
              >
                <FileDown class="h-4 w-4 mr-2" />
                Download PDF
              </button>
              <button 
                @click="printInvoice()" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
              >
                <Printer class="h-4 w-4 mr-2" />
                Print
              </button>
              <button 
                @click="closeInvoiceDetails" 
                type="button" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition name="modal">
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="isDeleteModalOpen = false">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangle class="h-6 w-6 text-red-600" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Delete Invoice
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to delete invoice "{{ invoiceToDelete?.invoiceNumber }}"? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="confirmDelete" 
                :disabled="updating"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="updating" class="mr-2">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                Delete
              </button>
              <button 
                @click="isDeleteModalOpen = false" 
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useFetchAllInvoices } from "@/composables/modules/invoice/useFetchAllInvoices"
import { 
  Search, Plus, Eye, Edit, FileDown, Trash2, X, FileText,
  ChevronLeft, ChevronRight, CheckCircle, Printer, FileX,
  AlertTriangle
} from 'lucide-vue-next'
import html2pdf from 'html2pdf.js'
const { loading, invoices } = useFetchAllInvoices()

// Types
interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  id: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  age: number;
  id: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
  _id: string;
  id: string;
}

interface Address {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  _id: string;
  id: string;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  customer: Customer;
  order: Order;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  dueDate: string;
  notes: string;
  billingAddress: Address;
  createdAt: string;
  updatedAt: string;
  daysOverdue: number;
  id: string;
}

// State
// const loading = ref(true)
const updating = ref(false)
// const invoices = ref<Invoice[]>([])
const customers = ref<Customer[]>([])
const orders = ref<Order[]>([])

// Search and filters
const searchQuery = ref('')
const filters = ref({
  status: 'all',
  dateRange: 'all',
  dueDate: 'all',
  minAmount: null as number | null,
  maxAmount: null as number | null
})

// Modal states
const isCreateInvoiceModalOpen = ref(false)
const isEditInvoiceModalOpen = ref(false)
const selectedInvoice = ref<Invoice | null>(null)
const isDeleteModalOpen = ref(false)
const invoiceToDelete = ref<Invoice | null>(null)

// Pagination
const itemsPerPage = ref(5)
const currentPage = ref(1)

// Current invoice being edited or created
const currentInvoice = ref({
  _id: '',
  invoiceNumber: '',
  customerId: '',
  orderId: '',
  items: [] as { description: string; quantity: number; price: number; total: number }[],
  subtotal: 0,
  tax: 0,
  total: 0,
  status: 'pending',
  dueDate: '',
  notes: '',
  createdAt: '',
  updatedAt: ''
})

// // Fetch invoices data
// const fetchInvoices = async () => {
//   loading.value = true
//   try {
//     // Simulate API call with the provided data structure
//     // In a real app, you would fetch from your API
//     setTimeout(() => {
//       invoices.value = [
//         {
//           "_id": "67ff15a8ab241251f7b77f0b",
//           "invoiceNumber": "INV-70472165-811",
//           "customer": {
//             "_id": "67fa8e31b42b0ed1af9e1a0f",
//             "firstName": "Raymomnd",
//             "lastName": "Arts",
//             "email": "raymond@gmail.com",
//             "fullName": "Raymomnd Arts",
//             "id": "67fa8e31b42b0ed1af9e1a0f"
//           },
//           "order": {
//             "_id": "67ff15a6ab241251f7b77efa",
//             "orderNumber": "ORD-70469407-457",
//             "age": 0,
//             "id": "67ff15a6ab241251f7b77efa"
//           },
//           "items": [
//             {
//               "description": "Product ID: 67fc7420c898386a97f03716",
//               "quantity": 2,
//               "price": 249.99,
//               "total": 499.98,
//               "_id": "67ff15a8ab241251f7b77f0c",
//               "id": "67ff15a8ab241251f7b77f0c"
//             },
//             {
//               "description": "Product ID: 67fabc48b42b0ed1af9e1a1c",
//               "quantity": 2,
//               "price": 249.99,
//               "total": 499.98,
//               "_id": "67ff15a8ab241251f7b77f0d",
//               "id": "67ff15a8ab241251f7b77f0d"
//             },
//             {
//               "description": "Shipping and Handling",
//               "quantity": 1,
//               "price": 50,
//               "total": 50,
//               "_id": "67ff15a8ab241251f7b77f0e",
//               "id": "67ff15a8ab241251f7b77f0e"
//             }
//           ],
//           "subtotal": 1049.96,
//           "tax": 104.99600000000001,
//           "total": 1154.9560000000001,
//           "status": "pending",
//           "dueDate": "2025-04-30T02:27:52.009Z",
//           "notes": "Invoice for order #ORD-70469407-457. Includes VAT at 2.5%",
//           "billingAddress": {
//             "firstName": "John",
//             "lastName": "Doe",
//             "address": "123 Main Street",
//             "city": "New York",
//             "state": "NY",
//             "country": "US",
//             "postalCode": "10001",
//             "phone": "+12125551234",
//             "email": "john.doe@example.com",
//             "_id": "67ff15a6ab241251f7b77efe",
//             "id": "67ff15a6ab241251f7b77efe"
//           },
//           "createdAt": "2025-04-16T02:27:52.168Z",
//           "updatedAt": "2025-04-16T02:27:52.168Z",
//           "daysOverdue": 0,
//           "id": "67ff15a8ab241251f7b77f0b"
//         }
//       ]
      
//       // Add more sample invoices based on the real structure
//       for (let i = 1; i <= 10; i++) {
//         const status = ['pending', 'paid', 'overdue', 'cancelled'][Math.floor(Math.random() * 4)]
        
//         const invoice: Invoice = {
//           "_id": `sample-${i}`,
//           "invoiceNumber": `INV-${Math.floor(Math.random() * 100000000)}-${Math.floor(Math.random() * 1000)}`,
//           "customer": {
//             "_id": `customer-${i}`,
//             "firstName": ["John", "Jane", "Michael", "Sarah", "David"][Math.floor(Math.random() * 5)],
//             "lastName": ["Smith", "Johnson", "Williams", "Brown", "Jones"][Math.floor(Math.random() * 5)],
//             "email": `customer${i}@example.com`,
//             "fullName": "",
//             "id": `customer-${i}`
//           },
//           "order": {
//             "_id": `order-${i}`,
//             "orderNumber": `ORD-${Math.floor(Math.random() * 100000000)}-${Math.floor(Math.random() * 1000)}`,
//             "age": Math.floor(Math.random() * 30),
//             "id": `order-${i}`
//           },
//           "items": [],
//           "subtotal": 0,
//           "tax": 0,
//           "total": 0,
//           "status": status,
//           "dueDate": new Date(Date.now() + (Math.floor(Math.random() * 30) - 5) * 86400000).toISOString(),
//           "notes": `Invoice for order #${`ORD-${Math.floor(Math.random() * 100000000)}-${Math.floor(Math.random() * 1000)}`}. Includes VAT at 10%`,
//           "billingAddress": {
//             "firstName": "",
//             "lastName": "",
//             "address": `${Math.floor(Math.random() * 1000) + 100} ${["Main", "Oak", "Maple", "Pine", "Cedar"][Math.floor(Math.random() * 5)]} ${["St", "Ave", "Blvd", "Rd", "Ln"][Math.floor(Math.random() * 5)]}`,
//             "city": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][Math.floor(Math.random() * 5)],
//             "state": ["NY", "CA", "IL", "TX", "AZ"][Math.floor(Math.random() * 5)],
//             "country": "US",
//             "postalCode": `${Math.floor(Math.random() * 90000) + 10000}`,
//             "phone": `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
//             "email": `customer${i}@example.com`,
//             "_id": `billing-${i}`,
//             "id": `billing-${i}`
//           },
//           "createdAt": new Date(Date.now() - Math.floor(Math.random() * 30000000)).toISOString(),
//           "updatedAt": new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString(),
//           "daysOverdue": status === 'overdue' ? Math.floor(Math.random() * 30) + 1 : 0,
//           "id": `sample-${i}`
//         }
        
//         // Generate customer full name
//         invoice.customer.fullName = `${invoice.customer.firstName} ${invoice.customer.lastName}`
        
//         // Copy customer name to billing address
//         invoice.billingAddress.firstName = invoice.customer.firstName
//         invoice.billingAddress.lastName = invoice.customer.lastName
        
//         // Generate invoice items
//         const numItems = Math.floor(Math.random() * 3) + 1
//         for (let j = 0; j < numItems; j++) {
//           const price = Math.floor(Math.random() * 200) + 50
//           const quantity = Math.floor(Math.random() * 3) + 1
//           const total = price * quantity
          
//           invoice.items.push({
//             "description": ["Product A - Premium", "Product B - Standard", "Product C - Basic", "Consulting Services", "Custom Design"][Math.floor(Math.random() * 5)],
//             "quantity": quantity,
//             "price": price,
//             "total": total,
//             "_id": `item-${i}-${j}`,
//             "id": `item-${i}-${j}`
//           })
          
//           invoice.subtotal += total
//         }
        
//         // Add shipping item
//         const shippingCost = Math.floor(Math.random() * 4) * 10 + 10
//         invoice.items.push({
//           "description": "Shipping and Handling",
//           "quantity": 1,
//           "price": shippingCost,
//           "total": shippingCost,
//           "_id": `item-${i}-shipping`,
//           "id": `item-${i}-shipping`
//         })
//         invoice.subtotal += shippingCost
        
//         // Calculate tax and total
//         invoice.tax = invoice.subtotal * 0.1 // 10% tax
//         invoice.total = invoice.subtotal + invoice.tax
        
//         invoices.value.push(invoice)
        
//         // Add to customers list
//         if (!customers.value.find(c => c._id === invoice.customer._id)) {
//           customers.value.push(invoice.customer)
//         }
        
//         // Add to orders list
//         if (!orders.value.find(o => o._id === invoice.order._id)) {
//           orders.value.push(invoice.order)
//         }
//       }
      
//       loading.value = false
//     }, 1000)
//   } catch (error) {
//     console.error('Error fetching invoices:', error)
//     loading.value = false
//   }
// }

// Filtered invoices based on search and filters
const filteredInvoices = computed(() => {
  return invoices.value.filter(invoice => {
    // Search query
    if (searchQuery.value && 
        !invoice.invoiceNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) && 
        !invoice.customer.fullName.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
        !invoice.order.orderNumber.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }
    
    // Status filter
    if (filters.value.status !== 'all' && invoice.status !== filters.value.status) {
      return false
    }
    
    // Date range filter
    if (filters.value.dateRange !== 'all') {
      const invoiceDate = new Date(invoice.createdAt)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      const weekStart = new Date(today)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      
      const yearStart = new Date(today.getFullYear(), 0, 1)
      
      if (filters.value.dateRange === 'today' && invoiceDate < today) {
        return false
      }
      
      if (filters.value.dateRange === 'yesterday' && (invoiceDate < yesterday || invoiceDate >= today)) {
        return false
      }
      
      if (filters.value.dateRange === 'week' && invoiceDate < weekStart) {
        return false
      }
      
      if (filters.value.dateRange === 'month' && invoiceDate < monthStart) {
        return false
      }
      
      if (filters.value.dateRange === 'year' && invoiceDate < yearStart) {
        return false
      }
    }
    
    // Due date filter
    if (filters.value.dueDate !== 'all') {
      const dueDate = new Date(invoice.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const weekEnd = new Date(today)
      weekEnd.setDate(weekEnd.getDate() + (7 - weekEnd.getDay()))
      
      const nextWeekEnd = new Date(weekEnd)
      nextWeekEnd.setDate(nextWeekEnd.getDate() + 7)
      
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      
      if (filters.value.dueDate === 'overdue' && dueDate >= today) {
        return false
      }
      
      if (filters.value.dueDate === 'due-today' && (dueDate < today || dueDate >= tomorrow)) {
        return false
      }
      
      if (filters.value.dueDate === 'due-this-week' && (dueDate < today || dueDate > weekEnd)) {
        return false
      }
      
      if (filters.value.dueDate === 'due-next-week' && (dueDate <= weekEnd || dueDate > nextWeekEnd)) {
        return false
      }
      
      if (filters.value.dueDate === 'due-this-month' && (dueDate < today || dueDate > monthEnd)) {
        return false
      }
    }
    
    // Amount range filter
    if (filters.value.minAmount !== null && invoice.total < filters.value.minAmount) {
      return false
    }
    if (filters.value.maxAmount !== null && invoice.total > filters.value.maxAmount) {
      return false
    }
    
    return true
  })
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredInvoices.value.length / itemsPerPage.value))

const paginatedInvoices = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return filteredInvoices.value.slice(startIndex, endIndex)
})

const paginationStart = computed(() => {
  if (filteredInvoices.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const paginationEnd = computed(() => {
  if (filteredInvoices.value.length === 0) return 0
  return Math.min(currentPage.value * itemsPerPage.value, filteredInvoices.value.length)
})

const displayedPages = computed(() => {
  if (totalPages.value <= 7) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1)
  }
  
  if (currentPage.value <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages.value]
  }
  
  if (currentPage.value >= totalPages.value - 3) {
    return [1, '...', totalPages.value - 4, totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value]
  }
  
  return [1, '...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...', totalPages.value]
})

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

// Watch for filter changes to reset pagination
watch([filters, searchQuery], () => {
  currentPage.value = 1
})

// Filter functions
const resetFilters = () => {
  filters.value = {
    status: 'all',
    dateRange: 'all',
    dueDate: 'all',
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

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// Check if date is overdue
const isOverdue = (dateString: string) => {
  const dueDate = new Date(dateString)
  const today = new Date()
  return dueDate < today
}

// Get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Capitalize first letter
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Invoice item functions
const addInvoiceItem = () => {
  currentInvoice.value.items.push({
    description: '',
    quantity: 1,
    price: 0,
    total: 0
  })
}

const removeInvoiceItem = (index: number) => {
  currentInvoice.value.items.splice(index, 1)
}

const updateItemTotal = (item: { quantity: number; price: number; total: number }) => {
  item.total = item.quantity * item.price
}

// Calculate subtotal
const calculateSubtotal = () => {
  return currentInvoice.value.items.reduce((total, item) => total + item.total, 0)
}

// Calculate tax (10%)
const calculateTax = () => {
  return calculateSubtotal() * 0.1
}

// Calculate total
const calculateTotal = () => {
  return calculateSubtotal() + calculateTax()
}

// Invoice actions
const viewInvoice = (invoice: Invoice) => {
  selectedInvoice.value = invoice
}

const closeInvoiceDetails = () => {
  selectedInvoice.value = null
}

const editInvoice = (invoice: Invoice) => {
  // Create a deep copy and format for the form
  currentInvoice.value = {
    _id: invoice._id,
    invoiceNumber: invoice.invoiceNumber,
    customerId: invoice.customer._id,
    orderId: invoice.order._id,
    items: JSON.parse(JSON.stringify(invoice.items)),
    subtotal: invoice.subtotal,
    tax: invoice.tax,
    total: invoice.total,
    status: invoice.status,
    dueDate: new Date(invoice.dueDate).toISOString().split('T')[0],
    notes: invoice.notes,
    createdAt: new Date(invoice.createdAt).toISOString().split('T')[0],
    updatedAt: invoice.updatedAt
  }
  isEditInvoiceModalOpen.value = true
}

const markAsPaid = async (invoice: Invoice) => {
  updating.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const index = invoices.value.findIndex(i => i._id === invoice._id)
    if (index !== -1) {
      invoices.value[index].status = 'paid'
      invoices.value[index].updatedAt = new Date().toISOString()
      
      // If we were viewing this invoice, update the selected invoice too
      if (selectedInvoice.value && selectedInvoice.value._id === invoice._id) {
        selectedInvoice.value = { ...invoices.value[index] }
      }
    }
    
    updating.value = false
  } catch (error) {
    console.error('Error marking invoice as paid:', error)
    updating.value = false
  }
}

const deleteInvoice = (invoice: Invoice) => {
  invoiceToDelete.value = invoice
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!invoiceToDelete.value) return
  
  updating.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Remove from local state
    invoices.value = invoices.value.filter(i => i._id !== invoiceToDelete.value?._id)
    
    // Close modals
    isDeleteModalOpen.value = false
    if (selectedInvoice.value && selectedInvoice.value._id === invoiceToDelete.value._id) {
      selectedInvoice.value = null
    }
    
    updating.value = false
  } catch (error) {
    console.error('Error deleting invoice:', error)
    updating.value = false
  }
}

// Save invoice
const saveInvoice = async () => {
  updating.value = true
  try {
    // Calculate totals
    currentInvoice.value.subtotal = calculateSubtotal()
    currentInvoice.value.tax = calculateTax()
    currentInvoice.value.total = calculateTotal()
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (isEditInvoiceModalOpen.value) {
      // Update existing invoice
      const index = invoices.value.findIndex(i => i._id === currentInvoice.value._id)
      if (index !== -1) {
        // Find customer and order
        const customer = customers.value.find(c => c._id === currentInvoice.value.customerId)
        const order = orders.value.find(o => o._id === currentInvoice.value.orderId)
        
        if (customer && order) {
          // Update the invoice
          invoices.value[index] = {
            ...invoices.value[index],
            customer,
            order,
            items: currentInvoice.value.items,
            subtotal: currentInvoice.value.subtotal,
            tax: currentInvoice.value.tax,
            total: currentInvoice.value.total,
            status: currentInvoice.value.status,
            dueDate: new Date(currentInvoice.value.dueDate).toISOString(),
            notes: currentInvoice.value.notes,
            updatedAt: new Date().toISOString()
          }
          
          // If we were viewing this invoice, update the selected invoice too
          if (selectedInvoice.value && selectedInvoice.value._id === currentInvoice.value._id) {
            selectedInvoice.value = { ...invoices.value[index] }
          }
        }
      }
    } else {
      // Create new invoice
      // Find customer and order
      const customer = customers.value.find(c => c._id === currentInvoice.value.customerId)
      const order = orders.value.find(o => o._id === currentInvoice.value.orderId)
      
      if (customer && order) {
        // Generate new invoice
        const newInvoice: Invoice = {
          _id: `new-${Date.now()}`,
          invoiceNumber: `INV-${Math.floor(Math.random() * 100000000)}-${Math.floor(Math.random() * 1000)}`,
          customer,
          order,
          items: currentInvoice.value.items.map((item, index) => ({
            ...item,
            _id: `new-item-${Date.now()}-${index}`,
            id: `new-item-${Date.now()}-${index}`
          })),
          subtotal: currentInvoice.value.subtotal,
          tax: currentInvoice.value.tax,
          total: currentInvoice.value.total,
          status: 'pending',
          dueDate: new Date(currentInvoice.value.dueDate).toISOString(),
          notes: currentInvoice.value.notes,
          billingAddress: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            address: "123 Main Street",
            city: "New York",
            state: "NY",
            country: "US",
            postalCode: "10001",
            phone: "+12125551234",
            email: customer.email,
            _id: `new-address-${Date.now()}`,
            id: `new-address-${Date.now()}`
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          daysOverdue: 0,
          id: `new-${Date.now()}`
        }
        
        invoices.value.unshift(newInvoice)
      }
    }
    
    closeInvoiceModal()
    updating.value = false
  } catch (error) {
    console.error('Error saving invoice:', error)
    updating.value = false
  }
}

const closeInvoiceModal = () => {
  isCreateInvoiceModalOpen.value = false
  isEditInvoiceModalOpen.value = false
  currentInvoice.value = {
    _id: '',
    invoiceNumber: '',
    customerId: '',
    orderId: '',
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    status: 'pending',
    dueDate: '',
    notes: '',
    createdAt: '',
    updatedAt: ''
  }
}

// PDF and Print functions
const downloadInvoicePDF = (invoice: Invoice) => {
  // If we're not already viewing the invoice, open it first
  if (!selectedInvoice.value || selectedInvoice.value._id !== invoice._id) {
    selectedInvoice.value = invoice
    // Wait for the DOM to update
    setTimeout(() => {
      generatePDF()
    }, 500)
  } else {
    generatePDF()
  }
}

const generatePDF = () => {
  const element = document.getElementById('invoice-print-area')
  if (!element) return
  
  const options = {
    margin: [10, 10, 10, 10],
    filename: `invoice-${selectedInvoice.value?.invoiceNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }
  
  html2pdf()
    .set(options)
    .from(element)
    .save()
    .then(() => {
      console.log('PDF generated successfully')
    })
    .catch(error => {
      console.error('Error generating PDF:', error)
    })
}

const printInvoice = () => {
  const printContents = document.getElementById('invoice-print-area')?.innerHTML
  if (!printContents) return
  
  const originalContents = document.body.innerHTML
  document.body.innerHTML = printContents
  
  window.print()
  
  document.body.innerHTML = originalContents
  
  // Re-initialize the Vue app
  // In a real app, you would need to handle this differently
  // This is just a simple example
  setTimeout(() => {
    window.location.reload()
  }, 100)
}

// // Lifecycle hooks
// onMounted(() => {
//   fetchInvoices()
// })

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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Table row hover effect */
tr {
  transition: background-color 0.2s ease;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Print styles */
@media print {
  body {
    background-color: white;
    font-size: 12pt;
  }
  
  button {
    display: none !important;
  }
}
</style>