import { payment_links_api } from '@/apiFactory/modules/payment-links'
import { ref } from 'vue'

export const useFetchAllPaymentLinks = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const paymentLinks = ref<any[]>([])

  const fetchAllPaymentLinks = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await payment_links_api.$_fetch_all_payment_links()
      paymentLinks.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch payment links'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchAllPaymentLinks()
  })

  return {
    loading,
    error,
    paymentLinks,
    fetchAllPaymentLinks,
  }
}
