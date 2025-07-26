<template>
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h4 class="text-lg font-medium text-blue-800">Global Installment Settings</h4>
          <p class="text-sm text-blue-600 mt-1">Fallback configuration for all sizes</p>
        </div>
        <ToggleSwitch
          :checked="config.enabled"
          label="Enable Global Installments"
          @update:checked="updateConfig({ enabled: $event })"
        />
      </div>
  
      <div v-if="config.enabled" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Maximum Installments"
          hint="Number of installment payments allowed (2-24)"
        >
          <input
            :value="config.maxInstallments"
            type="number"
            min="2"
            max="24"
            class="form-input"
            @input="updateConfig({ maxInstallments: parseInt($event.target.value) || 12 })"
          />
        </FormField>
  
        <FormField
          label="Annual Interest Rate (%)"
          hint="Interest rate charged per year (0-100%)"
        >
          <div class="relative">
            <input
              :value="config.interestRate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              class="form-input pr-8"
              @input="updateConfig({ interestRate: parseFloat($event.target.value) || 0 })"
            />
            <Icon name="heroicons:percent" class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </FormField>
  
        <FormField
          label="Minimum Order Amount ($)"
          hint="Minimum purchase amount to qualify for installments"
        >
          <div class="relative">
            <Icon name="heroicons:currency-dollar" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              :value="config.minimumAmount"
              type="number"
              min="0"
              step="0.01"
              class="form-input pl-10"
              @input="updateConfig({ minimumAmount: parseFloat($event.target.value) || 0 })"
            />
          </div>
        </FormField>
  
        <FormField
          label="Available Terms (months)"
          hint="Comma-separated list of available installment terms"
        >
          <input
            :value="config.availableTerms.join(', ')"
            type="text"
            class="form-input"
            placeholder="3, 6, 12, 24"
            @input="updateAvailableTerms($event.target.value)"
          />
        </FormField>
  
        <FormField
          label="Minimum Down Payment (%)"
          hint="Minimum percentage required as down payment"
        >
          <div class="relative">
            <input
              :value="config.minimumDownPaymentPercentage"
              type="number"
              min="0"
              max="100"
              class="form-input pr-8"
              @input="updateConfig({ minimumDownPaymentPercentage: parseInt($event.target.value) || 20 })"
            />
            <Icon name="heroicons:percent" class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </FormField>
  
        <FormField
          label="Maximum Down Payment (%)"
          hint="Maximum percentage allowed as down payment"
        >
          <div class="relative">
            <input
              :value="config.maximumDownPaymentPercentage"
              type="number"
              min="0"
              max="100"
              class="form-input pr-8"
              @input="updateConfig({ maximumDownPaymentPercentage: parseInt($event.target.value) || 50 })"
            />
            <Icon name="heroicons:percent" class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </FormField>
      </div>
  
      <div v-else class="text-center py-8">
        <Icon name="heroicons:credit-card" class="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p class="text-gray-500">Global installments are disabled</p>
        <p class="text-sm text-gray-400 mt-1">Enable to configure fallback installment settings</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { InstallmentConfig } from '~/types/artwork'
  
  interface Props {
    config: InstallmentConfig
  }
  
  interface Emits {
    (e: 'update:config', updates: Partial<InstallmentConfig>): void
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  
  const updateConfig = (updates: Partial<InstallmentConfig>) => {
    emit('update:config', updates)
  }
  
  const updateAvailableTerms = (value: string) => {
    const terms = value
      .split(',')
      .map(term => parseInt(term.trim()))
      .filter(term => !isNaN(term) && term > 0)
    
    updateConfig({ availableTerms: terms.length > 0 ? terms : [3, 6, 12] })
  }
  </script>
  
  <!-- <style scoped>
  .form-input {
    @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200;
  }
  </style> -->
  