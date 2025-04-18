import { payment_links_api } from '@/apiFactory/modules/payment-links'
import { ref } from 'vue'

export const useUsePaymentLink = (data: any) => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const usePaymentLink = async () => {
    loading.value = true
    error.value = null
    try {
      await payment_links_api.$_use_payment_link(data)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to use payment link'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    usePaymentLink,
  }
}
