import { payment_links_api } from '@/apiFactory/modules/payment-links'
import { ref } from 'vue'

export const useUpdatePaymentLinkStatus = (id: string, status: any) => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const updatePaymentLinkStatus = async () => {
    loading.value = true
    error.value = null
    try {
      await payment_links_api.$_update_payment_link_status(id, status)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update payment link status'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    updatePaymentLinkStatus,
  }
}
