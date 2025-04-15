<template>
  <div class="artwork-upload-container">
    <div class="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:shadow-xl">
      <!-- Header with animated gradient -->
      <div class="relative bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-5 overflow-hidden">
        <div class="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]"></div>
        <h2 class="text-xl font-bold text-white relative z-10 flex items-center gap-2">
          <span class="flex items-center gap-2">
            <PaintBrushIcon class="h-5 w-5" />
            Add New Artwork
          </span>
        </h2>
      </div>

      <!-- Form Content -->
      <div class="p-6">
        <form @submit.prevent="saveProduct" class="space-y-8">
          <!-- Main Information Section -->
          <div class="bg-violet-50/50 p-5 rounded-xl border border-violet-100">
            <h3 class="text-lg font-semibold text-violet-800 mb-4 flex items-center">
              <InfoIcon class="h-5 w-5 mr-2" />
              Basic Information
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div class="space-y-5">
                <div class="form-group">
                  <div class="flex items-center justify-between">
                    <label for="product-name" class="form-label">
                      Artwork Name <span class="text-red-500">*</span>
                    </label>
                    <Tooltip text="The title of your artwork as it will appear to customers">
                      <InfoCircleIcon class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors" />
                    </Tooltip>
                  </div>
                  <input 
                    type="text" 
                    id="product-name" 
                    v-model="currentProduct.name" 
                    class="form-input" 
                    placeholder="e.g. Sunset Horizon"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <div class="flex items-center justify-between">
                    <label for="product-description" class="form-label">
                      Description <span class="text-red-500">*</span>
                    </label>
                    <Tooltip text="Detailed description of your artwork, including style, inspiration, and story">
                      <InfoCircleIcon class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors" />
                    </Tooltip>
                  </div>
                  <textarea 
                    id="product-description" 
                    v-model="currentProduct.description" 
                    rows="4" 
                    class="form-input" 
                    placeholder="Describe your artwork in detail..."
                    required
                  ></textarea>
                </div>
                
                <div class="form-group">
                  <div class="flex items-center justify-between">
                    <label for="product-category" class="form-label">
                      Category <span class="text-red-500">*</span>
                    </label>
                    <Tooltip text="The category that best represents your artwork">
                      <InfoCircleIcon class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors" />
                    </Tooltip>
                  </div>
                  <select 
                    id="product-category" 
                    v-model="currentProduct.category" 
                    class="form-input" 
                    required
                  >
                    <option disabled value="">Select a category</option>
                    <option v-for="category in categories" :key="category._id" :value="category._id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
                
                <div class="form-group">
                  <div class="flex items-center justify-between">
                    <label for="product-tags" class="form-label">Tags</label>
                    <Tooltip text="Keywords that help customers find your artwork (separate with commas)">
                      <InfoCircleIcon class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors" />
                    </Tooltip>
                  </div>
                  <div class="relative">
                    <input 
                      type="text" 
                      id="product-tags" 
                      v-model="tagsInput" 
                      class="form-input pr-10" 
                      placeholder="abstract, modern, colorful"
                    />
                    <TagIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-violet-400" />
                  </div>
                  
                  <!-- Tags Preview -->
                  <div v-if="parsedTags.length > 0" class="flex flex-wrap gap-2 mt-2">
                    <span 
                      v-for="(tag, index) in parsedTags" 
                      :key="index"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 animate-fadeIn"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Right Column -->
              <div class="space-y-5">
                <div class="grid grid-cols-2 gap-4">
                  <div class="form-group">
                    <div class="flex items-center justify-between">
                      <label for="product-price" class="form-label">
                        Price ($) <span class="text-red-500">*</span>
                      </label>
                      <Tooltip text="The regular selling price of your artwork">
                        <InfoCircleIcon class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors" />
                      </Tooltip>
                    </div>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input 
                        type="number" 
                        id="product-price" 
                        v-model="currentProduct.price" 
                        min="0" 
                        step="0.01" 
                        class="form-input pl-8" 
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <div class="flex items-center justify-between">
                      <label for="product-discount-price" class="form-label">Discount Price</label>
                      <Tooltip text="Optional promotional or sale price (leave empty for no discount)">
                        <InfoCircleIcon class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors" />
                      </Tooltip>
                    </div>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input 
                        type="number" 
                        id="product-discount-price" 
                        v-model="currentProduct.discountPrice" 
                        min="0" 
                        step="0.01" 
                        class="form-input pl-8" 
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
                
                <div class="form-group">
                  <div class="flex items-center justify-between">
                    <label class="form-label">Dimensions & Weight</label>
                    <Tooltip text="Physical measurements of your artwork">
                      <InfoCircleIcon class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors" />
                    </Tooltip>
                  </div>
                  <div class="grid grid-cols-4 gap-3">
                    <div class="relative">
                      <input 
                        type="number" 
                        id="product-width" 
                        v-model="currentProduct.width" 
                        min="0" 
                        step="0.1" 
                        class="form-input pl-2 pr-10" 
                        placeholder="0"
                      />
                      <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">W (cm)</span>
                    </div>
                    <div class="relative">
                      <input 
                        type="number" 
                        id="product-height" 
                        v-model="currentProduct.height" 
                        min="0" 
                        step="0.1" 
                        class="form-input pl-2 pr-10" 
                        placeholder="0"
                      />
                      <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">H (cm)</span>
                    </div>
                    <div class="relative">
                      <input 
                        type="number" 
                        id="product-length" 
                        v-model="currentProduct.length" 
                        min="0" 
                        step="0.1" 
                        class="form-input pl-2 pr-10" 
                        placeholder="0"
                      />
                      <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">L (cm)</span>
                    </div>
                    <div class="relative">
                      <input 
                        type="number" 
                        id="product-weight" 
                        v-model="currentProduct.weight" 
                        min="0" 
                        step="0.1" 
                        class="form-input pl-2 pr-10" 
                        placeholder="0"
                      />
                      <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">kg</span>
                    </div>
                  </div>
                </div>
                
                <div class="form-group">
                  <div class="flex items-center justify-between">
                    <label class="form-label">Artwork Status</label>
                    <Tooltip text="Special status flags for your artwork">
                      <InfoCircleIcon class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors" />
                    </Tooltip>
                  </div>
                  <div class="grid grid-cols-2 gap-y-3">
                    <div class="flex items-center space-x-2">
                      <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                          type="checkbox" 
                          id="product-available" 
                          v-model="currentProduct.isAvailable" 
                          class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label 
                          for="product-available" 
                          class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                      <label for="product-available" class="text-sm text-gray-700">Available</label>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                      <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                          type="checkbox" 
                          id="product-featured" 
                          v-model="currentProduct.isFeatured" 
                          class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label 
                          for="product-featured" 
                          class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                      <label for="product-featured" class="text-sm text-gray-700">Featured</label>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                      <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                          type="checkbox" 
                          id="product-new" 
                          v-model="currentProduct.isNew" 
                          class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label 
                          for="product-new" 
                          class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                      <label for="product-new" class="text-sm text-gray-700">New</label>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                      <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                          type="checkbox" 
                          id="product-bestseller" 
                          v-model="currentProduct.isBestseller" 
                          class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label 
                          for="product-bestseller" 
                          class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                      <label for="product-bestseller" class="text-sm text-gray-700">Bestseller</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Image Upload Section -->
          <div class="bg-violet-50/50 p-5 rounded-xl border border-violet-100">
            <h3 class="text-lg font-semibold text-violet-800 mb-4 flex items-center">
              <ImageIcon class="h-5 w-5 mr-2" />
              Artwork Images
              <span class="text-red-500 ml-1">*</span>
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Upload Area -->
              <div>
                <div class="form-group">
                  <div class="flex items-center justify-between">
                    <label class="form-label">Main Images</label>
                    <Tooltip text="Upload high-quality images of your artwork (multiple images allowed)">
                      <InfoCircleIcon class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors" />
                    </Tooltip>
                  </div>
                  
                  <div 
                    class="upload-area group"
                    @dragover.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false"
                    @drop.prevent="handleFileDrop"
                    :class="{ 'border-violet-500 bg-violet-50': isDragging }"
                  >
                    <div class="text-center">
                      <UploadCloudIcon class="mx-auto h-12 w-12 text-violet-400 group-hover:text-violet-600 transition-colors" />
                      <div class="mt-2">
                        <label for="file-upload" class="upload-button">
                          <span>Choose files</span>
                          <input 
                            id="file-upload" 
                            type="file" 
                            class="sr-only" 
                            multiple 
                            accept="image/*" 
                            @change="handleImageUpload" 
                          />
                        </label>
                        <span class="text-sm text-gray-500 ml-2">or drag and drop</span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                      
                      <!-- Upload Progress -->
                      <div v-if="uploadingBatch || uploadingSingle" class="mt-3">
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            class="bg-violet-600 h-2.5 rounded-full progress-bar-animate" 
                            :style="{
                              width: uploadProgress + '%',
                              transition: 'width 0.3s ease-in-out'
                            }"
                          ></div>
                        </div>
                        <p class="text-sm text-violet-600 mt-1 animate-pulse">
                          {{ uploadingBatch ? 'Uploading multiple images...' : 'Uploading image...' }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="form-group mt-4">
                  <div class="flex items-center justify-between">
                    <label for="product-attributes" class="form-label">Additional Attributes</label>
                    <Tooltip text="JSON format for additional artwork details like materials, techniques, etc.">
                      <InfoCircleIcon class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors" />
                    </Tooltip>
                  </div>
                  <textarea 
                    id="product-attributes" 
                    v-model="attributesInput" 
                    rows="3" 
                    class="form-input font-mono text-sm" 
                    placeholder='{"material": "Canvas", "style": "Abstract", "technique": "Oil"}'
                  ></textarea>
                  
                  <!-- JSON Preview -->
                  <div v-if="isValidJSON && attributesInput" class="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200 animate-fadeIn">
                    <div v-for="(value, key) in parsedAttributes" :key="key" class="flex items-center text-sm">
                      <span class="font-medium text-gray-700">{{ key }}:</span>
                      <span class="ml-2 text-gray-600">{{ value }}</span>
                    </div>
                  </div>
                  <p v-else-if="attributesInput && !isValidJSON" class="text-red-500 text-xs mt-1">
                    Invalid JSON format
                  </p>
                </div>
              </div>
              
              <!-- Image Previews -->
              <div>
                <div class="form-group">
                  <div class="flex items-center justify-between mb-2">
                    <label class="form-label">Image Previews</label>
                    <span class="text-sm text-gray-500">{{ imagePreviewUrls.length }} image(s)</span>
                  </div>
                  
                  <div v-if="imagePreviewUrls.length > 0" class="image-preview-container">
                    <div v-for="(url, index) in imagePreviewUrls" :key="index" class="image-preview-item">
                      <div class="relative group overflow-hidden rounded-lg">
                        <img :src="url" alt="Preview" class="preview-image" />
                        <div class="image-overlay">
                          <button 
                            @click="removeImage(index)" 
                            class="image-delete-button"
                            type="button"
                          >
                            <TrashIcon class="h-4 w-4" />
                          </button>
                          <div class="image-info">
                            <span class="text-xs font-medium">Image {{ index + 1 }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Empty slots for visual balance -->
                    <div 
                      v-for="i in Math.max(0, 6 - imagePreviewUrls.length)" 
                      :key="`empty-${i}`" 
                      class="empty-preview-slot"
                    ></div>
                  </div>
                  
                  <div v-else class="flex items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p class="text-sm text-gray-500">No images uploaded yet</p>
                  </div>
                
                </div>
                
                <!-- Size Variants Section -->
                <div class="form-group mt-4">
                  <div class="flex items-center justify-between">
                    <label class="form-label">Size Variants</label>
                    <Tooltip text="Add different size options for your artwork if available">
                      <InfoCircleIcon class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors" />
                    </Tooltip>
                  </div>
                  
                  <div class="space-y-2">
                    <div v-for="(size, index) in sizeVariants" :key="index" class="size-variant-item">
                      <div class="flex items-center gap-2">
                        <input 
                          type="text" 
                          v-model="size.name" 
                          class="form-input text-sm flex-1" 
                          placeholder="Size name (e.g. Small, Medium, Large)"
                        />
                        <input 
                          type="number" 
                          v-model="size.price" 
                          class="form-input text-sm w-24" 
                          placeholder="Price"
                          min="0"
                          step="0.01"
                        />
                        <button 
                          @click="removeSizeVariant(index)" 
                          type="button"
                          class="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <XIcon class="h-5 w-5" />
                        </button>
                      </div>
                      
                      <!-- Size variant dimensions (new) -->
                      <div class="grid grid-cols-3 gap-2 mt-2">
                        <div class="relative">
                          <input 
                            type="number" 
                            v-model="size.width" 
                            class="form-input text-sm pl-2 pr-8" 
                            placeholder="Width"
                            min="0"
                            step="0.1"
                          />
                          <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">W</span>
                        </div>
                        <div class="relative">
                          <input 
                            type="number" 
                            v-model="size.height" 
                            class="form-input text-sm pl-2 pr-8" 
                            placeholder="Height"
                            min="0"
                            step="0.1"
                          />
                          <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">H</span>
                        </div>
                        <div class="relative">
                          <input 
                            type="number" 
                            v-model="size.stock" 
                            class="form-input text-sm pl-2 pr-8" 
                            placeholder="Stock"
                            min="0"
                            step="1"
                          />
                          <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">Qty</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      @click="addSizeVariant" 
                      type="button"
                      class="add-size-button"
                    >
                      <PlusIcon class="h-4 w-4 mr-1" />
                      Add Size Variant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3">
            <button 
              @click="closeProductModal" 
              type="button" 
              class="cancel-button"
            >
              <XIcon class="h-4 w-4 mr-1" />
              Cancel
            </button>
            
            <button 
              type="submit" 
              class="save-button"
              :disabled="loading || uploadingBatch || uploadingSingle"
            >
              <div v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </div>
              <div v-else class="flex items-center">
                <SaveIcon class="h-4 w-4 mr-1" />
                Save Artwork
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useSingleUploadFile } from '@/composables/core/useSingleUpload'
import { useCreateProduct } from '@/composables/modules/products/useCreateProduct'
import { useFetchCategories } from '@/composables/modules/category/useFetchCategories'
import { useBatchUploadFile } from '@/composables/core/useBatchUploads'
import { onMounted } from 'vue'

// Import the standalone Tooltip component
import Tooltip from '@/components/core/Tooltip.vue'

// Icons import
import { 
  Paintbrush,
  Info as InfoIcon, 
  BadgeInfoIcon,
  Tag as TagIcon,
  Image as ImageIcon,
  UploadCloud as UploadCloudIcon,
  Trash as TrashIcon,
  Plus as PlusIcon,
  X as XIcon,
  Save as SaveIcon
} from 'lucide-vue-next'

// Initialize composables
const { categories } = useFetchCategories()
const { loading, createProduct, product } = useCreateProduct()
const { singleUploadFile, loading: uploadingSingle, uploadResponse: singleUploadResponse } = useSingleUploadFile()
const { batchUploadFile, loading: uploadingBatch, uploadResponse: batchUploadResponse } = useBatchUploadFile()

// Form state
const currentProduct = ref({
  name: '',
  description: '',
  category: '',
  price: null as number | null,
  discountPrice: null as number | null,
  tags: [] as string[],
  width: null as number | null,
  height: null as number | null,
  length: null as number | null,
  weight: null as number | null,
  isAvailable: true,
  isFeatured: false,
  isNew: true,
  isBestseller: false,
  images: [] as string[],
  attributes: {} as Record<string, any>,
  sizeVariants: [] as Array<{
    name: string, 
    price: number | null,
    width: number | null,
    height: number | null,
    stock: number | null
  }>
})

// UI state
const tagsInput = ref('')
const attributesInput = ref('')
const isDragging = ref(false)
const isEditProductModalOpen = ref(false)
const uploadProgress = ref(0)

// Image upload handling
const imageFiles = ref([] as File[])
const imagePreviewUrls = ref([] as string[])
const uploadedImageUrls = ref([] as string[])

// Size variants
const sizeVariants = ref([
  { 
    name: '', 
    price: null as number | null,
    width: null as number | null,
    height: null as number | null,
    stock: null as number | null
  }
])

// Watch for upload responses
watch(() => singleUploadResponse.value, (newValue) => {
  if (newValue && newValue.url) {
    uploadedImageUrls.value.push(newValue.url)
  }
})

watch(() => batchUploadResponse.value, (newValue) => {
  if (newValue && Array.isArray(newValue)) {
    const urls = newValue.map(response => response.url).filter(Boolean)
    uploadedImageUrls.value.push(...urls)
  }
})

// Simulate upload progress
watch([uploadingSingle, uploadingBatch], ([newSingle, newBatch], [oldSingle, oldBatch]) => {
  if ((newSingle || newBatch) && (!oldSingle && !oldBatch)) {
    // Upload started
    uploadProgress.value = 0
    simulateProgress()
  } else if ((!newSingle && !newBatch) && (oldSingle || oldBatch)) {
    // Upload finished
    uploadProgress.value = 100
  }
})

// Computed properties
const parsedTags = computed(() => {
  if (!tagsInput.value) return []
  return tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag)
})

