import { transactions_api } from '@/apiFactory/modules/transactions'
import { ref } from 'vue'

export const useFetchTransactions = () => {
  const transactions = ref<any>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch products with pagination
  const fetchTransactions = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await transactions_api.$_fetch_all_transactions()
      transactions.value = response.data.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch transactions'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchTransactions()
  })

  return {
    fetchTransactions,
    transactions,
    loading,
    error
  }
}