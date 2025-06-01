<template>
  <div class="artwork-upload-container">
    <div
      class="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:shadow-xl"
    >
      <!-- Header with animated gradient -->
      <div
        class="relative bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-5 overflow-hidden"
      >
        <div
          class="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]"
        ></div>
        <h2
          class="text-xl font-bold text-white relative z-10 flex items-center gap-2"
        >
          <span class="flex items-center gap-2">
            <PaintBrushIcon class="h-5 w-5" />
            Add New Artwork
          </span>
        </h2>
      </div>

      <!-- Form Content -->
      <div class="p-6">
        <form @submit.prevent="saveProduct" class="space-y-8">
          <!-- Main Information Section -->
          <div class="bg-violet-50/50 p-5 rounded-xl border border-violet-100">
            <h3
              class="text-lg font-semibold text-violet-800 mb-4 flex items-center"
            >
              <InfoIcon class="h-5 w-5 mr-2" />
              Basic Information
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div class="space-y-5">
                <div class="form-group">
                  <div class="flex items-center justify-between">
                    <label for="product-name" class="form-label">
                      Artwork Name <span class="text-red-500">*</span>
                    </label>
                    <Tooltip
                      text="The title of your artwork as it will appear to customers"
                    >
                      <InfoCircleIcon
                        class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors"
                      />
                    </Tooltip>
                  </div>
                  <input
                    type="text"
                    id="product-name"
                    v-model="currentProduct.name"
                    class="form-input"
                    placeholder="e.g. Sunset Horizon"
                    required
                  />
                </div>

                <div class="form-group">
                  <div class="flex items-center justify-between">
                    <label class="form-label">
                      Description <span class="text-red-500">*</span>
                    </label>
                    <Tooltip
                      text="Rich description of your artwork with formatting options"
                    >
                      <InfoCircleIcon
                        class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors"
                      />
                    </Tooltip>
                  </div>
                  <div class="quill-wrapper">
                    <CoreQuillEditor
                      v-model="currentProduct.description"
                      placeholder="Describe your artwork with rich formatting..."
                    />
                  </div>
                  <!-- Content Preview for debugging -->
                  <div
                    v-if="showContentPreview && currentProduct.description"
                    class="mt-2 p-2 bg-gray-50 rounded text-xs"
                  >
                    <strong>HTML Content:</strong>
                    <pre class="whitespace-pre-wrap">{{
                      currentProduct.description
                    }}</pre>
                  </div>
                </div>

                <div class="form-group">
                  <div class="flex items-center justify-between">
                    <label for="product-category" class="form-label">
                      Category <span class="text-red-500">*</span>
                    </label>
                    <Tooltip
                      text="The category that best represents your artwork"
                    >
                      <InfoCircleIcon
                        class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors"
                      />
                    </Tooltip>
                  </div>
                  <select
                    id="product-category"
                    v-model="currentProduct.category"
                    class="form-input"
                    required
                  >
                    <option disabled value="">Select a category</option>
                    <option
                      v-for="category in categories"
                      :key="category._id"
                      :value="category._id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <div class="flex items-center justify-between">
                    <label for="product-tags" class="form-label">Tags</label>
                    <Tooltip
                      text="Keywords that help customers find your artwork (separate with commas)"
                    >
                      <InfoCircleIcon
                        class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors"
                      />
                    </Tooltip>
                  </div>
                  <div class="relative">
                    <input
                      type="text"
                      id="product-tags"
                      v-model="tagsInput"
                      class="form-input pr-10"
                      placeholder="abstract, modern, colorful"
                    />
                    <TagIcon
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-violet-400"
                    />
                  </div>

                  <!-- Tags Preview -->
                  <div
                    v-if="parsedTags.length > 0"
                    class="flex flex-wrap gap-2 mt-2"
                  >
                    <span
                      v-for="(tag, index) in parsedTags"
                      :key="index"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 animate-fadeIn"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-5">
                <div class="grid grid-cols-2 gap-4">
                  <div class="form-group">
                    <div class="flex items-center justify-between">
                      <label for="product-price" class="form-label">
                        Base Price ($) <span class="text-red-500">*</span>
                      </label>
                      <Tooltip
                        text="The base price (will be overridden by size-specific pricing if configured)"
                      >
                        <InfoCircleIcon
                          class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors"
                        />
                      </Tooltip>
                    </div>
                    <div class="relative">
                      <span
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >$</span
                      >
                      <input
                        type="number"
                        id="product-price"
                        v-model="currentProduct.price"
                        min="0"
                        step="0.01"
                        class="form-input pl-8"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div class="form-group">
                    <div class="flex items-center justify-between">
                      <label for="product-discount-price" class="form-label"
                        >Discount Price</label
                      >
                      <Tooltip text="Optional promotional or sale price">
                        <InfoCircleIcon
                          class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors"
                        />
                      </Tooltip>
                    </div>
                    <div class="relative">
                      <span
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >$</span
                      >
                      <input
                        type="number"
                        id="product-discount-price"
                        v-model="currentProduct.discountPrice"
                        min="0"
                        step="0.01"
                        class="form-input pl-8"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <div class="flex items-center justify-between">
                    <label class="form-label">Base Dimensions & Weight</label>
                    <Tooltip
                      text="Default physical measurements (can be overridden per size)"
                    >
                      <InfoCircleIcon
                        class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors"
                      />
                    </Tooltip>
                  </div>
                  <div class="grid grid-cols-4 gap-3">
                    <div class="relative">
                      <input
                        type="number"
                        v-model="currentProduct.width"
                        min="0"
                        step="0.1"
                        class="form-input pl-2 pr-10"
                        placeholder="0"
                      />
                      <span
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs"
                        >W (cm)</span
                      >
                    </div>
                    <div class="relative">
                      <input
                        type="number"
                        v-model="currentProduct.height"
                        min="0"
                        step="0.1"
                        class="form-input pl-2 pr-10"
                        placeholder="0"
                      />
                      <span
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs"
                        >H (cm)</span
                      >
                    </div>
                    <div class="relative">
                      <input
                        type="number"
                        v-model="currentProduct.length"
                        min="0"
                        step="0.1"
                        class="form-input pl-2 pr-10"
                        placeholder="0"
                      />
                      <span
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs"
                        >L (cm)</span
                      >
                    </div>
                    <div class="relative">
                      <input
                        type="number"
                        v-model="currentProduct.weight"
                        min="0"
                        step="0.1"
                        class="form-input pl-2 pr-10"
                        placeholder="0"
                      />
                      <span
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs"
                        >kg</span
                      >
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <div class="flex items-center justify-between">
                    <label class="form-label">Artwork Status</label>
                    <Tooltip text="Special status flags for your artwork">
                      <InfoCircleIcon
                        class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors"
                      />
                    </Tooltip>
                  </div>
                  <div class="grid grid-cols-2 gap-y-3">
                    <div class="flex items-center space-x-2">
                      <div
                        class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
                      >
                        <input
                          type="checkbox"
                          id="product-available"
                          v-model="currentProduct.isAvailable"
                          class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label
                          for="product-available"
                          class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                      <label
                        for="product-available"
                        class="text-sm text-gray-700"
                        >Available</label
                      >
                    </div>

                    <div class="flex items-center space-x-2">
                      <div
                        class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
                      >
                        <input
                          type="checkbox"
                          id="product-featured"
                          v-model="currentProduct.isFeatured"
                          class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label
                          for="product-featured"
                          class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                      <label
                        for="product-featured"
                        class="text-sm text-gray-700"
                        >Featured</label
                      >
                    </div>

                    <div class="flex items-center space-x-2">
                      <div
                        class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
                      >
                        <input
                          type="checkbox"
                          id="product-new"
                          v-model="currentProduct.isNew"
                          class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label
                          for="product-new"
                          class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                      <label for="product-new" class="text-sm text-gray-700"
                        >New</label
                      >
                    </div>

                    <div class="flex items-center space-x-2">
                      <div
                        class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
                      >
                        <input
                          type="checkbox"
                          id="product-bestseller"
                          v-model="currentProduct.isBestseller"
                          class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label
                          for="product-bestseller"
                          class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                      <label
                        for="product-bestseller"
                        class="text-sm text-gray-700"
                        >Bestseller</label
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Size Configuration Section -->
          <div
            class="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100"
          >
            <h3
              class="text-lg font-semibold text-emerald-800 mb-4 flex items-center"
            >
              <RulerIcon class="h-5 w-5 mr-2" />
              Size Configuration
            </h3>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <label class="form-label">Available Sizes</label>
                <Tooltip
                  text="Configure different size options with specific pricing and dimensions"
                >
                  <InfoCircleIcon
                    class="h-4 w-4 text-emerald-400 hover:text-emerald-600 transition-colors"
                  />
                </Tooltip>
              </div>

              <div class="space-y-3">
                <div
                  v-for="(size, index) in sizeVariants"
                  :key="index"
                  class="size-variant-card"
                >
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <select
                        v-model="size.size"
                        class="form-input text-sm w-32"
                      >
                        <option value="">Select Size</option>
                        <option value="small">Small</option>
                        <option value="basic">Basic</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                           <!-- Color Selection -->
                      <select
                        v-model="size.color"
                        class="form-input text-sm w-28"
                      >
                        <option value="black">Black</option>
                        <option value="white">White</option>
                      </select>
                      <div class="relative w-96">
                        <span
                          class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
                          >$</span
                        >
                        <input
                          type="number"
                          v-model="size.price"
                          class="form-input text-sm w-32 pl-6"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <button
                      @click="removeSizeVariant(index)"
                      type="button"
                      class="text-red-500 hover:text-red-700 transition-colors p-1 rounded-md hover:bg-red-50"
                    >
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>

                  <!-- Optional dimensions for this size -->
                  <div class="grid grid-cols-3 gap-3">
                    <div class="relative">
                      <input
                        type="number"
                        v-model="size.width"
                        class="form-input text-sm pl-2 pr-8"
                        placeholder="Width"
                        min="0"
                        step="0.1"
                      />
                      <span
                        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs"
                        >cm</span
                      >
                    </div>
                    <div class="relative">
                      <input
                        type="number"
                        v-model="size.height"
                        class="form-input text-sm pl-2 pr-8"
                        placeholder="Height"
                        min="0"
                        step="0.1"
                      />
                      <span
                        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs"
                        >cm</span
                      >
                    </div>
                    <div class="relative">
                      <input
                        type="number"
                        v-model="size.length"
                        class="form-input text-sm pl-2 pr-8"
                        placeholder="Length"
                        min="0"
                        step="0.1"
                      />
                      <span
                        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs"
                        >cm</span
                      >
                    </div>
                  </div>
                </div>

                <button
                  @click="addSizeVariant"
                  type="button"
                  class="add-size-button"
                >
                  <PlusIcon class="h-4 w-4 mr-1" />
                  Add Size Option
                </button>
              </div>
            </div>
          </div>

          <!-- Detailed Information Section with Quill Editors -->
          <div class="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
            <h3
              class="text-lg font-semibold text-blue-800 mb-6 flex items-center"
            >
              <FileTextIcon class="h-5 w-5 mr-2" />
              Detailed Information
            </h3>

            <div class="space-y-8">
              <!-- Product Information -->
              <div class="form-group">
                <div class="flex items-center justify-between mb-3">
                  <label class="form-label text-base font-semibold"
                    >Product Information</label
                  >
                  <Tooltip
                    text="Detailed information about your artwork including materials, techniques, inspiration, and story"
                  >
                    <InfoCircleIcon
                      class="h-4 w-4 text-blue-400 hover:text-blue-600 transition-colors"
                    />
                  </Tooltip>
                </div>
                <div class="quill-wrapper">
                  <CoreQuillEditor
                    v-model="currentProduct.productInfo"
                    placeholder="Include details about materials, techniques, inspiration, dimensions, care instructions, and the story behind your artwork..."
                  />
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  This content will be displayed as formatted HTML on the
                  product page.
                </p>
              </div>

              <!-- Return Policy -->
              <div class="form-group">
                <div class="flex items-center justify-between mb-3">
                  <label class="form-label text-base font-semibold"
                    >Return & Refund Policy</label
                  >
                  <Tooltip
                    text="Your return and refund policy for this artwork"
                  >
                    <InfoCircleIcon
                      class="h-4 w-4 text-blue-400 hover:text-blue-600 transition-colors"
                    />
                  </Tooltip>
                </div>
                <div class="quill-wrapper">
                  <CoreQuillEditor
                    v-model="currentProduct.returnPolicy"
                    placeholder="Specify your return timeframe, conditions, process, and any exceptions for this artwork..."
                  />
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  This policy will be displayed as formatted HTML to customers.
                </p>
              </div>

              <!-- Shipping Information -->
              <div class="form-group">
                <div class="flex items-center justify-between mb-3">
                  <label class="form-label text-base font-semibold"
                    >Shipping Information</label
                  >
                  <Tooltip text="Shipping details and delivery information">
                    <InfoCircleIcon
                      class="h-4 w-4 text-blue-400 hover:text-blue-600 transition-colors"
                    />
                  </Tooltip>
                </div>
                <div class="quill-wrapper">
                  <CoreQuillEditor
                    v-model="currentProduct.shippingInfo"
                    placeholder="Include shipping costs, delivery times, packaging details, and any special shipping requirements..."
                  />
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  This information will be displayed as formatted HTML on the
                  product page.
                </p>
              </div>

              <!-- Promotion Text -->
              <div class="form-group">
                <div class="flex items-center justify-between">
                  <label
                    for="promotion-text"
                    class="form-label text-base font-semibold"
                    >Promotional Text</label
                  >
                  <Tooltip text="Optional promotional message or special offer">
                    <InfoCircleIcon
                      class="h-4 w-4 text-blue-400 hover:text-blue-600 transition-colors"
                    />
                  </Tooltip>
                </div>
                <div class="relative">
                  <input
                    type="text"
                    id="promotion-text"
                    v-model="currentProduct.promotionText"
                    class="form-input pr-10"
                    placeholder="e.g. Limited time offer: 20% off this week!"
                  />
                  <MegaphoneIcon
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Image Upload Section -->
          <div class="bg-violet-50/50 p-5 rounded-xl border border-violet-100">
            <h3
              class="text-lg font-semibold text-violet-800 mb-4 flex items-center"
            >
              <ImageIcon class="h-5 w-5 mr-2" />
              Artwork Images
              <span class="text-red-500 ml-1">*</span>
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Upload Area -->
              <div>
                <div class="form-group">
                  <div class="flex items-center justify-between">
                    <label class="form-label">Main Images</label>
                    <Tooltip
                      text="Upload high-quality images of your artwork (multiple images allowed)"
                    >
                      <InfoCircleIcon
                        class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors"
                      />
                    </Tooltip>
                  </div>

                  <div
                    class="upload-area group"
                    @dragover.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false"
                    @drop.prevent="handleFileDrop"
                    :class="{ 'border-violet-500 bg-violet-50': isDragging }"
                  >
                    <div class="text-center">
                      <UploadCloudIcon
                        class="mx-auto h-12 w-12 text-violet-400 group-hover:text-violet-600 transition-colors"
                      />
                      <div class="mt-2">
                        <label for="file-upload" class="upload-button">
                          <span>Choose files</span>
                          <input
                            id="file-upload"
                            type="file"
                            class="sr-only"
                            multiple
                            accept="image/*"
                            @change="handleImageUpload"
                          />
                        </label>
                        <span class="text-sm text-gray-500 ml-2"
                          >or drag and drop</span
                        >
                      </div>
                      <p class="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>

                      <!-- Upload Progress -->
                      <div
                        v-if="uploadingBatch || uploadingSingle"
                        class="mt-3"
                      >
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            class="bg-violet-600 h-2.5 rounded-full progress-bar-animate"
                            :style="{
                              width: uploadProgress + '%',
                              transition: 'width 0.3s ease-in-out',
                            }"
                          ></div>
                        </div>
                        <p class="text-sm text-violet-600 mt-1 animate-pulse">
                          {{
                            uploadingBatch
                              ? "Uploading multiple images..."
                              : "Uploading image..."
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-group mt-4">
                  <div class="flex items-center justify-between">
                    <label for="product-attributes" class="form-label"
                      >Additional Attributes</label
                    >
                    <Tooltip
                      text="JSON format for additional artwork details like materials, techniques, etc."
                    >
                      <InfoCircleIcon
                        class="h-4 w-4 text-violet-400 hover:text-violet-600 transition-colors"
                      />
                    </Tooltip>
                  </div>
                  <textarea
                    id="product-attributes"
                    v-model="attributesInput"
                    rows="3"
                    class="form-input font-mono text-sm"
                    placeholder='{"material": "Canvas", "style": "Abstract", "technique": "Oil"}'
                  ></textarea>

                  <!-- JSON Preview -->
                  <div
                    v-if="isValidJSON && attributesInput"
                    class="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200 animate-fadeIn"
                  >
                    <div
                      v-for="(value, key) in parsedAttributes"
                      :key="key"
                      class="flex items-center text-sm"
                    >
                      <span class="font-medium text-gray-700">{{ key }}:</span>
                      <span class="ml-2 text-gray-600">{{ value }}</span>
                    </div>
                  </div>
                  <p
                    v-else-if="attributesInput && !isValidJSON"
                    class="text-red-500 text-xs mt-1"
                  >
                    Invalid JSON format
                  </p>
                </div>
              </div>

              <!-- Image Previews -->
              <div>
                <div class="form-group">
                  <div class="flex items-center justify-between mb-2">
                    <label class="form-label">Image Previews</label>
                    <span class="text-sm text-gray-500"
                      >{{ imagePreviewUrls.length }} image(s)</span
                    >
                  </div>

                  <div
                    v-if="imagePreviewUrls.length > 0"
                    class="image-preview-container"
                  >
                    <div
                      v-for="(url, index) in imagePreviewUrls"
                      :key="index"
                      class="image-preview-item"
                    >
                      <div class="relative group overflow-hidden rounded-lg">
                        <img :src="url" alt="Preview" class="preview-image" />
                        <div class="image-overlay">
                          <button
                            @click="removeImage(index)"
                            class="image-delete-button"
                            type="button"
                          >
                            <TrashIcon class="h-4 w-4" />
                          </button>
                          <div class="image-info">
                            <span class="text-xs font-medium"
                              >Image {{ index + 1 }}</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Empty slots for visual balance -->
                    <div
                      v-for="i in Math.max(0, 6 - imagePreviewUrls.length)"
                      :key="`empty-${i}`"
                      class="empty-preview-slot"
                    ></div>
                  </div>

                  <div
                    v-else
                    class="flex items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300"
                  >
                    <p class="text-sm text-gray-500">No images uploaded yet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Debug Section (Remove in production) -->
          <div v-if="showDebugInfo" class="bg-gray-50 p-4 rounded-lg border">
            <h4 class="font-semibold mb-2">Debug: Payload Preview</h4>
            <pre
              class="text-xs bg-white p-3 rounded border overflow-auto max-h-40"
              >{{ JSON.stringify(getPayloadPreview(), null, 2) }}</pre
            >
            <button
              @click="showDebugInfo = false"
              type="button"
              class="mt-2 text-xs text-gray-500 hover:text-gray-700"
            >
              Hide Debug Info
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between items-center">
            <button
              @click="showDebugInfo = !showDebugInfo"
              type="button"
              class="text-xs text-gray-500 hover:text-gray-700"
            >
              {{ showDebugInfo ? "Hide" : "Show" }} Payload Preview
            </button>

            <div class="flex space-x-3">
              <button
                @click="closeProductModal"
                type="button"
                class="cancel-button"
              >
                <XIcon class="h-4 w-4 mr-1" />
                Cancel
              </button>

              <button
                type="submit"
                class="save-button"
                :disabled="loading || uploadingBatch || uploadingSingle"
              >
                <div v-if="loading" class="flex items-center">
                  <svg
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </div>
                <div v-else class="flex items-center">
                  <SaveIcon class="h-4 w-4 mr-1" />
                  Save Artwork
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from "vue";
import { useSingleUploadFile } from "@/composables/core/useSingleUpload";
import { useCreateProduct } from "@/composables/modules/products/useCreateProduct";
import { useFetchCategories } from "@/composables/modules/category/useFetchCategories";
import { useBatchUploadFile } from "@/composables/core/useBatchUploads";
import { onMounted } from "vue";

// Import components
import Tooltip from "@/components/core/Tooltip.vue";
// import CoreQuillEditor from '@/components/core/CoreQuillEditor.vue'

// Icons import
import {
  Paintbrush as PaintBrushIcon,
  Info as InfoIcon,
  InfoIcon as InfoCircleIcon,
  Tag as TagIcon,
  Image as ImageIcon,
  UploadCloud as UploadCloudIcon,
  Trash as TrashIcon,
  Plus as PlusIcon,
  X as XIcon,
  Save as SaveIcon,
  Ruler as RulerIcon,
  FileText as FileTextIcon,
  Megaphone as MegaphoneIcon,
} from "lucide-vue-next";

// Initialize composables
const { categories } = useFetchCategories();
const { loading, createProduct, product } = useCreateProduct();
const {
  singleUploadFile,
  loading: uploadingSingle,
  uploadResponse: singleUploadResponse,
} = useSingleUploadFile();
const {
  batchUploadFile,
  loading: uploadingBatch,
  uploadResponse: batchUploadResponse,
} = useBatchUploadFile();

// Form state
const currentProduct = ref({
  name: "",
  description: "", // HTML content from Quill
  category: "",
  price: 175 as number | null,
  discountPrice: null as number | null,
  tags: [] as string[],
  width: null as number | null,
  height: null as number | null,
  length: null as number | null,
  weight: null as number | null,
  isAvailable: true,
  isFeatured: false,
  isNew: true,
  isBestseller: false,
  images: [] as string[],
  attributes: {} as Record<string, any>,
  // New fields with HTML content from Quill editors
  productInfo: `
      Limited edition prints of 20. 

      Print Sizes: 

      Small: 40.64cm x 50.80cm (16" x 20")

      Medium: 50.80cm x 71.12cm (20" x 28")

      Large: 60.96cm x  91.44cm  ( 24" x 36")

      Material: 

      The printing and delivery process is 100% carbon neutral and packaged with recyclable materials.

      Printed on high quality museum paper Hahnemühle German Etching 310 gsm. 

      This heavyweight paper has a slightly warm base tone and a strong mottled texture. It creates a print with strong colours and deep blacks that feel rich and high in contrast. This is due to the texture of the paper`, // HTML content
  returnPolicy: `
   In the unlikely event the product arrives to your door damaged, we will send a replacement free of charge. To arrange this please fill the contact form. Your purchase must be returned to us within 10 days starting from the day you have received the item.
  `, // HTML content
  shippingInfo: `Estimated delivery time: 5 - 8 Business days after placing order. `, // HTML content
  sizes: [] as Array<{
    size: "small" | "basic" | "medium" | "large";
    price: number;
    color: "black" | "white";
    width?: number;
    height?: number;
    length?: number;
  }>,
  promotionText: "", // Plain text
});

// UI state
const tagsInput = ref("");
const attributesInput = ref("");
const isDragging = ref(false);
const isEditProductModalOpen = ref(false);
const uploadProgress = ref(0);
const showDebugInfo = ref(false);
const showContentPreview = ref(false);

// Image upload handling
const imageFiles = ref([] as File[]);
const imagePreviewUrls = ref([] as string[]);
const uploadedImageUrls = ref([] as string[]);

// Size variants
const sizeVariants = ref([
  {
    size: "" as "small" | "basic" | "medium" | "large" | "",
    color: "black" as "black" | "white",
    price: null as number | null,
    width: null as number | null,
    height: null as number | null,
    length: null as number | null,
  },
]);

// Watch for upload responses
watch(
  () => singleUploadResponse.value,
  (newValue) => {
    if (newValue && newValue.url) {
      uploadedImageUrls.value.push(newValue.url);
    }
  }
);

watch(
  () => batchUploadResponse.value,
  (newValue) => {
    if (newValue && Array.isArray(newValue)) {
      const urls = newValue.map((response) => response.url).filter(Boolean);
      uploadedImageUrls.value.push(...urls);
    }
  }
);

// Simulate upload progress
watch(
  [uploadingSingle, uploadingBatch],
  ([newSingle, newBatch], [oldSingle, oldBatch]) => {
    if ((newSingle || newBatch) && !oldSingle && !oldBatch) {
      uploadProgress.value = 0;
      simulateProgress();
    } else if (!newSingle && !newBatch && (oldSingle || oldBatch)) {
      uploadProgress.value = 100;
    }
  }
);

// Computed properties
const parsedTags = computed(() => {
  if (!tagsInput.value) return [];
  return tagsInput.value
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag);
});

const isValidJSON = computed(() => {
  if (!attributesInput.value) return true;
  try {
    JSON.parse(attributesInput.value);
    return true;
  } catch (e) {
    return false;
  }
});

const parsedAttributes = computed(() => {
  if (!attributesInput.value || !isValidJSON.value) return {};
  try {
    return JSON.parse(attributesInput.value);
  } catch (e) {
    return {};
  }
});

// Helper function to strip HTML tags for text-only validation
const stripHtml = (html: string): string => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

// Helper function to validate HTML content
const isValidHtmlContent = (content: string): boolean => {
  const textContent = stripHtml(content).trim();
  return textContent.length > 0;
};

// Debug function to preview payload
const getPayloadPreview = () => {
  const payload = {
    ...currentProduct.value,
    tags: parsedTags.value,
    attributes: parsedAttributes.value,
    sizes: sizeVariants.value
      .filter((variant) => variant.size && variant.price !== null)
      .map((variant) => ({
        size: variant.size as "small" | "basic" | "medium" | "large",
        color: variant.color as "black" | "white",
        price: variant.price!,
        width: variant.width || undefined,
        height: variant.height || undefined,
        length: variant.length || undefined,
      })),
    images:
      uploadedImageUrls.value.length > 0
        ? uploadedImageUrls.value
        : currentProduct.value.images,
  };

  return payload;
};

// Methods
const simulateProgress = () => {
  let interval: number | null = null;

  const updateProgress = () => {
    if (uploadingSingle.value || uploadingBatch.value) {
      if (uploadProgress.value < 95) {
        uploadProgress.value += Math.random() * 10;
        if (uploadProgress.value > 95) uploadProgress.value = 95;
      }
    } else {
      if (interval) {
        clearInterval(interval);
        interval = null;
        uploadProgress.value = 100;
      }
    }
  };

  interval = setInterval(updateProgress, 300) as unknown as number;
};

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const files = Array.from(input.files);

  for (const file of files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreviewUrls.value.push(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }

  await uploadFiles(files);
};

const handleFileDrop = async (event: DragEvent) => {
  isDragging.value = false;
  if (!event.dataTransfer?.files) return;

  const files = Array.from(event.dataTransfer.files).filter((file) =>
    file.type.startsWith("image/")
  );

  if (files.length === 0) return;

  for (const file of files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreviewUrls.value.push(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }

  await uploadFiles(files);
};

const uploadFiles = async (files: File[]) => {
  try {
    if (files.length === 1) {
      await singleUploadFile(files[0]);
    } else if (files.length > 1) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      await batchUploadFile(formData);
    }
  } catch (error) {
    console.error("Error uploading files:", error);
    alert("Failed to upload images. Please try again.");
  }
};

const removeImage = (index: number) => {
  imagePreviewUrls.value.splice(index, 1);

  if (index < uploadedImageUrls.value.length) {
    uploadedImageUrls.value.splice(index, 1);
  }
};

const addSizeVariant = () => {
  sizeVariants.value.push({
    size: "" as "small" | "basic" | "medium" | "large" | "",
    color: "" as "black" | "white",
    price: null,
    width: null,
    height: null,
    length: null,
  });
};

const removeSizeVariant = (index: number) => {
  sizeVariants.value.splice(index, 1);
  if (sizeVariants.value.length === 0) {
    addSizeVariant();
  }
};

const saveProduct = async () => {
  try {
    // Validate required fields
    if (!currentProduct.value.name.trim()) {
      alert("Please provide a name for your artwork");
      return;
    }

    // Validate HTML content fields
    if (!isValidHtmlContent(currentProduct.value.description)) {
      alert("Please provide a description for your artwork");
      return;
    }

    // Process tags from input
    if (tagsInput.value) {
      currentProduct.value.tags = parsedTags.value;
    }

    // Process attributes from JSON input
    if (attributesInput.value && isValidJSON.value) {
      currentProduct.value.attributes = parsedAttributes.value;
    }

    // Process size variants - filter out incomplete entries
    currentProduct.value.sizes = sizeVariants.value
      .filter((variant) => variant.size && variant.price !== null)
      .map((variant) => ({
        size: variant.size as "small" | "basic" | "medium" | "large",
        color: variant.color as "black" | "whihte",
        price: variant.price!,
        width: variant.width || undefined,
        height: variant.height || undefined,
        length: variant.length || undefined,
      }));

    // Use uploaded image URLs
    if (uploadedImageUrls.value.length > 0) {
      if (isEditProductModalOpen.value) {
        currentProduct.value.images = [
          ...currentProduct.value.images,
          ...uploadedImageUrls.value,
        ];
      } else {
        currentProduct.value.images = [...uploadedImageUrls.value];
      }
    } else if (
      !isEditProductModalOpen.value &&
      imagePreviewUrls.value.length === 0
    ) {
      alert("Please upload at least one image");
      return;
    }

    // Prepare the final payload with HTML content
    const productPayload = {
      name: currentProduct.value.name,
      description: currentProduct.value.description, // HTML content
      category: currentProduct.value.category,
      price: currentProduct.value.price,
      discountPrice: currentProduct.value.discountPrice,
      tags: currentProduct.value.tags,
      width: currentProduct.value.width,
      height: currentProduct.value.height,
      length: currentProduct.value.length,
      weight: currentProduct.value.weight,
      isAvailable: currentProduct.value.isAvailable,
      isFeatured: currentProduct.value.isFeatured,
      isNew: currentProduct.value.isNew,
      isBestseller: currentProduct.value.isBestseller,
      images: currentProduct.value.images,
      attributes: currentProduct.value.attributes,
      // HTML content fields
      productInfo: currentProduct.value.productInfo, // HTML content
      returnPolicy: currentProduct.value.returnPolicy, // HTML content
      shippingInfo: currentProduct.value.shippingInfo, // HTML content
      sizes: currentProduct.value.sizes,
      promotionText: currentProduct.value.promotionText, // Plain text
    };

    console.log("Sending product payload with HTML content:", productPayload);

    // Create the product
    await createProduct(productPayload);

    // Reset form after successful save
    resetForm();

    // Close modal
    closeProductModal();
  } catch (error) {
    console.error("Error saving product:", error);
    alert("An error occurred while saving the artwork");
  }
};

const resetForm = () => {
  currentProduct.value = {
    name: "",
    description: "",
    category: "",
    price: null,
    discountPrice: null,
    tags: [],
    width: null,
    height: null,
    length: null,
    weight: null,
    isAvailable: true,
    isFeatured: false,
    isNew: true,
    isBestseller: false,
    images: [],
    attributes: {},
    productInfo: "",
    returnPolicy: "",
    shippingInfo: "",
    sizes: [],
    promotionText: "",
  };
  tagsInput.value = "";
  attributesInput.value = "";
  imageFiles.value = [];
  imagePreviewUrls.value = [];
  uploadedImageUrls.value = [];
  sizeVariants.value = [
    {
      size: "" as "small" | "basic" | "medium" | "large" | "",
      color: "" as "black" | "white",
      price: null,
      width: null,
      height: null,
      length: null,
    },
  ];
  uploadProgress.value = 0;
  showDebugInfo.value = false;
};

const closeProductModal = () => {
  resetForm();
};

definePageMeta({
  layout: "dashboard",
});

onMounted(() => {
  categories.value;
});
</script>

<style scoped>
.artwork-upload-container {
  @apply max-w-6xl mx-auto p-4;
}

.form-group {
  @apply space-y-1;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply block w-full p-2.5 pl-6 border outline-none rounded-md border-gray-100 shadow-sm focus:border-violet-500 focus:ring focus:ring-violet-500 focus:ring-opacity-50 transition-all duration-200;
}

/* Quill Editor Wrapper */
.quill-wrapper {
  @apply border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring focus-within:ring-blue-500 focus-within:ring-opacity-50 transition-all duration-200;
}

.quill-wrapper :deep(.ql-toolbar) {
  @apply border-b border-gray-200 bg-gray-50;
}

.quill-wrapper :deep(.ql-container) {
  @apply min-h-[150px];
}

.quill-wrapper :deep(.ql-editor) {
  @apply min-h-[150px] text-sm;
}

.quill-wrapper :deep(.ql-editor.ql-blank::before) {
  @apply text-gray-400 italic;
}

/* Toggle Switch */
.toggle-checkbox:checked {
  @apply right-0 border-violet-600;
  transition: right 0.2s ease-in-out;
}

.toggle-checkbox:checked + .toggle-label {
  @apply bg-violet-600;
  transition: background-color 0.2s ease-in-out;
}

/* Size Variant Cards */
.size-variant-card {
  @apply p-4 bg-white rounded-lg border border-emerald-200 shadow-sm hover:shadow-md transition-shadow duration-200;
}

/* Upload Area */
.upload-area {
  @apply flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md transition-all duration-200 hover:border-violet-400 hover:bg-violet-50/50;
}

.upload-button {
  @apply relative cursor-pointer bg-white rounded-md font-medium text-violet-600 hover:text-violet-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-violet-500 transition-colors duration-200;
}

/* Image Preview */
.image-preview-container {
  @apply grid grid-cols-3 gap-2;
}

.image-preview-item {
  @apply aspect-square overflow-hidden;
}

.preview-image {
  @apply h-full w-full object-cover transition-transform duration-200 group-hover:scale-105;
}

.image-overlay {
  @apply absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2;
}

.image-delete-button {
  @apply ml-auto bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200;
}

.image-info {
  @apply bg-black bg-opacity-50 text-white rounded px-2 py-1;
}

.empty-preview-slot {
  @apply aspect-square bg-gray-100 rounded-lg border border-dashed border-gray-300;
}

/* Size Variants */
.add-size-button {
  @apply flex items-center justify-center w-full py-2 text-sm text-emerald-600 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors duration-200;
}

/* Action Buttons */
.cancel-button {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors duration-200;
}

.save-button {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed;
}

/* Animations */
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.progress-bar-animate {
  animation: progressBar 1.5s ease-in-out infinite;
}

@keyframes progressBar {
  0% {
    width: 10%;
  }
  50% {
    width: 70%;
  }
  100% {
    width: 10%;
  }
}

/* Background Grid Pattern */
.bg-grid-white {
  background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.1) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}
</style>
