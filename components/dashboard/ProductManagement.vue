<template>
  <div class="space-y-6">
    <!-- Header with actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Artwork Management</h1>
        <p class="text-gray-500 mt-1">Manage your artwork inventory and listings</p>
      </div>
      <div class="flex gap-3">
        <button @click="showFilters = !showFilters" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md  text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
          <Filter class="h-4 w-4 mr-2" />
          Filters
        </button>
        <button @click="openAddProductModal" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md  text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
          <Plus class="h-4 w-4 mr-2" />
          Add Artwork
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div v-if="showFilters" class="bg-white p-4 rounded-lg  border border-gray-100 animate-fadeIn">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select id="category" v-model="filters.category" class="w-full rounded-md border-gray-300  focus:border-violet-500 focus:ring-violet-500">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category._id" :value="category._id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="price-range" class="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
          <div class="flex items-center space-x-2">
            <input 
              type="number" 
              v-model="filters.minPrice" 
              placeholder="Min" 
              class="w-full rounded-md border-gray-300  focus:border-violet-500 focus:ring-violet-500"
            />
            <span>-</span>
            <input 
              type="number" 
              v-model="filters.maxPrice" 
              placeholder="Max" 
              class="w-full rounded-md border-gray-300  focus:border-violet-500 focus:ring-violet-500"
            />
          </div>
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Availability</label>
          <select id="status" v-model="filters.isAvailable" class="w-full rounded-md border-gray-300  focus:border-violet-500 focus:ring-violet-500">
            <option value="">All</option>
            <option :value="true">Available</option>
            <option :value="false">Not Available</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex justify-end space-x-3">
        <button @click="resetFilters" class="px-4 py-2 border border-gray-300 rounded-md  text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
          Reset
        </button>
        <button @click="applyFilters" class="px-4 py-2 border border-transparent rounded-md  text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
          Apply Filters
        </button>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(product, index) in filteredProducts" :key="index" class="bg-white rounded-lg  border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
        <div class="relative aspect-w-4 aspect-h-3 bg-gray-200">
          <!-- Image Carousel -->
          <div class="carousel-container w-full h-full">
            <div class="carousel-slides w-full h-full relative">
              <div 
                v-for="(image, imgIndex) in product.images" 
                :key="imgIndex" 
                class="carousel-slide absolute top-0 left-0 w-full h-full transition-opacity duration-300"
                :class="{ 'opacity-100': imgIndex === productCarouselIndex[product.id], 'opacity-0': imgIndex !== productCarouselIndex[product.id] }"
              >
                <img :src="image" :alt="`${product.name} - Image ${imgIndex + 1}`" class="object-cover w-full h-full" />
              </div>
            </div>
            
            <!-- Carousel Controls (only if multiple images) -->
            <div v-if="product.images && product.images.length > 1" class="carousel-controls absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
              <button 
                @click="prevImage(product.id)" 
                class="bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 focus:outline-none"
              >
                <ChevronLeft class="h-4 w-4" />
              </button>
              <div class="flex space-x-1">
                <button 
                  v-for="(_, dotIndex) in product.images" 
                  :key="dotIndex"
                  @click="setImage(product.id, dotIndex)"
                  class="w-2 h-2 rounded-full focus:outline-none"
                  :class="dotIndex === productCarouselIndex[product.id] ? 'bg-white' : 'bg-white bg-opacity-50'"
                ></button>
              </div>
              <button 
                @click="nextImage(product.id)" 
                class="bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 focus:outline-none"
              >
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div class="absolute top-2 right-2">
            <span v-if="!product.isAvailable" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
              Not Available
            </span>
            <span v-if="product.isFeatured" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800 ml-1">
              Featured
            </span>
            <span v-if="product.isNew" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 ml-1">
              New
            </span>
          </div>
        </div>
        <div class="p-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ product.name }}</h3>
              <p class="text-sm text-gray-500">{{ getCategoryName(product.category) }}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-semibold text-gray-900">${{ product.price.toFixed(2) }}</p>
              <p v-if="product.discountPrice" class="text-sm text-red-600 line-through">${{ product.discountPrice.toFixed(2) }}</p>
            </div>
          </div>
          <div class="mt-2">
            <p class="text-sm text-gray-600 line-clamp-2">{{ product.description }}</p>
          </div>
          <div class="mt-3 flex flex-wrap gap-1">
            <span v-for="(tag, tagIndex) in product.tags" :key="tagIndex" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              {{ tag }}
            </span>
          </div>
          <div class="mt-4 flex justify-between items-center">
            <div class="text-sm text-gray-500">
              <span v-if="product.isAvailable" class="text-green-600">Available</span>
              <span v-else class="text-red-500">Not Available</span>
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
    <div v-if="filteredProducts.length === 0" class="bg-white p-8 rounded-lg  border border-gray-100 text-center">
      <Package class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-lg font-medium text-gray-900">No artworks found</h3>
      <p class="mt-1 text-sm text-gray-500">
        Try adjusting your filters or add a new artwork to get started.
      </p>
      <div class="mt-6">
        <button @click="openAddProductModal" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md  text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
          <Plus class="h-4 w-4 mr-2" />
          Add Artwork
        </button>
      </div>
    </div>

    <!-- Add/Edit Product Modal -->
    <div v-if="isAddProductModalOpen || isEditProductModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-1000 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ isEditProductModalOpen ? 'Edit Artwork' : 'Add New Artwork' }}
                </h3>
                <div class="mt-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Left Column -->
                    <div class="space-y-4">
                      <div>
                        <label for="product-name" class="block text-sm font-medium text-gray-700">Artwork Name *</label>
                        <input type="text" id="product-name" v-model="currentProduct.name" class="mt-1 block w-full rounded-md  focus:border-violet-500 focus:ring-violet-500 p-3 outline-none  border border-gray-50" />
                      </div>
                      
                      <div>
                        <label for="product-description" class="block text-sm font-medium text-gray-700">Description *</label>
                        <textarea id="product-description" v-model="currentProduct.description" rows="3" class="mt-1 block w-full rounded-md  focus:border-violet-500 focus:ring-violet-500 p-3 outline-none  border border-gray-50"></textarea>
                      </div>
                      
                      <div>
                        <label for="product-category" class="block text-sm font-medium text-gray-700">Category *</label>
                        <select id="product-category" v-model="currentProduct.category" class="mt-1 block w-full rounded-md  focus:border-violet-500 focus:ring-violet-500 p-3 outline-none  border border-gray-50">
                          <option value="">Select a category</option>
                          <option v-for="category in categories" :key="category._id" :value="category._id">
                            {{ category.name }}
                          </option>
                        </select>
                      </div>
                      
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label for="product-price" class="block text-sm font-medium text-gray-700">Price ($) *</label>
                          <input type="number" id="product-price" v-model="currentProduct.price" min="0" step="0.01" class="mt-1 block w-full rounded-md  focus:border-violet-500 focus:ring-violet-500 p-3 outline-none  border border-gray-50" />
                        </div>
                        <div>
                          <label for="product-discount-price" class="block text-sm font-medium text-gray-700">Discount Price ($)</label>
                          <input type="number" id="product-discount-price" v-model="currentProduct.discountPrice" min="0" step="0.01" class="mt-1 block w-full rounded-md  focus:border-violet-500 focus:ring-violet-500 p-3 outline-none  border border-gray-50" />
                        </div>
                      </div>
                      
                      <div>
                        <label for="product-tags" class="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                        <input type="text" id="product-tags" v-model="tagsInput" placeholder="abstract, modern, colorful" class="mt-1 text-sm block w-full rounded-md  focus:border-violet-500 focus:ring-violet-500 p-3 outline-none  border border-gray-50" />
                      </div>
                      
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label for="product-weight" class="block text-sm font-medium text-gray-700">Weight (kg)</label>
                          <input type="number" id="product-weight" v-model="currentProduct.weight" min="0" step="0.1" class="mt-1 block w-full rounded-md  focus:border-violet-500 focus:ring-violet-500 p-3 outline-none  border border-gray-50" />
                        </div>
                        <!-- <div>
                          <label for="product-related" class="block text-sm font-medium text-gray-700">Related Products</label>
                          <select id="product-related" v-model="currentProduct.relatedProducts" multiple class="mt-1 block w-full rounded-md  focus:border-violet-500 focus:ring-violet-500 p-3 outline-none  border border-gray-50">
                            <option v-for="product in products" :key="product.id" :value="product.id" :disabled="product.id === currentProduct.id">
                              {{ product.name }}
                            </option>
                          </select>
                        </div> -->
                      </div>
                    </div>
                    
                    <!-- Right Column -->
                    <div class="space-y-4">
                      <div class="grid grid-cols-3 gap-4">
                        <div>
                          <label for="product-width" class="block text-sm font-medium text-gray-700">Width (cm)</label>
                          <input type="number" id="product-width" v-model="currentProduct.width" min="0" step="0.1" class="mt-1 block w-full rounded-md  focus:border-violet-500 focus:ring-violet-500 p-3 outline-none  border border-gray-50" />
                        </div>
                        <div>
                          <label for="product-height" class="block text-sm font-medium text-gray-700">Height (cm)</label>
                          <input type="number" id="product-height" v-model="currentProduct.height" min="0" step="0.1" class="mt-1 block w-full rounded-md  focus:border-violet-500 focus:ring-violet-500 p-3 outline-none  border border-gray-50" />
                        </div>
                        <div>
                          <label for="product-length" class="block text-sm font-medium text-gray-700">Length (cm)</label>
                          <input type="number" id="product-length" v-model="currentProduct.length" min="0" step="0.1" class="mt-1 block w-full rounded-md  focus:border-violet-500 focus:ring-violet-500 p-3 outline-none  border border-gray-50" />
                        </div>
                      </div>
                      
                      <div class="grid grid-cols-2 gap-4">
                        <div class="flex items-center">
                          <input type="checkbox" id="product-available" v-model="currentProduct.isAvailable" class="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded" />
                          <label for="product-available" class="ml-2 block text-sm text-gray-900">Available</label>
                        </div>
                        <div class="flex items-center">
                          <input type="checkbox" id="product-featured" v-model="currentProduct.isFeatured" class="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded" />
                          <label for="product-featured" class="ml-2 block text-sm text-gray-900">Featured</label>
                        </div>
                        <div class="flex items-center">
                          <input type="checkbox" id="product-new" v-model="currentProduct.isNew" class="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded" />
                          <label for="product-new" class="ml-2 block text-sm text-gray-900">New</label>
                        </div>
                        <div class="flex items-center">
                          <input type="checkbox" id="product-bestseller" v-model="currentProduct.isBestseller" class="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded" />
                          <label for="product-bestseller" class="ml-2 block text-sm text-gray-900">Bestseller</label>
                        </div>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Images *</label>
                        <div class="mt-1">
                          <div class="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div class="space-y-1 text-center">
                              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                              <div class="flex text-sm text-gray-600">
                                <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-violet-600 hover:text-violet-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-violet-500">
                                  <span>Upload images</span>
                                  <input id="file-upload" type="file" class="sr-only" multiple accept="image/*" @change="handleImageUpload" />
                                </label>
                                <p class="pl-1">or drag and drop</p>
                              </div>
                              <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Image Previews -->
                      <div v-if="imagePreviewUrls.length > 0" class="mt-4">
                        <h4 class="text-sm font-medium text-gray-700 mb-2">Image Previews</h4>
                        <div class="grid grid-cols-3 gap-2">
                          <div v-for="(url, index) in imagePreviewUrls" :key="index" class="relative group">
                            <img :src="url" alt="Preview" class="h-24 w-full object-cover rounded-md" />
                            <button 
                              @click="removeImage(index)" 
                              class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X class="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label for="product-attributes" class="block text-sm font-medium text-gray-700">Additional Attributes (JSON)</label>
                        <textarea id="product-attributes" v-model="attributesInput" rows="3" placeholder='{"material": "Canvas", "style": "Abstract"}' class="mt-1 block w-full rounded-md  focus:border-violet-500 focus:ring-violet-500 p-3 outline-none  border border-gray-50"></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="saveProduct" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent  px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm">
              Save
            </button>
            <button @click="closeProductModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300  px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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
          <div class="absolute inset-0 bg-gray-1000 opacity-75"></div>
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
          <div class="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="deleteProduct" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent  px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
              Delete
            </button>
            <button @click="isDeleteModalOpen = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300  px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { 
  Plus, Filter, Edit, Copy, Trash2, Package, 
  AlertTriangle, ChevronLeft, ChevronRight, X
} from 'lucide-vue-next'

