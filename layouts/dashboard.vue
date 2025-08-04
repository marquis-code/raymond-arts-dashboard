<template>
  <div class="h-screen flex flex-col md:flex-row bg-gray-50">
    <!-- Mobile Header -->
    <div class="md:hidden flex items-center justify-between p-4 bg-white border-b">
      <div class="flex items-center">
        <button @click="toggleSidebar" class="mr-2">
          <Menu class="h-6 w-6 text-gray-600" />
        </button>
        <img src="@/assets/img/raymond-logo.png" class="h-12 w-12 lg:flex hidden" />
      </div>
      <div class="flex items-center">
        <button @click="isUserMenuOpen = !isUserMenuOpen" class="relative">
          <img src="https://i.pravatar.cc/150?img=32" alt="User" class="h-8 w-8 rounded-full" />
        </button>
      </div>
    </div>

    <!-- Sidebar Overlay for Mobile -->
    <div 
      v-if="isSidebarOpen" 
      @click="closeSidebar"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 md:hidden transition-opacity duration-300 ease-in-out"
      :class="isSidebarOpen ? 'opacity-100' : 'opacity-0'"
    ></div>

    <!-- Sidebar Container -->
    <div 
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:relative md:z-0 md:translate-x-0 md:flex-shrink-0 overflow-hidden"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Main Sidebar View -->
      <div 
        class="absolute inset-0 transition-transform duration-300 ease-in-out"
        :class="showChildrenView ? '-translate-x-full' : 'translate-x-0'"
      >
        <!-- Sidebar Header -->
        <div class="flex items-center justify-between h-16 px-4 border-b">
          <img src="@/assets/img/raymond-logo.png" class="h-12 w-12" />
          <button @click="closeSidebar" class="md:hidden">
            <X class="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <!-- Main Sidebar Content -->
        <div class="flex-1 overflow-y-auto p-4">
          <nav class="space-y-1">
            <div v-for="(section, sectionIndex) in sidebarSections" :key="sectionIndex" class="mb-6">
              <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {{ section.title }}
              </h3>
              <div class="space-y-1">
                <div v-for="(item, itemIndex) in section.items" :key="item.name" class="group">
                  <!-- Item with children - shows arrow and navigates to children view -->
                  <button 
                    v-if="item.children && item.children.length > 0"
                    @click="showChildren(item, sectionIndex, itemIndex)"
                    class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out transform hover:translate-x-1 hover:shadow-sm"
                    :class="getParentItemClasses(item)"
                  >
                    <div class="flex items-center">
                      <component 
                        :is="item.icon" 
                        class="mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200" 
                        :class="getParentIconClasses(item)"
                      />
                      <span>{{ item.name }}</span>
                    </div>
                    <ChevronRight 
                      class="h-4 w-4 transition-colors duration-200"
                      :class="isActiveParent(item) ? 'text-violet-600' : 'text-gray-400'"
                    />
                  </button>

                  <!-- Regular menu item without children -->
                  <NuxtLink 
                    v-else
                    :to="item.href"
                    class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out transform hover:translate-x-1 hover:shadow-sm relative"
                    :class="getRegularItemClasses(item.href)"
                    @click="closeSidebar"
                  >
                    <component 
                      :is="item.icon" 
                      class="mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200" 
                      :class="getRegularIconClasses(item.href)"
                    />
                    <span>{{ item.name }}</span>
                    
                    <!-- Active indicator for regular items -->
                    <span 
                      v-if="isExactMatch(item.href)"
                      class="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-violet-600 rounded-full"
                    ></span>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <!-- Main Sidebar Footer -->
        <div class="border-t p-4">
          <div class="flex items-center">
            <img src="https://i.pravatar.cc/150?img=32" alt="User" class="h-8 w-8 rounded-full" />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-700">{{ `${user?.firstName} ${user?.lastName}` || 'Admin' }}</p>
              <p class="text-xs text-gray-500">{{ user?.email || 'admin@gmail.com' }}</p>
            </div>
            <button @click="logOut" class="ml-auto hover:bg-gray-100 p-1 rounded transition-colors duration-200">
              <LogOut class="h-5 w-5 text-gray-400 hover:text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <!-- Children Sidebar View -->
      <div 
        class="absolute inset-0 transition-transform duration-300 ease-in-out"
        :class="showChildrenView ? 'translate-x-0' : 'translate-x-full'"
      >
        <!-- Children Header -->
        <div class="flex items-center h-16 px-4 border-b bg-violet-50">
          <button 
            @click="hideChildren"
            class="mr-3 p-1 hover:bg-violet-100 rounded transition-colors duration-200"
          >
            <ChevronLeft class="h-5 w-5 text-violet-600" />
          </button>
          <div class="flex items-center">
            <component 
              :is="currentParentItem?.icon" 
              class="mr-3 h-5 w-5 text-violet-600" 
            />
            <div>
              <h3 class="text-sm font-semibold text-violet-900">{{ currentParentItem?.name }}</h3>
              <p class="text-xs text-violet-600">{{ currentParentItem?.children?.length }} items</p>
            </div>
          </div>
        </div>

        <!-- Children Content -->
        <div class="flex-1 overflow-y-auto p-4">
          <nav class="space-y-1">
            <!-- Parent item as first option -->
            <NuxtLink 
              v-if="currentParentItem"
              :to="currentParentItem.href"
              class="flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 ease-in-out transform hover:translate-x-1 hover:shadow-sm relative border-b border-gray-100 mb-3"
              :class="getRegularItemClasses(currentParentItem.href)"
              @click="closeSidebar"
            >
              <component 
                :is="currentParentItem.icon" 
                class="mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200" 
                :class="getRegularIconClasses(currentParentItem.href)"
              />
              <div>
                <span class="font-semibold">{{ currentParentItem.name }}</span>
                <p class="text-xs text-gray-500 mt-0.5">Overview & Main</p>
              </div>
              
              <!-- Active indicator -->
              <span 
                v-if="isExactMatch(currentParentItem.href)"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-violet-600 rounded-full"
              ></span>
            </NuxtLink>

            <!-- Children items -->
            <div class="space-y-1">
              <NuxtLink 
                v-for="(child, index) in currentParentItem?.children" 
                :key="child.name"
                :to="child.href"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out transform hover:translate-x-1 hover:shadow-sm relative"
                :class="getChildItemClasses(child.href)"
                @click="closeSidebar"
              >
                <div class="mr-3 h-5 w-5 flex-shrink-0 flex items-center justify-center">
                  <div class="w-2 h-2 rounded-full bg-gray-300 transition-colors duration-200"
                       :class="isExactMatch(child.href) ? 'bg-violet-600' : 'bg-gray-300'">
                  </div>
                </div>
                <span>{{ child.name }}</span>
                
                <!-- Active indicator for child items -->
                <span 
                  v-if="isExactMatch(child.href)"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-violet-600 rounded-full"
                ></span>
              </NuxtLink>
            </div>
          </nav>
        </div>

        <!-- Children Footer -->
        <div class="border-t p-4 bg-gray-50">
          <button 
            @click="hideChildren"
            class="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            <ChevronLeft class="mr-2 h-4 w-4" />
            Back to Main Menu
          </button>
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
          <button @click="router.push('/chat')" class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <Bell class="h-5 w-5" />
          </button>
          
          <div class="relative" ref="userMenuContainer">
            <button @click="isUserMenuOpen = !isUserMenuOpen" class="flex items-center hover:bg-gray-50 px-3 py-2 rounded-md transition-colors duration-200">
              <img src="https://i.pravatar.cc/150?img=32" alt="User" class="h-8 w-8 rounded-full" />
              <span class="ml-2 text-sm font-medium text-gray-700">{{ `${user?.firstName} ${user?.lastName}` || 'Admin' }}</span>
              <ChevronDown class="ml-1 h-4 w-4 text-gray-500 transition-transform duration-200" :class="isUserMenuOpen ? 'rotate-180' : ''" />
            </button>
            
            <!-- User dropdown menu with animation -->
            <transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 scale-95 transform -translate-y-2"
              enter-to-class="opacity-100 scale-100 transform translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 scale-100 transform translate-y-0"
              leave-to-class="opacity-0 scale-95 transform -translate-y-2"
            >
              <div v-if="isUserMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">Your Profile</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">Settings</a>
                <a href="#" @click.prevent="logOut" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">Sign out</a>
              </div>
            </transition>
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
import { ref, reactive, computed, onMounted, onUnmounted, watch } from '#imports'
import {   
  Menu, X, Binoculars, LogOut, Bell, Settings, ChevronDown, ChevronRight, ChevronLeft,
  Home, ShoppingCart, Package, CreditCard, Link, FileText,   
  ShipIcon, AudioWaveformIcon, BookOpen, Award, Users as UsersIcon,  
  Bell as BellIcon, FileText as InvoiceIcon, Package as InventoryIcon, Users, Star, MailQuestion,
  TrendingUp, DollarSign, Receipt, Banknote, ExternalLink, ShoppingBag,
  MessageSquare, FileBarChart, Truck, Calculator, UserCheck, Activity,
  HelpCircle, Eye, MessageCircle, Folder, ThumbsUp, GraduationCap,
  UserPlus, StarIcon, AwardIcon
} from 'lucide-vue-next'
import { useUser } from '@/composables/auth/user'
import { logOut } from "@/composables/core/useLogout"

