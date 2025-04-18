<template>
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Payment Links Management</h1>
          <p class="text-gray-500 mt-1">Create and manage payment links for your artwork</p>
        </div>
        <div class="flex gap-3">
          <button @click="isCreateLinkModalOpen = true" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            <Plus class="h-4 w-4 mr-2" />
            Create Payment Link
          </button>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Active Payment Links</h2>
          <div class="relative">
            <input 
              type="text" 
              placeholder="Search links..." 
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(link, index) in paymentLinks" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ link.name }}</div>
                  <div class="text-xs text-violet-600 truncate max-w-xs">{{ link.url }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ link.product }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${{ link.price.toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ link.created }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ link.expires || 'Never' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="{
                      'bg-green-100 text-green-800': link.status === 'Active',
                      'bg-gray-100 text-gray-800': link.status === 'Inactive',
                      'bg-red-100 text-red-800': link.status === 'Expired'
                    }">
                    {{ link.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button @click="copyLink(link)" class="text-gray-400 hover:text-gray-500">
                      <Copy class="h-4 w-4" />
                    </button>
                    <button @click="editLink(link)" class="text-gray-400 hover:text-gray-500">
                      <Edit class="h-4 w-4" />
                    </button>
                    <button @click="toggleLinkStatus(link)" class="text-gray-400 hover:text-gray-500">
                      <component :is="link.status === 'Active' ? 'EyeOff' : 'Eye'" class="h-4 w-4" />
                    </button>
                    <button @click="deleteLink(link)" class="text-gray-400 hover:text-red-500">
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div v-if="isCreateLinkModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Create Payment Link
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div>
                      <label for="link-name" class="block text-sm font-medium text-gray-700">Link Name</label>
                      <input type="text" id="link-name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]" />
                    </div>
                    <div>
                      <label for="link-product" class="block text-sm font-medium text-gray-700">Product</label>
                      <select id="link-product" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
                        <option value="">Select a product</option>
                        <option value="1">Abstract Sunset - $350.00</option>
                        <option value="2">Urban Landscape - $125.00</option>
                        <option value="3">Serenity - $500.00</option>
                        <option value="4">Digital Dreams - $75.00</option>
                        <option value="5">Forest Path - $45.00</option>
                      </select>
                    </div>
                    <div>
                      <label for="link-price" class="block text-sm font-medium text-gray-700">Price ($)</label>
                      <input type="number" id="link-price" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]" />
                    </div>
                    <div>
                      <label for="link-expiry" class="block text-sm font-medium text-gray-700">Expiry Date (Optional)</label>
                      <input type="date" id="link-expiry" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm">
                Create Link
              </button>
              <button @click="isCreateLinkModalOpen = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Plus, Search, Copy, Edit, Trash2, Eye, EyeOff } from 'lucide-vue-next'
  
  const isCreateLinkModalOpen = ref(false)
  
  // Sample payment links data
  const paymentLinks = ref([
    { 
      name: 'Abstract Sunset Purchase', 
      url: 'https://artgallery.com/pay/abstract-sunset-xyz123', 
      product: 'Abstract Sunset', 
      price: 350.00, 
      created: 'Apr 1, 2025', 
      expires: 'May 1, 2025', 
      status: 'Active' 
    },
    { 
      name: 'Urban Landscape Limited Offer', 
      url: 'https://artgallery.com/pay/urban-landscape-abc456', 
      product: 'Urban Landscape', 
      price: 125.00, 
      created: 'Mar 25, 2025', 
      expires: 'Apr 25, 2025', 
      status: 'Active' 
    },
    { 
      name: 'Digital Art Collection', 
      url: 'https://artgallery.com/pay/digital-collection-def789', 
      product: 'Digital Dreams', 
      price: 75.00, 
      created: 'Mar 15, 2025', 
      expires: null, 
      status: 'Active' 
    },
    { 
      name: 'Spring Sale - Forest Path', 
      url: 'https://artgallery.com/pay/forest-path-ghi012', 
      product: 'Forest Path', 
      price: 45.00, 
      created: 'Mar 10, 2025', 
      expires: 'Mar 31, 2025', 
      status: 'Expired' 
    },
    { 
      name: 'Serenity Sculpture Pre-order', 
      url: 'https://artgallery.com/pay/serenity-jkl345', 
      product: 'Serenity', 
      price: 500.00, 
      created: 'Mar 5, 2025', 
      expires: null, 
      status: 'Inactive' 
    }
  ])
  
  // Link actions
  const copyLink = (link: any) => {
    navigator.clipboard.writeText(link.url)
    alert('Link copied to clipboard!')
  }
  
  const editLink = (link: any) => {
    // In a real app, this would open the edit modal with the link data
    isCreateLinkModalOpen.value = true
  }
  
  const toggleLinkStatus = (link: any) => {
    link.status = link.status === 'Active' ? 'Inactive' : 'Active'
  }
  
  const deleteLink = (link: any) => {
    if (confirm('Are you sure you want to delete this payment link?')) {
      const index = paymentLinks.value.findIndex(l => l.url === link.url)
      if (index !== -1) {
        paymentLinks.value.splice(index, 1)
      }
    }
  }
  </script>