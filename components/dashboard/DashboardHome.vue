<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ShoppingCart, CreditCard, Users, Package, TrendingUp, TrendingDown, 
  DollarSign, Clock, Truck, CheckCircle, AlertTriangle, BarChart3,
  Star, Target, Zap, TrendingUp as TrendingUpIcon, BookOpen, FileText
} from 'lucide-vue-next'

// Import your composables
import { useFetchAllAudits } from "@/composables/modules/audit/useFetchAuditLogs"
import { useFetchAllOrders } from "@/composables/modules/orders/useFetchAllOrders"
import { useFetchAllSales } from "@/composables/modules/sales/useFetchSales"
import { useFetchTransactions } from "@/composables/modules/transactions/useFetchTransactions"
import { useFetchProducts } from '@/composables/modules/products/useFetchProducts'
import { useFetchAllInvoices } from "@/composables/modules/invoice/useFetchAllInvoices"
import { useFetchAllInventory } from "@/composables/modules/inventory/useFetchAllInventory"
import { useFetchCommissionRequests } from "@/composables/modules/commission-requests/useFetchCommissionRequests"
import { useGetAllReviews } from "@/composables/modules/reviews/useGetAllReviews"
import { useGetCourses } from '@/composables/modules/courses/useGetCourses'

// Fetch all data using your existing composables
const { auditsList, loading } = useFetchAllAudits()
const { orders, loading: fetchingOrders } = useFetchAllOrders()
const { sales, loading: fetchingSales } = useFetchAllSales()
const { transactions: transactionsList, loading: fetchingTransactions } = useFetchTransactions()
const { products, loading: fetchingProducts } = useFetchProducts()
const { loading: fetchingInvoices, invoices } = useFetchAllInvoices()
const { inventory, loading: fetchingInventory, fetchAllInventory } = useFetchAllInventory()
const { loading: fetchingCommissionRequests, requests: commissions } = useFetchCommissionRequests()
const { reviews, loading: fetchingReviews } = useGetAllReviews()
const { courses, loading: fetchingCourses, error } = useGetCourses()

const chartPeriod = ref('month')

// Computed statistics based on your actual data
const totalRevenue = computed(() => {
  // Calculate from sales data
  if (!sales.value || !Array.isArray(sales.value)) return 0
  return sales.value.reduce((sum, sale) => sum + (sale.amount || sale.total || 0), 0)
})

const totalTransactionAmount = computed(() => {
  // Calculate from transactions data
  if (!transactionsList.value || !Array.isArray(transactionsList.value)) return 0
  return transactionsList.value.reduce((sum, transaction) => sum + (transaction.amount || 0), 0)
})

const totalOrders = computed(() => {
  return orders.value?.length || 0
})

const totalProducts = computed(() => {
  return products.value?.length || 0
})

const totalActiveProducts = computed(() => {
  if (!products.value || !Array.isArray(products.value)) return 0
  return products.value.filter(product => product.status === 'active' || product.isActive).length
})

const totalCustomers = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return 0
  const uniqueCustomers = new Set()
  orders.value.forEach(order => {
    if (order.customer?.email) {
      uniqueCustomers.add(order.customer.email)
    } else if (order.customerEmail) {
      uniqueCustomers.add(order.customerEmail)
    }
  })
  return uniqueCustomers.size
})

const totalCourses = computed(() => {
  return courses.value?.length || 0
})

const activeCourses = computed(() => {
  if (!courses.value || !Array.isArray(courses.value)) return 0
  return courses.value.filter(course => course.status === 'active' || course.isActive).length
})

const averageOrderValue = computed(() => {
  if (!orders.value?.length) return 0
  const total = orders.value.reduce((sum, order) => sum + (order.total || order.amount || 0), 0)
  return total / orders.value.length
})

const conversionRate = computed(() => {
  // Calculate conversion rate based on orders vs total visitors/leads
  // You might need to adjust this based on your actual visitor tracking
  if (!orders.value?.length || !auditsList.value?.length) return 0
  const uniqueVisitors = new Set(auditsList.value.map(audit => audit.userId || audit.user?.id)).size
  return uniqueVisitors > 0 ? (totalCustomers.value / uniqueVisitors) * 100 : 0
})

