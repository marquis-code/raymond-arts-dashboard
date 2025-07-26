<template>
  <div class="bg-white rounded-lg shadow-sm border p-4 overflow-hidden">
    <!-- Desktop/Tablet View -->
    <div class="hidden sm:block">
      <div class="flex items-center justify-between relative">
        <!-- Progress Background Line -->
        <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2 z-0"></div>
        
        <!-- Animated Progress Line -->
        <div 
          class="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-green-500 to-green-500 transform -translate-y-1/2 z-10 transition-all duration-700 ease-out"
          :style="{ width: getProgressWidth() }"
        ></div>
        
        <div 
          v-for="(step, index) in steps" 
          :key="step.id"
          class="flex flex-col items-center relative z-20 group"
          :style="{ flex: '1 1 0%' }"
        >
          <!-- Step Circle -->
          <div
            class="flex items-center justify-center w-12 h-12 rounded-full border-3 transition-all duration-500 ease-out transform group-hover:scale-110 relative overflow-hidden"
            :class="getStepClasses(step.id)"
          >
            <!-- Ripple Effect -->
            <div 
              v-if="currentStep === step.id"
              class="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30"
            ></div>
            
            <!-- Icon with transition -->
            <transition 
              name="icon-fade" 
              mode="out-in"
              appear
            >
              <Icon 
                :key="getStepIcon(step.id)"
                :name="getStepIcon(step.id)" 
                class="h-6 w-6 relative z-10 transition-transform duration-300"
                :class="currentStep === step.id ? 'animate-pulse' : ''"
              />
            </transition>
          </div>
          
          <!-- Step Title -->
          <div class="mt-3 text-center max-w-24">
            <p 
              class="text-xs font-semibold transition-all duration-300 leading-tight break-words"
              :class="getStepTextClasses(step.id)"
            >
              {{ step.title }}
            </p>
            
            <!-- Active Step Indicator -->
            <div 
              v-if="currentStep === step.id"
              class="mt-1 h-0.5 bg-green-500 rounded-full animate-pulse"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile View -->
    <div class="sm:hidden">
      <!-- Current Step Display -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <div
            class="flex items-center justify-center w-10 h-10 rounded-full border-2 relative overflow-hidden"
            :class="getStepClasses(currentStep)"
          >
            <!-- Mobile Ripple Effect -->
            <div 
              class="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30"
            ></div>
            
            <Icon 
              :name="getStepIcon(currentStep)" 
              class="h-5 w-5 relative z-10" 
            />
          </div>
          
          <div>
            <p class="text-sm font-semibold text-green-600">
              {{ getCurrentStepTitle() }}
            </p>
            <p class="text-xs text-gray-500">
              Step {{ currentStep }} of {{ steps.length }}
            </p>
          </div>
        </div>
        
        <!-- Mobile Progress Circle -->
        <div class="relative w-12 h-12">
          <svg class="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
            <!-- Background circle -->
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              stroke-width="2"
            />
            <!-- Progress circle -->
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#8b5cf6"
              stroke-width="2"
              stroke-linecap="round"
              :stroke-dasharray="`${getMobileProgress()}, 100`"
              class="transition-all duration-700 ease-out"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-xs font-bold text-green-600">
              {{ Math.round(getMobileProgress()) }}%
            </span>
          </div>
        </div>
      </div>
      
      <!-- Mobile Progress Bar -->
      <div class="relative">
        <div class="flex justify-between mb-2">
          <span class="text-xs text-gray-500">Progress</span>
          <span class="text-xs text-gray-500">{{ currentStep }}/{{ steps.length }}</span>
        </div>
        
        <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-green-500 to-green-500 rounded-full transition-all duration-700 ease-out relative"
            :style="{ width: getProgressWidth() }"
          >
            <!-- Shimmer effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
      
      <!-- Mobile Steps Navigation -->
      <div class="mt-4 flex justify-center space-x-2 overflow-x-auto pb-2">
        <button
          v-for="(step, index) in steps"
          :key="step.id"
          class="flex-shrink-0 w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center"
          :class="getMobileStepClasses(step.id)"
          @click="$emit('stepClick', step.id)"
        >
          <span class="text-xs font-bold">{{ index + 1 }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Step {
  id: number
  title: string
  icon: string
}

interface Props {
  currentStep: number
  steps: Step[]
}

interface Emits {
  (e: 'stepClick', stepId: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const getStepClasses = (stepId: number) => {
  const isActive = props.currentStep === stepId
  const isCompleted = props.currentStep > stepId
  
  if (isActive) {
    return 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30'
  } else if (isCompleted) {
    return 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30'
  } else {
    return 'border-gray-300 text-gray-400 bg-white hover:border-gray-400 hover:shadow-md'
  }
}

const getMobileStepClasses = (stepId: number) => {
  const isActive = props.currentStep === stepId
  const isCompleted = props.currentStep > stepId
  
  if (isActive) {
    return 'bg-green-500 border-green-500 text-white transform scale-110'
  } else if (isCompleted) {
    return 'bg-green-500 border-green-500 text-white'
  } else {
    return 'border-gray-300 text-gray-400 bg-white'
  }
}

const getStepTextClasses = (stepId: number) => {
  const isActive = props.currentStep === stepId
  const isCompleted = props.currentStep > stepId
  
  if (isActive) {
    return 'text-green-600 font-bold transform scale-105'
  } else if (isCompleted) {
    return 'text-green-600 font-semibold'
  } else {
    return 'text-gray-500'
  }
}

const getStepIcon = (stepId: number) => {
  const isCompleted = props.currentStep > stepId
  if (isCompleted) {
    return 'heroicons:check-circle-20-solid'
  }
  
  const step = props.steps.find(s => s.id === stepId)
  return step?.icon || 'heroicons:question-mark-circle'
}

const getCurrentStepTitle = () => {
  const step = props.steps.find(s => s.id === props.currentStep)
  return step?.title || ''
}

const getProgressWidth = () => {
  if (props.steps.length <= 1) return '0%'
  const progress = ((props.currentStep - 1) / (props.steps.length - 1)) * 100
  return `${Math.max(0, Math.min(100, progress))}%`
}

const getMobileProgress = () => {
  if (props.steps.length <= 1) return 0
  return ((props.currentStep - 1) / (props.steps.length - 1)) * 100
}
</script>

<style scoped>
/* Icon transition animations */
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 0.3s ease-out;
}

.icon-fade-enter-from {
  opacity: 0;
  transform: scale(0.8) rotate(90deg);
}

.icon-fade-leave-to {
  opacity: 0;
  transform: scale(0.8) rotate(-90deg);
}

/* Shimmer animation for progress bar */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Border width utility */
.border-3 {
  border-width: 3px;
}

/* Custom scrollbar for mobile navigation */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>