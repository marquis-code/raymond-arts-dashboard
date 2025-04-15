<template>
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
           Add New Artwork
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
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'  
import { useUploadFile } from '@/composables/core/useFileUpload'
import { useCreateCategory } from '@/composables/modules/category/useCreateCategory'

// Initialize composables
const { uploadFiles } = useUploadFile()
const { fetchCategories, categories } = useFetchCategories()

// Filters state
const showFilters = ref(false)
const filters = ref({
category: '',
minPrice: null as number | null,
maxPrice: null as number | null,
isAvailable: null as boolean | null
})

const tagsInput = ref('')
const attributesInput = ref('')

// Image upload handling
const imageFiles = ref([] as File[])
const imagePreviewUrls = ref([] as string[])

// Carousel state for each product
const productCarouselIndex = reactive({} as Record<string, number>)


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

definePageMeta({
    layout:'dashboard'
})

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