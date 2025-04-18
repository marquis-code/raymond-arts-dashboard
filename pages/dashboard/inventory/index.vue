<template>
  <div class="space-y-6">
    <!-- Header with actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="animate-fade-in">
        <h1 class="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p class="text-gray-500 mt-1">Track and manage your product inventory</p>
      </div>
      <div class="flex gap-3 animate-slide-in-right">
        <div class="relative">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search inventory..." 
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
          />
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <button 
          @click="isAddItemModalOpen = true" 
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200"
        >
          <Plus class="h-4 w-4 mr-2" />
          Add Inventory
        </button>
      </div>
    </div>

    <!-- Inventory Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="transition-all duration-200 hover:shadow-md p-2 rounded-md">
          <label for="category-filter" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select 
            id="category-filter" 
            v-model="filters.category" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
          >
            <option value="all">All Categories</option>
            <option value="painting">Paintings</option>
            <option value="print">Prints</option>
            <option value="digital">Digital Art</option>
            <option value="sculpture">Sculptures</option>
            <option value="photography">Photography</option>
          </select>
        </div>
        <div class="transition-all duration-200 hover:shadow-md p-2 rounded-md">
          <label for="stock-status" class="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
          <select 
            id="stock-status" 
            v-model="filters.stockStatus" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
          >
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
        <div class="transition-all duration-200 hover:shadow-md p-2 rounded-md">
          <label for="sort-by" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select 
            id="sort-by" 
            v-model="filters.sortBy" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="stock-asc">Stock (Low to High)</option>
            <option value="stock-desc">Stock (High to Low)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
        <div class="transition-all duration-200 hover:shadow-md p-2 rounded-md">
          <label for="price-range" class="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
          <div class="flex items-center space-x-2">
            <input 
              type="number" 
              v-model="filters.minPrice" 
              placeholder="Min" 
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
            />
            <span>-</span>
            <input 
              type="number" 
              v-model="filters.maxPrice" 
              placeholder="Max" 
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
            />
          </div>
        </div>
      </div>
      <div class="mt-4 flex justify-end space-x-3">
        <button 
          @click="resetFilters" 
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200"
        >
          Reset
        </button>
        <button 
          @click="applyFilters" 
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200"
        >
          Apply Filters
        </button>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div v-if="loading" class="p-8 flex justify-center items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700"></div>
      </div>
      <div v-else-if="!filteredInventory.length" class="p-8 text-center text-gray-500">
        <PackageX class="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p class="text-lg font-medium">No inventory items found</p>
        <p class="mt-1">Try adjusting your filters or add new inventory items</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
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
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="item in paginatedInventory" 
              :key="item._id" 
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img 
                      :src="item.product.images[0]" 
                      :alt="item.product.name" 
                      class="h-10 w-10 rounded-md object-cover transition-transform duration-200 hover:scale-110" 
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ item.product.name }}</div>
                    <div class="text-xs text-gray-500">ID: {{ item.product._id.substring(0, 8) }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div class="flex items-center">
                  <span>${{ item.product.price.toFixed(2) }}</span>
                  <span v-if="item.product.discountPercentage > 0" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    {{ item.product.discountPercentage }}% OFF
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.quantity }}
                <span v-if="item.lowStockThreshold" class="text-xs text-gray-400 ml-1">
                  (Threshold: {{ item.lowStockThreshold }})
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors duration-200" 
                  :class="{
                    'bg-green-100 text-green-800': !item.isLowStock && !item.isOutOfStock,
                    'bg-yellow-100 text-yellow-800': item.isLowStock && !item.isOutOfStock,
                    'bg-red-100 text-red-800': item.isOutOfStock
                  }">
                  {{ item.isOutOfStock ? 'Out of Stock' : item.isLowStock ? 'Low Stock' : 'In Stock' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(item.updatedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button 
                    @click="viewHistory(item)" 
                    class="text-violet-600 hover:text-violet-900 transition-colors duration-200"
                    title="View History"
                  >
                    <History class="h-4 w-4" />
                  </button>
                  <button 
                    @click="adjustStock(item)" 
                    class="text-violet-600 hover:text-violet-900 transition-colors duration-200"
                    title="Adjust Stock"
                  >
                    <RefreshCw class="h-4 w-4" />
                  </button>
                  <button 
                    @click="editInventoryItem(item)" 
                    class="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                    title="Edit Item"
                  >
                    <Edit class="h-4 w-4" />
                  </button>
                  <button 
                    @click="deleteInventoryItem(item)" 
                    class="text-red-600 hover:text-red-900 transition-colors duration-200"
                    title="Delete Item"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="filteredInventory.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            :class="[
              'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white',
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            ]"
          >
            Previous
          </button>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            :class="[
              'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white',
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            ]"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ paginationStart }}</span> to <span class="font-medium">{{ paginationEnd }}</span> of <span class="font-medium">{{ filteredInventory.length }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500',
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                ]"
              >
                <span class="sr-only">Previous</span>
                <ChevronLeft class="h-5 w-5" />
              </button>
              
              <template v-for="page in displayedPages" :key="page">
                <button 
                  v-if="page !== '...'"
                  @click="goToPage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    currentPage === page 
                      ? 'bg-violet-50 border-violet-500 text-violet-600' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <span 
                  v-else
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                >
                  ...
                </span>
              </template>
              
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500',
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                ]"
              >
                <span class="sr-only">Next</span>
                <ChevronRight class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Inventory Item Modal -->
    <Transition name="modal">
      <div v-if="isAddItemModalOpen || isEditItemModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="closeItemModal">
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
                      <input 
                        type="text" 
                        id="item-name" 
                        v-model="currentItem.product.name" 
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]" 
                      />
                    </div>
                    <div>
                      <label for="item-price" class="block text-sm font-medium text-gray-700">Price ($)</label>
                      <input 
                        type="number" 
                        id="item-price" 
                        v-model="currentItem.product.price" 
                        step="0.01"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]" 
                      />
                    </div>
                    <div>
                      <label for="item-discount" class="block text-sm font-medium text-gray-700">Discount Percentage (%)</label>
                      <input 
                        type="number" 
                        id="item-discount" 
                        v-model="currentItem.product.discountPercentage" 
                        min="0"
                        max="100"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]" 
                      />
                    </div>
                    <div>
                      <label for="item-stock" class="block text-sm font-medium text-gray-700">Stock Quantity</label>
                      <input 
                        type="number" 
                        id="item-stock" 
                        v-model="currentItem.quantity" 
                        min="0"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]" 
                      />
                    </div>
                    <div>
                      <label for="item-threshold" class="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
                      <input 
                        type="number" 
                        id="item-threshold" 
                        v-model="currentItem.lowStockThreshold" 
                        min="0"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]" 
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                      <div class="grid grid-cols-3 gap-2">
                        <div 
                          v-for="(image, index) in currentItem.product.images" 
                          :key="index"
                          class="relative h-20 bg-gray-100 rounded-md overflow-hidden group"
                        >
                          <img :src="image" alt="Product image" class="h-full w-full object-cover" />
                          <button 
                            @click="removeImage(index)" 
                            class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            title="Remove image"
                          >
                            <X class="h-3 w-3" />
                          </button>
                        </div>
                        <div 
                          v-if="currentItem.product.images.length < 3" 
                          class="h-20 bg-gray-100 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                          @click="addImage"
                        >
                          <Plus class="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="saveInventoryItem" 
                :disabled="updating"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="updating" class="mr-2">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isEditItemModalOpen ? 'Update Item' : 'Add Item' }}
              </button>
              <button 
                @click="closeItemModal" 
                type="button" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Adjust Stock Modal -->
    <Transition name="modal">
      <div v-if="isAdjustStockModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="isAdjustStockModalOpen = false">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Adjust Stock for {{ currentItem.product?.name }}
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div>
                      <label for="current-stock" class="block text-sm font-medium text-gray-700">Current Stock</label>
                      <input 
                        type="number" 
                        id="current-stock" 
                        :value="currentItem.quantity" 
                        disabled 
                        class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm" 
                      />
                    </div>
                    <div>
                      <label for="adjustment-type" class="block text-sm font-medium text-gray-700">Adjustment Type</label>
                      <select 
                        id="adjustment-type" 
                        v-model="stockAdjustment.type" 
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
                      >
                        <option value="ADD">Add Stock</option>
                        <option value="REMOVE">Remove Stock</option>
                        <option value="SET">Set Stock</option>
                      </select>
                    </div>
                    <div>
                      <label for="adjustment-quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
                      <input 
                        type="number" 
                        id="adjustment-quantity" 
                        v-model="stockAdjustment.quantity" 
                        min="0" 
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]" 
                      />
                    </div>
                    <div>
                      <label for="adjustment-notes" class="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea 
                        id="adjustment-notes" 
                        v-model="stockAdjustment.notes" 
                        rows="2" 
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px] transition-all duration-200 p-3 outline-none border-[0.5px]"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="saveStockAdjustment" 
                :disabled="updating"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="updating" class="mr-2">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                Save Adjustment
              </button>
              <button 
                @click="isAdjustStockModalOpen = false" 
                type="button" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- View History Modal -->
    <Transition name="modal">
      <div v-if="isHistoryModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="isHistoryModalOpen = false">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <ClipboardList class="h-5 w-5 mr-2 text-violet-600" />
                    Stock History for {{ currentItem.product?.name }}
                  </h3>
                  <div class="mt-4">
                    <div v-if="currentItem.history.length" class="flow-root">
                      <ul role="list" class="-mb-8">
                        <li v-for="(event, eventIdx) in currentItem.history" :key="eventIdx">
                          <div class="relative pb-8">
                            <span v-if="eventIdx !== currentItem.history.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                            <div class="relative flex space-x-3 items-start">
                              <div>
                                <div class="relative px-1">
                                  <div class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white" 
                                    :class="{
                                      'bg-green-100': event.action === 'ADD',
                                      'bg-red-100': event.action === 'REMOVE',
                                      'bg-blue-100': event.action === 'SET'
                                    }">
                                    <PlusCircle v-if="event.action === 'ADD'" class="h-5 w-5 text-green-600" />
                                    <MinusCircle v-else-if="event.action === 'REMOVE'" class="h-5 w-5 text-red-600" />
                                    <Settings v-else class="h-5 w-5 text-blue-600" />
                                  </div>
                                </div>
                              </div>
                              <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p class="text-sm text-gray-900">
                                    <span class="font-medium">{{ event.action === 'ADD' ? 'Added' : event.action === 'REMOVE' ? 'Removed' : 'Set' }}</span>
                                    <span class="font-bold mx-1">{{ event.quantity }}</span>
                                    <span>{{ event.action === 'SET' ? 'as new quantity' : 'items' }}</span>
                                  </p>
                                  <p v-if="event.notes" class="mt-0.5 text-sm text-gray-500">
                                    {{ event.notes }}
                                  </p>
                                </div>
                                <div class="text-right text-sm whitespace-nowrap text-gray-500">
                                  {{ formatDate(event.date) }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div v-else class="flex justify-center items-center text-sm">
                    <h1 class="text-sm">No Stock History Found</h1>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="isHistoryModalOpen = false" 
                type="button" 
                class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:w-auto sm:text-sm transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition name="modal">
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="isDeleteModalOpen = false">
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
                    Delete Inventory Item
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to delete "{{ currentItem.product?.name }}" from inventory? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="confirmDelete" 
                :disabled="updating"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="updating" class="mr-2">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                Delete
              </button>
              <button 
                @click="isDeleteModalOpen = false" 
                type="button" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  Search, Plus, Edit, Trash2, RefreshCw, Image, X,
  ChevronLeft, ChevronRight, History, ClipboardList,
  PlusCircle, MinusCircle, Settings, AlertTriangle, PackageX
} from 'lucide-vue-next'
import { useFetchAllInventory } from "@/composables/modules/inventory/useFetchAllInventory"
const {  inventory, loading } = useFetchAllInventory()