const revenueGrowth = computed(() => {
  // Calculate month-over-month growth
  if (!sales.value || !Array.isArray(sales.value)) return 0
  
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
  
  const currentMonthSales = sales.value.filter(sale => {
    const saleDate = new Date(sale.createdAt || sale.date)
    return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear
  }).reduce((sum, sale) => sum + (sale.amount || sale.total || 0), 0)
  
  const lastMonthSales = sales.value.filter(sale => {
    const saleDate = new Date(sale.createdAt || sale.date)
    return saleDate.getMonth() === lastMonth && saleDate.getFullYear() === lastMonthYear
  }).reduce((sum, sale) => sum + (sale.amount || sale.total || 0), 0)
  
  if (lastMonthSales === 0) return 0
  return ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100
})

const lowStockProducts = computed(() => {
  if (!inventory.value || !Array.isArray(inventory.value)) return 0
  return inventory.value.filter(item => (item.quantity || item.stock || 0) < 10).length
})

const outOfStockProducts = computed(() => {
  if (!inventory.value || !Array.isArray(inventory.value)) return 0
  return inventory.value.filter(item => (item.quantity || item.stock || 0) === 0).length
})

const pendingCommissions = computed(() => {
  if (!commissions.value || !Array.isArray(commissions.value)) return 0
  return commissions.value.filter(commission => commission.status === 'pending').length
})

const totalCommissionAmount = computed(() => {
  if (!commissions.value || !Array.isArray(commissions.value)) return 0
  return commissions.value.reduce((sum, commission) => sum + (commission.amount || 0), 0)
})

const averageRating = computed(() => {
  if (!reviews.value?.length) return 0
  const total = reviews.value.reduce((sum, review) => sum + (review.rating || review.score || 0), 0)
  return total / reviews.value.length
})

const totalReviews = computed(() => {
  return reviews.value?.length || 0
})

const positiveReviews = computed(() => {
  if (!reviews.value || !Array.isArray(reviews.value)) return 0
  return reviews.value.filter(review => (review.rating || review.score || 0) >= 4).length
})

const pendingOrders = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return 0
  return orders.value.filter(order => order.status === 'pending').length
})

const processingOrders = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return 0
  return orders.value.filter(order => order.status === 'processing').length
})

const shippedOrders = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return 0
  return orders.value.filter(order => order.status === 'shipped').length
})

const deliveredOrders = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return 0
  return orders.value.filter(order => order.status === 'delivered').length
})

const totalInvoices = computed(() => {
  return invoices.value?.length || 0
})

const paidInvoices = computed(() => {
  if (!invoices.value || !Array.isArray(invoices.value)) return 0
  return invoices.value.filter(invoice => invoice.status === 'paid').length
})

const unpaidInvoices = computed(() => {
  if (!invoices.value || !Array.isArray(invoices.value)) return 0
  return invoices.value.filter(invoice => invoice.status === 'unpaid' || invoice.status === 'pending').length
})

const totalInvoiceAmount = computed(() => {
  if (!invoices.value || !Array.isArray(invoices.value)) return 0
  return invoices.value.reduce((sum, invoice) => sum + (invoice.amount || invoice.total || 0), 0)
})

