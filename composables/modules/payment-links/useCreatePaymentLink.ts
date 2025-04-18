import { payment_links_api } from '@/apiFactory/modules/payment-links'
import { ref } from 'vue'

export const useCreatePaymentLink = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createPaymentLink = async (data: any) => {
    loading.value = true
    error.value = null
    try {
      await payment_links_api.$_create_payment_link(data)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create payment link'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    createPaymentLink,
  }
}
