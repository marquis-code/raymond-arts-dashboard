<template>
    <div class="space-y-6">
      <!-- Header with actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p class="text-gray-500 mt-1">Track and manage your artwork inventory</p>
        </div>
        <div class="flex gap-3">
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search inventory..." 
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <button @click="isAddItemModalOpen = true" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            <Plus class="h-4 w-4 mr-2" />
            Add Inventory
          </button>
        </div>
      </div>
  
      <!-- Inventory Filters -->
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label for="category-filter" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select id="category-filter" v-model="filters.category" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
              <option value="all">All Categories</option>
              <option value="painting">Paintings</option>
              <option value="print">Prints</option>
              <option value="digital">Digital Art</option>
              <option value="sculpture">Sculptures</option>
              <option value="photography">Photography</option>
            </select>
          </div>
          <div>
            <label for="stock-status" class="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
            <select id="stock-status" v-model="filters.stockStatus" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
          <div>
            <label for="sort-by" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select id="sort-by" v-model="filters.sortBy" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="stock-asc">Stock (Low to High)</option>
              <option value="stock-desc">Stock (High to Low)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
          <div>
            <label for="price-range" class="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <div class="flex items-center space-x-2">
              <input 
                type="number" 
                v-model="filters.minPrice" 
                placeholder="Min" 
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]"
              />
              <span>-</span>
              <input 
                type="number" 
                v-model="filters.maxPrice" 
                placeholder="Max" 
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]"
              />
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-end space-x-3">
          <button @click="resetFilters" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            Reset
          </button>
          <button @click="applyFilters" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            Apply Filters
          </button>
        </div>
      </div>
  
      <!-- Inventory Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in filteredInventory" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <img :src="item.image" :alt="item.name" class="h-10 w-10 rounded-md object-cover" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.sku }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.category }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${{ item.price.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.stock }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="{
                      'bg-green-100 text-green-800': item.stock > 5,
                      'bg-yellow-100 text-yellow-800': item.stock > 0 && item.stock <= 5,
                      'bg-red-100 text-red-800': item.stock === 0
                    }">
                    {{ item.stock > 5 ? 'In Stock' : item.stock > 0 ? 'Low Stock' : 'Out of Stock' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button @click="adjustStock(item)" class="text-violet-600 hover:text-violet-900">
                      <RefreshCw class="h-4 w-4" />
                    </button>
                    <button @click="editInventoryItem(item)" class="text-blue-600 hover:text-blue-900">
                      <Edit class="h-4 w-4" />
                    </button>
                    <button @click="deleteInventoryItem(item)" class="text-red-600 hover:text-red-900">
                      <Trash2 class="h-4 w-4" />
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
            <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">{{ inventory.length }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Previous</span>
                  <ChevronLeft class="h-5 w-5" />
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-violet-50 text-sm font-medium text-violet-600 hover:bg-violet-100">
                  1
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Next</span>
                  <ChevronRight class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Add/Edit Inventory Item Modal -->
      <div v-if="isAddItemModalOpen || isEditItemModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
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
                    {{ isEditItemModalOpen ? 'Edit Inventory Item' : 'Add Inventory Item' }}
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div>
                      <label for="item-name" class="block text-sm font-medium text-gray-700">Product Name</label>
                      <input type="text" id="item-name" v-model="currentItem.name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]" />
                    </div>
                    <div>
                      <label for="item-sku" class="block text-sm font-medium text-gray-700">SKU</label>
                      <input type="text" id="item-sku" v-model="currentItem.sku" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]" />
                    </div>
                    <div>
                      <label for="item-category" class="block text-sm font-medium text-gray-700">Category</label>
                      <select id="item-category" v-model="currentItem.category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
                        <option value="painting">Painting</option>
                        <option value="print">Print</option>
                        <option value="digital">Digital Art</option>
                        <option value="sculpture">Sculpture</option>
                        <option value="photography">Photography</option>
                      </select>
                    </div>
                    <div>
                      <label for="item-price" class="block text-sm font-medium text-gray-700">Price ($)</label>
                      <input type="number" id="item-price" v-model="currentItem.price" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]" />
                    </div>
                    <div>
                      <label for="item-stock" class="block text-sm font-medium text-gray-700">Stock Quantity</label>
                      <input type="number" id="item-stock" v-model="currentItem.stock" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]" />
                    </div>
                    <div>
                      <label for="item-description" class="block text-sm font-medium text-gray-700">Description</label>
                      <textarea id="item-description" v-model="currentItem.description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]"></textarea>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Image</label>
                      <div class="mt-1 flex items-center">
                        <div class="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                          <img v-if="currentItem.image" :src="currentItem.image" alt="Product preview" class="h-full w-full object-cover" />
                          <div v-else class="h-full w-full flex items-center justify-center text-gray-400">
                            <Image class="h-8 w-8" />
                          </div>
                        </div>
                        <button type="button" class="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="saveInventoryItem" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm">
                {{ isEditItemModalOpen ? 'Update Item' : 'Add Item' }}
              </button>
              <button @click="closeItemModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Adjust Stock Modal -->
      <div v-if="isAdjustStockModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
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
                    Adjust Stock for {{ currentItem.name }}
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div>
                      <label for="current-stock" class="block text-sm font-medium text-gray-700">Current Stock</label>
                      <input type="number" id="current-stock" :value="currentItem.stock" disabled class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm" />
                    </div>
                    <div>
                      <label for="adjustment-type" class="block text-sm font-medium text-gray-700">Adjustment Type</label>
                      <select id="adjustment-type" v-model="stockAdjustment.type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
                        <option value="add">Add Stock</option>
                        <option value="remove">Remove Stock</option>
                        <option value="set">Set Stock</option>
                      </select>
                    </div>
                    <div>
                      <label for="adjustment-quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
                      <input type="number" id="adjustment-quantity" v-model="stockAdjustment.quantity" min="0" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]" />
                    </div>
                    <div>
                      <label for="adjustment-reason" class="block text-sm font-medium text-gray-700">Reason</label>
                      <select id="adjustment-reason" v-model="stockAdjustment.reason" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
                        <option value="purchase">New Purchase</option>
                        <option value="sale">Sale</option>
                        <option value="return">Return</option>
                        <option value="damage">Damage/Loss</option>
                        <option value="correction">Inventory Correction</option>
                      </select>
                    </div>
                    <div>
                      <label for="adjustment-notes" class="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                      <textarea id="adjustment-notes" v-model="stockAdjustment.notes" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="saveStockAdjustment" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm">
                Save Adjustment
              </button>
              <button @click="isAdjustStockModalOpen = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { 
    Search, Plus, Edit, Trash2, RefreshCw, Image,
    ChevronLeft, ChevronRight
  } from 'lucide-vue-next'
  
  // Search and filters
  const searchQuery = ref('')
  const filters = ref({
    category: 'all',
    stockStatus: 'all',
    sortBy: 'name-asc',
    minPrice: null as number | null,
    maxPrice: null as number | null
  })
  
  // Modal states
  const isAddItemModalOpen = ref(false)
  const isEditItemModalOpen = ref(false)
  const isAdjustStockModalOpen = ref(false)
  
  // Current item being edited or created
  const currentItem = ref({
    id: '',
    name: '',
    sku: '',
    category: 'painting',
    price: 0,
    stock: 0,
    description: '',
    image: ''
  })
  
  // Stock adjustment
  const stockAdjustment = ref({
    type: 'add',
    quantity: 1,
    reason: 'purchase',
    notes: ''
  })
  
  // Sample inventory data
  const inventory = ref([
    {
      id: '1',
      name: 'Abstract Sunset',
      sku: 'ART-P-001',
      category: 'painting',
      price: 350,
      stock: 1,
      description: 'A vibrant abstract painting depicting a sunset over the ocean.',
      image: 'https://i.pravatar.cc/300?img=1'
    },
    {
      id: '2',
      name: 'Urban Landscape',
      sku: 'ART-PH-001',
      category: 'photography',
      price: 125,
      stock: 5,
      description: 'A black and white photograph of a city skyline.',
      image: 'https://i.pravatar.cc/300?img=2'
    },
    {
      id: '3',
      name: 'Serenity',
      sku: 'ART-S-001',
      category: 'sculpture',
      price: 500,
      stock: 1,
      description: 'A small bronze sculpture representing peace and tranquility.',
      image: 'https://i.pravatar.cc/300?img=3'
    },
    {
      id: '4',
      name: 'Digital Dreams',
      sku: 'ART-D-001',
      category: 'digital',
      price: 75,
      stock: 0,
      description: 'A digital art piece exploring the concept of dreams and reality.',
      image: 'https://i.pravatar.cc/300?img=4'
    },
    {
      id: '5',
      name: 'Forest Path',
      sku: 'ART-PR-001',
      category: 'print',
      price: 45,
      stock: 12,
      description: 'A limited edition print of a serene forest path in autumn.',
      image: 'https://i.pravatar.cc/300?img=5'
    },
    {
      id: '6',
      name: 'Ocean Waves',
      sku: 'ART-P-002',
      category: 'painting',
      price: 275,
      stock: 2,
      description: 'An oil painting capturing the movement and energy of ocean waves.',
      image: 'https://i.pravatar.cc/300?img=6'
    },
    {
      id: '7',
      name: 'City Lights',
      sku: 'ART-PH-002',
      category: 'photography',
      price: 150,
      stock: 3,
      description: 'A night photography of city lights reflecting on water.',
      image: 'https://i.pravatar.cc/300?img=7'
    },
    {
      id: '8',
      name: 'Abstract Geometry',
      sku: 'ART-D-002',
      category: 'digital',
      price: 85,
      stock: 4,
      description: 'A digital art piece featuring geometric shapes and vibrant colors.',
      image: 'https://i.pravatar.cc/300?img=8'
    }
  ])
  
  // Filtered and sorted inventory
  const filteredInventory = computed(() => {
    let result = inventory.value.filter(item => {
      // Search query
      if (searchQuery.value && !item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) && 
          !item.sku.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        return false
      }
      
      // Category filter
      if (filters.value.category !== 'all' && item.category !== filters.value.category) {
        return false
      }
      
      // Stock status filter
      if (filters.value.stockStatus === 'in-stock' && item.stock <= 5) {
        return false
      }
      if (filters.value.stockStatus === 'low-stock' && (item.stock === 0 || item.stock > 5)) {
        return false
      }
      if (filters.value.stockStatus === 'out-of-stock' && item.stock > 0) {
        return false
      }
      
      // Price range filter
      if (filters.value.minPrice !== null && item.price < filters.value.minPrice) {
        return false
      }
      if (filters.value.maxPrice !== null && item.price > filters.value.maxPrice) {
        return false
      }
      
      return true
    })
    
    // Sort the results
    switch (filters.value.sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'stock-asc':
        result.sort((a, b) => a.stock - b.stock)
        break
      case 'stock-desc':
        result.sort((a, b) => b.stock - a.stock)
        break
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
    }
    
    return result
  })
  
  // Filter functions
  const resetFilters = () => {
    filters.value = {
      category: 'all',
      stockStatus: 'all',
      sortBy: 'name-asc',
      minPrice: null,
      maxPrice: null
    }
  }
  
  const applyFilters = () => {
    // Filters are already applied via the computed property
  }
  
  // Inventory item actions
  const editInventoryItem = (item: any) => {
    currentItem.value = JSON.parse(JSON.stringify(item)) // Deep copy
    isEditItemModalOpen.value = true
  }
  
  // const deleteInventoryItem = (item: any) => {
  //     // Deep copy
  //   isEditItemModalOpen.value = true
  // }
  
  const deleteInventoryItem = (item: any) => {
    if (confirm(`Are you sure you want to delete ${item.name} from inventory?`)) {
      const index = inventory.value.findIndex(i => i.id === item.id)
      if (index !== -1) {
        inventory.value.splice(index, 1)
      }
    }
  }
  
  // Adjust stock
  const adjustStock = (item: any) => {
    currentItem.value = JSON.parse(JSON.stringify(item)) // Deep copy
    stockAdjustment.value = {
      type: 'add',
      quantity: 1,
      reason: 'purchase',
      notes: ''
    }
    isAdjustStockModalOpen.value = true
  }
  
  const saveStockAdjustment = () => {
    const index = inventory.value.findIndex(i => i.id === currentItem.value.id)
    if (index !== -1) {
      let newStock = currentItem.value.stock
      
      if (stockAdjustment.value.type === 'add') {
        newStock += stockAdjustment.value.quantity
      } else if (stockAdjustment.value.type === 'remove') {
        newStock = Math.max(0, newStock - stockAdjustment.value.quantity)
      } else if (stockAdjustment.value.type === 'set') {
        newStock = stockAdjustment.value.quantity
      }
      
      inventory.value[index].stock = newStock
    }
    
    isAdjustStockModalOpen.value = false
  }
  
  // Save inventory item
  const saveInventoryItem = () => {
    if (isEditItemModalOpen.value) {
      // Update existing item
      const index = inventory.value.findIndex(i => i.id === currentItem.value.id)
      if (index !== -1) {
        inventory.value[index] = { ...currentItem.value }
      }
    } else {
      // Add new item
      const newItem = {
        ...currentItem.value,
        id: Date.now().toString(),
        sku: currentItem.value.sku || `ART-${currentItem.value.category.charAt(0).toUpperCase()}-${(inventory.value.length + 1).toString().padStart(3, '0')}`,
        image: currentItem.value.image || `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70)}`
      }
      inventory.value.push(newItem)
    }
    closeItemModal()
  }
  
  const closeItemModal = () => {
    isAddItemModalOpen.value = false
    isEditItemModalOpen.value = false
    currentItem.value = {
      id: '',
      name: '',
      sku: '',
      category: 'painting',
      price: 0,
      stock: 0,
      description: '',
      image: ''
    }
  }
  </script>