<template>
  <div class="h-screen flex flex-col md:flex-row bg-gray-50">
    <!-- Mobile Header -->
    <div class="md:hidden flex items-center justify-between p-4 bg-white border-b">
      <div class="flex items-center">
        <button @click="isSidebarOpen = !isSidebarOpen" class="mr-2">
          <Menu class="h-6 w-6 text-gray-600" />
        </button>
        <h1 class="text-xl font-bold text-gray-900">Artist Dashboard</h1>
      </div>
      <div class="flex items-center">
        <button @click="isUserMenuOpen = !isUserMenuOpen" class="relative">
          <img src="https://i.pravatar.cc/150?img=32" alt="User" class="h-8 w-8 rounded-full" />
        </button>
      </div>
    </div>

    <!-- Sidebar -->
    <div 
      class="fixed inset-0 z-40 md:relative md:z-0 transform transition-transform duration-300 ease-in-out"
      :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0 md:w-64 md:flex-shrink-0'
      ]"
    >
      <!-- Backdrop for mobile -->
      <div 
        v-if="isSidebarOpen" 
        @click="isSidebarOpen = false"
        class="fixed inset-0 bg-gray-600 bg-opacity-75 md:hidden"
      ></div>

      <div class="relative flex h-full flex-col bg-white border-r">
        <!-- Sidebar Header -->
        <div class="flex items-center justify-between h-16 px-4 border-b">
          <h2 class="text-xl font-bold text-gray-900">Artist Dashboard</h2>
          <button @click="isSidebarOpen = false" class="md:hidden">
            <X class="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <!-- Sidebar Content -->
        <div class="flex-1 overflow-y-auto p-4">
          <nav class="space-y-1">
            <div v-for="(section, index) in sidebarSections" :key="index" class="mb-6">
              <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {{ section.title }}
              </h3>
              <div class="space-y-1">
                <NuxtLink 
                  v-for="item in section.items" 
                  :key="item.name"
                  :to="item.href"
                  class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
                  :class="[
                    $route.path === item.href 
                      ? 'bg-violet-50 text-violet-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  ]"
                  @click="isSidebarOpen = false"
                >
                  <component :is="item.icon" class="mr-3 h-5 w-5 flex-shrink-0" :class="[
                    $route.path === item.href ? 'text-violet-600' : 'text-gray-400 group-hover:text-gray-500'
                  ]" />
                  <span>{{ item.name }}</span>
                </NuxtLink>
              </div>
            </div>
          </nav>
        </div>

        <!-- Sidebar Footer -->
        <div class="border-t p-4">
          <div class="flex items-center">
            <img src="https://i.pravatar.cc/150?img=32" alt="User" class="h-8 w-8 rounded-full" />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-700">{{ `${user?.firstName} ${user?.lastName}` || 'Admin' }}</p>
              <p class="text-xs text-gray-500">{{user?.email || 'admin@gmail.com'}} </p>
            </div>
            <button @click="logOut" class="ml-auto">
              <LogOut class="h-5 w-5 text-gray-400 hover:text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Desktop Header -->
      <header class="hidden md:flex items-center justify-between h-16 bg-white border-b px-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ currentPageTitle }}</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button class="text-gray-500 hover:text-gray-700">
            <Bell class="h-5 w-5" />
          </button>
          <button class="text-gray-500 hover:text-gray-700">
            <Settings class="h-5 w-5" />
          </button>
          <div class="relative" ref="userMenuContainer">
            <button @click="isUserMenuOpen = !isUserMenuOpen" class="flex items-center">
              <img src="https://i.pravatar.cc/150?img=32" alt="User" class="h-8 w-8 rounded-full" />
              <span class="ml-2 text-sm font-medium text-gray-700">{{ `${user?.firstName} ${user?.lastName}` || 'Admin' }}</span>
              <ChevronDown class="ml-1 h-4 w-4 text-gray-500" />
            </button>
            <!-- User dropdown menu -->
            <div 
              v-if="isUserMenuOpen" 
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border"
            >
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, useRoute } from '#imports'
import { 
  Menu, X, LogOut, Bell, Settings, ChevronDown,
  Home, ShoppingCart, Package, CreditCard, Link, FileText, 
  Bell as BellIcon, FileText as InvoiceIcon, Package as InventoryIcon, Users
} from 'lucide-vue-next'
import { useUser } from '@/composables/auth/user'
import { logOut } from "@/composables/core/useLogout"
const { user } = useUser()

// Sidebar state
const isSidebarOpen = ref(false)
const isUserMenuOpen = ref(false)
const userMenuContainer = ref<HTMLElement | null>(null)
const route = useRoute()

// Define sidebar sections and items
const sidebarSections = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
    ]
  },
  {
    title: 'Management',
    items: [
      { name: 'Sales', href: '/dashboard/sales', icon: ShoppingCart },
      { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
      { name: 'Products', href: '/dashboard/products', icon: Package },
      { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
      { name: 'Payment Links', href: '/dashboard/payment-links', icon: Link },
      { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
      { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
      { name: 'Invoices', href: '/dashboard/invoices', icon: InvoiceIcon },
      { name: 'Inventory', href: '/dashboard/inventory', icon: InventoryIcon },
      { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
    ]
  }
]

// Compute current page title based on the route
const currentPageTitle = computed(() => {
  // Find the menu item that matches the current route
  for (const section of sidebarSections) {
    for (const item of section.items) {
      if (route.path === item.href) {
        return item.name
      }
    }
  }
  
  // Default to Dashboard if no match is found
  return 'Dashboard'
})

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (isUserMenuOpen.value && userMenuContainer.value && !userMenuContainer.value.contains(event.target as Node)) {
    isUserMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

definePageMeta({
    layout:'dashboard'
})
</script>