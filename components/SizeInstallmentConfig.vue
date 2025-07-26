<template>
    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <StatusBadge :label="size.size || 'No Size'" color="blue" />
            <StatusBadge :label="size.color || 'No Color'" color="gray" />
            <span class="text-sm font-medium text-gray-700">
              ${{ size.price || 0 }}
            </span>
          </div>
        </div>
        
        <ToggleSwitch
          :checked="size.installmentConfig.enabled"
          :label="`${size.installmentConfig.enabled ? 'Enabled' : 'Disabled'}`"
          @update:checked="updateConfig({ enabled: $event })"
        />
      </div>
  
      <div v-if="size.installmentConfig.enabled" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Max Installments"
            :hint="`Maximum installments for ${size.size} ${size.color}`"
          >
            <input
              :value="size.installmentConfig.maxInstallments"
              type="number"
              min="2"
              max="24"
              class="form-input"
              @input="updateConfig({ maxInstallments: parseInt($event.target.value) || 12 })"
            />
          </FormField>
  
          <FormField
            label="Interest Rate (%)"
            hint="Annual interest rate for this size"
          >
            <div class="relative">
              <input
                :value="size.installmentConfig.interestRate"
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
            label="Minimum Amount ($)"
            hint="Minimum order amount for installments"
          >
            <div class="relative">
              <Icon name="heroicons:currency-dollar" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                :value="size.installmentConfig.minimumAmount"
                type="number"
                min="0"
                step="0.01"
                class="form-input pl-10"
                @input="updateConfig({ minimumAmount: parseFloat($event.target.value) || 0 })"
              />
            </div>
          </FormField>
  
          <FormField
            label="Available Terms"
            hint="Available installment terms (months)"
          >
            <input
              :value="size.installmentConfig.availableTerms.join(', ')"
              type="text"
              class="form-input"
              placeholder="3, 6, 12"
              @input="updateAvailableTerms($event.target.value)"
            />
          </FormField>
  
          <FormField
            label="Min Down Payment (%)"
            hint="Minimum down payment percentage"
          >
            <div class="relative">
              <input
                :value="size.installmentConfig.minimumDownPaymentPercentage"
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
            label="Max Down Payment (%)"
            hint="Maximum down payment percentage"
          >
            <div class="relative">
              <input
                :value="size.installmentConfig.maximumDownPaymentPercentage"
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
  
        <!-- Quick Presets -->
        <div class="border-t border-green-200 pt-4">
          <h5 class="text-sm font-medium text-green-800 mb-2">Quick Presets:</h5>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="preset-button"
              @click="applyPreset('standard')"
            >
              Standard (0% interest, 3-12 months)
            </button>
            <button
              type="button"
              class="preset-button"
              @click="applyPreset('premium')"
            >
              Premium (2.5% interest, 6-24 months)
            </button>
            <button
              type="button"
              class="preset-button"
              @click="applyPreset('flexible')"
            >
              Flexible (1% interest, 3-18 months)
            </button>
          </div>
        </div>
      </div>
  
      <div v-else class="text-center py-6">
        <Icon name="heroicons:x-circle" class="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p class="text-sm text-gray-500">Installments disabled for this size</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { SizePrice, SizeInstallmentConfig } from '~/types/artwork'
  
  interface Props {
    size: SizePrice
    index: number
  }
  
  interface Emits {
    (e: 'update:config', updates: Partial<SizeInstallmentConfig>): void
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  
  const updateConfig = (updates: Partial<SizeInstallmentConfig>) => {
    emit('update:config', updates)
  }
  
  const updateAvailableTerms = (value: string) => {
    const terms = value
      .split(',')
      .map(term => parseInt(term.trim()))
      .filter(term => !isNaN(term) && term > 0)
    
    updateConfig({ availableTerms: terms.length > 0 ? terms : [3, 6, 12] })
  }
  
  const applyPreset = (preset: 'standard' | 'premium' | 'flexible') => {
    const presets = {
      standard: {
        interestRate: 0,
        maxInstallments: 12,
        availableTerms: [3, 6, 12],
        minimumDownPaymentPercentage: 20,
        maximumDownPaymentPercentage: 50,
      },
      premium: {
        interestRate: 2.5,
        maxInstallments: 24,
        availableTerms: [6, 12, 18, 24],
        minimumDownPaymentPercentage: 15,
        maximumDownPaymentPercentage: 60,
      },
      flexible: {
        interestRate: 1,
        maxInstallments: 18,
        availableTerms: [3, 6, 9, 12, 18],
        minimumDownPaymentPercentage: 10,
        maximumDownPaymentPercentage: 70,
      },
    }
  
    updateConfig(presets[preset])
  }
  </script>
  
  <style scoped>
  /* .form-input {
    @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200;
  } */
  
  .preset-button {
    @apply px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors duration-200;
  }
  </style>
  