const { user } = useUser()
const route = useRoute()
const router = useRouter()

// Sidebar state
const isSidebarOpen = ref(false)
const isUserMenuOpen = ref(false)
const userMenuContainer = ref<HTMLElement | null>(null)

// 2-step navigation state
const showChildrenView = ref(false)
const currentParentItem = ref<any>(null)

// Define sidebar sections with proper icons
const sidebarSections = [{
  title: 'Overview',
  items: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
  ]
}, {
  title: 'Management',
  items: [
    { name: 'Sales', href: '/dashboard/sales', icon: TrendingUp },
    { name: 'Transactions', href: '/dashboard/transactions', icon: Receipt },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    { name: 'Originals', href: '/dashboard/originals', icon: ExternalLink },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
    { name: 'Invoices', href: '/dashboard/invoices', icon: FileBarChart },
    { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
    { name: 'Shipping Tax', href: '/dashboard/shipping-tax', icon: Calculator },
    { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
    { name: 'Audit Trail', href: '/dashboard/audit-trail', icon: Activity },
    { name: 'Enquiries', href: '/dashboard/enquiries', icon: HelpCircle },
    { name: 'Promo Sales', href: '/dashboard/promosales', icon: Eye },
    { name: 'Commission Requests', href: '/dashboard/commission-requests', icon: DollarSign },
    { name: 'Content Management', href: '/dashboard/content', icon: Folder },
    { name: 'Reviews Management', href: '/dashboard/reviews', icon: ThumbsUp },
    {         
      name: 'Course Management',         
      href: '/dashboard/courses',         
      icon: GraduationCap,        
      children: [
        { name: 'All Courses', href: '/dashboard/courses' },
        { name: 'Enrollments', href: '/dashboard/courses/enrollments' },
        { name: 'Certificates', href: '/dashboard/courses/certificates' },
        { name: 'Reviews', href: '/dashboard/courses/reviews' }
      ]
    },
  ]
}]

// Sidebar control methods
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
  hideChildren()
}

