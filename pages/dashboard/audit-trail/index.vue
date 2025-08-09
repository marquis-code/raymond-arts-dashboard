<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="mb-8 animate-fade-in">
      <div class="flex justify-between items-start gap-8">
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
            <ClipboardListIcon class="w-4 h-4 text-white" />
          </div>
          <div class="flex flex-col gap-2">
            <h1 class="text-xl font-extrabold text-gray-900 leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Audit Trail System
            </h1>
            <p class="text-base text-gray-600 font-medium">
              Track all system activities and changes
            </p>
          </div>
        </div>
        
        <div class="flex gap-4 animate-slide-in-right">
          <div class="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-200 min-w-[120px] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div class="text-2xl font-bold text-indigo-600 leading-none">{{ filteredAuditTrails.length }}</div>
            <div class="text-sm text-gray-600 font-medium mt-1">Total Records</div>
          </div>
          <div class="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-200 min-w-[120px] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div class="text-2xl font-bold text-indigo-600 leading-none">{{ uniqueUsers.length }}</div>
            <div class="text-sm text-gray-600 font-medium mt-1">Active Users</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Filters Section -->
    <section class="mb-8 animate-slide-in-up">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <!-- Search Bar -->
        <div class="p-8 pb-0 mb-4">
          <div class="relative flex items-center">
            <SearchIcon class="absolute left-4 w-5 h-5 text-gray-400 z-10" />
            <input
              v-model="filters.searchQuery"
              type="text"
              placeholder="Search audit trails, users, actions..."
              class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-base bg-gray-50 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-lg transition-all duration-300"
            />
            <transition
              enter-active-class="transition-opacity duration-200"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition-opacity duration-150"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <button 
                v-if="filters.searchQuery" 
                @click="filters.searchQuery = ''" 
                class="absolute right-4 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                <XIcon class="w-4 h-4 text-gray-600" />
              </button>
            </transition>
          </div>
        </div>

        <!-- Filter Controls -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8 border-t overflow-x-auto border-gray-200">
          <div class="flex flex-col gap-3">
            <label class="flex items-center justify-between text-sm font-semibold text-gray-700">
              <span class="flex items-center gap-2">Action Type</span>
              <span v-if="filters.action" class="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md font-medium">
                ({{ filteredByAction.length }})
              </span>
            </label>
            <div class="relative">
              <select 
                v-model="filters.action" 
                class="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 cursor-pointer focus:outline-none focus:border-indigo-500 focus:shadow-lg transition-all duration-300 appearance-none"
              >
                <option :value="null">All Actions</option>
                <option v-for="action in uniqueActions" :key="action" :value="action">
                  {{ action }}
                </option>
              </select>
              <ChevronDownIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <label class="flex items-center justify-between text-sm font-semibold text-gray-700">
              <span class="flex items-center gap-2">Module</span>
              <span v-if="filters.module" class="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md font-medium">
                ({{ filteredByModule.length }})
              </span>
            </label>
            <div class="relative">
              <select 
                v-model="filters.module" 
                class="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 cursor-pointer focus:outline-none focus:border-indigo-500 focus:shadow-lg transition-all duration-300 appearance-none"
              >
                <option :value="null">All Modules</option>
                <option v-for="module in uniqueModules" :key="module" :value="module">
                  {{ module }}
                </option>
              </select>
              <ChevronDownIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <label class="flex items-center justify-between text-sm font-semibold text-gray-700">
              <span class="flex items-center gap-2">User</span>
              <span v-if="filters.user" class="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md font-medium">
                ({{ filteredByUser.length }})
              </span>
            </label>
            <div class="relative">
              <select 
                v-model="filters.user" 
                class="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 cursor-pointer focus:outline-none focus:border-indigo-500 focus:shadow-lg transition-all duration-300 appearance-none"
              >
                <option :value="null">All Users</option>
                <option v-for="user in uniqueUsers" :key="user.id" :value="user.id">
                  {{ user.name }}
                </option>
              </select>
              <ChevronDownIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div class="flex flex-col gap-3 md:col-span-2 lg:col-span-1">
            <label class="text-sm font-semibold text-gray-700">
              Date Range
            </label>
            <div class="flex items-center gap-4">
              <div class="relative flex-1">
                <CalendarIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  v-model="startDateInput"
                  type="date"
                  class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 focus:outline-none focus:border-indigo-500 focus:shadow-lg transition-all duration-300"
                />
              </div>
              <div class="flex items-center justify-center p-2 bg-gray-100 rounded-lg">
                <ArrowRightIcon class="w-4 h-4 text-gray-500" />
              </div>
              <div class="relative flex-1">
                <CalendarIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  v-model="endDateInput"
                  type="date"
                  class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 focus:outline-none focus:border-indigo-500 focus:shadow-lg transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-4 pt-10 px-8 pb-8 border-t border-gray-200 mt-4">
          <button 
            @click="resetFilters" 
            class="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 border-2 border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-200 hover:border-gray-300 transition-all duration-300"
          >
            <RefreshCwIcon class="w-4 h-4" />
            Reset Filters
          </button>
          <button 
            @click="exportToCSV" 
            class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <DownloadIcon class="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>
    </section>

    <!-- Results Section -->
    <section class="mb-8 opacity-0 animate-fade-in-delayed">
      <!-- Results Header with View Toggle -->
      <div class="flex justify-between items-center mb-6 px-2">
        <div class="flex flex-col gap-2">
          <h2 class="text-2xl font-bold text-gray-900">Audit Logs</h2>
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <span class="font-semibold text-indigo-600">{{ filteredAuditTrails.length }} records</span>
            <span class="text-gray-400">•</span>
            <span class="text-gray-500">Last updated {{ formatRelativeTime(new Date()) }}</span>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
            <button 
              @click="viewMode = 'grid'"
              :class="[
                'flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200',
                viewMode === 'grid' 
                  ? 'bg-white shadow-sm text-indigo-600' 
                  : 'text-gray-500 hover:bg-gray-200'
              ]"
              title="Grid View"
            >
              <GridIcon class="w-5 h-5" />
            </button>
            <button 
              @click="viewMode = 'list'"
              :class="[
                'flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200',
                viewMode === 'list' 
                  ? 'bg-white shadow-sm text-indigo-600' 
                  : 'text-gray-500 hover:bg-gray-200'
              ]"
              title="List View"
            >
              <ListIcon class="w-5 h-5" />
            </button>
          </div>
          
          <div class="flex items-center gap-2">
            <select 
              v-model="sortBy" 
              class="px-3 py-2 border-2 border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 cursor-pointer focus:outline-none focus:border-indigo-500 transition-all duration-300"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="action">Sort by Action</option>
              <option value="module">Sort by Module</option>
              <option value="user">Sort by User</option>
            </select>
            <button 
              @click="toggleSortOrder" 
              :title="sortOrder === 'desc' ? 'Newest First' : 'Oldest First'"
              class="flex items-center justify-center w-10 h-10 border-2 border-gray-200 bg-white rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-300"
            >
              <ArrowUpIcon v-if="sortOrder === 'asc'" class="w-4 h-4" />
              <ArrowDownIcon v-else class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-md border border-gray-200 text-center">
        <div class="mb-6">
          <div class="w-12 h-12 border-3 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Loading audit trails...</h3>
        <p class="text-gray-600">Please wait while we fetch the latest data</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-md border border-gray-200 text-center">
        <div class="flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6">
          <AlertTriangleIcon class="w-8 h-8 text-red-500" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
        <p class="text-gray-600 mb-8 max-w-md leading-relaxed">{{ error }}</p>
        <button 
          @click="fetchAuditTrails" 
          class="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 hover:-translate-y-0.5 transition-all duration-300"
        >
          <RefreshCwIcon class="w-4 h-4" />
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredAuditTrails.length === 0" class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-md border border-gray-200 text-center">
        <div class="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6">
          <InboxIcon class="w-8 h-8 text-gray-500" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No audit trails found</h3>
        <p class="text-gray-600 mb-8 max-w-md leading-relaxed">Try adjusting your filters or search query to find what you're looking for</p>
        <button 
          @click="resetFilters" 
          class="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 hover:-translate-y-0.5 transition-all duration-300"
        >
          <RefreshCwIcon class="w-4 h-4" />
          Clear Filters
        </button>
      </div>

      <!-- Results Grid/List -->
      <div v-else>
        <transition 
          name="view-transition" 
          mode="out-in"
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-5"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-5"
        >
          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" key="grid" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div
              v-for="(audit, index) in sortedAuditTrails"
              :key="audit._id"
              class="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 opacity-0 animate-fade-in-up"
              :style="{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }"
              @click="viewAuditDetail(audit)"
            >
              <div class="flex justify-between items-start p-6 border-b border-gray-200 bg-gray-50">
                <div class="flex flex-col gap-2">
                  <span :class="[
                    'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide border',
                    getActionColorClasses(audit.action)
                  ]">
                    <component :is="getActionIcon(audit.action)" class="w-3.5 h-3.5" />
                    {{ audit.action }}
                  </span>
                  <span :class="[
                    'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide border',
                    getModuleColorClasses(audit.module)
                  ]">
                    <component :is="getModuleIcon(audit.module)" class="w-3.5 h-3.5" />
                    {{ audit.module }}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <ClockIcon class="w-3.5 h-3.5" />
                  {{ formatRelativeTime(audit.createdAt) }}
                </div>
              </div>

              <div class="p-6">
                <div class="flex items-center gap-4 mb-4">
                  <div class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl">
                    <UserIcon class="w-5 h-5 text-gray-500" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-semibold text-gray-900">{{ audit.userId?.fullName }}</span>
                    <span class="text-xs text-gray-500">{{ audit.userId?.email }}</span>
                  </div>
                </div>
                
                <p class="text-sm text-gray-700 leading-relaxed line-clamp-3">{{ audit.description }}</p>
              </div>

              <div class="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div class="text-xs text-gray-500 font-mono font-medium">ID: {{ audit._id.slice(-8) }}</div>
                <div class="flex items-center gap-2 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors duration-200">
                  <span>View Details</span>
                  <ChevronRightIcon class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </div>
              </div>
            </div>
          </div>

          <!-- List View -->
          <div v-else key="list" class="flex flex-col gap-4">
            <div
              v-for="(audit, index) in sortedAuditTrails"
              :key="audit._id"
              class="bg-white rounded-xl shadow-md border border-gray-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 opacity-0 animate-fade-in-up"
              :style="{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }"
              @click="viewAuditDetail(audit)"
            >
              <div class="flex justify-between items-center p-6">
                <div class="flex flex-col gap-4 flex-1">
                  <div class="flex gap-3">
                    <span :class="[
                      'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide border',
                      getActionColorClasses(audit.action)
                    ]">
                      <component :is="getActionIcon(audit.action)" class="w-3.5 h-3.5" />
                      {{ audit.action }}
                    </span>
                    <span :class="[
                      'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide border',
                      getModuleColorClasses(audit.module)
                    ]">
                      <component :is="getModuleIcon(audit.module)" class="w-3.5 h-3.5" />
                      {{ audit.module }}
                    </span>
                  </div>
                  
                  <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <UserIcon class="w-4 h-4 text-gray-500" />
                      <span>{{ audit.userId?.fullName }}</span>
                    </div>
                    <p class="text-sm text-gray-700 leading-relaxed line-clamp-2">{{ audit.description }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-3 text-right">
                    <ClockIcon class="w-4 h-4 text-gray-400" />
                    <div class="flex flex-col gap-1">
                      <span class="text-sm font-semibold text-gray-900">{{ formatRelativeTime(audit.createdAt) }}</span>
                      <span class="text-xs text-gray-500">{{ formatDate(audit.createdAt) }}</span>
                    </div>
                  </div>
                  
                  <div class="flex items-center">
                    <button class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg hover:bg-indigo-500 hover:text-white transition-all duration-300" title="View Details">
                      <ChevronRightIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </section>

    <!-- Detail Modal -->
    <Teleport to="body">
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-8" @click="closeDetailModal">
          <div 
            class="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all duration-300"
            :class="showDetailModal ? 'scale-100 opacity-100' : 'scale-90 opacity-0'"
            @click.stop
          >
            <div class="flex justify-between items-start p-8 border-b border-gray-200 bg-gray-50">
              <div class="flex flex-col gap-2">
                <h3 class="text-2xl font-bold text-gray-900">Audit Trail Details</h3>
                <p class="text-sm text-gray-600">Complete information about this audit entry</p>
              </div>
              <button 
                @click="closeDetailModal" 
                class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <XIcon class="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div v-if="selectedAudit" class="flex-1 overflow-y-auto p-8">
              <div class="flex flex-col gap-8">
                <!-- Header Section -->
                <div class="flex justify-between items-start p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <div class="flex gap-3">
                    <span :class="[
                      'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide border',
                      getActionColorClasses(selectedAudit.action)
                    ]">
                      <component :is="getActionIcon(selectedAudit.action)" class="w-3.5 h-3.5" />
                      {{ selectedAudit.action }}
                    </span>
                    <span :class="[
                      'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide border',
                      getModuleColorClasses(selectedAudit.module)
                    ]">
                      <component :is="getModuleIcon(selectedAudit.module)" class="w-3.5 h-3.5" />
                      {{ selectedAudit.module }}
                    </span>
                  </div>
                  
                  <div class="flex items-center gap-3 text-right">
                    <ClockIcon class="w-4 h-4 text-gray-400" />
                    <div class="flex flex-col gap-1">
                      <span class="text-sm font-semibold text-gray-900">{{ formatDate(selectedAudit.createdAt) }}</span>
                      <span class="text-xs text-gray-500">{{ formatRelativeTime(selectedAudit.createdAt) }}</span>
                    </div>
                  </div>
                </div>

                <!-- User Section -->
                <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 class="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                    <UserIcon class="w-5 h-5 text-indigo-600" />
                    User Information
                  </h4>
                  <div class="flex items-center gap-4">
                    <div class="flex items-center justify-center w-16 h-16 bg-white border-2 border-gray-200 rounded-2xl">
                      <UserIcon class="w-8 h-8 text-gray-500" />
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="text-base font-semibold text-gray-900">{{ selectedAudit.userId?.fullName }}</span>
                      <span class="text-sm text-gray-600">{{ selectedAudit.userId?.email }}</span>
                      <span class="text-xs text-gray-500 font-mono">ID: {{ selectedAudit.userId?._id }}</span>
                    </div>
                  </div>
                </div>

                <!-- Description Section -->
                <div class="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 class="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                    <FileTextIcon class="w-5 h-5 text-indigo-600" />
                    Description
                  </h4>
                  <div class="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {{ selectedAudit.description }}
                  </div>
                </div>

                <!-- Changes Section -->
                <div class="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 class="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                    <EditIcon class="w-5 h-5 text-indigo-600" />
                    Changes Made
                  </h4>
                  <div class="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                    <pre class="font-mono text-xs leading-relaxed text-gray-800 bg-gray-50 p-6 overflow-x-auto whitespace-pre-wrap break-words">{{ formatJSON(selectedAudit.changes) }}</pre>
                  </div>
                </div>

                <!-- Metadata Section -->
                <div class="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 class="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                    <InfoIcon class="w-5 h-5 text-indigo-600" />
                    Metadata
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Audit ID</span>
                      <span class="text-sm text-gray-900 font-medium font-mono break-all bg-white p-2 rounded border border-gray-200">{{ selectedAudit._id }}</span>
                    </div>
                    <div class="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</span>
                      <span class="text-sm text-gray-900 font-medium">{{ formatDate(selectedAudit.createdAt) }}</span>
                    </div>
                    <div class="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Updated</span>
                      <span class="text-sm text-gray-900 font-medium">{{ formatDate(selectedAudit.updatedAt) }}</span>
                    </div>
                    <div class="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Version</span>
                      <span class="text-sm text-gray-900 font-medium">{{ selectedAudit.__v }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  ClipboardListIcon, SearchIcon, XIcon, RefreshCwIcon, DownloadIcon,
  UserIcon, ChevronRightIcon, AlertTriangleIcon, InboxIcon, LoaderIcon,
  PlusIcon, EditIcon, TrashIcon, LogInIcon, LogOutIcon, PackageIcon,
  UsersIcon, ShoppingCartIcon, CreditCardIcon, ArchiveIcon, GridIcon,
  ListIcon, ChevronDownIcon, CalendarIcon, ArrowRightIcon, ClockIcon,
  ArrowUpIcon, ArrowDownIcon, FileTextIcon, InfoIcon
} from 'lucide-vue-next'
import { useFetchAllAudits } from "@/composables/modules/audit/useFetchAuditLogs"
import { definePageMeta } from '#imports'

