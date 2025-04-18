import { inventory_api } from '@/apiFactory/modules/inventory'
import { ref } from 'vue'

export const useAddInventoryHistory = (productId: string, historyData: any) => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const addInventoryHistory = async () => {
    loading.value = true
    error.value = null
    try {
      await inventory_api.$_add_inventory_history(productId, historyData)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to add inventory history'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    addInventoryHistory,
  }
}
