<template>
    <div class="relative">
      <div class="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 min-h-[48px]">
        <TransitionGroup name="tag" tag="div" class="flex flex-wrap gap-2">
          <span
            v-for="(tag, index) in modelValue"
            :key="`tag-${index}`"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
          >
            {{ tag }}
            <button
              type="button"
              @click="removeTag(index)"
              class="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        </TransitionGroup>
        
        <input
          v-model="inputValue"
          type="text"
          :placeholder="placeholder"
          @keydown.enter.prevent="addTag"
          @keydown.comma.prevent="addTag"
          @keydown.tab="addTag"
          @keydown.backspace="handleBackspace"
          class="flex-1 min-w-[120px] outline-none bg-transparent"
        />
      </div>
      
      <p class="text-xs text-gray-500 mt-1">
        Press Enter, Tab, or comma to add tags
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  interface Props {
    modelValue: string[]
    placeholder?: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Add tag...'
  })
  
  const emit = defineEmits<{
    'update:modelValue': [value: string[]]
  }>()
  
  const inputValue = ref('')
  
  const addTag = () => {
    const tag = inputValue.value.trim()
    if (tag && !props.modelValue.includes(tag)) {
      emit('update:modelValue', [...props.modelValue, tag])
      inputValue.value = ''
    }
  }
  
  const removeTag = (index: number) => {
    const newTags = [...props.modelValue]
    newTags.splice(index, 1)
    emit('update:modelValue', newTags)
  }
  
  const handleBackspace = () => {
    if (inputValue.value === '' && props.modelValue.length > 0) {
      removeTag(props.modelValue.length - 1)
    }
  }
  </script>
  
  <style scoped>
  .tag-enter-active,
  .tag-leave-active {
    transition: all 0.2s ease;
  }
  
  .tag-enter-from,
  .tag-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }
  </style>
  