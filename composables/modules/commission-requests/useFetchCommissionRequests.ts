import { ref, onMounted } from 'vue'
import { commission_request_api } from '@/apiFactory/modules/commission-requests'

export const useFetchCommissionRequests = (page = 1, limit = 10) => {
  const requests = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCommissionRequests = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await commission_request_api.$_fetch_commission_requests(page, limit)
      console.log(response, 'tes ere')
      requests.value = response.data.commissions
      return requests.value
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch commission requests'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchCommissionRequests()
  })

  return {
    requests,
    loading,
    error,
    fetchCommissionRequests,
  }
}
