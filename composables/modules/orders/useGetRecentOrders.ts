import { orders_api } from '@/apiFactory/modules/orders'
import { ref } from 'vue'

export const useGetRecentOrders = (limit?: number) => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const recentOrders = ref<any[]>([])

  const getRecentOrders = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await orders_api.$_get_recent_orders(limit)
      recentOrders.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch recent orders'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    recentOrders,
    getRecentOrders,
  }
}