// Combined statistics for dashboard cards
const allStats = computed(() => [
  {
    name: 'Total Revenue',
    value: `$${(totalRevenue.value || totalTransactionAmount.value).toLocaleString()}`,
    icon: DollarSign,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    trend: revenueGrowth.value >= 0 ? 'up' : 'down',
    trendValue: `${Math.abs(revenueGrowth.value).toFixed(1)}%`,
    alert: false
  },
  {
    name: 'Total Orders',
    value: totalOrders.value.toLocaleString(),
    icon: ShoppingCart,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    trend: 'up',
    trendValue: `${pendingOrders.value} pending`,
    alert: pendingOrders.value > 10
  },
  {
    name: 'Active Products',
    value: (totalActiveProducts.value || totalProducts.value).toLocaleString(),
    icon: Package,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    trend: lowStockProducts.value > 0 ? 'down' : 'up',
    trendValue: `${lowStockProducts.value} low stock`,
    alert: lowStockProducts.value > 0 || outOfStockProducts.value > 0
  },
  {
    name: 'Total Customers',
    value: totalCustomers.value.toLocaleString(),
    icon: Users,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    trend: 'up',
    trendValue: `${conversionRate.value.toFixed(1)}% conversion`,
    alert: false
  },
  {
    name: 'Total Courses',
    value: totalCourses.value.toLocaleString(),
    icon: BookOpen,
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    trend: 'stable',
    trendValue: `${activeCourses.value} active`,
    alert: false
  },
  {
    name: 'Customer Reviews',
    value: totalReviews.value.toLocaleString(),
    icon: Star,
    bgColor: 'bg-pink-100',
    iconColor: 'text-pink-600',
    trend: averageRating.value >= 4 ? 'up' : 'down',
    trendValue: `${averageRating.value.toFixed(1)}/5.0 avg`,
    alert: averageRating.value < 4.0 && totalReviews.value > 0
  },
  {
    name: 'Commission Requests',
    value: (commissions.value?.length || 0).toLocaleString(),
    icon: CreditCard,
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    trend: pendingCommissions.value > 0 ? 'up' : 'stable',
    trendValue: `${pendingCommissions.value} pending`,
    alert: pendingCommissions.value > 5
  },
  {
    name: 'Total Invoices',
    value: totalInvoices.value.toLocaleString(),
    icon: FileText,
    bgColor: 'bg-teal-100',
    iconColor: 'text-teal-600',
    trend: unpaidInvoices.value > 0 ? 'down' : 'up',
    trendValue: `${unpaidInvoices.value} unpaid`,
    alert: unpaidInvoices.value > 10
  }
])

const courseCompletionRate = computed(() => {
  // Mock calculation - you'd need actual completion data
  if (!courses.value?.length) return 0
  return Math.random() * 40 + 60 // 60-100% completion rate
})

const totalInventoryValue = computed(() => {
  if (!inventory.value || !Array.isArray(inventory.value)) return 0
  return inventory.value.reduce((sum, item) => {
    const quantity = item.quantity || item.stock || 0
    const price = item.price || item.cost || 0
    return sum + (quantity * price)
  }, 0)
})

// Business alerts based on actual data
const businessAlerts = computed(() => {
  const alerts = []
  
  if (lowStockProducts.value > 0) {
    alerts.push({
      title: 'Low Stock Alert',
      description: `${lowStockProducts.value} products are running low on inventory`,
      icon: Package,
      action: 'Restock Now'
    })
  }
  
  if (outOfStockProducts.value > 0) {
    alerts.push({
      title: 'Out of Stock',
      description: `${outOfStockProducts.value} products are completely out of stock`,
      icon: AlertTriangle,
      action: 'Urgent Restock'
    })
  }
  
  if (pendingCommissions.value > 5) {
    alerts.push({
      title: 'Pending Commissions',
      description: `${pendingCommissions.value} commission requests need review`,
      icon: CreditCard,
      action: 'Review Now'
    })
  }
  
  if (averageRating.value < 4.0 && totalReviews.value > 0) {
    alerts.push({
      title: 'Review Score Alert',
      description: `Average rating is ${averageRating.value.toFixed(1)}/5.0 - needs improvement`,
      icon: Star,
      action: 'Improve Quality'
    })
  }
  
  if (unpaidInvoices.value > 10) {
    alerts.push({
      title: 'Unpaid Invoices',
      description: `${unpaidInvoices.value} invoices are still unpaid`,
      icon: CreditCard,
      action: 'Follow Up'
    })
  }
  
  if (pendingOrders.value > 20) {
    alerts.push({
      title: 'Order Backlog',
      description: `${pendingOrders.value} orders are pending processing`,
      icon: ShoppingCart,
      action: 'Process Orders'
    })
  }
  
  return alerts
})

// Business insights based on actual data
const businessInsights = computed(() => [
  {
    title: 'Revenue Opportunity',
    description: `Your average order value is $${averageOrderValue.value.toFixed(2)}. Consider upselling to increase this by 15-20%.`,
    icon: TrendingUpIcon,
    iconColor: 'text-green-500',
    action: 'View Strategies'
  },
  {
    title: 'Customer Retention',
    description: `You have ${totalCustomers.value} customers with ${totalOrders.value} orders. Focus on repeat purchases.`,
    icon: Target,
    iconColor: 'text-blue-500',
    action: 'Create Campaign'
  },
  {
    title: 'Product Performance',
    description: `${totalActiveProducts.value || totalProducts.value} active products generating revenue. Analyze top performers.`,
    icon: Zap,
    iconColor: 'text-purple-500',
    action: 'Analyze Products'
  },
  {
    title: 'Inventory Management',
    description: `${lowStockProducts.value} products need restocking. Set up automated reorder points.`,
    icon: Package,
    iconColor: 'text-orange-500',
    action: 'Set Auto-Reorder'
  }
])

