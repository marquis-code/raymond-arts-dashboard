import { invoices_api } from '@/apiFactory/modules/invoice'
import { ref } from 'vue'

export const useUpdateInvoiceStatus = (id: string, status: any) => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const updateInvoiceStatus = async () => {
    loading.value = true
    error.value = null
    try {
      await invoices_api.$_update_invoice_status(id, status)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update invoice status'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    updateInvoiceStatus,
  }
}
