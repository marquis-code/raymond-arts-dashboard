<template>
    <div class="space-y-8">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
        <p class="text-gray-600">Provide detailed information about your product</p>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column -->
        <div class="space-y-6">
          <!-- Product Information -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Product Information
            </label>
            <textarea
              v-model="localData.productInfo"
              rows="6"
              placeholder="Detailed product information, features, specifications..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            />
            <p class="text-gray-500 text-sm mt-1">{{ localData.productInfo?.length || 0 }}/1000 characters</p>
          </div>
  
          <!-- Return Policy -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Return Policy
            </label>
            <textarea
              v-model="localData.returnPolicy"
              rows="4"
              placeholder="Describe your return policy..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            />
            <p class="text-gray-500 text-sm mt-1">{{ localData.returnPolicy?.length || 0 }}/500 characters</p>
          </div>
  
          <!-- Shipping Information -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Shipping Information
            </label>
            <textarea
              v-model="localData.shippingInfo"
              rows="4"
              placeholder="Shipping details, delivery times, costs..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            />
            <p class="text-gray-500 text-sm mt-1">{{ localData.shippingInfo?.length || 0 }}/500 characters</p>
          </div>
        </div>
  
        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Quick Templates -->
          <div class="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <h3 class="text-lg font-semibold text-purple-900 mb-4">📝 Quick Templates</h3>
            
            <div class="space-y-3">
              <button
                @click="applyTemplate('productInfo')"
                type="button"
                class="w-full text-left p-3 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors duration-200"
              >
                <div class="font-medium text-purple-900">Product Info Template</div>
                <div class="text-sm text-purple-600">Standard product information format</div>
              </button>
              
              <button
                @click="applyTemplate('returnPolicy')"
                type="button"
                class="w-full text-left p-3 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors duration-200"
              >
                <div class="font-medium text-purple-900">Return Policy Template</div>
                <div class="text-sm text-purple-600">30-day return policy template</div>
              </button>
              
              <button
                @click="applyTemplate('shippingInfo')"
                type="button"
                class="w-full text-left p-3 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors duration-200"
              >
                <div class="font-medium text-purple-900">Shipping Info Template</div>
                <div class="text-sm text-purple-600">Standard shipping information</div>
              </button>
            </div>
          </div>
  
          <!-- Preview Card -->
          <div class="bg-gray-50 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">👁️ Customer View Preview</h3>
            
            <div class="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
              <div v-if="localData.productInfo">
                <h4 class="font-medium text-gray-900 mb-2">Product Information</h4>
                <p class="text-sm text-gray-600 line-clamp-3">{{ localData.productInfo }}</p>
              </div>
              
              <div v-if="localData.returnPolicy">
                <h4 class="font-medium text-gray-900 mb-2">Return Policy</h4>
                <p class="text-sm text-gray-600 line-clamp-2">{{ localData.returnPolicy }}</p>
              </div>
              
              <div v-if="localData.shippingInfo">
                <h4 class="font-medium text-gray-900 mb-2">Shipping Information</h4>
                <p class="text-sm text-gray-600 line-clamp-2">{{ localData.shippingInfo }}</p>
              </div>
              
              <div v-if="!localData.productInfo && !localData.returnPolicy && !localData.shippingInfo" class="text-center py-8">
                <Icon name="lucide:file-text" class="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p class="text-gray-500 text-sm">No additional information provided</p>
              </div>
            </div>
          </div>
  
          <!-- Writing Tips -->
          <div class="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <h3 class="text-lg font-semibold text-yellow-900 mb-3">💡 Writing Tips</h3>
            <ul class="space-y-2 text-sm text-yellow-800">
              <li class="flex items-start">
                <Icon name="lucide:check" class="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                Be clear and concise in your descriptions
              </li>
              <li class="flex items-start">
                <Icon name="lucide:check" class="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                Use bullet points for easy reading
              </li>
              <li class="flex items-start">
                <Icon name="lucide:check" class="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                Include care instructions if applicable
              </li>
              <li class="flex items-start">
                <Icon name="lucide:check" class="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                Mention any warranties or guarantees
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, watch } from 'vue';
  import Icon from '~~/components/Icon.vue';
  
  interface Props {
    modelValue: any
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits(['update:modelValue', 'validate'])
  
  const localData = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const templates = {
    productInfo: `This high-quality product is designed to meet your needs with:
  
  • Premium materials and construction
  • Durable and long-lasting design
  • Easy to use and maintain
  • Suitable for daily use
  • Backed by our quality guarantee
  
  Perfect for both personal and professional use. Each item is carefully inspected before shipping to ensure you receive the best quality product.`,
  
    returnPolicy: `We offer a 30-day return policy for all products:
  
  • Items must be returned in original condition
  • Original packaging and tags must be included
  • Return shipping costs are covered by the customer
  • Refunds processed within 5-7 business days
  • Exchanges available for different sizes/colors
  
  Please contact our customer service team to initiate a return. We're committed to your satisfaction and will work with you to resolve any issues.`,
  
    shippingInfo: `Fast and reliable shipping options:
  
  • Standard shipping: 5-7 business days ($5.99)
  • Express shipping: 2-3 business days ($12.99)
  • Overnight shipping: Next business day ($24.99)
  • Free shipping on orders over $75
  
  All orders are processed within 1-2 business days. You'll receive a tracking number once your order ships. We ship Monday through Friday, excluding holidays.`
  }
  
  const applyTemplate = (field: keyof typeof templates) => {
    localData.value[field] = templates[field]
  }
  
  const validateStep = () => {
    // This step is optional, so always valid
    emit('validate', true)
    return true
  }
  
  watch(localData, validateStep, { deep: true, immediate: true })
  </script>
  