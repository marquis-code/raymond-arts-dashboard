import { orders_api } from '@/apiFactory/modules/orders'
import { ref } from 'vue'

export const useGetOrderStatistics = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const orderStatistics = ref<any>(null)

  const getOrderStatistics = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await orders_api.$_get_order_statistics()
      orderStatistics.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch order statistics'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    orderStatistics,
    getOrderStatistics,
  }
}
