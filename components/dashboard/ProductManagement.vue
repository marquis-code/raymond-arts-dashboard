<template>
    <div class="space-y-6">
      <!-- Header with actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Products Management</h1>
          <p class="text-gray-500 mt-1">Manage your artwork inventory and listings</p>
        </div>
        <div class="flex gap-3">
          <button @click="showFilters = !showFilters" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            <Filter class="h-4 w-4 mr-2" />
            Filters
          </button>
          <button @click="isAddProductModalOpen = true" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            <Plus class="h-4 w-4 mr-2" />
            Add Artwork
          </button>
        </div>
      </div>
  
      <!-- Filters -->
      <div v-if="showFilters" class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 animate-fadeIn">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select id="category" v-model="filters.category" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500">
              <option value="">All Categories</option>
              <option value="painting">Paintings</option>
              <option value="print">Prints</option>
              <option value="digital">Digital Art</option>
              <option value="sculpture">Sculptures</option>
              <option value="photography">Photography</option>
            </select>
          </div>
          <div>
            <label for="price-range" class="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <div class="flex items-center space-x-2">
              <input 
                type="number" 
                v-model="filters.minPrice" 
                placeholder="Min" 
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
              />
              <span>-</span>
              <input 
                type="number" 
                v-model="filters.maxPrice" 
                placeholder="Max" 
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
              />
            </div>
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select id="status" v-model="filters.status" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="sold-out">Sold Out</option>
            </select>
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
  
      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(product, index) in filteredProducts" :key="index" class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div class="relative aspect-w-4 aspect-h-3 bg-gray-200">
            <img :src="product.image" :alt="product.name" class="object-cover w-full h-full" />
            <div class="absolute top-2 right-2">
              <span v-if="product.status === 'sold-out'" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
                Sold Out
              </span>
              <span v-else-if="product.status === 'draft'" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                Draft
              </span>
            </div>
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ product.name }}</h3>
                <p class="text-sm text-gray-500">{{ product.category }}</p>
              </div>
              <p class="text-lg font-semibold text-gray-900">${{ product.price.toFixed(2) }}</p>
            </div>
            <div class="mt-4 flex justify-between items-center">
              <div class="text-sm text-gray-500">
                <span v-if="product.inventory > 0">{{ product.inventory }} in stock</span>
                <span v-else class="text-red-500">Out of stock</span>
              </div>
              <div class="flex space-x-2">
                <button @click="editProduct(product)" class="p-1 text-gray-400 hover:text-gray-500">
                  <Edit class="h-5 w-5" />
                </button>
                <button @click="duplicateProduct(product)" class="p-1 text-gray-400 hover:text-gray-500">
                  <Copy class="h-5 w-5" />
                </button>
                <button @click="confirmDeleteProduct(product)" class="p-1 text-gray-400 hover:text-red-500">
                  <Trash2 class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Empty state -->
      <div v-if="filteredProducts.length === 0" class="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
        <Package class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-lg font-medium text-gray-900">No products found</h3>
        <p class="mt-1 text-sm text-gray-500">
          Try adjusting your filters or add a new artwork to get started.
        </p>
        <div class="mt-6">
          <button @click="isAddProductModalOpen = true" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            <Plus class="h-4 w-4 mr-2" />
            Add Artwork
          </button>
        </div>
      </div>
  
      <!-- Add/Edit Product Modal -->
      <div v-if="isAddProductModalOpen || isEditProductModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
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
                    {{ isEditProductModalOpen ? 'Edit Artwork' : 'Add New Artwork' }}
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div>
                      <label for="product-name" class="block text-sm font-medium text-gray-700">Artwork Name</label>
                      <input type="text" id="product-name" v-model="currentProduct.name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500" />
                    </div>
                    <div>
                      <label for="product-category" class="block text-sm font-medium text-gray-700">Category</label>
                      <select id="product-category" v-model="currentProduct.category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500">
                        <option value="painting">Painting</option>
                        <option value="print">Print</option>
                        <option value="digital">Digital Art</option>
                        <option value="sculpture">Sculpture</option>
                        <option value="photography">Photography</option>
                      </select>
                    </div>
                    <div>
                      <label for="product-price" class="block text-sm font-medium text-gray-700">Price ($)</label>
                      <input type="number" id="product-price" v-model="currentProduct.price" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500" />
                    </div>
                    <div>
                      <label for="product-inventory" class="block text-sm font-medium text-gray-700">Inventory</label>
                      <input type="number" id="product-inventory" v-model="currentProduct.inventory" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500" />
                    </div>
                    <div>
                      <label for="product-status" class="block text-sm font-medium text-gray-700">Status</label>
                      <select id="product-status" v-model="currentProduct.status" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500">
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="sold-out">Sold Out</option>
                      </select>
                    </div>
                    <div>
                      <label for="product-description" class="block text-sm font-medium text-gray-700">Description</label>
                      <textarea id="product-description" v-model="currentProduct.description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"></textarea>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Image</label>
                      <div class="mt-1 flex items-center">
                        <div class="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                          <img v-if="currentProduct.image" :src="currentProduct.image" alt="Product preview" class="h-full w-full object-cover" />
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
              <button @click="saveProduct" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm">
                Save
              </button>
              <button @click="closeProductModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Delete Confirmation Modal -->
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangle class="h-6 w-6 text-red-600" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Delete Artwork
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to delete this artwork? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="deleteProduct" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                Delete
              </button>
              <button @click="isDeleteModalOpen = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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
    Plus, Filter, Edit, Copy, Trash2, Package, 
    AlertTriangle, Image
  } from 'lucide-vue-next'
  
  // Filters state
  const showFilters = ref(false)
  const filters = ref({
    category: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    status: ''
  })
  
  // Modal states
  const isAddProductModalOpen = ref(false)
  const isEditProductModalOpen = ref(false)
  const isDeleteModalOpen = ref(false)
  
  // Product being edited or deleted
  const currentProduct = ref({
    id: '',
    name: '',
    category: 'painting',
    price: 0,
    inventory: 1,
    status: 'active',
    description: '',
    image: ''
  })
  const productToDelete = ref(null as any)
  
  // Sample products data
  const products = ref([
    {
      id: '1',
      name: 'Abstract Sunset',
      category: 'painting',
      price: 350,
      inventory: 1,
      status: 'active',
      description: 'A vibrant abstract painting depicting a sunset over the ocean.',
      image: 'https://i.pravatar.cc/300?img=1'
    },
    {
      id: '2',
      name: 'Urban Landscape',
      category: 'photography',
      price: 125,
      inventory: 5,
      status: 'active',
      description: 'A black and white photograph of a city skyline.',
      image: 'https://i.pravatar.cc/300?img=2'
    },
    {
      id: '3',
      name: 'Serenity',
      category: 'sculpture',
      price: 500,
      inventory: 1,
      status: 'active',
      description: 'A small bronze sculpture representing peace and tranquility.',
      image: 'https://i.pravatar.cc/300?img=3'
    },
    {
      id: '4',
      name: 'Digital Dreams',
      category: 'digital',
      price: 75,
      inventory: 0,
      status: 'sold-out',
      description: 'A digital art piece exploring the concept of dreams and reality.',
      image: 'https://i.pravatar.cc/300?img=4'
    },
    {
      id: '5',
      name: 'Forest Path',
      category: 'print',
      price: 45,
      inventory: 12,
      status: 'active',
      description: 'A limited edition print of a serene forest path in autumn.',
      image: 'https://i.pravatar.cc/300?img=5'
    },
    {
      id: '6',
      name: 'Ocean Waves',
      category: 'painting',
      price: 275,
      inventory: 1,
      status: 'draft',
      description: 'An oil painting capturing the movement and energy of ocean waves.',
      image: 'https://i.pravatar.cc/300?img=6'
    }
  ])
  
  // Filtered products based on applied filters
  const filteredProducts = computed(() => {
    return products.value.filter(product => {
      // Filter by category
      if (filters.value.category && product.category !== filters.value.category) {
        return false
      }
      
      // Filter by price range
      if (filters.value.minPrice !== null && product.price < filters.value.minPrice) {
        return false
      }
      if (filters.value.maxPrice !== null && product.price > filters.value.maxPrice) {
        return false
      }
      
      // Filter by status
      if (filters.value.status && product.status !== filters.value.status) {
        return false
      }
      
      return true
    })
  })
  
  // Filter functions
  const resetFilters = () => {
    filters.value = {
      category: '',
      minPrice: null,
      maxPrice: null,
      status: ''
    }
  }
  
  const applyFilters = () => {
    // Filters are already applied via the computed property
    showFilters.value = false
  }
  
  // Product CRUD operations
  const editProduct = (product: any) => {
    currentProduct.value = { ...product }
    isEditProductModalOpen.value = true
  }
  
  const duplicateProduct = (product: any) => {
    const newProduct = { 
      ...product,
      id: Date.now().toString(),
      name: `${product.name} (Copy)`,
      inventory: product.inventory > 0 ? product.inventory : 1,
      status: 'draft'
    }
    products.value.push(newProduct)
  }
  
  const confirmDeleteProduct = (product: any) => {
    productToDelete.value = product
    isDeleteModalOpen.value = true
  }
  
  const deleteProduct = () => {
    if (productToDelete.value) {
      const index = products.value.findIndex(p => p.id === productToDelete.value.id)
      if (index !== -1) {
        products.value.splice(index, 1)
      }
    }
    isDeleteModalOpen.value = false
    productToDelete.value = null
  }
  
  const saveProduct = () => {
    if (isEditProductModalOpen.value) {
      // Update existing product
      const index = products.value.findIndex(p => p.id === currentProduct.value.id)
      if (index !== -1) {
        products.value[index] = { ...currentProduct.value }
      }
    } else {
      // Add new product
      const newProduct = {
        ...currentProduct.value,
        id: Date.now().toString(),
        image: currentProduct.value.image || `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70)}`
      }
      products.value.push(newProduct)
    }
    closeProductModal()
  }
  
  const closeProductModal = () => {
    isAddProductModalOpen.value = false
    isEditProductModalOpen.value = false
    currentProduct.value = {
      id: '',
      name: '',
      category: 'painting',
      price: 0,
      inventory: 1,
      status: 'active',
      description: '',
      image: ''
    }
  }
  </script>
  
  <style scoped>
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .aspect-w-4 {
    position: relative;
    padding-bottom: calc(var(--tw-aspect-h) / var(--tw-aspect-w) * 100%);
    --tw-aspect-w: 4;
  }
  
  .aspect-h-3 {
    --tw-aspect-h: 3;
  }
  
  .aspect-w-4 > * {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  </style>
  