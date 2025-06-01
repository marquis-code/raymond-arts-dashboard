<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header Section -->
     <!-- {{promosales}} -->
    <header class="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-4">
            <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-3 rounded-2xl shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Promo Sales Manager
              </h1>
              <p class="text-gray-600 text-sm">Manage your promotional campaigns with ease</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="refreshData"
              :disabled="fetchingPromoSales"
              class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': fetchingPromoSales }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
            <button
              @click="openCreateModal"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Create Promo
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Active Promo Spotlight -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <svg class="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          Active Promotion Spotlight
        </h2>
        
        <div v-if="fetchingActiveSale" class="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
          <div class="animate-pulse flex space-x-4">
            <div class="rounded-full bg-slate-200 h-12 w-12"></div>
            <div class="flex-1 space-y-2 py-1">
              <div class="h-4 bg-slate-200 rounded w-3/4"></div>
              <div class="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        
        <div v-else-if="activePromosale" class="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-4">
                  <span class="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">🎉 LIVE NOW</span>
                  <span class="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Priority: {{ activePromosale.priority }}</span>
                </div>
                <h3 class="text-3xl font-bold mb-3">{{ activePromosale.title }}</h3>
                <p class="text-green-100 mb-4 text-lg">{{ activePromosale.description }}</p>
                <div class="flex items-center space-x-4 text-sm">
                  <span class="bg-white/30 px-4 py-2 rounded-xl font-semibold">{{ activePromosale.discountPercentage }}% OFF</span>
                  <span v-if="!activePromosale.isLifetime" class="bg-white/20 px-3 py-1 rounded-full">
                    Ends: {{ formatDate(activePromosale.endDate) }}
                  </span>
                  <span v-else class="bg-white/20 px-3 py-1 rounded-full">♾️ Lifetime</span>
                </div>
              </div>
              <div class="text-right ml-8">
                <div class="bg-white text-green-600 px-6 py-3 rounded-xl font-bold text-lg mb-4 shadow-lg">
                  {{ activePromosale.actionText }}
                </div>
                <button
                  @click="confirmDeactivate(activePromosale)"
                  :disabled="deactivating"
                  class="bg-red-500 hover:bg-red-600 disabled:opacity-50 px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {{ deactivating ? 'Deactivating...' : 'Deactivate' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-300 shadow-lg">
          <div class="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">No Active Promotion</h3>
          <p class="text-gray-600 mb-6">Create a new promotion or activate an existing one to get started</p>
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create First Promo
          </button>
        </div>
      </div>

      <!-- Stats Dashboard -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
          <div class="flex items-center">
            <div class="bg-blue-100 p-4 rounded-xl">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Promos</p>
              <p class="text-3xl font-bold text-gray-900">{{ promosales?.length || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
          <div class="flex items-center">
            <div class="bg-green-100 p-4 rounded-xl">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active</p>
              <p class="text-3xl font-bold text-gray-900">{{ activePromos.length }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
          <div class="flex items-center">
            <div class="bg-yellow-100 p-4 rounded-xl">
              <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Scheduled</p>
              <p class="text-3xl font-bold text-gray-900">{{ scheduledPromos.length }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
          <div class="flex items-center">
            <div class="bg-red-100 p-4 rounded-xl">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Expired</p>
              <p class="text-3xl font-bold text-gray-900">{{ expiredPromos.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-2xl shadow-lg border border-slate-200 mb-8">
        <div class="p-6">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div class="flex-1">
              <div class="relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search promotions..."
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div class="flex flex-wrap items-center space-x-4">
              <select
                v-model="statusFilter"
                class="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="EXPIRED">Expired</option>
              </select>
              <button
                @click="clearFilters"
                class="px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Promotions Table -->
      <div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200 bg-gray-50">
          <h3 class="text-xl font-bold text-gray-900 flex items-center">
            <svg class="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            All Promotions ({{ filteredPromos.length }})
          </h3>
        </div>
        
        <div class="overflow-x-auto">
          <div v-if="fetchingPromoSales" class="p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p class="text-gray-600">Loading promotions...</p>
          </div>
          
          <div v-else-if="filteredPromos.length === 0" class="p-12 text-center">
            <div class="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No Promotions Found</h3>
            <p class="text-gray-600 mb-6">{{ searchQuery || statusFilter ? 'Try adjusting your filters' : 'Get started by creating your first promotion' }}</p>
            <button
              @click="openCreateModal"
              class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Create Promotion
            </button>
          </div>
          
          <table v-else class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promotion</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="promo in filteredPromos"
                :key="promo._id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-12 w-12">
                      <div class="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span class="text-white font-bold text-lg">{{ promo.discountPercentage }}%</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ promo.title }}</div>
                      <div class="text-sm text-gray-500">{{ promo.description }}</div>
                      <div class="text-xs text-gray-400 mt-1">{{ promo.actionText }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-semibold text-gray-900">{{ promo.discountPercentage }}% OFF</div>
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusBadgeClass(promo.status)" class="inline-flex px-3 py-1 rounded-full text-xs font-medium">
                    {{ promo.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  <div>{{ formatDate(promo.startDate) }}</div>
                  <div class="text-gray-500">
                    {{ promo.isLifetime ? 'Lifetime' : formatDate(promo.endDate) }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {{ promo.priority }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="viewPromo(promo)"
                      class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <button
                      @click="editPromo(promo)"
                      class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      v-if="promo.status !== 'ACTIVE'"
                      @click="confirmActivate(promo)"
                      :disabled="activating"
                      class="p-2 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
                      title="Activate"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </button>
                    <button
                      v-if="promo.status === 'ACTIVE'"
                      @click="confirmDeactivate(promo)"
                      :disabled="deactivating"
                      class="p-2 text-gray-400 hover:text-yellow-600 transition-colors disabled:opacity-50"
                      title="Deactivate"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 4h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17.294 15M10 14l4-2c.707-.707 1.707-1.707 2.414-2.414"></path>
                      </svg>
                    </button>
                    <button
                      @click="confirmDelete(promo)"
                      :disabled="deleting"
                      class="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 flex items-center">
            <svg class="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Promotion Title *</label>
                <input
                  v-model="promoForm.title"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter promotion title"
                />
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Action Text *</label>
                <input
                  v-model="promoForm.actionText"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Shop Now, Get Deal, Buy Now"
                />
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                <textarea
                  v-model="promoForm.description"
                  rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter promotion description"
                ></textarea>
              </div>
            </div>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Discount Percentage *</label>
                <div class="relative">
                  <input
                    v-model.number="promoForm.discountPercentage"
                    type="number"
                    min="0"
                    max="100"
                    required
                    class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter discount percentage"
                  />
                  <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Priority *</label>
                <input
                  v-model.number="promoForm.priority"
                  type="number"
                  min="1"
                  max="10"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter priority (1-10)"
                />
                <p class="text-xs text-gray-500 mt-2">Higher numbers = higher priority</p>
              </div>
              
              <div class="flex items-center p-4 bg-blue-50 rounded-xl">
                <input
                  v-model="promoForm.isLifetime"
                  type="checkbox"
                  id="isLifetime"
                  class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="isLifetime" class="ml-3 block text-sm font-medium text-gray-900">
                  This is a lifetime promotion (no end date)
                </label>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Start Date *</label>
              <input
                v-model="promoForm.startDate"
                type="datetime-local"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">End Date</label>
              <input
                v-model="promoForm.endDate"
                type="datetime-local"
                :disabled="promoForm.isLifetime"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-4 pt-8 border-t border-gray-200">
            <button
              type="button"
              @click="closeModal"
              class="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="creating || updating"
              class="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              {{ (creating || updating) ? 'Saving...' : (showEditModal ? 'Update' : 'Create') }} Promotion
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Details Modal -->
    <div v-if="showViewModal && selectedPromo" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 flex items-center">
            <svg class="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <div class="space-y-6">
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
            <h3 class="text-2xl font-bold mb-2">{{ selectedPromo.title }}</h3>
            <p class="text-blue-100 mb-4">{{ selectedPromo.description }}</p>
            <div class="flex items-center space-x-4">
              <span class="bg-white/20 px-4 py-2 rounded-xl font-semibold">{{ selectedPromo.discountPercentage }}% OFF</span>
              <span :class="getStatusBadgeClass(selectedPromo.status)" class="px-4 py-2 rounded-xl font-semibold">
                {{ selectedPromo.status }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-xl p-4">
                <h4 class="font-semibold text-gray-900 mb-2">Action Text</h4>
                <p class="text-gray-600">{{ selectedPromo.actionText }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-4">
                <h4 class="font-semibold text-gray-900 mb-2">Priority</h4>
                <p class="text-gray-600">{{ selectedPromo.priority }}</p>
              </div>
            </div>
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-xl p-4">
                <h4 class="font-semibold text-gray-900 mb-2">Start Date</h4>
                <p class="text-gray-600">{{ formatDateTime(selectedPromo.startDate) }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-4">
                <h4 class="font-semibold text-gray-900 mb-2">End Date</h4>
                <p class="text-gray-600">{{ selectedPromo.isLifetime ? 'Lifetime Promotion' : formatDateTime(selectedPromo.endDate) }}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              @click="editPromo(selectedPromo)"
              class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
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
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div class="text-center">
          <div class="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Activate Promotion</h3>
          <p class="text-gray-600 mb-8">Are you sure you want to activate "{{ confirmPromo?.title }}"? This will make it live for customers.</p>
          <div class="flex space-x-4">
            <button
              @click="showActivateConfirm = false"
              class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleActivate"
              :disabled="activating"
              class="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {{ activating ? 'Activating...' : 'Activate' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Deactivate Confirmation -->
    <div v-if="showDeactivateConfirm" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div class="text-center">
          <div class="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
            <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Deactivate Promotion</h3>
          <p class="text-gray-600 mb-8">Are you sure you want to deactivate "{{ confirmPromo?.title }}"? This will stop the promotion immediately.</p>
          <div class="flex space-x-4">
            <button
              @click="showDeactivateConfirm = false"
              class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleDeactivate"
              :disabled="deactivating"
              class="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 disabled:opacity-50 transition-colors"
            >
              {{ deactivating ? 'Deactivating...' : 'Deactivate' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div class="text-center">
          <div class="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Delete Promotion</h3>
          <p class="text-gray-600 mb-8">Are you sure you want to delete "{{ confirmPromo?.title }}"? This action cannot be undone.</p>
          <div class="flex space-x-4">
            <button
              @click="showDeleteConfirm = false"
              class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleDelete"
              :disabled="deleting"
              class="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'px-6 py-4 rounded-xl shadow-lg transform transition-all duration-300 max-w-sm',
          toast.type === 'success' ? 'bg-green-500 text-white' : 
          toast.type === 'error' ? 'bg-red-500 text-white' : 
          'bg-blue-500 text-white'
        ]"
      >
        <div class="flex items-center">
          <svg v-if="toast.type === 'success'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <svg v-else-if="toast.type === 'error'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <svg v-else class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="font-medium">{{ toast.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useActivatePromosale } from "@/composables/modules/promosales/useActivatePromosale"
import { useDeactivatePromosale } from "@/composables/modules/promosales/useDeactivatePromosale"
import { useCreatePromosale } from "@/composables/modules/promosales/useCreatePromosale"
import { useDeletePromosale } from "@/composables/modules/promosales/useDeletePromosale"
import { useFetchActivePromosale } from "@/composables/modules/promosales/useFetchActivePromosale"
import { useFetchPromosaleById } from "@/composables/modules/promosales/useFetchPromosaleById"
import { useFetchPromosales } from "@/composables/modules/promosales/useFetchPromosales"
import { useUpdatePromosale } from "@/composables/modules/promosales/useUpdatePromosale"

// Composables
const { activatePromosale, loading: activating } = useActivatePromosale()
const { createPromosale, loading: creating } = useCreatePromosale()
const { deactivatePromosale, loading: deactivating } = useDeactivatePromosale()
const { deletePromosale, loading: deleting } = useDeletePromosale()
const { activePromosale, loading: fetchingActiveSale } = useFetchActivePromosale()
const { promosale, loading: fetchingPromoSaleById } = useFetchPromosaleById()
const { promosales, loading: fetchingPromoSales } = useFetchPromosales()
const { updatePromosale, loading: updating } = useUpdatePromosale()

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

// Form data
const promoForm = ref({
  title: '',
  description: '',
  discountPercentage: 0,
  priority: 1,
  startDate: '',
  endDate: '',
  actionText: '',
  isLifetime: false
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
  return promosales.value?.filter(promo => promo.status === 'ACTIVE') || []
})

const scheduledPromos = computed(() => {
  return promosales.value?.filter(promo => promo.status === 'SCHEDULED') || []
})

const expiredPromos = computed(() => {
  return promosales.value?.filter(promo => promo.status === 'EXPIRED') || []
})

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
    'ACTIVE': 'bg-green-100 text-green-800',
    'INACTIVE': 'bg-gray-100 text-gray-800',
    'SCHEDULED': 'bg-blue-100 text-blue-800',
    'EXPIRED': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
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
    isLifetime: promo.isLifetime || false
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
    isLifetime: false
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
    showToast('Failed to delete promotion', 'error')
  } finally {
    showDeleteConfirm.value = false
    confirmPromo.value = null
  }
}

const submitForm = async () => {
  try {
    const formData = { ...promoForm.value }
    
    // Convert dates to ISO strings
    if (formData.startDate) {
      formData.startDate = new Date(formData.startDate).toISOString()
    }
    if (formData.endDate && !formData.isLifetime) {
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
    showToast('Failed to save promotion', 'error')
  }
}

const refreshData = async () => {
  // Refresh all data
  await Promise.all([
    useFetchPromosales().fetchPromosales(),
    useFetchActivePromosale().fetchActivePromosale()
  ])
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
}

// Lifecycle
onMounted(async () => {
  await refreshData()
})

// Page meta
definePageMeta({
  layout: 'dashboard'
})
</script>