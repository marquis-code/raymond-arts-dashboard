<template>
    <div class="space-y-8">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p class="text-gray-600">Review all product details before creating your product</p>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column - Product Preview -->
        <div class="space-y-6">
          <!-- Product Card Preview -->
          <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div class="aspect-square bg-gray-100 relative">
              <img
                v-if="localData.images[0]"
                :src="localData.images[0]"
                :alt="localData.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="flex items-center justify-center h-full">
                <Icon name="lucide:image" class="w-16 h-16 text-gray-300" />
              </div>
              
              <!-- Product Badges -->
              <div class="absolute top-3 left-3 space-y-2">
                <span v-if="localData.isNew" class="inline-block px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
                  NEW
                </span>
                <span v-if="localData.isFeatured" class="inline-block px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                  FEATURED
                </span>
                <span v-if="localData.isBestseller" class="inline-block px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded">
                  BESTSELLER
                </span>
              </div>
              
              <!-- Discount Badge -->
              <div v-if="localData.discountPrice > 0" class="absolute top-3 right-3">
                <span class="inline-block px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                  -{{ discountPercentage }}%
                </span>
              </div>
            </div>
            
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 mb-2">{{ localData.name || 'Product Name' }}</h3>
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ localData.description || 'Product description' }}</p>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span v-if="localData.discountPrice > 0" class="text-lg font-bold text-green-600">
                    ${{ localData.discountPrice.toFixed(2) }}
                  </span>
                  <span 
                    class="font-bold"
                    :class="localData.discountPrice > 0 ? 'text-sm text-gray-500 line-through' : 'text-lg text-gray-900'"
                  >
                    ${{ localData.price.toFixed(2) }}
                  </span>
                </div>
                
                <div class="flex items-center space-x-1">
                  <Icon name="lucide:star" class="w-4 h-4 text-yellow-400 fill-current" />
                  <span class="text-sm text-gray-600">0.0 (0)</span>
                </div>
              </div>
              
              <div v-if="localData.promotionText" class="mt-3 p-2 bg-yellow-100 rounded text-yellow-800 text-xs">
                {{ localData.promotionText }}
              </div>
            </div>
          </div>
  
          <!-- Image Gallery Preview -->
          <div v-if="localData.images.length > 1">
            <h4 class="font-medium text-gray-900 mb-3">Additional Images ({{ localData.images.length - 1 }})</h4>
            <div class="grid grid-cols-3 gap-2">
              <img
                v-for="(image, index) in localData.images.slice(1, 4)"
                :key="index"
                :src="image"
                :alt="`Product image ${index + 2}`"
                class="aspect-square object-cover rounded-lg border border-gray-200"
              />
              <div v-if="localData.images.length > 4" class="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <span class="text-gray-500 text-sm">+{{ localData.images.length - 4 }} more</span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Right Column - Details Summary -->
        <div class="space-y-6">
          <!-- Basic Information -->
          <div class="bg-gray-50 rounded-xl p-6">
            <h4 class="font-semibold text-gray-900 mb-4">📋 Basic Information</h4>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Name:</span>
                <span class="font-medium">{{ localData.name || 'Not set' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Category:</span>
                <span class="font-medium">{{ getCategoryName() || 'Not selected' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Tags:</span>
                <span class="font-medium">{{ localData.tags.length }} tags</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Status:</span>
                <span class="font-medium" :class="localData.isAvailable ? 'text-green-600' : 'text-red-600'">
                  {{ localData.isAvailable ? 'Available' : 'Unavailable' }}
                </span>
              </div>
            </div>
          </div>
  
          <!-- Pricing Summary -->
          <div class="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h4 class="font-semibold text-blue-900 mb-4">💰 Pricing</h4>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-blue-700">Base Price:</span>
                <span class="font-medium">${{ localData.price.toFixed(2) }}</span>
              </div>
              <div v-if="localData.discountPrice > 0" class="flex justify-between">
                <span class="text-blue-700">Discount Price:</span>
                <span class="font-medium text-green-600">${{ localData.discountPrice.toFixed(2) }}</span>
              </div>
              <div v-if="localData.discountPrice > 0" class="flex justify-between">
                <span class="text-blue-700">Savings:</span>
                <span class="font-medium text-green-600">{{ discountPercentage }}%</span>
              </div>
            </div>
          </div>
  
          <!-- Sizes Summary -->
          <div v-if="localData.sizes.length > 0" class="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <h4 class="font-semibold text-purple-900 mb-4">📐 Sizes ({{ localData.sizes.length }})</h4>
            <div class="space-y-2">
              <div
                v-for="(size, index) in localData.sizes"
                :key="index"
                class="flex justify-between items-center text-sm"
              >
                <span class="text-purple-700">{{ size.size }} ({{ size.color }}):</span>
                <span class="font-medium">${{ size.price.toFixed(2) }}</span>
              </div>
            </div>
          </div>
  
          <!-- Installment Summary -->
          <div v-if="hasInstallmentOptions" class="bg-green-50 rounded-xl p-6 border border-green-200">
            <h4 class="font-semibold text-green-900 mb-4">💳 Installment Options</h4>
            <div class="space-y-2 text-sm">
              <div v-if="localData.installmentConfig.enabled" class="flex justify-between">
                <span class="text-green-700">Global Installments:</span>
                <span class="font-medium">Enabled</span>
              </div>
              <div class="flex justify-between">
                <span class="text-green-700">Size-specific:</span>
                <span class="font-medium">{{ sizeInstallmentCount }} sizes</span>
              </div>
            </div>
          </div>
  
          <!-- Validation Status -->
          <div class="bg-white border rounded-xl p-6">
            <h4 class="font-semibold text-gray-900 mb-4">✅ Validation Status</h4>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Basic Information</span>
                <Icon name="lucide:check-circle" class="w-5 h-5 text-green-500" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Pricing</span>
                <Icon name="lucide:check-circle" class="w-5 h-5 text-green-500" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Images</span>
                <Icon 
                  :name="localData.images.length > 0 ? 'lucide:check-circle' : 'lucide:x-circle'" 
                  :class="localData.images.length > 0 ? 'text-green-500' : 'text-red-500'"
                  class="w-5 h-5" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Final Actions -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
        <div class="text-center">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Ready to Create Your Product?</h3>
          <p class="text-gray-600 mb-6">
            Once you submit, your product will be created and can be managed from the products dashboard.
          </p>
          
          <div class="flex justify-center space-x-4">
            <button
              type="button"
              @click="$emit('save-draft')"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              class="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              Create Product
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, watch } from 'vue';
  import Icon from 'some-icon-component'; // Ensure this is imported
  
  interface Props {
    modelValue: any
    categories: any[]
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits(['update:modelValue', 'validate', 'save-draft'])
  
  const localData = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const discountPercentage = computed(() => {
    if (!localData.value.discountPrice || localData.value.discountPrice === 0 || localData.value.price === 0) {
      return 0
    }
    return Math.round(((localData.value.price - localData.value.discountPrice) / localData.value.price) * 100)
  })
  
  const hasInstallmentOptions = computed(() => {
    return localData.value.installmentConfig.enabled || 
           localData.value.sizes.some((size: any) => size.installmentConfig?.enabled)
  })
  
  const sizeInstallmentCount = computed(() => {
    return localData.value.sizes.filter((size: any) => size.installmentConfig?.enabled).length
  })
  
  const getCategoryName = () => {
    const category = props.categories.find(cat => cat._id === localData.value.category)
    return category?.name || null
  }
  
  const validateStep = () => {
    // Final validation - check if all required fields are filled
    const isValid = !!(
      localData.value.name &&
      localData.value.description &&
      localData.value.price > 0 &&
      localData.value.category &&
      localData.value.images.length > 0
    )
    
    emit('validate', isValid)
    return isValid
  }
  
  watch(localData, validateStep, { deep: true, immediate: true })
  </script>
  