// Types (same as before)
interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  fullName: string
  id: string
}

interface AuditTrail {
  _id: string
  action: string
  userId: User
  module: string
  description: string
  changes: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface AuditTrailFilters {
  action: string | null
  module: string | null
  user: string | null
  dateRange: [Date | null, Date | null]
  searchQuery: string
}

const { auditsList: auditTrails, loading: isLoading } = useFetchAllAudits()

// State
const error = ref<string | null>(null)
const selectedAudit = ref<AuditTrail | null>(null)
const showDetailModal = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref<'createdAt' | 'action' | 'module' | 'user'>('createdAt')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Filters
const filters = ref<AuditTrailFilters>({
  action: null,
  module: null,
  user: null,
  dateRange: [null, null],
  searchQuery: ''
})

// Computed properties for filtered results
const filteredAuditTrails = computed(() => {
  return auditTrails.value.filter((audit) => {
    // Filter by action
    if (filters.value.action && audit.action !== filters.value.action) {
      return false
    }
    // Filter by module
    if (filters.value.module && audit.module !== filters.value.module) {
      return false
    }
    // Filter by user
    if (filters.value.user && audit.userId._id !== filters.value.user) {
      return false
    }
    // Filter by date range
    const [startDate, endDate] = filters.value.dateRange
    const auditDate = new Date(audit.createdAt)
    if (startDate && auditDate < startDate) {
      return false
    }
    if (endDate) {
      const adjustedEndDate = new Date(endDate)
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1)
      if (auditDate > adjustedEndDate) {
        return false
      }
    }
    // Filter by search query
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase()
      return (
        audit.action.toLowerCase().includes(query) ||
        audit.module.toLowerCase().includes(query) ||
        audit.userId.fullName.toLowerCase().includes(query) ||
        audit.description.toLowerCase().includes(query)
      )
    }
    return true
  })
})

