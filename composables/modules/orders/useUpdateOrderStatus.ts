import { orders_api } from '@/apiFactory/modules/orders'
import { ref } from 'vue'

export const useUpdateOrderStatus = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const updateOrderStatus = async (id: string, data: any) => {
    loading.value = true
    error.value = null
    try {
      await orders_api.$_update_order_status(id, data)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update order status'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    updateOrderStatus,
  }
}
