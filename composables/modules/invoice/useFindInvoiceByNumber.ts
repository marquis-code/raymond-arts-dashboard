import { invoices_api } from '@/apiFactory/modules/invoice'
import { ref } from 'vue'

export const useFindInvoiceByNumber = (invoiceNumber: string) => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const invoice = ref<any>(null)

  const findInvoiceByNumber = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await invoices_api.$_find_by_invoice_number(invoiceNumber)
      invoice.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to find invoice by number'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    invoice,
    findInvoiceByNumber,
  }
}