// Sorted results
const sortedAuditTrails = computed(() => {
  const sorted = [...filteredAuditTrails.value].sort((a, b) => {
    let aValue: any, bValue: any
    
    switch (sortBy.value) {
      case 'createdAt':
        aValue = new Date(a.createdAt)
        bValue = new Date(b.createdAt)
        break
      case 'action':
        aValue = a.action
        bValue = b.action
        break
      case 'module':
        aValue = a.module
        bValue = b.module
        break
      case 'user':
        aValue = a.userId.fullName
        bValue = b.userId.fullName
        break
      default:
        aValue = new Date(a.createdAt)
        bValue = new Date(b.createdAt)
    }
    
    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
  
  return sorted
})

// Filter helpers for counts
const filteredByAction = computed(() => {
  if (!filters.value.action) return []
  return auditTrails.value.filter(audit => audit.action === filters.value.action)
})

const filteredByModule = computed(() => {
  if (!filters.value.module) return []
  return auditTrails.value.filter(audit => audit.module === filters.value.module)
})

const filteredByUser = computed(() => {
  if (!filters.value.user) return []
  return auditTrails.value.filter(audit => audit.userId._id === filters.value.user)
})

// Get unique values for filters
const uniqueActions = computed(() => {
  const actions = new Set<string>()
  auditTrails.value.forEach((audit) => actions.add(audit.action))
  return Array.from(actions).sort()
})

const uniqueModules = computed(() => {
  const modules = new Set<string>()
  auditTrails.value.forEach((audit) => modules.add(audit.module))
  return Array.from(modules).sort()
})

const uniqueUsers = computed(() => {
  const users = new Map<string, { id: string; name: string }>()
  auditTrails.value.forEach((audit) => {
    users.set(audit?.userId?._id, {
      id: audit?.userId?._id,
      name: audit?.userId?.fullName
    })
  })
  return Array.from(users.values()).sort((a, b) => a.name.localeCompare(b.name))
})

// Date input handlers
const startDateInput = ref('')
const endDateInput = ref('')

// Methods
const resetFilters = () => {
  filters.value = {
    action: null,
    module: null,
    user: null,
    dateRange: [null, null],
    searchQuery: ''
  }
  startDateInput.value = ''
  endDateInput.value = ''
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

const viewAuditDetail = (audit: AuditTrail) => {
  selectedAudit.value = audit
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  setTimeout(() => {
    selectedAudit.value = null
  }, 300)
}

const exportToCSV = () => {
  const headers = ['ID', 'Action', 'User', 'Module', 'Description', 'Changes', 'Created At']
  const csvRows = [
    headers.join(','),
    ...filteredAuditTrails.value.map((audit) => {
      const description = audit.description.replace(/,/g, ';').replace(/\n/g, ' ')
      const changes = audit.changes.replace(/,/g, ';').replace(/\n/g, ' ')
      const date = new Date(audit.createdAt).toLocaleString()
      return [
        audit._id,
        audit.action,
        audit.userId.fullName,
        audit.module,
        `"${description}"`,
        `"${changes}"`,
        date
      ].join(',')
    })
  ]
  
  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `audit-trail-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const formatJSON = (jsonString: string) => {
  try {
    const parsed = JSON.parse(jsonString)
    return JSON.stringify(parsed, null, 2)
  } catch (e) {
    return jsonString
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatRelativeTime = (dateString: string | Date) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return date.toLocaleDateString()
}

// Style helpers with Tailwind classes
const getActionColorClasses = (action: string) => {
  switch (action) {
    case 'CREATE': 
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'UPDATE': 
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'DELETE':
    case 'REMOVE': 
      return 'bg-red-50 text-red-700 border-red-200'
    case 'LOGIN': 
      return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    case 'LOGOUT': 
      return 'bg-gray-50 text-gray-700 border-gray-200'
    default: 
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

const getModuleColorClasses = (module: string) => {
  switch (module) {
    case 'INVENTORY': 
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'USER': 
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'ORDER': 
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'PRODUCT': 
      return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    case 'PAYMENT': 
      return 'bg-red-50 text-red-700 border-red-200'
    default: 
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

const getActionIcon = (action: string) => {
  switch (action) {
    case 'CREATE': return PlusIcon
    case 'UPDATE': return EditIcon
    case 'DELETE':
    case 'REMOVE': return TrashIcon
    case 'LOGIN': return LogInIcon
    case 'LOGOUT': return LogOutIcon
    default: return EditIcon
  }
}

const getModuleIcon = (module: string) => {
  switch (module) {
    case 'INVENTORY': return ArchiveIcon
    case 'USER': return UsersIcon
    case 'ORDER': return ShoppingCartIcon
    case 'PRODUCT': return PackageIcon
    case 'PAYMENT': return CreditCardIcon
    default: return PackageIcon
  }
}

definePageMeta({
  layout: 'dashboard'
})
</script>

<style scoped>
/* Custom animations using Tailwind-compatible keyframes */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-slide-in-up {
  animation: slide-in-up 0.6s ease-out;
}

.animate-slide-in-right {
  animation: slide-in-right 0.6s ease-out;
}

.animate-fade-in-delayed {
  animation: fade-in 0.8s ease-out 0.2s both;
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #6366f1, #8b5cf6);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #4f46e5, #7c3aed);
}
</style>