// Types
interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  discountPercentage: number;
  id: string;
}

interface HistoryEvent {
  date: string;
  action: 'ADD' | 'REMOVE' | 'SET';
  quantity: number;
  notes: string;
  userId: string;
}

interface InventoryItem {
  _id: string;
  product: Product;
  quantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  history: HistoryEvent[];
  createdAt: string;
  updatedAt: string;
  inStock: boolean;
  id: string;
}

// State
// const loading = ref(true)
const updating = ref(false)
// const inventory = ref<InventoryItem[]>([])

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
const isHistoryModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

// Pagination
const itemsPerPage = ref(5)
const currentPage = ref(1)

// Current item being edited or created
const currentItem = ref<InventoryItem>({
  _id: '',
  product: {
    _id: '',
    name: '',
    price: 0,
    images: [],
    discountPercentage: 0,
    id: ''
  },
  quantity: 0,
  lowStockThreshold: 5,
  isLowStock: false,
  isOutOfStock: false,
  history: [],
  createdAt: '',
  updatedAt: '',
  inStock: true,
  id: ''
})

// Stock adjustment
const stockAdjustment = ref({
  type: 'ADD' as 'ADD' | 'REMOVE' | 'SET',
  quantity: 1,
  notes: ''
})

// // Fetch inventory data
// const fetchInventory = async () => {
//   loading.value = true
//   try {
//     // Simulate API call with the provided data structure
//     // In a real app, you would fetch from your API
//     setTimeout(() => {
//       inventory.value = [
//         {
//           "_id": "67fc7421c898386a97f03719",
//           "product": {
//             "_id": "67fc7420c898386a97f03716",
//             "name": "anonymous",
//             "price": 299.99,
//             "images": [
//               "https://res.cloudinary.com/marquis/image/upload/v1744697367/nest-cloudinary/xnkxjlehvjxwsw03pe2a.jpg",
//               "https://res.cloudinary.com/marquis/image/upload/v1744697367/nest-cloudinary/l9nrmacwvaw9silnk35n.jpg",
//               "https://res.cloudinary.com/marquis/image/upload/v1744697367/nest-cloudinary/ic8dpxaqyqus2oxlljjs.jpg"
//             ],
//             "discountPercentage": 0,
//             "id": "67fc7420c898386a97f03716"
//           },
//           "quantity": 4,
//           "lowStockThreshold": 5,
//           "isLowStock": true,
//           "isOutOfStock": false,
//           "history": [
//             {
//               "date": "2025-04-15T18:06:07.408Z",
//               "action": "ADD",
//               "quantity": 10,
//               "notes": "Manual adjustment",
//               "userId": "67fa8e31b42b0ed1af9e1a0f"
//             },
//             {
//               "date": "2025-04-15T18:08:55.942Z",
//               "action": "REMOVE",
//               "quantity": 2,
//               "notes": "Order #ORD-40534241-791",
//               "userId": "67fa8e31b42b0ed1af9e1a0f"
//             },
//             {
//               "date": "2025-04-15T18:51:46.026Z",
//               "action": "REMOVE",
//               "quantity": 1,
//               "notes": "Order #ORD-43102601-838",
//               "userId": "67fa8e31b42b0ed1af9e1a0f"
//             },
//             {
//               "date": "2025-04-15T19:02:44.091Z",
//               "action": "REMOVE",
//               "quantity": 1,
//               "notes": "Order #ORD-43762208-354",
//               "userId": "67fa8e31b42b0ed1af9e1a0f"
//             },
//             {
//               "date": "2025-04-16T02:27:51.066Z",
//               "action": "REMOVE",
//               "quantity": 2,
//               "notes": "Order #ORD-70469407-457",
//               "userId": "67fa8e31b42b0ed1af9e1a0f"
//             }
//           ],
//           "createdAt": "2025-04-14T02:34:09.152Z",
//           "updatedAt": "2025-04-16T02:27:51.070Z",
//           "inStock": true,
//           "id": "67fc7421c898386a97f03719"
//         }
//       ]
      
