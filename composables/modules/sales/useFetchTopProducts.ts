import { sales_api } from '@/apiFactory/modules/sales'
import { ref } from 'vue'

export const useTopProducts = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const products = ref([])

  const getTopProducts = async (limit?: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await sales_api.$_get_top_products(limit)
      products.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch top products'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    getTopProducts()
  })

  return {
    loading,
    products,
    error,
    getTopProducts,
  }
}
