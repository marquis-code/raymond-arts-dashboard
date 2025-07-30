<template>
  <div class="bg-white rounded-xl shadow-2xl overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-white">
            {{ isEditing ? 'Edit Content' : 'Create New Content' }}
          </h2>
          <p class="text-blue-100 mt-1">
            {{ isEditing ? 'Update your content information' : 'Add new content to your website' }}
          </p>
        </div>
        <button
          @click="closeForm"
          class="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/10"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
      <!-- Basic Information Section -->
      <div class="space-y-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Basic Information</h3>
        </div>

        <!-- Content Type -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Content Type *
          </label>
          <select
            v-model="formData.type"
            :disabled="isEditing"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all duration-200"
            required
          >
            <option value="">Select content type</option>
            <option
              v-for="type in contentTypes"
              :key="type.value"
              :value="type.value"
            >
              {{ type.label }}
            </option>
          </select>
          <p v-if="selectedTypeInfo" class="text-sm text-gray-500">
            {{ getTypeDescription(selectedTypeInfo.value) }}
          </p>
        </div>

        <!-- Title -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            v-model="formData.title"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter content title"
            maxlength="200"
            required
          />
          <div class="flex justify-between text-sm text-gray-500">
            <span>Maximum 200 characters</span>
            <span>{{ formData.title.length }}/200</span>
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            v-model="formData.description"
            rows="4"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter content description"
            maxlength="1000"
          />
          <div class="flex justify-between text-sm text-gray-500">
            <span>Maximum 1000 characters</span>
            <span>{{ (formData.description || '').length }}/1000</span>
          </div>
        </div>

        <!-- Status -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Status
          </label>
          <div class="flex space-x-4">
            <label
              v-for="status in contentStatuses"
              :key="status.value"
              class="flex items-center space-x-2 cursor-pointer"
            >
              <input
                v-model="formData.status"
                type="radio"
                :value="status.value"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700">{{ status.label }}</span>
              <span
                :class="getStatusBadgeClass(status.value)"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ status.label }}
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Images Section -->
      <div v-if="selectedTypeInfo" class="space-y-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Images</h3>
            <p class="text-sm text-gray-500">
              {{ getImageRequirementText(selectedTypeInfo.imageCount) }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <TransitionGroup name="image-item" tag="div" class="space-y-4">
            <div
              v-for="(image, index) in formData.images"
              :key="`image-${index}`"
              class="group relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-all duration-200"
            >
              <div class="flex items-start space-x-4">
                <!-- Image Preview -->
                <div class="flex-shrink-0">
                  <div v-if="image" class="w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
                    <img
                      :src="image"
                      :alt="`Preview ${index + 1}`"
                      class="w-full h-full object-cover"
                      @error="handleImageError(index)"
                    />
                  </div>
                  <div v-else class="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <!-- Image Input -->
                <div class="flex-1 space-y-3">
                  <input
                    v-model="formData.images[index]"
                    type="url"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    :placeholder="`Enter image URL ${index + 1}`"
                  />
                  
                  <!-- Alt Text -->
                  <input
                    v-model="formData.metadata.altText[index]"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Alt text for accessibility"
                  />
                  
                  <!-- Caption -->
                  <input
                    v-model="formData.metadata.captions[index]"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Image caption (optional)"
                  />
                </div>

                <!-- Actions -->
                <div class="flex flex-col space-y-2">
                  <button
                    type="button"
                    @click="uploadImage(index)"
                    :disabled="uploadingSingle"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                  >
                    {{ uploadingSingle ? 'Uploading...' : 'Upload' }}
                  </button>
                  
                  <button
                    v-if="canRemoveImage"
                    type="button"
                    @click="removeImage(index)"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <button
            v-if="canAddMoreImages"
            type="button"
            @click="addImageField"
            class="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Image</span>
          </button>
        </div>
      </div>

      <!-- Dynamic Metadata Sections -->
      <div v-if="showMetadataFields" class="space-y-8">
        <!-- Contact Info Metadata -->
        <div v-if="formData.type === 'contact_info'" class="space-y-6">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Contact Information</h3>
          </div>

          <!-- Email Information -->
          <div class="bg-gray-50 rounded-lg p-6 space-y-4">
            <h4 class="font-medium text-gray-900">Email Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  v-model="formData.metadata.contactInfo.email.address"
                  type="email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="hello@example.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
                <input
                  v-model="formData.metadata.contactInfo.email.responseTime"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="I'll respond within 24 hours"
                />
              </div>
            </div>
          </div>

          <!-- Locations -->
          <div class="bg-gray-50 rounded-lg p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="font-medium text-gray-900">Office Locations</h4>
              <button
                type="button"
                @click="addLocation"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm"
              >
                Add Location
              </button>
            </div>
            
            <TransitionGroup name="location-item" tag="div" class="space-y-4">
              <div
                v-for="(location, index) in formData.metadata.contactInfo.locations"
                :key="`location-${index}`"
                class="bg-white rounded-lg p-4 border border-gray-200 space-y-3"
              >
                <div class="flex items-center justify-between">
                  <h5 class="font-medium text-gray-800">Location {{ index + 1 }}</h5>
                  <button
                    type="button"
                    @click="removeLocation(index)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    v-model="location.name"
                    type="text"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Office name"
                  />
                  <input
                    v-model="location.phone"
                    type="tel"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Phone number"
                  />
                  <input
                    v-model="location.address"
                    type="text"
                    class="md:col-span-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Full address"
                  />
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- Social Media -->
          <div class="bg-gray-50 rounded-lg p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="font-medium text-gray-900">Social Media</h4>
              <button
                type="button"
                @click="addSocialMedia"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm"
              >
                Add Social Media
              </button>
            </div>
            
            <TransitionGroup name="social-item" tag="div" class="space-y-4">
              <div
                v-for="(social, index) in formData.metadata.contactInfo.socialMedia"
                :key="`social-${index}`"
                class="bg-white rounded-lg p-4 border border-gray-200 space-y-3"
              >
                <div class="flex items-center justify-between">
                  <h5 class="font-medium text-gray-800">Social Media {{ index + 1 }}</h5>
                  <button
                    type="button"
                    @click="removeSocialMedia(index)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    v-model="social.platform"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select platform</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Twitter">Twitter</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                    <option value="TikTok">TikTok</option>
                  </select>
                  <input
                    v-model="social.username"
                    type="text"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="@username"
                  />
                  <input
                    v-model="social.url"
                    type="url"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Profile URL"
                  />
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>

        <!-- About Section Metadata -->
        <div v-if="formData.type === 'about_section'" class="space-y-6">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">About Information</h3>
          </div>

          <!-- Biography -->
          <div class="bg-gray-50 rounded-lg p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="font-medium text-gray-900">Biography</h4>
              <button
                type="button"
                @click="addBiographyParagraph"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm"
              >
                Add Paragraph
              </button>
            </div>
            
            <TransitionGroup name="bio-item" tag="div" class="space-y-4">
              <div
                v-for="(paragraph, index) in formData.metadata.aboutInfo.biography"
                :key="`bio-${index}`"
                class="bg-white rounded-lg p-4 border border-gray-200"
              >
                <div class="flex items-start space-x-3">
                  <div class="flex-1">
                    <textarea
                      v-model="formData.metadata.aboutInfo.biography[index]"
                      rows="4"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      :placeholder="`Biography paragraph ${index + 1}`"
                      maxlength="1000"
                    />
                    <div class="text-right text-sm text-gray-500 mt-1">
                      {{ paragraph.length }}/1000
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="removeBiographyParagraph(index)"
                    class="text-red-600 hover:text-red-800 transition-colors p-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- Additional Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700">Birth Year</label>
              <input
                v-model.number="formData.metadata.aboutInfo.birthYear"
                type="number"
                min="1900"
                :max="new Date().getFullYear()"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="1999"
              />
            </div>
            
            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700">Professions</label>
              <TagInput
                v-model="formData.metadata.aboutInfo.profession"
                placeholder="Add profession"
                class="w-full"
              />
            </div>
            
            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700">Artistic Mediums</label>
              <TagInput
                v-model="formData.metadata.aboutInfo.artisticMediums"
                placeholder="Add artistic medium"
                class="w-full"
              />
            </div>
            
            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700">Interests</label>
              <TagInput
                v-model="formData.metadata.aboutInfo.interests"
                placeholder="Add interest"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Commission Info Metadata -->
        <div v-if="formData.type === 'commission_info'" class="space-y-6">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Commission Information</h3>
          </div>

          <!-- Sizes and Prices -->
          <div class="bg-gray-50 rounded-lg p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="font-medium text-gray-900">Sizes and Prices</h4>
              <button
                type="button"
                @click="addSize"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm"
              >
                Add Size
              </button>
            </div>
            
            <TransitionGroup name="size-item" tag="div" class="space-y-4">
              <div
                v-for="(size, index) in formData.metadata.sizes"
                :key="`size-${index}`"
                class="bg-white rounded-lg p-4 border border-gray-200 space-y-3"
              >
                <div class="flex items-center justify-between">
                  <h5 class="font-medium text-gray-800">Size {{ index + 1 }}</h5>
                  <button
                    type="button"
                    @click="removeSize(index)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    v-model="size.name"
                    type="text"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Size name"
                  />
                  <input
                    v-model="size.dimensions"
                    type="text"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Dimensions"
                  />
                  <input
                    v-model.number="size.price"
                    type="number"
                    min="0"
                    step="0.01"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Price"
                  />
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- Sections -->
          <div class="bg-gray-50 rounded-lg p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="font-medium text-gray-900">Information Sections</h4>
              <button
                type="button"
                @click="addSection"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm"
              >
                Add Section
              </button>
            </div>
            
            <TransitionGroup name="section-item" tag="div" class="space-y-4">
              <div
                v-for="(section, index) in formData.metadata.sections"
                :key="`section-${index}`"
                class="bg-white rounded-lg p-4 border border-gray-200 space-y-3"
              >
                <div class="flex items-center justify-between">
                  <h5 class="font-medium text-gray-800">Section {{ index + 1 }}</h5>
                  <button
                    type="button"
                    @click="removeSection(index)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div class="space-y-3">
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                      v-model="section.title"
                      type="text"
                      class="md:col-span-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Section title"
                    />
                    <input
                      v-model.number="section.order"
                      type="number"
                      min="1"
                      class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Order"
                    />
                  </div>
                  <textarea
                    v-model="section.content"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Section content"
                    maxlength="2000"
                  />
                  <div class="text-right text-sm text-gray-500">
                    {{ section.content.length }}/2000
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex items-center justify-end space-x-4 pt-8 border-t border-gray-200">
        <button
          type="button"
          @click="closeForm"
          class="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="previewForm"
          class="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
        >
          Preview
        </button>
        <button
          type="submit"
          :disabled="loading || uploadingSingle"
          class="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          {{ loading ? 'Saving...' : (isEditing ? 'Update Content' : 'Create Content') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useSingleUploadFile } from '@/composables/core/useSingleUpload'
import TagInput from '@/components/ui/TagInput.vue'

interface Props {
  contentTypes: any[]
  contentStatuses: any[]
  initialData?: any
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  submit: [data: any]
  close: []
  preview: [data: any]
}>()

const { singleUploadFile, loading: uploadingSingle, uploadResponse: singleUploadResponse, error: uploadFileError } = useSingleUploadFile()

const isEditing = computed(() => !!props.initialData)

const formData = ref({
  type: '',
  title: '',
  description: '',
  images: [] as string[],
  status: 'draft',
  metadata: {
    altText: [] as string[],
    captions: [] as string[],
    contactInfo: {
      email: {
        address: '',
        responseTime: ''
      },
      locations: [] as any[],
      socialMedia: [] as any[]
    },
    aboutInfo: {
      biography: [''],
      profession: [] as string[],
      artisticMediums: [] as string[],
      interests: [] as string[]
    },
    sizes: [] as any[],
    sections: [] as any[]
  }
})

const selectedTypeInfo = computed(() => {
  return props.contentTypes.find(type => type.value === formData.value.type)
})

const showMetadataFields = computed(() => {
  return ['contact_info', 'about_section', 'commission_info'].includes(formData.value.type)
})

const canAddMoreImages = computed(() => {
  if (!selectedTypeInfo.value) return false
  const maxImages = selectedTypeInfo.value.imageCount || 10
  return formData.value.images.length < maxImages
})

const canRemoveImage = computed(() => {
  if (!selectedTypeInfo.value) return true
  const requiredImages = selectedTypeInfo.value.imageCount || 0
  return formData.value.images.length > requiredImages
})

// Initialize form data
onMounted(() => {
  if (props.initialData) {
    formData.value = {
      ...formData.value,
      ...props.initialData,
      images: props.initialData.images || [],
      metadata: {
        ...formData.value.metadata,
        ...props.initialData.metadata
      }
    }
    
    // Ensure arrays exist
    if (!formData.value.metadata.altText) formData.value.metadata.altText = []
    if (!formData.value.metadata.captions) formData.value.metadata.captions = []
  }
})

// Watch for type changes to adjust image fields
watch(() => formData.value.type, (newType) => {
  const typeInfo = props.contentTypes.find(type => type.value === newType)
  if (typeInfo && typeInfo.imageCount > 0) {
    const currentLength = formData.value.images.length
    if (currentLength < typeInfo.imageCount) {
      for (let i = currentLength; i < typeInfo.imageCount; i++) {
        formData.value.images.push('')
        formData.value.metadata.altText.push('')
        formData.value.metadata.captions.push('')
      }
    }
  }
})

// Image methods
const addImageField = () => {
  formData.value.images.push('')
  formData.value.metadata.altText.push('')
  formData.value.metadata.captions.push('')
}

const removeImage = (index: number) => {
  formData.value.images.splice(index, 1)
  formData.value.metadata.altText.splice(index, 1)
  formData.value.metadata.captions.splice(index, 1)
}

const uploadImage = async (index: number) => {
  try {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        await singleUploadFile(file)
        if (singleUploadResponse.value?.url) {
          formData.value.images[index] = singleUploadResponse.value.url
        }
      }
    }
    input.click()
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

const handleImageError = (index: number) => {
  console.error(`Failed to load image at index ${index}`)
}

// Location methods
const addLocation = () => {
  formData.value.metadata.contactInfo.locations.push({
    name: '',
    address: '',
    phone: ''
  })
}

const removeLocation = (index: number) => {
  formData.value.metadata.contactInfo.locations.splice(index, 1)
}

// Social media methods
const addSocialMedia = () => {
  formData.value.metadata.contactInfo.socialMedia.push({
    platform: '',
    url: '',
    username: ''
  })
}

const removeSocialMedia = (index: number) => {
  formData.value.metadata.contactInfo.socialMedia.splice(index, 1)
}

// Biography methods
const addBiographyParagraph = () => {
  formData.value.metadata.aboutInfo.biography.push('')
}

const removeBiographyParagraph = (index: number) => {
  if (formData.value.metadata.aboutInfo.biography.length > 1) {
    formData.value.metadata.aboutInfo.biography.splice(index, 1)
  }
}

// Size methods
const addSize = () => {
  formData.value.metadata.sizes.push({
    name: '',
    dimensions: '',
    price: 0
  })
}

const removeSize = (index: number) => {
  formData.value.metadata.sizes.splice(index, 1)
}

// Section methods
const addSection = () => {
  formData.value.metadata.sections.push({
    title: '',
    content: '',
    order: formData.value.metadata.sections.length + 1
  })
}

const removeSection = (index: number) => {
  formData.value.metadata.sections.splice(index, 1)
}

// Utility methods
const getTypeDescription = (type: string) => {
  const descriptions = {
    home_hero: 'Main hero section for the homepage',
    portrait_hero: 'Hero section for portrait gallery',
    gallery_hero: 'Hero section for art gallery',
    shop_prints_hero: 'Hero section for print shop',
    commission_hero: 'Hero section for commission page',
    commission_info: 'Detailed commission information and pricing',
    contact_info: 'Contact details and office locations',
    about_section: 'Artist biography and information'
  }
  return descriptions[type] || ''
}

const getImageRequirementText = (count: number) => {
  if (count === 0) return 'Images are optional for this content type'
  if (count === 1) return 'This content type requires exactly 1 image'
  return `This content type requires exactly ${count} images`
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const handleSubmit = () => {
  // Clean up empty values
  formData.value.images = formData.value.images.filter(img => img.trim() !== '')
  formData.value.metadata.altText = formData.value.metadata.altText.filter(alt => alt.trim() !== '')
  formData.value.metadata.captions = formData.value.metadata.captions.filter(cap => cap.trim() !== '')
  
  if (formData.value.metadata.aboutInfo.biography) {
    formData.value.metadata.aboutInfo.biography = formData.value.metadata.aboutInfo.biography.filter(p => p.trim() !== '')
  }
  
  emit('submit', formData.value)
}

const closeForm = () => {
  emit('close')
}

const previewForm = () => {
  emit('preview', formData.value)
}
</script>

<style scoped>
/* Animation styles */
.image-item-enter-active,
.image-item-leave-active,
.location-item-enter-active,
.location-item-leave-active,
.social-item-enter-active,
.social-item-leave-active,
.bio-item-enter-active,
.bio-item-leave-active,
.size-item-enter-active,
.size-item-leave-active,
.section-item-enter-active,
.section-item-leave-active {
  transition: all 0.3s ease;
}

.image-item-enter-from,
.image-item-leave-to,
.location-item-enter-from,
.location-item-leave-to,
.social-item-enter-from,
.social-item-leave-to,
.bio-item-enter-from,
.bio-item-leave-to,
.size-item-enter-from,
.size-item-leave-to,
.section-item-enter-from,
.section-item-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.image-item-leave-active,
.location-item-leave-active,
.social-item-leave-active,
.bio-item-leave-active,
.size-item-leave-active,
.section-item-leave-active {
  position: absolute;
  width: 100%;
}
</style>
