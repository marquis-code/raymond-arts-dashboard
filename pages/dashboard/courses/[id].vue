<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isNewCourse ? 'Create New Course' : 'Edit Course' }}
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ isNewCourse ? 'Create a new course for your students' : 'Update course details and content' }}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          @click="router.back()" 
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
        >
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          Back
        </button>
        <button 
          @click="saveCourse" 
          :disabled="saving || uploadingSingle"
          class="inline-flex items-center bg-black text-white px-4 py-2 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <LoaderIcon v-if="saving || uploadingSingle" class="w-4 h-4 mr-2 animate-spin" />
          <SaveIcon v-else class="w-4 h-4 mr-2" />
          {{ isNewCourse ? 'Create Course' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center p-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
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
                  class="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                  placeholder="e.g. Advanced JavaScript Masterclass"
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
                    class="flex-1 px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-l-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                    placeholder="e.g. advanced-javascript-masterclass"
                  />
                  <button 
                    @click="generateSlug" 
                    type="button"
                    class="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg text-gray-700 hover:bg-gray-200 transition-colors duration-200"
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
                  class="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
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
                  class="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                  placeholder="Detailed description of your course"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        
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
                    class="w-full pl-7 pr-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
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
                    class="w-full pl-7 pr-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                    placeholder="19.99"
                  />
                </div>
                <p class="mt-1 text-xs text-gray-500">Leave empty for no discount</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Course Content</h2>
            <button 
              v-if="!isNewCourse"
              @click="addSection" 
              class="inline-flex items-center px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
            >
              <PlusIcon class="w-4 h-4 mr-1" />
              Add Section
            </button>
          </div>
          
          <div v-if="isNewCourse" class="p-6 text-center">
            <p class="text-gray-500">
              You can add sections and lessons after creating the course.
            </p>
          </div>
          
          <div v-else-if="!courseSections || courseSections.length === 0" class="p-6 text-center">
            <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BookOpenIcon class="w-8 h-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900">No sections yet</h3>
            <p class="mt-1 text-sm text-gray-500">
              Get started by adding your first section
            </p>
            <button 
              @click="addSection" 
              class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Add Section
            </button>
          </div>
          
          <div v-else class="divide-y divide-gray-100">
            <div 
              v-for="(section, sectionIndex) in courseSections" 
              :key="section._id || `new-section-${sectionIndex}`" 
              class="p-6 space-y-4"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <input 
                    v-model="section.title" 
                    type="text" 
                    class="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                    placeholder="Section Title"
                  />
                  <textarea 
                    v-model="section.description" 
                    rows="2" 
                    class="mt-2 w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                    placeholder="Section Description (optional)"
                  ></textarea>
                </div>
                <div class="ml-4 flex items-start space-x-2">
                  <button 
                    @click="moveSection(sectionIndex, -1)" 
                    :disabled="sectionIndex === 0"
                    class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move Up"
                  >
                    <ChevronUpIcon class="w-5 h-5" />
                  </button>
                  <button 
                    @click="moveSection(sectionIndex, 1)" 
                    :disabled="sectionIndex === courseSections.length - 1"
                    class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move Down"
                  >
                    <ChevronDownIcon class="w-5 h-5" />
                  </button>
                  <button 
                    @click="deleteSection(sectionIndex)" 
                    class="p-1 text-red-500 hover:text-red-700"
                    title="Delete Section"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div class="pl-4 border-l-2 border-gray-200 space-y-3">
                <div 
                  v-for="(lesson, lessonIndex) in section.lessons" 
                  :key="lesson._id || `new-lesson-${sectionIndex}-${lessonIndex}`" 
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center flex-1">
                    <div class="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                      {{ lessonIndex + 1 }}
                    </div>
                    <div class="ml-3 flex-1">
                      <input 
                        v-model="lesson.title" 
                        type="text" 
                        class="w-full px-3 py-1 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                        placeholder="Lesson Title"
                      />
                    </div>
                    <div class="ml-3 flex items-center space-x-2">
                      <select 
                        v-model="lesson.type" 
                        class="px-2 py-1 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                      >
                        <option value="video">Video</option>
                        <option value="article">Article</option>
                        <option value="quiz">Quiz</option>
                      </select>
                      <div class="flex items-center">
                        <input 
                          :id="`preview-${sectionIndex}-${lessonIndex}`" 
                          v-model="lesson.isPreview" 
                          type="checkbox" 
                          class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label :for="`preview-${sectionIndex}-${lessonIndex}`" class="ml-2 text-sm text-gray-700">
                          Preview
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="ml-4 flex items-center space-x-2">
                    <button 
                      @click="editLesson(section, lesson)" 
                      class="p-1 text-primary hover:text-primary/80"
                      title="Edit Lesson"
                    >
                      <EditIcon class="w-4 h-4" />
                    </button>
                    <button 
                      @click="moveLesson(section, lessonIndex, -1)" 
                      :disabled="lessonIndex === 0"
                      class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <ChevronUpIcon class="w-4 h-4" />
                    </button>
                    <button 
                      @click="moveLesson(section, lessonIndex, 1)" 
                      :disabled="lessonIndex === section.lessons.length - 1"
                      class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <ChevronDownIcon class="w-4 h-4" />
                    </button>
                    <button 
                      @click="deleteLesson(section, lessonIndex)" 
                      class="p-1 text-red-500 hover:text-red-700"
                      title="Delete Lesson"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <button 
                  @click="addLesson(section)" 
                  class="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-dashed border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
                >
                  <PlusIcon class="w-4 h-4 mr-2" />
                  Add Lesson
                </button>
              </div>
            </div>
            
            <div class="p-6">
              <button 
                @click="addSection" 
                class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-dashed border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
              >
                <PlusIcon class="w-4 h-4 mr-2" />
                Add Another Section
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="space-y-6">
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
                class="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
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
                class="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
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
                class="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
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
                  class="flex-1 px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-l-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                  @keydown.enter.prevent="addTag"
                />
                <button 
                  @click="addTag" 
                  class="px-3 py-2 bg-primary text-white rounded-r-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
        
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
                    class="flex-1 px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
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
                  class="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-dashed border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
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
                    class="flex-1 px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
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
                  class="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-dashed border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
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
    
    <Teleport to="body">
      <div v-if="showLessonModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showLessonModal = false"></div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {{ currentLesson._id ? 'Edit Lesson' : 'Add Lesson' }}
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div>
                      <label for="lesson-title" class="block text-sm font-medium text-gray-700 mb-1">
                        Title <span class="text-red-500">*</span>
                      </label>
                      <input 
                        id="lesson-title" 
                        v-model="currentLesson.title" 
                        type="text" 
                        required
                        class="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                        placeholder="Lesson Title"
                      />
                    </div>
                    
                    <div>
                      <label for="lesson-description" class="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea 
                        id="lesson-description" 
                        v-model="currentLesson.description" 
                        rows="3" 
                        class="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                        placeholder="Lesson Description"
                      ></textarea>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label for="lesson-type" class="block text-sm font-medium text-gray-700 mb-1">
                          Type <span class="text-red-500">*</span>
                        </label>
                        <select 
                          id="lesson-type" 
                          v-model="currentLesson.type" 
                          required
                          class="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                        >
                          <option value="video">Video</option>
                          <option value="article">Article</option>
                          <option value="quiz">Quiz</option>
                        </select>
                      </div>
                      
                      <div>
                        <label for="lesson-duration" class="block text-sm font-medium text-gray-700 mb-1">
                          Duration (minutes)
                        </label>
                        <input 
                          id="lesson-duration" 
                          v-model="currentLesson.durationInMinutes" 
                          type="number" 
                          min="0" 
                          class="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                          placeholder="e.g. 15"
                        />
                      </div>
                    </div>
                    
                    <div v-if="currentLesson.type === 'video'">
                      <label for="lesson-video" class="block text-sm font-medium text-gray-700 mb-1">
                        Video URL
                      </label>
                      <input 
                        id="lesson-video" 
                        v-model="currentLesson.videoUrl" 
                        type="text" 
                        class="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                        placeholder="e.g. https://www.youtube.com/watch?v=..."
                      />
                    </div>
                    
                    <div v-if="currentLesson.type === 'article' || currentLesson.type === 'quiz'">
                      <label for="lesson-content" class="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <textarea 
                        id="lesson-content" 
                        v-model="currentLesson.content" 
                        rows="8" 
                        class="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200"
                        placeholder="Lesson content in markdown format"
                      ></textarea>
                    </div>
                    
                    <div class="flex items-center">
                      <input 
                        id="lesson-preview" 
                        v-model="currentLesson.isPreview" 
                        type="checkbox" 
                        class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label for="lesson-preview" class="ml-2 text-sm text-gray-700">
                        Make this lesson available for preview
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="saveLessonChanges" 
                type="button" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save
              </button>
              <button 
                @click="showLessonModal = false" 
                type="button" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeftIcon, SaveIcon, PlusIcon, BookOpenIcon, TrashIcon, 
  ChevronUpIcon, ChevronDownIcon, EditIcon, ImageIcon, UploadIcon, 
  XIcon, LoaderIcon
} from 'lucide-vue-next'

// Composables
import { useCreateCourse } from '@/composables/modules/courses/useCreateCourse'
import { useGetCourseById } from '@/composables/modules/courses/useGetCourseById'
import { useUpdateCourse } from '@/composables/modules/courses/useUpdateCourse'
import { useCreateSection } from '@/composables/modules/courses/useCreateSection'
import { useUpdateSection } from '@/composables/modules/courses/useUpdateSection'
import { useDeleteSection } from '@/composables/modules/courses/useDeleteSection'
import { useCreateLesson } from '@/composables/modules/courses/useCreateLesson'
import { useUpdateLesson } from '@/composables/modules/courses/useUpdateLesson'
import { useDeleteLesson } from '@/composables/modules/courses/useDeleteLesson'
import { useSingleUploadFile } from '@/composables/core/useSingleUpload'

// Router
const route = useRoute()
const router = useRouter()

// State
const courseId = computed(() => route.params.id as string)
const isNewCourse = computed(() => courseId.value === 'new')
const loading = ref(false)
const saving = ref(false)
const errors = ref<Record<string, string>>({})
const newTag = ref('')
const showLessonModal = ref(false)
const currentSection = ref<any>(null)
const currentLesson = ref<any>({
  title: '',
  description: '',
  type: 'video',
  videoUrl: '',
  content: '',
  durationInMinutes: 0,
  isPreview: false
})
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

// Sections and lessons
const courseSections = ref<any[]>([])

// Composables
const { course: createdCourse, createCourse, loading: createLoading } = useCreateCourse()
const { course, loading: getCourseLoading, getCourseById } = useGetCourseById()
const { updateCourse, loading: updateLoading } = useUpdateCourse()
const { createSection, loading: createSectionLoading } = useCreateSection()
const { updateSection, loading: updateSectionLoading } = useUpdateSection()
const { deleteSection: deleteSectionAction, loading: deleteSectionLoading } = useDeleteSection()
const { createLesson, loading: createLessonLoading } = useCreateLesson()
const { updateLesson: updateLessonAction, loading: updateLessonLoading } = useUpdateLesson()
const { deleteLesson: deleteLessonAction, loading: deleteLessonLoading } = useDeleteLesson()
const { singleUploadFile, loading: uploadingSingle, uploadResponse: singleUploadResponse, error: uploadFileError } = useSingleUploadFile()

// Methods
const fetchCourse = async () => {
  if (isNewCourse.value) return
  
  try {
    loading.value = true
    await getCourseById(courseId.value)
    
    // Populate form with course data
    if (course.value) {
      courseForm.value = {
        title: course.value.title || '',
        slug: course.value.slug || '',
        description: course.value.description || '',
        longDescription: course.value.longDescription || '',
        price: course.value.price || 0,
        discountPrice: course.value.discountPrice || 0,
        thumbnail: course.value.thumbnail || '',
        previewVideo: course.value.previewVideo || '',
        tags: course.value.tags || [],
        status: course.value.status || 'draft',
        level: course.value.level || 'beginner',
        isFeatured: course.value.isFeatured || false,
        requirements: course.value.requirements || [],
        objectives: course.value.objectives || []
      }
      
      // Fetch sections and lessons
      courseSections.value = course.value.sections || []
    }
  } catch (err) {
    console.error('Error fetching course:', err)
  } finally {
    loading.value = false
  }
}

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
    
    if (isNewCourse.value) {
      // Create new course
      const newCourse = await createCourse(courseData)
      if (newCourse) {
        router.push(`/admin/courses/${newCourse._id}`)
      }
    } else {
      // Update existing course
      await updateCourse(courseId.value, courseData)
      
      // Save sections and lessons
      await saveSectionsAndLessons()
    }
  } catch (err) {
    console.error('Error saving course:', err)
  } finally {
    saving.value = false
  }
}

