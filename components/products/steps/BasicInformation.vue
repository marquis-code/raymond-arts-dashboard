<template>
    <div class="space-y-8">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p class="text-gray-600">Let's start with the essential details of your product</p>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column -->
        <div class="space-y-6">
          <!-- Product Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              v-model="localData.name"
              type="text"
              placeholder="Enter product name"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
          </div>
  
          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              v-model="localData.category"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              :class="{ 'border-red-500': errors.category }"
            >
              <option value="">Select a category</option>
              <option 
                v-for="category in categories" 
                :key="category._id" 
                :value="category._id"
              >
                {{ category.name }}
              </option>
            </select>
            <p v-if="errors.category" class="text-red-500 text-sm mt-1">{{ errors.category }}</p>
          </div>
  
          <!-- Tags -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div class="space-y-3">
              <input
                v-model="newTag"
                @keydown.enter.prevent="addTag"
                type="text"
                placeholder="Add tags (press Enter)"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <div v-if="localData.tags.length > 0" class="flex flex-wrap gap-2">
                <span
                  v-for="(tag, index) in localData.tags"
                  :key="index"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {{ tag }}
                  <button
                    @click="removeTag(index)"
                    class="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <Icon name="lucide:x" class="w-3 h-3" />
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              v-model="localData.description"
              rows="6"
              placeholder="Describe your product in detail"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              :class="{ 'border-red-500': errors.description }"
            />
            <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
            <p class="text-gray-500 text-sm mt-1">{{ localData.description.length }}/500 characters</p>
          </div>
  
          <!-- Product Flags -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Product Status
            </label>
            <div class="space-y-3">
              <label class="flex items-center">
                <input
                  v-model="localData.isAvailable"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-3 text-sm text-gray-700">Available for purchase</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="localData.isFeatured"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-3 text-sm text-gray-700">Featured product</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="localData.isNew"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-3 text-sm text-gray-700">New arrival</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="localData.isBestseller"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-3 text-sm text-gray-700">Bestseller</span>
              </label>
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
    categories: any[]
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits(['update:modelValue', 'validate'])
  
  const localData = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const newTag = ref('')
  const errors = ref<Record<string, string>>({})
  
  const addTag = () => {
    if (newTag.value.trim() && !localData.value.tags.includes(newTag.value.trim())) {
      localData.value.tags.push(newTag.value.trim())
      newTag.value = ''
    }
  }
  
  const removeTag = (index: number) => {
    localData.value.tags.splice(index, 1)
  }
  
  const validateStep = () => {
    errors.value = {}
    
    if (!localData.value.name?.trim()) {
      errors.value.name = 'Product name is required'
    }
    
    if (!localData.value.description?.trim()) {
      errors.value.description = 'Product description is required'
    } else if (localData.value.description.length > 500) {
      errors.value.description = 'Description must be less than 500 characters'
    }
    
    if (!localData.value.category) {
      errors.value.category = 'Please select a category'
    }
    
    const isValid = Object.keys(errors.value).length === 0
    emit('validate', isValid)
    return isValid
  }
  
  watch(localData, validateStep, { deep: true, immediate: true })
  </script>
  