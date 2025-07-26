<template>
    <span 
      class="inline-flex items-center rounded-full font-medium"
      :class="[sizeClasses, colorClasses]"
    >
      {{ label }}
    </span>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  interface Props {
    label: string
    color: 'green' | 'blue' | 'yellow' | 'green' | 'gray' | 'red' | 'orange'
    size?: 'sm' | 'md'
  }
  
  const props = withDefaults(defineProps<Props>(), {
    size: 'md'
  })
  
  const sizeClasses = computed(() => {
    return props.size === 'sm' 
      ? 'px-2 py-0.5 text-xs'
      : 'px-2.5 py-1 text-sm'
  })
  
  const colorClasses = computed(() => {
    const colors = {
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      gray: 'bg-gray-100 text-gray-800',
      red: 'bg-red-100 text-red-800',
      orange: 'bg-orange-100 text-orange-800',
    }
    return colors[props.color]
  })
  </script>
  