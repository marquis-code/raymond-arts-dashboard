<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100/20 rounded-full blur-xl animate-pulse delay-500"></div>
    </div>

    <!-- Header -->
     <!-- {{activePromosale}} -->
    <header class="relative z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4 lg:py-6">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur opacity-20 animate-pulse"></div>
              <div class="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg transform hover:scale-110 transition-all duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
            <div>
              <h1 class="text-xl lg:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                PromoSales Manager
              </h1>
              <p class="text-gray-600 text-sm hidden sm:block">Manage your promotional campaigns</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <button
              @click="refreshData"
              :disabled="fetchingPromoSales"
              class="group relative overflow-hidden bg-white hover:bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div class="relative flex items-center space-x-2">
                <svg class="w-4 h-4" :class="{ 'animate-spin': fetchingPromoSales }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span class="hidden lg:inline">Refresh</span>
              </div>
            </button>
            
            <button
              @click="openCreateModal"
              class="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl px-6 py-3 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
            >
              <div class="relative flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>Create Promo</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 max-w-7xl mx-auto py-8">
      <!-- Active Promo Spotlight -->
      <div class="mb-12">
        <div class="flex items-center space-x-3 mb-8">
          <div class="relative">
            <div class="absolute inset-0 bg-green-500 rounded-full blur opacity-30 animate-pulse"></div>
            <div class="relative bg-green-500 p-2 rounded-full shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
          <h2 class="text-xl font-bold text-gray-900">Live Promotion Spotlight</h2>
        </div>
        
        <!-- Loading State -->
        <div v-if="fetchingActiveSale" class="relative overflow-hidden bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
          <div class="animate-pulse">
            <div class="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
              <div class="w-full lg:w-48 h-48 bg-gray-200 rounded-xl"></div>
              <div class="flex-1 space-y-4">
                <div class="h-8 bg-gray-200 rounded-xl w-3/4"></div>
                <div class="h-6 bg-gray-200 rounded-lg w-1/2"></div>
                <div class="h-6 bg-gray-200 rounded-lg w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Active Promotion Display -->
        <div v-else-if="activePromosale" class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-green-100/50 to-emerald-100/50 rounded-xl blur-xl"></div>
          <div class="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-xl p-8 shadow-xl border border-green-200">
            <!-- Floating Elements -->
            <div class="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div class="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            
            <div class="relative z-10">
              <!-- Status Badges -->
              <div class="flex flex-wrap items-center gap-3 mb-6">
                <div class="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <div class="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                  <span class="text-white font-semibold">🚀 LIVE NOW</span>
                </div>
                <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <span class="text-white font-medium">Priority {{ activePromosale.priority }}</span>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Content Section -->
                <div class="lg:col-span-2 space-y-6">
                  <div>
                    <h3 class="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                      {{ activePromosale.title }}
                    </h3>
                    <p class="text-green-100 text-xl mb-6">{{ activePromosale.description }}</p>
                  </div>
                  
                  <!-- Discount Display -->
                  <div class="flex flex-wrap items-center gap-4">
                    <div class="relative">
                      <div class="absolute inset-0 bg-white/30 rounded-xl blur"></div>
                      <div class="relative bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
                        <span class="text-xl font-bold text-white">{{ activePromosale.discountPercentage }}% OFF</span>
                      </div>
                    </div>
                    <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                      <span class="text-white font-medium">{{ activePromosale.actionText }}</span>
                    </div>
                  </div>

                  <!-- Countdown Timer -->
                  <div v-if="!activePromosale.isLifetime && activePromosale.endDate" class="space-y-4">
                    <p class="text-green-100 text-lg font-semibold">⏰ Time Remaining:</p>
                    <div class="grid grid-cols-4 gap-3">
                      <div class="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 transform hover:scale-105 transition-transform">
                        <div class="text-xl font-bold text-white">{{ countdown.days }}</div>
                        <div class="text-green-200 text-sm font-medium">Days</div>
                      </div>
                      <div class="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 transform hover:scale-105 transition-transform">
                        <div class="text-xl font-bold text-white">{{ countdown.hours }}</div>
                        <div class="text-green-200 text-sm font-medium">Hours</div>
                      </div>
                      <div class="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 transform hover:scale-105 transition-transform">
                        <div class="text-xl font-bold text-white">{{ countdown.minutes }}</div>
                        <div class="text-green-200 text-sm font-medium">Min</div>
                      </div>
                      <div class="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 transform hover:scale-105 transition-transform">
                        <div class="text-xl font-bold text-white">{{ countdown.seconds }}</div>
                        <div class="text-green-200 text-sm font-medium">Sec</div>
                      </div>
                    </div>
                  </div>
                  
                  <div v-else-if="activePromosale.isLifetime" class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span class="text-white font-semibold">♾️ Lifetime Offer</span>
                  </div>
                </div>

                <!-- Image Section -->
                <div class="flex justify-center lg:justify-end">
                  <div class="relative group">
                    <div class="absolute inset-0 bg-white/20 rounded-xl blur-xl group-hover:blur-xl transition-all"></div>
                    <div v-if="activePromosale.imageUrl" class="relative w-full max-w-sm h-64 lg:h-80 rounded-xl overflow-hidden border-2 border-white/30 transform group-hover:scale-105 transition-all duration-500 shadow-xl">
                      <img :src="activePromosale.imageUrl" alt="Promo image" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="relative w-full max-w-sm h-64 lg:h-80 bg-white/20 backdrop-blur-sm rounded-xl border-2 border-white/30 flex items-center justify-center shadow-xl">
                      <svg class="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Button -->
              <div class="flex justify-end mt-8">
                <button
                  @click="confirmDeactivate(activePromosale)"
                  :disabled="deactivating"
                  class="group relative overflow-hidden bg-red-500/90 hover:bg-red-600 disabled:opacity-50 px-8 py-3 rounded-xl font-semibold text-white shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <span class="relative">{{ deactivating ? 'Deactivating...' : 'Deactivate Promo' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No Active Promotion -->
        <div v-else class="relative overflow-hidden bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-full blur-xl"></div>
            <div class="relative bg-gradient-to-r from-gray-100 to-gray-200 rounded-full p-8 w-32 h-32 mx-auto mb-8 transform hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg class="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <!-- {{activePromosale}} -->
          <h3 class="text-xl font-bold text-gray-900 mb-4">No Active Promotion</h3>
          <p class="text-gray-600 mb-8 text-lg max-w-md mx-auto">Launch your first promotional campaign to start driving sales and engagement</p>
          <button
            @click="openCreateModal"
            class="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl px-8 py-4 text-white font-semibold shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <div class="relative flex items-center space-x-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Create Your First Promo</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Stats Dashboard -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div class="group relative overflow-hidden bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative flex items-center space-x-4">
            <div class="bg-blue-100 p-4 rounded-xl">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <p class="text-gray-600 text-sm font-medium">Total Promos</p>
              <p class="text-xl font-bold text-gray-900">{{ promosales?.length || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="group relative overflow-hidden bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative flex items-center space-x-4">
            <div class="bg-green-100 p-4 rounded-xl">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p class="text-gray-600 text-sm font-medium">Active</p>
              <p class="text-xl font-bold text-gray-900">{{ activePromos.length }}</p>
            </div>
          </div>
        </div>
        
        <div class="group relative overflow-hidden bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-r from-yellow-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative flex items-center space-x-4">
            <div class="bg-yellow-100 p-4 rounded-xl">
              <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p class="text-gray-600 text-sm font-medium">Scheduled</p>
              <p class="text-xl font-bold text-gray-900">{{ scheduledPromos.length }}</p>
            </div>
          </div>
        </div>
        
        <div class="group relative overflow-hidden bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-r from-red-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative flex items-center space-x-4">
            <div class="bg-red-100 p-4 rounded-xl">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div>
              <p class="text-gray-600 text-sm font-medium">Expired</p>
              <p class="text-xl font-bold text-gray-900">{{ expiredPromos.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-xl p-6 mb-8 border border-gray-200 shadow-lg">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          <div class="flex-1">
            <div class="relative">
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search promotions..."
                class="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <select
              v-model="statusFilter"
              class="px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="scheduled">Scheduled</option>
              <option value="expired">Expired</option>
            </select>
            <button
              @click="clearFilters"
              class="px-6 py-4 text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap hover:bg-gray-50 rounded-xl"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Promotions Grid -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-xl font-bold text-gray-900 flex items-center">
            <svg class="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            All Promotions ({{ filteredPromos.length }})
          </h3>
        </div>
        
        <!-- Loading State -->
        <div v-if="fetchingPromoSales" class="p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-6"></div>
          <p class="text-gray-600 text-lg">Loading promotions...</p>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="filteredPromos.length === 0" class="p-12 text-center">
          <div class="bg-gray-100 rounded-full p-8 w-24 h-24 mx-auto mb-8">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-4">No Promotions Found</h3>
          <p class="text-gray-600 mb-8">{{ searchQuery || statusFilter ? 'Try adjusting your filters' : 'Get started by creating your first promotion' }}</p>
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create Promotion
          </button>
        </div>
        
        <!-- Promotions Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <div
            v-for="promo in filteredPromos"
            :key="promo._id"
            class="group relative overflow-hidden bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <!-- Promo Image -->
            <div class="relative h-48 overflow-hidden">
              <div v-if="promo.imageUrl" class="w-full h-full">
                <img :src="promo.imageUrl" alt="Promo image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div v-else class="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-4xl font-bold text-blue-600 mb-2">{{ promo.discountPercentage }}%</div>
                  <div class="text-blue-500 text-sm">OFF</div>
                </div>
              </div>
              
              <!-- Status Badge -->
              <div class="absolute top-4 left-4">
                <span :class="getStatusBadgeClass(promo.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                  {{ promo.status.toUpperCase() }}
                </span>
              </div>
              
              <!-- Discount Badge -->
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                <span class="text-gray-900 font-bold text-sm">{{ promo.discountPercentage }}% OFF</span>
              </div>
            </div>
            
            <!-- Content -->
            <div class="p-6">
              <h4 class="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{{ promo.title }}</h4>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ promo.description }}</p>
              
              <!-- Action Text -->
              <div class="flex items-center justify-between mb-4">
                <span class="bg-gray-100 px-3 py-1 rounded-lg text-gray-700 text-sm">{{ promo.actionText }}</span>
                <span class="text-gray-500 text-sm">Priority {{ promo.priority }}</span>
              </div>
              
              <!-- Countdown for Active Promos -->
              <div v-if="promo.status === 'active' && !promo.isLifetime && promo.endDate" class="mb-4">
                <div class="grid grid-cols-3 gap-2">
                  <div class="bg-gray-50 rounded-lg p-2 text-center border border-gray-200">
                    <div class="text-lg font-bold text-gray-900">{{ getCountdown(promo.endDate).days }}</div>
                    <div class="text-gray-500 text-xs">Days</div>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-2 text-center border border-gray-200">
                    <div class="text-lg font-bold text-gray-900">{{ getCountdown(promo.endDate).hours }}</div>
                    <div class="text-gray-500 text-xs">Hours</div>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-2 text-center border border-gray-200">
                    <div class="text-lg font-bold text-gray-900">{{ getCountdown(promo.endDate).minutes }}</div>
                    <div class="text-gray-500 text-xs">Min</div>
                  </div>
                </div>
              </div>
              
              <!-- Lifetime Badge -->
              <div v-else-if="promo.isLifetime" class="mb-4">
                <span class="inline-flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-lg text-gray-700 text-sm border border-gray-200">
                  <span>♾️</span>
                  <span>Lifetime</span>
                </span>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex items-center justify-between">
                <div class="flex space-x-2">
                  <button
                    @click="viewPromo(promo)"
                    class="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                    title="View Details"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button
                    @click="editPromo(promo)"
                    class="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                </div>
                
                <div class="flex space-x-2">
                  <button
                    v-if="promo.status !== 'active'"
                    @click="confirmActivate(promo)"
                    :disabled="activating"
                    class="p-2 bg-green-100 hover:bg-green-200 rounded-lg text-green-600 transition-colors disabled:opacity-50"
                    title="Activate"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                  <button
                    v-if="promo.status === 'active'"
                    @click="confirmDeactivate(promo)"
                    :disabled="deactivating"
                    class="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-yellow-600 transition-colors disabled:opacity-50"
                    title="Deactivate"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 4h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17.294 15M10 14l4-2c.707-.707 1.707-1.707 2.414-2.414"></path>
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(promo)"
                    :disabled="deleting"
                    class="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-bold text-gray-900 flex items-center">
            <svg class="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            {{ showEditModal ? 'Edit Promotion' : 'Create New Promotion' }}
          </h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-8">
          <!-- Image Upload Section -->
          <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 transition-all duration-300 hover:border-blue-400">
            <div class="text-center mb-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Promotion Cover Image</h3>
              <p class="text-gray-600">Upload an image for your promotion (recommended size: 800x400px)</p>
            </div>
            
            <div 
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
              :class="[
                'rounded-xl p-8 transition-all duration-300 flex flex-col items-center justify-center',
                isDragging ? 'bg-blue-50 border-blue-400' : 'bg-gray-50'
              ]"
            >
              <!-- Image Preview -->
              <div v-if="imagePreviewUrls.length > 0" class="mb-6 relative">
                <img :src="imagePreviewUrls[0]" alt="Preview" class="w-full max-w-md h-auto rounded-xl shadow-lg" />
                <button 
                  @click.prevent="clearImage" 
                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <!-- Upload Controls -->
              <div v-if="imagePreviewUrls.length === 0" class="text-center">
                <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p class="text-gray-600 mb-4">Drag and drop an image here, or</p>
                <input 
                  type="file" 
                  id="image-upload" 
                  accept="image/*" 
                  @change="handleImageUpload" 
                  class="hidden" 
                />
                <label 
                  for="image-upload" 
                  class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 cursor-pointer transition-all transform hover:scale-105 shadow-lg"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                  Browse Files
                </label>
              </div>
              
              <!-- Upload Loader -->
              <div v-if="uploadingSingle" class="mt-6 flex flex-col items-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p class="text-gray-600">Uploading image...</p>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div>
                <label class="block text-lg font-semibold text-gray-900 mb-3">Promotion Title *</label>
                <input
                  v-model="promoForm.title"
                  type="text"
                  required
                  class="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter promotion title"
                />
              </div>
              
              <div>
                <label class="block text-lg font-semibold text-gray-900 mb-3">Action Text *</label>
                <input
                  v-model="promoForm.actionText"
                  type="text"
                  required
                  class="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Shop Now, Get Deal, Buy Now"
                />
              </div>
              
              <div>
                <label class="block text-lg font-semibold text-gray-900 mb-3">Description</label>
                <textarea
                  v-model="promoForm.description"
                  rows="4"
                  class="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter promotion description"
                ></textarea>
              </div>
            </div>
            
            <div class="space-y-6">
              <div>
                <label class="block text-lg font-semibold text-gray-900 mb-3">Discount Percentage *</label>
                <div class="relative">
                  <input
                    v-model.number="promoForm.discountPercentage"
                    type="number"
                    min="0"
                    max="100"
                    required
                    class="w-full px-4 py-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter discount percentage"
                  />
                  <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
                </div>
              </div>
              
              <div>
                <label class="block text-lg font-semibold text-gray-900 mb-3">Priority *</label>
                <input
                  v-model.number="promoForm.priority"
                  type="number"
                  min="1"
                  max="10"
                  required
                  class="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter priority (1-10)"
                />
                <p class="text-gray-500 text-sm mt-2">Higher numbers = higher priority</p>
              </div>
              
              <div class="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <input
                  v-model="promoForm.isLifetime"
                  type="checkbox"
                  id="isLifetime"
                  class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="isLifetime" class="ml-3 block text-gray-900 font-medium">
                  This is a lifetime promotion (no end date)
                </label>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label class="block text-lg font-semibold text-gray-900 mb-3">Start Date *</label>
              <input
                v-model="promoForm.startDate"
                type="datetime-local"
                required
                class="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label class="block text-lg font-semibold text-gray-900 mb-3">End Date</label>
              <input
                v-model="promoForm.endDate"
                type="datetime-local"
                :disabled="promoForm.isLifetime"
                class="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-200">
            <button
              type="button"
              @click="closeModal"
              class="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="creating || updating || uploadingSingle"
              class="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg transform hover:scale-105"
            >
              {{ (creating || updating) ? 'Saving...' : (showEditModal ? 'Update' : 'Create') }} Promotion
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Details Modal -->
    <div v-if="showViewModal && selectedPromo" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-bold text-gray-900 flex items-center">
            <svg class="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            Promotion Details
          </h2>
          <button
            @click="showViewModal = false"
            class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="space-y-8">
          <!-- Promo Image -->
          <div v-if="selectedPromo.imageUrl" class="mb-8">
            <img :src="selectedPromo.imageUrl" alt="Promotion cover" class="w-full h-64 object-cover rounded-xl shadow-lg" />
          </div>
          
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 text-white">
            <h3 class="text-xl font-bold mb-4">{{ selectedPromo.title }}</h3>
            <p class="text-blue-100 mb-6 text-lg">{{ selectedPromo.description }}</p>
            <div class="flex flex-wrap items-center gap-4">
              <span class="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-bold text-xl">{{ selectedPromo.discountPercentage }}% OFF</span>
              <span :class="getStatusBadgeClass(selectedPromo.status)" class="px-6 py-3 rounded-xl font-semibold">
                {{ selectedPromo.status.toUpperCase() }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 class="font-bold text-gray-900 mb-3 text-lg">Action Text</h4>
                <p class="text-gray-600">{{ selectedPromo.actionText }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 class="font-bold text-gray-900 mb-3 text-lg">Priority</h4>
                <p class="text-gray-600">{{ selectedPromo.priority }}</p>
              </div>
            </div>
            <div class="space-y-6">
              <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 class="font-bold text-gray-900 mb-3 text-lg">Start Date</h4>
                <p class="text-gray-600">{{ formatDateTime(selectedPromo.startDate) }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 class="font-bold text-gray-900 mb-3 text-lg">End Date</h4>
                <p class="text-gray-600">{{ selectedPromo.isLifetime ? 'Lifetime Promotion' : formatDateTime(selectedPromo.endDate) }}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4 pt-8 border-t border-gray-200">
            <button
              @click="editPromo(selectedPromo)"
              class="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Edit Promotion
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modals -->
    <!-- Activate Confirmation -->
    <div v-if="showActivateConfirm" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl p-8 w-full max-w-md shadow-xl border border-gray-200">
        <div class="text-center">
          <div class="bg-green-100 rounded-full p-6 w-20 h-20 mx-auto mb-8">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Activate Promotion</h3>
          <p class="text-gray-600 mb-8">Are you sure you want to activate "{{ confirmPromo?.title }}"? This will make it live for customers.</p>
          <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              @click="showActivateConfirm = false"
              class="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleActivate"
              :disabled="activating"
              class="flex-1 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {{ activating ? 'Activating...' : 'Activate' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Deactivate Confirmation -->
    <div v-if="showDeactivateConfirm" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl p-8 w-full max-w-md shadow-xl border border-gray-200">
        <div class="text-center">
          <div class="bg-yellow-100 rounded-full p-6 w-20 h-20 mx-auto mb-8">
            <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Deactivate Promotion</h3>
          <p class="text-gray-600 mb-8">Are you sure you want to deactivate "{{ confirmPromo?.title }}"? This will stop the promotion immediately.</p>
          <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              @click="showDeactivateConfirm = false"
              class="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleDeactivate"
              :disabled="deactivating"
              class="flex-1 px-6 py-4 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 disabled:opacity-50 transition-colors"
            >
              {{ deactivating ? 'Deactivating...' : 'Deactivate' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl p-8 w-full max-w-md shadow-xl border border-gray-200">
        <div class="text-center">
          <div class="bg-red-100 rounded-full p-6 w-20 h-20 mx-auto mb-8">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Delete Promotion</h3>
          <p class="text-gray-600 mb-8">Are you sure you want to delete "{{ confirmPromo?.title }}"? This action cannot be undone.</p>
          <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              @click="showDeleteConfirm = false"
              class="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleDelete"
              :disabled="deleting"
              class="flex-1 px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <!-- <div class="fixed top-4 right-4 z-50 space-y-3">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'px-6 py-4 rounded-xl shadow-xl transform transition-all duration-500 max-w-sm backdrop-blur-xl border',
          toast.type === 'success' ? 'bg-green-500 text-white border-green-400' : 
          toast.type === 'error' ? 'bg-red-500 text-white border-red-400' : 
          'bg-blue-500 text-white border-blue-400',
          'animate-slide-in-right'
        ]"
      >
        <div class="flex items-center">
          <svg v-if="toast.type === 'success'" class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <svg v-else-if="toast.type === 'error'" class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <svg v-else class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="font-semibold">{{ toast.message }}</span>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { useActivatePromosale } from "@/composables/modules/promosales/useActivatePromosale"
import { useDeactivatePromosale } from "@/composables/modules/promosales/useDeactivatePromosale"
import { useCreatePromosale } from "@/composables/modules/promosales/useCreatePromosale"
import { useDeletePromosale } from "@/composables/modules/promosales/useDeletePromosale"
import { useFetchActivePromosale } from "@/composables/modules/promosales/useFetchActivePromosale"
import { useFetchPromosaleById } from "@/composables/modules/promosales/useFetchPromosaleById"
import { useFetchPromosales } from "@/composables/modules/promosales/useFetchPromosales"
import { useUpdatePromosale } from "@/composables/modules/promosales/useUpdatePromosale"
import { useSingleUploadFile } from "@/composables/core/useSingleUpload"
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Composables
const { activatePromosale, loading: activating } = useActivatePromosale()
const { createPromosale, loading: creating } = useCreatePromosale()
const { deactivatePromosale, loading: deactivating } = useDeactivatePromosale()
const { deletePromosale, loading: deleting } = useDeletePromosale()
const { fetchActivePromosale, activePromosale, loading: fetchingActiveSale } = useFetchActivePromosale()
const { fetchPromosaleById, promosale, loading: fetchingPromoSaleById } = useFetchPromosaleById()
const { fetchPromosales, promosales, loading: fetchingPromoSales } = useFetchPromosales()
const { updatePromosale, loading: updating } = useUpdatePromosale()
const { singleUploadFile, loading: uploadingSingle, uploadResponse: singleUploadResponse } = useSingleUploadFile()

// Reactive state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const showActivateConfirm = ref(false)
const showDeactivateConfirm = ref(false)
const showDeleteConfirm = ref(false)
const selectedPromo = ref(null)
const confirmPromo = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const isDragging = ref(false)
const imagePreviewUrls = ref([])

// Countdown timer
const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let countdownInterval = null

definePageMeta({
  layout: 'dashboard'
})
// Form data
const promoForm = ref({
  title: '',
  description: '',
  discountPercentage: 0,
  priority: 1,
  startDate: '',
  endDate: '',
  actionText: '',
  isLifetime: false,
  imageUrl: ''
})

// Toast notifications
const toasts = ref([])
let toastId = 0

// Computed properties
const filteredPromos = computed(() => {
  if (!promosales.value) return []
  
  let filtered = [...promosales.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(promo => 
      promo.title?.toLowerCase().includes(query) ||
      promo.description?.toLowerCase().includes(query) ||
      promo.actionText?.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(promo => promo.status === statusFilter.value)
  }
  
  return filtered
})

const activePromos = computed(() => {
  return promosales.value?.filter(promo => promo.status === 'active') || []
})

const scheduledPromos = computed(() => {
  return promosales.value?.filter(promo => promo.status === 'scheduled') || []
})

const expiredPromos = computed(() => {
  return promosales.value?.filter(promo => promo.status === 'expired') || []
})

// Countdown functions
const updateCountdown = () => {
  if (!activePromosale.value || activePromosale.value.isLifetime || !activePromosale.value.endDate) {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }

  const now = new Date().getTime()
  const endTime = new Date(activePromosale.value.endDate).getTime()
  const distance = endTime - now

  if (distance > 0) {
    countdown.value = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    }
  } else {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
}

const getCountdown = (endDate) => {
  if (!endDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  
  const now = new Date().getTime()
  const endTime = new Date(endDate).getTime()
  const distance = endTime - now

  if (distance > 0) {
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    }
  }
  
  return { days: 0, hours: 0, minutes: 0, seconds: 0 }
}

// Image upload handlers
const handleImageUpload = async (event) => {
  const input = event.target
  if (!input.files || input.files.length === 0) return

  const files = Array.from(input.files)

  for (const file of files) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreviewUrls.value = [e.target.result]
      }
    }
    reader.readAsDataURL(file)
  }

  await uploadFiles(files)
}

const handleFileDrop = async (event) => {
  isDragging.value = false
  if (!event.dataTransfer?.files) return

  const files = Array.from(event.dataTransfer.files).filter((file) =>
    file.type.startsWith("image/")
  )

  if (files.length === 0) return

  for (const file of files) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreviewUrls.value = [e.target.result]
      }
    }
    reader.readAsDataURL(file)
  }

  await uploadFiles(files)
}

const uploadFiles = async (files) => {
  try {
    if (files.length === 1) {
      await singleUploadFile(files[0]).then(() => {
        promoForm.value.imageUrl = singleUploadResponse.value.url
        showToast('Image uploaded successfully!', 'success')
      })
    }
  } catch (error) {
    console.error("Error uploading files:", error)
    showToast('Failed to upload image', 'error')
  }
}

const clearImage = () => {
  imagePreviewUrls.value = []
  promoForm.value.imageUrl = ''
}

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'active': 'bg-green-100 text-green-800 border-green-200',
    'inactive': 'bg-gray-100 text-gray-800 border-gray-200',
    'scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
    'expired': 'bg-red-100 text-red-800 border-red-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

const showToast = (message, type = 'success') => {
  const toast = {
    id: ++toastId,
    message,
    type
  }
  toasts.value.push(toast)
  setTimeout(() => {
    const index = toasts.value.findIndex(t => t.id === toast.id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }, 5000)
}

// Modal functions
const openCreateModal = () => {
  resetForm()
  showCreateModal.value = true
}

const editPromo = (promo) => {
  selectedPromo.value = promo
  promoForm.value = {
    title: promo.title || '',
    description: promo.description || '',
    discountPercentage: promo.discountPercentage || 0,
    priority: promo.priority || 1,
    startDate: promo.startDate ? new Date(promo.startDate).toISOString().slice(0, 16) : '',
    endDate: promo.endDate ? new Date(promo.endDate).toISOString().slice(0, 16) : '',
    actionText: promo.actionText || '',
    isLifetime: promo.isLifetime || false,
    imageUrl: promo.imageUrl || ''
  }
  
  if (promo.imageUrl) {
    imagePreviewUrls.value = [promo.imageUrl]
  } else {
    imagePreviewUrls.value = []
  }
  
  showViewModal.value = false
  showEditModal.value = true
}

const viewPromo = (promo) => {
  selectedPromo.value = promo
  showViewModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showViewModal.value = false
  selectedPromo.value = null
  resetForm()
  imagePreviewUrls.value = []
}

const resetForm = () => {
  promoForm.value = {
    title: '',
    description: '',
    discountPercentage: 0,
    priority: 1,
    startDate: '',
    endDate: '',
    actionText: '',
    isLifetime: false,
    imageUrl: ''
  }
}

// Confirmation functions
const confirmActivate = (promo) => {
  confirmPromo.value = promo
  showActivateConfirm.value = true
}

const confirmDeactivate = (promo) => {
  confirmPromo.value = promo
  showDeactivateConfirm.value = true
}

const confirmDelete = (promo) => {
  confirmPromo.value = promo
  showDeleteConfirm.value = true
}

// Action handlers
const handleActivate = async () => {
  try {
    await activatePromosale(confirmPromo.value._id)
    showToast('Promotion activated successfully!', 'success')
    await refreshData()
  } catch (error) {
    showToast('Failed to activate promotion', 'error')
  } finally {
    showActivateConfirm.value = false
    confirmPromo.value = null
  }
}

const handleDeactivate = async () => {
  try {
    await deactivatePromosale(confirmPromo.value._id)
    showToast('Promotion deactivated successfully!', 'success')
    await refreshData()
  } catch (error) {
    showToast('Failed to deactivate promotion', 'error')
  } finally {
    showDeactivateConfirm.value = false
    confirmPromo.value = null
  }
}

const handleDelete = async () => {
  try {
    await deletePromosale(confirmPromo.value._id)
    showToast('Promotion deleted successfully!', 'success')
    await refreshData()
  } catch (error) {
    // showToast('Failed to delete promotion', 'error')
  } finally {
    showDeleteConfirm.value = false
    confirmPromo.value = null
  }
}

const submitForm = async () => {
  try {
    const formData = { ...promoForm.value }
    
    if (formData.startDate) {
      formData.startDate = new Date(formData.startDate).toISOString()
    }
    
    if (formData.isLifetime) {
      delete formData.endDate
    } else if (formData.endDate) {
      formData.endDate = new Date(formData.endDate).toISOString()
    }
    
    if (showEditModal.value && selectedPromo.value) {
      await updatePromosale(selectedPromo.value._id, formData)
      showToast('Promotion updated successfully!', 'success')
    } else {
      await createPromosale(formData)
      showToast('Promotion created successfully!', 'success')
    }
    
    closeModal()
    await refreshData()
  } catch (error) {
    // showToast('Failed to save promotion', 'error')
  }
}

const refreshData = async () => {
  // Refresh all data
  await Promise.all([
    fetchPromosales(),
    fetchActivePromosale()
  ])
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
}

// Lifecycle
onMounted(async () => {
  await refreshData()
  
  // Start countdown timer
  countdownInterval = setInterval(updateCountdown, 1000)
  updateCountdown()
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<style scoped>
@keyframes slide-in-right {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.5s ease-out forwards;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>