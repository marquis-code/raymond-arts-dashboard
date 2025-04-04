<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-violet-50 p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all hover:scale-105 duration-300">
        <div class="p-6 sm:p-8">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Artist Dashboard</h1>
            <p class="text-gray-600 mt-2">Sign in to manage your artwork</p>
          </div>
          
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div class="space-y-2">
              <label for="email" class="text-sm font-medium text-gray-700">Email</label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  id="email" 
                  v-model="email" 
                  type="email" 
                  required 
                  class="pl-10 w-full h-11 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div class="space-y-2">
              <!-- <div class="flex items-center justify-between">
                <label for="password" class="text-sm font-medium text-gray-700">Password</label>
                <a href="#" class="text-sm font-medium text-violet-600 hover:text-violet-500">Forgot password?</a>
              </div> -->
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  id="password" 
                  v-model="password" 
                  type="password" 
                  required 
                  class="pl-10 w-full h-11 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div class="flex items-center">
              <input 
                id="remember" 
                v-model="remember" 
                type="checkbox" 
                class="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-700">Remember me</label>
            </div>
            
            <button 
              type="submit" 
              class="w-full flex justify-center items-center h-11 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-colors"
              :class="{ 'opacity-70 cursor-not-allowed': isLoading }"
              :disabled="isLoading"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              {{ isLoading ? 'Signing in...' : 'Sign in' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const email = ref('')
const password = ref('')
const remember = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // For demo purposes, we'll just navigate to the dashboard
    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>