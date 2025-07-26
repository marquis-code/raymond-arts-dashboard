<template>
    <FormField
      label="Base Dimensions & Weight"
      hint="Default physical measurements (can be overridden per size)"
    >
      <div class="grid grid-cols-4 gap-3">
        <div class="relative">
          <input
            :value="width"
            type="number"
            min="0"
            step="0.1"
            class="form-input pr-12"
            placeholder="0"
            @input="$emit('update:width', parseFloat($event.target.value) || 0)"
          />
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
            W (cm)
          </span>
        </div>
        
        <div class="relative">
          <input
            :value="height"
            type="number"
            min="0"
            step="0.1"
            class="form-input pr-12"
            placeholder="0"
            @input="$emit('update:height', parseFloat($event.target.value) || 0)"
          />
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
            H (cm)
          </span>
        </div>
        
        <div class="relative">
          <input
            :value="length"
            type="number"
            min="0"
            step="0.1"
            class="form-input pr-12"
            placeholder="0"
            @input="$emit('update:length', parseFloat($event.target.value) || 0)"
          />
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
            L (cm)
          </span>
        </div>
        
        <div class="relative">
          <input
            :value="weight"
            type="number"
            min="0"
            step="0.1"
            class="form-input pr-8"
            placeholder="0"
            @input="$emit('update:weight', parseFloat($event.target.value) || 0)"
          />
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
            kg
          </span>
        </div>
      </div>
    </FormField>
  </template>
  
  <script setup lang="ts">
  interface Props {
    width: number
    height: number
    length: number
    weight: number
  }
  
  interface Emits {
    (e: 'update:width', value: number): void
    (e: 'update:height', value: number): void
    (e: 'update:length', value: number): void
    (e: 'update:weight', value: number): void
  }
  
  defineProps<Props>()
  defineEmits<Emits>()
  </script>
  