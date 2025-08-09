
<template>
  <div class="h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
     <!-- Animated Background Elements  -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-10 left-10 w-32 h-32 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-4 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-20 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

     <!-- Mobile Header  -->
    <div class="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg z-50 relative">
      <div class="flex items-center">
        <button 
          @click="toggleSidebar" 
          class="mr-3 p-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <Menu class="h-5 w-5" />
        </button>
        <div class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <img src="@/assets/img/raymond-logo.png" class="h-6 w-6" />
          </div>
          <div class="animate-fade-in-up">
            <h1 class="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              {{ currentPageTitle }}
            </h1>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button class="p-2 rounded-xl bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
          <Bell class="h-5 w-5 text-gray-600" />
        </button>
        <button 
          @click="isUserMenuOpen = !isUserMenuOpen" 
          class="relative p-1 rounded-xl bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <img src="https://i.pravatar.cc/150?img=32" alt="User" class="h-8 w-8 rounded-lg" />
        </button>
      </div>
    </div>

     <!-- Sidebar Overlay for Mobile  -->
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isSidebarOpen" 
        @click="closeSidebar"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
      ></div>
    </transition>

     <!-- Sidebar Container  -->
    <div 
      class="fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl transform transition-all duration-500 ease-out md:relative md:z-0 md:translate-x-0 md:flex-shrink-0 overflow-hidden"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
       <!-- Sidebar Background Gradient  -->
      <div class="absolute inset-0 bg-gradient-to-b from-violet-50/50 via-white/80 to-purple-50/50"></div>
      
       <!-- Main Sidebar View  -->
      <div 
        class="absolute inset-0 transition-all duration-500 ease-out transform"
        :class="showChildrenView ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'"
      >
         <!-- Sidebar Header  -->
        <div class="flex items-center justify-between h-16 px-6 border-b border-white/20 relative z-10">
          <div class="flex items-center space-x-3 animate-fade-in-right">
            <div class="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
              <img src="@/assets/img/raymond-logo.png" class="h-8 w-8" />
            </div>
            <div class="hidden md:block">
              <h2 class="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h2>
              <p class="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <button 
            @click="closeSidebar" 
            class="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transform hover:scale-105 transition-all duration-300"
          >
            <X class="h-5 w-5 text-gray-600" />
          </button>
        </div>

         <!-- Main Sidebar Content  -->
        <div class="flex-1 flex flex-col min-h-0 relative z-10">
  <!-- Scrollable Navigation Area -->
  <div class="flex-1 overflow-y-auto p-4 custom-scrollbar" style="max-height: calc(100vh - 8rem);">
    <nav class="space-y-6 pb-4">
      <div 
        v-for="(section, sectionIndex) in sidebarSections" 
        :key="sectionIndex" 
        class="animate-fade-in-up"
        :style="{ animationDelay: `${sectionIndex * 100}ms` }"
      >
        <h3 class="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center sticky top-0 bg-white/90 backdrop-blur-sm py-2 z-10">
          <div class="w-2 h-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full mr-2"></div>
          {{ section.title }}
        </h3>
        
        <div class="space-y-1">
          <div 
            v-for="(item, itemIndex) in section.items" 
            :key="item.name" 
            class="group animate-slide-in-left"
            :style="{ animationDelay: `${(sectionIndex * 100) + (itemIndex * 50)}ms` }"
          >
            <!-- Item with children -->
            <button 
              v-if="item.children && item.children.length > 0"
              @click="showChildren(item, sectionIndex, itemIndex)"
              class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ease-out transform hover:translate-x-2 hover:scale-105 relative overflow-hidden group"
              :class="getParentItemClasses(item)"
            >
              <!-- Hover background effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div class="flex items-center relative z-10">
                <div class="p-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-110" :class="getParentIconBgClasses(item)">
                  <component 
                    :is="item.icon" 
                    class="h-5 w-5 transition-all duration-300" 
                    :class="getParentIconClasses(item)" 
                  />
                </div>
                <span class="transition-all duration-300">{{ item.name }}</span>
              </div>
              
              <div class="flex items-center space-x-2 relative z-10">
                <span v-if="item.children" class="text-xs bg-violet-100 text-violet-600 px-2 py-1 rounded-full font-medium">
                  {{ item.children.length }}
                </span>
                <ChevronRight 
                  class="h-4 w-4 transition-all duration-300 group-hover:translate-x-1" 
                  :class="isActiveParent(item) ? 'text-violet-600' : 'text-gray-400'" 
                />
              </div>
            </button>

            <!-- Regular menu item -->
            <NuxtLink 
              v-else
              :to="item.href"
              class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ease-out transform hover:translate-x-2 hover:scale-105 relative overflow-hidden group"
              :class="getRegularItemClasses(item.href)"
              @click="closeSidebar"
            >
              <!-- Hover background effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div class="p-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-110" :class="getRegularIconBgClasses(item.href)">
                <component 
                  :is="item.icon" 
                  class="h-5 w-5 transition-all duration-300" 
                  :class="getRegularIconClasses(item.href)" 
                />
              </div>
              
              <span class="transition-all duration-300 relative z-10">{{ item.name }}</span>
              
              <!-- Active indicator -->
              <div 
                v-if="isExactMatch(item.href)"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-violet-600 rounded-full animate-pulse"
              ></div>
              
              <!-- Notification badge (example) -->
              <div 
                v-if="item.name === 'Notifications'"
                class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce"
              ></div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>
  </div>
