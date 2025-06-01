<template>
  <div class="h-screen flex flex-col md:flex-row bg-gray-50">
    <!-- Mobile Header -->
    <div class="md:hidden flex items-center justify-between p-4 bg-white border-b">
      <div class="flex items-center">
        <button @click="isSidebarOpen = !isSidebarOpen" class="mr-2">
          <Menu class="h-6 w-6 text-gray-600" />
        </button>
        <img src="@/assets/img/raymond-logo.png" class="h-12 w-12 lg:flex hidden" />
        <!-- <h1 class="text-xl font-bold text-gray-900">Artist Dashboard</h1> -->
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
          <img src="@/assets/img/raymond-logo.png" class="h-12 w-12" />
          <!-- <h2 class="text-xl font-bold text-gray-900">Artist Dashboard</h2> -->
          <button @click="isSidebarOpen = false" class="md:hidden">
            <X class="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <!-- Sidebar Content -->
        <div class="flex-1 overflow-y-auto p-4">
          <nav class="space-y-1">
            <div v-for="(section, sectionIndex) in sidebarSections" :key="sectionIndex" class="mb-6">
              <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {{ section.title }}
              </h3>
              <div class="space-y-1">
                <!-- Regular menu items or dropdown parents -->
                <div 
                  v-for="(item, itemIndex) in section.items" 
                  :key="item.name"
                  class="group"
                >
                  <!-- If item has children, render as dropdown -->
                  <div v-if="item.children && item.children.length > 0">
                    <button 
                      @click="toggleDropdown(sectionIndex, itemIndex)"
                      class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors"
                      :class="[
                        isActiveParent(item) 
                          ? 'bg-violet-50 text-violet-700' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      ]"
                    >
                      <div class="flex items-center">
                        <component :is="item.icon" class="mr-3 h-5 w-5 flex-shrink-0" :class="[
                          isActiveParent(item) ? 'text-violet-600' : 'text-gray-400 group-hover:text-gray-500'
                        ]" />
                        <span>{{ item.name }}</span>
                      </div>
                      <ChevronDown 
                        class="h-4 w-4 transition-transform duration-200"
                        :class="[
                          expandedItems[sectionIndex]?.[itemIndex] ? 'transform rotate-180' : '',
                          isActiveParent(item) ? 'text-violet-600' : 'text-gray-400'
                        ]"
                      />
                    </button>
                    
                    <!-- Dropdown children -->
                    <div 
                      v-show="expandedItems[sectionIndex]?.[itemIndex]"
                      class="mt-1 pl-10 space-y-1"
                    >
                      <NuxtLink 
                        v-for="child in item.children" 
                        :key="child.name"
                        :to="child.href"
                        class="block px-3 py-2 text-sm font-medium rounded-md transition-colors"
                        :class="[
                          $route.path === child.href 
                            ? 'bg-violet-50 text-violet-700' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        ]"
                        @click="isSidebarOpen = false"
                      >
                        {{ child.name }}
                      </NuxtLink>
                    </div>
                  </div>
                  
                  <!-- Regular menu item without children -->
                  <NuxtLink 
                    v-else
                    :to="item.href"
                    class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
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
          <button @click="router.push('/chat')" class="text-gray-500 hover:text-gray-700">
            <Bell class="h-5 w-5" />
          </button>
          <!-- <button class="text-gray-500 hover:text-gray-700">
            <Settings class="h-5 w-5" />
          </button> -->
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
              <a href="#" @click.prevent="logOut" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
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
import { ref, reactive, computed, onMounted, onUnmounted, useRoute, watch } from '#imports'
import { 
  Menu, X, Binoculars, LogOut, Bell, Settings, ChevronDown,
  Home, ShoppingCart, Package, CreditCard, Link, FileText, 
  ShipIcon, AudioWaveformIcon, BookOpen, Award, Users as UsersIcon,
  Bell as BellIcon, FileText as InvoiceIcon, Package as InventoryIcon, Users, Star, MailQuestion
} from 'lucide-vue-next'
import { useUser } from '@/composables/auth/user'
import { logOut } from "@/composables/core/useLogout"

const { user } = useUser()

// Sidebar state
const isSidebarOpen = ref(false)
const isUserMenuOpen = ref(false)
const userMenuContainer = ref<HTMLElement | null>(null)
const route = useRoute()

// Track expanded dropdown items
const expandedItems = reactive<Record<number, Record<number, boolean>>>({})
const router = useRouter()

// Define sidebar sections and items with nested structure
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
      { name: 'Inventory', href: '/dashboard/inventory', icon: ShipIcon },
      { name: 'Shipping Tax', href: '/dashboard/shipping-tax', icon: InventoryIcon },
      { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
      { name: 'Audit Trail', href: '/dashboard/audit-trail', icon: AudioWaveformIcon },
      { name: 'Enquiries', href: '/dashboard/enquiries', icon: MailQuestion },
      { name: 'Promo Sales', href: '/dashboard/promosales', icon: Binoculars },
      { name: 'Commission Requests', href: '/dashboard/commission-requests', icon: MailQuestion },
      { 
        name: 'Course Management', 
        href: '/dashboard/courses', 
        icon: BookOpen,
        children: [
          { name: 'All Courses', href: '/dashboard/courses' },
          { name: 'Enrollments', href: '/dashboard/courses/enrollments' },
          { name: 'Certificates', href: '/dashboard/courses/certificates' },
          { name: 'Reviews', href: '/dashboard/courses/reviews' }
        ]
      },
    ]
  }
]

// Toggle dropdown state
const toggleDropdown = (sectionIndex: number, itemIndex: number) => {
  if (!expandedItems[sectionIndex]) {
    expandedItems[sectionIndex] = {}
  }
  
  expandedItems[sectionIndex][itemIndex] = !expandedItems[sectionIndex][itemIndex]
}

// Check if a parent item should be highlighted (if it or any of its children are active)
const isActiveParent = (item: any) => {
  if (route.path === item.href) return true
  
  if (item.children) {
    return item.children.some((child: any) => route.path === child.href)
  }
  
  return false
}

// Auto-expand dropdown when a child route is active
const autoExpandActiveDropdowns = () => {
  sidebarSections.forEach((section, sectionIndex) => {
    section.items.forEach((item, itemIndex) => {
      if (item.children && isActiveParent(item)) {
        if (!expandedItems[sectionIndex]) {
          expandedItems[sectionIndex] = {}
        }
        expandedItems[sectionIndex][itemIndex] = true
      }
    })
  })
}

// Compute current page title based on the route
const currentPageTitle = computed(() => {
  // Check all items including children
  for (const section of sidebarSections) {
    for (const item of section.items) {
      // Check if the main item matches
      if (route.path === item.href) {
        return item.name
      }
      
      // Check if any child item matches
      if (item.children) {
        for (const child of item.children) {
          if (route.path === child.href) {
            return child.name
          }
        }
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

// Watch for route changes to update expanded state
watch(() => route.path, () => {
  autoExpandActiveDropdowns()
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  autoExpandActiveDropdowns()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

</script>