//       // Add more sample items based on the real structure
//       for (let i = 1; i <= 10; i++) {
//         const quantity = Math.floor(Math.random() * 20)
//         const threshold = 5
//         inventory.value.push({
//           "_id": `sample-${i}`,
//           "product": {
//             "_id": `product-${i}`,
//             "name": `Product ${i}`,
//             "price": Math.floor(Math.random() * 500) + 50,
//             "images": [
//               `https://picsum.photos/seed/${i}/300/300`,
//               `https://picsum.photos/seed/${i+100}/300/300`,
//             ],
//             "discountPercentage": Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0,
//             "id": `product-${i}`
//           },
//           "quantity": quantity,
//           "lowStockThreshold": threshold,
//           "isLowStock": quantity <= threshold && quantity > 0,
//           "isOutOfStock": quantity === 0,
//           "history": [
//             {
//               "date": new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
//               "action": "ADD",
//               "quantity": Math.floor(Math.random() * 10) + 5,
//               "notes": "Initial stock",
//               "userId": "user123"
//             },
//             {
//               "date": new Date(Date.now() - Math.floor(Math.random() * 5000000)).toISOString(),
//               "action": "REMOVE",
//               "quantity": Math.floor(Math.random() * 3) + 1,
//               "notes": `Order #ORD-${Math.floor(Math.random() * 10000000)}`,
//               "userId": "user123"
//             }
//           ],
//           "createdAt": new Date(Date.now() - Math.floor(Math.random() * 30000000)).toISOString(),
//           "updatedAt": new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString(),
//           "inStock": quantity > 0,
//           "id": `sample-${i}`
//         })
//       }
      
