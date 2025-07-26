<template>
    <FormField
      label="Tags"
      hint="Keywords that help customers find your artwork"
    >
      <div class="space-y-3">
        <!-- Tag Input -->
        <div class="flex gap-2">
          <div class="relative flex-1">
            <input
              v-model="tagInput"
              type="text"
              class="form-input pr-10"
              placeholder="Add a tag..."
              @keypress.enter.prevent="handleAddTag"
              @keydown.comma.prevent="handleAddTag"
            />
            <Icon 
              name="heroicons:tag" 
              class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" 
            />
          </div>
          <button
            type="button"
            class="btn-outline px-3"
            @click="handleAddTag"
          >
            <Icon name="heroicons:plus" class="h-4 w-4" />
          </button>
        </div>
  
        <!-- Tags Display -->
        <div v-if="tags.length > 0" class="flex flex-wrap gap-2">
          <TagBadge
            v-for="(tag, index) in tags"
            :key="`tag-${index}`"
            :tag="tag"
            @remove="$emit('removeTag', tag)"
          />
        </div>
  
        <p v-else class="text-sm text-gray-500 italic">
          No tags added yet. Press Enter or comma to add tags.
        </p>
      </div>
    </FormField>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  interface Props {
    tags: string[]
  }
  
  interface Emits {
    (e: 'addTag', tag: string): void
    (e: 'removeTag', tag: string): void
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  
  const tagInput = ref('')
  
  const handleAddTag = () => {
    const tag = tagInput.value.trim()
    if (tag && !props.tags.includes(tag)) {
      emit('addTag', tag)
      tagInput.value = ''
    }
  }
  </script>
  