import { payment_links_api } from '@/apiFactory/modules/payment-links'
import { ref } from 'vue'

export const useFetchPaymentLinkById = (id: string) => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const paymentLink = ref<any>(null)

  const fetchPaymentLinkById = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await payment_links_api.$_fetch_payment_link_by_id(id)
      paymentLink.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch payment link by ID'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    paymentLink,
    fetchPaymentLinkById,
  }
}