const isValidJSON = computed(() => {
  if (!attributesInput.value) return true
  try {
    JSON.parse(attributesInput.value)
    return true
  } catch (e) {
    return false
  }
})

const parsedAttributes = computed(() => {
  if (!attributesInput.value || !isValidJSON.value) return {}
  try {
    return JSON.parse(attributesInput.value)
  } catch (e) {
    return {}
  }
})

// Methods
const simulateProgress = () => {
  let interval: number | null = null
  
  const updateProgress = () => {
    if (uploadingSingle.value || uploadingBatch.value) {
      // Simulate progress between 0-95% while uploading
      if (uploadProgress.value < 95) {
        uploadProgress.value += Math.random() * 10
        if (uploadProgress.value > 95) uploadProgress.value = 95
      }
    } else {
      // Clear interval when upload is complete
      if (interval) {
        clearInterval(interval)
        interval = null
        uploadProgress.value = 100
      }
    }
  }
  
  interval = setInterval(updateProgress, 300) as unknown as number
}

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  
  // Store the files for later preview
  const files = Array.from(input.files)
  
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
  
  // Upload files immediately
  await uploadFiles(files)
}

const handleFileDrop = async (event: DragEvent) => {
  isDragging.value = false
  if (!event.dataTransfer?.files) return
  
  const files = Array.from(event.dataTransfer.files).filter(file => 
    file.type.startsWith('image/')
  )
  
  if (files.length === 0) return
  
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
  
  // Upload files immediately
  await uploadFiles(files)
}

