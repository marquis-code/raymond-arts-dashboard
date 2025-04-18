<template>
    <div class="space-y-6">
      <!-- Header with actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="animate-fade-in">
          <h1 class="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p class="text-gray-500 mt-1">Track and manage customer orders for your products</p>
        </div>
        <div class="flex gap-3 animate-slide-in-right">
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search orders..." 
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            />
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <button 
            @click="exportOrders" 
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200"
          >
            <Download class="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>
  
      <!-- Order Filters -->
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
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
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
            <label for="payment-status" class="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select 
              id="payment-status" 
              v-model="filters.paymentStatus" 
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
            >
              <option value="all">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
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
  
      <!-- Orders Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
        <div v-if="loading" class="p-8 flex justify-center items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700"></div>
        </div>
        <div v-else-if="!filteredOrders.length" class="p-8 text-center text-gray-500">
          <PackageX class="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p class="text-lg font-medium">No orders found</p>
          <p class="mt-1">Try adjusting your filters or search criteria</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Number
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
              <tr 
                v-for="order in paginatedOrders" 
                :key="order._id" 
                class="hover:bg-gray-50 transition-colors duration-150 animate-fade-in"
                :style="{ animationDelay: `${paginatedOrders.indexOf(order) * 0.05}s` }"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-violet-600">
                  {{ order.orderNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8 bg-violet-100 rounded-full flex items-center justify-center">
                      <span class="text-sm font-medium text-violet-700">{{ getInitials(order.customer.fullName) }}</span>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ order.customer.fullName }}</div>
                      <div class="text-xs text-gray-500">{{ order.customer.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex items-center">
                    <span class="font-medium">{{ order.items.length }}</span>
                    <span class="ml-1">item(s)</span>
                    <div class="ml-2 flex -space-x-2">
                      <div 
                        v-for="(item, index) in order.items.slice(0, 3)" 
                        :key="index" 
                        class="h-6 w-6 rounded-full ring-2 ring-white overflow-hidden"
                        :style="{ zIndex: 3 - index }"
                      >
                        <img 
                          :src="item.product.images[0]" 
                          :alt="item.product.name" 
                          class="h-full w-full object-cover"
                        />
                      </div>
                      <div 
                        v-if="order.items.length > 3" 
                        class="h-6 w-6 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center text-xs font-medium text-gray-500"
                        style="z-index: 0"
                      >
                        +{{ order.items.length - 3 }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${{ order.total.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors duration-200" 
                    :class="{
                      'bg-yellow-100 text-yellow-800': order.status === 'pending',
                      'bg-blue-100 text-blue-800': order.status === 'processing',
                      'bg-indigo-100 text-indigo-800': order.status === 'shipped',
                      'bg-green-100 text-green-800': order.status === 'delivered',
                      'bg-red-100 text-red-800': order.status === 'cancelled'
                    }">
                    {{ capitalizeFirstLetter(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors duration-200" 
                    :class="{
                      'bg-green-100 text-green-800': order.paymentStatus === 'paid',
                      'bg-yellow-100 text-yellow-800': order.paymentStatus === 'pending',
                      'bg-gray-100 text-gray-800': order.paymentStatus === 'refunded'
                    }">
                    {{ capitalizeFirstLetter(order.paymentStatus) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button 
                      @click="viewOrder(order)" 
                      class="text-violet-600 hover:text-violet-900 transition-colors duration-200 p-1 rounded-full hover:bg-violet-50"
                      title="View Order Details"
                    >
                      <Eye class="h-4 w-4" />
                    </button>
                    <button 
                      @click="updateOrderStatus(order)" 
                      class="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50"
                      title="Update Status"
                    >
                      <RefreshCw class="h-4 w-4" />
                    </button>
                    <button 
                      @click="printOrder(order)" 
                      class="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-1 rounded-full hover:bg-gray-50"
                      title="Print Order"
                    >
                      <Printer class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div v-if="filteredOrders.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
                Showing <span class="font-medium">{{ paginationStart }}</span> to <span class="font-medium">{{ paginationEnd }}</span> of <span class="font-medium">{{ filteredOrders.length }}</span> results
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
  
      <!-- Order Details Modal -->
      <Transition name="modal">
        <div v-if="selectedOrder" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="closeOrderDetails">
              <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center">
                        <ShoppingBag class="h-6 w-6 text-violet-600 mr-2" />
                        <h3 class="text-lg leading-6 font-medium text-gray-900">
                          Order {{ selectedOrder.orderNumber }}
                        </h3>
                      </div>
                      <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                        :class="{
                          'bg-yellow-100 text-yellow-800': selectedOrder.status === 'pending',
                          'bg-blue-100 text-blue-800': selectedOrder.status === 'processing',
                          'bg-indigo-100 text-indigo-800': selectedOrder.status === 'shipped',
                          'bg-green-100 text-green-800': selectedOrder.status === 'delivered',
                          'bg-red-100 text-red-800': selectedOrder.status === 'cancelled'
                        }">
                        {{ capitalizeFirstLetter(selectedOrder.status) }}
                      </span>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <!-- Order Info -->
                      <div class="md:col-span-2 space-y-6">
                        <!-- Order Summary -->
                        <div class="bg-gray-50 p-4 rounded-lg">
                          <h4 class="text-sm font-medium text-gray-900 mb-3">Order Summary</h4>
                          <div class="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p class="text-gray-500">Date Placed:</p>
                              <p class="font-medium">{{ formatDate(selectedOrder.createdAt) }}</p>
                            </div>
                            <div>
                              <p class="text-gray-500">Order Age:</p>
                              <p class="font-medium">{{ selectedOrder.age }} days</p>
                            </div>
                            <div>
                              <p class="text-gray-500">Payment Status:</p>
                              <p class="font-medium">{{ capitalizeFirstLetter(selectedOrder.paymentStatus) }}</p>
                            </div>
                            <div>
                              <p class="text-gray-500">Customer:</p>
                              <p class="font-medium">{{ selectedOrder.customer.fullName }}</p>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Order Items -->
                        <div>
                          <h4 class="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                          <div class="space-y-3">
                            <div 
                              v-for="(item, index) in selectedOrder.items" 
                              :key="index" 
                              class="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                              <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img 
                                  :src="item.product.images[0]" 
                                  :alt="item.product.name" 
                                  class="h-full w-full object-cover object-center"
                                />
                              </div>
                              <div class="ml-4 flex-1">
                                <div class="flex justify-between">
                                  <div>
                                    <h5 class="text-sm font-medium text-gray-900">{{ item.product.name }}</h5>
                                    <p class="mt-1 text-xs text-gray-500">ID: {{ item.product._id.substring(0, 8) }}</p>
                                  </div>
                                  <p class="text-sm font-medium text-gray-900">${{ item.price.toFixed(2) }}</p>
                                </div>
                                <div class="flex justify-between items-center mt-2">
                                  <div class="flex items-center">
                                    <span class="text-xs text-gray-500">Qty:</span>
                                    <span class="ml-1 text-sm font-medium">{{ item.quantity }}</span>
                                  </div>
                                  <p class="text-sm font-medium text-gray-900">
                                    ${{ item.total.toFixed(2) }}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Order Status History -->
                        <div>
                          <h4 class="text-sm font-medium text-gray-900 mb-3">Status History</h4>
                          <div class="flow-root">
                            <ul role="list" class="-mb-8">
                              <li v-for="(event, eventIdx) in selectedOrder.statusHistory" :key="eventIdx">
                                <div class="relative pb-8">
                                  <span v-if="eventIdx !== selectedOrder.statusHistory.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                  <div class="relative flex space-x-3 items-start">
                                    <div>
                                      <div class="relative px-1">
                                        <div class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white" 
                                          :class="{
                                            'bg-yellow-100': event.status === 'pending',
                                            'bg-blue-100': event.status === 'processing',
                                            'bg-indigo-100': event.status === 'shipped',
                                            'bg-green-100': event.status === 'delivered',
                                            'bg-red-100': event.status === 'cancelled'
                                          }">
                                          <Clock v-if="event.status === 'pending'" class="h-5 w-5 text-yellow-600" />
                                          <Loader v-else-if="event.status === 'processing'" class="h-5 w-5 text-blue-600" />
                                          <Truck v-else-if="event.status === 'shipped'" class="h-5 w-5 text-indigo-600" />
                                          <CheckCircle v-else-if="event.status === 'delivered'" class="h-5 w-5 text-green-600" />
                                          <XCircle v-else-if="event.status === 'cancelled'" class="h-5 w-5 text-red-600" />
                                        </div>
                                      </div>
                                    </div>
                                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                      <div>
                                        <p class="text-sm text-gray-900">
                                          Status changed to <span class="font-medium">{{ capitalizeFirstLetter(event.status) }}</span>
                                        </p>
                                        <p v-if="event.notes" class="mt-0.5 text-sm text-gray-500">
                                          {{ event.notes }}
                                        </p>
                                      </div>
                                      <div class="text-right text-sm whitespace-nowrap text-gray-500">
                                        {{ formatDate(event.date) }}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Customer & Shipping Info -->
                      <div class="space-y-6">
                        <!-- Order Totals -->
                        <div class="bg-gray-50 p-4 rounded-lg">
                          <h4 class="text-sm font-medium text-gray-900 mb-3">Order Totals</h4>
                          <div class="space-y-2">
                            <div class="flex justify-between text-sm">
                              <span class="text-gray-500">Subtotal:</span>
                              <span class="font-medium">${{ selectedOrder.subtotal.toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                              <span class="text-gray-500">Tax ({{ selectedOrder.taxRate }}%):</span>
                              <span class="font-medium">${{ selectedOrder.tax.toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                              <span class="text-gray-500">Shipping:</span>
                              <span class="font-medium">${{ selectedOrder.shipping.toFixed(2) }}</span>
                            </div>
                            <div class="pt-2 mt-2 border-t border-gray-200">
                              <div class="flex justify-between text-sm font-medium">
                                <span>Total:</span>
                                <span>${{ selectedOrder.total.toFixed(2) }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Shipping Address -->
                        <div>
                          <h4 class="text-sm font-medium text-gray-900 mb-3">Shipping Address</h4>
                          <div class="p-3 border border-gray-200 rounded-lg">
                            <p class="text-sm font-medium">{{ selectedOrder.shippingAddress.firstName }} {{ selectedOrder.shippingAddress.lastName }}</p>
                            <p class="text-sm text-gray-500 mt-1">{{ selectedOrder.shippingAddress.address }}</p>
                            <p class="text-sm text-gray-500">
                              {{ selectedOrder.shippingAddress.city }}, {{ selectedOrder.shippingAddress.state }} {{ selectedOrder.shippingAddress.postalCode }}
                            </p>
                            <p class="text-sm text-gray-500">
                              {{ selectedOrder.shippingAddress.country }}
                            </p>
                            <div class="mt-2 pt-2 border-t border-gray-100">
                              <p class="text-sm text-gray-500">
                                <span class="font-medium">Phone:</span> {{ selectedOrder.shippingAddress.phone }}
                              </p>
                              <p class="text-sm text-gray-500">
                                <span class="font-medium">Email:</span> {{ selectedOrder.shippingAddress.email }}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Billing Address -->
                        <div>
                          <h4 class="text-sm font-medium text-gray-900 mb-3">Billing Address</h4>
                          <div class="p-3 border border-gray-200 rounded-lg">
                            <p class="text-sm font-medium">{{ selectedOrder.billingAddress.firstName }} {{ selectedOrder.billingAddress.lastName }}</p>
                            <p class="text-sm text-gray-500 mt-1">{{ selectedOrder.billingAddress.address }}</p>
                            <p class="text-sm text-gray-500">
                              {{ selectedOrder.billingAddress.city }}, {{ selectedOrder.billingAddress.state }} {{ selectedOrder.billingAddress.postalCode }}
                            </p>
                            <p class="text-sm text-gray-500">
                              {{ selectedOrder.billingAddress.country }}
                            </p>
                            <div class="mt-2 pt-2 border-t border-gray-100">
                              <p class="text-sm text-gray-500">
                                <span class="font-medium">Phone:</span> {{ selectedOrder.billingAddress.phone }}
                              </p>
                              <p class="text-sm text-gray-500">
                                <span class="font-medium">Email:</span> {{ selectedOrder.billingAddress.email }}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Notes -->
                        <div v-if="selectedOrder.notes">
                          <h4 class="text-sm font-medium text-gray-900 mb-3">Order Notes</h4>
                          <div class="p-3 border border-gray-200 rounded-lg bg-yellow-50">
                            <p class="text-sm text-gray-700">{{ selectedOrder.notes }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  @click="updateOrderStatus(selectedOrder)" 
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                >
                  Update Status
                </button>
                <button 
                  @click="printOrder(selectedOrder)" 
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                >
                  Print Order
                </button>
                <button 
                  @click="closeOrderDetails" 
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
  
      <!-- Update Status Modal -->
      <Transition name="modal">
        <div v-if="isUpdateStatusModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="isUpdateStatusModalOpen = false">
              <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-violet-100 sm:mx-0 sm:h-10 sm:w-10">
                    <RefreshCw class="h-6 w-6 text-violet-600" />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      Update Order Status
                    </h3>
                    <div class="mt-4 space-y-4">
                      <div>
                        <label for="order-status" class="block text-sm font-medium text-gray-700">Status</label>
                        <select 
                          id="order-status" 
                          v-model="newStatus" 
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <label for="status-notes" class="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                        <textarea 
                          id="status-notes" 
                          v-model="statusNotes" 
                          rows="3" 
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
                          placeholder="Add notes about this status change..."
                        ></textarea>
                      </div>
                      
                      <div v-if="newStatus === 'shipped'" class="p-3 bg-blue-50 rounded-lg">
                        <h4 class="text-sm font-medium text-blue-800 mb-2">Shipping Information</h4>
                        <div class="space-y-3">
                          <div>
                            <label for="tracking-number" class="block text-sm font-medium text-gray-700">Tracking Number</label>
                            <input 
                              type="text" 
                              id="tracking-number" 
                              v-model="trackingNumber" 
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
                              placeholder="Enter tracking number..."
                            />
                          </div>
                          <div>
                            <label for="shipping-carrier" class="block text-sm font-medium text-gray-700">Shipping Carrier</label>
                            <select 
                              id="shipping-carrier" 
                              v-model="shippingCarrier" 
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
                            >
                              <option value="usps">USPS</option>
                              <option value="ups">UPS</option>
                              <option value="fedex">FedEx</option>
                              <option value="dhl">DHL</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  @click="saveOrderStatus" 
                  :disabled="updating"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="updating" class="mr-2">
                    <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  Update Status
                </button>
                <button 
                  @click="isUpdateStatusModalOpen = false" 
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
  import { useFetchAllOrders } from "@/composables/modules/orders/useFetchAllOrders"
  import { 
    Search, Download, Eye, Printer, RefreshCw, PackageX,
    ChevronLeft, ChevronRight, ShoppingBag, Clock, Loader,
    Truck, CheckCircle, XCircle
  } from 'lucide-vue-next'
  const { orders, loading } =  useFetchAllOrders()
  
  // Types
  interface Customer {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
    id: string;
  }
  
  interface Product {
    _id: string;
    name: string;
    images: string[];
    discountPercentage: number;
    id: string;
  }
  
  interface OrderItem {
    product: Product;
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
  
  interface StatusHistoryEvent {
    status: string;
    date: string;
    notes: string;
    userId: string;
  }
  
  interface Order {
    _id: string;
    orderNumber: string;
    customer: Customer;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    taxRate: number;
    shipping: number;
    total: number;
    status: string;
    paymentStatus: string;
    shippingAddress: Address;
    billingAddress: Address;
    notes: string;
    statusHistory: StatusHistoryEvent[];
    createdAt: string;
    updatedAt: string;
    age: number;
    id: string;
  }
  
  // State
//   const loading = ref(true)
  const updating = ref(false)
//   const orders = ref<Order[]>([])
  
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
  const selectedOrder = ref<Order | null>(null)
  const isUpdateStatusModalOpen = ref(false)
  const orderToUpdate = ref<Order | null>(null)
  const newStatus = ref('')
  const statusNotes = ref('')
  const trackingNumber = ref('')
  const shippingCarrier = ref('usps')
  
  // Pagination
  const itemsPerPage = ref(5)
  const currentPage = ref(1)
  
//   // Fetch orders data
//   const fetchOrders = async () => {
//     loading.value = true
//     try {
//       // Simulate API call with the provided data structure
//       // In a real app, you would fetch from your API
//       setTimeout(() => {
//         orders.value = [
//           {
//             "_id": "67ff15a6ab241251f7b77efa",
//             "orderNumber": "ORD-70469407-457",
//             "customer": {
//               "_id": "67fa8e31b42b0ed1af9e1a0f",
//               "firstName": "Raymomnd",
//               "lastName": "Arts",
//               "email": "raymond@gmail.com",
//               "fullName": "Raymomnd Arts",
//               "id": "67fa8e31b42b0ed1af9e1a0f"
//             },
//             "items": [
//               {
//                 "product": {
//                   "_id": "67fc7420c898386a97f03716",
//                   "name": "anonymous",
//                   "images": [
//                     "https://res.cloudinary.com/marquis/image/upload/v1744697367/nest-cloudinary/xnkxjlehvjxwsw03pe2a.jpg",
//                     "https://res.cloudinary.com/marquis/image/upload/v1744697367/nest-cloudinary/l9nrmacwvaw9silnk35n.jpg",
//                     "https://res.cloudinary.com/marquis/image/upload/v1744697367/nest-cloudinary/ic8dpxaqyqus2oxlljjs.jpg"
//                   ],
//                   "discountPercentage": 0,
//                   "id": "67fc7420c898386a97f03716"
//                 },
//                 "quantity": 2,
//                 "price": 249.99,
//                 "total": 499.98,
//                 "_id": "67ff15a6ab241251f7b77efb",
//                 "id": "67ff15a6ab241251f7b77efb"
//               },
//               {
//                 "product": {
//                   "_id": "67fabc48b42b0ed1af9e1a1c",
//                   "name": "anonymous",
//                   "images": [
//                     "https://res.cloudinary.com/marquis/image/upload/v1744697883/nest-cloudinary/c3panorhzpkgbx6ovxqb.png",
//                     "https://res.cloudinary.com/marquis/image/upload/v1744697883/nest-cloudinary/shwpegcellzcvxarvvys.png",
//                     "https://res.cloudinary.com/marquis/image/upload/v1744697883/nest-cloudinary/yobbmgt4raifhjaqyyus.png"
//                   ],
//                   "discountPercentage": 0,
//                   "id": "67fabc48b42b0ed1af9e1a1c"
//                 },
//                 "quantity": 2,
//                 "price": 249.99,
//                 "total": 499.98,
//                 "_id": "67ff15a6ab241251f7b77efc",
//                 "id": "67ff15a6ab241251f7b77efc"
//               }
//             ],
//             "subtotal": 999.96,
//             "tax": 24.999000000000002,
//             "taxRate": 2.5,
//             "shipping": 50,
//             "total": 1074.959,
//             "status": "pending",
//             "paymentStatus": "pending",
//             "shippingAddress": {
//               "firstName": "John",
//               "lastName": "Doe",
//               "address": "123 Main Street",
//               "city": "New York",
//               "state": "NY",
//               "country": "US",
//               "postalCode": "10001",
//               "phone": "+12125551234",
//               "email": "john.doe@example.com",
//               "_id": "67ff15a6ab241251f7b77efd",
//               "id": "67ff15a6ab241251f7b77efd"
//             },
//             "billingAddress": {
//               "firstName": "John",
//               "lastName": "Doe",
//               "address": "123 Main Street",
//               "city": "New York",
//               "state": "NY",
//               "country": "US",
//               "postalCode": "10001",
//               "phone": "+12125551234",
//               "email": "john.doe@example.com",
//               "_id": "67ff15a6ab241251f7b77efe",
//               "id": "67ff15a6ab241251f7b77efe"
//             },
//             "notes": "Please deliver to the front door.",
//             "statusHistory": [
//               {
//                 "status": "pending",
//                 "date": "2025-04-16T02:27:50.607Z",
//                 "notes": "Order created",
//                 "userId": "67fa8e31b42b0ed1af9e1a0f"
//               }
//             ],
//             "createdAt": "2025-04-16T02:27:50.617Z",
//             "updatedAt": "2025-04-16T02:27:50.617Z",
//             "age": 2,
//             "id": "67ff15a6ab241251f7b77efa"
//           }
//         ]
        
//         // Add more sample orders based on the real structure
//         for (let i = 1; i <= 10; i++) {
//           const status = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 5)]
//           const paymentStatus = ['paid', 'pending', 'refunded'][Math.floor(Math.random() * 3)]
          
//           const order: Order = {
//             "_id": `sample-${i}`,
//             "orderNumber": `ORD-${Math.floor(Math.random() * 100000000)}-${Math.floor(Math.random() * 1000)}`,
//             "customer": {
//               "_id": `customer-${i}`,
//               "firstName": ["John", "Jane", "Michael", "Sarah", "David"][Math.floor(Math.random() * 5)],
//               "lastName": ["Smith", "Johnson", "Williams", "Brown", "Jones"][Math.floor(Math.random() * 5)],
//               "email": `customer${i}@example.com`,
//               "fullName": "",
//               "id": `customer-${i}`
//             },
//             "items": [],
//             "subtotal": 0,
//             "tax": 0,
//             "taxRate": 2.5,
//             "shipping": Math.floor(Math.random() * 4) * 10 + 10,
//             "total": 0,
//             "status": status,
//             "paymentStatus": paymentStatus,
//             "shippingAddress": {
//               "firstName": "",
//               "lastName": "",
//               "address": `${Math.floor(Math.random() * 1000) + 100} ${["Main", "Oak", "Maple", "Pine", "Cedar"][Math.floor(Math.random() * 5)]} ${["St", "Ave", "Blvd", "Rd", "Ln"][Math.floor(Math.random() * 5)]}`,
//               "city": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][Math.floor(Math.random() * 5)],
//               "state": ["NY", "CA", "IL", "TX", "AZ"][Math.floor(Math.random() * 5)],
//               "country": "US",
//               "postalCode": `${Math.floor(Math.random() * 90000) + 10000}`,
//               "phone": `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
//               "email": `customer${i}@example.com`,
//               "_id": `shipping-${i}`,
//               "id": `shipping-${i}`
//             },
//             "billingAddress": {
//               "firstName": "",
//               "lastName": "",
//               "address": "",
//               "city": "",
//               "state": "",
//               "country": "US",
//               "postalCode": "",
//               "phone": "",
//               "email": `customer${i}@example.com`,
//               "_id": `billing-${i}`,
//               "id": `billing-${i}`
//             },
//             "notes": Math.random() > 0.7 ? "Please deliver to the front door." : "",
//             "statusHistory": [
//               {
//                 "status": status,
//                 "date": new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
//                 "notes": "Order status updated",
//                 "userId": "admin"
//               }
//             ],
//             "createdAt": new Date(Date.now() - Math.floor(Math.random() * 30000000)).toISOString(),
//             "updatedAt": new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString(),
//             "age": Math.floor(Math.random() * 30) + 1,
//             "id": `sample-${i}`
//           }
          
//           // Generate customer full name
//           order.customer.fullName = `${order.customer.firstName} ${order.customer.lastName}`
          
//           // Copy shipping address name to billing address
//           order.billingAddress.firstName = order.customer.firstName
//           order.billingAddress.lastName = order.customer.lastName
//           order.shippingAddress.firstName = order.customer.firstName
//           order.shippingAddress.lastName = order.customer.lastName
          
//           // Copy shipping address to billing address if not different
//           if (Math.random() > 0.3) {
//             order.billingAddress.address = order.shippingAddress.address
//             order.billingAddress.city = order.shippingAddress.city
//             order.billingAddress.state = order.shippingAddress.state
//             order.billingAddress.postalCode = order.shippingAddress.postalCode
//             order.billingAddress.phone = order.shippingAddress.phone
//           } else {
//             order.billingAddress.address = `${Math.floor(Math.random() * 1000) + 100} ${["Main", "Oak", "Maple", "Pine", "Cedar"][Math.floor(Math.random() * 5)]} ${["St", "Ave", "Blvd", "Rd", "Ln"][Math.floor(Math.random() * 5)]}`
//             order.billingAddress.city = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][Math.floor(Math.random() * 5)]
//             order.billingAddress.state = ["NY", "CA", "IL", "TX", "AZ"][Math.floor(Math.random() * 5)]
//             order.billingAddress.postalCode = `${Math.floor(Math.random() * 90000) + 10000}`
//             order.billingAddress.phone = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
//           }
          
//           // Generate order items
//           const numItems = Math.floor(Math.random() * 3) + 1
//           for (let j = 0; j < numItems; j++) {
//             const price = Math.floor(Math.random() * 200) + 50
//             const quantity = Math.floor(Math.random() * 3) + 1
//             const total = price * quantity
            
//             order.items.push({
//               "product": {
//                 "_id": `product-${i}-${j}`,
//                 "name": ["Canvas Print", "Framed Artwork", "Sculpture", "Digital Print", "Oil Painting"][Math.floor(Math.random() * 5)],
//                 "images": [
//                   `https://picsum.photos/seed/${i * 10 + j}/300/300`,
//                   `https://picsum.photos/seed/${i * 10 + j + 100}/300/300`
//                 ],
//                 "discountPercentage": Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0,
//                 "id": `product-${i}-${j}`
//               },
//               "quantity": quantity,
//               "price": price,
//               "total": total,
//               "_id": `item-${i}-${j}`,
//               "id": `item-${i}-${j}`
//             })
            
//             order.subtotal += total
//           }
          
//           // Calculate tax and total
//           order.tax = order.subtotal * (order.taxRate / 100)
//           order.total = order.subtotal + order.tax + order.shipping
          
//           // Add status history
//           if (status !== 'pending') {
//             order.statusHistory.unshift({
//               "status": "pending",
//               "date": new Date(Date.now() - Math.floor(Math.random() * 20000000)).toISOString(),
//               "notes": "Order created",
//               "userId": "admin"
//             })
//           }
          
//           if (status === 'shipped' || status === 'delivered') {
//             order.statusHistory.unshift({
//               "status": "processing",
//               "date": new Date(Date.now() - Math.floor(Math.random() * 15000000)).toISOString(),
//               "notes": "Order processing started",
//               "userId": "admin"
//             })
//           }
          
//           if (status === 'delivered') {
//             order.statusHistory.unshift({
//               "status": "shipped",
//               "date": new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
//               "notes": "Order shipped via USPS",
//               "userId": "admin"
//             })
//           }
          
//           orders.value.push(order)
//         }
        
//         loading.value = false
//       }, 1000)
//     } catch (error) {
//       console.error('Error fetching orders:', error)
//       loading.value = false
//     }
//   }
  
  // Filtered orders based on search and filters
  const filteredOrders = computed(() => {
    return orders.value.filter(order => {
      // Search query
      if (searchQuery.value && 
          !order.orderNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) && 
          !order.customer.fullName.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        return false
      }
      
      // Status filter
      if (filters.value.status !== 'all' && order.status !== filters.value.status) {
        return false
      }
      
      // Payment status filter
      if (filters.value.paymentStatus !== 'all' && order.paymentStatus !== filters.value.paymentStatus) {
        return false
      }
      
      // Date range filter
      if (filters.value.dateRange !== 'all') {
        const orderDate = new Date(order.createdAt)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        
        const weekStart = new Date(today)
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        
        const yearStart = new Date(today.getFullYear(), 0, 1)
        
        if (filters.value.dateRange === 'today' && orderDate < today) {
          return false
        }
        
        if (filters.value.dateRange === 'yesterday' && (orderDate < yesterday || orderDate >= today)) {
          return false
        }
        
        if (filters.value.dateRange === 'week' && orderDate < weekStart) {
          return false
        }
        
        if (filters.value.dateRange === 'month' && orderDate < monthStart) {
          return false
        }
        
        if (filters.value.dateRange === 'year' && orderDate < yearStart) {
          return false
        }
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
  
  // Pagination
  const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage.value))
  
  const paginatedOrders = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value
    const endIndex = startIndex + itemsPerPage.value
    return filteredOrders.value.slice(startIndex, endIndex)
  })
  
  const paginationStart = computed(() => {
    if (filteredOrders.value.length === 0) return 0
    return (currentPage.value - 1) * itemsPerPage.value + 1
  })
  
  const paginationEnd = computed(() => {
    if (filteredOrders.value.length === 0) return 0
    return Math.min(currentPage.value * itemsPerPage.value, filteredOrders.value.length)
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
      paymentStatus: 'all',
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
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
  
  // Order actions
  const viewOrder = (order: Order) => {
    selectedOrder.value = order
  }
  
  const closeOrderDetails = () => {
    selectedOrder.value = null
  }
  
  const updateOrderStatus = (order: Order) => {
    orderToUpdate.value = order
    newStatus.value = order.status
    statusNotes.value = ''
    trackingNumber.value = ''
    shippingCarrier.value = 'usps'
    isUpdateStatusModalOpen.value = true
  }
  
  const saveOrderStatus = async () => {
    if (!orderToUpdate.value) return
    
    updating.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const index = orders.value.findIndex(o => o._id === orderToUpdate.value?._id)
      if (index !== -1) {
        // Update order status
        orders.value[index].status = newStatus.value
        
        // Create status history entry
        let notes = statusNotes.value || `Status changed to ${newStatus.value}`
        
        // Add tracking info for shipped status
        if (newStatus.value === 'shipped' && trackingNumber.value) {
          notes += ` | Tracking: ${trackingNumber.value} (${capitalizeFirstLetter(shippingCarrier.value)})`
        }
        
        const statusEvent: StatusHistoryEvent = {
          status: newStatus.value,
          date: new Date().toISOString(),
          notes: notes,
          userId: 'current-user' // In a real app, get this from auth
        }
        
        orders.value[index].statusHistory.unshift(statusEvent)
        orders.value[index].updatedAt = new Date().toISOString()
        
        // If we were viewing this order, update the selected order too
        if (selectedOrder.value && selectedOrder.value._id === orderToUpdate.value._id) {
          selectedOrder.value = { ...orders.value[index] }
        }
      }
      
      isUpdateStatusModalOpen.value = false
      updating.value = false
    } catch (error) {
      console.error('Error updating order status:', error)
      updating.value = false
    }
  }
  
  const printOrder = (order: Order) => {
    // In a real app, this would generate a printable version of the order
    // For this example, we'll just show an alert
    alert(`Printing order ${order.orderNumber}`)
  }
  
  // Export orders function
  const exportOrders = () => {
    // In a real application, this would generate a CSV or Excel file
    // For this example, we'll just show an alert
    alert(`Exporting ${filteredOrders.value.length} orders to CSV`)
  }
  
//   // Lifecycle hooks
//   onMounted(() => {
//     fetchOrders()
//   })
  
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
  </style>