//       loading.value = false
//     }, 1000)
//   } catch (error) {
//     console.error('Error fetching inventory:', error)
//     loading.value = false
//   }
// }

// Filtered and sorted inventory
const filteredInventory = computed(() => {
  let result = inventory.value.filter(item => {
    // Search query
    if (searchQuery.value && !item.product.name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }
    
    // Stock status filter
    if (filters.value.stockStatus === 'in-stock' && (item.isLowStock || item.isOutOfStock)) {
      return false
    }
    if (filters.value.stockStatus === 'low-stock' && (!item.isLowStock || item.isOutOfStock)) {
      return false
    }
    if (filters.value.stockStatus === 'out-of-stock' && !item.isOutOfStock) {
      return false
    }
    
    // Price range filter
    if (filters.value.minPrice !== null && item.product.price < filters.value.minPrice) {
      return false
    }
    if (filters.value.maxPrice !== null && item.product.price > filters.value.maxPrice) {
      return false
    }
    
    return true
  })
  
  // Sort the results
  switch (filters.value.sortBy) {
    case 'name-asc':
      result.sort((a, b) => a.product.name.localeCompare(b.product.name))
      break
    case 'name-desc':
      result.sort((a, b) => b.product.name.localeCompare(a.product.name))
      break
    case 'stock-asc':
      result.sort((a, b) => a.quantity - b.quantity)
      break
    case 'stock-desc':
      result.sort((a, b) => b.quantity - a.quantity)
      break
    case 'price-asc':
      result.sort((a, b) => a.product.price - b.product.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.product.price - a.product.price)
      break
  }
  
  return result
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredInventory.value.length / itemsPerPage.value))

