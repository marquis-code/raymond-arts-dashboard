<template>
    <div class="relative inline-block">
      <div
        @mouseenter="isVisible = true"
        @mouseleave="isVisible = false"
      >
        <slot></slot>
      </div>
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isVisible"
          ref="tooltipRef"
          class="absolute z-10 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm tooltip-fade-in"
          style="min-width: 120px; max-width: 280px;"
        >
          {{ text }}
          <div class="tooltip-arrow"></div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  defineProps({
    text: {
      type: String,
      required: true
    }
  })
  
  const isVisible = ref(false)
  const tooltipRef = ref<HTMLElement | null>(null)
  </script>
  
  <style scoped>
  .tooltip-fade-in {
    animation: tooltipFadeIn 0.2s ease-out;
  }
  
  .tooltip-arrow {
    @apply absolute w-0 h-0 border-4 border-transparent border-t-gray-900;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  @keyframes tooltipFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-5px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  </style>