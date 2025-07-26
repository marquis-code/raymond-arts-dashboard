<template>
    <div class="space-y-2">
      <div class="flex items-center gap-2 mb-3">
        <StatusBadge
          :label="config.enabled ? 'Enabled' : 'Disabled'"
          :color="config.enabled ? 'green' : 'gray'"
          :size="compact ? 'sm' : 'md'"
        />
      </div>
      
      <div v-if="config.enabled" class="space-y-1" :class="compact ? 'text-sm' : ''">
        <ReviewItem
          label="Max Installments"
          :value="config.maxInstallments"
          :compact="compact"
        />
        <ReviewItem
          label="Interest Rate"
          :value="`${config.interestRate}%`"
          :compact="compact"
        />
        <ReviewItem
          label="Min Amount"
          :value="formatCurrency(config.minimumAmount)"
          :compact="compact"
        />
        <ReviewItem
          label="Available Terms"
          :value="`${config.availableTerms.join(', ')} months`"
          :compact="compact"
        />
        <ReviewItem
          label="Down Payment"
          :value="`${config.minimumDownPaymentPercentage}% - ${config.maximumDownPaymentPercentage}%`"
          :compact="compact"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { InstallmentConfig, SizeInstallmentConfig } from '~/types/artwork'
  
  interface Props {
    config: InstallmentConfig | SizeInstallmentConfig
    compact?: boolean
  }
  
  defineProps<Props>()
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  </script>
  