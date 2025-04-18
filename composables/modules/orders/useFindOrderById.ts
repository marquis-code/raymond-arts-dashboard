import { orders_api } from '@/apiFactory/modules/orders'
import { ref } from 'vue'

export const useFindOrderById = (id: string) => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const order = ref<any>(null)

  const findOrderById = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await orders_api.$_find_order_by_id(id)
      order.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to find order by ID'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    order,
    findOrderById,
  }
}