const uploadFiles = async (files: File[]) => {
  try {
    if (files.length === 1) {
      // Use single file upload for one file
      await singleUploadFile(files[0])
    } else if (files.length > 1) {
      // Use batch upload for multiple files
      // Create FormData and append each file with the same key name 'files'
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })
      await batchUploadFile(formData)
    }
  } catch (error) {
    console.error('Error uploading files:', error)
    alert('Failed to upload images. Please try again.')
  }
}

const removeImage = (index: number) => {
  // Remove from preview
  imagePreviewUrls.value.splice(index, 1)
  
  // Remove from uploaded URLs if available
  if (index < uploadedImageUrls.value.length) {
    uploadedImageUrls.value.splice(index, 1)
  }
}

const addSizeVariant = () => {
  sizeVariants.value.push({ 
    name: '', 
    price: null,
    width: null,
    height: null,
    stock: null
  })
}

const removeSizeVariant = (index: number) => {
  sizeVariants.value.splice(index, 1)
  if (sizeVariants.value.length === 0) {
    addSizeVariant()
  }
}

const saveProduct = async () => {
  try {
    // Process tags from input
    if (tagsInput.value) {
      currentProduct.value.tags = parsedTags.value
    }
    
    // Process attributes from JSON input
    if (attributesInput.value && isValidJSON.value) {
      currentProduct.value.attributes = parsedAttributes.value
    }
    
    // Process size variants - filter out incomplete entries
    currentProduct.value.sizeVariants = sizeVariants.value.filter(
      variant => variant.name && variant.price !== null
    )
    
    // Use uploaded image URLs
    if (uploadedImageUrls.value.length > 0) {
      if (isEditProductModalOpen.value) {
        // For edit, append new images to existing ones
        currentProduct.value.images = [...currentProduct.value.images, ...uploadedImageUrls.value]
      } else {
        // For new product, just use the uploaded images
        currentProduct.value.images = [...uploadedImageUrls.value]
      }
    } else if (!isEditProductModalOpen.value && imagePreviewUrls.value.length === 0) {
      // Require at least one image for new products
      alert('Please upload at least one image')
      return
    }
    
    // Create the product
    await createProduct(currentProduct.value)
    
    // Reset form after successful save
    resetForm()
    
    // Close modal
    closeProductModal()
  } catch (error) {
    console.error('Error saving product:', error)
    alert('An error occurred while saving the artwork')
  }
}

