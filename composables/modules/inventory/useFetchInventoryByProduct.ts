import { inventory_api } from '@/apiFactory/modules/inventory'
import { ref } from 'vue'

export const useFetchInventoryByProduct = (productId: string) => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const productInventory = ref<any>(null)

  const fetchInventoryByProduct = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await inventory_api.$_fetch_inventory_by_product(productId)
      productInventory.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch inventory for the product'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    productInventory,
    fetchInventoryByProduct,
  }
}
