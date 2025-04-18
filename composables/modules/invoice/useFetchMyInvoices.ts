import { invoices_api } from '@/apiFactory/modules/invoice'
import { ref } from 'vue'

export const useFetchMyInvoices = (pagination: any) => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const myInvoices = ref<any[]>([])

  const fetchMyInvoices = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await invoices_api.$_fetch_my_invoices(pagination)
      myInvoices.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch my invoices'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    myInvoices,
    fetchMyInvoices,
  }
}
