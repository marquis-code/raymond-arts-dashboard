<template>
  <div class="space-y-6">
    <!-- Header with actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
        <p class="text-gray-500 mt-1">Manage your users and their account status</p>
      </div>
      <div class="flex gap-3">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search users..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
          />
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <!-- <button
          @click="refreshUsers"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': loading }" />
          Refresh
        </button> -->
      </div>
    </div>

    <!-- User Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label for="role-filter" class="block text-sm font-medium text-gray-700 mb-1"
            >Role</label
          >
          <select
            id="role-filter"
            v-model="filters.role"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="staff">Staff</option>
            <option value="anonymous">Anonymous</option>
          </select>
        </div>
        <div>
          <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1"
            >Status</label
          >
          <select
            id="status-filter"
            v-model="filters.status"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label
            for="verification-filter"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Email Status</label
          >
          <select
            id="verification-filter"
            v-model="filters.emailVerified"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]"
          >
            <option value="all">All</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
        <div>
          <label for="sort-by" class="block text-sm font-medium text-gray-700 mb-1"
            >Sort By</label
          >
          <select
            id="sort-by"
            v-model="filters.sortBy"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="date-asc">Joined (Oldest)</option>
            <option value="date-desc">Joined (Newest)</option>
            <option value="login-desc">Last Login</option>
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
      </div>
    </div>

    <!-- View Toggle -->
    <div class="flex justify-end">
      <div class="inline-flex rounded-md shadow-sm">
        <button
          @click="viewMode = 'grid'"
          class="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
          :class="
            viewMode === 'grid' ? 'text-violet-700 bg-violet-50' : 'text-gray-700 hover:bg-gray-50'
          "
        >
          <Grid class="h-4 w-4" />
        </button>
        <button
          @click="viewMode = 'list'"
          class="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
          :class="
            viewMode === 'list' ? 'text-violet-700 bg-violet-50' : 'text-gray-700 hover:bg-gray-50'
          "
        >
          <List class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !users.length" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
        <p class="text-gray-500">Loading users...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && !filteredUsers.length" class="text-center py-12">
      <Users class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No users found</h3>
      <p class="text-gray-500">Try adjusting your search or filter criteria.</p>
    </div>

    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="user in paginatedUsers"
        :key="user._id || user.id"
        class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
      >
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex items-center">
              <div class="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <img
                  :src="
                    user.picture ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.fullName || user.email,
                    )}&background=6366f1&color=fff`
                  "
                  :alt="user.fullName || user.email"
                  class="h-full w-full object-cover"
                />
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ user.fullName || `${user.firstName} ${user.lastName}`.trim() || 'No Name' }}
                </h3>
                <p class="text-sm text-gray-500 capitalize">{{ user.role }}</p>
              </div>
            </div>
            <div class="flex space-x-1">
              <button
                @click="viewUserDetails(user)"
                class="text-gray-400 hover:text-violet-500 transition-colors duration-200"
                title="View Details"
              >
                <Eye class="h-5 w-5" />
              </button>
              <button
                @click="toggleUserStatus(user)"
                :class="user.isActive ? 'text-gray-400 hover:text-red-500' : 'text-gray-400 hover:text-green-500'"
                class="transition-colors duration-200"
                :title="user.isActive ? 'Deactivate User' : 'Activate User'"
              >
                <UserX v-if="user.isActive" class="h-5 w-5" />
                <UserCheck v-else class="h-5 w-5" />
              </button>
            </div>
          </div>
          <div class="mt-4 space-y-2">
            <div class="flex items-center text-sm">
              <Mail class="h-4 w-4 text-gray-400 mr-2" />
              <span class="text-gray-600">{{ user.email }}</span>
              <CheckCircle v-if="user.isEmailVerified" class="h-4 w-4 text-green-500 ml-2" title="Email Verified" />
              <XCircle v-else class="h-4 w-4 text-red-500 ml-2" title="Email Not Verified" />
            </div>
            <div class="flex items-center text-sm">
              <Calendar class="h-4 w-4 text-gray-400 mr-2" />
              <span class="text-gray-600">Joined {{ formatDate(user.createdAt) }}</span>
            </div>
            <div v-if="user.lastLoginAt" class="flex items-center text-sm">
              <Clock class="h-4 w-4 text-gray-400 mr-2" />
              <span class="text-gray-600">Last login {{ formatDate(user.lastLoginAt) }}</span>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >{{ user.isActive ? 'Active' : 'Inactive' }}</span
            >
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="user.isEmailVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'"
              >{{ user.isEmailVerified ? 'Verified' : 'Unverified' }}</span
            >
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-800 capitalize"
              >{{ user.role }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else-if="viewMode === 'list'" class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="user in paginatedUsers"
              :key="user._id || user.id"
              class="hover:bg-gray-50 transition-colors duration-200"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img
                      :src="
                        user.picture ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.fullName || user.email,
                        )}&background=6366f1&color=fff`
                      "
                      :alt="user.fullName || user.email"
                      class="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.fullName || `${user.firstName} ${user.lastName}`.trim() || 'No Name' }}
                    </div>
                    <div class="text-sm text-gray-500 flex items-center">
                      {{ user.email }}
                      <CheckCircle v-if="user.isEmailVerified" class="h-3 w-3 text-green-500 ml-1" />
                      <XCircle v-else class="h-3 w-3 text-red-500 ml-1" />
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-800 capitalize"
                  >{{ user.role }}</span
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >{{ user.isActive ? 'Active' : 'Inactive' }}</span
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="viewUserDetails(user)"
                    class="text-violet-600 hover:text-violet-900 transition-colors duration-200"
                    title="View Details"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                  <button
                    @click="toggleUserStatus(user)"
                    :class="user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                    class="transition-colors duration-200"
                    :title="user.isActive ? 'Deactivate User' : 'Activate User'"
                  >
                    <UserX v-if="user.isActive" class="h-4 w-4" />
                    <UserCheck v-else class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            :disabled="currentPage <= 1"
            @click="currentPage--"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Previous
          </button>
          <button
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ startIndex }}</span> to
              <span class="font-medium">{{ endIndex }}</span> of
              <span class="font-medium">{{ filteredUsers.length }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                :disabled="currentPage <= 1"
                @click="currentPage--"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft class="h-5 w-5" />
              </button>
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                class="relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200"
                :class="
                  page === currentPage
                    ? 'border-violet-500 bg-violet-50 text-violet-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                "
              >
                {{ page }}
              </button>
              <button
                :disabled="currentPage >= totalPages"
                @click="currentPage++"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronRight class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- User Details Modal -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="selectedUser" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75" @click="selectedUser = null"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">User Details</h3>
                    <button
                      @click="selectedUser = null"
                      class="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                    >
                      <X class="h-6 w-6" />
                    </button>
                  </div>
                  <div class="flex items-center mb-6">
                    <div class="h-20 w-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        :src="
                          selectedUser.picture ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            selectedUser.fullName || selectedUser.email,
                          )}&background=6366f1&color=fff&size=200`
                        "
                        :alt="selectedUser.fullName || selectedUser.email"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div class="ml-6">
                      <h3 class="text-2xl font-medium text-gray-900">
                        {{
                          selectedUser.fullName ||
                          `${selectedUser.firstName} ${selectedUser.lastName}`.trim() ||
                          'No Name'
                        }}
                      </h3>
                      <p class="text-sm text-gray-500 capitalize">{{ selectedUser.role }}</p>
                      <div class="mt-2 flex flex-wrap gap-2">
                        <span
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          :class="
                            selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          "
                          >{{ selectedUser.isActive ? 'Active' : 'Inactive' }}</span
                        >
                        <span
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          :class="
                            selectedUser.isEmailVerified
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          "
                          >{{ selectedUser.isEmailVerified ? 'Email Verified' : 'Email Unverified' }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="border-t border-gray-200 py-6">
                    <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Email</dt>
                        <dd class="mt-1 text-sm text-gray-900 flex items-center">
                          {{ selectedUser.email }}
                          <CheckCircle v-if="selectedUser.isEmailVerified" class="h-4 w-4 text-green-500 ml-2" />
                          <XCircle v-else class="h-4 w-4 text-red-500 ml-2" />
                        </dd>
                      </div>
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">User ID</dt>
                        <dd class="mt-1 text-sm text-gray-900 font-mono">
                          {{ selectedUser._id || selectedUser.id }}
                        </dd>
                      </div>
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Role</dt>
                        <dd class="mt-1 text-sm text-gray-900 capitalize">{{ selectedUser.role }}</dd>
                      </div>
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Account Status</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                          {{ selectedUser.isActive ? 'Active' : 'Inactive' }}
                        </dd>
                      </div>
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Date Joined</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                          {{ formatDate(selectedUser.createdAt) }}
                        </dd>
                      </div>
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Last Login</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                          {{ selectedUser.lastLoginAt ? formatDate(selectedUser.lastLoginAt) : 'Never logged in' }}
                        </dd>
                      </div>
                      <div v-if="selectedUser.googleId" class="sm:col-span-2">
                        <dt class="text-sm font-medium text-gray-500">Google Account</dt>
                        <dd class="mt-1 text-sm text-gray-900">Connected ({{ selectedUser.googleId }})</dd>
                      </div>
                    </dl>
                  </div>
                  <div class="border-t border-gray-200 py-6">
                    <h4 class="text-sm font-medium text-gray-900 mb-3">Account Actions</h4>
                    <div class="flex space-x-3">
                      <button
                        @click="toggleUserStatus(selectedUser)"
                        :disabled="deactivateLoading || activateLoading"
                        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="
                          selectedUser.isActive
                            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                            : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                        "
                      >
                        <UserX
                          v-if="selectedUser.isActive && !deactivateLoading && !activateLoading"
                          class="h-4 w-4 mr-2"
                        />
                        <UserCheck
                          v-else-if="!selectedUser.isActive && !deactivateLoading && !activateLoading"
                          class="h-4 w-4 mr-2"
                        />
                        <div
                          v-else
                          class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                        ></div>
                        {{
                          deactivateLoading || activateLoading
                            ? 'Processing...'
                            : selectedUser.isActive
                              ? 'Deactivate User'
                              : 'Activate User'
                        }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Confirmation Modal -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showConfirmModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div
                  class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
                  :class="confirmAction?.type === 'deactivate' ? 'bg-red-100' : 'bg-green-100'"
                >
                  <AlertTriangle v-if="confirmAction?.type === 'deactivate'" class="h-6 w-6 text-red-600" />
                  <CheckCircle v-else class="h-6 w-6 text-green-600" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    {{ confirmAction?.type === 'deactivate' ? 'Deactivate User' : 'Activate User' }}
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to
                      {{ confirmAction?.type === 'deactivate' ? 'deactivate' : 'activate' }}
                      <span class="font-medium">{{ confirmAction?.user?.fullName || confirmAction?.user?.email }}</span
                      >?
                      {{
                        confirmAction?.type === 'deactivate'
                          ? 'They will no longer be able to access their account.'
                          : 'They will regain access to their account.'
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                @click="confirmStatusChange"
                :disabled="deactivateLoading || activateLoading"
                type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="
                  confirmAction?.type === 'deactivate'
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                "
              >
                <div
                  v-if="deactivateLoading || activateLoading"
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                ></div>
                {{
                  deactivateLoading || activateLoading
                    ? 'Processing...'
                    : confirmAction?.type === 'deactivate'
                      ? 'Deactivate'
                      : 'Activate'
                }}
              </button>
              <button
                @click="cancelStatusChange"
                :disabled="deactivateLoading || activateLoading"
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notifications -->
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm transform transition-all duration-300 ease-in-out"
          :class="{
            'border-green-200 bg-green-50': toast.type === 'success',
            'border-red-200 bg-red-50': toast.type === 'error',
            'border-blue-200 bg-blue-50': toast.type === 'info',
          }"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                v-if="toast.type === 'success'"
                class="h-5 w-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <svg
                v-else-if="toast.type === 'error'"
                class="h-5 w-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              <svg
                v-else
                class="h-5 w-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div class="ml-3">
              <p
                class="text-sm font-medium"
                :class="{
                  'text-green-800': toast.type === 'success',
                  'text-red-800': toast.type === 'error',
                  'text-blue-800': toast.type === 'info',
                }"
              >
                {{ toast.message }}
              </p>
            </div>
            <div class="ml-auto pl-3">
              <button
                @click="removeToast(toast.id)"
                class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
  Search,
  RefreshCw,
  Eye,
  Grid,
  List,
  Users,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  UserX,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
} from 'lucide-vue-next';

import { useFetchAllUsers } from '@/composables/modules/users/useFetchAllUsers';
import { useFetchUserById } from '@/composables/modules/users/useFetchUserById';
import { useDeactivateUser } from '@/composables/modules/users/useDeactivateUser';
import { useActivateUser } from '@/composables/modules/users/useActivateUser';

import { type User } from '@/types/user'; // Import the User interface

// Composables
const { users, loading, error, fetchAllUsers } = useFetchAllUsers();
const { findUserById, loading: fetchingUserById } = useFetchUserById();
const { deactivateUser, loading: deactivateLoading } = useDeactivateUser();
const { activateUser, loading: activateLoading } = useActivateUser();

// View mode
const viewMode = ref('grid');

// Search and filters
const searchQuery = ref('');
const filters = ref({
  role: 'all',
  status: 'all',
  emailVerified: 'all',
  sortBy: 'date-desc',
});

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

// Modal states
const selectedUser = ref<User | null>(null); // Explicitly type selectedUser
const showConfirmModal = ref(false);
const confirmAction = ref<{ type: 'deactivate' | 'activate'; user: User } | null>(null); // Explicitly type confirmAction

// Toast Notifications
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
const toasts = ref<Toast[]>([]);

// Computed properties
const filteredUsers = computed(() => {
  let result = users.value.filter((user) => {
    // Search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      const fullName = (user.fullName || `${user.firstName} ${user.lastName}`).toLowerCase();
      const email = user.email.toLowerCase();
      if (!fullName.includes(query) && !email.includes(query)) {
        return false;
      }
    }
    // Role filter
    if (filters.value.role !== 'all' && user.role !== filters.value.role) {
      return false;
    }
    // Status filter
    if (filters.value.status !== 'all') {
      const isActive = filters.value.status === 'active';
      if (user.isActive !== isActive) {
        return false;
      }
    }
    // Email verification filter
    if (filters.value.emailVerified !== 'all') {
      const isVerified = filters.value.emailVerified === 'verified';
      if (user.isEmailVerified !== isVerified) {
        return false;
      }
    }
    return true;
  });

  // Sort the results
  switch (filters.value.sortBy) {
    case 'name-asc':
      result.sort((a, b) => {
        const nameA = a.fullName || `${a.firstName} ${a.lastName}` || a.email;
        const nameB = b.fullName || `${b.firstName} ${b.lastName}` || b.email;
        return nameA.localeCompare(nameB);
      });
      break;
    case 'name-desc':
      result.sort((a, b) => {
        const nameA = a.fullName || `${a.firstName} ${a.lastName}` || a.email;
        const nameB = b.fullName || `${b.firstName} ${b.lastName}` || b.email;
        return nameB.localeCompare(nameA);
      });
      break;
    case 'date-asc':
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'date-desc':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'login-desc':
      result.sort((a, b) => {
        const dateA = a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0;
        const dateB = b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0;
        return dateB - dateA;
      });
      break;
  }
  return result;
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, filteredUsers.value.length));
const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// Methods
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const refreshUsers = async () => {
  await fetchAllUsers();
};

const resetFilters = () => {
  filters.value = {
    role: 'all',
    status: 'all',
    emailVerified: 'all',
    sortBy: 'date-desc',
  };
  searchQuery.value = '';
  currentPage.value = 1;
};

const viewUserDetails = async (user: User) => {
  selectedUser.value = user;
  // Optionally fetch fresh user data if needed, but for now, use the passed user object
  // const freshUser = await findUserById(user._id || user.id);
  // if (freshUser) selectedUser.value = freshUser;
};

const toggleUserStatus = (user: User) => {
  confirmAction.value = {
    type: user.isActive ? 'deactivate' : 'activate',
    user: user,
  };
  showConfirmModal.value = true;
};

const confirmStatusChange = async () => {
  if (!confirmAction.value) return;
  const { type, user } = confirmAction.value;
  const userId = user._id || user.id;

  try {
    let success = false;
    if (type === 'deactivate') {
      success = await deactivateUser(userId);
    } else {
      success = await activateUser(userId);
    }

    if (success) {
      // Update the user in the local state
      const userIndex = users.value.findIndex((u) => (u._id || u.id) === userId);
      if (userIndex !== -1) {
        users.value[userIndex].isActive = type === 'activate';
      }
      // Update selected user if it's the same user
      if (selectedUser.value && (selectedUser.value._id || selectedUser.value.id) === userId) {
        selectedUser.value.isActive = type === 'activate';
      }
      showToast(`User ${type === 'activate' ? 'activated' : 'deactivated'} successfully`, 'success');
    } else {
      showToast(`Failed to ${type} user. Please try again.`, 'error');
    }
  } catch (error) {
    console.error(`Error ${type}ing user:`, error);
    showToast(`An unexpected error occurred while ${type}ing user.`, 'error');
  } finally {
    showConfirmModal.value = false;
    confirmAction.value = null;
  }
};

const cancelStatusChange = () => {
  showConfirmModal.value = false;
  confirmAction.value = null;
};

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const toast: Toast = {
    id: Date.now().toString(),
    message,
    type,
  };
  toasts.value.push(toast);
  setTimeout(() => {
    removeToast(toast.id);
  }, 5000);
};

const removeToast = (toastId: string) => {
  const index = toasts.value.findIndex((t) => t.id === toastId);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

// Page meta
definePageMeta({
  layout: 'dashboard',
});

// Watch for filter changes to reset pagination
watch(
  [searchQuery, filters],
  () => {
    currentPage.value = 1;
  },
  { deep: true },
);
</script>

<style scoped>
/* Toast animation styles */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.toast-move {
  transition: transform 0.5s ease;
}
</style>