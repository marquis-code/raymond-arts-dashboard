<template>
  <div class="space-y-6">
    <!-- Header with actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Artwork Management</h1>
        <p class="text-gray-500 mt-1">Manage your artwork inventory and listings</p>
      </div>
      <div class="flex gap-3">
        <button @click="showFilters = !showFilters" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300">
          <Filter class="h-4 w-4 mr-2" />
          Filters
        </button>
        <NuxtLink to="/dashboard/products/create" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300">
          <Plus class="h-4 w-4 mr-2" />
          Add Artwork
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <div v-if="showFilters" class="bg-white p-4 rounded-lg border border-gray-100 animate-slideDown shadow-lg">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select id="category" v-model="filters.category" class="w-full border p-2.5 text-sm rounded-md border-gray-300 focus:border-violet-500 focus:ring-violet-500">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category._id" :value="category._id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="price-range" class="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
          <div class="flex items-center space-x-2">
            <input 
              type="number" 
              v-model="filters.minPrice" 
              placeholder="Min" 
              class="w-full rounded-md border-gray-300 border p-2.5 text-sm focus:border-violet-500 focus:ring-violet-500"
            />
            <span>-</span>
            <input 
              type="number" 
              v-model="filters.maxPrice" 
              placeholder="Max" 
              class="w-full rounded-md border-gray-300 border p-2.5 text-sm focus:border-violet-500 focus:ring-violet-500"
            />
          </div>
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Availability</label>
          <select id="status" v-model="filters.isAvailable" class="w-full rounded-md border text-sm p-2.5 border-gray-300 focus:border-violet-500 focus:ring-violet-500">
            <option value="">All</option>
            <option :value="true">Available</option>
            <option :value="false">Not Available</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex justify-end space-x-3">
        <button @click="resetFilters" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300">
          Reset
        </button>
        <button @click="applyFilters" class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300">
          Apply Filters
        </button>
      </div>
    </div>

    <!-- Products Grid -->

    <!-- Empty state -->
    <div v-if="filteredProducts.length === 0 && !loading" class="bg-white p-8 rounded-lg border border-gray-100 text-center">
      <div class="flex justify-center">
        <img src="https://res.cloudinary.com/marquis/image/upload/v1744598033/nest-cloudinary/empty-state.svg" alt="No products found" class="h-32 w-32 mb-4" />
      </div>
      <h3 class="mt-2 text-base font-medium text-gray-900">No artworks found</h3>
      <p class="mt-1 text-sm text-gray-500">
        Try adjusting your filters or add a new artwork to get started.
      </p>
      <div class="mt-6">
        <NuxtLink to="/dashboard/products/create" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300">
          <Plus class="h-4 w-4 mr-2" />
          Add Artwork
        </NuxtLink>
      </div>
    </div>

    <!-- <div v-else-if="loading && !filteredProducts?.length">Loading Products</div> -->
    <div v-else-if="loading && !filteredProducts?.length" class="p-8 flex justify-center items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700"></div>
      </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(product, index) in filteredProducts" :key="product.id || index" 
           class="product-card bg-white rounded-lg border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-xl transform hover:-translate-y-2">
        <div class="relative aspect-w-4 aspect-h-3 bg-gray-100 group cursor-pointer" @click="openImageGallery(product)">
          <!-- Image Carousel -->
          <div class="carousel-container w-full h-full overflow-hidden">
            <div v-if="product.images && product.images.length > 0" class="carousel-slides w-full h-full relative">
              <div 
                v-for="(image, imgIndex) in product.images" 
                :key="imgIndex" 
                class="carousel-slide absolute top-0 left-0 w-full h-full transition-opacity duration-500"
                :class="{ 'opacity-100 z-10': currentSlide[product.id] === imgIndex, 'opacity-0 z-0': currentSlide[product.id] !== imgIndex }"
              >
                <img :src="image" :alt="`${product.name} - Image ${imgIndex + 1}`" class="object-cover w-full h-full" />
              </div>
            </div>
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
              <ImageIcon class="h-12 w-12 text-gray-400" />
            </div>
            
            <!-- Hover overlay with "View Gallery" text -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300">
              <span class="text-white font-medium px-4 py-2 rounded-md bg-black bg-opacity-50 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                View Gallery
              </span>
            </div>
            
            <!-- Carousel Controls (only if multiple images) -->
            <div v-if="product.images && product.images.length > 1" 
                 class="carousel-controls absolute bottom-2 left-0 right-0 flex justify-center space-x-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                @click.stop="prevSlide(product.id)" 
                class="bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 focus:outline-none transition-all"
              >
                <ChevronLeft class="h-4 w-4" />
              </button>
              <div class="flex space-x-1">
                <button 
                  v-for="(_, dotIndex) in product.images" 
                  :key="dotIndex"
                  @click.stop="goToSlide(product.id, dotIndex)"
                  class="w-2 h-2 rounded-full focus:outline-none transition-all"
                  :class="dotIndex === currentSlide[product.id] ? 'bg-white' : 'bg-white bg-opacity-50'"
                ></button>
              </div>
              <button 
                @click.stop="nextSlide(product.id)" 
                class="bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 focus:outline-none transition-all"
              >
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <!-- Product badges -->
          <div class="absolute top-2 left-2 flex flex-col gap-1 z-20">
            <span v-if="product.isFeatured" 
                  class="badge badge-featured inline-flex items-center px-2 py-1 rounded-md text-xs font-medium">
              Featured
            </span>
            <span v-if="product.isNew" 
                  class="badge badge-new inline-flex items-center px-2 py-1 rounded-md text-xs font-medium">
              New
            </span>
            <span v-if="product.isBestseller" 
                  class="badge badge-bestseller inline-flex items-center px-2 py-1 rounded-md text-xs font-medium">
              Bestseller
            </span>
          </div>
        </div>
        <div class="p-5">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-base font-bold text-gray-900 hover:text-violet-600 transition-colors">{{ product.name }}</h3>
              <p class="text-sm text-gray-500">{{ getCategoryName(product.category) }}</p>
            </div>
            <div class="text-right">
              <p class="text-base font-bold text-gray-900">${{ product.price.toFixed(2) }}</p>
              <p v-if="product.discountPrice" class="text-sm text-red-600">
                <span class="line-through">${{ product.discountPrice.toFixed(2) }}</span>
                <span class="ml-1 bg-red-100 text-red-800 text-xs px-1 py-0.5 rounded-full">-{{ product.discountPercentage }}%</span>
              </p>
            </div>
          </div>
          <div class="mt-3">
            <p v-html="product.description" class="text-sm text-gray-600 line-clamp-2"></p>
          </div>
          <div class="mt-4 flex flex-wrap gap-1">
            <span v-for="(tag, tagIndex) in product.tags" :key="tagIndex" 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100 transition-all hover:bg-violet-100">
              {{ tag }}
            </span>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
            <div class="text-sm">
              <span v-if="product.isAvailable" class="text-green-600 font-medium flex items-center">
                <CheckCircle class="h-4 w-4 mr-1" />
                Available
              </span>
              <span v-else class="text-red-500 font-medium flex items-center">
                <XCircle class="h-4 w-4 mr-1" />
                Not Available
              </span>
            </div>
            <div class="flex space-x-1">
              <button @click="viewProductDetails(product)" 
                      class="action-button p-1.5 rounded-full text-gray-400 hover:text-violet-500 hover:bg-violet-50 transition-all">
                <Eye class="h-5 w-5" />
              </button>
              <button @click="editProduct(product)" 
                      class="action-button p-1.5 rounded-full text-gray-400 hover:text-violet-500 hover:bg-violet-50 transition-all">
                <Edit class="h-5 w-5" />
              </button>
              <!-- <button @click="duplicateProduct(product)" 
                      class="action-button p-1.5 rounded-full text-gray-400 hover:text-violet-500 hover:bg-violet-50 transition-all">
                <Copy class="h-5 w-5" />
              </button> -->
              <button @click="confirmDeleteProduct(product)" 
                      class="action-button p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                <Trash2 class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Gallery Modal -->
    <Teleport to="body">
      <div v-if="isGalleryOpen" class="fixed inset-0 z-50 overflow-hidden" @click="closeGallery">
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute inset-0 bg-black bg-opacity-90 transition-opacity" 
               :class="galleryClasses"></div>
          
          <div class="fixed inset-0 flex items-center justify-center p-4"
               :class="galleryClasses">
            <!-- Close button -->
            <button @click="closeGallery" class="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none z-50">
              <X class="h-8 w-8" />
            </button>
            
            <!-- Gallery content -->
            <div class="relative max-w-5xl w-full max-h-full" @click.stop>
              <!-- Main image -->
              <div class="relative aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                <img 
                  v-if="galleryImages.length > 0" 
                  :src="galleryImages[galleryCurrentSlide]" 
                  :alt="`Gallery image ${galleryCurrentSlide + 1}`" 
                  class="object-contain w-full h-full"
                />
              </div>
              
              <!-- Gallery controls -->
              <div class="absolute inset-y-0 left-0 flex items-center">
                <button 
                  @click.stop="prevGallerySlide" 
                  class="bg-black bg-opacity-50 text-white rounded-full p-2 ml-4 hover:bg-opacity-70 focus:outline-none transition-all"
                >
                  <ChevronLeft class="h-8 w-8" />
                </button>
              </div>
              
              <div class="absolute inset-y-0 right-0 flex items-center">
                <button 
                  @click.stop="nextGallerySlide" 
                  class="bg-black bg-opacity-50 text-white rounded-full p-2 mr-4 hover:bg-opacity-70 focus:outline-none transition-all"
                >
                  <ChevronRight class="h-8 w-8" />
                </button>
              </div>
              
              <!-- Thumbnails -->
              <div class="mt-4 flex justify-center space-x-2">
                <button 
                  v-for="(_, imgIndex) in galleryImages" 
                  :key="imgIndex"
                  @click.stop="galleryCurrentSlide = imgIndex"
                  class="w-16 h-16 rounded-md overflow-hidden focus:outline-none transition-all border-2"
                  :class="imgIndex === galleryCurrentSlide ? 'border-violet-500' : 'border-transparent'"
                >
                  <img :src="galleryImages[imgIndex]" :alt="`Thumbnail ${imgIndex + 1}`" class="object-cover w-full h-full" />
                </button>
              </div>
              
              <!-- Image counter -->
              <div class="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {{ galleryCurrentSlide + 1 }} / {{ galleryImages.length }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Product Details Drawer -->
    <Teleport to="body">
      <div v-if="isDetailsDrawerOpen" class="fixed inset-0 z-50 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
               @click="closeDetailsDrawer"
               :class="detailsDrawerClasses"></div>
          <div class="fixed inset-y-0 right-0 max-w-full flex">
            <div class="relative w-screen max-w-md"
                 :class="detailsDrawerClasses">
              <div class="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                <!-- Header -->
                <div class="px-4 py-6 bg-gradient-to-r from-violet-600 to-green-700 sm:px-6">
                  <div class="flex items-start justify-between">
                    <h2 class="text-base font-medium text-white">Product Details</h2>
                    <div class="ml-3 h-7 flex items-center">
                      <button @click="closeDetailsDrawer" class="bg-transparent rounded-md text-violet-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                        <span class="sr-only">Close panel</span>
                        <X class="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Content -->
                <div v-if="selectedProduct" class="relative flex-1 px-4 py-6 sm:px-6">
                  <!-- Product Images Carousel -->
                  <div class="relative rounded-lg overflow-hidden mb-6 aspect-w-4 aspect-h-3 group cursor-pointer" @click="openImageGallery(selectedProduct)">
                    <div v-if="selectedProduct.images && selectedProduct.images.length > 0" class="carousel-slides w-full h-full relative">
                      <div 
                        v-for="(image, imgIndex) in selectedProduct.images" 
                        :key="imgIndex" 
                        class="carousel-slide absolute top-0 left-0 w-full h-full transition-opacity duration-500"
                        :class="{ 'opacity-100 z-10': detailsCurrentSlide === imgIndex, 'opacity-0 z-0': detailsCurrentSlide !== imgIndex }"
                      >
                        <img :src="image" :alt="`${selectedProduct.name} - Image ${imgIndex + 1}`" class="object-cover w-full h-full rounded-lg" />
                      </div>
                    </div>
                    
                    <!-- Hover overlay with "View Gallery" text -->
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300">
                      <span class="text-white font-medium px-4 py-2 rounded-md bg-black bg-opacity-50 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        View Gallery
                      </span>
                    </div>
                    
                    <!-- Carousel Controls -->
                    <div v-if="selectedProduct.images && selectedProduct.images.length > 1" 
                         class="carousel-controls absolute bottom-2 left-0 right-0 flex justify-center space-x-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        @click.stop="prevDetailsSlide" 
                        class="bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 focus:outline-none transition-all"
                      >
                        <ChevronLeft class="h-4 w-4" />
                      </button>
                      <div class="flex space-x-1">
                        <button 
                          v-for="(_, dotIndex) in selectedProduct.images" 
                          :key="dotIndex"
                          @click.stop="detailsCurrentSlide = dotIndex"
                          class="w-2 h-2 rounded-full focus:outline-none transition-all"
                          :class="dotIndex === detailsCurrentSlide ? 'bg-white' : 'bg-white bg-opacity-50'"
                        ></button>
                      </div>
                      <button 
                        @click.stop="nextDetailsSlide" 
                        class="bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 focus:outline-none transition-all"
                      >
                        <ChevronRight class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <!-- Product Info -->
                  <div class="space-y-6">
                    <div>
                      <h3 class="text-2xl font-bold text-gray-900">{{ selectedProduct.name }}</h3>
                      <div class="mt-1 flex items-center">
                        <span class="text-sm text-gray-500">Category:</span>
                        <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                          {{ getCategoryName(selectedProduct.category) }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                      <div class="flex items-baseline">
                        <span class="text-2xl font-bold text-gray-900">${{ selectedProduct.price.toFixed(2) }}</span>
                        <span v-if="selectedProduct.discountPrice" class="ml-2 text-base text-red-600 line-through">${{ selectedProduct.discountPrice.toFixed(2) }}</span>
                      </div>
                      <div v-if="selectedProduct.discountPrice" class="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded-full">
                        {{ selectedProduct.discountPercentage }}% OFF
                      </div>
                    </div>
                    
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">Description</h4>
                      <p v-html="selectedProduct.description" class="mt-1 text-sm text-gray-600"></p>
                    </div>

                    <!-- {{selectedProduct}} -->
                    <div v-if="selectedProduct.sizes">
                      <h4 class="text-sm font-medium text-gray-900">Sizes</h4>
                      <div class="mt-2 flex flex-wrap gap-2">
                        <span v-for="(itm, tagIndex) in selectedProduct?.sizes" :key="tagIndex" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100">
                          {{ itm?.size }} -  {{ itm?.price }}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">Tags</h4>
                      <div class="mt-2 flex flex-wrap gap-2">
                        <span v-for="(tag, tagIndex) in selectedProduct.tags" :key="tagIndex" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100">
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <h4 class="text-sm font-medium text-gray-900">Dimensions</h4>
                        <div class="mt-1 text-sm text-gray-600">
                          <p>Width: {{ selectedProduct.width }} cm</p>
                          <p>Height: {{ selectedProduct.height }} cm</p>
                          <p v-if="selectedProduct.length">Length: {{ selectedProduct.length }} cm</p>
                        </div>
                      </div>
                      <div>
                        <h4 class="text-sm font-medium text-gray-900">Weight</h4>
                        <p class="mt-1 text-sm text-gray-600">{{ selectedProduct.weight }} kg</p>
                      </div>
                    </div>
                    
                    <div class="flex flex-col space-y-2">
                      <div class="flex items-center">
                        <span class="text-sm font-medium text-gray-900 w-32">Availability:</span>
                        <span :class="selectedProduct.isAvailable ? 'text-green-600' : 'text-red-500'" class="text-sm font-medium flex items-center">
                          <span v-if="selectedProduct.isAvailable"><CheckCircle class="h-4 w-4 mr-1" /></span>
                          <span v-else><XCircle class="h-4 w-4 mr-1" /></span>
                          {{ selectedProduct.isAvailable ? 'In Stock' : 'Out of Stock' }}
                        </span>
                      </div>
                      <div class="flex items-center">
                        <span class="text-sm font-medium text-gray-900 w-32">Featured:</span>
                        <span :class="selectedProduct.isFeatured ? 'text-amber-600' : 'text-gray-500'" class="text-sm flex items-center">
                          <span v-if="selectedProduct.isFeatured"><CheckCircle class="h-4 w-4 mr-1" /></span>
                          <span v-else><XCircle class="h-4 w-4 mr-1" /></span>
                          {{ selectedProduct.isFeatured ? 'Yes' : 'No' }}
                        </span>
                      </div>
                      <div class="flex items-center">
                        <span class="text-sm font-medium text-gray-900 w-32">New:</span>
                        <span :class="selectedProduct.isNew ? 'text-green-600' : 'text-gray-500'" class="text-sm flex items-center">
                          <span v-if="selectedProduct.isNew"><CheckCircle class="h-4 w-4 mr-1" /></span>
                          <span v-else><XCircle class="h-4 w-4 mr-1" /></span>
                          {{ selectedProduct.isNew ? 'Yes' : 'No' }}
                        </span>
                      </div>
                      <div class="flex items-center">
                        <span class="text-sm font-medium text-gray-900 w-32">Bestseller:</span>
                        <span :class="selectedProduct.isBestseller ? 'text-rose-600' : 'text-gray-500'" class="text-sm flex items-center">
                          <span v-if="selectedProduct.isBestseller"><CheckCircle class="h-4 w-4 mr-1" /></span>
                          <span v-else><XCircle class="h-4 w-4 mr-1" /></span>
                          {{ selectedProduct.isBestseller ? 'Yes' : 'No' }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="pt-4 border-t border-gray-200">
                      <div class="flex space-x-3">
                        <button @click="editProduct(selectedProduct)" class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300">
                          <Edit class="h-4 w-4 mr-2" />
                          Edit
                        </button>
                        <button @click="confirmDeleteProduct(selectedProduct)" class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300">
                          <Trash2 class="h-4 w-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Edit Product Drawer -->
    <Teleport to="body">
      <div v-if="isEditDrawerOpen" class="fixed inset-0 z-50 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
               @click="closeEditDrawer"
               :class="editDrawerClasses"></div>
          <div class="fixed inset-y-0 right-0 max-w-full flex">
            <div class="relative w-screen max-w-md"
                 :class="editDrawerClasses">
              <div class="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                <!-- Header -->
                <div class="px-4 py-6 bg-gradient-to-r from-violet-600 to-green-700 sm:px-6">
                  <div class="flex items-start justify-between">
                    <h2 class="text-base font-medium text-white">Edit Product</h2>
                    <div class="ml-3 h-7 flex items-center">
                      <button @click="closeEditDrawer" class="bg-transparent rounded-md text-violet-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                        <span class="sr-only">Close panel</span>
                        <X class="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Form -->
                <div v-if="editingProduct" class="relative flex-1 px-4 py-6 sm:px-6">
                  <form @submit.prevent="saveProduct" class="space-y-6">
                    <!-- Basic Info -->
                    <div>
                      <h3 class="text-base font-medium text-gray-900">Basic Information</h3>
                      <div class="mt-4 space-y-4">
                        <div>
                          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                          <input type="text" id="name" v-model="editingProduct.name" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm p-3 border-[0.5px] outline-none" required />
                        </div>
                        
                        <div>
                          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                          <CoreQuillEditor 
                            v-model="editingProduct.description"
                            placeholder="Describe your artwork with rich formatting..."
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm p-3 border-[0.5px] outline-none"
                          />
                          <!-- <textarea id="description" v-model="editingProduct.description" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm p-3 border-[0.5px] outline-none"></textarea> -->
                        </div>

                                      <!-- Product Information -->
              <div class="form-group">
                <div class="flex items-center justify-between mb-3">
                  <label class="form-label text-base font-semibold">Product Information</label>
                  <!-- <Tooltip text="Detailed information about your artwork including materials, techniques, inspiration, and story">
                    <InfoCircleIcon class="h-4 w-4 text-blue-400 hover:text-blue-600 transition-colors" />
                  </Tooltip> -->
                </div>
                <div class="quill-wrapper">
                  <CoreQuillEditor 
                    v-model="editingProduct.productInfo" 
                     class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm p-3 border-[0.5px] outline-none"
                    placeholder="Include details about materials, techniques, inspiration, dimensions, care instructions, and the story behind your artwork..."
                  />
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  This content will be displayed as formatted HTML on the product page.
                </p>
              </div>


              <div class="form-group">
                <div class="flex items-center justify-between mb-3">
                  <label class="form-label text-base font-semibold">Return & Refund Policy</label>
                  <!-- <Tooltip text="Your return and refund policy for this artwork">
                    <InfoCircleIcon class="h-4 w-4 text-blue-400 hover:text-blue-600 transition-colors" />
                  </Tooltip> -->
                </div>
                <div class="quill-wrapper">
                  <CoreQuillEditor 
                    v-model="editingProduct.returnPolicy" 
                     class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm p-3 border-[0.5px] outline-none"
                    placeholder="Specify your return timeframe, conditions, process, and any exceptions for this artwork..."
                  />
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  This policy will be displayed as formatted HTML to customers.
                </p>
              </div>


              <div class="form-group">
                <div class="flex items-center justify-between mb-3">
                  <label class="form-label text-base font-semibold">Shipping Information</label>
                  <!-- <Tooltip text="Shipping details and delivery information">
                    <InfoCircleIcon class="h-4 w-4 text-blue-400 hover:text-blue-600 transition-colors" />
                  </Tooltip> -->
                </div>
                <div class="quill-wrapper">
                  <CoreQuillEditor 
                    v-model="editingProduct.shippingInfo" 
                     class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm p-3 border-[0.5px] outline-none"
                    placeholder="Include shipping costs, delivery times, packaging details, and any special shipping requirements..."
                  />
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  This information will be displayed as formatted HTML on the product page.
                </p>
              </div> 
                        
                        <div>
                          <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                          <select id="category" v-model="editingProduct.category._id" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm p-3 border-[0.5px] outline-none">
                            <option v-for="category in categories" :key="category._id" :value="category._id">
                              {{ category.name }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Product Images -->
                    <div>
                      <h3 class="text-base font-medium text-gray-900">Product Images</h3>
                      <div class="mt-4">
                        <!-- Current Images Preview -->
                        <div class="grid grid-cols-3 gap-2 mb-4">
                          <div v-for="(image, imgIndex) in editingProduct.images" :key="imgIndex" class="relative group">
                            <img :src="image" :alt="`Image ${imgIndex + 1}`" class="h-24 w-24 object-cover rounded-md border border-gray-200" />
                            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-md">
                              <button @click="removeImage(imgIndex)" class="bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <X class="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <!-- Add Image Placeholder -->
                          <div class="h-24 w-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-violet-500 transition-colors" @click="triggerImageUpload">
                            <Plus class="h-6 w-6 text-gray-400" />
                            <input type="file" ref="imageInput" @change="handleImageUpload" accept="image/*" multiple class="hidden" />
                          </div>
                        </div>
                        
                        <!-- New Images Preview -->
                        <div v-if="newImagePreviews.length > 0" class="mt-2">
                          <p class="text-sm font-medium text-gray-700 mb-2">New Images to Upload:</p>
                          <div class="grid grid-cols-3 gap-2">
                            <div v-for="(preview, index) in newImagePreviews" :key="index" class="relative group">
                              <img :src="preview" :alt="`New Image ${index + 1}`" class="h-24 w-24 object-cover rounded-md border border-gray-200" />
                              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-md">
                                <button @click="removeNewImage(index)" class="bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X class="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>


                        <div v-if="uploadingBatch || uploadingSingle" class="mt-3">
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            class="bg-violet-600 h-2.5 rounded-full progress-bar-animate" 
                            :style="{
                              width: uploadProgress + '%',
                              transition: 'width 0.3s ease-in-out'
                            }"
                          ></div>
                        </div>
                        <p class="text-sm text-violet-600 mt-1 animate-pulse">
                          {{ uploadingBatch ? 'Uploading multiple images...' : 'Uploading image...' }}
                        </p>
                      </div>
                      </div>
                    </div>
                    
                    <!-- Pricing -->
                    <div>
                      <h3 class="text-base font-medium text-gray-900">Pricing</h3>
                      <div class="mt-4 space-y-4">
                        <div>
                          <label for="price" class="block text-sm font-medium text-gray-700">Price ($)</label>
                          <input type="number" id="price" v-model="editingProduct.price" min="0" step="0.01" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm p-3 border-[0.5px] outline-none" required />
                        </div>
                        
                        <div>
                          <label for="discountPrice" class="block text-sm font-medium text-gray-700">Discount Price ($)</label>
                          <input type="number" id="discountPrice" v-model="editingProduct.discountPrice" min="0" step="0.01" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm p-3 border-[0.5px] outline-none" />
                        </div>
                      </div>
                    </div>
                    
                    <!-- Dimensions -->
                    <div>
                      <h3 class="text-base font-medium text-gray-900">Dimensions</h3>
                      <div class="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <label for="width" class="block text-sm font-medium text-gray-700">Width (cm)</label>
                          <input type="number" id="width" v-model="editingProduct.width" min="0" step="0.1" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm p-3 border-[0.5px] outline-none" />
                        </div>
                        
                        <div>
                          <label for="height" class="block text-sm font-medium text-gray-700">Height (cm)</label>
                          <input type="number" id="height" v-model="editingProduct.height" min="0" step="0.1" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm p-3 border-[0.5px] outline-none" />
                        </div>
                        
                        <div>
                          <label for="length" class="block text-sm font-medium text-gray-700">Length (cm)</label>
                          <input type="number" id="length" v-model="editingProduct.length" min="0" step="0.1" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm p-3 border-[0.5px] outline-none" />
                        </div>
                        
                        <div>
                          <label for="weight" class="block text-sm font-medium text-gray-700">Weight (kg)</label>
                          <input type="number" id="weight" v-model="editingProduct.weight" min="0" step="0.1" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm p-3 border-[0.5px] outline-none" />
                        </div>
                      </div>
                    </div>
                    
                    <!-- Tags -->
                    <div>
                      <label for="tags" class="block text-sm font-medium text-gray-700">Tags</label>
                      <div class="mt-1 flex rounded-md shadow-sm">
                        <input type="text" id="tags" v-model="tagInput" @keydown.enter.prevent="addTag" placeholder="Add tag and press Enter" class="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border-gray-300 focus:ring-violet-500 border-[0.5px] focus:border-violet-500 sm:text-sm" />
                        <button type="button" @click="addTag" class="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm">
                          <Plus class="h-4 w-4" />
                        </button>
                      </div>
                      <div class="mt-2 flex flex-wrap gap-2">
                        <div v-for="(tag, index) in editingProduct.tags" :key="index" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                          {{ tag }}
                          <button type="button" @click="removeTag(index)" class="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-violet-400 hover:bg-violet-200 hover:text-violet-500 focus:outline-none">
                            <span class="sr-only">Remove tag</span>
                            <X class="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Status -->
                    <div>
                      <h3 class="text-base font-medium text-gray-900">Status</h3>
                      <div class="mt-4 space-y-4">
                        <div class="flex items-start">
                          <div class="flex items-center h-5">
                            <input id="isAvailable" v-model="editingProduct.isAvailable" type="checkbox" class="focus:ring-violet-500 h-4 w-4 text-violet-600 border-gray-300 rounded" />
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="isAvailable" class="font-medium text-gray-700">Available</label>
                            <p class="text-gray-500">Mark this product as available for purchase</p>
                          </div>
                        </div>
                        
                        <div class="flex items-start">
                          <div class="flex items-center h-5">
                            <input id="isFeatured" v-model="editingProduct.isFeatured" type="checkbox" class="focus:ring-violet-500 h-4 w-4 text-violet-600 border-gray-300 rounded" />
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="isFeatured" class="font-medium text-gray-700">Featured</label>
                            <p class="text-gray-500">Display this product in featured sections</p>
                          </div>
                        </div>
                        
                        <div class="flex items-start">
                          <div class="flex items-center h-5">
                            <input id="isNew" v-model="editingProduct.isNew" type="checkbox" class="focus:ring-violet-500 h-4 w-4 text-violet-600 border-gray-300 rounded" />
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="isNew" class="font-medium text-gray-700">New</label>
                            <p class="text-gray-500">Mark this product as newly added</p>
                          </div>
                        </div>
                        
                        <div class="flex items-start">
                          <div class="flex items-center h-5">
                            <input id="isBestseller" v-model="editingProduct.isBestseller" type="checkbox" class="focus:ring-violet-500 h-4 w-4 text-violet-600 border-gray-300 rounded" />
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="isBestseller" class="font-medium text-gray-700">Bestseller</label>
                            <p class="text-gray-500">Mark this product as a bestseller</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Actions -->
                    <div class="pt-5 border-t border-gray-200">
                      <div class="flex justify-end space-x-3">
                        <button type="button" @click="closeEditDrawer" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300">
                          Cancel
                        </button>
                        <button :disabled="updating" type="submit" class="px-4 disabled:cursor-not-allowed disabled:opacity-25 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300">
                          {{ updating ? 'processing...' : 'Save Changes' }}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-scale">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangle class="h-6 w-6 text-red-600" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-base leading-6 font-medium text-gray-900">
                    Delete Artwork
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to delete this artwork? This action cannot be undone. This action performs a soft delete.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button :disabled="deleting" @click="confirmDelete" type="button" class="w-full disabled:cursor-not-allowed disabled:opacity-25 inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-300">
                 {{ deleting ? 'processing..' : 'Delete'}}
              </button>
              <button @click="isDeleteModalOpen = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-300">
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
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { 
  Plus, Filter, Edit, Copy, Trash2, Package, 
  AlertTriangle, ChevronLeft, ChevronRight, X,
  Eye, ImageIcon, CheckCircle, XCircle
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useUpdateProduct  } from "@/composables/modules/products/useUpdateProduct"
import { useBatchUploadFile } from '@/composables/core/useBatchUploads'
import { useSingleUploadFile } from '@/composables/core/useSingleUpload'

// Import composables
import { useFetchProducts } from '@/composables/modules/products/useFetchProducts'
import { useFetchCategories } from '@/composables/modules/category/useFetchCategories'
import { useDeleteProduct } from "@/composables/modules/products/useDeleteProduct"
const { batchUploadFile, loading: uploadingBatch, uploadResponse: batchUploadResponse } = useBatchUploadFile()
const { singleUploadFile, loading: uploadingSingle, uploadResponse: singleUploadResponse } = useSingleUploadFile()

const { products, loading } = useFetchProducts()
const { categories } = useFetchCategories()
const { updateProduct, loading: updating } = useUpdateProduct()
const { deleteProduct, loading: deleting} = useDeleteProduct()
const router = useRouter()
const uploadProgress = ref(0)

// Filters state
const showFilters = ref(false)
const filters = ref({
  category: '',
  minPrice: null as number | null,
  maxPrice: null as number | null,
  isAvailable: null as boolean | null
})

// Modal states
const isDeleteModalOpen = ref(false)
const productToDelete = ref(null as any)

// Drawer states
const isDetailsDrawerOpen = ref(false)
const isEditDrawerOpen = ref(false)
const selectedProduct = ref(null as any)
const editingProduct = ref(null as any)
const tagInput = ref('')
const uploadedImageUrls = ref([] as string[])

// Image gallery state
const isGalleryOpen = ref(false)
const galleryImages = ref([] as string[])
const galleryCurrentSlide = ref(0)
const galleryClasses = ref('opacity-0')

// Image upload state
const imageInput = ref(null as HTMLInputElement | null)
const newImagePreviews = ref([] as string[])
const newImageFiles = ref([] as File[])

// Animation classes for drawers
const detailsDrawerClasses = ref('translate-x-full')
const editDrawerClasses = ref('translate-x-full')

// Carousel state
const currentSlide = reactive({} as Record<string, number>)
const detailsCurrentSlide = ref(0)

// Initialize carousel indices for each product
onMounted(() => {
  if (products.value) {
    products.value.forEach(product => {
      currentSlide[product.id] = 0
    })
  }
})

// Watch for products changes to initialize carousel indices
watch(products, (newProducts) => {
  if (newProducts) {
    newProducts.forEach(product => {
      if (currentSlide[product.id] === undefined) {
        currentSlide[product.id] = 0
      }
    })
  }
}, { deep: true })

// Filtered products based on applied filters
const filteredProducts = computed(() => {
  if (!products.value) return []
  
  return products.value.filter(product => {
    // Filter by category
    if (filters.value.category && product.category && product.category._id !== filters.value.category) {
      return false
    }
    
    // Filter by price range
    if (filters.value.minPrice !== null && product.price < filters.value.minPrice) {
      return false
    }
    if (filters.value.maxPrice !== null && product.price > filters.value.maxPrice) {
      return false
    }
    
    // Filter by availability
    if (filters.value.isAvailable !== null && product.isAvailable !== filters.value.isAvailable) {
      return false
    }
    
    return true
  })
})

// Helper function to get category name by ID
const getCategoryName = (category: any) => {
  if (!category) return 'Uncategorized'
  if (typeof category === 'string') {
    const foundCategory = categories.value?.find(c => c._id === category)
    return foundCategory ? foundCategory.name : 'Uncategorized'
  }
  return category.name || 'Uncategorized'
}

// Filter functions
const resetFilters = () => {
  filters.value = {
    category: '',
    minPrice: null,
    maxPrice: null,
    isAvailable: null
  }
}

const applyFilters = () => {
  // Filters are already applied via the computed property
  showFilters.value = false
}

// Carousel functions
const nextSlide = (productId: string) => {
  const product = products.value.find(p => p.id === productId)
  if (product && product.images && product.images.length > 0) {
    currentSlide[productId] = (currentSlide[productId] + 1) % product.images.length
  }
}

const prevSlide = (productId: string) => {
  const product = products.value.find(p => p.id === productId)
  if (product && product.images && product.images.length > 0) {
    currentSlide[productId] = (currentSlide[productId] - 1 + product.images.length) % product.images.length
  }
}

const goToSlide = (productId: string, index: number) => {
  currentSlide[productId] = index
}

const nextDetailsSlide = () => {
  if (selectedProduct.value && selectedProduct.value.images) {
    detailsCurrentSlide.value = (detailsCurrentSlide.value + 1) % selectedProduct.value.images.length
  }
}

const prevDetailsSlide = () => {
  if (selectedProduct.value && selectedProduct.value.images) {
    detailsCurrentSlide.value = (detailsCurrentSlide.value - 1 + selectedProduct.value.images.length) % selectedProduct.value.images.length
  }
}

// Gallery functions
const openImageGallery = (product: any) => {
  if (product.images && product.images.length > 0) {
    galleryImages.value = [...product.images]
    galleryCurrentSlide.value = currentSlide[product.id] || 0
    isGalleryOpen.value = true
    
    // Animate gallery opening
    setTimeout(() => {
      galleryClasses.value = 'opacity-100'
    }, 10)
  }
}

const closeGallery = () => {
  galleryClasses.value = 'opacity-0'
  setTimeout(() => {
    isGalleryOpen.value = false
    galleryImages.value = []
  }, 300)
}

const nextGallerySlide = () => {
  if (galleryImages.value.length > 0) {
    galleryCurrentSlide.value = (galleryCurrentSlide.value + 1) % galleryImages.value.length
  }
}

const prevGallerySlide = () => {
  if (galleryImages.value.length > 0) {
    galleryCurrentSlide.value = (galleryCurrentSlide.value - 1 + galleryImages.value.length) % galleryImages.value.length
  }
}

// Product actions
const viewProductDetails = (product: any) => {
  selectedProduct.value = { ...product }
  detailsCurrentSlide.value = 0
  isDetailsDrawerOpen.value = true
  
  // Animate drawer opening
  setTimeout(() => {
    detailsDrawerClasses.value = 'translate-x-0'
  }, 10)
}

const closeDetailsDrawer = () => {
  detailsDrawerClasses.value = 'translate-x-full'
  setTimeout(() => {
    isDetailsDrawerOpen.value = false
    selectedProduct.value = null
  }, 300)
}

const editProduct = (product: any) => {
  // Close details drawer if open
  navigateTo(`/dashboard/products/create?id=${product?.id}`)
  // if (isDetailsDrawerOpen.value) {
  //   closeDetailsDrawer()
  //   setTimeout(() => {
  //     openEditDrawer(product)
  //   }, 300)
  // } else {
  //   openEditDrawer(product)
  // }
}

const openEditDrawer = (product: any) => {
  // Create a deep copy to avoid modifying the original
  editingProduct.value = JSON.parse(JSON.stringify(product))
  isEditDrawerOpen.value = true
  
  // Reset image upload state
  newImagePreviews.value = []
  newImageFiles.value = []
  
  // Animate drawer opening
  setTimeout(() => {
    editDrawerClasses.value = 'translate-x-0'
  }, 10)
}

const closeEditDrawer = () => {
  editDrawerClasses.value = 'translate-x-full'
  setTimeout(() => {
    isEditDrawerOpen.value = false
    editingProduct.value = null
    tagInput.value = ''
    newImagePreviews.value = []
    newImageFiles.value = []
  }, 300)
}

// Image handling functions
const triggerImageUpload = () => {
  if (imageInput.value) {
    imageInput.value.click()
  }
}

// const handleImageUpload = (event: Event) => {
//   const input = event.target as HTMLInputElement
//   if (input.files && input.files.length > 0) {
//     for (let i = 0; i < input.files.length; i++) {
//       const file = input.files[i]
//       newImageFiles.value.push(file)
      
//       // Create preview
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         if (e.target && e.target.result) {
//           newImagePreviews.value.push(e.target.result as string)
//         }
//       }
//       reader.readAsDataURL(file)
//     }
    
//     // Reset input
//     if (input) input.value = ''
//   }
// }

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const files: File[] = []
    
    // Process files for preview
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i]
      newImageFiles.value.push(file)
      files.push(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          newImagePreviews.value.push(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
    
    // Upload files
    try {
      if (files.length === 1) {
        // Use single file upload for one file
        await singleUploadFile(files[0])
      } else if (files.length > 1) {
        // Use batch upload for multiple files
        // Create FormData and append each file with the same key name 'files'
        const formData = new FormData()
        files.forEach(file => {
          formData.append('files', file)
        })
        await batchUploadFile(formData)
      }
    } catch (error) {
      console.error('Error uploading files:', error)
      alert('Failed to upload images. Please try again.')
    }
    
    // Reset input
    if (input) input.value = ''
  }
}

const removeImage = (index: number) => {
  if (editingProduct.value.images) {
    editingProduct.value.images.splice(index, 1)
  }
}

const removeNewImage = (index: number) => {
  newImagePreviews.value.splice(index, 1)
  newImageFiles.value.splice(index, 1)
}

// Watch for upload responses
watch(() => singleUploadResponse.value, (newValue) => {
  if (newValue && newValue.url) {
    uploadedImageUrls.value.push(newValue.url)
  }
})

watch(() => batchUploadResponse.value, (newValue) => {
  if (newValue && Array.isArray(newValue)) {
    const urls = newValue.map(response => response.url).filter(Boolean)
    uploadedImageUrls.value.push(...urls)
  }
})

const saveProduct = async () => {
  if (!editingProduct.value) return
  
  // In a real application, you would upload the new images to your server/cloud storage
  // and get back URLs to add to the product.images array
  // For this demo, we'll simulate that by adding the preview URLs
  if (newImagePreviews.value.length > 0) {
    if (!editingProduct.value.images) {
      editingProduct.value.images = []
    }
    
    // In a real app, you would replace this with actual uploaded image URLs
    // For demo purposes, we'll just use the preview URLs
    editingProduct.value.images = [...editingProduct.value.images, ...uploadedImageUrls.value]
  }
  
  // Find the product in the array and update it
  const index = products.value.findIndex(p => p.id === editingProduct.value.id)
  if (index !== -1) {
    // Calculate discount percentage if both price and discountPrice are set
    if (editingProduct.value.price && editingProduct.value.discountPrice) {
      const discount = ((editingProduct.value.discountPrice - editingProduct.value.price) / editingProduct.value.discountPrice) * 100
      editingProduct.value.discountPercentage = Math.abs(Math.round(discount))
    }

    try {
    // Call the update product composable with id and payload
    await updateProduct(
      editingProduct.value.id, 
      editingProduct.value
    )
    
    // Close the drawer after successful update
    closeEditDrawer()
    
    // Success handling (e.g., show toast notification)
  } catch (error) {
    // Error handling
    console.error('Failed to update product:', error)
  }
    
    products.value[index] = { ...editingProduct.value }
  }
  
  closeEditDrawer()
}

const addTag = () => {
  if (!tagInput.value.trim()) return
  
  if (!editingProduct.value.tags) {
    editingProduct.value.tags = []
  }
  
  if (!editingProduct.value.tags.includes(tagInput.value.trim())) {
    editingProduct.value.tags.push(tagInput.value.trim())
  }
  
  tagInput.value = ''
}

const removeTag = (index: number) => {
  editingProduct.value.tags.splice(index, 1)
}

// Simulate upload progress
watch([uploadingSingle, uploadingBatch], ([newSingle, newBatch], [oldSingle, oldBatch]) => {
  if ((newSingle || newBatch) && (!oldSingle && !oldBatch)) {
    // Upload started
    uploadProgress.value = 0
    simulateProgress()
  } else if ((!newSingle && !newBatch) && (oldSingle || oldBatch)) {
    // Upload finished
    uploadProgress.value = 100
  }
})

// Methods
const simulateProgress = () => {
  let interval: number | null = null
  
  const updateProgress = () => {
    if (uploadingSingle.value || uploadingBatch.value) {
      // Simulate progress between 0-95% while uploading
      if (uploadProgress.value < 95) {
        uploadProgress.value += Math.random() * 10
        if (uploadProgress.value > 95) uploadProgress.value = 95
      }
    } else {
      // Clear interval when upload is complete
      if (interval) {
        clearInterval(interval)
        interval = null
        uploadProgress.value = 100
      }
    }
  }
  
  interval = setInterval(updateProgress, 300) as unknown as number
}

const duplicateProduct = (product: any) => {
  const newProduct = { 
    ...JSON.parse(JSON.stringify(product)),
    id: `duplicate-${Date.now()}`,
    _id: `duplicate-${Date.now()}`,
    name: `${product.name} (Copy)`,
    isNew: true,
    isFeatured: false
  }
  
  products.value.push(newProduct)
  currentSlide[newProduct.id] = 0
}

const confirmDeleteProduct = (product: any) => {
  productToDelete.value = product
  isDeleteModalOpen.value = true
}

const confirmDelete = () => {
  if (productToDelete.value) {
    // Use the imported composable function
    deleteProduct(productToDelete.value.id)
      .then(() => {
        // Success handling (e.g., show toast notification)
        isDeleteModalOpen.value = false
        productToDelete.value = null
        
        // Close details drawer if open
        if (isDetailsDrawerOpen.value) {
          closeDetailsDrawer()
        }
      })
      .catch(error => {
        // Error handling
        console.error('Failed to delete product:', error)
      })
  }
}

// const deleteProduct = () => {
//   if (productToDelete.value) {
//     const index = products.value.findIndex(p => p.id === productToDelete.value.id)
//     if (index !== -1) {
//       products.value.splice(index, 1)
//     }
//   }
//   isDeleteModalOpen.value = false
//   productToDelete.value = null
  
//   // Close details drawer if open
//   if (isDetailsDrawerOpen.value) {
//     closeDetailsDrawer()
//   }
// }

definePageMeta({
  layout: 'dashboard'
})
</script>

<style scoped>
.animate-slideDown {
  animation: slideDown 0.3s ease-in-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-scale {
  animation: scale 0.3s ease-in-out;
}

@keyframes scale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.aspect-w-4 {
  position: relative;
  padding-bottom: calc(var(--tw-aspect-h) / var(--tw-aspect-w) * 100%);
  --tw-aspect-w: 4;
}

.aspect-h-3 {
  --tw-aspect-h: 3;
}

.aspect-w-16 {
  position: relative;
  padding-bottom: calc(var(--tw-aspect-h) / var(--tw-aspect-w) * 100%);
  --tw-aspect-w: 16;
}

.aspect-h-9 {
  --tw-aspect-h: 9;
}

.aspect-w-4 > *, .aspect-w-16 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.carousel-slide {
  transition: opacity 0.3s ease-in-out;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Drawer animations */
.translate-x-0 {
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
}

.translate-x-full {
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

/* Product card styling */
.product-card {
  transition: all 0.3s ease-in-out;
}

.product-card:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.action-button {
  transition: all 0.2s ease-in-out;
}

.action-button:hover {
  transform: scale(1.1);
}

/* Badge styling */
.badge {
  transition: all 0.2s ease-in-out;
}

.badge-featured {
  background-color: rgba(251, 191, 36, 0.2);
  color: rgb(180, 83, 9);
}

.badge-new {
  background-color: rgba(16, 185, 129, 0.2);
  color: rgb(6, 95, 70);
}

.badge-bestseller {
  background-color: rgba(244, 63, 94, 0.2);
  color: rgb(159, 18, 57);
}

/* Gallery animations */
.opacity-0 {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.opacity-100 {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}
</style>
