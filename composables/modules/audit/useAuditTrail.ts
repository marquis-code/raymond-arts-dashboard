import { ref, computed } from "vue"
import type { AuditTrail, AuditTrailFilters } from "~/types/audit"
import {audit_api } from '@/apiFactory/modules/audit'

export const useAuditTrail = () => {
  const auditTrails = ref<AuditTrail[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedAudit = ref<AuditTrail | null>(null)
  const showDetailModal = ref(false)

  // Filters
  const filters = ref<AuditTrailFilters>({
    action: null,
    module: null,
    user: null,
    dateRange: [null, null],
    searchQuery: "",
  })

  // Fetch audit trails
  const fetchAuditTrails = async () => {
    isLoading.value = true
    error.value = null

    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll use mock data
      // const mockData: AuditTrail[] = [
      //   {
      //     _id: "67ff15a7ab241251f7b77f08",
      //     action: "REMOVE",
      //     userId: {
      //       _id: "67fa8e31b42b0ed1af9e1a0f",
      //       firstName: "Raymomnd",
      //       lastName: "Arts",
      //       email: "raymond@gmail.com",
      //       fullName: "Raymomnd Arts",
      //       id: "67fa8e31b42b0ed1af9e1a0f",
      //     },
      //     module: "INVENTORY",
      //     description:
      //       "Inventory reduced for product {\n  _id: new ObjectId('67fabc48b42b0ed1af9e1a1c'),\n  name: 'anonymous',\n  price: 299.99,\n  images: [\n    'https://res.cloudinary.com/marquis/image/upload/v1744697883/nest-cloudinary/c3panorhzpkgbx6ovxqb.png',\n    'https://res.cloudinary.com/marquis/image/upload/v1744697883/nest-cloudinary/shwpegcellzcvxarvvys.png',\n    'https://res.cloudinary.com/marquis/image/upload/v1744697883/nest-cloudinary/yobbmgt4raifhjaqyyus.png'\n  ]\n}",
      //     changes: '{"quantity":2,"notes":"Order #ORD-70469407-457"}',
      //     createdAt: "2025-04-16T02:27:51.865Z",
      //     updatedAt: "2025-04-16T02:27:51.865Z",
      //     __v: 0,
      //   },
      //   {
      //     _id: "67ff15a7ab241251f7b77f09",
      //     action: "CREATE",
      //     userId: {
      //       _id: "67fa8e31b42b0ed1af9e1a0f",
      //       firstName: "Raymomnd",
      //       lastName: "Arts",
      //       email: "raymond@gmail.com",
      //       fullName: "Raymomnd Arts",
      //       id: "67fa8e31b42b0ed1af9e1a0f",
      //     },
      //     module: "PRODUCT",
      //     description: "New product created: Premium Headphones",
      //     changes: '{"name":"Premium Headphones","price":199.99,"category":"Electronics"}',
      //     createdAt: "2025-04-15T14:30:22.865Z",
      //     updatedAt: "2025-04-15T14:30:22.865Z",
      //     __v: 0,
      //   },
      //   {
      //     _id: "67ff15a7ab241251f7b77f10",
      //     action: "UPDATE",
      //     userId: {
      //       _id: "67fa8e31b42b0ed1af9e1a10",
      //       firstName: "Sarah",
      //       lastName: "Johnson",
      //       email: "sarah@example.com",
      //       fullName: "Sarah Johnson",
      //       id: "67fa8e31b42b0ed1af9e1a10",
      //     },
      //     module: "USER",
      //     description: "User profile updated",
      //     changes: '{"previousEmail":"sarah.old@example.com","newEmail":"sarah@example.com"}',
      //     createdAt: "2025-04-14T09:15:33.865Z",
      //     updatedAt: "2025-04-14T09:15:33.865Z",
      //     __v: 0,
      //   },
      //   {
      //     _id: "67ff15a7ab241251f7b77f11",
      //     action: "DELETE",
      //     userId: {
      //       _id: "67fa8e31b42b0ed1af9e1a11",
      //       firstName: "Admin",
      //       lastName: "User",
      //       email: "admin@system.com",
      //       fullName: "Admin User",
      //       id: "67fa8e31b42b0ed1af9e1a11",
      //     },
      //     module: "ORDER",
      //     description: "Order cancelled: #ORD-70469407-123",
      //     changes: '{"status":"CANCELLED","reason":"Customer request"}',
      //     createdAt: "2025-04-13T18:45:10.865Z",
      //     updatedAt: "2025-04-13T18:45:10.865Z",
      //     __v: 0,
      //   },
      //   {
      //     _id: "67ff15a7ab241251f7b77f12",
      //     action: "LOGIN",
      //     userId: {
      //       _id: "67fa8e31b42b0ed1af9e1a0f",
      //       firstName: "Raymomnd",
      //       lastName: "Arts",
      //       email: "raymond@gmail.com",
      //       fullName: "Raymomnd Arts",
      //       id: "67fa8e31b42b0ed1af9e1a0f",
      //     },
      //     module: "USER",
      //     description: "User logged in",
      //     changes: '{"ip":"192.168.1.1","device":"Chrome on Windows"}',
      //     createdAt: "2025-04-12T08:30:00.865Z",
      //     updatedAt: "2025-04-12T08:30:00.865Z",
      //     __v: 0,
      //   },
      // ]
      const response = await audit_api.$_fetch_all_audits_logs()

      auditTrails.value = response.data
    } catch (err) {
      error.value = "Failed to fetch audit trails"
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

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
        name: audit.userId.fullName,
      })
    })
    return Array.from(users.values())
  })

  // Reset filters
  const resetFilters = () => {
    filters.value = {
      action: null,
      module: null,
      user: null,
      dateRange: [null, null],
      searchQuery: "",
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
    const headers = ["ID", "Action", "User", "Module", "Description", "Changes", "Created At"]

    const csvRows = [
      headers.join(","),
      ...filteredAuditTrails.value.map((audit) => {
        // Format the data for CSV
        const description = audit.description.replace(/,/g, ";").replace(/\n/g, " ")
        const changes = audit.changes.replace(/,/g, ";").replace(/\n/g, " ")
        const date = new Date(audit.createdAt).toLocaleString()

        return [
          audit._id,
          audit.action,
          audit.userId.fullName,
          audit.module,
          `"${description}"`,
          `"${changes}"`,
          date,
        ].join(",")
      }),
    ]

    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.setAttribute("href", url)
    link.setAttribute("download", `audit-trail-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"

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

  // Get action color
  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-emerald-100 text-emerald-800"
      case "UPDATE":
        return "bg-blue-100 text-blue-800"
      case "DELETE":
      case "REMOVE":
        return "bg-red-100 text-red-800"
      case "LOGIN":
        return "bg-purple-100 text-purple-800"
      case "LOGOUT":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get module color
  const getModuleColor = (module: string) => {
    switch (module) {
      case "INVENTORY":
        return "bg-amber-100 text-amber-800"
      case "USER":
        return "bg-blue-100 text-blue-800"
      case "ORDER":
        return "bg-purple-100 text-purple-800"
      case "PRODUCT":
        return "bg-emerald-100 text-emerald-800"
      case "PAYMENT":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  onMounted(() => {
    fetchAuditTrails()
  })

  return {
    auditTrails,
    isLoading,
    error,
    filters,
    selectedAudit,
    showDetailModal,
    filteredAuditTrails,
    uniqueActions,
    uniqueModules,
    uniqueUsers,
    fetchAuditTrails,
    resetFilters,
    viewAuditDetail,
    closeDetailModal,
    exportToCSV,
    formatJSON,
    getActionColor,
    getModuleColor,
  }
}
