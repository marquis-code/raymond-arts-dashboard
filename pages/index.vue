<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-violet-50 to-rose-50">
    <!-- Illustration Side -->
    <div class="w-full md:w-1/2 bg-violet-600 hidden lg:flex items-center justify-center p-8 overflow-hidden relative">
      <div class="absolute inset-0 bg-gradient-to-br from-violet-600 to-violet-800"></div>
      
      <!-- Animated Elements -->
      <div class="relative z-10 w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white mb-4 animate-fadeIn">Raymond Arts Admin</h1>
          <p class="text-violet-200 text-lg animate-fadeIn" style="animation-delay: 0.2s">
            Showcase your artwork to the world
          </p>
        </div>
        
        <!-- Animated Illustration -->
        <div class="relative h-64 md:h-80 animate-float">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div class="absolute top-0 right-1/4 w-40 h-40 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div class="absolute bottom-8 left-1/4 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          
          <!-- Artist Illustration -->
          <div class="relative z-10 flex items-center justify-center h-full">
            <div class="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-xl transform rotate-3 animate-card-float">
              <div class="h-32 bg-gradient-to-br from-pink-400 to-green-600 rounded-lg mb-4"></div>
              <div class="h-4 w-3/4 bg-white/30 rounded-full mb-2"></div>
              <div class="h-4 w-1/2 bg-white/30 rounded-full"></div>
            </div>
            <div class="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20 shadow-xl transform -rotate-6 animate-card-float animation-delay-1000">
              <div class="h-24 bg-gradient-to-br from-blue-400 to-teal-500 rounded-lg mb-3"></div>
              <div class="h-3 w-3/4 bg-white/30 rounded-full mb-2"></div>
              <div class="h-3 w-1/2 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div class="mt-12 flex justify-center space-x-4 animate-fadeIn" style="animation-delay: 0.4s">
          <div class="w-3 h-3 rounded-full bg-white/30"></div>
          <div class="w-3 h-3 rounded-full bg-white"></div>
          <div class="w-3 h-3 rounded-full bg-white/30"></div>
        </div>
      </div>
      
      <!-- Animated Background Elements -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 border border-white/20 rounded-full animate-spin-slow"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 border border-white/20 rounded-full animate-spin-slow animation-delay-2000"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-128 h-128 border border-white/10 rounded-full animate-spin-slow animation-delay-4000"></div>
      </div>
    </div>
    
    <!-- Form Side -->
    <div class="w-full pt-20 lg:pt-0 md:w-1/2 flex items-center justify-center p-4 md:p-8 animate-slideInRight">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl duration-300">
          <!-- Tabs -->
          <div class="flex border-b">
            <button 
              @click="activeTab = 'login'" 
              class="flex-1 py-4 text-center font-medium transition-colors duration-300"
              :class="activeTab === 'login' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-violet-600'"
            >
              Sign In
            </button>
            <button 
              @click="activeTab = 'signup'" 
              class="flex-1 py-4 text-center font-medium transition-colors duration-300"
              :class="activeTab === 'signup' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-violet-600'"
            >
              Sign Up
            </button>
          </div>
          
          <div class="p-6 sm:p-8">
            <!-- Login Form -->
            <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-6 animate-fadeIn">
              <div v-if="loginError" class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-shake">
                {{ loginError }}
              </div>
              
              <div class="space-y-2">
                <label for="email" class="text-sm font-medium text-gray-700">Email</label>
                <div class="relative group">
                  <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors duration-200" />
                  <input 
                    id="email" 
                    v-model="loginObj.email.value" 
                    type="email" 
                    required 
                    class="pl-10 w-full h-11 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                    placeholder="you@example.com"
                    :disabled="isLoginFormDisabled"
                  />
                </div>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label for="password" class="text-sm font-medium text-gray-700">Password</label>
                  <a href="#" class="text-sm font-medium text-violet-600 hover:text-violet-500 transition-colors duration-200">Forgot password?</a>
                </div>
                <div class="relative group">
                  <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors duration-200" />
                  <input 
                    id="password" 
                    v-model="loginObj.password.value" 
                    type="password" 
                    required 
                    class="pl-10 w-full h-11 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                    :disabled="isLoginFormDisabled"
                  />
                </div>
              </div>
              
              <div class="flex items-center">
                <input 
                  id="remember" 
                  v-model="rememberMe" 
                  type="checkbox" 
                  class="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 transition-colors duration-200"
                  :disabled="isLoginFormDisabled"
                />
                <label for="remember" class="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <!-- :disabled="isLoginFormDisabled" -->
              <!-- :class="{ 'opacity-70 cursor-not-allowed': isLoginFormDisabled }" -->
              <button 
                type="submit" 
                :disabled="processing"
                class="w-full flex justify-center disabled:cursor-not-allowed disabled:opacity-25 items-center h-11 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Loader2 v-if="processing" class="mr-2 h-4 w-4 animate-spin" />
                {{ processing ? 'Signing in...' : 'Sign in' }}
              </button>
            </form>
            
            <!-- Signup Form -->
            <form v-if="activeTab === 'signup'" @submit.prevent="handleSignup" class="space-y-5 animate-fadeIn">
              <div v-if="signupError" class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-shake">
                {{ signupError }}
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="firstName" class="text-sm font-medium text-gray-700">First Name</label>
                  <div class="relative group">
                    <User class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors duration-200" />
                    <input 
                      id="firstName" 
                      v-model="signupObj.firstName.value" 
                      type="text" 
                      required 
                      class="pl-10 w-full h-11 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                      placeholder="John"
                      :disabled="isSignupFormDisabled"
                    />
                  </div>
                </div>
                
                <div class="space-y-2">
                  <label for="lastName" class="text-sm font-medium text-gray-700">Last Name</label>
                  <div class="relative group">
                    <User class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors duration-200" />
                    <input 
                      id="lastName" 
                      v-model="signupObj.lastName.value" 
                      type="text" 
                      required 
                      class="pl-10 w-full h-11 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                      placeholder="Doe"
                      :disabled="isSignupFormDisabled"
                    />
                  </div>
                </div>
              </div>
              
              <div class="space-y-2">
                <label for="signupEmail" class="text-sm font-medium text-gray-700">Email</label>
                <div class="relative group">
                  <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors duration-200" />
                  <input 
                    id="signupEmail" 
                    v-model="signupObj.email.value" 
                    type="email" 
                    required 
                    class="pl-10 w-full h-11 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                    placeholder="you@example.com"
                    :disabled="isSignupFormDisabled"
                  />
                </div>
              </div>
              
              <div class="space-y-2">
                <label for="signupPassword" class="text-sm font-medium text-gray-700">Password</label>
                <div class="relative group">
                  <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors duration-200" />
                  <input 
                    id="signupPassword" 
                    v-model="signupObj.password.value" 
                    type="password" 
                    required 
                    class="pl-10 w-full h-11 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                    :disabled="isSignupFormDisabled"
                  />
                </div>
                <p class="text-xs text-gray-500">Password must be at least 8 characters long</p>
              </div>
              
              <div class="space-y-2">
                <label for="role" class="text-sm font-medium text-gray-700">Role</label>
                <div class="relative group">
                  <UserCog class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors duration-200" />
                  <select 
                    id="role" 
                    v-model="signupObj.role.value" 
                    required 
                    class="pl-10 w-full h-11 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 appearance-none"
                    :disabled="isSignupFormDisabled"
                  >
                    <option value="" disabled>Select your role</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="customer">Customer</option>
                  </select>
                  <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div class="flex items-center">
                <input 
                  id="terms" 
                  v-model="agreeToTerms" 
                  type="checkbox" 
                  required
                  class="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 transition-colors duration-200"
                  :disabled="isSignupFormDisabled"
                />
                <label for="terms" class="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="#" class="text-violet-600 hover:text-violet-500 transition-colors duration-200">Terms of Service</a> and <a href="#" class="text-violet-600 hover:text-violet-500 transition-colors duration-200">Privacy Policy</a>
                </label>
              </div>
              
              <button 
                type="submit" 
                class="w-full flex justify-center items-center h-11 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02]"
                :class="{ 'opacity-70 cursor-not-allowed': isSignupFormDisabled }"
                :disabled="isSignupFormDisabled"
              >
                <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                {{ loading ? 'Creating account...' : 'Create account' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Loader2, User, ChevronDown, UserCog } from 'lucide-vue-next'
import { use_auth_signup } from '@/composables/auth/register'
import { use_auth_login } from '@/composables/auth/login'

const router = useRouter()
const activeTab = ref('login')
const rememberMe = ref(false)
const agreeToTerms = ref(false)
const loginError = ref('')
const signupError = ref('')

// Get authentication composables
const { credential: signupObj, signup, loading
  // isFormDisabled: isSignupFormDisabled
 } = use_auth_signup()
const { credential: loginObj, login, loading: processing
  // isFormDisabled: isLoginFormDisabled
 } = use_auth_login()

// Handle login submission
const handleLogin = async () => {
  loginError.value = ''
  console.log(loginObj, 'login obj')
  
  try {
    // Call the login method from the composable
    await login({
      email: loginObj.email.value,
      password: loginObj.password.value,
      // remember: rememberMe.value
    })
    
    // If successful, redirect to dashboard
    // router.push('/dashboard')
  } catch (error: any) {
    // Handle login error
    loginError.value = error?.message || 'Login failed. Please try again.'
    console.error('Login failed:', error)
  }
}

// Handle signup submission
const handleSignup = async () => {
  signupError.value = ''
  
  if (!agreeToTerms.value) {
    signupError.value = 'You must agree to the Terms of Service and Privacy Policy'
    return
  }
  
  try {
    // Call the signup method from the composable
    await signup({
      firstName: signupObj.firstName.value,
      lastName: signupObj.lastName.value,
      email: signupObj.email.value,
      password: signupObj.password.value,
      role: signupObj.role.value
    })
    
    // After successful signup, switch to login tab
    activeTab.value = 'login'
    
    // Pre-fill login form with signup email
    loginObj.email = signupObj.email
    
    // Reset signup form and agreement
    signupObj.firstName = ''
    signupObj.lastName = ''
    signupObj.email = ''
    signupObj.password = ''
    signupObj.role = ''
    agreeToTerms.value = false
    
  } catch (error: any) {
    // Handle signup error
    signupError.value = error?.message || 'Signup failed. Please try again.'
    console.error('Signup failed:', error)
  }
}

// Reset errors when switching tabs
watch(activeTab, () => {
  loginError.value = ''
  signupError.value = ''
})
</script>

<style scoped>
/* Animation classes */
.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-slideInRight {
  animation: slideInRight 0.8s ease-out forwards;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-card-float {
  animation: cardFloat 5s ease-in-out infinite;
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-spin-slow {
  animation: spin 20s linear infinite;
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes cardFloat {
  0%, 100% {
    transform: translateY(0) rotate(3deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

@keyframes blob {
  0% {
    transform: scale(1) translate(0, 0);
  }
  33% {
    transform: scale(1.1) translate(30px, -50px);
  }
  66% {
    transform: scale(0.9) translate(-20px, 20px);
  }
  100% {
    transform: scale(1) translate(0, 0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

/* Custom width */
.w-128 {
  width: 32rem;
}

.h-128 {
  height: 32rem;
}
</style>