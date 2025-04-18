import { inventory_api } from '@/apiFactory/modules/inventory'
import { ref } from 'vue'

export const useCreateInventory = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createInventory = async (data: any) => {
    loading.value = true
    error.value = null
    try {
      await inventory_api.$_create_inventory(data)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create inventory'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    createInventory,
  }
}
