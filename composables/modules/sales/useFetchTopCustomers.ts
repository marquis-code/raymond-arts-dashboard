import { sales_api } from '@/apiFactory/modules/sales'
import { ref } from 'vue'

export const useTopCustomers = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const customers = ref([])

  const getTopCustomers = async (limit?: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await sales_api.$_get_top_customers(limit)
      customers.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch top customers'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    getTopCustomers()
  })

  return {
    loading,
    customers,
    error,
    getTopCustomers,
  }
}
