<template>
  <div class="space-y-6">
    <!-- Header with actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="animate-fade-in">
        <h1 class="text-2xl font-bold text-gray-900">Notifications Management</h1>
        <p class="text-gray-500 mt-1">Manage and configure your notification settings</p>
      </div>
      <div class="flex gap-3 animate-slide-in-right">
        <button 
          @click="markAllAsRead" 
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200"
          :disabled="loading || markingAllAsRead"
        >
          <span v-if="markingAllAsRead" class="mr-2">
            <svg class="animate-spin h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          <CheckSquare v-else class="h-4 w-4 mr-2" />
          Mark All as Read
        </button>
        <button 
          @click="openSettingsModal" 
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200"
        >
          <Settings class="h-4 w-4 mr-2" />
          Notification Settings
        </button>
      </div>
    </div>

    <!-- Notification Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="transition-all duration-200 hover:shadow-md p-2 rounded-md">
          <label for="type-filter" class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select 
            id="type-filter" 
            v-model="filters.type" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
          >
            <option value="all">All Types</option>
            <option value="order">Orders</option>
            <option value="payment">Payments</option>
            <option value="inventory">Inventory</option>
            <option value="system">System</option>
          </select>
        </div>
        <div class="transition-all duration-200 hover:shadow-md p-2 rounded-md">
          <label for="read-status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            id="read-status" 
            v-model="filters.readStatus" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
          >
            <option value="all">All Status</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
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
          </select>
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

    <!-- Notifications List -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div v-if="loading" class="p-8 flex justify-center items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700"></div>
      </div>
      
      <div v-else-if="filteredNotifications.length === 0" class="p-8 text-center text-gray-500">
        <Bell class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-lg font-medium text-gray-900">No notifications</h3>
        <p class="mt-1 text-sm text-gray-500">
          You're all caught up! No notifications match your current filters.
        </p>
      </div>
      
      <div v-else class="divide-y divide-gray-200">
        <div 
          v-for="(notification, index) in filteredNotifications" 
          :key="notification._id" 
          class="p-4 hover:bg-gray-50 transition-all duration-200 ease-in-out animate-fade-in"
          :class="{ 'bg-violet-50': !notification.isRead }"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <div 
                class="h-10 w-10 rounded-full flex items-center justify-center" 
                :class="getNotificationIconClass(notification.type)"
              >
                <component 
                  :is="getNotificationIcon(notification.type)" 
                  class="h-5 w-5" 
                  :class="getNotificationIconColor(notification.type)" 
                />
              </div>
            </div>
            <div class="ml-3 flex-1">
              <div class="flex items-center justify-between">
                <p 
                  class="text-sm font-medium text-gray-900" 
                  :class="{ 'font-semibold': !notification.isRead }"
                >
                  {{ notification.title }}
                </p>
                <div class="flex items-center">
                  <span class="text-xs text-gray-500">{{ formatDate(notification.createdAt) }}</span>
                  <div class="ml-2 flex space-x-1">
                    <button 
                      @click="toggleReadStatus(notification)" 
                      class="text-gray-400 hover:text-gray-500 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                      :title="notification.isRead ? 'Mark as unread' : 'Mark as read'"
                    >
                      <component :is="notification.isRead ? 'EyeOff' : 'Eye'" class="h-4 w-4" />
                    </button>
                    <button 
                      @click="confirmDeleteNotification(notification)" 
                      class="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                      title="Delete notification"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <p class="mt-1 text-sm text-gray-600">{{ notification.message }}</p>
              <div v-if="notification.reference" class="mt-2">
                <a 
                  :href="`/view/${notification.type}/${notification.reference}`" 
                  class="inline-flex items-center text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors duration-200"
                >
                  {{ getActionText(notification.type) }}
                  <ChevronRight class="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="filteredNotifications.length > 0 && hasMoreNotifications" class="bg-gray-50 px-4 py-3 text-center">
        <button 
          @click="loadMoreNotifications" 
          class="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors duration-200 focus:outline-none focus:underline"
          :disabled="loadingMore"
        >
          <span v-if="loadingMore" class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading more...
          </span>
          <span v-else>Load More</span>
        </button>
      </div>
    </div>

    <!-- Notification Settings Modal -->
    <Transition name="modal">
      <div v-if="isSettingsModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="closeSettingsModal">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <Bell class="h-5 w-5 mr-2 text-violet-600" />
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
                            <div class="block h-6 bg-gray-200 rounded-full w-12 transition-colors duration-200" :class="{ 'bg-violet-600': notificationSettings.email.orders }"></div>
                            <div class="absolute left-0 top-0 h-6 w-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform" :class="notificationSettings.email.orders ? 'translate-x-6' : 'translate-x-0'"></div>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <label for="email-payments" class="text-sm text-gray-700">Payment Confirmations</label>
                          <div class="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="email-payments" v-model="notificationSettings.email.payments" class="sr-only" />
                            <div class="block h-6 bg-gray-200 rounded-full w-12 transition-colors duration-200" :class="{ 'bg-violet-600': notificationSettings.email.payments }"></div>
                            <div class="absolute left-0 top-0 h-6 w-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform" :class="notificationSettings.email.payments ? 'translate-x-6' : 'translate-x-0'"></div>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <label for="email-inventory" class="text-sm text-gray-700">Inventory Alerts</label>
                          <div class="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="email-inventory" v-model="notificationSettings.email.inventory" class="sr-only" />
                            <div class="block h-6 bg-gray-200 rounded-full w-12 transition-colors duration-200" :class="{ 'bg-violet-600': notificationSettings.email.inventory }"></div>
                            <div class="absolute left-0 top-0 h-6 w-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform" :class="notificationSettings.email.inventory ? 'translate-x-6' : 'translate-x-0'"></div>
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
                            <div class="block h-6 bg-gray-200 rounded-full w-12 transition-colors duration-200" :class="{ 'bg-violet-600': notificationSettings.app.orders }"></div>
                            <div class="absolute left-0 top-0 h-6 w-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform" :class="notificationSettings.app.orders ? 'translate-x-6' : 'translate-x-0'"></div>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <label for="app-payments" class="text-sm text-gray-700">Payment Confirmations</label>
                          <div class="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="app-payments" v-model="notificationSettings.app.payments" class="sr-only" />
                            <div class="block h-6 bg-gray-200 rounded-full w-12 transition-colors duration-200" :class="{ 'bg-violet-600': notificationSettings.app.payments }"></div>
                            <div class="absolute left-0 top-0 h-6 w-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform" :class="notificationSettings.app.payments ? 'translate-x-6' : 'translate-x-0'"></div>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <label for="app-inventory" class="text-sm text-gray-700">Inventory Alerts</label>
                          <div class="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="app-inventory" v-model="notificationSettings.app.inventory" class="sr-only" />
                            <div class="block h-6 bg-gray-200 rounded-full w-12 transition-colors duration-200" :class="{ 'bg-violet-600': notificationSettings.app.inventory }"></div>
                            <div class="absolute left-0 top-0 h-6 w-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform" :class="notificationSettings.app.inventory ? 'translate-x-6' : 'translate-x-0'"></div>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <label for="app-system" class="text-sm text-gray-700">System Updates</label>
                          <div class="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="app-system" v-model="notificationSettings.app.system" class="sr-only" />
                            <div class="block h-6 bg-gray-200 rounded-full w-12 transition-colors duration-200" :class="{ 'bg-violet-600': notificationSettings.app.system }"></div>
                            <div class="absolute left-0 top-0 h-6 w-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform" :class="notificationSettings.app.system ? 'translate-x-6' : 'translate-x-0'"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="saveNotificationSettings" 
                type="button" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                :disabled="savingSettings"
              >
                <span v-if="savingSettings" class="mr-2">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                Save Settings
              </button>
              <button 
                @click="closeSettingsModal" 
                type="button" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition name="modal">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="cancelDelete">
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
                    Delete Notification
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to delete this notification? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="deleteNotification" 
                type="button" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                :disabled="deleting"
              >
                <span v-if="deleting" class="mr-2">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                Delete
              </button>
              <button 
                @click="cancelDelete" 
                type="button" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div 
        v-if="toast.show" 
        class="fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform"
        :class="{
          'bg-green-500': toast.type === 'success',
          'bg-red-500': toast.type === 'error',
          'bg-blue-500': toast.type === 'info'
        }"
      >
        <div class="flex items-center">
          <component 
            :is="toast.type === 'success' ? 'CheckCircle' : toast.type === 'error' ? 'XCircle' : 'Info'" 
            class="h-5 w-5 text-white mr-2" 
          />
          <p class="text-white font-medium">{{ toast.message }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  Bell, Settings, CheckSquare, Trash2, Eye, EyeOff,
  ChevronRight, ShoppingCart, CreditCard, Package, AlertTriangle,
  CheckCircle, XCircle, Info
} from 'lucide-vue-next'
import { useFetchAllNotifications } from '@/composables/modules/notifications/useFetchAllNotifications'
import { definePageMeta } from '#imports'

