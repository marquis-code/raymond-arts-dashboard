import { payment_links_api } from '@/apiFactory/modules/payment-links'
import { ref } from 'vue'

export const useFetchMyPaymentLinks = (pagination: any) => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const myPaymentLinks = ref<any[]>([])

  const fetchMyPaymentLinks = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await payment_links_api.$_fetch_my_payment_links(pagination)
      myPaymentLinks.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch my payment links'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    myPaymentLinks,
    fetchMyPaymentLinks,
  }
}
