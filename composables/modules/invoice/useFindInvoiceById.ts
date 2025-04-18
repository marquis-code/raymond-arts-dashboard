import { invoices_api } from '@/apiFactory/modules/invoice'
import { ref } from 'vue'

export const useFindInvoiceById = (id: string) => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const invoice = ref<any>(null)

  const findInvoiceById = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await invoices_api.$_find_invoice_by_id(id)
      invoice.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to find invoice by ID'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    invoice,
    findInvoiceById,
  }
}