// Types
interface Notification {
  _id: string
  title: string
  message: string
  isRead: boolean
  type: string
  reference: string
  isAdmin: boolean
  createdAt: string
  updatedAt: string
  id: string
}

interface Toast {
  show: boolean
  message: string
  type: 'success' | 'error' | 'info'
}

// Composables
const { 
  // fetchNotifications, 
  // markAsRead, 
  // markAsUnread, 
  // markAllAsReadAction, 
  // deleteNotificationAction,
  // updateNotificationSettings
  notifications,
  loading
} = useFetchAllNotifications()

// State
// const notifications = ref<Notification[]>([])
// const loading = ref(true)
const loadingMore = ref(false)
const page = ref(1)
const limit = ref(10)
const hasMoreNotifications = ref(true)
const markingAllAsRead = ref(false)
const deleting = ref(false)
const savingSettings = ref(false)

// Filters
const filters = ref({
  type: 'all',
  readStatus: 'all',
  dateRange: 'all'
})

// Modal state
const isSettingsModalOpen = ref(false)
const showDeleteModal = ref(false)
const notificationToDelete = ref<Notification | null>(null)

// Toast notification
const toast = ref<Toast>({
  show: false,
  message: '',
  type: 'info'
})

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

// Fetch notifications
const fetchData = async () => {
  loading.value = true
  try {
    const data = await fetchNotifications(1, limit.value)
    notifications.value = data
    hasMoreNotifications.value = data.length === limit.value
  } catch (error) {
    showToast('Failed to load notifications', 'error')
    console.error('Error fetching notifications:', error)
  } finally {
    loading.value = false
  }
}

