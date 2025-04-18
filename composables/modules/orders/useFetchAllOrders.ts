import { orders_api } from '@/apiFactory/modules/orders'
import { ref } from 'vue'

export const useFetchAllOrders = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const orders = ref<any[]>([])

  const fetchAllOrders = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await orders_api.$_fetch_all_orders()
      console.log(response, 'orders response')
      orders.value = response.data.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch orders'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchAllOrders()
  })

  return {
    loading,
    error,
    orders,
    fetchAllOrders,
  }
}