const resetForm = () => {
  currentProduct.value = {
    name: '',
    description: '',
    category: '',
    price: null,
    discountPrice: null,
    tags: [],
    width: null,
    height: null,
    length: null,
    weight: null,
    isAvailable: true,
    isFeatured: false,
    isNew: true,
    isBestseller: false,
    images: [],
    attributes: {},
    sizeVariants: []
  }
  tagsInput.value = ''
  attributesInput.value = ''
  imageFiles.value = []
  imagePreviewUrls.value = []
  uploadedImageUrls.value = []
  sizeVariants.value = [{ 
    name: '', 
    price: null,
    width: null,
    height: null,
    stock: null
  }]
  uploadProgress.value = 0
}

const closeProductModal = () => {
  // This function would be provided by the parent component
  // For now, we'll just reset the form
  resetForm()
}

definePageMeta({
  layout: 'dashboard'
})

onMounted(() => {
  // Ensure that the categories composable is initialized
  // even if the component isn't immediately visible.
  categories.value;
})
</script>

<style scoped>
/* Base Styles */
.artwork-upload-container {
  @apply max-w-5xl mx-auto p-4;
}

.form-group {
  @apply space-y-1;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply block w-full p-2.5 pl-6 border outline-none rounded-md border-gray-100 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 transition-all duration-200;
}