// Import composables
import { useUploadFile } from '@/composables/core/useFileUpload'
import { useFetchProducts }from '@/composables/modules/products/useFetchProducts'
import { useCreateCategory } from '@/composables/modules/category/useCreateCategory'
import { useDeleteCategory } from '@/composables/modules/category/useDeleteCategory'
import { useUpdateCategory } from '@/composables/modules/category/useUpdateCategory'
import { useFetchCategory } from '@/composables/modules/category/useFetchCategory'
import { useFetchCategories } from '@/composables/modules/category/useFetchCategories'

// Initialize composables
const { uploadFiles } = useUploadFile()
const { createCategory, category} = useCreateCategory()
const { deleteCategory,  loading: deleting } = useDeleteCategory()
const { updateCategory, loading: updating } = useUpdateCategory()
const { fetchCategoryById } = useFetchCategory()
const { fetchCategories, categories } = useFetchCategories()
const { products: productsList, loading }  = useFetchProducts()

// Filters state
const showFilters = ref(false)
const filters = ref({
  category: '',
  minPrice: null as number | null,
  maxPrice: null as number | null,
  isAvailable: null as boolean | null
})

// Modal states
const isAddProductModalOpen = ref(false)
const isEditProductModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

// Product being edited or deleted
const currentProduct = ref({
  id: '',
  name: '',
  description: '',
  price: 0,
  discountPrice: null as number | null,
  images: [] as string[],
  category: '',
  isAvailable: true,
  weight: null as number | null,
  width: null as number | null,
  height: null as number | null,
  length: null as number | null,
  tags: [] as string[],
  attributes: {} as Record<string, any>,
  relatedProducts: [] as string[],
  isFeatured: false,
  isNew: false,
  isBestseller: false
})

