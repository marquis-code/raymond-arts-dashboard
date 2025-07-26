<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="animate-fade-in">
        <h1 class="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
        <p class="text-gray-500 mt-1">Track revenue, analyze trends, and monitor performance</p>
      </div>
      <div class="flex flex-wrap gap-3 animate-slide-in-right">
        <div class="relative">
          <select 
            v-model="timeRange" 
            class="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
        <button 
          @click="exportSalesData" 
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300"
        >
          <Download class="h-4 w-4 mr-2" />
          Export
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <template v-if="fetchingStatistics">
        <div v-for="i in 4" :key="i" class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-gray-200"></div>
            <div class="ml-4 w-full">
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div class="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/3 ml-2"></div>
          </div>
        </div>
      </template>
      <template v-else-if="statistics">
        <!-- Total Sales Card -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 animate-fade-in">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-violet-100">
              <ShoppingCart class="h-6 w-6 text-violet-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Sales</p>
              <p class="text-2xl font-semibold text-gray-900">{{ statistics?.sales?.total }}</p>
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span class="text-green-600 text-sm font-medium flex items-center">
              <TrendingUp class="h-4 w-4 mr-1" />
              {{ statistics?.sales?.week }} this week
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
              <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(statistics?.amount?.total) }}</p>
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span class="text-green-600 text-sm font-medium flex items-center">
              <TrendingUp class="h-4 w-4 mr-1" />
              {{ formatCurrency(statistics?.amount?.week) }} this week
            </span>
          </div>
        </div>

        <!-- Monthly Sales Card -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 animate-fade-in" style="animation-delay: 200ms;">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100">
              <CalendarDays class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Monthly Sales</p>
              <p class="text-2xl font-semibold text-gray-900">{{ statistics?.sales?.month }}</p>
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span class="text-green-600 text-sm font-medium flex items-center">
              <TrendingUp class="h-4 w-4 mr-1" />
              {{ formatCurrency(statistics?.amount?.month) }} revenue
            </span>
          </div>
        </div>

        <!-- Average Order Value Card -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 animate-fade-in" style="animation-delay: 300ms;">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-amber-100">
              <CreditCard class="h-6 w-6 text-amber-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Avg. Order Value</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ statistics?.sales?.total ? formatCurrency(statistics?.amount?.total / statistics?.sales?.total) : formatCurrency(0) }}
              </p>
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span class="text-sm font-medium text-gray-500">
              Based on {{ statistics?.sales?.total }} orders
            </span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="col-span-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center py-10 animate-fade-in">
          <AlertCircle class="h-12 w-12 text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-1">No Statistics Available</h3>
          <p class="text-gray-500 text-center max-w-md">We couldn't load your sales statistics at this time. Please try again later.</p>
        </div>
      </template>
    </div>

    <!-- Recent Sales Section -->
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900">Recent Sales</h2>
        <div class="mt-3 sm:mt-0">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search sales..." 
            class="pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="fetchingSales" class="animate-pulse">
        <div class="h-12 bg-gray-200 rounded mb-4"></div>
        <div v-for="i in 5" :key="i" class="h-16 bg-gray-200 rounded mb-3"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!sales || sales.length === 0" class="flex flex-col items-center justify-center py-12 animate-fade-in">
        <ShoppingBag class="h-16 w-16 text-gray-300 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-1">No Sales Yet</h3>
        <p class="text-gray-500 text-center max-w-md">When you make your first sale, it will appear here.</p>
      </div>

      <!-- Sales Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="sale in filteredSales" :key="sale._id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-violet-600">{{ sale.order.orderNumber }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8 bg-violet-100 rounded-full flex items-center justify-center">
                    <span class="text-violet-800 font-medium text-sm">{{ getInitials(sale?.customer?.fullName || `${sale?.customer?.firstName} ${sale?.customer?.lastName}`) }}</span>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ sale?.customer?.fullName || `${sale?.customer?.firstName} ${sale?.customer?.lastName}` }}</div>
                    <div class="text-xs text-gray-500">{{ sale?.customer?.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <div v-for="(product, index) in sale.products" :key="index" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {{ truncateText(product?.name, 15) }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ formatCurrency(sale?.amount) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ formatDate(sale?.date) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="viewSaleDetails(sale)" class="text-violet-600 hover:text-violet-900 mr-3 transition-colors duration-200">
                  <Eye class="h-4 w-4" />
                </button>
                <button @click="downloadInvoice(sale)" class="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  <FileText class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Top Products and Top Customers Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Products Section -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-fade-in">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Top Selling Products</h2>
        
        <!-- Loading State -->
        <div v-if="fetchingTopProducts" class="animate-pulse">
          <div v-for="i in 3" :key="i" class="flex items-center mb-4">
            <div class="h-12 w-12 bg-gray-200 rounded-md mr-3"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div class="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="!products || products.length === 0" class="flex flex-col items-center justify-center py-8 animate-fade-in">
          <Package class="h-12 w-12 text-gray-300 mb-3" />
          <h3 class="text-base font-medium text-gray-900 mb-1">No Products Data</h3>
          <p class="text-sm text-gray-500 text-center">Product sales data will appear here once available.</p>
        </div>
        
        <!-- Products List -->
        <div v-else class="space-y-4">
          <div v-for="product in products" :key="product.product._id" class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <div class="h-12 w-12 flex-shrink-0 rounded-md overflow-hidden">
              <img 
                v-if="product.product.images && product.product.images.length > 0" 
                :src="product.product.images[0]" 
                :alt="product.product.name" 
                class="h-full w-full object-cover"
              />
              <div v-else class="h-full w-full bg-gray-200 flex items-center justify-center">
                <Image class="h-6 w-6 text-gray-400" />
              </div>
            </div>
            <div class="ml-4 flex-1">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ product.product.name }}</p>
                  <p class="text-xs text-gray-500">{{ formatCurrency(product.product.price) }} · {{ product.count }} sold</p>
                </div>
                <div class="mt-1 sm:mt-0">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {{ formatCurrency(product.product.price * product.count) }}
                  </span>
                </div>
              </div>
              <div class="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div class="bg-violet-600 h-1.5 rounded-full" :style="{ width: `${Math.min(100, (product.count / maxProductCount) * 100)}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Customers Section -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-fade-in">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Top Customers</h2>
        
        <!-- Loading State -->
        <div v-if="fetchingTopCustomers" class="animate-pulse">
          <div v-for="i in 3" :key="i" class="flex items-center mb-4">
            <div class="h-12 w-12 bg-gray-200 rounded-full mr-3"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div class="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="!customers || customers.length === 0" class="flex flex-col items-center justify-center py-8 animate-fade-in">
          <Users class="h-12 w-12 text-gray-300 mb-3" />
          <h3 class="text-base font-medium text-gray-900 mb-1">No Customer Data</h3>
          <p class="text-sm text-gray-500 text-center">Customer data will appear here once available.</p>
        </div>
        
        <!-- Customers List -->
        <div v-else class="space-y-4">
          <div v-for="(customer, index) in customers" :key="customer.customer._id" class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <div class="h-12 w-12 flex-shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-green-700 flex items-center justify-center text-white font-medium">
              {{ getInitials(`${customer.customer.firstName} ${customer.customer.lastName}`) }}
            </div>
            <div class="ml-4 flex-1">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ customer.customer.firstName }} {{ customer.customer.lastName }}</p>
                  <p class="text-xs text-gray-500">{{ customer.customer.email }} · {{ customer.count }} orders</p>
                </div>
                <div class="mt-1 sm:mt-0">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                    {{ formatCurrency(customer.totalAmount) }}
                  </span>
                </div>
              </div>
              <div class="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div class="bg-violet-600 h-1.5 rounded-full" :style="{ width: `${Math.min(100, (customer.totalAmount / maxCustomerAmount) * 100)}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sale Details Modal -->
    <Transition name="modal">
      <div v-if="selectedSale" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="selectedSale = null">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-scale-in">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <span>Sale Details</span>
                    <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {{ formatCurrency(selectedSale.amount) }}
                    </span>
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div class="border-b pb-4">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Order Number:</span>
                        <span class="text-sm font-medium text-gray-900">{{ selectedSale.order.orderNumber }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Date:</span>
                        <span class="text-sm font-medium text-gray-900">{{ formatDate(selectedSale.date) }}</span>
                      </div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Customer:</span>
                        <span class="text-sm font-medium text-gray-900">
                          {{ selectedSale.customer.fullName || `${selectedSale.customer.firstName} ${selectedSale.customer.lastName}` }}
                        </span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">Email:</span>
                        <span class="text-sm font-medium text-gray-900">{{ selectedSale.customer.email }}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 class="text-sm font-medium text-gray-900 mb-2">Products</h4>
                      <div v-for="(product, index) in selectedSale.products" :key="index" class="flex justify-between py-2 border-b border-gray-100">
                        <div class="flex items-center">
                          <div class="h-8 w-8 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                            <img 
                              v-if="product.images && product.images.length > 0" 
                              :src="product.images[0]" 
                              :alt="product.name" 
                              class="h-8 w-8 object-cover" 
                            />
                            <div v-else class="h-full w-full flex items-center justify-center">
                              <Package class="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          <div class="ml-3">
                            <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                          </div>
                        </div>
                        <p class="text-sm font-medium text-gray-900">{{ formatCurrency(product.price) }}</p>
                      </div>
                    </div>
                    
                    <div v-if="selectedSale.notes" class="pt-2">
                      <h4 class="text-sm font-medium text-gray-900 mb-1">Notes</h4>
                      <p class="text-sm text-gray-700">{{ selectedSale.notes }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="downloadInvoice(selectedSale)" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200">
                Download Invoice
              </button>
              <button @click="selectedSale = null" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200">
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
import { ref, computed, onMounted } from 'vue'
import { useFetchAllSales } from "@/composables/modules/sales/useFetchSales"
import { useSalesStatistics } from "@/composables/modules/sales/useFetchSalesStatistics"
import { useTopCustomers } from "@/composables/modules/sales/useFetchTopCustomers"
import { useTopProducts } from "@/composables/modules/sales/useFetchTopProducts"
import { 
  ChevronDown, Download, DollarSign, ShoppingCart, 
  Users, CreditCard, TrendingUp, TrendingDown,
  Eye, FileText, AlertCircle, Package, Image,
  ShoppingBag, CalendarDays
} from 'lucide-vue-next'

// Fetch data from composables
const { sales, loading: fetchingSales } = useFetchAllSales()
const { statistics, loading: fetchingStatistics } = useSalesStatistics()
const { customers, loading: fetchingTopCustomers } = useTopCustomers()
const { products, loading: fetchingTopProducts } = useTopProducts()

// UI state
const timeRange = ref('30days')
const searchQuery = ref('')
const selectedSale = ref(null)

// Computed properties
const filteredSales = computed(() => {
  if (!sales.value || !Array.isArray(sales.value)) return []
  
  if (!searchQuery.value) return sales.value
  
  const query = searchQuery.value.toLowerCase()
  return sales.value.filter(sale => 
    sale.order.orderNumber.toLowerCase().includes(query) ||
    `${sale.customer.firstName} ${sale.customer.lastName}`.toLowerCase().includes(query) ||
    sale.customer.email.toLowerCase().includes(query)
  )
})

const maxProductCount = computed(() => {
  if (!products.value || !Array.isArray(products.value) || products.value.length === 0) return 1
  return Math.max(...products.value.map(p => p.count))
})

const maxCustomerAmount = computed(() => {
  if (!customers.value || !Array.isArray(customers.value) || customers.value.length === 0) return 1
  return Math.max(...customers.value.map(c => c.totalAmount))
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

const getInitials = (name) => {
  if (!name) return 'N/A'
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

// Action functions
const viewSaleDetails = (sale) => {
  selectedSale.value = sale
}

const downloadInvoice = (sale) => {
  // In a real application, this would generate a PDF invoice
  alert(`Downloading invoice for order ${sale.order.orderNumber}...`)
}

const exportSalesData = () => {
  // In a real application, this would generate a CSV or Excel file
  alert('Exporting sales data...')
}

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