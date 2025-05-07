<template>
  <main>
    <!-- Artistic Splash Screen -->
    <div 
      v-if="showSplash" 
      class="fixed inset-0 flex items-center justify-center z-[9999999] overflow-hidden"
      :class="{'opacity-0 pointer-events-none': splashTransitioning}"
      style="transition: opacity 0.8s ease-in-out;"
    >
      <!-- Artistic Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 opacity-90">
        <!-- Animated Particles -->
        <div v-for="i in 20" :key="i" 
          class="absolute rounded-full mix-blend-screen animate-float"
          :style="{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 10 + 5}s`,
            animationDelay: `${Math.random() * 5}s`
          }"
        ></div>
      </div>

      <!-- Artistic Canvas Elements -->
      <div class="relative z-10 w-full max-w-2xl px-6">
        <!-- Animated SVG Art Elements -->
        <svg class="w-full h-64 animate-svg-reveal" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
          <!-- Abstract Art Elements -->
          <circle cx="100" cy="100" r="50" class="animate-fill-color" fill="none" stroke="white" stroke-width="2" />
          <rect x="200" y="50" width="100" height="100" rx="10" class="animate-fill-color" fill="none" stroke="white" stroke-width="2" />
          <path d="M50,150 C100,50 150,150 200,50 S250,150 300,50" class="animate-draw" stroke="white" stroke-width="2" fill="none" />
          <path d="M50,50 L100,100 L150,50 L200,100 L250,50 L300,100" class="animate-draw" stroke="white" stroke-width="2" fill="none" />
          <circle cx="200" cy="100" r="80" class="animate-pulse-ring" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1" />
          <circle cx="200" cy="100" r="60" class="animate-pulse-ring" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1" style="animation-delay: 0.5s" />
          <circle cx="200" cy="100" r="40" class="animate-pulse-ring" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1" style="animation-delay: 1s" />
        </svg>

        <!-- Animated Text -->
        <div class="text-center mt-8">
          <h1 class="text-4xl md:text-5xl font-bold text-white opacity-0 animate-fade-up">
            <span class="inline-block" style="animation-delay: 0.1s">A</span>
            <span class="inline-block" style="animation-delay: 0.2s">r</span>
            <span class="inline-block" style="animation-delay: 0.3s">t</span>
            <span class="inline-block" style="animation-delay: 0.4s">i</span>
            <span class="inline-block" style="animation-delay: 0.5s">s</span>
            <span class="inline-block" style="animation-delay: 0.6s">t</span>
            <span class="inline-block" style="animation-delay: 0.7s">r</span>
            <span class="inline-block" style="animation-delay: 0.8s">y</span>
          </h1>
          <p class="text-xl text-white mt-4 opacity-0 animate-fade-up" style="animation-delay: 1s">
            Unleash your creative potential
          </p>
          
          <!-- Loading Indicator -->
          <div class="mt-8 flex justify-center">
            <div class="flex space-x-2">
              <div v-for="i in 3" :key="i" 
                class="w-3 h-3 rounded-full bg-white opacity-0 animate-loading-dot"
                :style="{ animationDelay: `${(i-1) * 0.2}s` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="!showSplash">
      <CoreToast class="fixed top-4 right-4 z-[999999]" />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </main>
</template>

<style lang="css">
@tailwind base;
@tailwind components;
@tailwind utilities;

#app {
  @apply min-h-screen font-sans;
}

/* Splash Screen Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

@keyframes fillColor {
  0% {
    fill: transparent;
    stroke-dashoffset: 1000;
    stroke-dasharray: 1000;
  }
  70% {
    fill: transparent;
    stroke-dashoffset: 0;
    stroke-dasharray: 1000;
  }
  100% {
    fill: rgba(255, 255, 255, 0.2);
    stroke-dashoffset: 0;
    stroke-dasharray: 1000;
  }
}

@keyframes draw {
  0% {
    stroke-dashoffset: 1000;
    stroke-dasharray: 1000;
  }
  100% {
    stroke-dashoffset: 0;
    stroke-dasharray: 1000;
  }
}

@keyframes pulseRing {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes svgReveal {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes loadingDot {
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-float {
  animation: float 10s ease-in-out infinite;
}

.animate-fill-color {
  animation: fillColor 3s forwards;
}

.animate-draw {
  animation: draw 3s forwards;
}

.animate-pulse-ring {
  animation: pulseRing 3s infinite;
}

.animate-fade-up {
  animation: fadeUp 0.8s forwards;
}

.animate-svg-reveal {
  animation: svgReveal 1.5s forwards;
}

.animate-loading-dot {
  animation: loadingDot 1.5s infinite;
}
</style>

<script setup lang="ts">
import { useUser } from '@/composables/auth/user'
import { provide, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'nuxt/app';
import { useCustomToast } from '@/composables/core/useCustomToast';
const { user, logOut, token, isLoggedIn } = useUser()

import { visible, toastData } from '@/composables/core/useCustomToast';

// Provide toast state globally
provide('toastVisible', visible);
provide('toastData', toastData);

const showSplash = ref(true);
const splashTransitioning = ref(false);
const router = useRouter();
const route = useRoute();

const hideSplash = () => {
  showSplash.value = false;
};

onMounted(() => {
  // Show splash screen for a slightly longer duration to appreciate the animations
  setTimeout(() => {
    splashTransitioning.value = true; // Start the transition out
  }, 2500); // Adjust display duration for the splash screen

  // Complete splash transition and route redirection
  setTimeout(() => {
    hideSplash();
  }, 3300); // 800ms after transition starts, hide splash and redirect
});
</script>