const productToDelete = ref(null as any)
const tagsInput = ref('')
const attributesInput = ref('')

// Image upload handling
const imageFiles = ref([] as File[])
const imagePreviewUrls = ref([] as string[])

// Carousel state for each product
const productCarouselIndex = reactive({} as Record<string, number>)

// Sample products data
const products = ref([
  {
    id: '1',
    name: 'Abstract Sunset',
    description: 'A vibrant abstract painting depicting a sunset over the ocean.',
    price: 350,
    discountPrice: 299,
    images: [
      'https://i.pravatar.cc/300?img=1',
      'https://i.pravatar.cc/300?img=2',
      'https://i.pravatar.cc/300?img=3'
    ],
    category: 'cat1',
    isAvailable: true,
    weight: 2.5,
    width: 60,
    height: 40,
    length: 2,
    tags: ['abstract', 'sunset', 'vibrant'],
    attributes: { material: 'Canvas', style: 'Abstract' },
    relatedProducts: [],
    isFeatured: true,
    isNew: true,
    isBestseller: false
  },
  {
    id: '2',
    name: 'Urban Landscape',
    description: 'A black and white photograph of a city skyline.',
    price: 125,
    discountPrice: null,
    images: ['https://i.pravatar.cc/300?img=4'],
    category: 'cat2',
    isAvailable: true,
    weight: 0.5,
    width: 30,
    height: 20,
    length: 1,
    tags: ['urban', 'black and white', 'photography'],
    attributes: { material: 'Photo Paper', style: 'Modern' },
    relatedProducts: ['1'],
    isFeatured: false,
    isNew: false,
    isBestseller: true
  },
  {
    id: '3',
    name: 'Serenity',
    description: 'A small bronze sculpture representing peace and tranquility.',
    price: 500,
    discountPrice: null,
    images: [
      'https://i.pravatar.cc/300?img=5',
      'https://i.pravatar.cc/300?img=6'
    ],
    category: 'cat3',
    isAvailable: true,
    weight: 5,
    width: 15,
    height: 25,
    length: 15,
    tags: ['sculpture', 'bronze', 'peace'],
    attributes: { material: 'Bronze', style: 'Contemporary' },
    relatedProducts: [],
    isFeatured: true,
    isNew: false,
    isBestseller: false
  }
])

