<template>
    <div class="relative" ref="selectRef">
      <div
        @click="toggleDropdown"
        :class="selectClasses"
        role="button"
        tabindex="0"
        @keydown.enter.prevent="toggleDropdown"
        @keydown.space.prevent="toggleDropdown"
        @keydown.escape="closeDropdown"
        @focus="handleFocus"
        @blur="handleBlur"
      >
        <span v-if="selectedOption" class="block truncate">{{ selectedOption.label }}</span>
        <Icon 
          name="lucide:chevron-down" 
          :class="['w-4 h-4 transition-transform duration-200', isOpen ? 'rotate-180' : '']"
        />
      </div>
      
      <!-- Animated Placeholder -->
      <span
        :class="placeholderClasses"
        @click="toggleDropdown"
      >
        {{ placeholder }}
        <span v-if="required" class="text-red-500 ml-1">*</span>
      </span>
  
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <div
          v-if="isOpen"
          class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          <div
            v-for="option in options"
            :key="option.value"
            @click="selectOption(option)"
            :class="[
              'px-3 sm:px-4 py-2 sm:py-3 cursor-pointer transition-colors duration-150 text-sm sm:text-base',
              'hover:bg-blue-50 hover:text-blue-600',
              selectedOption?.value === option.value ? 'bg-blue-100 text-blue-600' : 'text-gray-900'
            ]"
          >
            {{ option.label }}
          </div>
          <div v-if="options.length === 0" class="px-3 sm:px-4 py-2 sm:py-3 text-gray-500 text-sm sm:text-base">
            No options available
          </div>
        </div>
      </transition>
  
      <div v-if="error" class="mt-1 text-red-500 text-xs sm:text-sm flex items-center">
        <Icon name="lucide:alert-circle" class="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
        {{ error }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted } from 'vue'
  import Icon from '@/components/Icon.vue'
  
  interface Option {
    value: string | number
    label: string
  }
  
  interface Props {
    modelValue: string | number | null
    placeholder: string
    options: Option[]
    required?: boolean
    disabled?: boolean
    error?: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    required: false,
    disabled: false
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const selectRef = ref<HTMLElement>()
  const isOpen = ref(false)
  const isFocused = ref(false)
  
  const selectedOption = computed(() => {
    return props.options.find(option => option.value === props.modelValue) || null
  })
  
  const hasValue = computed(() => {
    return props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined
  })
  
  const isFloating = computed(() => {
    return isFocused.value || hasValue.value || isOpen.value
  })
  
  const handleFocus = () => {
    isFocused.value = true
  }
  
  const handleBlur = () => {
    // Delay blur to allow for dropdown interaction
    setTimeout(() => {
      if (!isOpen.value) {
        isFocused.value = false
      }
    }, 150)
  }
  
  const selectClasses = computed(() => [
    'w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg transition-all duration-200 text-sm sm:text-base bg-white cursor-pointer',
    'focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none',
    'flex items-center justify-between',
    props.error 
      ? 'border-red-500 bg-red-50' 
      : 'border-gray-300 hover:border-gray-400 focus:border-blue-500',
    props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''
  ])
  
  const placeholderClasses = computed(() => [
    'absolute transition-all duration-300 ease-in-out pointer-events-none select-none',
    'transform origin-left left-3 sm:left-4',
    isFloating.value
      ? [
          'top-0 -translate-y-1/2 text-xs text-blue-600 font-medium',
          'bg-white px-1 z-10'
        ]
      : [
          'top-1/2 -translate-y-1/2 text-sm sm:text-base text-gray-500',
          'bg-transparent'
        ],
    props.disabled ? 'text-gray-400' : ''
  ])
  
  const toggleDropdown = () => {
    if (!props.disabled) {
      isOpen.value = !isOpen.value
      if (isOpen.value) {
        isFocused.value = true
      }
    }
  }
  
  const closeDropdown = () => {
    isOpen.value = false
    isFocused.value = false
  }
  
  const selectOption = (option: Option) => {
    emit('update:modelValue', option.value)
    closeDropdown()
  }
  
  const handleClickOutside = (event: Event) => {
    if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
      closeDropdown()
    }
  }
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  </script>
  