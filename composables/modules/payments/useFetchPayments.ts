import { payments_api } from '@/apiFactory/modules/payments'
import { ref } from 'vue'

export const useFetchAllPayments = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const payments = ref<any[]>([])

  const fetchAllPayments = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await payments_api.$_fetch_payments()
      console.log(response, 'orders response')
      payments.value = response?.data?.data?.transactions?.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch orders'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchAllPayments()
  })

  return {
    loading,
    error,
    payments,
    fetchAllPayments,
  }
}
