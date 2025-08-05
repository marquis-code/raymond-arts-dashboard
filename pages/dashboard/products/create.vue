<template>
    <div class="min-h-screen">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
         <!-- {{product}} -->
          <!-- {{isEditMode}} -->
        <div class="text-start mb-6 sm:mb-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            {{ isEditMode ? 'Edit Product' : 'Create New Product' }}
          </h1>
          <p class="text-sm sm:text-base text-gray-600">
            {{ isEditMode ? 'Update your product details' : 'Build your product step by step with our intuitive form' }}
          </p>
        </div>
  
        <!-- Loading State for Edit Mode -->
        <div v-if="isEditMode && loadingProduct" class="flex items-center justify-center py-12">
          <div class="text-center">
            <Icon name="lucide:loader-2" class="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p class="text-gray-600">Loading product details...</p>
          </div>
        </div>
  
        <!-- Error State -->
        <div v-else-if="isEditMode && productError" class="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div class="flex items-center">
            <Icon name="lucide:alert-circle" class="w-5 h-5 text-red-600 mr-3" />
            <div>
              <h3 class="text-red-800 font-medium">Error Loading Product</h3>
              <p class="text-red-600 text-sm mt-1">{{ productError }}</p>
            </div>
          </div>
        </div>
  
        <!-- Form Content -->
        <div v-else>
          <!-- Enhanced Mobile-Responsive Progress Bar -->
          <div class="mb-6 sm:mb-8">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <!-- Mobile Step Counter -->
              <div class="flex items-center justify-between mb-4 sm:hidden">
                <span class="text-sm font-medium text-gray-600">Step {{ currentStep + 1 }} of {{ steps.length }}</span>
                <span class="text-sm text-gray-500">{{ Math.round(((currentStep + 1) / steps.length) * 100) }}% Complete</span>
              </div>
              
              <!-- Progress Bar -->
              <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                  :style="{ width: `${((currentStep + 1) / steps.length) * 100}%` }"
                />
              </div>
  
              <!-- Mobile Horizontal Scrollable Steps -->
              <div class="sm:hidden">
                <div class="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                  <div 
                    v-for="(step, index) in steps" 
                    :key="index"
                    class="flex items-center flex-shrink-0"
                  >
                    <div class="flex items-center">
                      <div 
                        class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 relative"
                        :class="getStepClasses(index)"
                      >
                        <Icon 
                          v-if="index < currentStep" 
                          name="lucide:check" 
                          class="w-4 h-4" 
                        />
                        <span v-else>{{ index + 1 }}</span>
                        
                        <!-- Pulse animation for current step -->
                        <div 
                          v-if="index === currentStep"
                          class="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-25"
                        />
                      </div>
                      <span 
                        class="ml-2 text-xs font-medium transition-colors duration-300 whitespace-nowrap"
                        :class="index <= currentStep ? 'text-blue-600' : 'text-gray-500'"
                      >
                        {{ step.title }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Desktop Step Indicators -->
              <div class="hidden sm:flex items-center justify-between">
                <div 
                  v-for="(step, index) in steps" 
                  :key="index"
                  class="flex items-center"
                  :class="{ 'flex-1': index < steps.length - 1 }"
                >
                  <div class="flex items-center">
                    <div 
                      class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300 relative"
                      :class="getStepClasses(index)"
                    >
                      <Icon 
                        v-if="index < currentStep" 
                        name="lucide:check" 
                        class="w-4 h-4 sm:w-5 sm:h-5" 
                      />
                      <span v-else>{{ index + 1 }}</span>
                      
                      <!-- Pulse animation for current step -->
                      <div 
                        v-if="index === currentStep"
                        class="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-25"
                      />
                    </div>
                    <span 
                      class="ml-2 sm:ml-3 text-xs sm:text-sm font-medium transition-colors duration-300 hidden md:block"
                      :class="index <= currentStep ? 'text-blue-600' : 'text-gray-500'"
                    >
                      {{ step.title }}
                    </span>
                  </div>
                  <div 
                    v-if="index < steps.length - 1"
                    class="flex-1 h-0.5 mx-2 sm:mx-4 transition-colors duration-300"
                    :class="index < currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'"
                  />
                </div>
              </div>
  
              <!-- Mobile Current Step Title -->
              <div class="sm:hidden text-center mt-4">
                <h2 class="text-lg font-semibold text-gray-900">{{ steps[currentStep].title }}</h2>
              </div>
            </div>
          </div>
  
          <!-- Form Container -->
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <form @submit.prevent="handleSubmit">
              <!-- Step Content -->
              <div class="p-4 sm:p-6 lg:p-8">
                <transition 
                  name="slide" 
                  mode="out-in"
                >
                  <!-- Step 1: Basic Information -->
                  <div v-if="currentStep === 0" key="step-0" class="space-y-6 sm:space-y-8">
                    <div class="text-center mb-6 sm:mb-8 hidden sm:block">
                      <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                      <p class="text-sm sm:text-base text-gray-600">Let's start with the essential details of your product</p>
                    </div>
  
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                      <!-- Left Column -->
                      <div class="space-y-4 sm:space-y-6">
                        <!-- Product Name -->
                        <CustomInput
                          v-model="formData.name"
                          placeholder="Product Name"
                          :required="true"
                          :error="errors.name"
                        />
  
                        <!-- Category -->
                        <CustomSelect
                          v-model="formData.category"
                          placeholder="Category"
                          :required="true"
                          :options="categoryOptions"
                          :error="errors.category"
                        />
  
                        <!-- Tags -->
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Tags
                          </label>
                          <div class="space-y-3">
                            <div class="flex gap-2">
                              <CustomInput
                                v-model="newTag"
                                placeholder="Add tags (press Enter)"
                                @keydown.enter.prevent="addTag"
                                class="flex-1"
                              />
                              <button
                                @click="addTag"
                                type="button"
                                class="px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                              >
                                <Icon name="lucide:plus" class="w-4 h-4" />
                              </button>
                            </div>
                            <div v-if="formData.tags.length > 0" class="flex flex-wrap gap-2">
                              <span
                                v-for="(tag, index) in formData.tags"
                                :key="index"
                                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800 border border-blue-200"
                              >
                                {{ tag }}
                                <button
                                  @click="removeTag(index)"
                                  class="ml-1.5 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                >
                                  <Icon name="lucide:x" class="w-3 h-3" />
                                </button>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
  
                      <!-- Right Column -->
                      <div class="space-y-4 sm:space-y-6">
                        <!-- Description -->
                        <CustomTextarea
                          v-model="formData.description"
                          placeholder="Description"
                          :required="true"
                          :rows="6"
                          :error="errors.description"
                          :max-length="500"
                        />
  
                        <!-- Product Flags -->
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Product Status
                          </label>
                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                              <input
                                v-model="formData.isAvailable"
                                type="checkbox"
                                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span class="ml-3 text-sm text-gray-700">Available for purchase</span>
                            </label>
                            <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                              <input
                                v-model="formData.isFeatured"
                                type="checkbox"
                                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span class="ml-3 text-sm text-gray-700">Featured product</span>
                            </label>
                            <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                              <input
                                v-model="formData.isNew"
                                type="checkbox"
                                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span class="ml-3 text-sm text-gray-700">New arrival</span>
                            </label>
                            <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                              <input
                                v-model="formData.isBestseller"
                                type="checkbox"
                                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span class="ml-3 text-sm text-gray-700">Bestseller</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Step 2: Pricing & Discounts -->
                  <div v-else-if="currentStep === 1" key="step-1" class="space-y-6 sm:space-y-8">
                    <div class="text-center mb-6 sm:mb-8 hidden sm:block">
                      <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Pricing & Discounts</h2>
                      <p class="text-sm sm:text-base text-gray-600">Set your product pricing and discount strategies</p>
                    </div>
  
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                      <!-- Left Column -->
                      <div class="space-y-4 sm:space-y-6">
                        <!-- Base Price -->
                        <CustomInput
                          v-model="formData.price"
                          placeholder="Base Price"
                          type="number"
                          step="0.01"
                          min="0"
                          :required="true"
                          :error="errors.price"
                          prefix="$"
                        />
  
                        <!-- Discount Price -->
                        <CustomInput
                          v-model="formData.discountPrice"
                          placeholder="Discount Price"
                          type="number"
                          step="0.01"
                          min="0"
                          :error="errors.discountPrice"
                          prefix="$"
                          :hint="formData.discountPrice > 0 && !errors.discountPrice ? `Customers save ${discountPercentage}%` : undefined"
                        />
  
                        <!-- Promotion Text -->
                        <CustomInput
                          v-model="formData.promotionText"
                          placeholder="Promotion Text (e.g., Limited Time Offer!)"
                          hint="Optional promotional message"
                        />
                      </div>
  
                      <!-- Right Column -->
                      <div class="space-y-4 sm:space-y-6">
                        <!-- Price Preview Card -->
                        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Icon name="lucide:calculator" class="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                            Price Preview
                          </h3>
                          
                          <div class="space-y-3">
                            <div class="flex justify-between items-center">
                              <span class="text-gray-600 text-sm sm:text-base">Base Price:</span>
                              <span class="font-medium text-sm sm:text-base">${{ formData.price.toFixed(2) }}</span>
                            </div>
                            
                            <div v-if="formData.discountPrice > 0" class="flex justify-between items-center">
                              <span class="text-gray-600 text-sm sm:text-base">Discount Price:</span>
                              <span class="font-medium text-green-600 text-sm:text-base">${{ formData.discountPrice.toFixed(2) }}</span>
                            </div>
                            
                            <div v-if="formData.discountPrice > 0" class="flex justify-between items-center">
                              <span class="text-gray-600 text-sm sm:text-base">You Save:</span>
                              <span class="font-medium text-green-600 text-sm:text-base">
                                ${{ (formData.price - formData.discountPrice).toFixed(2) }} ({{ discountPercentage }}%)
                              </span>
                            </div>
                            
                            <hr class="border-blue-200">
                            
                            <div class="flex justify-between items-center text-base sm:text-lg font-bold">
                              <span>Final Price:</span>
                              <span class="text-blue-600">
                                ${{ (formData.discountPrice > 0 ? formData.discountPrice : formData.price).toFixed(2) }}
                              </span>
                            </div>
                          </div>
                          
                          <div v-if="formData.promotionText" class="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-200">
                            <p class="text-yellow-800 text-xs sm:text-sm font-medium flex items-center">
                              <Icon name="lucide:megaphone" class="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                              {{ formData.promotionText }}
                            </p>
                          </div>
                        </div>
  
                        <!-- Pricing Tips -->
                        <div class="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <Icon name="lucide:lightbulb" class="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500" />
                            Pricing Tips
                          </h3>
                          <ul class="space-y-2 text-xs sm:text-sm text-gray-600">
                            <li class="flex items-start">
                              <Icon name="lucide:check-circle" class="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              Research competitor pricing before setting your price
                            </li>
                            <li class="flex items-start">
                              <Icon name="lucide:check-circle" class="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              Consider your target profit margin
                            </li>
                            <li class="flex items-start">
                              <Icon name="lucide:check-circle" class="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              Use psychological pricing (e.g., $9.99 vs $10.00)
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Step 3: Images & Media -->
                  <div v-else-if="currentStep === 2" key="step-2" class="space-y-6 sm:space-y-8">
                    <div class="text-center mb-6 sm:mb-8 hidden sm:block">
                      <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Images & Media</h2>
                      <p class="text-sm sm:text-base text-gray-600">Upload high-quality images to showcase your product</p>
                    </div>
  
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                      <!-- Left Column - Upload Area -->
                      <div class="space-y-4 sm:space-y-6">
                        <!-- Single Image Upload -->
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Main Product Image *
                          </label>
                          <div
                            @drop="handleSingleDrop"
                            @dragover.prevent
                            @dragenter.prevent="isDraggingSingle = true"
                            @dragleave.prevent="isDraggingSingle = false"
                            class="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer"
                            :class="{ 'border-blue-400 bg-blue-50': isDraggingSingle }"
                            @click="triggerSingleUpload"
                          >
                            <div v-if="!mainImage">
                              <Icon name="lucide:upload-cloud" class="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                              <p class="text-gray-600 mb-2 text-sm sm:text-base">Drop your main image here, or click to browse</p>
                              <div class="flex items-center justify-center">
                                <span
                                  class="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-xs sm:text-sm font-medium inline-flex items-center"
                                >
                                  <Icon v-if="uploadingSingle" name="lucide:loader-2" class="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                                  {{ uploadingSingle ? 'Uploading...' : 'Browse Files' }}
                                </span>
                              </div>
                              <p class="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                            </div>
                            
                            <div v-else class="relative">
                              <img :src="mainImage" alt="Main product image" class="w-full h-32 sm:h-48 object-cover rounded-lg" />
                              <button
                                @click.stop="removeMainImage"
                                class="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg"
                              >
                                <Icon name="lucide:x" class="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </div>
                          <input
                            ref="singleFileInput"
                            type="file"
                            accept="image/*"
                            @change="handleSingleFileSelect"
                            class="hidden"
                          />
                        </div>
  
                        <!-- Multiple Images Upload -->
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Additional Images
                          </label>
                          <div
                            @drop="handleBatchDrop"
                            @dragover.prevent
                            @dragenter.prevent="isDraggingBatch = true"
                            @dragleave.prevent="isDraggingBatch = false"
                            class="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer"
                            :class="{ 'border-blue-400 bg-blue-50': isDraggingBatch }"
                            @click="triggerBatchUpload"
                          >
                            <Icon name="lucide:images" class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-3" />
                            <p class="text-gray-600 mb-2 text-sm">Drop multiple images here, or click to browse</p>
                            <span
                              class="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-xs sm:text-sm font-medium inline-flex items-center"
                            >
                              <Icon v-if="uploadingBatch" name="lucide:loader-2" class="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                              {{ uploadingBatch ? 'Uploading...' : 'Browse Files' }}
                            </span>
                            <p class="text-xs text-gray-500 mt-2">Select multiple files</p>
                          </div>
                          <input
                            ref="batchFileInput"
                            type="file"
                            accept="image/*"
                            multiple
                            @change="handleBatchFileSelect"
                            class="hidden"
                          />
                        </div>
                      </div>
  
                      <!-- Right Column - Image Gallery -->
                      <div class="space-y-4 sm:space-y-6">
                        <DraggableImageGallery
                          :images="formData.images"
                          @update:images="updateImages"
                          @remove-image="removeImage"
                        />
  
                        <!-- Image Guidelines -->
                        <div class="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                          <h3 class="text-base sm:text-lg font-semibold text-blue-900 mb-3 flex items-center">
                            <Icon name="lucide:camera" class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Image Guidelines
                          </h3>
                          <ul class="space-y-2 text-xs sm:text-sm text-blue-800">
                            <li class="flex items-start">
                              <Icon name="lucide:check" class="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                              Use high-resolution images (at least 1000x1000px)
                            </li>
                            <li class="flex items-start">
                              <Icon name="lucide:check" class="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                              Show product from multiple angles
                            </li>
                            <li class="flex items-start">
                              <Icon name="lucide:check" class="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                              Use good lighting and clean backgrounds
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Step 4: Product Details -->
                  <div v-else-if="currentStep === 3" key="step-3" class="space-y-6 sm:space-y-8">
                    <div class="text-center mb-6 sm:mb-8 hidden sm:block">
                      <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Product Details</h2>
                      <p class="text-sm sm:text-base text-gray-600">Add detailed specifications and dimensions</p>
                    </div>
  
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                      <!-- Left Column -->
                      <div class="space-y-4 sm:space-y-6">
                        <!-- Dimensions -->
                        <div>
                          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Icon name="lucide:ruler" class="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
                            Dimensions
                          </h3>
                          <div class="grid grid-cols-2 gap-3 sm:gap-4">
                            <CustomInput
                              v-model="formData.weight"
                              placeholder="Weight (kg)"
                              type="number"
                              step="0.01"
                              min="0"
                            />
                            <CustomInput
                              v-model="formData.width"
                              placeholder="Width (cm)"
                              type="number"
                              step="0.1"
                              min="0"
                            />
                            <CustomInput
                              v-model="formData.height"
                              placeholder="Height (cm)"
                              type="number"
                              step="0.1"
                              min="0"
                            />
                            <CustomInput
                              v-model="formData.length"
                              placeholder="Length (cm)"
                              type="number"
                              step="0.1"
                              min="0"
                            />
                          </div>
                        </div>
  
                        <!-- Custom Attributes -->
                        <div>
                          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Icon name="lucide:tag" class="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                            Custom Attributes
                          </h3>
                          <div class="space-y-4">
                            <div class="flex gap-2 sm:gap-3">
                              <CustomInput
                                v-model="newAttribute.key"
                                placeholder="Attribute name"
                                class="flex-1"
                              />
                              <CustomInput
                                v-model="newAttribute.value"
                                placeholder="Attribute value"
                                class="flex-1"
                              />
                              <button
                                @click="addAttribute"
                                type="button"
                                class="px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                              >
                                <Icon name="lucide:plus" class="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div v-if="Object.keys(formData.attributes).length > 0" class="space-y-2">
                              <div
                                v-for="(value, key) in formData.attributes"
                                :key="key"
                                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div class="flex-1">
                                  <span class="font-medium text-gray-900 text-sm sm:text-base">{{ key }}:</span>
                                  <span class="text-gray-600 ml-2 text-sm sm:text-base">{{ value }}</span>
                                </div>
                                <button
                                  @click="removeAttribute(key)"
                                  class="text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
                                >
                                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
  
                      <!-- Right Column -->
                      <div class="space-y-4 sm:space-y-6">
                        <!-- Dimension Preview -->
                        <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-200">
                          <h3 class="text-base sm:text-lg font-semibold text-purple-900 mb-4 flex items-center">
                            <Icon name="lucide:package" class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Package Preview
                          </h3>
                          
                          <div class="space-y-3">
                            <div class="flex justify-between items-center">
                              <span class="text-purple-700 text-sm sm:text-base">Weight:</span>
                              <span class="font-medium text-sm sm:text-base">{{ formData.weight || 0 }} kg</span>
                            </div>
                            <div class="flex justify-between items-center">
                              <span class="text-purple-700 text-sm sm:text-base">Dimensions:</span>
                              <span class="font-medium text-sm sm:text-base">
                                {{ formData.width || 0 }} × {{ formData.height || 0 }} × {{ formData.length || 0 }} cm
                              </span>
                            </div>
                            <div class="flex justify-between items-center">
                              <span class="text-purple-700 text-sm sm:text-base">Volume:</span>
                              <span class="font-medium text-sm sm:text-base">{{ calculateVolume() }} cm³</span>
                            </div>
                          </div>
                          
                          <!-- Visual representation -->
                          <div class="mt-4 p-4 bg-white rounded-lg border border-purple-200">
                            <div class="text-center text-xs sm:text-sm text-purple-600 mb-2">Package Visualization</div>
                            <div 
                              class="mx-auto bg-purple-200 rounded border-2 border-purple-300 flex items-center justify-center text-purple-700 text-xs font-medium"
                              :style="getBoxStyle()"
                            >
                              {{ formData.width || 0 }}×{{ formData.height || 0 }}×{{ formData.length || 0 }}
                            </div>
                          </div>
                        </div>
  
                        <!-- Shipping Estimate -->
                        <div class="bg-green-50 rounded-xl p-4 sm:p-6 border border-green-200">
                          <h3 class="text-base sm:text-lg font-semibold text-green-900 mb-3 flex items-center">
                            <Icon name="lucide:truck" class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Shipping Estimate
                          </h3>
                          <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                              <span class="text-green-700">Shipping Class:</span>
                              <span class="font-medium">{{ getShippingClass() }}</span>
                            </div>
                            <div class="flex justify-between">
                              <span class="text-green-700">Est. Shipping Cost:</span>
                              <span class="font-medium">${{ getEstimatedShippingCost() }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Step 5: Sizes & Installments -->
                  <div v-else-if="currentStep === 4" key="step-4" class="space-y-6 sm:space-y-8">
                    <div class="text-center mb-6 sm:mb-8 hidden sm:block">
                      <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Sizes & Installments</h2>
                      <p class="text-sm sm:text-base text-gray-600">Configure product sizes and payment options</p>
                    </div>
  
                    <div class="space-y-6 sm:space-y-8">
                      <!-- Global Installment Configuration -->
                      <div class="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                        <h3 class="text-base sm:text-lg font-semibold text-blue-900 mb-4 flex items-center">
                          <Icon name="lucide:credit-card" class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Global Installment Settings
                        </h3>
                        
                        <div class="space-y-4">
                          <label class="flex items-center p-3 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer">
                            <input
                              v-model="formData.installmentConfig.enabled"
                              type="checkbox"
                              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span class="ml-3 text-sm text-blue-800 font-medium">Enable installment payments</span>
                          </label>
                          
                          <div v-if="formData.installmentConfig.enabled" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <CustomInput
                              v-model="formData.installmentConfig.maxInstallments"
                              placeholder="Max Installments"
                              type="number"
                              min="2"
                              max="24"
                            />
                            <CustomInput
                              v-model="formData.installmentConfig.interestRate"
                              placeholder="Interest Rate (%)"
                              type="number"
                              step="0.1"
                              min="0"
                              max="100"
                            />
                            <CustomInput
                              v-model="formData.installmentConfig.minimumAmount"
                              placeholder="Minimum Amount"
                              type="number"
                              step="0.01"
                              min="0"
                              prefix="$"
                            />
                            <CustomInput
                              v-model="formData.installmentConfig.minimumDownPaymentPercentage"
                              placeholder="Min Down Payment (%)"
                              type="number"
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>
                      </div>
  
                      <!-- Size Configuration -->
                      <div>
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                          <h3 class="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                            <Icon name="lucide:ruler" class="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
                            Product Sizes
                          </h3>
                          <button
                            @click="addSize"
                            type="button"
                            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center text-sm font-medium"
                          >
                            <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
                            Add Size
                          </button>
                        </div>
  
                        <div v-if="formData.sizes.length === 0" class="text-center py-8 sm:py-12 bg-gray-50 rounded-xl border border-gray-200">
                          <Icon name="lucide:ruler" class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                          <p class="text-gray-500 text-sm sm:text-base">No sizes configured</p>
                          <p class="text-xs sm:text-sm text-gray-400">Add sizes to enable size-specific pricing</p>
                        </div>
  
                        <div v-else class="space-y-4 sm:space-y-6">
                          <div
                            v-for="(size, index) in formData.sizes"
                            :key="index"
                            class="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm"
                          >
                            <div class="flex justify-between items-start mb-4">
                              <h4 class="text-base sm:text-lg font-medium text-gray-900">Size Configuration #{{ index + 1 }}</h4>
                              <button
                                @click="removeSize(index)"
                                class="text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
                              >
                                <Icon name="lucide:trash-2" class="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </div>
  
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                              <CustomSelect
                                v-model="size.size"
                                placeholder="Size"
                                :options="sizeOptions"
                              />
                              <CustomInput
                                v-model="size.price"
                                placeholder="Price"
                                type="number"
                                step="0.01"
                                min="0"
                                prefix="$"
                              />
                              <CustomSelect
                                v-model="size.color"
                                placeholder="Color"
                                :options="colorOptions"
                              />
                            </div>
  
                            <!-- Size-specific installment configuration -->
                            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <label class="flex items-center mb-4 cursor-pointer">
                                <input
                                  v-model="size.installmentConfig.enabled"
                                  type="checkbox"
                                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span class="ml-3 text-sm font-medium text-gray-700">Enable size-specific installments</span>
                              </label>
                              
                              <div v-if="size.installmentConfig.enabled" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <CustomInput
                                  v-model="size.installmentConfig.maxInstallments"
                                  placeholder="Max Installments"
                                  type="number"
                                  min="2"
                                  max="24"
                                />
                                <CustomInput
                                  v-model="size.installmentConfig.interestRate"
                                  placeholder="Interest Rate (%)"
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="100"
                                />
                              </div>
                            </div>
  
                            <!-- Installment Preview for this size -->
                            <div v-if="size.installmentConfig.enabled && size.price > 0" class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                              <h5 class="text-sm font-medium text-green-900 mb-2 flex items-center">
                                <Icon name="lucide:calculator" class="w-4 h-4 mr-2" />
                                Installment Preview
                              </h5>
                              <div class="text-sm text-green-800 space-y-1">
                                <p>Monthly payment: ${{ calculateMonthlyPayment(size.price, size.installmentConfig.maxInstallments, size.installmentConfig.interestRate).toFixed(2) }}</p>
                                <p>Total with interest: ${{ calculateTotalWithInterest(size.price, size.installmentConfig.maxInstallments, size.installmentConfig.interestRate).toFixed(2) }}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Step 6: Additional Information -->
                  <div v-else-if="currentStep === 5" key="step-5" class="space-y-6 sm:space-y-8">
                    <div class="text-center mb-6 sm:mb-8 hidden sm:block">
                      <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
                      <p class="text-sm sm:text-base text-gray-600">Provide detailed information about your product</p>
                    </div>
  
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                      <!-- Left Column -->
                      <div class="space-y-4 sm:space-y-6">
                        <!-- Product Information -->
                        <CustomTextarea
                          v-model="formData.productInfo"
                          placeholder="Product Information"
                          :rows="6"
                          :max-length="1000"
                        />
  
                        <!-- Return Policy -->
                        <CustomTextarea
                          v-model="formData.returnPolicy"
                          placeholder="Return Policy"
                          :rows="4"
                          :max-length="500"
                        />
  
                        <!-- Shipping Information -->
                        <CustomTextarea
                          v-model="formData.shippingInfo"
                          placeholder="Shipping Information"
                          :rows="4"
                          :max-length="500"
                        />
                      </div>
  
                      <!-- Right Column -->
                      <div class="space-y-4 sm:space-y-6">
                        <!-- Quick Templates -->
                        <div class="bg-purple-50 rounded-xl p-4 sm:p-6 border border-purple-200">
                          <h3 class="text-base sm:text-lg font-semibold text-purple-900 mb-4 flex items-center">
                            <Icon name="lucide:file-text" class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Quick Templates
                          </h3>
                          
                          <div class="space-y-3">
                            <button
                              @click="applyTemplate('productInfo')"
                              type="button"
                              class="w-full text-left p-3 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors duration-200"
                            >
                              <div class="font-medium text-purple-900 text-sm">Product Info Template</div>
                              <div class="text-xs text-purple-600">Standard product information format</div>
                            </button>
                            
                            <button
                              @click="applyTemplate('returnPolicy')"
                              type="button"
                              class="w-full text-left p-3 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors duration-200"
                            >
                              <div class="font-medium text-purple-900 text-sm">Return Policy Template</div>
                              <div class="text-xs text-purple-600">30-day return policy template</div>
                            </button>
                            
                            <button
                              @click="applyTemplate('shippingInfo')"
                              type="button"
                              class="w-full text-left p-3 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors duration-200"
                            >
                              <div class="font-medium text-purple-900 text-sm">Shipping Info Template</div>
                              <div class="text-xs text-purple-600">Standard shipping information</div>
                            </button>
                          </div>
                        </div>
  
                        <!-- Writing Tips -->
                        <div class="bg-yellow-50 rounded-xl p-4 sm:p-6 border border-yellow-200">
                          <h3 class="text-base sm:text-lg font-semibold text-yellow-900 mb-3 flex items-center">
                            <Icon name="lucide:lightbulb" class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Writing Tips
                          </h3>
                          <ul class="space-y-2 text-xs sm:text-sm text-yellow-800">
                            <li class="flex items-start">
                              <Icon name="lucide:check" class="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                              Be clear and concise in your descriptions
                            </li>
                            <li class="flex items-start">
                              <Icon name="lucide:check" class="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                              Use bullet points for easy reading
                            </li>
                            <li class="flex items-start">
                              <Icon name="lucide:check" class="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                              Include care instructions if applicable
                            </li>
                            <li class="flex items-start">
                              <Icon name="lucide:check" class="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                              Mention any warranties or guarantees
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Step 7: Review & Submit -->
                  <div v-else-if="currentStep === 6" key="step-6" class="space-y-6 sm:space-y-8">
                    <div class="text-center mb-6 sm:mb-8 hidden sm:block">
                      <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
                      <p class="text-sm sm:text-base text-gray-600">Review all product details before {{ isEditMode ? 'updating' : 'creating' }} your product</p>
                    </div>
  
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                      <!-- Left Column - Product Preview -->
                      <div class="space-y-4 sm:space-y-6">
                        <!-- Product Card Preview -->
                        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                          <div class="aspect-square bg-gray-100 relative">
                            <img
                              v-if="formData.images[0]"
                              :src="formData.images[0]"
                              :alt="formData.name"
                              class="w-full h-full object-cover"
                            />
                            <div v-else class="flex items-center justify-center h-full">
                              <Icon name="lucide:image" class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300" />
                            </div>
                            
                            <!-- Product Badges -->
                            <div class="absolute top-3 left-3 space-y-2">
                              <span v-if="formData.isNew" class="inline-block px-2 py-1 bg-green-500 text-white text-xs font-medium rounded shadow-sm">
                                NEW
                              </span>
                              <span v-if="formData.isFeatured" class="inline-block px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded shadow-sm">
                                FEATURED
                              </span>
                              <span v-if="formData.isBestseller" class="inline-block px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded shadow-sm">
                                BESTSELLER
                              </span>
                            </div>
                            
                            <!-- Discount Badge -->
                            <div v-if="formData.discountPrice > 0" class="absolute top-3 right-3">
                              <span class="inline-block px-2 py-1 bg-red-500 text-white text-xs font-medium rounded shadow-sm">
                                -{{ discountPercentage }}%
                              </span>
                            </div>
                          </div>
                          
                          <div class="p-4">
                            <h3 class="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{{ formData.name || 'Product Name' }}</h3>
                            <p class="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">{{ formData.description || 'Product description' }}</p>
                            
                            <div class="flex items-center justify-between">
                              <div class="flex items-center space-x-2">
                                <span v-if="formData.discountPrice > 0" class="text-base sm:text-lg font-bold text-green-600">
                                  ${{ formData.discountPrice.toFixed(2) }}
                                </span>
                                <span 
                                  class="font-bold"
                                  :class="formData.discountPrice > 0 ? 'text-xs sm:text-sm text-gray-500 line-through' : 'text-base sm:text-lg text-gray-900'"
                                >
                                  ${{ formData.price.toFixed(2) }}
                                </span>
                              </div>
                              
                              <div class="flex items-center space-x-1">
                                <Icon name="lucide:star" class="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                                <span class="text-xs sm:text-sm text-gray-600">0.0 (0)</span>
                              </div>
                            </div>
                            
                            <div v-if="formData.promotionText" class="mt-3 p-2 bg-yellow-100 rounded text-yellow-800 text-xs">
                              {{ formData.promotionText }}
                            </div>
                          </div>
                        </div>
  
                        <!-- Image Gallery Preview -->
                        <div v-if="formData.images.length > 1">
                          <h4 class="font-medium text-gray-900 mb-3 text-sm sm:text-base">Additional Images ({{ formData.images.length - 1 }})</h4>
                          <div class="grid grid-cols-3 gap-2">
                            <img
                              v-for="(image, index) in formData.images.slice(1, 4)"
                              :key="index"
                              :src="image"
                              :alt="`Product image ${index + 2}`"
                              class="aspect-square object-cover rounded-lg border border-gray-200"
                            />
                            <div v-if="formData.images.length > 4" class="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                              <span class="text-gray-500 text-xs sm:text-sm">+{{ formData.images.length - 4 }} more</span>
                            </div>
                          </div>
                        </div>
                      </div>
  
                      <!-- Right Column - Details Summary -->
                      <div class="space-y-4 sm:space-y-6">
                        <!-- Basic Information -->
                        <div class="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                          <h4 class="font-semibold text-gray-900 mb-4 text-sm sm:text-base flex items-center">
                            <Icon name="lucide:info" class="w-4 h-4 mr-2 text-blue-600" />
                            Basic Information
                          </h4>
                          <div class="space-y-3 text-xs sm:text-sm">
                            <div class="flex justify-between">
                              <span class="text-gray-600">Name:</span>
                              <span class="font-medium">{{ formData.name || 'Not set' }}</span>
                            </div>
                            <div class="flex justify-between">
                              <span class="text-gray-600">Category:</span>
                              <span class="font-medium">{{ getCategoryName() || 'Not selected' }}</span>
                            </div>
                            <div class="flex justify-between">
                              <span class="text-gray-600">Tags:</span>
                              <span class="font-medium">{{ formData.tags.length }} tags</span>
                            </div>
                            <div class="flex justify-between">
                              <span class="text-gray-600">Status:</span>
                              <span class="font-medium" :class="formData.isAvailable ? 'text-green-600' : 'text-red-600'">
                                {{ formData.isAvailable ? 'Available' : 'Unavailable' }}
                              </span>
                            </div>
                          </div>
                        </div>
  
                        <!-- Pricing Summary -->
                        <div class="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                          <h4 class="font-semibold text-blue-900 mb-4 text-sm sm:text-base flex items-center">
                            <Icon name="lucide:dollar-sign" class="w-4 h-4 mr-2" />
                            Pricing
                          </h4>
                          <div class="space-y-3 text-xs sm:text-sm">
                            <div class="flex justify-between">
                              <span class="text-blue-700">Base Price:</span>
                              <span class="font-medium">${{ formData.price.toFixed(2) }}</span>
                            </div>
                            <div v-if="formData.discountPrice > 0" class="flex justify-between">
                              <span class="text-blue-700">Discount Price:</span>
                              <span class="font-medium text-green-600">${{ formData.discountPrice.toFixed(2) }}</span>
                            </div>
                            <div v-if="formData.discountPrice > 0" class="flex justify-between">
                              <span class="text-blue-700">Savings:</span>
                              <span class="font-medium text-green-600">{{ discountPercentage }}%</span>
                            </div>
                          </div>
                        </div>
  
                        <!-- Sizes Summary -->
                        <div v-if="formData.sizes.length > 0" class="bg-purple-50 rounded-xl p-4 sm:p-6 border border-purple-200">
                          <h4 class="font-semibold text-purple-900 mb-4 text-sm sm:text-base flex items-center">
                            <Icon name="lucide:ruler" class="w-4 h-4 mr-2" />
                            Sizes ({{ formData.sizes.length }})
                          </h4>
                          <div class="space-y-2">
                            <div
                              v-for="(size, index) in formData.sizes"
                              :key="index"
                              class="flex justify-between items-center text-xs sm:text-sm"
                            >
                              <span class="text-purple-700">{{ size.size }} ({{ size.color }}):</span>
                              <span class="font-medium">${{ size.price.toFixed(2) }}</span>
                            </div>
                          </div>
                        </div>
  
                        <!-- Validation Status -->
                        <div class="bg-white border rounded-xl p-4 sm:p-6">
                          <h4 class="font-semibold text-gray-900 mb-4 text-sm sm:text-base flex items-center">
                            <Icon name="lucide:check-circle" class="w-4 h-4 mr-2 text-green-600" />
                            Validation Status
                          </h4>
                          <div class="space-y-2">
                            <div class="flex items-center justify-between">
                              <span class="text-xs sm:text-sm text-gray-600">Basic Information</span>
                              <Icon 
                                :name="stepValidation[0] ? 'lucide:check-circle' : 'lucide:x-circle'" 
                                :class="stepValidation[0] ? 'text-green-500' : 'text-red-500'"
                                class="w-4 h-4 sm:w-5 sm:h-5" 
                              />
                            </div>
                            <div class="flex items-center justify-between">
                              <span class="text-xs sm:text-sm text-gray-600">Pricing</span>
                              <Icon 
                                :name="stepValidation[1] ? 'lucide:check-circle' : 'lucide:x-circle'" 
                                :class="stepValidation[1] ? 'text-green-500' : 'text-red-500'"
                                class="w-4 h-4 sm:w-5 sm:h-5" 
                              />
                            </div>
                            <div class="flex items-center justify-between">
                              <span class="text-xs sm:text-sm text-gray-600">Images</span>
                              <Icon 
                                :name="stepValidation[2] ? 'lucide:check-circle' : 'lucide:x-circle'" 
                                :class="stepValidation[2] ? 'text-green-500' : 'text-red-500'"
                                class="w-4 h-4 sm:w-5 sm:h-5" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
  
                    <!-- Final Actions -->
                    <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 sm:p-8 border border-blue-200">
                      <div class="text-center">
                        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                          {{ isEditMode ? 'Ready to Update Your Product?' : 'Ready to Create Your Product?' }}
                        </h3>
                        <p class="text-sm sm:text-base text-gray-600 mb-6">
                          {{ isEditMode 
                            ? 'Once you submit, your product will be updated with the new information.' 
                            : 'Once you submit, your product will be created and can be managed from the products dashboard.' 
                          }}
                        </p>
                        
                        <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                          <button
                            type="button"
                            @click="saveDraft"
                            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                          >
                            Save as Draft
                          </button>
                          <button
                            type="submit"
                            :disabled="!isFormValid || loading"
                            class="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                          >
                            <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
                            {{ loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product') }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
  
              <!-- Enhanced Navigation -->
              <div class="bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-gray-200">
                <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    type="button"
                    @click="previousStep"
                    :disabled="currentStep === 0"
                    class="w-full sm:w-auto px-6 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                  >
                    <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
                    Previous
                  </button>
  
                  <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <!-- <button
                      type="button"
                      @click="saveDraft"
                      class="w-full sm:w-auto px-6 py-3 text-blue-600 font-medium border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm"
                    >
                      Save Draft
                    </button> -->
                    
                    <button
                      v-if="currentStep < steps.length - 1"
                      type="button"
                      @click="nextStep"
                      :disabled="!isCurrentStepValid"
                      class="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                    >
                      Next
                      <Icon name="lucide:arrow-right" class="w-4 h-4 ml-2" />
                    </button>
  
                    <button
                      v-else
                      type="submit"
                      :disabled="!isFormValid || loading"
                      class="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                    >
                      <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
                      {{ loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product') }}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import { useSingleUploadFile } from '@/composables/core/useSingleUpload'
  import { useBatchUploadFile } from '@/composables/core/useBatchUploads'
  import { useFetchCategories } from "@/composables/modules/category/useFetchCategories"
  import { useCreateProduct } from "@/composables/modules/products/useCreateProduct"
  import { useUpdateProduct } from "@/composables/modules/products/useUpdateProduct"
  import { useFetchProduct } from "@/composables/modules/products/useFetchProduct"
  import { navigateTo } from '#app'
  import CustomInput from '@/components/ui/CustomInput.vue'
  import CustomTextarea from '@/components/ui/CustomTextarea.vue'
  import CustomSelect from '@/components/ui/CustomSelect.vue'
  import DraggableImageGallery from '@/components/ui/DraggableImgeGallery.vue'
  import Icon from '@/components/Icon.vue'
  
  // Route and edit mode detection
  const route = useRoute()
  const productId = computed(() => route.query.id as string)
  const isEditMode = computed(() => !!productId.value)
  
  // Composables
  const { categories } = useFetchCategories()
  const { createProduct, loading: createLoading } = useCreateProduct()
  const { updateProduct, loading: updateLoading } = useUpdateProduct()
  const { fetchProduct, loading: loadingProduct, error: productError, product } = useFetchProduct()
  const {
    singleUploadFile,
    loading: uploadingSingle,
    uploadResponse: singleUploadResponse,
  } = useSingleUploadFile()
  const {
    batchUploadFile,
    loading: uploadingBatch,
    uploadResponse: batchUploadResponse,
  } = useBatchUploadFile()
  
  // Loading state
  const loading = computed(() => createLoading.value || updateLoading.value)
  
  // Steps configuration
  const steps = [
    { title: 'Basic Info' },
    { title: 'Pricing' },
    { title: 'Images' },
    { title: 'Details' },
    { title: 'Sizes' },
    { title: 'Additional' },
    { title: 'Review' }
  ]
  
  // State
  const currentStep = ref(0)
  const stepValidation = ref<Record<number, boolean>>({})
  const errors = ref<Record<string, string>>({})
  
  // Form data with default values
  const formData = ref({
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    images: [],
    category: null,
    isAvailable: true,
    weight: 0,
    width: 0,
    height: 0,
    length: 0,
    tags: [],
    attributes: {},
    isFeatured: false,
    isNew: false,
    isBestseller: false,
    productInfo: '',
    returnPolicy: '',
    shippingInfo: '',
    sizes: [],
    promotionText: '',
    installmentConfig: {
      enabled: false,
      maxInstallments: 12,
      interestRate: 0,
      minimumAmount: 0,
      availableTerms: [3, 6, 12],
      minimumDownPaymentPercentage: 20,
      maximumDownPaymentPercentage: 50
    }
  })
  
  // Additional state for form interactions
  const newTag = ref('')
  const newAttribute = ref({ key: '', value: '' })
  const singleFileInput = ref<HTMLInputElement | null>(null)
  const batchFileInput = ref<HTMLInputElement | null>(null)
  const isDraggingSingle = ref(false)
  const isDraggingBatch = ref(false)
  const router = useRouter()
  
  // Computed properties
  const categoryOptions = computed(() => {
    return categories.value.map(category => ({
      value: category._id,
      label: category.name
    }))
  })
  
  const sizeOptions = computed(() => [
    { value: 'small', label: 'Small' },
    { value: 'basic', label: 'Basic' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ])
  
  const colorOptions = computed(() => [
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' }
  ])
  
  const discountPercentage = computed(() => {
    if (!formData.value.discountPrice || formData.value.discountPrice === 0 || formData.value.price === 0) {
      return 0
    }
    return Math.round(((formData.value.price - formData.value.discountPrice) / formData.value.price) * 100)
  })
  
  const mainImage = computed(() => {
    return formData.value.images[0] || null
  })
  
  const isCurrentStepValid = computed(() => {
    return stepValidation.value[currentStep.value] ?? false
  })
  
  const isFormValid = computed(() => {
    return Object.keys(stepValidation.value).length === steps.length &&
           Object.values(stepValidation.value).every(valid => valid)
  })
  
  // Methods
  const getStepClasses = (index: number) => {
    if (index < currentStep.value) {
      return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
    } else if (index === currentStep.value) {
      return 'bg-blue-100 text-blue-600 border-2 border-blue-500 shadow-md'
    } else {
      return 'bg-gray-200 text-gray-500'
    }
  }
  
  const nextStep = async () => {
    if (currentStep.value < steps.length - 1 && isCurrentStepValid.value) {
      currentStep.value++
      await nextTick()
      saveToLocalStorage()
      validateCurrentStep()
    }
  }
  
  const previousStep = async () => {
    if (currentStep.value > 0) {
      currentStep.value--
      await nextTick()
      saveToLocalStorage()
    }
  }
  
  // Load existing product data for edit mode
  const loadProductData = async () => {
    if (!isEditMode.value) return
    
    try {
      const product = await fetchProduct(productId.value)
      if (product) {
        // Map the product data to form data structure
        formData.value = {
          name: product.name || '',
          description: product.description || '',
          price: product.price || 0,
          discountPrice: product.discountPrice || 0,
          images: product.images || [],
          category: product.category?._id || product.category?.id || null,
          isAvailable: product.isAvailable ?? true,
          weight: product.weight || 0,
          width: product.width || 0,
          height: product.height || 0,
          length: product.length || 0,
          tags: product.tags || [],
          attributes: product.attributes || {},
          isFeatured: product.isFeatured || false,
          isNew: product.isNew || false,
          isBestseller: product.isBestseller || false,
          productInfo: product.productInfo || '',
          returnPolicy: product.returnPolicy || '',
          shippingInfo: product.shippingInfo || '',
          sizes: product.sizes || [],
          promotionText: product.promotionText || '',
          installmentConfig: {
            enabled: product.installmentConfig?.enabled || false,
            maxInstallments: product.installmentConfig?.maxInstallments || 12,
            interestRate: product.installmentConfig?.interestRate || 0,
            minimumAmount: product.installmentConfig?.minimumAmount || 0,
            availableTerms: product.installmentConfig?.availableTerms || [3, 6, 12],
            minimumDownPaymentPercentage: product.installmentConfig?.minimumDownPaymentPercentage || 20,
            maximumDownPaymentPercentage: product.installmentConfig?.maximumDownPaymentPercentage || 50
          }
        }
        
        // Validate all steps after loading data
        for (let i = 0; i < steps.length; i++) {
          currentStep.value = i
          validateCurrentStep()
        }
        currentStep.value = 0
      }
    } catch (error) {
      console.error('Error loading product:', error)
    }
  }
  
  // Tag management
  const addTag = () => {
    if (newTag.value.trim() && !formData.value.tags.includes(newTag.value.trim())) {
      formData.value.tags.push(newTag.value.trim())
      newTag.value = ''
      validateCurrentStep()
    }
  }
  
  const removeTag = (index: number) => {
    formData.value.tags.splice(index, 1)
    validateCurrentStep()
  }
  
  // Attribute management
  const addAttribute = () => {
    if (newAttribute.value.key.trim() && newAttribute.value.value.trim()) {
      formData.value.attributes[newAttribute.value.key.trim()] = newAttribute.value.value.trim()
      newAttribute.value = { key: '', value: '' }
      validateCurrentStep()
    }
  }
  
  const removeAttribute = (key: string) => {
    delete formData.value.attributes[key]
    validateCurrentStep()
  }
  
  // Size management
  const addSize = () => {
    formData.value.sizes.push({
      size: '',
      price: 0,
      color: 'black',
      installmentConfig: {
        enabled: false,
        maxInstallments: 12,
        interestRate: 0,
        minimumAmount: 0,
        availableTerms: [3, 6, 12],
        minimumDownPaymentPercentage: 20,
        maximumDownPaymentPercentage: 50
      }
    })
    validateCurrentStep()
  }
  
  const removeSize = (index: number) => {
    formData.value.sizes.splice(index, 1)
    validateCurrentStep()
  }
  
  // Image management
  const triggerSingleUpload = () => {
    singleFileInput.value?.click()
  }
  
  const triggerBatchUpload = () => {
    batchFileInput.value?.click()
  }
  
  const handleSingleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
      singleUploadFile(target.files[0])
    }
  }
  
  const handleBatchFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      batchUploadFile(Array.from(target.files))
    }
  }
  
  const handleSingleDrop = (event: DragEvent) => {
    event.preventDefault()
    isDraggingSingle.value = false
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      singleUploadFile(event.dataTransfer.files[0])
    }
  }
  
  const handleBatchDrop = (event: DragEvent) => {
    event.preventDefault()
    isDraggingBatch.value = false
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      batchUploadFile(Array.from(event.dataTransfer.files))
    }
  }
  
  const removeMainImage = () => {
    if (formData.value.images.length > 0) {
      formData.value.images.splice(0, 1)
      validateCurrentStep()
    }
  }
  
  const removeImage = (index: number) => {
    formData.value.images.splice(index, 1)
    validateCurrentStep()
  }
  
  const updateImages = (newImages: string[]) => {
    formData.value.images = newImages
    validateCurrentStep()
  }
  
  // Calculation methods
  const calculateVolume = () => {
    const { width, height, length } = formData.value
    return ((width || 0) * (height || 0) * (length || 0)).toFixed(2)
  }
  
  const getBoxStyle = () => {
    const maxDimension = Math.max(formData.value.width || 1, formData.value.height || 1, formData.value.length || 1)
    const scale = Math.min(100 / maxDimension, 1)
    
    return {
      width: `${Math.max((formData.value.width || 10) * scale, 20)}px`,
      height: `${Math.max((formData.value.height || 10) * scale, 20)}px`,
    }
  }
  
  const getShippingClass = () => {
    const weight = formData.value.weight || 0
    const volume = parseFloat(calculateVolume())
    
    if (weight > 20 || volume > 100000) return 'Heavy/Oversized'
    if (weight > 5 || volume > 10000) return 'Standard'
    return 'Light'
  }
  
  const getEstimatedShippingCost = () => {
    const shippingClass = getShippingClass()
    const costs = {
      'Light': '5.99',
      'Standard': '12.99',
      'Heavy/Oversized': '24.99'
    }
    return costs[shippingClass] || '0.00'
  }
  
  const calculateMonthlyPayment = (price: number, months: number, interestRate: number) => {
    if (interestRate === 0) {
      return price / months
    }
    
    const monthlyRate = interestRate / 100 / 12
    const payment = (price * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    return payment
  }
  
  const calculateTotalWithInterest = (price: number, months: number, interestRate: number) => {
    return calculateMonthlyPayment(price, months, interestRate) * months
  }
  
  // Template methods
  const templates = {
    productInfo: `This high-quality product is designed to meet your needs with:
  
  • Premium materials and construction
  • Durable and long-lasting design
  • Easy to use and maintain
  • Suitable for daily use
  • Backed by our quality guarantee
  
  Perfect for both personal and professional use. Each item is carefully inspected before shipping to ensure you receive the best quality product.`,
  
    returnPolicy: `We offer a 30-day return policy for all products:
  
  • Items must be returned in original condition
  • Original packaging and tags must be included
  • Return shipping costs are covered by the customer
  • Refunds processed within 5-7 business days
  • Exchanges available for different sizes/colors
  
  Please contact our customer service team to initiate a return. We're committed to your satisfaction and will work with you to resolve any issues.`,
  
    shippingInfo: `Fast and reliable shipping options:
  
  • Standard shipping: 5-7 business days ($5.99)
  • Express shipping: 2-3 business days ($12.99)
  • Overnight shipping: Next business day ($24.99)
  • Free shipping on orders over $75
  
  All orders are processed within 1-2 business days. You'll receive a tracking number once your order ships. We ship Monday through Friday, excluding holidays.`
  }
  
  const applyTemplate = (field: keyof typeof templates) => {
    formData.value[field] = templates[field]
    validateCurrentStep()
  }
  
  const getCategoryName = () => {
    const category = categories.value.find(cat => cat._id === formData.value.category)
    return category?.name || null
  }
  
  // Enhanced validation with better error handling
  const validateCurrentStep = () => {
    errors.value = {}
    let isValid = true
  
    switch (currentStep.value) {
      case 0: // Basic Information
        if (!formData.value.name?.trim()) {
          errors.value.name = 'Product name is required'
          isValid = false
        }
        
        if (!formData.value.description?.trim()) {
          errors.value.description = 'Product description is required'
          isValid = false
        } else if (formData.value.description.length > 1000000000) {
          errors.value.description = 'Description must be less than 500 characters'
          isValid = false
        }
        
        if (!formData.value.category) {
          errors.value.category = 'Please select a category'
          isValid = false
        }
        break
  
      case 1: // Pricing
        if (!formData.value.price || formData.value.price <= 0) {
          errors.value.price = 'Base price must be greater than 0'
          isValid = false
        }
        
        if (formData.value.discountPrice && formData.value.discountPrice >= formData.value.price) {
          errors.value.discountPrice = 'Discount price must be less than base price'
          isValid = false
        }
        break
  
      case 2: // Images
        isValid = formData.value.images.length > 0
        break
  
      case 3: // Product Details
      case 4: // Sizes & Installments
      case 5: // Additional Info
        isValid = true // These steps are optional
        break
  
      case 6: // Review & Submit
        isValid = !!(
          formData.value.name &&
          formData.value.description &&
          formData.value.price > 0 &&
          formData.value.category &&
          formData.value.images.length > 0
        )
        break
    }
  
    stepValidation.value[currentStep.value] = isValid
    return isValid
  }
  
  // Enhanced storage methods with better error handling
  const saveToLocalStorage = () => {
    try {
      const dataToSave = {
        formData: formData.value,
        currentStep: currentStep.value,
        stepValidation: stepValidation.value,
        timestamp: Date.now(),
        isEditMode: isEditMode.value,
        productId: productId.value
      }
      const storageKey = isEditMode.value ? `productEditFormState_${productId.value}` : 'productFormState'
      localStorage.setItem(storageKey, JSON.stringify(dataToSave))
    } catch (error) {
      console.warn('Failed to save form data to localStorage:', error)
    }
  }
  
  const loadFromLocalStorage = () => {
    if (isEditMode.value) return // Don't load from localStorage in edit mode
    
    try {
      const savedState = localStorage.getItem('productFormState')
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        
        // Check if data is not too old (24 hours)
        const isDataFresh = parsedState.timestamp && (Date.now() - parsedState.timestamp) < 24 * 60 * 60 * 1000
        
        if (isDataFresh && !parsedState.isEditMode) {
          formData.value = { ...formData.value, ...parsedState.formData }
          currentStep.value = parsedState.currentStep || 0
          stepValidation.value = parsedState.stepValidation || {}
        } else {
          // Clear old data
          clearLocalStorage()
        }
      }
    } catch (error) {
      console.warn('Failed to load form data from localStorage:', error)
      clearLocalStorage()
    }
  }
  
  const clearLocalStorage = () => {
    try {
      const storageKey = isEditMode.value ? `productEditFormState_${productId.value}` : 'productFormState'
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
    }
  }
  
  const saveDraft = () => {
    saveToLocalStorage()
    // You can add a toast notification here
    console.log('Draft saved successfully!')
  }
  
  const handleSubmit = async () => {
    if (!isFormValid.value) return
  
    try {
      let response
      
      if (isEditMode.value) {
        // Update existing product
        response = await updateProduct(productId.value, formData.value)
      } else {
        // Create new product
        response = await createProduct(formData.value)
      }
      
      if (response) {
        // Clear local storage on successful submission
        clearLocalStorage()
        
        // Redirect to products list or show success message
        await router.push('/dashboard/products')
      }
    } catch (error) {
      console.error(`Error ${isEditMode.value ? 'updating' : 'creating'} product:`, error)
      // You can add error handling/notification here
    }
  }
  
  // Watch for upload responses with better error handling and proper batch mapping
  watch(() => singleUploadResponse.value, (response) => {
    if (response?.url) {
      if (formData.value.images.length === 0) {
        formData.value.images.push(response.url)
      } else {
        formData.value.images[0] = response.url
      }
      validateCurrentStep()
    }
  })
  
  watch(() => batchUploadResponse.value, (response) => {
    if (response && Array.isArray(response)) {
      // Extract URLs from the array of objects
      const urls = response.map(item => item.url).filter(Boolean)
      if (urls.length > 0) {
        formData.value.images.push(...urls)
        validateCurrentStep()
      }
    }
  })
  
  // Enhanced form data watcher with debouncing
  let saveTimeout: NodeJS.Timeout
  watch(formData, () => {
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
      saveToLocalStorage()
      validateCurrentStep()
    }, 500) // Debounce for 500ms
  }, { deep: true })
  
  // Lifecycle
  onMounted(async () => {
    if (isEditMode.value) {
      await loadProductData()
    } else {
      loadFromLocalStorage()
    }
    validateCurrentStep()
  })

  definePageMeta({
    layout: 'dashboard'
  })
  </script>
  
  <style scoped>
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s ease-in-out;
  }
  
  .slide-enter-from {
    transform: translateX(100%);
    opacity: 0;
  }
  
  .slide-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Hide scrollbar for mobile steps */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  /* Custom scrollbar for better UX */
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  
  /* Improved focus states */
  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  /* Better button hover states */
  button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  button:active:not(:disabled) {
    transform: translateY(0);
  }
  
  /* Loading animation */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  </style>
  