</div>

         <!-- Main Sidebar Footer  -->
        <div class="border-t border-white/20 p-4 bg-white/50 backdrop-blur-sm relative z-10">
          <div class="flex items-center p-3 rounded-xl bg-white/80 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div class="relative">
              <img src="https://i.pravatar.cc/150?img=32" alt="User" class="h-10 w-10 rounded-xl shadow-md" />
              <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-semibold text-gray-800">{{ `${user?.firstName} ${user?.lastName}` || 'Admin' }}</p>
              <p class="text-xs text-gray-500">{{ user?.email || 'admin@gmail.com' }}</p>
            </div>
            <button 
              @click="logOut" 
              class="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-300 transform hover:scale-110"
            >
              <LogOut class="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

       <!-- Children Sidebar View  -->
      <div 
        class="absolute inset-0 transition-all duration-500 ease-out transform"
        :class="showChildrenView ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'"
      >
         <!-- Children Header  -->
        <div class="flex items-center h-16 px-6 border-b border-white/20 bg-gradient-to-r from-violet-50 to-purple-50 relative z-10">
          <button 
            @click="hideChildren"
            class="mr-4 p-2 hover:bg-violet-100 rounded-xl transition-all duration-300 transform hover:scale-110"
          >
            <ChevronLeft class="h-5 w-5 text-violet-600" />
          </button>
          
          <div class="flex items-center animate-fade-in-right">
            <div class="p-2 bg-violet-100 rounded-lg mr-3">
              <component :is="currentParentItem?.icon" class="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-violet-900">{{ currentParentItem?.name }}</h3>
              <p class="text-sm text-violet-600">{{ currentParentItem?.children?.length }} sub-items</p>
            </div>
          </div>
        </div>

         <!-- Children Content  -->
        <div class="flex-1 flex flex-col min-h-0 relative z-10">
  <!-- Scrollable Children Area -->
  <div class="flex-1 overflow-y-auto p-4 custom-scrollbar" style="max-height: calc(100vh - 10rem);">
    <nav class="space-y-2 pb-4">
      <!-- Parent item as overview -->
      <NuxtLink 
        v-if="currentParentItem"
        :to="currentParentItem.href"
        class="flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-300 ease-out transform hover:translate-x-2 hover:scale-105 relative overflow-hidden group border-2 border-dashed border-violet-200 hover:border-violet-400 mb-4 animate-fade-in-up"
        :class="getRegularItemClasses(currentParentItem.href)"
        @click="closeSidebar"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div class="p-3 bg-violet-100 rounded-xl mr-4 transition-all duration-300 group-hover:scale-110">
          <component :is="currentParentItem.icon" class="h-6 w-6 text-violet-600" />
        </div>
        
        <div class="relative z-10">
          <span class="font-bold text-base">{{ currentParentItem.name }}</span>
          <p class="text-xs text-gray-500 mt-1">Main Overview & Dashboard</p>
        </div>
        
        <div v-if="isExactMatch(currentParentItem.href)" class="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div class="w-3 h-3 bg-violet-600 rounded-full animate-pulse"></div>
        </div>
      </NuxtLink>

      <!-- Children items -->
      <div class="space-y-1">
        <NuxtLink 
          v-for="(child, index) in currentParentItem?.children" 
          :key="child.name"
          :to="child.href"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ease-out transform hover:translate-x-2 hover:scale-105 relative overflow-hidden group animate-slide-in-left"
          :class="getChildItemClasses(child.href)"
          :style="{ animationDelay: `${index * 100}ms` }"
          @click="closeSidebar"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div class="mr-4 h-8 w-8 flex items-center justify-center relative z-10">
            <div class="w-3 h-3 rounded-full transition-all duration-300 group-hover:scale-125" 
                 :class="isExactMatch(child.href) ? 'bg-violet-600 shadow-lg' : 'bg-gray-300'">
            </div>
            <div v-if="isExactMatch(child.href)" class="absolute inset-0 w-3 h-3 bg-violet-600 rounded-full animate-ping opacity-75"></div>
          </div>
          
          <span class="transition-all duration-300 relative z-10">{{ child.name }}</span>
          
          <div v-if="isExactMatch(child.href)" class="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div class="w-2 h-2 bg-violet-600 rounded-full animate-pulse"></div>
          </div>
        </NuxtLink>
      </div>
    </nav>
  </div>
