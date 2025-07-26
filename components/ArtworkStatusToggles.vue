<template>
    <FormField
      label="Artwork Status"
      hint="Special status flags for your artwork"
    >
      <div class="grid grid-cols-2 gap-4">
        <ToggleSwitch
          :checked="isAvailable"
          label="Available"
          @update:checked="$emit('update:isAvailable', $event)"
        />
        
        <ToggleSwitch
          :checked="isFeatured"
          label="Featured"
          @update:checked="$emit('update:isFeatured', $event)"
        />
        
        <ToggleSwitch
          :checked="isNew"
          label="New"
          @update:checked="$emit('update:isNew', $event)"
        />
        
        <ToggleSwitch
          :checked="isBestseller"
          label="Bestseller"
          @update:checked="$emit('update:isBestseller', $event)"
        />
      </div>
    </FormField>
  </template>
  
  <script setup lang="ts">
  interface Props {
    isAvailable: boolean
    isFeatured: boolean
    isNew: boolean
    isBestseller: boolean
  }
  
  interface Emits {
    (e: 'update:isAvailable', value: boolean): void
    (e: 'update:isFeatured', value: boolean): void
    (e: 'update:isNew', value: boolean): void
    (e: 'update:isBestseller', value: boolean): void
  }
  
  defineProps<Props>()
  defineEmits<Emits>()
  </script>
  