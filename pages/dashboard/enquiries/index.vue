<template>
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-xl font-bold text-gray-900">Enquiries Management</h1>
          <p class="text-gray-600 mt-2">Manage and track customer enquiries</p>
        </div>
  
        <!-- Filters and Search -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name, email, subject..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
  
            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                v-model="statusFilter"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="resolved">Resolved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
  
            <!-- Date Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                v-model="dateFilter"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
  
          <!-- Results Summary -->
          <div class="mt-4 text-sm text-gray-600">
            Showing {{ filteredEnquiries.length }} of {{ enquiries.length }} enquiries
          </div>
        </div>
  
        <!-- Enquiries Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name & Contact
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="enquiry in filteredEnquiries"
                  :key="enquiry._id"
                  class="hover:bg-gray-50 cursor-pointer"
                  @click="viewEnquiry(enquiry)"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ enquiry.name }}</div>
                      <div class="text-sm text-gray-500">{{ enquiry.email }}</div>
                      <div class="text-sm text-gray-500">{{ enquiry.phone }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 max-w-xs truncate">{{ enquiry.subject }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        enquiry.isResolved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      ]"
                    >
                      {{ enquiry.isResolved ? 'Resolved' : 'Pending' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(enquiry.createdAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      @click.stop="toggleStatus(enquiry)"
                      :class="[
                        'px-3 py-1 rounded text-xs font-medium',
                        enquiry.isResolved
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      ]"
                    >
                      {{ enquiry.isResolved ? 'Mark Pending' : 'Mark Resolved' }}
                    </button>
                    <button
                      @click.stop="editEnquiry(enquiry)"
                      class="text-blue-600 hover:text-blue-900 px-2 py-1"
                    >
                      Edit
                    </button>
                    <button
                      @click.stop="deleteEnquiry(enquiry._id)"
                      class="text-red-600 hover:text-red-900 px-2 py-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Empty State -->
          <div v-if="filteredEnquiries.length === 0" class="text-center py-12">
            <div class="text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No enquiries found</h3>
              <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- View/Edit Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        @click="closeModal"
      >
        <div
          class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white"
          @click.stop
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ isEditing ? 'Edit Enquiry' : 'Enquiry Details' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          <div v-if="selectedEnquiry" class="space-y-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                v-if="isEditing"
                v-model="editForm.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-else class="text-sm text-gray-900">{{ selectedEnquiry.name }}</p>
            </div>
  
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-if="isEditing"
                v-model="editForm.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-else class="text-sm text-gray-900">{{ selectedEnquiry.email }}</p>
            </div>
  
            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                v-if="isEditing"
                v-model="editForm.phone"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-else class="text-sm text-gray-900">{{ selectedEnquiry.phone }}</p>
            </div>
  
            <!-- Subject -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                v-if="isEditing"
                v-model="editForm.subject"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-else class="text-sm text-gray-900">{{ selectedEnquiry.subject }}</p>
            </div>
  
            <!-- Message -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                v-if="isEditing"
                v-model="editForm.message"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <p v-else class="text-sm text-gray-900 whitespace-pre-wrap">{{ selectedEnquiry.message }}</p>
            </div>
  
            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                v-if="isEditing"
                v-model="editForm.isResolved"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option :value="false">Pending</option>
                <option :value="true">Resolved</option>
              </select>
              <span
                v-else
                :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  selectedEnquiry.isResolved
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                ]"
              >
                {{ selectedEnquiry.isResolved ? 'Resolved' : 'Pending' }}
              </span>
            </div>
  
            <!-- Dates -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Created</label>
                <p class="text-sm text-gray-500">{{ formatDate(selectedEnquiry.createdAt) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Updated</label>
                <p class="text-sm text-gray-500">{{ formatDate(selectedEnquiry.updatedAt) }}</p>
              </div>
            </div>
          </div>
  
          <!-- Modal Actions -->
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {{ isEditing ? 'Cancel' : 'Close' }}
            </button>
            <button
              v-if="!isEditing"
              @click="startEditing"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              v-else
              @click="saveEnquiry"
              class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
  
      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        @click="cancelDelete"
      >
        <div
          class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
          @click.stop
        >
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Confirm Delete</h3>
            <p class="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this enquiry? This action cannot be undone.
            </p>
            <div class="flex justify-center space-x-3">
              <button
                @click="cancelDelete"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                @click="confirmDelete"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useFetchEnquiries } from "@/composables/modules/enquiries/useFetchEnquiries"
  import { useUpdateEnquiry } from  "@/composables/modules/enquiries/useUpdateEnquiry"
  import { useDeleteEnquiry } from "@/composables/modules/enquiries/useDeleteEnquiry"
  import { useUpdateEnquiryStatus } from "@/composables/modules/enquiries/useUpdateEnquiryStatus"
  interface Enquiry {
    _id: string
    name: string
    email: string
    phone: string
    subject: string
    message: string
    isResolved: boolean
    createdAt: string
    updatedAt: string
    __v: number
  }

  const { loading, enquiries } =  useFetchEnquiries()
  const {  loading: updating, updateEnquiry } =  useUpdateEnquiry()
  const { loading: deleting } = useDeleteEnquiry()
  const { updateStatus, loading: propcessingStatusUpdate} = useUpdateEnquiryStatus()
  
//   // Sample data - replace with actual API calls
//   const enquiries = ref<Enquiry[]>([
//     {
//       "_id": "68312e070339366a8ab3808d",
//       "name": "Boku",
//       "email": "boju@gmail.com",
//       "phone": "09012345671",
//       "subject": "Enquiry submitted successfully",
//       "message": "I need help with my account settings and password reset functionality.",
//       "isResolved": false,
//       "createdAt": "2025-05-24T02:25:11.145Z",
//       "updatedAt": "2025-05-24T02:25:11.145Z",
//       "__v": 0
//     },
//     {
//       "_id": "68312e070339366a8ab3808e",
//       "name": "Jane Smith",
//       "email": "jane@example.com",
//       "phone": "09087654321",
//       "subject": "Product inquiry",
//       "message": "I would like to know more about your premium features and pricing plans.",
//       "isResolved": true,
//       "createdAt": "2025-05-23T10:15:30.000Z",
//       "updatedAt": "2025-05-23T14:20:45.000Z",
//       "__v": 0
//     },
//     {
//       "_id": "68312e070339366a8ab3808f",
//       "name": "John Doe",
//       "email": "john@example.com",
//       "phone": "09011111111",
//       "subject": "Technical support",
//       "message": "The application crashes when I try to upload large files. Please help.",
//       "isResolved": false,
//       "createdAt": "2025-05-22T16:30:00.000Z",
//       "updatedAt": "2025-05-22T16:30:00.000Z",
//       "__v": 0
//     }
//   ])
  
  // Reactive state
  const searchQuery = ref('')
  const statusFilter = ref('all')
  const dateFilter = ref('all')
  const showModal = ref(false)
  const showDeleteModal = ref(false)
  const selectedEnquiry = ref<Enquiry | null>(null)
  const isEditing = ref(false)
  const deleteEnquiryId = ref<string | null>(null)
  
  // Edit form
  const editForm = ref<Partial<Enquiry>>({})
  
  // Computed properties
  const filteredEnquiries = computed(() => {
    let filtered = enquiries.value
  
    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(enquiry =>
        enquiry.name.toLowerCase().includes(query) ||
        enquiry.email.toLowerCase().includes(query) ||
        enquiry.subject.toLowerCase().includes(query) ||
        enquiry.message.toLowerCase().includes(query)
      )
    }
  
    // Status filter
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter(enquiry => {
        if (statusFilter.value === 'resolved') return enquiry.isResolved
        if (statusFilter.value === 'pending') return !enquiry.isResolved
        return true
      })
    }
  
    // Date filter
    if (dateFilter.value !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      filtered = filtered.filter(enquiry => {
        const enquiryDate = new Date(enquiry.createdAt)
        
        switch (dateFilter.value) {
          case 'today':
            return enquiryDate >= today
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
            return enquiryDate >= weekAgo
          case 'month':
            const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
            return enquiryDate >= monthAgo
          default:
            return true
        }
      })
    }
  
    // Sort by created date (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  })
  
  // Methods
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const viewEnquiry = (enquiry: Enquiry) => {
    selectedEnquiry.value = enquiry
    isEditing.value = false
    showModal.value = true
  }
  
  const editEnquiry = (enquiry: Enquiry) => {
    selectedEnquiry.value = enquiry
    editForm.value = { ...enquiry }
    isEditing.value = true
    showModal.value = true
  }
  
  const startEditing = () => {
    if (selectedEnquiry.value) {
      editForm.value = { ...selectedEnquiry.value }
      isEditing.value = true
    }
  }
  
  const saveEnquiry = async () => {
    if (!selectedEnquiry.value || !editForm.value) return
  
    try {
      // Here you would make an API call to update the enquiry
      // const response = await $fetch(`/api/enquiries/${selectedEnquiry.value._id}`, {
      //   method: 'PUT',
      //   body: editForm.value
      // })
  
      await updateEnquiry(selectedEnquiry.value._id, editForm.value).then(() => {
        isEditing.value = false
      })
      // Update local data
    //   const index = enquiries.value.findIndex(e => e._id === selectedEnquiry.value!._id)
    //   if (index !== -1) {
    //     enquiries.value[index] = {
    //       ...enquiries.value[index],
    //       ...editForm.value,
    //       updatedAt: new Date().toISOString()
    //     }
    //     selectedEnquiry.value = enquiries.value[index]
    //   }
  
    //   isEditing.value = false
      // You might want to show a success toast here
    } catch (error) {
      console.error('Failed to update enquiry:', error)
      // Handle error - show error toast
    }
  }
  
  const toggleStatus = async (enquiry: Enquiry) => {
  try {
    // Find the index of the enquiry
    const index = enquiries.value.findIndex(e => e._id === enquiry._id);
    if (index === -1) return;

    // Toggle the current status
    const newStatus = !enquiries.value[index].isResolved;

    // Call the API to update status
    await updateStatus(enquiry._id, { status: newStatus ? 'resolved' : 'pending' });

    // Update local data
    enquiries.value[index].isResolved = newStatus;
    enquiries.value[index].updatedAt = new Date().toISOString();
  } catch (error) {
    console.error('Failed to update status:', error);
    // Optionally show a toast or set a reactive error state
  }
}

  
  const deleteEnquiry = (id: string) => {
    deleteEnquiryId.value = id
    showDeleteModal.value = true
  }
  
  const confirmDelete = async () => {
    if (!deleteEnquiryId.value) return
    await deleteEnquiry(deleteEnquiryId.value)
    closeModal()
    showDeleteModal.value = false
    deleteEnquiryId.value = null
  
    // try {
    //   // Here you would make an API call to delete the enquiry
    //   // await $fetch(`/api/enquiries/${deleteEnquiryId.value}`, {
    //   //   method: 'DELETE'
    //   // })
    //   await deleteEnquiry(deleteEnquiryId.value).then(() => {

    //   })
  
    //   // Update local data
    // //   enquiries.value = enquiries.value.filter(e => e._id !== deleteEnquiryId.value)
      
    // //   showDeleteModal.value = false
    // //   deleteEnquiryId.value = null
      
    // //   // Close main modal if the deleted enquiry was selected
    // //   if (selectedEnquiry.value?._id === deleteEnquiryId.value) {
    // //     closeModal()
    // //   }
    // } catch (error) {
    //   console.error('Failed to delete enquiry:', error)
    //   // Handle error
    // }
  }
  
  const cancelDelete = () => {
    showDeleteModal.value = false
    deleteEnquiryId.value = null
  }
  
  const closeModal = () => {
    showModal.value = false
    selectedEnquiry.value = null
    isEditing.value = false
    editForm.value = {}
  }

  definePageMeta({
      layout: 'dashboard'
  })
  
  // SEO and page meta
  useHead({
    title: 'Enquiries Management',
    meta: [
      { name: 'description', content: 'Manage and track customer enquiries efficiently' }
    ]
  })
  </script>