const paginatedInventory = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return filteredInventory.value.slice(startIndex, endIndex)
})

const paginationStart = computed(() => {
  if (filteredInventory.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const paginationEnd = computed(() => {
  if (filteredInventory.value.length === 0) return 0
  return Math.min(currentPage.value * itemsPerPage.value, filteredInventory.value.length)
})

const displayedPages = computed(() => {
  if (totalPages.value <= 7) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1)
  }
  
  if (currentPage.value <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages.value]
  }
  
  if (currentPage.value >= totalPages.value - 3) {
    return [1, '...', totalPages.value - 4, totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value]
  }
  
  return [1, '...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...', totalPages.value]
})

// Pagination functions
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

// Filter functions
const resetFilters = () => {
  filters.value = {
    category: 'all',
    stockStatus: 'all',
    sortBy: 'name-asc',
    minPrice: null,
    maxPrice: null
  }
  searchQuery.value = ''
}

const applyFilters = () => {
  // Filters are already applied via the computed property
  // Reset to first page when filters change
  currentPage.value = 1
}

// Watch for filter changes to reset pagination
watch([filters, searchQuery], () => {
  currentPage.value = 1
})

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Inventory item actions
const editInventoryItem = (item: InventoryItem) => {
  currentItem.value = JSON.parse(JSON.stringify(item)) // Deep copy
  isEditItemModalOpen.value = true
}

const deleteInventoryItem = (item: InventoryItem) => {
  currentItem.value = JSON.parse(JSON.stringify(item)) // Deep copy
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  updating.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Remove from local state
    inventory.value = inventory.value.filter(i => i._id !== currentItem.value._id)
    
    isDeleteModalOpen.value = false
    updating.value = false
  } catch (error) {
    console.error('Error deleting item:', error)
    updating.value = false
  }
}

// View history
const viewHistory = (item: InventoryItem) => {
  currentItem.value = JSON.parse(JSON.stringify(item)) // Deep copy
  isHistoryModalOpen.value = true
}

// Adjust stock
const adjustStock = (item: InventoryItem) => {
  currentItem.value = JSON.parse(JSON.stringify(item)) // Deep copy
  stockAdjustment.value = {
    type: 'ADD',
    quantity: 1,
    notes: ''
  }
  isAdjustStockModalOpen.value = true
}

