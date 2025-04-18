import { invoices_api } from '@/apiFactory/modules/invoice'
import { ref } from 'vue'

export const useFetchAllInvoices = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const invoices = ref<any[]>([])

  const fetchAllInvoices = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await invoices_api.$_fetch_all_invoices()
      invoices.value = response.data.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch invoices'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchAllInvoices()
  })

  return {
    loading,
    error,
    invoices,
    fetchAllInvoices,
  }
}
