import { invoices_api } from '@/apiFactory/modules/invoice'
import { ref } from 'vue'

export const useDeleteInvoice = (id: string) => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const deleteInvoice = async () => {
    loading.value = true
    error.value = null
    try {
      await invoices_api.$_delete_invoice(id)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete invoice'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    deleteInvoice,
  }
}