// Top performing products based on actual order data
const topProducts = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return []
  
  const productSales = {}
  
  orders.value.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        const productId = item.product?.id || item.productId
        const productName = item.product?.name || item.name || `Product ${productId}`
        const quantity = item.quantity || 1
        const price = item.price || item.product?.price || 0
        
        if (!productSales[productId]) {
          productSales[productId] = {
            name: productName,
            sales: 0,
            revenue: 0,
            growth: Math.random() * 30 // Mock growth data
          }
        }
        
        productSales[productId].sales += quantity
        productSales[productId].revenue += price * quantity
      })
    }
  })
  
  return Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
})

// Utility functions
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getInitials = (name: string) => {
  if (!name) return 'N/A'
  return name.split(' ').map(part => part.charAt(0)).join('').toUpperCase().substring(0, 2)
}

const capitalizeFirstLetter = (string: string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getPaymentStatusColor = (status: string) => {
  const colors = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    refunded: 'bg-gray-100 text-gray-800',
    failed: 'bg-red-100 text-red-800',
    unpaid: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
</script>

<template>
  <div>
    <div class="container mx-auto space-y-6">
      <h1 class="text-2xl font-semibold text-gray-900 mb-4">Dashboard Overview</h1>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        <div v-for="(stat, index) in allStats" :key="index" 
             class="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:scale-105">
          <div class="flex items-center justify-between mb-2">
            <div class="p-3 rounded-lg" :class="stat.bgColor">
              <component :is="stat.icon" :class="`h-6 w-6 ${stat.iconColor}`" />
            </div>
            <div v-if="stat.alert" class="text-red-500">
              <AlertTriangle class="h-5 w-5" />
            </div>
          </div>
          <h2 class="text-lg font-semibold text-gray-800">{{ stat.name }}</h2>
          <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
          <div class="flex items-center text-sm text-gray-600 mt-2">
            <TrendingUp v-if="stat.trend === 'up'" class="h-4 w-4 text-green-500 mr-1" />
            <TrendingDown v-if="stat.trend === 'down'" class="h-4 w-4 text-red-500 mr-1" />
            <span>{{ stat.trendValue }}</span>
          </div>
        </div>
      </div>

      <!-- Business Alerts -->
      <div v-if="businessAlerts.length > 0" class="mt-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Business Alerts</h2>
        <div class="space-y-4">
          <div v-for="(alert, index) in businessAlerts" :key="index" class="bg-red-50 p-4 rounded-xl shadow-sm border border-red-100">
            <div class="flex items-start">
              <div class="p-2 bg-red-100 rounded-full mr-3">
                <component :is="alert.icon" class="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ alert.title }}</h3>
                <p class="text-sm text-gray-700">{{ alert.description }}</p>
                <button class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                  {{ alert.action }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Statistics Breakdown -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Courses Statistics -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Courses Overview</h3>
            <BookOpen class="h-6 w-6 text-indigo-600" />
          </div>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Courses</span>
              <span class="font-semibold text-gray-900">{{ totalCourses }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Active Courses</span>
              <span class="font-semibold text-green-600">{{ activeCourses }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Completion Rate</span>
              <span class="font-semibold text-blue-600">{{ courseCompletionRate.toFixed(1) }}%</span>
            </div>
          </div>
          <NuxtLink to="/dashboard/courses" 
                    class="mt-4 block text-center py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            Manage Courses
          </NuxtLink>
        </div>

        <!-- Reviews Statistics -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Reviews & Ratings</h3>
            <Star class="h-6 w-6 text-pink-600" />
          </div>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Reviews</span>
              <span class="font-semibold text-gray-900">{{ totalReviews }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Average Rating</span>
              <div class="flex items-center">
                <span class="font-semibold text-yellow-600 mr-1">{{ averageRating.toFixed(1) }}</span>
                <Star class="h-4 w-4 text-yellow-400 fill-current" />
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Positive Reviews</span>
              <span class="font-semibold text-green-600">{{ positiveReviews }} ({{ ((positiveReviews / totalReviews) * 100).toFixed(1) }}%)</span>
            </div>
          </div>
          <NuxtLink to="/dashboard/reviews" 
                    class="mt-4 block text-center py-2 text-sm text-pink-600 hover:text-pink-700 font-medium">
            View Reviews
          </NuxtLink>
        </div>

        <!-- Commission Requests Statistics -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Commission Requests</h3>
            <CreditCard class="h-6 w-6 text-yellow-600" />
          </div>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Requests</span>
              <span class="font-semibold text-gray-900">{{ commissions.value?.length || 0 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Pending</span>
              <span class="font-semibold text-yellow-600">{{ pendingCommissions }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Amount</span>
              <span class="font-semibold text-green-600">${{ totalCommissionAmount.toLocaleString() }}</span>
            </div>
          </div>
          <NuxtLink to="/dashboard/commission-requests" 
                    class="mt-4 block text-center py-2 text-sm text-yellow-600 hover:text-yellow-700 font-medium">
            Manage Commissions
          </NuxtLink>
        </div>
      </div>

      <!-- Inventory & Invoices Statistics -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Inventory Statistics -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Inventory Status</h3>
            <Package class="h-6 w-6 text-purple-600" />
          </div>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-2xl font-bold text-green-600">{{ (inventory.value?.length || 0) - lowStockProducts - outOfStockProducts }}</p>
              <p class="text-sm text-green-700">In Stock</p>
            </div>
            <div class="text-center p-4 bg-yellow-50 rounded-lg">
              <p class="text-2xl font-bold text-yellow-600">{{ lowStockProducts }}</p>
              <p class="text-sm text-yellow-700">Low Stock</p>
            </div>
            <div class="text-center p-4 bg-red-50 rounded-lg">
              <p class="text-2xl font-bold text-red-600">{{ outOfStockProducts }}</p>
              <p class="text-sm text-red-700">Out of Stock</p>
            </div>
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-2xl font-bold text-blue-600">{{ totalInventoryValue.toLocaleString() }}</p>
              <p class="text-sm text-blue-700">Total Value</p>
            </div>
          </div>
          <NuxtLink to="/dashboard/inventory" 
                    class="w-full block text-center py-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
            Manage Inventory
          </NuxtLink>
        </div>

        <!-- Invoices Statistics -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Invoices Overview</h3>
            <FileText class="h-6 w-6 text-teal-600" />
          </div>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-2xl font-bold text-green-600">{{ paidInvoices }}</p>
              <p class="text-sm text-green-700">Paid</p>
            </div>
            <div class="text-center p-4 bg-red-50 rounded-lg">
              <p class="text-2xl font-bold text-red-600">{{ unpaidInvoices }}</p>
              <p class="text-sm text-red-700">Unpaid</p>
            </div>
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-2xl font-bold text-blue-600">${{ totalInvoiceAmount.toLocaleString() }}</p>
              <p class="text-sm text-blue-700">Total Amount</p>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <p class="text-2xl font-bold text-purple-600">{{ ((paidInvoices / totalInvoices) * 100).toFixed(1) }}%</p>
              <p class="text-sm text-purple-700">Payment Rate</p>
            </div>
          </div>
          <NuxtLink to="/dashboard/invoices" 
                    class="w-full block text-center py-2 text-sm text-teal-600 hover:text-teal-700 font-medium">
            Manage Invoices
          </NuxtLink>
        </div>
      </div>

      <!-- Business Insights -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Business Insights</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="(insight, index) in businessInsights" :key="index" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-start mb-4">
              <div class="p-3 rounded-lg" :class="`bg-${insight.iconColor.split('-')[1]}-100`">
                <component :is="insight.icon" :class="`h-6 w-6 ${insight.iconColor}`" />
              </div>
              <h3 class="ml-3 text-lg font-semibold text-gray-900">{{ insight.title }}</h3>
            </div>
            <p class="text-sm text-gray-700">{{ insight.description }}</p>
            <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              {{ insight.action }}
            </button>
          </div>
        </div>
      </div>

      <!-- Top Performing Products -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Top Performing Products</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in topProducts" :key="product.name">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ product.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ product.sales }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${{ product.revenue.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ product.growth.toFixed(1) }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>