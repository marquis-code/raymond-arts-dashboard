<template>
    <div class="space-y-8">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Pricing & Discounts</h2>
        <p class="text-gray-600">Set your product pricing and discount strategies</p>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column -->
        <div class="space-y-6">
          <!-- Base Price -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Base Price *
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                v-model.number="localData.price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-500': errors.price }"
              />
            </div>
            <p v-if="errors.price" class="text-red-500 text-sm mt-1">{{ errors.price }}</p>
          </div>
  
          <!-- Discount Price -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Discount Price
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                v-model.number="localData.discountPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-500': errors.discountPrice }"
              />
            </div>
            <p v-if="errors.discountPrice" class="text-red-500 text-sm mt-1">{{ errors.discountPrice }}</p>
            <p v-if="localData.discountPrice > 0" class="text-green-600 text-sm mt-1">
              Customers save {{ discountPercentage }}%
            </p>
          </div>
  
          <!-- Promotion Text -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Promotion Text
            </label>
            <input
              v-model="localData.promotionText"
              type="text"
              placeholder="e.g., Limited Time Offer!"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <p class="text-gray-500 text-sm mt-1">Optional promotional message</p>
          </div>
        </div>
  
        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Price Preview Card -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Price Preview</h3>
            
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Base Price:</span>
                <span class="font-medium">${{ localData.price.toFixed(2) }}</span>
              </div>
              
              <div v-if="localData.discountPrice > 0" class="flex justify-between items-center">
                <span class="text-gray-600">Discount Price:</span>
                <span class="font-medium text-green-600">${{ localData.discountPrice.toFixed(2) }}</span>
              </div>
              
              <div v-if="localData.discountPrice > 0" class="flex justify-between items-center">
                <span class="text-gray-600">You Save:</span>
                <span class="font-medium text-green-600">
                  ${{ (localData.price - localData.discountPrice).toFixed(2) }} ({{ discountPercentage }}%)
                </span>
              </div>
              
              <hr class="border-blue-200">
              
              <div class="flex justify-between items-center text-lg font-bold">
                <span>Final Price:</span>
                <span class="text-blue-600">
                  ${{ (localData.discountPrice > 0 ? localData.discountPrice : localData.price).toFixed(2) }}
                </span>
              </div>
            </div>
            
            <div v-if="localData.promotionText" class="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-200">
              <p class="text-yellow-800 text-sm font-medium">{{ localData.promotionText }}</p>
            </div>
          </div>
  
          <!-- Pricing Tips -->
          <div class="bg-gray-50 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">💡 Pricing Tips</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-start">
                <Icon name="lucide:check-circle" class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Research competitor pricing before setting your price
              </li>
              <li class="flex items-start">
                <Icon name="lucide:check-circle" class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Consider your target profit margin
              </li>
              <li class="flex items-start">
                <Icon name="lucide:check-circle" class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Use psychological pricing (e.g., $9.99 vs $10.00)
              </li>
              <li class="flex items-start">
                <Icon name="lucide:check-circle" class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Test different price points to optimize sales
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import Icon from '@/components/Icon.vue'
  
  interface Props {
    modelValue: any
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits(['update:modelValue', 'validate'])
  
  const localData = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const errors = ref<Record<string, string>>({})
  
  const discountPercentage = computed(() => {
    if (!localData.value.discountPrice || localData.value.discountPrice === 0 || localData.value.price === 0) {
      return 0
    }
    return Math.round(((localData.value.price - localData.value.discountPrice) / localData.value.price) * 100)
  })
  
  const validateStep = () => {
    errors.value = {}
    
    if (!localData.value.price || localData.value.price <= 0) {
      errors.value.price = 'Base price must be greater than 0'
    }
    
    if (localData.value.discountPrice && localData.value.discountPrice >= localData.value.price) {
      errors.value.discountPrice = 'Discount price must be less than base price'
    }
    
    const isValid = Object.keys(errors.value).length === 0
    emit('validate', isValid)
    return isValid
  }
  
  watch(localData, validateStep, { deep: true, immediate: true })
  </script>
  