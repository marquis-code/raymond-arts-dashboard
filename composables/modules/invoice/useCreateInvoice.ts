import { invoices_api } from '@/apiFactory/modules/invoice'
import { ref } from 'vue'

export const useCreateInvoice = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createInvoice = async (data: any) => {
    loading.value = true
    error.value = null
    try {
      await invoices_api.$_create_invoice(data)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create invoice'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    createInvoice,
  }
}
