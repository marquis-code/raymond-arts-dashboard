<template>
    <div class="">
      <!-- Header -->
      <header class="header">
        <div class="header-content">
          <h1 class="flex items-center text-lg font-semibold space-x-6 pl-5">
            <ClipboardListIcon  class="icon" />
            Audit Trail System
          </h1>
          <p class="subtitle">Track all system activities and changes</p>
        </div>
      </header>
  
      <!-- Filters Section -->
      <section class="filters-section">
        <div class="search-container">
          <div class="search-input-wrapper">
            <SearchIcon class="search-icon" />
            <input
              v-model="filters.searchQuery"
              type="text"
              placeholder="Search audit trails..."
              class="search-input"
            />
            <button v-if="filters.searchQuery" @click="filters.searchQuery = ''" class="clear-search">
              <XIcon class="icon-sm" />
            </button>
          </div>
        </div>
  
        <div class="filters-container">
          <div class="filter-group">
            <label class="filter-label">Action</label>
            <select v-model="filters.action" class="border-[0.5px] w-full py-3 rounded-lg text-sm">
              <option :value="null">All Actions</option>
              <option v-for="action in uniqueActions" :key="action" :value="action">
                {{ action }}
              </option>
            </select>
          </div>
  
          <div class="filter-group">
            <label class="filter-label">Module</label>
            <select v-model="filters.module" class="border-[0.5px] w-full py-3 rounded-lg text-sm">
              <option :value="null">All Modules</option>
              <option v-for="module in uniqueModules" :key="module" :value="module">
                {{ module }}
              </option>
            </select>
          </div>
  
          <div class="filter-group">
            <label class="filter-label">User</label>
            <select v-model="filters.user" class="border-[0.5px] w-full py-3 rounded-lg text-sm">
              <option :value="null">All Users</option>
              <option v-for="user in uniqueUsers" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>
  
          <div class="filter-group date-range">
            <label class="filter-label">Date Range</label>
            <div class="date-inputs">
              <input
                v-model="startDateInput"
                type="date"
                class="border-[0.5px] w-full p-3 text-sm rounded-lg"
                placeholder="Start date"
              />
              <span class="date-separator">to</span>
              <input
                v-model="endDateInput"
                type="date"
                class="border-[0.5px] w-full p-3 text-sm rounded-lg"
                placeholder="End date"
              />
            </div>
          </div>
  
          <div class="filter-actions">
            <button @click="resetFilters" class="btn btn-reset">
              <RefreshCwIcon class="icon-sm" />
              Reset
            </button>
            <button @click="exportToCSV" class="flex items-center text-sm border rounded-lg p-2.5">
              <DownloadIcon class="icon-sm" />
              Export CSV
            </button>
          </div>
        </div>
      </section>
  
      <!-- Results Section -->
      <section class="results-section">
        <div class="results-header">
          <h2 class="results-title">
            Audit Logs
            <span class="results-count">{{ filteredAuditTrails.length }}</span>
          </h2>
        </div>
  
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <LoaderIcon class="loading-icon" />
          <p>Loading audit trails...</p>
        </div>
  
        <!-- Error State -->
        <div v-else-if="error" class="error-container">
          <AlertTriangleIcon class="error-icon" />
          <p>{{ error }}</p>
          <button @click="fetchAuditTrails" class="btn btn-retry">Retry</button>
        </div>
  
        <!-- Empty State -->
        <div v-else-if="filteredAuditTrails.length === 0" class="empty-container">
          <InboxIcon class="empty-icon" />
          <p>No audit trails found</p>
          <p class="empty-subtitle">Try adjusting your filters or search query</p>
        </div>
  
        <!-- Results List -->
        <div v-else class="audit-list">
          <div
            v-for="audit in filteredAuditTrails"
            :key="audit._id"
            class="audit-item"
            @click="viewAuditDetail(audit)"
          >
            <div class="audit-item-header">
              <div class="audit-badges">
                <!-- <span :class="['badge', getActionColorClass(audit.action)]">
                  {{ getActionIcon(audit?.action) }}
                  {{ audit?.action }}
                </span>
                <span :class="['badge', getModuleColorClass(audit.module)]">
                  {{ getModuleIcon(audit?.module) }}
                  {{ audit?.module }}
                </span> -->
              </div>
              <span class="audit-date">{{ formatDate(audit?.createdAt) }}</span>
            </div>
  
            <div class="audit-item-content">
              <div class="audit-user">
                <UserIcon class="user-icon" />
                <span>{{ audit.userId.fullName }}</span>
              </div>
              <p class="audit-description">{{ audit?.description }}</p>
            </div>
  
            <div class="audit-item-footer">
              <span class="view-details">
                View Details
                <ChevronRightIcon class="icon-sm" />
              </span>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Detail Modal -->
      <Teleport to="body">
        <div v-if="showDetailModal" class="modal-backdrop" @click="closeDetailModal"></div>
        <div
          v-if="showDetailModal"
          class="modal-container"
          :class="{ 'modal-active': showDetailModal }"
        >
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3 class="modal-title">Audit Detail</h3>
              <button @click="closeDetailModal" class="modal-close">
                <XIcon class="icon-sm" />
              </button>
            </div>
  
            <div v-if="selectedAudit" class="modal-body">
              <div class="detail-section">
                <div class="detail-header">
                  <div class="detail-badges">
                    <!-- <span :class="['badge', getActionColorClass(selectedAudit.action)]">
                      {{ getActionIcon(selectedAudit.action) }}
                      {{ selectedAudit.action }}
                    </span>
                    <span :class="['badge', getModuleColorClass(selectedAudit.module)]">
                      {{ getModuleIcon(selectedAudit.module) }}
                      {{ selectedAudit.module }}
                    </span> -->
                  </div>
                  <span class="detail-date">{{ formatDate(selectedAudit.createdAt) }}</span>
                </div>
  
                <div class="detail-user">
                  <UserIcon class="user-icon" />
                  <div class="user-info">
                    <span class="user-name">{{ selectedAudit.userId.fullName }}</span>
                    <span class="user-email">{{ selectedAudit.userId.email }}</span>
                  </div>
                </div>
  
                <div class="detail-item">
                  <h4 class="detail-label">Description</h4>
                  <p class="detail-value">{{ selectedAudit.description }}</p>
                </div>
  
                <div class="detail-item">
                  <h4 class="detail-label">Changes</h4>
                  <pre class="detail-code">{{ formatJSON(selectedAudit.changes) }}</pre>
                </div>
  
                <div class="detail-item">
                  <h4 class="detail-label">ID</h4>
                  <p class="detail-value detail-id">{{ selectedAudit._id }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, h } from 'vue'
  import {
    ClipboardListIcon,
    SearchIcon,
    XIcon,
    RefreshCwIcon,
    DownloadIcon,
    UserIcon,
    ChevronRightIcon,
    AlertTriangleIcon,
    InboxIcon,
    LoaderIcon,
    PlusIcon,
    EditIcon,
    TrashIcon,
    LogInIcon,
    LogOutIcon,
    PackageIcon,
    UsersIcon,
    ShoppingCartIcon,
    CreditCardIcon,
    ArchiveIcon
  } from 'lucide-vue-next'
  import { useFetchAllAudits,
    // filteredAuditTrails
   } from "@/composables/modules/audit/useFetchAuditLogs"
  
  // Types
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
  // const auditTrails = ref<AuditTrail[]>([])
  // const isLoading = ref(true)
  const error = ref<string | null>(null)
  const selectedAudit = ref<AuditTrail | null>(null)
  const showDetailModal = ref(false)
  
  // Filters
  const filters = ref<AuditTrailFilters>({
    action: null,
    module: null,
    user: null,
    dateRange: [null, null],
    searchQuery: ''
  })
  
  // // Fetch audit trails
  // const fetchAuditTrails = async () => {
  //   isLoading.value = true
  //   error.value = null
  
  //   try {
  //     // In a real app, this would be an API call
  //     // For demo purposes, we'll use mock data
  //     const mockData: AuditTrail[] = [
  //       {
  //         _id: "67ff15a7ab241251f7b77f08",
  //         action: "REMOVE",
  //         userId: {
  //           _id: "67fa8e31b42b0ed1af9e1a0f",
  //           firstName: "Raymomnd",
  //           lastName: "Arts",
  //           email: "raymond@gmail.com",
  //           fullName: "Raymomnd Arts",
  //           id: "67fa8e31b42b0ed1af9e1a0f"
  //         },
  //         module: "INVENTORY",
  //         description: "Inventory reduced for product {\n  _id: new ObjectId('67fabc48b42b0ed1af9e1a1c'),\n  name: 'anonymous',\n  price: 299.99,\n  images: [\n    'https://res.cloudinary.com/marquis/image/upload/v1744697883/nest-cloudinary/c3panorhzpkgbx6ovxqb.png',\n    'https://res.cloudinary.com/marquis/image/upload/v1744697883/nest-cloudinary/shwpegcellzcvxarvvys.png',\n    'https://res.cloudinary.com/marquis/image/upload/v1744697883/nest-cloudinary/yobbmgt4raifhjaqyyus.png'\n  ]\n}",
  //         changes: '{"quantity":2,"notes":"Order #ORD-70469407-457"}',
  //         createdAt: "2025-04-16T02:27:51.865Z",
  //         updatedAt: "2025-04-16T02:27:51.865Z",
  //         __v: 0
  //       },
  //       {
  //         _id: "67ff15a7ab241251f7b77f09",
  //         action: "CREATE",
  //         userId: {
  //           _id: "67fa8e31b42b0ed1af9e1a0f",
  //           firstName: "Raymomnd",
  //           lastName: "Arts",
  //           email: "raymond@gmail.com",
  //           fullName: "Raymomnd Arts",
  //           id: "67fa8e31b42b0ed1af9e1a0f"
  //         },
  //         module: "PRODUCT",
  //         description: "New product created: Premium Headphones",
  //         changes: '{"name":"Premium Headphones","price":199.99,"category":"Electronics"}',
  //         createdAt: "2025-04-15T14:30:22.865Z",
  //         updatedAt: "2025-04-15T14:30:22.865Z",
  //         __v: 0
  //       },
  //       {
  //         _id: "67ff15a7ab241251f7b77f10",
  //         action: "UPDATE",
  //         userId: {
  //           _id: "67fa8e31b42b0ed1af9e1a10",
  //           firstName: "Sarah",
  //           lastName: "Johnson",
  //           email: "sarah@example.com",
  //           fullName: "Sarah Johnson",
  //           id: "67fa8e31b42b0ed1af9e1a10"
  //         },
  //         module: "USER",
  //         description: "User profile updated",
  //         changes: '{"previousEmail":"sarah.old@example.com","newEmail":"sarah@example.com"}',
  //         createdAt: "2025-04-14T09:15:33.865Z",
  //         updatedAt: "2025-04-14T09:15:33.865Z",
  //         __v: 0
  //       },
  //       {
  //         _id: "67ff15a7ab241251f7b77f11",
  //         action: "DELETE",
  //         userId: {
  //           _id: "67fa8e31b42b0ed1af9e1a11",
  //           firstName: "Admin",
  //           lastName: "User",
  //           email: "admin@system.com",
  //           fullName: "Admin User",
  //           id: "67fa8e31b42b0ed1af9e1a11"
  //         },
  //         module: "ORDER",
  //         description: "Order cancelled: #ORD-70469407-123",
  //         changes: '{"status":"CANCELLED","reason":"Customer request"}',
  //         createdAt: "2025-04-13T18:45:10.865Z",
  //         updatedAt: "2025-04-13T18:45:10.865Z",
  //         __v: 0
  //       },
  //       {
  //         _id: "67ff15a7ab241251f7b77f12",
  //         action: "LOGIN",
  //         userId: {
  //           _id: "67fa8e31b42b0ed1af9e1a0f",
  //           firstName: "Raymomnd",
  //           lastName: "Arts",
  //           email: "raymond@gmail.com",
  //           fullName: "Raymomnd Arts",
  //           id: "67fa8e31b42b0ed1af9e1a0f"
  //         },
  //         module: "USER",
  //         description: "User logged in",
  //         changes: '{"ip":"192.168.1.1","device":"Chrome on Windows"}',
  //         createdAt: "2025-04-12T08:30:00.865Z",
  //         updatedAt: "2025-04-12T08:30:00.865Z",
  //         __v: 0
  //       },
  //       {
  //         _id: "67ff15a7ab241251f7b77f13",
  //         action: "LOGOUT",
  //         userId: {
  //           _id: "67fa8e31b42b0ed1af9e1a10",
  //           firstName: "Sarah",
  //           lastName: "Johnson",
  //           email: "sarah@example.com",
  //           fullName: "Sarah Johnson",
  //           id: "67fa8e31b42b0ed1af9e1a10"
  //         },
  //         module: "USER",
  //         description: "User logged out",
  //         changes: '{"ip":"192.168.1.2","device":"Safari on MacOS"}',
  //         createdAt: "2025-04-11T17:20:00.865Z",
  //         updatedAt: "2025-04-11T17:20:00.865Z",
  //         __v: 0
  //       },
  //       {
  //         _id: "67ff15a7ab241251f7b77f14",
  //         action: "UPDATE",
  //         userId: {
  //           _id: "67fa8e31b42b0ed1af9e1a11",
  //           firstName: "Admin",
  //           lastName: "User",
  //           email: "admin@system.com",
  //           fullName: "Admin User",
  //           id: "67fa8e31b42b0ed1af9e1a11"
  //         },
  //         module: "PAYMENT",
  //         description: "Payment status updated for order #ORD-70469407-789",
  //         changes: '{"previousStatus":"PENDING","newStatus":"COMPLETED","amount":"499.99"}',
  //         createdAt: "2025-04-10T11:05:30.865Z",
  //         updatedAt: "2025-04-10T11:05:30.865Z",
  //         __v: 0
  //       }
  //     ]
  
  //     // Add a small delay to simulate network request
  //     setTimeout(() => {
  //       auditTrails.value = mockData
  //       isLoading.value = false
  //     }, 800)
  //   } catch (err) {
  //     error.value = "Failed to fetch audit trails"
  //     console.error(err)
  //     isLoading.value = false
  //   }
  // }
  
  // Filter audit trails
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
        // Add one day to include the end date fully
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
  
  // Get unique actions for filter
  const uniqueActions = computed(() => {
    const actions = new Set<string>()
    auditTrails.value.forEach((audit) => actions.add(audit.action))
    return Array.from(actions)
  })
  
  // Get unique modules for filter
  const uniqueModules = computed(() => {
    const modules = new Set<string>()
    auditTrails.value.forEach((audit) => modules.add(audit.module))
    return Array.from(modules)
  })
  
  // Get unique users for filter
  const uniqueUsers = computed(() => {
    const users = new Map<string, { id: string; name: string }>()
    auditTrails.value.forEach((audit) => {
      users.set(audit.userId._id, {
        id: audit.userId._id,
        name: audit.userId.fullName
      })
    })
    return Array.from(users.values())
  })
  
  // Handle date inputs
  const startDateInput = computed({
    get: () => {
      if (!filters.value.dateRange[0]) return ''
      return filters.value.dateRange[0].toISOString().split('T')[0]
    },
    set: (value: string) => {
      const newFilters = { ...filters.value }
      newFilters.dateRange = [value ? new Date(value) : null, newFilters.dateRange[1]]
      filters.value = newFilters
    }
  })
  
  const endDateInput = computed({
    get: () => {
      if (!filters.value.dateRange[1]) return ''
      return filters.value.dateRange[1].toISOString().split('T')[0]
    },
    set: (value: string) => {
      const newFilters = { ...filters.value }
      newFilters.dateRange = [newFilters.dateRange[0], value ? new Date(value) : null]
      filters.value = newFilters
    }
  })
  
  // Reset filters
  const resetFilters = () => {
    filters.value = {
      action: null,
      module: null,
      user: null,
      dateRange: [null, null],
      searchQuery: ''
    }
  }
  
  // View audit detail
  const viewAuditDetail = (audit: AuditTrail) => {
    selectedAudit.value = audit
    showDetailModal.value = true
  }
  
  // Close detail modal
  const closeDetailModal = () => {
    showDetailModal.value = false
    setTimeout(() => {
      selectedAudit.value = null
    }, 300) // Wait for animation to complete
  }
  
  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Action', 'User', 'Module', 'Description', 'Changes', 'Created At']
  
    const csvRows = [
      headers.join(','),
      ...filteredAuditTrails.value.map((audit) => {
        // Format the data for CSV
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
  
  // Format JSON for display
  const formatJSON = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString)
      return JSON.stringify(parsed, null, 2)
    } catch (e) {
      return jsonString
    }
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }
  
  // Get action color class
  const getActionColorClass = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'badge-success'
      case 'UPDATE':
        return 'badge-info'
      case 'DELETE':
      case 'REMOVE':
        return 'badge-danger'
      case 'LOGIN':
        return 'badge-purple'
      case 'LOGOUT':
        return 'badge-gray'
      default:
        return 'badge-gray'
    }
  }
  
  // Get module color class
  const getModuleColorClass = (module: string) => {
    switch (module) {
      case 'INVENTORY':
        return 'badge-warning'
      case 'USER':
        return 'badge-info'
      case 'ORDER':
        return 'badge-purple'
      case 'PRODUCT':
        return 'badge-success'
      case 'PAYMENT':
        return 'badge-pink'
      default:
        return 'badge-gray'
    }
  }
  
  // Get action icon
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return h(PlusIcon, { class: 'icon-xs' })
      case 'UPDATE':
        return h(EditIcon, { class: 'icon-xs' })
      case 'DELETE':
      case 'REMOVE':
        return h(TrashIcon, { class: 'icon-xs' })
      case 'LOGIN':
        return h(LogInIcon, { class: 'icon-xs' })
      case 'LOGOUT':
        return h(LogOutIcon, { class: 'icon-xs' })
      default:
        return null
    }
  }
  
  // Get module icon
  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'INVENTORY':
        return h(ArchiveIcon, { class: 'icon-xs' })
      case 'USER':
        return h(UsersIcon, { class: 'icon-xs' })
      case 'ORDER':
        return h(ShoppingCartIcon, { class: 'icon-xs' })
      case 'PRODUCT':
        return h(PackageIcon, { class: 'icon-xs' })
      case 'PAYMENT':
        return h(CreditCardIcon, { class: 'icon-xs' })
      default:
        return null
    }
  }
  
  // // Fetch data on mount
  // onMounted(() => {
  //   fetchAuditTrails()
  // })

  definePageMeta({
    layout: 'dashboard'
  })
  </script>
  
  <style scoped>
  /* Base Styles */
  :root {
    --primary: #6366f1;
    --primary-hover: #4f46e5;
    --success: #10b981;
    --info: #0ea5e9;
    --warning: #f59e0b;
    --danger: #ef4444;
    --purple: #8b5cf6;
    --pink: #ec4899;
    --gray: #6b7280;
    --light-gray: #f3f4f6;
    --dark-gray: #374151;
    --border-color: #e5e7eb;
    --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --radius: 0.375rem;
    --transition: all 0.2s ease-in-out;
  }
  
  /* Container */
  .audit-trail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem;
  }
  
  /* Header */
  .header {
    margin-bottom: 2rem;
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .header-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.875rem;
    font-weight: 700;
    color: var(--dark-gray);
  }
  
  .subtitle {
    font-size: 1.125rem;
    color: var(--gray);
  }
  
  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .icon-sm {
    width: 1rem;
    height: 1rem;
  }
  
  .icon-xs {
    width: 0.875rem;
    height: 0.875rem;
  }
  
  /* Filters Section */
  .filters-section {
    margin-bottom: 2rem;
    animation: slideInUp 0.5s ease-in-out;
  }
  
  .search-container {
    margin-bottom: 1rem;
  }
  
  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .search-icon {
    position: absolute;
    left: 1rem;
    width: 1.25rem;
    height: 1.25rem;
    color: var(--gray);
  }
  
  .search-input {
    width: 100%;
    padding: 0.75rem 2.5rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    font-size: 1rem;
    transition: var(--transition);
  }
  
  .search-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
  
  .clear-search {
    position: absolute;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--gray);
    transition: var(--transition);
  }
  
  .clear-search:hover {
    color: var(--danger);
  }
  
  .filters-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1.5rem;
    background-color: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }
  
  .filter-group {
    flex: 1;
    min-width: 200px;
  }
  
  .filter-label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--dark-gray);
  }
  
  .filter-select {
    width: 100%;
    padding: 0.5rem;
    border: 1px;
    border-radius: var(--radius);
    background-color: white;
    font-size: 0.875rem;
    transition: var(--transition);
  }
  
  .filter-select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
  
  .date-range {
    flex: 2;
    min-width: 300px;
  }
  
  .date-inputs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .date-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    font-size: 0.875rem;
    transition: var(--transition);
  }
  
  .date-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
  
  .date-separator {
    color: var(--gray);
    font-size: 0.875rem;
  }
  
  .filter-actions {
    display: flex;
    align-items: flex-end;
    gap: 0.75rem;
    margin-left: auto;
  }
  
  .btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--radius);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
  }
  
  .btn-reset {
    background-color: white;
    border: 1px solid var(--border-color);
    color: var(--gray);
  }
  
  .btn-reset:hover {
    background-color: var(--light-gray);
  }
  
  .btn-export {
    background-color: var(--primary);
    color: white;
  }
  
  .btn-export:hover {
    background-color: var(--primary-hover);
  }
  
  .btn-retry {
    background-color: var(--primary);
    color: white;
    margin-top: 1rem;
  }
  
  .btn-retry:hover {
    background-color: var(--primary-hover);
  }
  
  /* Results Section */
  .results-section {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .results-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--dark-gray);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .results-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 0.5rem;
    background-color: var(--primary);
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 9999px;
  }
  
  /* Loading, Error, Empty States */
  .loading-container,
  .error-container,
  .empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background-color: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    text-align: center;
  }
  
  .loading-icon {
    width: 2rem;
    height: 2rem;
    color: var(--primary);
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  .error-icon {
    width: 2rem;
    height: 2rem;
    color: var(--danger);
    margin-bottom: 1rem;
  }
  
  .empty-icon {
    width: 2.5rem;
    height: 2.5rem;
    color: var(--gray);
    margin-bottom: 1rem;
  }
  
  .empty-subtitle {
    color: var(--gray);
    margin-top: 0.5rem;
  }
  
  /* Audit List */
  .audit-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1rem;
  }
  
  .audit-item {
    background-color: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;
    transition: var(--transition);
    cursor: pointer;
    animation: fadeIn 0.5s ease-in-out;
    animation-fill-mode: both;
  }
  
  .audit-item:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  .audit-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .audit-badges {
    display: flex;
    gap: 0.5rem;
  }
  
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .badge-success {
    background-color: rgba(16, 185, 129, 0.1);
    color: var(--success);
  }
  
  .badge-info {
    background-color: rgba(14, 165, 233, 0.1);
    color: var(--info);
  }
  
  .badge-warning {
    background-color: rgba(245, 158, 11, 0.1);
    color: var(--warning);
  }
  
  .badge-danger {
    background-color: rgba(239, 68, 68, 0.1);
    color: var(--danger);
  }
  
  .badge-purple {
    background-color: rgba(139, 92, 246, 0.1);
    color: var(--purple);
  }
  
  .badge-pink {
    background-color: rgba(236, 72, 153, 0.1);
    color: var(--pink);
  }
  
  .badge-gray {
    background-color: rgba(107, 114, 128, 0.1);
    color: var(--gray);
  }
  
  .audit-date {
    font-size: 0.75rem;
    color: var(--gray);
  }
  
  .audit-item-content {
    padding: 1rem;
  }
  
  .audit-user {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--dark-gray);
  }
  
  .user-icon {
    width: 1rem;
    height: 1rem;
    color: var(--gray);
  }
  
  .audit-description {
    font-size: 0.875rem;
    color: var(--gray);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .audit-item-footer {
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--border-color);
    text-align: right;
  }
  
  .view-details {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--primary);
    transition: var(--transition);
  }
  
  .audit-item:hover .view-details {
    color: var(--primary-hover);
  }
  
  /* Modal */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: 50;
    animation: fadeIn 0.3s ease-in-out;
  }
  
  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 1rem;
  }
  
  .modal-content {
    width: 100%;
    max-width: 700px;
    max-height: 90vh;
    background-color: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    transform: scale(0.95);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  
  .modal-active .modal-content {
    transform: scale(1);
    opacity: 1;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--dark-gray);
  }
  
  .modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: none;
    background: none;
    border-radius: 9999px;
    cursor: pointer;
    transition: var(--transition);
  }
  
  .modal-close:hover {
    background-color: var(--light-gray);
  }
  
  .modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    max-height: calc(90vh - 4rem);
  }
  
  .detail-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .detail-badges {
    display: flex;
    gap: 0.5rem;
  }
  
  .detail-date {
    font-size: 0.875rem;
    color: var(--gray);
  }
  
  .detail-user {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background-color: var(--light-gray);
    border-radius: var(--radius);
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
  }
  
  .user-name {
    font-weight: 500;
    color: var(--dark-gray);
  }
  
  .user-email {
    font-size: 0.875rem;
    color: var(--gray);
  }
  
  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .detail-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--dark-gray);
  }
  
  .detail-value {
    font-size: 0.875rem;
    color: var(--gray);
    line-height: 1.5;
  }
  
  .detail-id {
    font-family: monospace;
    background-color: var(--light-gray);
    padding: 0.5rem;
    border-radius: var(--radius);
    overflow-wrap: break-word;
  }
  
  .detail-code {
    font-family: monospace;
    font-size: 0.875rem;
    background-color: var(--light-gray);
    padding: 1rem;
    border-radius: var(--radius);
    overflow-x: auto;
    white-space: pre-wrap;
  }
  
  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .audit-list {
      grid-template-columns: 1fr;
    }
  
    .filters-container {
      flex-direction: column;
    }
  
    .filter-group {
      width: 100%;
    }
  
    .filter-actions {
      margin-left: 0;
      width: 100%;
      justify-content: space-between;
    }
  
    .modal-content {
      max-height: 95vh;
    }
  }
  
  /* Apply animations to list items with delay */
  .audit-item:nth-child(1) { animation-delay: 0.05s; }
  .audit-item:nth-child(2) { animation-delay: 0.1s; }
  .audit-item:nth-child(3) { animation-delay: 0.15s; }
  .audit-item:nth-child(4) { animation-delay: 0.2s; }
  .audit-item:nth-child(5) { animation-delay: 0.25s; }
  .audit-item:nth-child(6) { animation-delay: 0.3s; }
  .audit-item:nth-child(7) { animation-delay: 0.35s; }
  .audit-item:nth-child(8) { animation-delay: 0.4s; }
  .audit-item:nth-child(9) { animation-delay: 0.45s; }
  .audit-item:nth-child(10) { animation-delay: 0.5s; }
  </style>