/* Toggle Switch */
.toggle-checkbox:checked {
  @apply right-0 border-violet-600;
  transition: right 0.2s ease-in-out;
}

.toggle-checkbox:checked + .toggle-label {
  @apply bg-violet-600;
  transition: background-color 0.2s ease-in-out;
}

/* Upload Area */
.upload-area {
  @apply flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md transition-all duration-200 hover:border-violet-400 hover:bg-violet-50/50;
}

.upload-button {
  @apply relative cursor-pointer bg-white rounded-md font-medium text-violet-600 hover:text-violet-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-violet-500 transition-colors duration-200;
}

/* Image Preview */
.image-preview-container {
  @apply grid grid-cols-3 gap-2;
}

.image-preview-item {
  @apply aspect-square overflow-hidden;
}

.preview-image {
  @apply h-full w-full object-cover transition-transform duration-200 group-hover:scale-105;
}

.image-overlay {
  @apply absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2;
}

.image-delete-button {
  @apply ml-auto bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200;
}

.image-info {
  @apply bg-black bg-opacity-50 text-white rounded px-2 py-1;
}

.empty-preview-slot {
  @apply aspect-square bg-gray-100 rounded-lg border border-dashed border-gray-300;
}

/* Size Variants */
.size-variant-item {
  @apply p-2 bg-white rounded-md border border-gray-200 animate-fadeIn;
}

.add-size-button {
  @apply flex items-center justify-center w-full py-2 text-sm text-violet-600 bg-violet-50 rounded-md hover:bg-violet-100 transition-colors duration-200;
}

/* Action Buttons */
.cancel-button {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors duration-200;
}

.save-button {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed;
}

/* Animations */
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

.progress-bar-animate {
  animation: progressBar 1.5s ease-in-out infinite;
}

@keyframes progressBar {
  0% { width: 10%; }
  50% { width: 70%; }
  100% { width: 10%; }
}

/* Background Grid Pattern */
.bg-grid-white {
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}
</style>