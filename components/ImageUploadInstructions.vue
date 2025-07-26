<template>
    <div class="bg-gray-50 rounded-lg p-4">
      <h5 class="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
        <Icon name="heroicons:information-circle" class="h-4 w-4" />
        Image Guidelines
      </h5>
      
      <ul class="space-y-2 text-sm text-gray-600">
        <li class="flex items-start gap-2">
          <Icon name="heroicons:check-circle" class="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
          <span>Use high-resolution images (at least 1200x1200px) for best quality</span>
        </li>
        
        <li class="flex items-start gap-2">
          <Icon name="heroicons:check-circle" class="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
          <span>First image will be used as the main product image</span>
        </li>
        
        <li class="flex items-start gap-2">
          <Icon name="heroicons:check-circle" class="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
          <span>Include multiple angles and detail shots</span>
        </li>
        
        <li class="flex items-start gap-2">
          <Icon name="heroicons:check-circle" class="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
          <span>Supported formats: JPG, PNG, GIF (max 10MB each)</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  // No props or logic needed for this component
  </script>
  