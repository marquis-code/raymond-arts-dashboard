<template>
    <div class="space-y-6">
      <!-- Header with actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Create New Course</h1>
          <p class="mt-1 text-sm text-gray-500">Create a new course for your students</p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="router.back()" 
            class="inline-flex items-center px-4 text-white py-3 text-sm font-medium  bg-black rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
          >
            <ArrowLeftIcon class="w-4 h-4 mr-2" />
            Back
          </button>
          <button 
            @click="saveCourse" 
            :disabled="saving || !isFormValid || uploadingSingle"
            class="inline-flex items-center px-4 py-3 text-sm font-medium bg-black text-white bg-primary rounded-lg shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <LoaderIcon v-if="saving || uploadingSingle" class="w-4 h-4 mr-2 animate-spin" />
            <SaveIcon v-else class="w-4 h-4 mr-2" />
            Create Course
          </button>
        </div>
      </div>
  
      <!-- Form -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main form content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic information -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-medium text-gray-900">Basic Information</h2>
            </div>
            <div class="p-6 space-y-4">
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                    Title <span class="text-red-500">*</span>
                  </label>
                  <input 
                    id="title" 
                    v-model="courseForm.title" 
                    type="text" 
                    required
                    class="w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                    placeholder="e.g. Advanced JavaScript Masterclass"
                    @input="autoGenerateSlug"
                  />
                  <p v-if="errors.title" class="mt-1 text-sm text-red-500">{{ errors.title }}</p>
                </div>
                
                <div>
                  <label for="slug" class="block text-sm font-medium text-gray-700 mb-1">
                    Slug <span class="text-red-500">*</span>
                  </label>
                  <div class="flex">
                    <input 
                      id="slug" 
                      v-model="courseForm.slug" 
                      type="text" 
                      required
                      class="flex-1 px-3 py-3 text-gray-900 bg-white border border-gray-300 rounded-l-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                      placeholder="e.g. advanced-javascript-masterclass"
                    />
                    <button 
                      @click="generateSlug" 
                      type="button"
                      class="px-3 py-3 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                    >
                      Generate
                    </button>
                  </div>
                  <p v-if="errors.slug" class="mt-1 text-sm text-red-500">{{ errors.slug }}</p>
                </div>
  
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                    Short Description <span class="text-red-500">*</span>
                  </label>
                  <textarea 
                    id="description" 
                    v-model="courseForm.description" 
                    rows="2" 
                    required
                    class="w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                    placeholder="Brief description of your course (150-200 characters)"
                  ></textarea>
                  <p v-if="errors.description" class="mt-1 text-sm text-red-500">{{ errors.description }}</p>
                </div>
                
                <div>
                  <label for="longDescription" class="block text-sm font-medium text-gray-700 mb-1">
                    Long Description
                  </label>
                  <textarea 
                    id="longDescription" 
                    v-model="courseForm.longDescription" 
                    rows="6" 
                    class="w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                    placeholder="Detailed description of your course"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pricing -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-medium text-gray-900">Pricing</h2>
            </div>
            <div class="p-6 space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="price" class="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input 
                      id="price" 
                      v-model="courseForm.price" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      required
                      class="w-full pl-7 pr-3 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                      placeholder="29.99"
                    />
                  </div>
                  <p v-if="errors.price" class="mt-1 text-sm text-red-500">{{ errors.price }}</p>
                </div>
                
                <div>
                  <label for="discountPrice" class="block text-sm font-medium text-gray-700 mb-1">
                    Discount Price ($)
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input 
                      id="discountPrice" 
                      v-model="courseForm.discountPrice" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="w-full pl-7 pr-3 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                      placeholder="19.99"
                    />
                  </div>
                  <p class="mt-1 text-xs text-gray-500">Leave empty for no discount</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Preview Video -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-medium text-gray-900">Preview Video</h2>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label for="previewVideo" class="block text-sm font-medium text-gray-700 mb-1">
                  Video URL
                </label>
                <input 
                  id="previewVideo" 
                  v-model="courseForm.previewVideo" 
                  type="url" 
                  class="w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                />
                <p class="mt-1 text-xs text-gray-500">Add a preview video to showcase your course</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Status and visibility -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-medium text-gray-900">Status & Visibility</h2>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select 
                  id="status" 
                  v-model="courseForm.status" 
                  class="w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div>
                <label for="level" class="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select 
                  id="level" 
                  v-model="courseForm.level" 
                  class="w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <div class="flex items-center">
                <input 
                  id="featured" 
                  v-model="courseForm.isFeatured" 
                  type="checkbox" 
                  class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label for="featured" class="ml-2 text-sm text-gray-700">
                  Featured Course
                </label>
              </div>
            </div>
          </div>
          
          <!-- Thumbnail -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-medium text-gray-900">Thumbnail</h2>
            </div>
            <div class="p-6 space-y-4">
              <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  v-if="courseForm.thumbnail" 
                  :src="courseForm.thumbnail" 
                  alt="Course thumbnail" 
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <ImageIcon class="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <div class="flex items-center justify-center">
                <label 
                  for="thumbnail-upload" 
                  class="cursor-pointer inline-flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
                  :class="{ 'opacity-50 cursor-not-allowed': uploadingSingle }"
                >
                  <LoaderIcon v-if="uploadingSingle" class="w-4 h-4 mr-2 animate-spin" />
                  <UploadIcon v-else class="w-4 h-4 mr-2" />
                  {{ uploadingSingle ? 'Uploading...' : 'Upload Thumbnail' }}
                  <input 
                    id="thumbnail-upload" 
                    type="file" 
                    accept="image/*" 
                    class="hidden" 
                    @change="handleThumbnailUpload"
                    :disabled="uploadingSingle"
                  />
                </label>
              </div>
              <p v-if="uploadError" class="text-sm text-red-500 text-center">{{ uploadError }}</p>
            </div>
          </div>
          
          <!-- Tags -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-medium text-gray-900">Tags</h2>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <div class="flex flex-wrap gap-2 mb-3">
                  <div 
                    v-for="(tag, index) in courseForm.tags" 
                    :key="index" 
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                  >
                    {{ tag }}
                    <button @click="removeTag(index)" class="ml-1 text-primary hover:text-primary/80">
                      <XIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div class="flex">
                  <input 
                    v-model="newTag" 
                    type="text" 
                    placeholder="Add a tag" 
                    class="flex-1 px-3 py-3 text-gray-900 bg-white border border-gray-300 rounded-l-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                    @keydown.enter.prevent="addTag"
                  />
                  <button 
                    @click="addTag" 
                    class="px-3 py-3 bg-primary text-white rounded-r-lg hover:bg-primary/90 transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Requirements & Objectives -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-medium text-gray-900">Requirements & Objectives</h2>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <div class="space-y-2">
                  <div 
                    v-for="(req, index) in courseForm.requirements" 
                    :key="`req-${index}`" 
                    class="flex items-center"
                  >
                    <input 
                      v-model="courseForm.requirements[index]" 
                      type="text" 
                      class="flex-1 px-3 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                      placeholder="e.g. Basic JavaScript knowledge"
                    />
                    <button 
                      @click="removeRequirement(index)" 
                      class="ml-2 p-2 text-red-500 hover:text-red-700"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    @click="addRequirement" 
                    class="w-full flex items-center justify-center px-3 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-dashed border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
                  >
                    <PlusIcon class="w-4 h-4 mr-2" />
                    Add Requirement
                  </button>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Objectives
                </label>
                <div class="space-y-2">
                  <div 
                    v-for="(obj, index) in courseForm.objectives" 
                    :key="`obj-${index}`" 
                    class="flex items-center"
                  >
                    <input 
                      v-model="courseForm.objectives[index]" 
                      type="text" 
                      class="flex-1 px-3 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                      placeholder="e.g. Build real-world applications"
                    />
                    <button 
                      @click="removeObjective(index)" 
                      class="ml-2 p-2 text-red-500 hover:text-red-700"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    @click="addObjective" 
                    class="w-full flex items-center justify-center px-3 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-dashed border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
                  >
                    <PlusIcon class="w-4 h-4 mr-2" />
                    Add Objective
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Success notification -->
      <div 
        v-if="showSuccessNotification" 
        class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center"
      >
        <CheckCircleIcon class="w-5 h-5 mr-2" />
        <span>Course created successfully!</span>
        <button @click="showSuccessNotification = false" class="ml-4 text-white">
          <XIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSingleUploadFile } from '@/composables/core/useSingleUpload'
  import { 
    ArrowLeftIcon, SaveIcon, PlusIcon, ImageIcon, UploadIcon, 
    XIcon, TrashIcon, CheckCircleIcon, LoaderIcon
  } from 'lucide-vue-next'
  
  // Composables
  import { useCreateCourse } from '@/composables/modules/courses/useCreateCourse'
  
  // Router
  const router = useRouter()
  
  // State
  const errors = ref<Record<string, string>>({})
  const newTag = ref('')
  const saving = ref(false)
  const showSuccessNotification = ref(false)
  const uploadError = ref('')
  
  // Course form
  const courseForm = ref({
    title: '',
    slug: '',
    description: '',
    longDescription: '',
    price: 0,
    discountPrice: 0,
    thumbnail: '',
    previewVideo: '',
    tags: [] as string[],
    status: 'draft',
    level: 'beginner',
    isFeatured: false,
    requirements: [] as string[],
    objectives: [] as string[]
  })
  
  // Composables
  const { course: createdCourse, createCourse, loading: createLoading, error: createError } = useCreateCourse()
  const { singleUploadFile, loading: uploadingSingle, uploadResponse: singleUploadResponse, error: uploadFileError } = useSingleUploadFile()
  
  // Computed properties
  const isFormValid = computed(() => {
    return (
      courseForm.value.title.trim() !== '' &&
      courseForm.value.slug.trim() !== '' &&
      courseForm.value.description.trim() !== '' &&
      courseForm.value.price >= 0
    )
  })
  
  // Methods
  const validateForm = () => {
    errors.value = {}
    let isValid = true
    
    if (!courseForm.value.title.trim()) {
      errors.value.title = 'Title is required'
      isValid = false
    }
    
    if (!courseForm.value.slug.trim()) {
      errors.value.slug = 'Slug is required'
      isValid = false
    }
    
    if (!courseForm.value.description.trim()) {
      errors.value.description = 'Description is required'
      isValid = false
    }
    
    if (courseForm.value.price < 0) {
      errors.value.price = 'Price cannot be negative'
      isValid = false
    }
    
    return isValid
  }
  
  const saveCourse = async () => {
    if (!validateForm()) return
    
    try {
      saving.value = true
      
      const courseData = {
        ...courseForm.value,
        price: Number(courseForm.value.price),
        discountPrice: Number(courseForm.value.discountPrice) || 0
      }
      
      // Create new course
      const newCourse = await createCourse(courseData)
      
      if (newCourse) {
        showSuccessNotification.value = true
        
        // Reset form or redirect
        setTimeout(() => {
          router.push(`/dashboard/courses/${newCourse._id}`)
        }, 2000)
      }
    } catch (err) {
      console.error('Error creating course:', err)
      
      // Handle specific API errors
      if (createError.value) {
        if (typeof createError.value === 'string') {
          // Handle string error
          alert(createError.value)
        } else if (createError.value.message) {
          // Handle error object with message
          alert(createError.value.message)
        } else {
          // Generic error
          alert('Failed to create course. Please try again.')
        }
      }
    } finally {
      saving.value = false
    }
  }
  
  const autoGenerateSlug = () => {
    if (!courseForm.value.slug || courseForm.value.slug === '') {
      generateSlug()
    }
  }
  
  const generateSlug = () => {
    if (!courseForm.value.title) return
    
    // Convert title to slug
    const slug = courseForm.value.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    
    courseForm.value.slug = slug
  }
  
  const handleThumbnailUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length === 0) return
    
    const file = input.files[0]
    uploadError.value = ''
    
    try {
      // Upload file using singleUploadFile
      const result = await singleUploadFile(file)
      console.log(singleUploadResponse.value, 'res ult here')
      
      if (singleUploadResponse.value &&singleUploadResponse.value.url) {
        // Set the returned URL as the thumbnail
        courseForm.value.thumbnail = singleUploadResponse.value.url
      } else {
        uploadError.value = 'Failed to upload thumbnail. Please try again.'
      }
    } catch (err) {
      console.error('Error uploading thumbnail:', err)
      uploadError.value = uploadFileError.value || 'Failed to upload thumbnail. Please try again.'
    }
  }
  
  // Tags
  const addTag = () => {
    if (!newTag.value.trim()) return
    
    if (!courseForm.value.tags.includes(newTag.value.trim())) {
      courseForm.value.tags.push(newTag.value.trim())
    }
    
    newTag.value = ''
  }
  
  const removeTag = (index: number) => {
    courseForm.value.tags.splice(index, 1)
  }
  
  // Requirements
  const addRequirement = () => {
    courseForm.value.requirements.push('')
  }
  
  const removeRequirement = (index: number) => {
    courseForm.value.requirements.splice(index, 1)
  }
  
  // Objectives
  const addObjective = () => {
    courseForm.value.objectives.push('')
  }
  
  const removeObjective = (index: number) => {
    courseForm.value.objectives.splice(index, 1)
  }
  
  // Initialize
  onMounted(() => {
    // Add a default empty requirement and objective if none exist
    if (courseForm.value.requirements.length === 0) {
      addRequirement()
    }
    
    if (courseForm.value.objectives.length === 0) {
      addObjective()
    }
  })
  
  definePageMeta({
    layout: 'dashboard'
  })
  </script>