import { orders_api } from '@/apiFactory/modules/orders'
import { ref } from 'vue'

export const useCreateOrder = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createOrder = async (data: any) => {
    loading.value = true
    error.value = null
    try {
      await orders_api.$_create_order(data)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create order'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    createOrder,
  }
}
