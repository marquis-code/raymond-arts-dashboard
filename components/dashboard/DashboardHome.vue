<template>
    <div class="space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(stat, index) in stats" :key="index" 
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
            <span class="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
      </div>
  
      <!-- Recent Activity and Sales Chart -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Sales Chart -->
        <div class="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Sales Overview</h2>
            <div class="flex space-x-2">
              <button 
                v-for="period in ['Week', 'Month', 'Year']" 
                :key="period"
                @click="chartPeriod = period.toLowerCase()"
                class="px-3 py-1 text-sm rounded-md transition-colors"
                :class="chartPeriod === period.toLowerCase() 
                  ? 'bg-violet-100 text-violet-700' 
                  : 'text-gray-600 hover:bg-gray-100'"
              >
                {{ period }}
              </button>
            </div>
          </div>
          <div class="h-64 flex items-center justify-center">
            <div class="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
              <p class="text-gray-400">Sales Chart Visualization</p>
            </div>
          </div>
        </div>
  
        <!-- Recent Activity -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div class="space-y-4">
            <div v-for="(activity, index) in recentActivities" :key="index" class="flex">
              <div class="mr-4 flex-shrink-0">
                <div class="h-8 w-8 rounded-full flex items-center justify-center" :class="activity.bgColor">
                  <component :is="activity.icon" class="h-4 w-4" :class="activity.iconColor" />
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-xs text-gray-500">{{ activity.time }}</p>
              </div>
            </div>
          </div>
          <button class="mt-6 w-full py-2 text-sm text-violet-600 hover:text-violet-700 font-medium">
            View All Activity
          </button>
        </div>
      </div>
  
      <!-- Recent Orders -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <button class="text-sm text-violet-600 hover:text-violet-700 font-medium">
            View All
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(order, index) in recentOrders" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ order.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.customer }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.product }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.date }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${{ order.amount }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="{
                      'bg-green-100 text-green-800': order.status === 'Completed',
                      'bg-yellow-100 text-yellow-800': order.status === 'Processing',
                      'bg-blue-100 text-blue-800': order.status === 'Shipped'
                    }">
                    {{ order.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { 
    ShoppingCart, CreditCard, Users, Package, 
    TrendingUp, TrendingDown, DollarSign, Clock, Truck, CheckCircle
  } from 'lucide-vue-next'
  
  const chartPeriod = ref('month')
  
  // Stats data
  const stats = [
    { 
      name: 'Total Sales', 
      value: '$12,426', 
      trend: 'up', 
      trendValue: '12%', 
      icon: DollarSign, 
      bgColor: 'bg-violet-100', 
      iconColor: 'text-violet-600' 
    },
    { 
      name: 'Total Orders', 
      value: '142', 
      trend: 'up', 
      trendValue: '8%', 
      icon: ShoppingCart, 
      bgColor: 'bg-blue-100', 
      iconColor: 'text-blue-600' 
    },
    { 
      name: 'New Customers', 
      value: '38', 
      trend: 'down', 
      trendValue: '3%', 
      icon: Users, 
      bgColor: 'bg-green-100', 
      iconColor: 'text-green-600' 
    },
    { 
      name: 'Products Sold', 
      value: '96', 
      trend: 'up', 
      trendValue: '14%', 
      icon: Package, 
      bgColor: 'bg-amber-100', 
      iconColor: 'text-amber-600' 
    }
  ]
  
  // Recent activities
  const recentActivities = [
    { 
      title: 'New order #1089 from John Doe', 
      time: '2 hours ago', 
      icon: ShoppingCart, 
      bgColor: 'bg-blue-100', 
      iconColor: 'text-blue-600' 
    },
    { 
      title: 'Payment received for order #1088', 
      time: '3 hours ago', 
      icon: CreditCard, 
      bgColor: 'bg-green-100', 
      iconColor: 'text-green-600' 
    },
    { 
      title: 'Order #1087 has been shipped', 
      time: '5 hours ago', 
      icon: Truck, 
      bgColor: 'bg-amber-100', 
      iconColor: 'text-amber-600' 
    },
    { 
      title: 'New customer registration', 
      time: '1 day ago', 
      icon: Users, 
      bgColor: 'bg-violet-100', 
      iconColor: 'text-violet-600' 
    },
    { 
      title: 'Order #1086 has been completed', 
      time: '1 day ago', 
      icon: CheckCircle, 
      bgColor: 'bg-green-100', 
      iconColor: 'text-green-600' 
    }
  ]
  
  // Recent orders
  const recentOrders = [
    { 
      id: '1089', 
      customer: 'John Doe', 
      product: 'Abstract Painting - Large', 
      date: 'Apr 2, 2025', 
      amount: '350.00', 
      status: 'Processing' 
    },
    { 
      id: '1088', 
      customer: 'Sarah Smith', 
      product: 'Landscape Print - Medium', 
      date: 'Apr 1, 2025', 
      amount: '125.00', 
      status: 'Completed' 
    },
    { 
      id: '1087', 
      customer: 'Michael Johnson', 
      product: 'Portrait Commission', 
      date: 'Mar 30, 2025', 
      amount: '500.00', 
      status: 'Shipped' 
    },
    { 
      id: '1086', 
      customer: 'Emily Williams', 
      product: 'Digital Art Print - Small', 
      date: 'Mar 29, 2025', 
      amount: '75.00', 
      status: 'Completed' 
    },
    { 
      id: '1085', 
      customer: 'Robert Brown', 
      product: 'Abstract Sculpture', 
      date: 'Mar 28, 2025', 
      amount: '450.00', 
      status: 'Processing' 
    }
  ]
  </script>