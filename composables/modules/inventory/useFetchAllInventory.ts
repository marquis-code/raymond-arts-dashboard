import { inventory_api } from '@/apiFactory/modules/inventory'
import { ref } from 'vue'

export const useFetchAllInventory = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const inventory = ref<any[]>([])

  const fetchAllInventory = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await inventory_api.$_fetch_all_inventory()
      console.log(response, 'inventory list')
      inventory.value = response.data.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch inventory'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchAllInventory()
  })

  return {
    loading,
    error,
    inventory,
    fetchAllInventory,
  }
}
