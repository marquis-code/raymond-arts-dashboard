<template>
    <div class="space-y-6">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Sales Management</h1>
          <p class="text-gray-500 mt-1">Track and analyze your artwork sales</p>
        </div>
        <div class="flex gap-3">
          <div class="relative">
            <select v-model="timeRange" class="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
            <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          <button @click="exportSalesData" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            <Download class="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>
  

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(stat, index) in salesStats" :key="index" 
          class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
          <div class="flex items-center">
            <div class="p-3 rounded-full" :class="stat.bgColor">
              <component :is="stat.icon" class="h-6 w-6" :class="stat.iconColor" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">{{ stat.name }}</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stat.value }}</p>
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span :class="stat.trend === 'up' ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium flex items-center">
              <component :is="stat.trend === 'up' ? 'TrendingUp' : 'TrendingDown'" class="h-4 w-4 mr-1" />
              {{ stat.trendValue }}
            </span>
            <span class="text-sm text-gray-500 ml-2">vs previous period</span>
          </div>
        </div>
      </div>
  

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Sales Trend</h2>
          <div class="flex space-x-2">
            <button 
              v-for="period in ['Daily', 'Weekly', 'Monthly']" 
              :key="period"
              @click="chartView = period.toLowerCase()"
              class="px-3 py-1 text-sm rounded-md transition-colors"
              :class="chartView === period.toLowerCase() 
                ? 'bg-violet-100 text-violet-700' 
                : 'text-gray-600 hover:bg-gray-100'"
            >
              {{ period }}
            </button>
          </div>
        </div>
        <div class="h-80 flex items-center justify-center">
          <div class="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
            <p class="text-gray-400">Sales Trend Visualization</p>
          </div>
        </div>
      </div>
  

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Top Selling Artworks</h2>
          <button class="text-sm text-violet-600 hover:text-violet-700 font-medium">
            View All
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artwork</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(product, index) in topSellingProducts" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <img :src="product.image" :alt="product.name" class="h-10 w-10 rounded-md object-cover" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.category }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${{ product.price.toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.unitsSold }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${{ (product.price * product.unitsSold).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Sales by Channel</h2>
          <div class="h-64 flex items-center justify-center">

            <div class="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
              <p class="text-gray-400">Sales by Channel Visualization</p>
            </div>
          </div>
          <div class="mt-6 space-y-4">
            <div v-for="(channel, index) in salesChannels" :key="index" class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: channel.color }"></div>
              <div class="flex-1">
                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-700">{{ channel.name }}</span>
                  <span class="text-sm font-medium text-gray-900">${{ channel.value.toFixed(2) }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div class="h-2 rounded-full" :style="{ width: `${channel.percentage}%`, backgroundColor: channel.color }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
  

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Sales by Category</h2>
          <div class="h-64 flex items-center justify-center">

            <div class="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
              <p class="text-gray-400">Sales by Category Visualization</p>
            </div>
          </div>
          <div class="mt-6 space-y-4">
            <div v-for="(category, index) in salesCategories" :key="index" class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: category.color }"></div>
              <div class="flex-1">
                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-700">{{ category.name }}</span>
                  <span class="text-sm font-medium text-gray-900">${{ category.value.toFixed(2) }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div class="h-2 rounded-full" :style="{ width: `${category.percentage}%`, backgroundColor: category.color }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { 
    ChevronDown, Download, DollarSign, ShoppingCart, 
    Users, CreditCard, TrendingUp, TrendingDown
  } from 'lucide-vue-next'
  
  // Time range filter
  const timeRange = ref('30days')
  const chartView = ref('weekly')
  
  // Sales statistics
  const salesStats = [
    { 
      name: 'Total Revenue', 
      value: '$12,426', 
      trend: 'up', 
      trendValue: '12%', 
      icon: DollarSign, 
      bgColor: 'bg-violet-100', 
      iconColor: 'text-violet-600' 
    },
    { 
      name: 'Orders', 
      value: '142', 
      trend: 'up', 
      trendValue: '8%', 
      icon: ShoppingCart, 
      bgColor: 'bg-blue-100', 
      iconColor: 'text-blue-600' 
    },
    { 
      name: 'Customers', 
      value: '38', 
      trend: 'down', 
      trendValue: '3%', 
      icon: Users, 
      bgColor: 'bg-green-100', 
      iconColor: 'text-green-600' 
    },
    { 
      name: 'Avg. Order Value', 
      value: '$87.50', 
      trend: 'up', 
      trendValue: '5%', 
      icon: CreditCard, 
      bgColor: 'bg-amber-100', 
      iconColor: 'text-amber-600' 
    }
  ]
  
  // Top selling products
  const topSellingProducts = [
    {
      name: 'Abstract Sunset',
      category: 'Painting',
      price: 350,
      unitsSold: 12,
      image: 'https://i.pravatar.cc/300?img=1'
    },
    {
      name: 'Urban Landscape',
      category: 'Photography',
      price: 125,
      unitsSold: 28,
      image: 'https://i.pravatar.cc/300?img=2'
    },
    {
      name: 'Serenity',
      category: 'Sculpture',
      price: 500,
      unitsSold: 5,
      image: 'https://i.pravatar.cc/300?img=3'
    },
    {
      name: 'Digital Dreams',
      category: 'Digital Art',
      price: 75,
      unitsSold: 42,
      image: 'https://i.pravatar.cc/300?img=4'
    },
    {
      name: 'Forest Path',
      category: 'Print',
      price: 45,
      unitsSold: 36,
      image: 'https://i.pravatar.cc/300?img=5'
    }
  ]
  
  // Sales by channel
  const salesChannels = [
    { name: 'Website', value: 6250, percentage: 50, color: '#8b5cf6' },
    { name: 'Gallery', value: 3750, percentage: 30, color: '#3b82f6' },
    { name: 'Art Fairs', value: 1875, percentage: 15, color: '#10b981' },
    { name: 'Commissions', value: 625, percentage: 5, color: '#f59e0b' }
  ]
  
  // Sales by category
  const salesCategories = [
    { name: 'Paintings', value: 5000, percentage: 40, color: '#8b5cf6' },
    { name: 'Prints', value: 3125, percentage: 25, color: '#3b82f6' },
    { name: 'Digital Art', value: 2500, percentage: 20, color: '#10b981' },
    { name: 'Photography', value: 1250, percentage: 10, color: '#f59e0b' },
    { name: 'Sculptures', value: 625, percentage: 5, color: '#ef4444' }
  ]
  
  // Export sales data function
  const exportSalesData = () => {
    // In a real application, this would generate a CSV or Excel file
    alert('Exporting sales data...')
  }

  definePageMeta({
      layout: 'dashboard'
  })
  </script>