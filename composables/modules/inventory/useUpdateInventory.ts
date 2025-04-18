import { inventory_api } from '@/apiFactory/modules/inventory'
import { ref } from 'vue'

export const useUpdateInventory = (productId: string, data: any) => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const updateInventory = async () => {
    loading.value = true
    error.value = null
    try {
      await inventory_api.$_update_inventory(productId, data)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update inventory'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    updateInventory,
  }
}
