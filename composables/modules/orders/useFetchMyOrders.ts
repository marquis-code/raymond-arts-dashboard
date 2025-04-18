import { orders_api } from '@/apiFactory/modules/orders'
import { ref } from 'vue'

export const useFetchMyOrders = (pagination: any) => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const myOrders = ref<any[]>([])

  const fetchMyOrders = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await orders_api.$_fetch_my_orders(pagination)
      myOrders.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch my orders'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    myOrders,
    fetchMyOrders,
  }
}
