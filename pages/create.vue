<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 space-y-6">
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg p-6">
        <div class="flex items-center gap-3 mb-4">
          <Icon name="heroicons:paint-brush" class="h-8 w-8" />
          <h1 class="text-3xl font-bold">Create New Artwork</h1>
        </div>
        
        <div class="space-y-2">
          <div class="w-full bg-white/20 rounded-full h-2">
            <div 
              class="bg-white h-2 rounded-full transition-all duration-300"
              :style="{ width: `${progress}%` }"
            />
          </div>
          <p class="text-sm opacity-90">
            Step {{ currentStep }} of {{ totalSteps }}: {{ getCurrentStepTitle() }}
          </p>
        </div>
      </div>

      <!-- Step Navigation -->
      <StepNavigation
        :current-step="currentStep"
        :steps="steps"
      />

      <!-- Form Content -->
      <div class="bg-white rounded-lg shadow-sm border min-h-[600px]">
        <div class="p-6">
          <!-- Step 1: Basic Info -->
          <BasicInfoStep
            v-if="currentStep === 1"
            :form-data="formData"
            @update:form-data="handleUpdateFormData"
          />

          <!-- Step 2: Size & Pricing -->
          <SizePricingStep
            v-else-if="currentStep === 2"
            :sizes="formData.sizes"
            @add-size="handleAddSize"
            @update-size="handleUpdateSize"
            @remove-size="handleRemoveSize"
          />

          <!-- Step 3: Installments -->
          <InstallmentStep
            v-else-if="currentStep === 3"
            :global-config="formData.installmentConfig"
            :sizes="formData.sizes"
            @update:global-config="handleUpdateGlobalInstallment"
            @update:size-config="handleUpdateSizeInstallment"
          />

          <!-- Step 4: Details -->
          <DetailedInfoStep
            v-else-if="currentStep === 4"
            :form-data="formData"
            @update:form-data="handleUpdateFormData"
          />

          <!-- Step 5: Images -->
          <ImageUploadStep
            v-else-if="currentStep === 5"
            :form-data="formData"
            @update:form-data="handleUpdateFormData"
          />

          <!-- Step 6: Review -->
          <ReviewStep
            v-else-if="currentStep === 6"
            :form-data="formData"
          />
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between items-center">
        <button
          type="button"
          class="btn-secondary"
          :disabled="currentStep === 1"
          @click="prevStep"
        >
          <Icon name="heroicons:chevron-left" class="h-4 w-4 mr-2" />
          Previous
        </button>

        <div class="flex gap-3">
          <button
            type="button"
            class="btn-outline"
            @click="resetForm"
          >
            Reset Form
          </button>

          <button
            v-if="currentStep === totalSteps"
            type="button"
            class="btn-success"
            :disabled="isSubmitting || !isValidForSubmission"
            @click="handleSubmit"
          >
            <Icon 
              :name="isSubmitting ? 'heroicons:arrow-path' : 'heroicons:check-circle'" 
              class="h-4 w-4 mr-2"
              :class="{ 'animate-spin': isSubmitting }"
            />
            {{ isSubmitting ? 'Creating...' : 'Create Artwork' }}
          </button>

          <button
            v-else
            type="button"
            class="btn-primary"
            :disabled="!validateStep(currentStep)"
            @click="nextStep"
          >
            Next
            <Icon name="heroicons:chevron-right" class="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useArtworkForm } from '~/composables/useArtworkForm'
import { definePageMeta } from '#imports'
import type { ArtworkFormData, SizePrice, InstallmentConfig, SizeInstallmentConfig } from '~/types/artwork'

definePageMeta({
  layout: 'dashboard'
})

const {
  formData,
  currentStep,
  totalSteps,
  updateFormData,
  addSizeVariant,
  updateSizeVariant,
  removeSizeVariant,
  updateGlobalInstallment,
  updateSizeInstallment,
  nextStep,
  prevStep,
  resetForm,
  validateStep,
  submitForm,
} = useArtworkForm()

const isSubmitting = ref(false)

const steps = [
  { id: 1, title: 'Basic Info', icon: 'heroicons:information-circle' },
  { id: 2, title: 'Size & Pricing', icon: 'heroicons:scale' },
  { id: 3, title: 'Installments', icon: 'heroicons:credit-card' },
  { id: 4, title: 'Details', icon: 'heroicons:paint-brush' },
  { id: 5, title: 'Images', icon: 'heroicons:photo' },
  { id: 6, title: 'Review', icon: 'heroicons:eye' },
]

const progress = computed(() => (currentStep.value / totalSteps) * 100)

// Validation for final submission
const isValidForSubmission = computed(() => {
  const hasValidImages = formData.images.some(img => 
    img && !img.startsWith('data:') && (img.startsWith('http') || img.startsWith('/'))
  )
  
  return formData.name && 
         formData.description && 
         formData.category && 
         formData.price > 0 && 
         formData.sizes.length > 0 && 
         hasValidImages
})

const getCurrentStepTitle = () => {
  const step = steps.find(s => s.id === currentStep.value)
  return step?.title || ''
}

// Event handlers
const handleUpdateFormData = (updates: Partial<ArtworkFormData>) => {
  console.log('Page: Updating form data with:', updates)
  updateFormData(updates)
}

const handleAddSize = () => {
  console.log('Page: Add size button clicked')
  addSizeVariant()
}

const handleUpdateSize = (index: number, updates: Partial<SizePrice>) => {
  console.log('Page: Updating size at index', index, 'with:', updates)
  updateSizeVariant(index, updates)
}

const handleRemoveSize = (index: number) => {
  console.log('Page: Removing size at index', index)
  removeSizeVariant(index)
}

const handleUpdateGlobalInstallment = (updates: Partial<InstallmentConfig>) => {
  console.log('Page: Updating global installment with:', updates)
  updateGlobalInstallment(updates)
}

const handleUpdateSizeInstallment = (index: number, updates: Partial<SizeInstallmentConfig>) => {
  console.log('Page: Updating size installment at index', index, 'with:', updates)
  updateSizeInstallment(index, updates)
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    // Create the final payload with only uploaded URLs
    const finalPayload = {
      ...formData,
      images: formData.images.filter(img => 
        img && !img.startsWith('data:') && (img.startsWith('http') || img.startsWith('/'))
      )
    }
    
    console.log('Submitting final payload:', finalPayload)
    
    const result = await submitForm()
    if (result.success) {
      console.log('Form submitted successfully!')
      // await navigateTo('/artwork/list')
    }
  } catch (error) {
    console.error('Submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.btn-primary {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;
}

.btn-secondary {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;
}

.btn-success {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;
}

.btn-outline {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200;
}
</style>
