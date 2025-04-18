<template>
    <div class="space-y-6">
      <!-- Header with actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Notifications Management</h1>
          <p class="text-gray-500 mt-1">Manage and configure your notification settings</p>
        </div>
        <div class="flex gap-3">
          <button @click="markAllAsRead" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            <CheckSquare class="h-4 w-4 mr-2" />
            Mark All as Read
          </button>
          <button @click="openSettingsModal" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            <Settings class="h-4 w-4 mr-2" />
            Notification Settings
          </button>
        </div>
      </div>
  
      <!-- Notification Filters -->
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="type-filter" class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select id="type-filter" v-model="filters.type" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
              <option value="all">All Types</option>
              <option value="order">Orders</option>
              <option value="payment">Payments</option>
              <option value="inventory">Inventory</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label for="read-status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select id="read-status" v-model="filters.readStatus" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
              <option value="all">All Status</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>
          </div>
          <div>
            <label for="date-range" class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select id="date-range" v-model="filters.dateRange" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
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
  
      <!-- Notifications List -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div class="divide-y divide-gray-200">
          <div v-for="(notification, index) in filteredNotifications" :key="index" 
            class="p-4 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
            :class="{ 'bg-violet-50': !notification.read }">
            <div class="flex items-start">
              <div class="flex-shrink-0 mt-0.5">
                <div class="h-10 w-10 rounded-full flex items-center justify-center" :class="getNotificationIconClass(notification.type)">
                  <component :is="getNotificationIcon(notification.type)" class="h-5 w-5" :class="getNotificationIconColor(notification.type)" />
                </div>
              </div>
              <div class="ml-3 flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-900" :class="{ 'font-semibold': !notification.read }">
                    {{ notification.title }}
                  </p>
                  <div class="flex items-center">
                    <span class="text-xs text-gray-500">{{ notification.time }}</span>
                    <div class="ml-2 flex space-x-1">
                      <button @click="toggleReadStatus(notification)" class="text-gray-400 hover:text-gray-500">
                        <component :is="notification.read ? 'EyeOff' : 'Eye'" class="h-4 w-4" />
                      </button>
                      <button @click="deleteNotification(index)" class="text-gray-400 hover:text-red-500">
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <p class="mt-1 text-sm text-gray-600">{{ notification.message }}</p>
                <div v-if="notification.actionUrl" class="mt-2">
                  <a :href="notification.actionUrl" class="inline-flex items-center text-xs font-medium text-violet-600 hover:text-violet-700">
                    {{ notification.actionText }}
                    <ChevronRight class="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty state -->
        <div v-if="filteredNotifications.length === 0" class="p-8 text-center">
          <Bell class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-lg font-medium text-gray-900">No notifications</h3>
          <p class="mt-1 text-sm text-gray-500">
            You're all caught up! No notifications match your current filters.
          </p>
        </div>
        
        <!-- Load more -->
        <div v-if="filteredNotifications.length > 0" class="bg-gray-50 px-4 py-3 text-center">
          <button class="text-sm font-medium text-violet-600 hover:text-violet-700">
            Load More
          </button>
        </div>
      </div>
  
      <!-- Notification Settings Modal -->
      <div v-if="isSettingsModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
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
                    Notification Settings
                  </h3>
                  <div class="mt-4 space-y-6">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900 mb-3">Email Notifications</h4>
                      <div class="space-y-3">
                        <div class="flex items-center justify-between">
                          <label for="email-orders" class="text-sm text-gray-700">New Orders</label>
                          <div class="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="email-orders" v-model="notificationSettings.email.orders" class="sr-only" />
                            <div class="block h-6 bg-gray-200 rounded-full w-12"></div>
                            <div class="absolute left-0 top-0 h-6 w-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform" :class="notificationSettings.email.orders ? 'translate-x-6 bg-violet-600' : 'translate-x-0'"></div>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <label for="email-payments" class="text-sm text-gray-700">Payment Confirmations</label>
                          <div class="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="email-payments" v-model="notificationSettings.email.payments" class="sr-only" />
                            <div class="block h-6 bg-gray-200 rounded-full w-12"></div>
                            <div class="absolute left-0 top-0 h-6 w-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform" :class="notificationSettings.email.payments ? 'translate-x-6 bg-violet-600' : 'translate-x-0'"></div>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <label for="email-inventory" class="text-sm text-gray-700">Inventory Alerts</label>
                          <div class="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="email-inventory" v-model="notificationSettings.email.inventory" class="sr-only" />
                            <div class="block h-6 bg-gray-200 rounded-full w-12"></div>
                            <div class="absolute left-0 top-0 h-6 w-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform" :class="notificationSettings.email.inventory ? 'translate-x-6 bg-violet-600' : 'translate-x-0'"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 class="text-sm font-medium text-gray-900 mb-3">In-App Notifications</h4>
                      <div class="space-y-3">
                        <div class="flex items-center justify-between">
                          <label for="app-orders" class="text-sm text-gray-700">New Orders</label>
                          <div class="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="app-orders" v-model="notificationSettings.app.orders" class="sr-only" />
                            <div class="block h-6 bg-gray-200 rounded-full w-12"></div>
                            <div class="absolute left-0 top-0 h-6 w-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform" :class="notificationSettings.app.orders ? 'translate-x-6 bg-violet-600' : 'translate-x-0'"></div>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <label for="app-payments" class="text-sm text-gray-700">Payment Confirmations</label>
                          <div class="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="app-payments" v-model="notificationSettings.app.payments" class="sr-only" />
                            <div class="block h-6 bg-gray-200 rounded-full w-12"></div>
                            <div class="absolute left-0 top-0 h-6 w-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform" :class="notificationSettings.app.payments ? 'translate-x-6 bg-violet-600' : 'translate-x-0'"></div>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <label for="app-inventory" class="text-sm text-gray-700">Inventory Alerts</label>
                          <div class="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="app-inventory" v-model="notificationSettings.app.inventory" class="sr-only" />
                            <div class="block h-6 bg-gray-200 rounded-full w-12"></div>
                            <div class="absolute left-0 top-0 h-6 w-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform" :class="notificationSettings.app.inventory ? 'translate-x-6 bg-violet-600' : 'translate-x-0'"></div>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <label for="app-system" class="text-sm text-gray-700">System Updates</label>
                          <div class="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="app-system" v-model="notificationSettings.app.system" class="sr-only" />
                            <div class="block h-6 bg-gray-200 rounded-full w-12"></div>
                            <div class="absolute left-0 top-0 h-6 w-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform" :class="notificationSettings.app.system ? 'translate-x-6 bg-violet-600' : 'translate-x-0'"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="saveNotificationSettings" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm">
                Save Settings
              </button>
              <button @click="isSettingsModalOpen = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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
    Bell, Settings, CheckSquare, Trash2, Eye, EyeOff,
    ChevronRight, ShoppingCart, CreditCard, Package, AlertTriangle
  } from 'lucide-vue-next'
  
  // Filters
  const filters = ref({
    type: 'all',
    readStatus: 'all',
    dateRange: 'all'
  })
  
  // Modal state
  const isSettingsModalOpen = ref(false)
  
  // Notification settings
  const notificationSettings = ref({
    email: {
      orders: true,
      payments: true,
      inventory: false
    },
    app: {
      orders: true,
      payments: true,
      inventory: true,
      system: true
    }
  })
  
  // Sample notifications data
  const notifications = ref([
    {
      type: 'order',
      title: 'New Order Received',
      message: 'You have received a new order #1089 from John Doe.',
      time: '2 hours ago',
      read: false,
      actionUrl: '#',
      actionText: 'View Order'
    },
    {
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $394.00 has been received for order #1089.',
      time: '2 hours ago',
      read: false,
      actionUrl: '#',
      actionText: 'View Payment'
    },
    {
      type: 'order',
      title: 'Order Shipped',
      message: 'Order #1087 has been shipped to Michael Johnson.',
      time: '1 day ago',
      read: true,
      actionUrl: '#',
      actionText: 'Track Shipment'
    },
    {
      type: 'inventory',
      title: 'Low Inventory Alert',
      message: 'The product "Digital Dreams" is running low on inventory (0 remaining).',
      time: '2 days ago',
      read: true,
      actionUrl: '#',
      actionText: 'Manage Inventory'
    },
    {
      type: 'system',
      title: 'System Update',
      message: 'The system will undergo maintenance on April 10, 2025 at 2:00 AM EST.',
      time: '3 days ago',
      read: true,
      actionUrl: null,
      actionText: null
    },
    {
      type: 'payment',
      title: 'Refund Processed',
      message: 'A refund of $507.80 has been processed for order #1085.',
      time: '4 days ago',
      read: true,
      actionUrl: '#',
      actionText: 'View Details'
    },
    {
      type: 'order',
      title: 'Order Delivered',
      message: 'Order #1086 has been delivered to Emily Williams.',
      time: '5 days ago',
      read: true,
      actionUrl: '#',
      actionText: 'View Order'
    }
  ])
  
  // Filtered notifications based on filters
  const filteredNotifications = computed(() => {
    return notifications.value.filter(notification => {
      // Type filter
      if (filters.value.type !== 'all' && notification.type !== filters.value.type) {
        return false
      }
      
      // Read status filter
      if (filters.value.readStatus === 'read' && !notification.read) {
        return false
      }
      if (filters.value.readStatus === 'unread' && notification.read) {
        return false
      }
      
      // Date range filter would be implemented here in a real app
      // For demo purposes, we'll just return true
      
      return true
    })
  })
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return ShoppingCart
      case 'payment':
        return CreditCard
      case 'inventory':
        return Package
      case 'system':
        return AlertTriangle
      default:
        return Bell
    }
  }
  
  // Get notification icon background class based on type
  const getNotificationIconClass = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100'
      case 'payment':
        return 'bg-green-100'
      case 'inventory':
        return 'bg-amber-100'
      case 'system':
        return 'bg-red-100'
      default:
        return 'bg-violet-100'
    }
  }
  
  // Get notification icon color based on type
  const getNotificationIconColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'text-blue-600'
      case 'payment':
        return 'text-green-600'
      case 'inventory':
        return 'text-amber-600'
      case 'system':
        return 'text-red-600'
      default:
        return 'text-violet-600'
    }
  }
  
  // Filter functions
  const resetFilters = () => {
    filters.value = {
      type: 'all',
      readStatus: 'all',
      dateRange: 'all'
    }
  }
  
  const applyFilters = () => {
    // Filters are already applied via the computed property
  }
  
  // Notification actions
  const toggleReadStatus = (notification: any) => {
    notification.read = !notification.read
  }
  
  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      notification.read = true
    })
  }
  
  const deleteNotification = (index: number) => {
    notifications.value.splice(index, 1)
  }
  
  // Settings modal
  const openSettingsModal = () => {
    isSettingsModalOpen.value = true
  }
  
  const saveNotificationSettings = () => {
    // In a real app, this would save the settings to the server
    isSettingsModalOpen.value = false
    alert('Notification settings saved!')
  }
  </script>