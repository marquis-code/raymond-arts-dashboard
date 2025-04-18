import { inventory_api } from '@/apiFactory/modules/inventory'
import { ref } from 'vue'

export const useFetchOutOfStock = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const outOfStockItems = ref<any[]>([])

  const fetchOutOfStock = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await inventory_api.$_fetch_out_of_stock()
      outOfStockItems.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch out of stock items'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    outOfStockItems,
    fetchOutOfStock,
  }
}
