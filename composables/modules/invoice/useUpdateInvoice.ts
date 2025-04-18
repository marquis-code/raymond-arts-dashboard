import { invoices_api } from '@/apiFactory/modules/invoice'
import { ref } from 'vue'

export const useUpdateInvoice = (id: string, data: any) => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const updateInvoice = async () => {
    loading.value = true
    error.value = null
    try {
      await invoices_api.$_update_invoice(id, data)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update invoice'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    updateInvoice,
  }
}
