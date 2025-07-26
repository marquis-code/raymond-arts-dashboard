<template>
  <div class="bg-white border-2 border-green-100 rounded-lg p-4 hover:border-green-200 transition-colors duration-200">
    <div class="flex items-center justify-between mb-4">
      <h4 class="font-medium text-gray-800">Size Variant {{ index + 1 }}</h4>
      <button
        type="button"
        class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors duration-200"
        @click="$emit('remove')"
      >
        <Icon name="heroicons:trash" class="h-4 w-4" />
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <FormField label="Size">
        <select
          :value="size.size"
          class="form-input"
          @change="updateField('size', $event.target.value)"
        >
          <option value="">Select size</option>
          <option value="small">Small</option>
          <option value="basic">Basic</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </FormField>

      <FormField label="Color">
        <select
          :value="size.color"
          class="form-input"
          @change="updateField('color', $event.target.value)"
        >
          <option value="black">Black</option>
          <option value="white">White</option>
        </select>
      </FormField>

      <FormField label="Price ($)">
        <div class="relative">
          <Icon name="heroicons:currency-dollar" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            :value="size.price"
            type="number"
            min="0"
            step="0.01"
            class="form-input pl-10"
            placeholder="0.00"
            @input="updateField('price', parseFloat($event.target.value) || 0)"
          />
        </div>
      </FormField>

      <div class="flex items-end">
        <div class="w-full">
          <label class="form-label">Installments</label>
          <div 
            class="px-3 py-2 rounded-md text-sm font-medium"
            :class="size.installmentConfig.enabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'"
          >
            {{ size.installmentConfig.enabled ? 'Enabled' : 'Disabled' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SizePrice } from '~/types/artwork'

interface Props {
  size: SizePrice
  index: number
}

interface Emits {
  (e: 'update:size', updates: Partial<SizePrice>): void
  (e: 'remove'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateField = (field: keyof SizePrice, value: any) => {
  console.log('SizeVariantCard: Updating field', field, 'with value', value)
  emit('update:size', { [field]: value })
}
</script>

<!-- <style scoped>
.form-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
</style> -->
