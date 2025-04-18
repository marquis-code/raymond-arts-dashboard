import { payment_links_api } from '@/apiFactory/modules/payment-links'
import { ref } from 'vue'

export const useRemovePaymentLink = (id: string) => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const removePaymentLink = async () => {
    loading.value = true
    error.value = null
    try {
      await payment_links_api.$_remove_payment_link(id)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to remove payment link'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    removePaymentLink,
  }
}
