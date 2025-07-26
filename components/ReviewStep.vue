<template>
  <div class="space-y-8">
    <div class="flex items-center gap-2 mb-6">
      <Icon name="heroicons:eye" class="h-6 w-6 text-green-500" />
      <h3 class="text-xl font-semibold text-gray-800">Review & Submit</h3>
    </div>

    <div class="space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Basic Information -->
        <ReviewCard
          title="Basic Information"
          icon="heroicons:information-circle"
          icon-color="text-blue-500"
        >
          <ReviewItem label="Name" :value="formData.name" />
          <ReviewItem label="Category" :value="formData.category" />
          <ReviewItem label="Base Price" :value="formatCurrency(formData.price)" />
          <ReviewItem 
            v-if="formData.discountPrice > 0"
            label="Discount Price" 
            :value="formatCurrency(formData.discountPrice)" 
          />
          <ReviewItem label="Description" :value="stripHtml(formData.description)" truncate />
        </ReviewCard>

        <!-- Dimensions & Status -->
        <ReviewCard
          title="Dimensions & Status"
          icon="heroicons:cube"
          icon-color="text-purple-500"
        >
          <ReviewItem 
            label="Dimensions" 
            :value="`${formData.width} × ${formData.height} × ${formData.length} cm`" 
          />
          <ReviewItem label="Weight" :value="`${formData.weight} kg`" />
          <div class="flex flex-wrap gap-2 mt-2">
            <StatusBadge v-if="formData.isAvailable" label="Available" color="green" />
            <StatusBadge v-if="formData.isFeatured" label="Featured" color="blue" />
            <StatusBadge v-if="formData.isNew" label="New" color="yellow" />
            <StatusBadge v-if="formData.isBestseller" label="Bestseller" color="purple" />
          </div>
        </ReviewCard>
      </div>

      <!-- Size Variants -->
      <ReviewCard
        title="Size Variants"
        icon="heroicons:scale"
        icon-color="text-green-500"
        :count="formData.sizes.length"
      >
        <div v-if="formData.sizes.length > 0" class="space-y-3">
          <SizeVariantReview
            v-for="(size, index) in formData.sizes"
            :key="`review-size-${index}`"
            :size="size"
          />
        </div>
        <p v-else class="text-gray-500 italic">No size variants configured</p>
      </ReviewCard>

      <!-- Installment Configuration -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Global Installments -->
        <ReviewCard
          title="Global Installments"
          icon="heroicons:credit-card"
          icon-color="text-blue-500"
        >
          <InstallmentConfigReview :config="formData.installmentConfig" />
        </ReviewCard>

        <!-- Size-Specific Installments -->
        <ReviewCard
          title="Size-Specific Installments"
          icon="heroicons:banknotes"
          icon-color="text-green-500"
        >
          <div class="space-y-3">
            <div
              v-for="(size, index) in formData.sizes.filter(s => s.installmentConfig.enabled)"
              :key="`installment-${index}`"
              class="p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-2 mb-2">
                <StatusBadge :label="size.size" color="gray" />
                <StatusBadge :label="size.color" color="gray" />
              </div>
              <InstallmentConfigReview :config="size.installmentConfig" compact />
            </div>
            <p v-if="!formData.sizes.some(s => s.installmentConfig.enabled)" class="text-gray-500 italic">
              No size-specific installments configured
            </p>
          </div>
        </ReviewCard>
      </div>

      <!-- Additional Information -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Tags & Attributes -->
        <ReviewCard
          title="Tags & Attributes"
          icon="heroicons:tag"
          icon-color="text-purple-500"
        >
          <div class="space-y-4">
            <div>
              <h5 class="text-sm font-medium text-gray-700 mb-2">Tags ({{ formData.tags.length }})</h5>
              <div v-if="formData.tags.length > 0" class="flex flex-wrap gap-1">
                <StatusBadge
                  v-for="tag in formData.tags"
                  :key="tag"
                  :label="tag"
                  color="purple"
                  size="sm"
                />
              </div>
              <p v-else class="text-gray-500 italic text-sm">No tags added</p>
            </div>
            
            <div v-if="Object.keys(formData.attributes).length > 0">
              <h5 class="text-sm font-medium text-gray-700 mb-2">Attributes</h5>
              <div class="space-y-1">
                <ReviewItem
                  v-for="(value, key) in formData.attributes"
                  :key="key"
                  :label="String(key)"
                  :value="String(value)"
                  compact
                />
              </div>
            </div>
          </div>
        </ReviewCard>

        <!-- Images - FIXED -->
         <!-- {{ formData?.images }} -->
        <ReviewCard
          title="Uploaded Images"
          icon="heroicons:photo"
          icon-color="text-orange-500"
          :count="validImageUrls.length"
        >
          <div v-if="validImageUrls.length > 0" class="space-y-3">
            <!-- Image Grid -->
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="(image, index) in validImageUrls.slice(0, 6)"
                :key="`review-image-${index}`"
                class="aspect-square overflow-hidden rounded border-2"
                :class="index === 0 ? 'border-orange-300' : 'border-gray-200'"
              >
                <img
                  :src="image"
                  :alt="`Image ${index + 1}`"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <div v-if="index === 0" class="absolute top-1 left-1 bg-orange-500 text-white text-xs px-1 rounded">
                  Main
                </div>
              </div>
              <div
                v-if="validImageUrls.length > 6"
                class="aspect-square flex items-center justify-center bg-gray-100 rounded border text-gray-500 text-xs"
              >
                +{{ validImageUrls.length - 6 }} more
              </div>
            </div>
            
            <!-- Image Details -->
            <div class="bg-gray-50 rounded-lg p-3">
              <h6 class="text-sm font-medium text-gray-700 mb-2">Image URLs:</h6>
              <div class="space-y-1 max-h-32 overflow-y-auto">
                <div
                  v-for="(url, index) in validImageUrls"
                  :key="`url-${index}`"
                  class="text-xs text-gray-600 truncate"
                >
                  {{ index + 1 }}. {{ url }}
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8">
            <Icon name="heroicons:photo" class="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p class="text-gray-500 italic">No images uploaded</p>
            <p class="text-xs text-gray-400 mt-1">Please upload images in the previous step</p>
          </div>
        </ReviewCard>
      </div>

      <!-- Detailed Content -->
      <ReviewCard
        title="Detailed Information"
        icon="heroicons:document-text"
        icon-color="text-indigo-500"
      >
        <div class="space-y-4">
          <ContentPreview
            v-if="formData.productInfo"
            title="Product Information"
            :content="formData.productInfo"
          />
          
          <ContentPreview
            v-if="formData.returnPolicy"
            title="Return Policy"
            :content="formData.returnPolicy"
          />
          
          <ContentPreview
            v-if="formData.shippingInfo"
            title="Shipping Information"
            :content="formData.shippingInfo"
          />
          
          <ReviewItem
            v-if="formData.promotionText"
            label="Promotional Text"
            :value="formData.promotionText"
          />
        </div>
      </ReviewCard>

      <!-- Validation Summary -->
      <ValidationSummary :form-data="formData" />

      <!-- Final Payload Preview -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 class="text-sm font-medium text-blue-800 mb-2">Final Payload Preview</h4>
        <div class="bg-white rounded border p-3 max-h-40 overflow-y-auto">
          <pre class="text-xs text-gray-700">{{ JSON.stringify(finalPayload, null, 2) }}</pre>
        </div>
      </div>
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

// Filter out base64 data URLs and only show actual uploaded URLs
const validImageUrls = computed(() => {
  return props.formData.images.filter(img => 
    img && 
    typeof img === 'string' && 
    !img.startsWith('data:') && 
    (img.startsWith('http') || img.startsWith('/'))
  )
})

// Create the final payload that will be sent to the backend
const finalPayload = computed(() => {
  return {
    ...props.formData,
    images: validImageUrls.value // Only include actual uploaded URLs
  }
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const stripHtml = (html: string) => {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder.svg'
}
</script>