const saveStockAdjustment = async () => {
  updating.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const index = inventory.value.findIndex(i => i._id === currentItem.value._id)
    if (index !== -1) {
      let newQuantity = currentItem.value.quantity
      
      if (stockAdjustment.value.type === 'ADD') {
        newQuantity += stockAdjustment.value.quantity
      } else if (stockAdjustment.value.type === 'REMOVE') {
        newQuantity = Math.max(0, newQuantity - stockAdjustment.value.quantity)
      } else if (stockAdjustment.value.type === 'SET') {
        newQuantity = stockAdjustment.value.quantity
      }
      
      // Update the item
      const updatedItem = { ...inventory.value[index] }
      updatedItem.quantity = newQuantity
      updatedItem.isOutOfStock = newQuantity === 0
      updatedItem.isLowStock = newQuantity > 0 && newQuantity <= updatedItem.lowStockThreshold
      updatedItem.inStock = newQuantity > 0
      
      // Add to history
      const historyEvent: HistoryEvent = {
        date: new Date().toISOString(),
        action: stockAdjustment.value.type,
        quantity: stockAdjustment.value.quantity,
        notes: stockAdjustment.value.notes || 'Manual adjustment',
        userId: 'current-user-id' // In a real app, get this from auth
      }
      
      updatedItem.history = [historyEvent, ...updatedItem.history]
      updatedItem.updatedAt = new Date().toISOString()
      
      inventory.value[index] = updatedItem
    }
    
    isAdjustStockModalOpen.value = false
    updating.value = false
  } catch (error) {
    console.error('Error adjusting stock:', error)
    updating.value = false
  }
}

// Add/Edit inventory item
const addImage = () => {
  // In a real app, you would open a file picker or show a modal to select an image
  // For this example, we'll add a placeholder image
  if (currentItem.value.product.images.length < 3) {
    const randomId = Math.floor(Math.random() * 1000)
    currentItem.value.product.images.push(`https://picsum.photos/seed/${randomId}/300/300`)
  }
}

const removeImage = (index: number) => {
  currentItem.value.product.images.splice(index, 1)
}

const saveInventoryItem = async () => {
  updating.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (isEditItemModalOpen.value) {
      // Update existing item
      const index = inventory.value.findIndex(i => i._id === currentItem.value._id)
      if (index !== -1) {
        // Update the item with the edited values
        inventory.value[index] = {
          ...currentItem.value,
          updatedAt: new Date().toISOString()
        }
      }
    } else {
      // Add new item
      const newItem: InventoryItem = {
        _id: `new-${Date.now()}`,
        product: {
          _id: `product-${Date.now()}`,
          name: currentItem.value.product.name,
          price: currentItem.value.product.price,
          images: currentItem.value.product.images.length > 0 
            ? currentItem.value.product.images 
            : [`https://picsum.photos/seed/${Date.now()}/300/300`],
          discountPercentage: currentItem.value.product.discountPercentage,
          id: `product-${Date.now()}`
        },
        quantity: currentItem.value.quantity,
        lowStockThreshold: currentItem.value.lowStockThreshold,
        isLowStock: currentItem.value.quantity > 0 && currentItem.value.quantity <= currentItem.value.lowStockThreshold,
        isOutOfStock: currentItem.value.quantity === 0,
        history: [
          {
            date: new Date().toISOString(),
            action: 'ADD',
            quantity: currentItem.value.quantity,
            notes: 'Initial inventory',
            userId: 'current-user-id' // In a real app, get this from auth
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        inStock: currentItem.value.quantity > 0,
        id: `new-${Date.now()}`
      }
      
      inventory.value.unshift(newItem)
    }
    
    closeItemModal()
    updating.value = false
  } catch (error) {
    console.error('Error saving item:', error)
    updating.value = false
  }
}

const closeItemModal = () => {
  isAddItemModalOpen.value = false
  isEditItemModalOpen.value = false
  currentItem.value = {
    _id: '',
    product: {
      _id: '',
      name: '',
      price: 0,
      images: [],
      discountPercentage: 0,
      id: ''
    },
    quantity: 0,
    lowStockThreshold: 5,
    isLowStock: false,
    isOutOfStock: false,
    history: [],
    createdAt: '',
    updatedAt: '',
    inStock: true,
    id: ''
  }
}

// // Lifecycle hooks
// onMounted(() => {
//   fetchInventory()
// })


definePageMeta({
  layout: "dashboard"
})
</script>

<style scoped>
/* Animations */
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-in-right {
  animation: slideInRight 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Table row hover effect */
tr {
  transition: background-color 0.2s ease;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>

