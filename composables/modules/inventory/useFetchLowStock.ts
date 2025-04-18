import { inventory_api } from '@/apiFactory/modules/inventory'
import { ref } from 'vue'

export const useFetchLowStock = (threshold?: number) => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lowStockItems = ref<any[]>([])

  const fetchLowStock = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await inventory_api.$_fetch_low_stock(threshold)
      lowStockItems.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch low stock items'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    lowStockItems,
    fetchLowStock,
  }
}