// Sample categories
const sampleCategories = [
  { _id: 'cat1', name: 'Paintings' },
  { _id: 'cat2', name: 'Photography' },
  { _id: 'cat3', name: 'Sculptures' },
  { _id: 'cat4', name: 'Digital Art' },
  { _id: 'cat5', name: 'Prints' }
]

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
    
    // Filter by availability
    if (filters.value.isAvailable !== null && product.isAvailable !== filters.value.isAvailable) {
      return false
    }
    
    return true
  })
})

// Initialize on component mount
onMounted(() => {
  // Initialize carousel indices for each product
  products.value.forEach(product => {
    productCarouselIndex[product.id] = 0
  })
  
  // Fetch categories
  fetchCategories()
})

// Helper function to get category name by ID
const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(c => c._id === categoryId)
  return category ? category.name : 'Uncategorized'
}

// Filter functions
const resetFilters = () => {
  filters.value = {
    category: '',
    minPrice: null,
    maxPrice: null,
    isAvailable: null
  }
}

const applyFilters = () => {
  // Filters are already applied via the computed property
  showFilters.value = false
}

// Carousel functions
const nextImage = (productId: string) => {
  const product = products.value.find(p => p.id === productId)
  if (product && product.images.length > 0) {
    productCarouselIndex[productId] = (productCarouselIndex[productId] + 1) % product.images.length
  }
}

