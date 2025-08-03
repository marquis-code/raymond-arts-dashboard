<template>
    <div class="relative">
      <!-- Animated Placeholder -->
      <span
        :class="placeholderClasses"
        @click="focusInput"
      >
        {{ placeholder }}
        <span v-if="required" class="text-red-500 ml-1">*</span>
      </span>
      
      <input
        :id="inputId"
        v-model="localValue"
        :type="type"
        :step="step"
        :min="min"
        :max="max"
        :disabled="disabled"
        :class="inputClasses"
        @focus="handleFocus"
        @blur="handleBlur"
        v-bind="$attrs"
      />
      
      <!-- Prefix -->
      <div v-if="prefix" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10">
        {{ prefix }}
      </div>
      
      <!-- Error Message -->
      <div v-if="error" class="mt-1 text-red-500 text-xs sm:text-sm flex items-center">
        <Icon name="lucide:alert-circle" class="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
        {{ error }}
      </div>
      
      <!-- Hint -->
      <div v-if="hint && !error" class="mt-1 text-gray-500 text-xs sm:text-sm">
        {{ hint }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref, useId, nextTick } from 'vue'
  import Icon from '@/components/Icon.vue'
  
  interface Props {
    modelValue: string | number
    placeholder: string
    type?: string
    step?: string
    min?: string | number
    max?: string | number
    required?: boolean
    disabled?: boolean
    error?: string
    hint?: string
    prefix?: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    required: false,
    disabled: false
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const inputId = useId()
  const isFocused = ref(false)
  const inputRef = ref<HTMLInputElement>()
  
  const localValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const hasValue = computed(() => {
    return localValue.value !== '' && localValue.value !== null && localValue.value !== undefined
  })
  
  const isFloating = computed(() => {
    return isFocused.value || hasValue.value
  })
  
  const handleFocus = () => {
    isFocused.value = true
  }
  
  const handleBlur = () => {
    isFocused.value = false
  }
  
  const focusInput = async () => {
    await nextTick()
    const input = document.getElementById(inputId) as HTMLInputElement
    if (input && !props.disabled) {
      input.focus()
    }
  }
  
  const inputClasses = computed(() => [
    'w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg transition-all duration-200 text-sm sm:text-base bg-white',
    'focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none',
    props.prefix ? 'pl-8' : '',
    props.error 
      ? 'border-red-500 bg-red-50' 
      : 'border-gray-300 hover:border-gray-400 focus:border-blue-500',
    props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''
  ])
  
  const placeholderClasses = computed(() => [
    'absolute transition-all duration-300 ease-in-out pointer-events-none select-none',
    'transform origin-left',
    props.prefix && !isFloating.value ? 'left-8' : 'left-3 sm:left-4',
    isFloating.value 
      ? [
          'top-0 -translate-y-1/2 text-xs text-blue-600 font-medium',
          'bg-white px-1 z-10',
          props.prefix ? 'left-3 sm:left-4' : 'left-3 sm:left-4'
        ]
      : [
          'top-1/2 -translate-y-1/2 text-sm sm:text-base text-gray-500',
          'bg-transparent'
        ],
    props.disabled ? 'text-gray-400' : ''
  ])
  </script>
  