</div>

         <!-- Children Footer  -->
        <div class="border-t border-white/20 p-4 bg-gradient-to-r from-violet-50/50 to-purple-50/50 relative z-10">
          <button 
            @click="hideChildren"
            class="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-violet-600 hover:text-violet-800 hover:bg-violet-100 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <ChevronLeft class="mr-2 h-4 w-4" />
            Back to Main Menu
          </button>
        </div>
      </div>
    </div>

     <!-- Main Content  -->
    <div class="flex-1 flex flex-col overflow-hidden relative z-10">
       <!-- Desktop Header  -->
      <header class="hidden md:flex items-center justify-between h-28 bg-white/80 backdrop-blur-md border-b border-white/20 px-6 shadow-lg">
        <div class="animate-fade-in-right">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {{ currentPageTitle }}
          </h1>
          <p class="text-sm text-gray-500 mt-1">{{ getCurrentPageDescription() }}</p>
        </div>

        <div class="flex items-center space-x-4">
           <!-- Quick Actions  -->
          <div class="flex items-center space-x-2">
            <button class="p-2 rounded-xl bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 relative">
              <Bell class="h-5 w-5 text-gray-600" />
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
            </button>
            
            <button class="p-2 rounded-xl bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              <Settings class="h-5 w-5 text-gray-600" />
            </button>
          </div>

           <!-- User Menu  -->
          <div class="relative" ref="userMenuContainer">
            <button 
              @click="isUserMenuOpen = !isUserMenuOpen" 
              class="flex items-center hover:bg-white/80 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <div class="relative">
                <img src="https://i.pravatar.cc/150?img=32" alt="User" class="h-8 w-8 rounded-lg" />
                <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <span class="ml-3 text-sm font-medium text-gray-700">{{ `${user?.firstName} ${user?.lastName}` || 'Admin' }}</span>
              <ChevronDown 
                class="ml-2 h-4 w-4 text-gray-500 transition-transform duration-300" 
                :class="isUserMenuOpen ? 'rotate-180' : ''" 
              />
            </button>

             <!-- User dropdown menu  -->
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 scale-95 transform -translate-y-4"
              enter-to-class="opacity-100 scale-100 transform translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 scale-100 transform translate-y-0"
              leave-to-class="opacity-0 scale-95 transform -translate-y-4"
            >
              <div 
                v-if="isUserMenuOpen" 
                class="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl py-2 z-50 border border-white/20"
              >
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900">{{ `${user?.firstName} ${user?.lastName}` || 'Admin' }}</p>
                  <p class="text-xs text-gray-500">{{ user?.email || 'admin@gmail.com' }}</p>
                </div>
                
                <a href="#" class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-all duration-200 transform hover:translate-x-1">
                  <UserCheck class="h-4 w-4 mr-3" />
                  Your Profile
                </a>
                
                <a href="#" class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-all duration-200 transform hover:translate-x-1">
                  <Settings class="h-4 w-4 mr-3" />
                  Settings
                </a>
                
                <div class="border-t border-gray-100 mt-2 pt-2">
                  <a 
                    href="#" 
                    @click.prevent="logOut" 
                    class="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 transform hover:translate-x-1"
                  >
                    <LogOut class="h-4 w-4 mr-3" />
                    Sign out
                  </a>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </header>

       <!-- Content Area  -->
      <main class="flex-1 overflow-y-auto p-3 md:p-6 bg-gradient-to-br from-slate-50/50 via-white/30 to-slate-100/50 relative">
         <!-- Content wrapper with animation  -->
        <div class="animate-fade-in-up">
          <slot />
        </div>
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