const saveSectionsAndLessons = async () => {
  // This is a simplified version - in a real app, you'd need to handle
  // creating, updating, and deleting sections and lessons properly
  
  for (const section of courseSections.value) {
    if (section._id) {
      // Update existing section
      await updateSection(section._id, {
        title: section.title,
        description: section.description,
        order: section.order
      })
    } else {
      // Create new section
      const newSection = await createSection({
        title: section.title,
        description: section.description,
        order: section.order,
        course: courseId.value
      })
      
      if (newSection) {
        section._id = newSection._id
      }
    }
    
    // Handle lessons
    if (section.lessons && section.lessons.length > 0) {
      for (const lesson of section.lessons) {
        if (lesson._id) {
          // Update existing lesson
          await updateLessonAction(lesson._id, {
            title: lesson.title,
            description: lesson.description,
            type: lesson.type,
            videoUrl: lesson.videoUrl,
            content: lesson.content,
            durationInMinutes: lesson.durationInMinutes,
            isPreview: lesson.isPreview,
            order: lesson.order
          })
        } else {
          // Create new lesson
          await createLesson({
            title: lesson.title,
            description: lesson.description,
            type: lesson.type,
            videoUrl: lesson.videoUrl,
            content: lesson.content,
            durationInMinutes: lesson.durationInMinutes,
            isPreview: lesson.isPreview,
            order: lesson.order,
            section: section._id,
            course: courseId.value
          })
        }
      }
    }
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
    
    if (singleUploadResponse.value && singleUploadResponse.value.url) {
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

// Sections
const addSection = () => {
  courseSections.value.push({
    title: 'New Section',
    description: '',
    order: courseSections.value.length,
    lessons: []
  })
}

const moveSection = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= courseSections.value.length) return
  
  // Swap sections
  const temp = courseSections.value[index]
  courseSections.value[index] = courseSections.value[newIndex]
  courseSections.value[newIndex] = temp
  
  // Update order
  courseSections.value.forEach((section, idx) => {
    section.order = idx
  })
}

const deleteSection = (index: number) => {
  if (confirm('Are you sure you want to delete this section and all its lessons?')) {
    const section = courseSections.value[index]
    
    if (section._id) {
      // Delete from database
      deleteSectionAction(section._id)
    }
    
    // Remove from array
    courseSections.value.splice(index, 1)
    
    // Update order
    courseSections.value.forEach((section, idx) => {
      section.order = idx
    })
  }
}

// Lessons
const addLesson = (section: any) => {
  currentSection.value = section
  currentLesson.value = {
    title: '',
    description: '',
    type: 'video',
    videoUrl: '',
    content: '',
    durationInMinutes: 0,
    isPreview: false,
    order: section.lessons ? section.lessons.length : 0
  }
  showLessonModal.value = true
}

const editLesson = (section: any, lesson: any) => {
  currentSection.value = section
  currentLesson.value = { ...lesson }
  showLessonModal.value = true
}

const saveLessonChanges = () => {
  if (!currentLesson.value.title.trim()) {
    alert('Lesson title is required')
    return
  }
  
  if (!currentSection.value.lessons) {
    currentSection.value.lessons = []
  }
  
  const existingIndex = currentSection.value.lessons.findIndex(
    (l: any) => l._id === currentLesson.value._id
  )
  
  if (existingIndex >= 0) {
    // Update existing lesson
    currentSection.value.lessons[existingIndex] = { ...currentLesson.value }
  } else {
    // Add new lesson
    currentSection.value.lessons.push({ ...currentLesson.value })
  }
  
  showLessonModal.value = false
}

const moveLesson = (section: any, index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= section.lessons.length) return
  
  // Swap lessons
  const temp = section.lessons[index]
  section.lessons[index] = section.lessons[newIndex]
  section.lessons[newIndex] = temp
  
  // Update order
  section.lessons.forEach((lesson: any, idx: number) => {
    lesson.order = idx
  })
}

const deleteLesson = (section: any, index: number) => {
  if (confirm('Are you sure you want to delete this lesson?')) {
    const lesson = section.lessons[index]
    
    if (lesson._id) {
      // Delete from database
      deleteLessonAction(lesson._id)
    }
    
    // Remove from array
    section.lessons.splice(index, 1)
    
    // Update order
    section.lessons.forEach((lesson: any, idx: number) => {
      lesson.order = idx
    })
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchCourse()
})

watch(isNewCourse, (newValue) => {
  if (!newValue) {
    fetchCourse();
  }
}, { immediate: true });

definePageMeta({
  layout: 'dashboard'
})
</script>