<template>
  <div class="space-y-8">
    <div class="flex items-center gap-2 mb-6">
      <Icon name="heroicons:credit-card" class="h-6 w-6 text-blue-500" />
      <h3 class="text-xl font-semibold text-gray-800">Installment Configuration</h3>
    </div>

    <!-- Global Installment Configuration -->
    <GlobalInstallmentConfig
      :config="globalConfig"
      @update:config="$emit('update:globalConfig', $event)"
    />

    <!-- Size-Specific Installment Configuration -->
    <div class="space-y-4">
      <h4 class="text-lg font-medium text-gray-800">Size-Specific Installment Settings</h4>
      <SizeInstallmentConfig
        v-for="(size, index) in sizes"
        :key="`installment-${index}`"
        :size="size"
        :index="index"
        @update:config="$emit('update:sizeConfig', index, $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SizePrice, InstallmentConfig, SizeInstallmentConfig } from '~/types/artwork'

interface Props {
  globalConfig: InstallmentConfig
  sizes: SizePrice[]
}

interface Emits {
  (e: 'update:globalConfig', config: Partial<InstallmentConfig>): void
  (e: 'update:sizeConfig', index: number, config: Partial<SizeInstallmentConfig>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>
