<template>
  <div class="space-y-6">
    <div class="flex items-center gap-2 mb-6">
      <Icon name="heroicons:scale" class="h-6 w-6 text-green-500" />
      <h3 class="text-xl font-semibold text-gray-800">Size & Pricing Configuration</h3>
    </div>

    <div class="space-y-4">
      <!-- Debug Info -->
      <!-- <div class="bg-blue-50 p-3 rounded-lg text-sm">
        <p><strong>Debug:</strong> Current sizes count: {{ sizes.length }}</p>
        <p v-if="sizes.length === 0" class="text-gray-600">No size variants added yet</p>
      </div> -->

      <!-- Size Variants -->
      <div v-if="sizes.length > 0" class="space-y-4">
        <SizeVariantCard
          v-for="(size, index) in sizes"
          :key="`size-${index}-${size.size}-${size.color}`"
          :size="size"
          :index="index"
          @update:size="handleUpdateSize(index, $event)"
          @remove="handleRemoveSize(index)"
        />
      </div>

      <!-- Add Button -->
      <button
        type="button"
        class="w-full py-4 px-6 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:border-green-400 hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
        @click="handleAddSize"
      >
        <Icon name="heroicons:plus" class="h-5 w-5" />
        Add Size Variant
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SizePrice } from '~/types/artwork'

interface Props {
  sizes: SizePrice[]
}

interface Emits {
  (e: 'addSize'): void
  (e: 'updateSize', index: number, size: Partial<SizePrice>): void
  (e: 'removeSize', index: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleAddSize = () => {
  console.log('SizePricingStep: Add size button clicked')
  emit('addSize')
}

const handleUpdateSize = (index: number, updates: Partial<SizePrice>) => {
  console.log('SizePricingStep: Updating size at index', index, 'with', updates)
  emit('updateSize', index, updates)
}

const handleRemoveSize = (index: number) => {
  console.log('SizePricingStep: Removing size at index', index)
  emit('removeSize', index)
}
</script>
