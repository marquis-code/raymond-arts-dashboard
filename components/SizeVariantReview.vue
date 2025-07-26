<template>
    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div class="flex items-center gap-3">
        <StatusBadge :label="size.size" color="blue" />
        <StatusBadge :label="size.color" color="gray" />
        <span class="text-sm font-medium text-gray-800">
          {{ formatCurrency(size.price) }}
        </span>
      </div>
      
      <div class="flex items-center gap-2">
        <StatusBadge
          :label="size.installmentConfig.enabled ? 'Installments' : 'No Installments'"
          :color="size.installmentConfig.enabled ? 'green' : 'gray'"
          size="sm"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { SizePrice } from '~/types/artwork'
  
  interface Props {
    size: SizePrice
  }
  
  defineProps<Props>()
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  </script>
  