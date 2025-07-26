<template>
    <div class="space-y-8">
      <div class="flex items-center gap-2 mb-6">
        <Icon name="heroicons:paint-brush" class="h-6 w-6 text-green-500" />
        <h3 class="text-xl font-semibold text-gray-800">Detailed Information</h3>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column -->
        <div class="space-y-6">
          <!-- Tags Management -->
          <TagManager
            :tags="formData.tags"
            @add-tag="addTag"
            @remove-tag="removeTag"
          />
  
          <!-- Product Information -->
          <FormField
            label="Product Information"
            hint="Detailed information about materials, techniques, inspiration, and story"
          >
            <RichTextEditor
              :value="localData.productInfo"
              placeholder="Include details about materials, techniques, inspiration, dimensions, care instructions, and the story behind your artwork..."
              @update:value="localData.productInfo = $event"
            />
          </FormField>
  
          <!-- Promotional Text -->
          <FormField
            label="Promotional Text"
            hint="Optional promotional message or special offer"
          >
            <div class="relative">
              <input
                v-model="localData.promotionText"
                type="text"
                class="form-input pr-10"
                placeholder="e.g. Limited time offer: 20% off this week!"
              />
              <Icon 
                name="heroicons:megaphone" 
                class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" 
              />
            </div>
          </FormField>
        </div>
  
        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Return Policy -->
          <FormField
            label="Return & Refund Policy"
            hint="Your return and refund policy for this artwork"
          >
            <RichTextEditor
              :value="localData.returnPolicy"
              placeholder="Specify your return timeframe, conditions, process, and any exceptions for this artwork..."
              @update:value="localData.returnPolicy = $event"
            />
          </FormField>
  
          <!-- Shipping Information -->
          <FormField
            label="Shipping Information"
            hint="Shipping details and delivery information"
          >
            <RichTextEditor
              :value="localData.shippingInfo"
              placeholder="Include shipping costs, delivery times, packaging details, and any special shipping requirements..."
              @update:value="localData.shippingInfo = $event"
            />
          </FormField>
  
          <!-- Additional Attributes -->
          <AttributesEditor
            :attributes="localData.attributes"
            @update:attributes="localData.attributes = $event"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import type { ArtworkFormData } from '~/types/artwork'
  
  interface Props {
    formData: ArtworkFormData
  }
  
  interface Emits {
    (e: 'update:formData', data: Partial<ArtworkFormData>): void
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  
  const localData = ref({ ...props.formData })
  
  // Watch for external changes
  watch(() => props.formData, (newData) => {
    localData.value = { ...newData }
  }, { deep: true })
  
  // Emit changes
  watch(localData, (newData) => {
    emit('update:formData', newData)
  }, { deep: true })
  
  const addTag = (tag: string) => {
    if (tag.trim() && !localData.value.tags.includes(tag.trim())) {
      localData.value.tags = [...localData.value.tags, tag.trim()]
    }
  }
  
  const removeTag = (tagToRemove: string) => {
    localData.value.tags = localData.value.tags.filter(tag => tag !== tagToRemove)
  }
  </script>
  