// Load more notifications
const loadMoreNotifications = async () => {
  if (loadingMore.value) return
  
  loadingMore.value = true
  try {
    page.value++
    const data = await fetchNotifications(page.value, limit.value)
    if (data.length > 0) {
      notifications.value = [...notifications.value, ...data]
      hasMoreNotifications.value = data.length === limit.value
    } else {
      hasMoreNotifications.value = false
    }
  } catch (error) {
    showToast('Failed to load more notifications', 'error')
    console.error('Error loading more notifications:', error)
  } finally {
    loadingMore.value = false
  }
}

// Filtered notifications based on filters
const filteredNotifications = computed(() => {
  return notifications.value.filter(notification => {
    // Type filter
    if (filters.value.type !== 'all' && notification.type !== filters.value.type) {
      return false
    }
    
    // Read status filter
    if (filters.value.readStatus === 'read' && !notification.isRead) {
      return false
    }
    if (filters.value.readStatus === 'unread' && notification.isRead) {
      return false
    }
    
    // Date range filter
    if (filters.value.dateRange !== 'all') {
      const notificationDate = new Date(notification.createdAt)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      const weekStart = new Date(today)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      
      if (filters.value.dateRange === 'today' && notificationDate < today) {
        return false
      }
      
      if (filters.value.dateRange === 'yesterday' && (notificationDate < yesterday || notificationDate >= today)) {
        return false
      }
      
      if (filters.value.dateRange === 'week' && notificationDate < weekStart) {
        return false
      }
      
      if (filters.value.dateRange === 'month' && notificationDate < monthStart) {
        return false
      }
    }
    
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

// Get action text based on notification type
const getActionText = (type: string) => {
  switch (type) {
    case 'order':
      return 'View Order'
    case 'payment':
      return 'View Payment'
    case 'inventory':
      return 'View Inventory'
    case 'system':
      return 'View Details'
    default:
      return 'View Details'
  }
}

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60))
      if (diffMinutes === 0) {
        return 'Just now'
      }
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
    }
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
  // This function is here for future expansion, like server-side filtering
  showToast('Filters applied', 'success')
}

// Notification actions
const toggleReadStatus = async (notification: Notification) => {
  try {
    if (notification.isRead) {
      await markAsUnread(notification._id)
      notification.isRead = false
      showToast('Notification marked as unread', 'success')
    } else {
      await markAsRead(notification._id)
      notification.isRead = true
      showToast('Notification marked as read', 'success')
    }
  } catch (error) {
    showToast('Failed to update notification status', 'error')
    console.error('Error toggling read status:', error)
  }
}

const markAllAsRead = async () => {
  let shouldMarkAllAsRead = true;

  if (markingAllAsRead.value) return
  
  markingAllAsRead.value = true
  try {
    await markAllAsReadAction()
    notifications.value = notifications.value.map(notification => ({
      ...notification,
      isRead: true
    }))
    showToast('All notifications marked as read', 'success')
  } catch (error) {
    showToast('Failed to mark all notifications as read', 'error')
    console.error('Error marking all as read:', error)
  } finally {
    markingAllAsRead.value = false
  }
}

const confirmDeleteNotification = (notification: Notification) => {
  notificationToDelete.value = notification
  showDeleteModal.value = true
}

const deleteNotification = async () => {
  if (!notificationToDelete.value || deleting.value) return
  
  deleting.value = true
  try {
    await deleteNotificationAction(notificationToDelete.value._id)
    notifications.value = notifications.value.filter(n => n._id !== notificationToDelete.value?._id)
    showToast('Notification deleted', 'success')
    showDeleteModal.value = false
    notificationToDelete.value = null
  } catch (error) {
    showToast('Failed to delete notification', 'error')
    console.error('Error deleting notification:', error)
  } finally {
    deleting.value = false
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  notificationToDelete.value = null
}

// Settings modal
const openSettingsModal = () => {
  isSettingsModalOpen.value = true
}

const closeSettingsModal = () => {
  isSettingsModalOpen.value = false
}

const saveNotificationSettings = async () => {
  savingSettings.value = true
  try {
    await updateNotificationSettings(notificationSettings.value)
    showToast('Notification settings saved', 'success')
    closeSettingsModal()
  } catch (error) {
    showToast('Failed to save notification settings', 'error')
    console.error('Error saving notification settings:', error)
  } finally {
    savingSettings.value = false
  }
}

// Toast notification
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  toast.value = {
    show: true,
    message,
    type
  }
  
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Lifecycle hooks
onMounted(() => {
  fetchData()
})

// Watch for filter changes to reset pagination
watch([filters], () => {
  // If we implement server-side filtering, we would reset pagination here
})

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

/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>