// Enhanced styling functions with background classes
const getParentItemClasses = (item: any) => {
  const isActive = isActiveParent(item)
  return [
    'hover:bg-white/80 hover:text-gray-900 hover:shadow-lg',    
    isActive ? 'bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 shadow-lg border-l-4 border-violet-600' : 'text-gray-700'  
  ]
}

const getParentIconClasses = (item: any) => {
  const isActive = isActiveParent(item)
  return [
    'group-hover:text-violet-600',    
    isActive ? 'text-violet-600' : 'text-gray-500'  
  ]
}

const getParentIconBgClasses = (item: any) => {
  const isActive = isActiveParent(item)
  return [
    'group-hover:bg-violet-100',    
    isActive ? 'bg-violet-100' : 'bg-gray-100'  
  ]
}

const getChildItemClasses = (href: string) => {
  const isActive = isExactMatch(href)
  return [
    'hover:bg-white/80 hover:text-gray-900 hover:shadow-lg',    
    isActive ? 'bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 font-semibold border-l-2 border-violet-600 shadow-md' : 'text-gray-600'  
  ]
}

const getRegularItemClasses = (href: string) => {
  const isActive = isExactMatch(href)
  return [
    'hover:bg-white/80 hover:text-gray-900 hover:shadow-lg group',    
    isActive ? 'bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 shadow-lg border-l-4 border-violet-600' : 'text-gray-700'  
  ]
}

const getRegularIconClasses = (href: string) => {
  const isActive = isExactMatch(href)
  return [
    'group-hover:text-violet-600',    
    isActive ? 'text-violet-600' : 'text-gray-500'  
  ]
}

const getRegularIconBgClasses = (href: string) => {
  const isActive = isExactMatch(href)
  return [
    'group-hover:bg-violet-100',    
    isActive ? 'bg-violet-100' : 'bg-gray-100'  
  ]
}

// Get current page description
const getCurrentPageDescription = () => {
  const descriptions: Record<string, string> = {
    '/dashboard': 'Overview of your system',
    '/dashboard/sales': 'Track your sales performance',
    '/dashboard/transactions': 'Monitor all transactions',
    '/dashboard/products': 'Manage your product catalog',
    '/dashboard/payments': 'Handle payment processing',
    '/dashboard/orders': 'View and manage orders',
    '/dashboard/courses': 'Educational content management',
    // Add more descriptions as needed
  }
  return descriptions[route.path] || 'Manage your dashboard'
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
/* Enhanced Custom scrollbar with better visibility */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(139, 92, 246, 0.3) rgba(255, 255, 255, 0.1);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(139, 92, 246, 0.4), rgba(168, 85, 247, 0.4));
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(124, 58, 237, 0.6), rgba(147, 51, 234, 0.6));
}

.custom-scrollbar::-webkit-scrollbar-thumb:active {
  background: linear-gradient(to bottom, rgba(124, 58, 237, 0.8), rgba(147, 51, 234, 0.8));
}

/* Smooth scrolling behavior */
.custom-scrollbar {
  scroll-behavior: smooth;
}

/* Hide scrollbar on mobile for cleaner look, but keep functionality */
@media (max-width: 768px) {
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
}

/* Sticky section headers */
.sticky {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #8b5cf6, #a855f7);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #7c3aed, #9333ea);
}

/* Animation keyframes */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Animation classes */
.animate-blob {
  animation: blob 7s infinite;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animate-fade-in-right {
  animation: fade-in-right 0.6s ease-out forwards;
}

.animate-slide-in-left {
  animation: slide-in-left 0.5s ease-out forwards;
}

/* Animation delays */
.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Enhanced transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Backdrop blur support */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

.backdrop-blur-md {
  backdrop-filter: blur(12px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Gradient text */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* Active state enhancements */
.border-l-4 {
  border-left-width: 4px;
}

.border-l-2 {
  border-left-width: 2px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .w-80 {
    width: 85vw;
    max-width: 320px;
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Loading states */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Bounce animation */
.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8,0,1,1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0,0,0.2,1);
  }
}

/* Ping animation */
.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
