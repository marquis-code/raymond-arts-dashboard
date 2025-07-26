<template>
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-xl font-bold text-gray-900 mb-2">Commission Requests Management</h1>
          <p class="text-gray-600">Manage commission requests and drawing types</p>
        </div>
  
        <!-- Tabs -->
        <div class="mb-6">
          <nav class="flex space-x-8">
            <button
              @click="activeTab = 'commissions'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'commissions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Commission Requests
            </button>
            <button
              @click="activeTab = 'drawing-types'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'drawing-types'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Drawing Types
            </button>
          </nav>
        </div>
  
        <!-- Commission Requests Tab -->
        <div v-if="activeTab === 'commissions'">
          <!-- Commission Requests Table -->
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Commission Requests</h3>
              
              <!-- Mobile view -->
              <div class="block sm:hidden">
                <div v-for="commission in commissions" :key="commission._id" class="mb-4 p-4 border rounded-lg">
                  <div class="flex justify-between items-start mb-2">
                    <h4 class="font-semibold">{{ commission.firstName }} {{ commission.lastName }}</h4>
                    <span :class="getStatusClass(commission.status)" class="px-2 py-1 text-xs rounded-full">
                      {{ commission.status }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">{{ commission.subject }}</p>
                  <p class="text-sm text-gray-500 mb-2">{{ commission?.drawingType?.name }}</p>
                  <p class="text-sm text-gray-500 mb-3">Due: {{ formatDate(commission.deadline) }}</p>
                  <button
                    @click="openCommissionModal(commission)"
                    class="w-full bg-indigo-600 text-white px-3 py-2 rounded text-sm hover:bg-indigo-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
  
              <!-- Desktop view -->
              <div class="hidden sm:block overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drawing Type</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="commission in commissions" :key="commission._id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div class="text-sm font-medium text-gray-900">{{ commission.firstName }} {{ commission.lastName }}</div>
                          <div class="text-sm text-gray-500">{{ commission.email }}</div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-gray-900">{{ commission.subject }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ commission?.drawingType?.name }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ formatDate(commission.deadline) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="getStatusClass(commission.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                          {{ commission.status }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          @click="openCommissionModal(commission)"
                          class="text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Drawing Types Tab -->
        <div v-if="activeTab === 'drawing-types'">
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-2 sm:mb-0">Drawing Types</h3>
                <button
                  @click="openDrawingTypeModal()"
                  class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Add Drawing Type
                </button>
              </div>
  
              <!-- Mobile view -->
              <div class="block sm:hidden">
                <div v-for="type in drawingTypes" :key="type._id" class="mb-4 p-4 border rounded-lg">
                  <div class="flex justify-between items-start mb-2">
                    <h4 class="font-semibold">{{ type.name }}</h4>
                    <span :class="type.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 text-xs rounded-full">
                      {{ type.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-3">{{ type.description }}</p>
                  <div class="flex space-x-2">
                    <button
                      @click="openDrawingTypeModal(type)"
                      class="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteDrawingType(type._id)"
                      class="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
  
              <!-- Desktop view -->
              <div class="hidden sm:block overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="type in drawingTypes" :key="type._id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">{{ type.name }}</div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-gray-900">{{ type.description }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="type.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                          {{ type.isActive ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          @click="openDrawingTypeModal(type)"
                          class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          @click="handleDeleteDrawingType(type._id)"
                          class="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Commission Details Modal -->
        <div v-if="showCommissionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Commission Request Details</h3>
              <button @click="closeCommissionModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div v-if="selectedCommission" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-2">Client Information</h4>
                <div class="bg-gray-50 p-4 space-y-3 leading-relaxed rounded-lg">
                  <p><strong>Name:</strong> {{ selectedCommission.firstName }} {{ selectedCommission.lastName }}</p>
                  <p><strong>Email:</strong> {{ selectedCommission.email }}</p>
                  <p><strong>Phone:</strong> {{ selectedCommission.phone }}</p>
                </div>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-2">Request Details</h4>
                <div class="bg-gray-50 p-4 space-y-3 leading-relaxed rounded-lg">
                  <p><strong>Subject:</strong> {{ selectedCommission.subject }}</p>
                  <p><strong>Drawing Type:</strong> {{ selectedCommission?.drawingType?.name }}</p>
                  <p><strong>Deadline:</strong> {{ formatDate(selectedCommission.deadline) }}</p>
                  <p><strong>Status:</strong> 
                    <span :class="getStatusClass(selectedCommission.status)" class="px-2 py-1 text-xs rounded-full ml-2">
                      {{ selectedCommission.status }}
                    </span>
                  </p>
                </div>
              </div>
              
              <div class="md:col-span-2">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Message</h4>
                <div class="bg-gray-50 leading-loose p-4 rounded-lg">
                  <p>{{ selectedCommission.message }}</p>
                </div>
              </div>
              
              <div class="md:col-span-2" v-if="selectedCommission.referencePhotos.length > 0">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Reference Photos</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div v-for="photo in selectedCommission.referencePhotos" :key="photo" class="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <span class="text-gray-500 text-sm">{{ photo.split('/').pop() }}</span>
                  </div>
                </div>
              </div>
              
              <div class="md:col-span-2">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Timestamps</h4>
                <div class="bg-gray-50 p-4 space-y-3 rounded-lg">
                  <p><strong>Created:</strong> {{ formatDateTime(selectedCommission.createdAt) }}</p>
                  <p><strong>Updated:</strong> {{ formatDateTime(selectedCommission.updatedAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Drawing Type Modal -->
        <div v-if="showDrawingTypeModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">{{ editingDrawingType ? 'Edit' : 'Add' }} Drawing Type</h3>
              <button @click="closeDrawingTypeModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <form @submit.prevent="saveDrawingType">
              <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  v-model="drawingTypeForm.name"
                  type="text"
                  id="name"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div class="mb-4">
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  v-model="drawingTypeForm.description"
                  id="description"
                  rows="3"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              
              <div class="mb-6">
                <label class="flex items-center">
                  <input
                    v-model="drawingTypeForm.isActive"
                    type="checkbox"
                    class="sr-only"
                  />
                  <div class="relative">
                    <div :class="drawingTypeForm.isActive ? 'bg-indigo-600' : 'bg-gray-200'" class="block bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div :class="drawingTypeForm.isActive ? 'translate-x-6' : 'translate-x-0'" class="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform"></div>
                  </div>
                  <span class="ml-3 text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
              
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeDrawingTypeModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  {{ editingDrawingType ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useFetchCommissionRequests } from "@/composables/modules/commission-requests/useFetchCommissionRequests"
  import { useDeleteCommissionRequest } from "@/composables/modules/commission-requests/useDeleteCommissionRequest"
  import { useDeleteDrawingType } from "@/composables/modules/drawing-types/useDeleteDrawingType"
  import { useCreateDrawingType } from "@/composables/modules/drawing-types/useCreateDrawingType"
  import { useFetchDrawingTypes } from "@/composables/modules/drawing-types/useFetchDrawingTypes"
  import { useUpdateDrawingType } from "@/composables/modules/drawing-types/useUpdateDrawingType"
  const { loading, requests: commissions } = useFetchCommissionRequests()
  const { deleteCommissionRequest, loading: deleting } = useDeleteCommissionRequest()
  const { createDrawingType, loading: creatingDrawingType } = useCreateDrawingType()
  const { loading: fetchingDrawingTypes, drawingTypes: drawingTypes } = useFetchDrawingTypes()
  const { updateDrawingType, loading: updatingDrawingType } = useUpdateDrawingType()
  const { deleteDrawingType, loading:deletingType } = useDeleteDrawingType()
  interface DrawingType {
    _id: string
    name: string
    description: string
    isActive?: boolean
  }
  
  interface CommissionRequest {
    _id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    subject: string
    message: string
    deadline: string
    drawingType: DrawingType
    referencePhotos: string[]
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
    createdAt: string
    updatedAt: string
    __v: number
  }
  
  interface DrawingTypeForm {
    name: string
    description: string
    isActive: boolean
  }
  
  // Reactive data
  const activeTab = ref<'commissions' | 'drawing-types'>('commissions')
  const showCommissionModal = ref(false)
  const showDrawingTypeModal = ref(false)
  const selectedCommission = ref<CommissionRequest | null>(null)
  const editingDrawingType = ref<DrawingType | null>(null)
  const drawingTypeForm = ref<DrawingTypeForm>({
    name: '',
    description: '',
    isActive: true
  })
  
  // Sample data
//   const commissions = ref<CommissionRequest[]>([
//     {
//       "_id": "6831bad73469213a57596fc5",
//       "firstName": "John",
//       "lastName": "Doe",
//       "email": "john.doe@example.com",
//       "phone": "+1234567890",
//       "subject": "Family Portrait Commission",
//       "message": "I would like to commission a family portrait for my anniversary. We are a family of 4 - 2 adults and 2 children. I'm looking for a realistic style drawing that captures our warm family moments.",
//       "deadline": "2025-07-15T00:00:00.000Z",
//       "drawingType": {
//           "_id": "6831ba953469213a57596fc0",
//           "name": "Portrait Drawing",
//           "description": "Beautiful portrait drawings",
//           "isActive": true
//       },
//       "referencePhotos": [
//           "/uploads/family-photo-1.jpg",
//           "/uploads/family-photo-2.jpg"
//       ],
//       "status": "pending",
//       "createdAt": "2025-05-24T12:25:59.598Z",
//       "updatedAt": "2025-05-24T12:25:59.598Z",
//       "__v": 0
//     },
//     {
//       "_id": "6831bad73469213a57596fc6",
//       "firstName": "Jane",
//       "lastName": "Smith",
//       "email": "jane.smith@example.com",
//       "phone": "+1987654321",
//       "subject": "Pet Portrait Commission",
//       "message": "I'd like a portrait of my beloved dog who recently passed away. Looking for a detailed, realistic drawing that captures his personality.",
//       "deadline": "2025-06-30T00:00:00.000Z",
//       "drawingType": {
//           "_id": "6831ba953469213a57596fc1",
//           "name": "Pet Portrait",
//           "description": "Pet portrait drawings",
//           "isActive": true
//       },
//       "referencePhotos": [
//           "/uploads/dog-photo-1.jpg"
//       ],
//       "status": "in-progress",
//       "createdAt": "2025-05-23T10:15:30.598Z",
//       "updatedAt": "2025-05-24T09:20:15.598Z",
//       "__v": 0
//     }
//   ])
  
//   const drawingTypes = ref<DrawingType[]>([
//     {
//       "_id": "6831ba953469213a57596fc0",
//       "name": "Portrait Drawing",
//       "description": "Beautiful portrait drawings",
//       "isActive": true
//     },
//     {
//       "_id": "6831ba953469213a57596fc1",
//       "name": "Pet Portrait",
//       "description": "Pet portrait drawings",
//       "isActive": true
//     },
//     {
//       "_id": "6831ba953469213a57596fc2",
//       "name": "Landscape Drawing",
//       "description": "Beautiful landscape and nature drawings",
//       "isActive": false
//     }
//   ])
  
  // Methods
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const getStatusClass = (status: string): string => {
    const classes = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    }
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
  }
  
  const openCommissionModal = (commission: CommissionRequest): void => {
    selectedCommission.value = commission
    showCommissionModal.value = true
  }
  
  const closeCommissionModal = (): void => {
    showCommissionModal.value = false
    selectedCommission.value = null
  }
  
  const openDrawingTypeModal = (drawingType?: DrawingType): void => {
    if (drawingType) {
      editingDrawingType.value = drawingType
      drawingTypeForm.value = {
        name: drawingType.name,
        description: drawingType.description,
        isActive: drawingType.isActive || true
      }
    } else {
      editingDrawingType.value = null
      drawingTypeForm.value = {
        name: '',
        description: '',
        isActive: true
      }
    }
    showDrawingTypeModal.value = true
  }
  
  const closeDrawingTypeModal = (): void => {
    showDrawingTypeModal.value = false
    editingDrawingType.value = null
    drawingTypeForm.value = {
      name: '',
      description: '',
      isActive: true
    }
  }
  
  const saveDrawingType =  async () => {
    if (editingDrawingType.value) {
    await updateDrawingType(editingDrawingType.value._id, drawingTypeForm.value).finally(() => {
        closeDrawingTypeModal()
    })
    } else {
    await createDrawingType(drawingTypeForm.value).finally(() => {
        closeDrawingTypeModal()
    })
    }
  }
  
  const handleDeleteDrawingType = async (id: string) => {
    await deleteDrawingType(id)
    // if (confirm('Are you sure you want to delete this drawing type?')) {
    //   drawingTypes.value = drawingTypes.value.filter(dt => dt._id !== id)
    // }
  }
  
  // Set page title
  useHead({
    title: 'Commission Requests Management'
  })
  
  definePageMeta({
      layout: 'dashboard'
  })
  </script>