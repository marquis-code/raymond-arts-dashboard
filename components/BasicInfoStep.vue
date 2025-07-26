<template>
    <div class="space-y-6">
      <div class="flex items-center gap-2 mb-6">
        <!-- <Icon name="heroicons:information-circle" class="h-6 w-6 text-blue-500" /> -->
        <h3 class="text-xl font-semibold text-gray-800">Basic Information</h3>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column -->
        <div class="space-y-6">
          <FormField
            label="Artwork Name"
            required
            :error="errors.name"
          >
            <input
              v-model="localData.name"
              type="text"
              class="form-input"
              placeholder="e.g. Sunset Horizon"
              @blur="validateField('name')"
            />
          </FormField>
  
          <FormField
            label="Category"
            required
            :error="errors.category"
          >
            <select
              v-model="localData.category"
              class="form-input"
              @change="validateField('category')"
            >
            <option disabled value="">Select a category</option>
            <option
                      v-for="category in categories"
                      :key="category._id"
                      :value="category._id"
                    >
                      {{ category.name }}
                    </option>
            </select>
          </FormField>
  
          <div class="grid grid-cols-2 gap-4">
            <FormField
              label="Base Price ($)"
              required
              :error="errors.price"
            >
              <div class="relative">
                <Icon name="heroicons:currency-dollar" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  v-model.number="localData.price"
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-input pl-10"
                  placeholder="0.00"
                  @blur="validateField('price')"
                />
              </div>
            </FormField>
  
            <FormField
              label="Discount Price ($)"
              :error="errors.discountPrice"
            >
              <div class="relative">
                <Icon name="heroicons:currency-dollar" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  v-model.number="localData.discountPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-input pl-10"
                  placeholder="0.00"
                />
              </div>
            </FormField>
          </div>
  
          <DimensionsInput
            :width="localData.width"
            :height="localData.height"
            :length="localData.length"
            :weight="localData.weight"
            @update:width="localData.width = $event"
            @update:height="localData.height = $event"
            @update:length="localData.length = $event"
            @update:weight="localData.weight = $event"
          />
        </div>
  
        <!-- Right Column -->
        <div class="space-y-6">
          <FormField
            label="Description"
            required
            :error="errors.description"
          >
            <textarea
              v-model="localData.description"
              rows="6"
              class="form-input resize-none"
              placeholder="Describe your artwork in detail..."
              @blur="validateField('description')"
            />
          </FormField>
  
          <ArtworkStatusToggles
            :is-available="localData.isAvailable"
            :is-featured="localData.isFeatured"
            :is-new="localData.isNew"
            :is-bestseller="localData.isBestseller"
            @update:is-available="localData.isAvailable = $event"
            @update:is-featured="localData.isFeatured = $event"
            @update:is-new="localData.isNew = $event"
            @update:is-bestseller="localData.isBestseller = $event"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import type { ArtworkFormData } from '~/types/artwork'
  // import Icon from '~/components/Icon.vue'
  import FormField from '~/components/FormField.vue'
  import DimensionsInput from '~/components/DimensionsInput.vue'
  import { useFetchCategories } from "@/composables/modules/category/useFetchCategories";
  import ArtworkStatusToggles from '~/components/ArtworkStatusToggles.vue'

  const { categories } = useFetchCategories();
  
  interface Props {
    formData: ArtworkFormData
  }
  
  interface Emits {
    (e: 'update:formData', data: Partial<ArtworkFormData>): void
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  
  const localData = ref({ ...props.formData })
  const errors = ref<Record<string, string>>({})
  
  // Watch for external changes
  watch(() => props.formData, (newData) => {
    localData.value = { ...newData }
  }, { deep: true })
  
  // Emit changes
  watch(localData, (newData) => {
    emit('update:formData', newData)
  }, { deep: true })
  
  const validateField = (field: string) => {
    errors.value[field] = ''
    
    switch (field) {
      case 'name':
        if (!localData.value.name?.trim()) {
          errors.value.name = 'Artwork name is required'
        }
        break
      case 'description':
        if (!localData.value.description?.trim()) {
          errors.value.description = 'Description is required'
        }
        break
      case 'category':
        if (!localData.value.category) {
          errors.value.category = 'Category is required'
        }
        break
      case 'price':
        if (!localData.value.price || localData.value.price <= 0) {
          errors.value.price = 'Valid price is required'
        }
        break
    }
  }
  </script>
  