// 2-step navigation methods
const showChildren = (item: any, sectionIndex: number, itemIndex: number) => {
  currentParentItem.value = item
  showChildrenView.value = true
}

const hideChildren = () => {
  showChildrenView.value = false
  setTimeout(() => {
    currentParentItem.value = null
  }, 300) // Wait for animation to complete
}

// Enhanced route matching functions
const isExactMatch = (href: string) => {
  return route.path === href
}

const isActiveParent = (item: any) => {
  if (route.path === item.href) return true
  if (item.children) {
    return item.children.some((child: any) => route.path === child.href)
  }
  return false
}

// Enhanced styling functions
const getParentItemClasses = (item: any) => {
  const isActive = isActiveParent(item)
  return [
    'hover:bg-gray-50 hover:text-gray-900',
    isActive 
      ? 'bg-violet-100 text-violet-700 shadow-sm border-l-4 border-violet-600' 
      : 'text-gray-700'
  ]
}

const getParentIconClasses = (item: any) => {
  const isActive = isActiveParent(item)
  return [
    'group-hover:text-gray-500',
    isActive ? 'text-violet-600' : 'text-gray-400'
  ]
}

const getChildItemClasses = (href: string) => {
  const isActive = isExactMatch(href)
  return [
    'hover:bg-gray-50 hover:text-gray-900',
    isActive 
      ? 'bg-violet-50 text-violet-700 font-semibold border-l-2 border-violet-600' 
      : 'text-gray-600'
  ]
}

const getRegularItemClasses = (href: string) => {
  const isActive = isExactMatch(href)
  return [
    'hover:bg-gray-50 hover:text-gray-900 group',
    isActive 
      ? 'bg-violet-100 text-violet-700 shadow-sm border-l-4 border-violet-600' 
      : 'text-gray-700'
  ]
}

const getRegularIconClasses = (href: string) => {
  const isActive = isExactMatch(href)
  return [
    'group-hover:text-gray-500',
    isActive ? 'text-violet-600' : 'text-gray-400'
  ]
}

// Auto-show children view when a child route is active
const autoShowChildrenForActiveRoute = () => {
  sidebarSections.forEach((section, sectionIndex) => {
    section.items.forEach((item, itemIndex) => {
      if (item.children && isActiveParent(item) && !isExactMatch(item.href)) {
        // If we're on a child route, show the children view
        const activeChild = item.children.find((child: any) => route.path === child.href)
        if (activeChild) {
          currentParentItem.value = item
          showChildrenView.value = true
        }
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

// Handle window resize
const handleResize = () => {
  if (window.innerWidth >= 768) {
    isSidebarOpen.value = false
  }
}

// Close sidebar and reset children view on route change (mobile)
watch(() => route.path, () => {
  autoShowChildrenForActiveRoute()
  if (window.innerWidth < 768) {
    closeSidebar()
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
  autoShowChildrenForActiveRoute()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Custom scrollbar for sidebar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced hover effects */
.group:hover .group-hover\:text-gray-500 {
  color: rgb(107 114 128);
}

/* Active state enhancements */
.border-l-4 {
  border-left-width: 4px;
}

.border-l-2 {
  border-left-width: 2px;
}

/* Smooth max-height transitions for dropdowns */
.max-h-0 {
  max-height: 0;
}

.max-h-96 {
  max-height: 24rem;
}
</style>
