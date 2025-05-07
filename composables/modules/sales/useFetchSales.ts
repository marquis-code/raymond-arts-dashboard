            import { sales_api } from '@/apiFactory/modules/sales'
import { ref } from 'vue'

export const useFetchAllSales = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const sales = ref([])

  const fetchAllSales = async (pagination: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await sales_api.$_fetch_all_sales(pagination)
      console.log(response, 'sales response')
      sales.value = response?.data?.data
      return response?.data?.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch sales'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchAllSales()
  })

  return {
    loading,
    error,
    sales,
    fetchAllSales,
  }
}