const prevImage = (productId: string) => {
  const product = products.value.find(p => p.id === productId)
  if (product && product.images.length > 0) {
    productCarouselIndex[productId] = (productCarouselIndex[productId] - 1 + product.images.length) % product.images.length
  }
}

const setImage = (productId: string, index: number) => {
  productCarouselIndex[productId] = index
}

// Image upload handling
const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  
  // Store the files for later upload
  const files = Array.from(input.files)
  imageFiles.value = [...imageFiles.value, ...files]
  
  // Create preview URLs
  for (const file of files) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreviewUrls.value.push(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = (index: number) => {
  imageFiles.value.splice(index, 1)
  imagePreviewUrls.value.splice(index, 1)
}

// Product CRUD operations
const openAddProductModal = () => {
  // Reset form
  currentProduct.value = {
    id: '',
    name: '',
    description: '',
    price: 0,
    discountPrice: null,
    images: [],
    category: '',
    isAvailable: true,
    weight: null,
    width: null,
    height: null,
    length: null,
    tags: [],
    attributes: {},
    relatedProducts: [],
    isFeatured: false,
    isNew: true,
    isBestseller: false
  }
  tagsInput.value = ''
  attributesInput.value = ''
  imageFiles.value = []
  imagePreviewUrls.value = []
  isAddProductModalOpen.value = true
}

const editProduct = (product: any) => {
  currentProduct.value = { ...product }
  tagsInput.value = product.tags.join(', ')
  attributesInput.value = JSON.stringify(product.attributes, null, 2)
  imagePreviewUrls.value = [...product.images]
  imageFiles.value = [] // We don't have the actual files, just URLs
  isEditProductModalOpen.value = true
}

const duplicateProduct = (product: any) => {
  const newProduct = { 
    ...product,
    id: Date.now().toString(),
    name: `${product.name} (Copy)`,
    isNew: true,
    isFeatured: false
  }
  products.value.push(newProduct)
  productCarouselIndex[newProduct.id] = 0
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

const saveProduct = async () => {
  try {
    // Process tags from input
    if (tagsInput.value) {
      currentProduct.value.tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag)
    }
    
    // Process attributes from JSON input
    if (attributesInput.value) {
      try {
        currentProduct.value.attributes = JSON.parse(attributesInput.value)
      } catch (e) {
        alert('Invalid JSON format for attributes')
        return
      }
    }
    
    // Upload images if there are any new ones
    if (imageFiles.value.length > 0) {
      const uploadedUrls = await uploadFiles(imageFiles.value)
      
      if (isEditProductModalOpen.value) {
        // For edit, append new images to existing ones
        currentProduct.value.images = [...currentProduct.value.images, ...uploadedUrls]
      } else {
        // For new product, just use the uploaded images
        currentProduct.value.images = uploadedUrls
      }
    } else if (!isEditProductModalOpen.value && imagePreviewUrls.value.length === 0) {
      // Require at least one image for new products
      alert('Please upload at least one image')
      return
    }
    
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
        id: Date.now().toString()
      }
      products.value.push(newProduct)
      productCarouselIndex[newProduct.id] = 0
    }
    
    closeProductModal()
  } catch (error) {
    console.error('Error saving product:', error)
    alert('An error occurred while saving the product')
  }
}

const closeProductModal = () => {
  isAddProductModalOpen.value = false
  isEditProductModalOpen.value = false
  imageFiles.value = []
  imagePreviewUrls.value = []
  tagsInput.value = ''
  attributesInput.value = ''
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

.carousel-slide {
  transition: opacity 0.3s ease-in-out;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>