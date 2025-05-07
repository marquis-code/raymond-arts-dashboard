import { sales_api } from '@/apiFactory/modules/sales'
import { ref } from 'vue'

export const useSalesStatistics = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const statistics = ref({})

  const getStatistics = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await sales_api.$_get_sales_statistics()
      statistics.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to get sales statistics'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    getStatistics()
  })

  return {
    loading,
    error,
    getStatistics,
    statistics
  }
}
