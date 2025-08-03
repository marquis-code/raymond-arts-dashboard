<template>
    <div class="space-y-8">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Product Details</h2>
        <p class="text-gray-600">Add detailed specifications and dimensions</p>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column -->
        <div class="space-y-6">
          <!-- Dimensions -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">📏 Dimensions</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input
                  v-model.number="localData.weight"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Width (cm)</label>
                <input
                  v-model.number="localData.width"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0.0"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input
                  v-model.number="localData.height"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0.0"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Length (cm)</label>
                <input
                  v-model.number="localData.length"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0.0"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
  
          <!-- Custom Attributes -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">🏷️ Custom Attributes</h3>
            <div class="space-y-4">
              <div class="flex gap-3">
                <input
                  v-model="newAttribute.key"
                  type="text"
                  placeholder="Attribute name"
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  v-model="newAttribute.value"
                  type="text"
                  placeholder="Attribute value"
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  @click="addAttribute"
                  type="button"
                  class="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Icon name="lucide:plus" class="w-4 h-4" />
                </button>
              </div>
              
              <div v-if="Object.keys(localData.attributes).length > 0" class="space-y-2">
                <div
                  v-for="(value, key) in localData.attributes"
                  :key="key"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex-1">
                    <span class="font-medium text-gray-900">{{ key }}:</span>
                    <span class="text-gray-600 ml-2">{{ value }}</span>
                  </div>
                  <button
                    @click="removeAttribute(key)"
                    class="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <Icon name="lucide:trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Dimension Preview -->
          <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <h3 class="text-lg font-semibold text-purple-900 mb-4">📦 Package Preview</h3>
            
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-purple-700">Weight:</span>
                <span class="font-medium">{{ localData.weight || 0 }} kg</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-purple-700">Dimensions:</span>
                <span class="font-medium">
                  {{ localData.width || 0 }} × {{ localData.height || 0 }} × {{ localData.length || 0 }} cm
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-purple-700">Volume:</span>
                <span class="font-medium">{{ calculateVolume() }} cm³</span>
              </div>
            </div>
            
            <!-- Visual representation -->
            <div class="mt-4 p-4 bg-white rounded-lg border border-purple-200">
              <div class="text-center text-sm text-purple-600 mb-2">Package Visualization</div>
              <div 
                class="mx-auto bg-purple-200 rounded border-2 border-purple-300 flex items-center justify-center text-purple-700 text-xs font-medium"
                :style="getBoxStyle()"
              >
                {{ localData.width || 0 }}×{{ localData.height || 0 }}×{{ localData.length || 0 }}
              </div>
            </div>
          </div>
  
          <!-- Shipping Estimate -->
          <div class="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 class="text-lg font-semibold text-green-900 mb-3">🚚 Shipping Estimate</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-green-700">Shipping Class:</span>
                <span class="font-medium">{{ getShippingClass() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-green-700">Est. Shipping Cost:</span>
                <span class="font-medium">${{ getEstimatedShippingCost() }}</span>
              </div>
            </div>
          </div>
  
          <!-- Attributes Summary -->
          <div v-if="Object.keys(localData.attributes).length > 0" class="bg-gray-50 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">📋 Attributes Summary</h3>
            <div class="grid grid-cols-1 gap-2">
              <div
                v-for="(value, key) in localData.attributes"
                :key="key"
                class="flex justify-between text-sm"
              >
                <span class="text-gray-600">{{ key }}:</span>
                <span class="font-medium text-gray-900">{{ value }}</span>
              </div>
            </div>
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
  
  const newAttribute = ref({
    key: '',
    value: ''
  })
  
  const addAttribute = () => {
    if (newAttribute.value.key.trim() && newAttribute.value.value.trim()) {
      localData.value.attributes[newAttribute.value.key.trim()] = newAttribute.value.value.trim()
      newAttribute.value = { key: '', value: '' }
    }
  }
  
  const removeAttribute = (key: string) => {
    delete localData.value.attributes[key]
  }
  
  const calculateVolume = () => {
    const { width, height, length } = localData.value
    return ((width || 0) * (height || 0) * (length || 0)).toFixed(2)
  }
  
  const getBoxStyle = () => {
    const maxDimension = Math.max(localData.value.width || 1, localData.value.height || 1, localData.value.length || 1)
    const scale = Math.min(100 / maxDimension, 1)
    
    return {
      width: `${Math.max((localData.value.width || 10) * scale, 20)}px`,
      height: `${Math.max((localData.value.height || 10) * scale, 20)}px`,
    }
  }
  
  const getShippingClass = () => {
    const weight = localData.value.weight || 0
    const volume = parseFloat(calculateVolume())
    
    if (weight > 20 || volume > 100000) return 'Heavy/Oversized'
    if (weight > 5 || volume > 10000) return 'Standard'
    return 'Light'
  }
  
  const getEstimatedShippingCost = () => {
    const shippingClass = getShippingClass()
    const costs = {
      'Light': '5.99',
      'Standard': '12.99',
      'Heavy/Oversized': '24.99'
    }
    return costs[shippingClass] || '0.00'
  }
  
  const validateStep = () => {
    // This step is optional, so always valid
    emit('validate', true)
    return true
  }
  
  watch(localData, validateStep, { deep: true, immediate: true })
  </script>
  