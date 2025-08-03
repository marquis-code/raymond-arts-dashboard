<template>
    <div>
      <!-- This page will automatically redirect to the create page with the ID -->
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { navigateTo } from '#app'
  
  const route = useRoute()
  const productId = route.params.id
  
  // Redirect to the create page with the product ID
  navigateTo(`/dashboard/products/create?id=${productId}`)
  </script>
  