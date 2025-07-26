<template>
    <FormField
      label="Additional Attributes"
      hint="JSON format for additional artwork details like materials, techniques, etc."
      :error="jsonError"
    >
      <div class="space-y-3">
        <!-- JSON Input -->
        <textarea
          v-model="attributesInput"
          rows="4"
          class="form-input font-mono text-sm"
          :class="{ 'border-red-300': jsonError }"
          placeholder='{"material": "Canvas", "style": "Abstract", "technique": "Oil"}'
          @input="validateAndUpdate"
        />
  
        <!-- JSON Preview -->
        <div v-if="isValidJSON && attributesInput" class="bg-gray-50 rounded-md border border-gray-200 p-3">
          <h5 class="text-sm font-medium text-gray-700 mb-2">Preview:</h5>
          <div class="space-y-1">
            <div
              v-for="(value, key) in parsedAttributes"
              :key="key"
              class="flex items-center text-sm"
            >
              <span class="font-medium text-gray-700 min-w-[80px]">{{ key }}:</span>
              <span class="ml-2 text-gray-600">{{ value }}</span>
            </div>
          </div>
        </div>
  
        <!-- Quick Add Buttons -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="preset in presetAttributes"
            :key="preset.key"
            type="button"
            class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors duration-200"
            @click="addPresetAttribute(preset)"
          >
            + {{ preset.label }}
          </button>
        </div>
      </div>
    </FormField>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  
  interface Props {
    attributes: Record<string, any>
  }
  
  interface Emits {
    (e: 'update:attributes', attributes: Record<string, any>): void
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  
  const attributesInput = ref('')
  const jsonError = ref('')
  
  const presetAttributes = [
    { key: 'material', label: 'Material', value: 'Canvas' },
    { key: 'technique', label: 'Technique', value: 'Oil Painting' },
    { key: 'style', label: 'Style', value: 'Abstract' },
    { key: 'year', label: 'Year', value: new Date().getFullYear() },
    { key: 'frame', label: 'Frame', value: 'Included' },
  ]
  
  const isValidJSON = computed(() => {
    if (!attributesInput.value.trim()) return true
    try {
      JSON.parse(attributesInput.value)
      return true
    } catch {
      return false
    }
  })
  
  const parsedAttributes = computed(() => {
    if (!attributesInput.value.trim() || !isValidJSON.value) return {}
    try {
      return JSON.parse(attributesInput.value)
    } catch {
      return {}
    }
  })
  
  // Initialize with existing attributes
  watch(() => props.attributes, (newAttributes) => {
    if (Object.keys(newAttributes).length > 0) {
      attributesInput.value = JSON.stringify(newAttributes, null, 2)
    }
  }, { immediate: true })
  
  const validateAndUpdate = () => {
    jsonError.value = ''
    
    if (!attributesInput.value.trim()) {
      emit('update:attributes', {})
      return
    }
  
    try {
      const parsed = JSON.parse(attributesInput.value)
      emit('update:attributes', parsed)
    } catch (error) {
      jsonError.value = 'Invalid JSON format'
    }
  }
  
  const addPresetAttribute = (preset: typeof presetAttributes[0]) => {
    try {
      const current = attributesInput.value.trim() ? JSON.parse(attributesInput.value) : {}
      current[preset.key] = preset.value
      attributesInput.value = JSON.stringify(current, null, 2)
      validateAndUpdate()
    } catch {
      // If current JSON is invalid, start fresh
      const newAttributes = { [preset.key]: preset.value }
      attributesInput.value = JSON.stringify(newAttributes, null, 2)
      validateAndUpdate()
    }
  }
  </script>
  