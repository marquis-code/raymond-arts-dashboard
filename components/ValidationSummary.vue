<template>
    <div 
      class="border rounded-lg p-4"
      :class="isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'"
    >
      <div class="flex items-center gap-2 mb-3">
        <Icon 
          :name="isValid ? 'heroicons:check-circle' : 'heroicons:exclamation-triangle'"
          class="h-5 w-5"
          :class="isValid ? 'text-green-600' : 'text-red-600'"
        />
        <h4 
          class="font-medium"
          :class="isValid ? 'text-green-800' : 'text-red-800'"
        >
          {{ isValid ? 'Ready to Submit' : 'Issues Found' }}
        </h4>
      </div>
      
      <div v-if="isValid" class="text-sm text-green-700">
        <p>All required information has been provided. Your artwork is ready to be created.</p>
      </div>
      
      <div v-else class="space-y-2">
        <p class="text-sm text-red-700 mb-2">Please address the following issues:</p>
        <ul class="space-y-1">
          <li 
            v-for="error in validationErrors"
            :key="error"
            class="text-sm text-red-600 flex items-start gap-2"
          >
            <Icon name="heroicons:x-mark" class="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{{ error }}</span>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import type { ArtworkFormData } from '~/types/artwork'
  
  interface Props {
    formData: ArtworkFormData
  }
  
  const props = defineProps<Props>()
  
  const validationErrors = computed(() => {
    const errors: string[] = []
    
    if (!props.formData.name?.trim()) {
      errors.push('Artwork name is required')
    }
    
    if (!props.formData.description?.trim()) {
      errors.push('Description is required')
    }
    
    if (!props.formData.category) {
      errors.push('Category must be selected')
    }
    
    if (!props.formData.price || props.formData.price <= 0) {
      errors.push('Valid base price is required')
    }
    
    if (props.formData.sizes.length === 0) {
      errors.push('At least one size variant is required')
    }
    
    if (props.formData.images.length === 0) {
      errors.push('At least one image is required')
    }
    
    // Validate size variants
    props.formData.sizes.forEach((size, index) => {
      if (!size.size) {
        errors.push(`Size variant ${index + 1}: Size must be selected`)
      }
      if (!size.price || size.price <= 0) {
        errors.push(`Size variant ${index + 1}: Valid price is required`)
      }
    })
    
    return errors
  })
  
  const isValid = computed(() => validationErrors.value.length === 0)
  </script>
  