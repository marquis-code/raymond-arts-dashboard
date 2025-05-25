import { ref } from 'vue'
import { commission_request_api } from '@/apiFactory/modules/commission-requests'

export const useGetCommissionRequestsByStatus = () => {
  const requests = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getByStatus = async (status: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await commission_request_api.$_get_commission_requests_by_status(status)
      requests.value = response.data
      return requests.value
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch by status'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    requests,
    loading,
    error,
    getByStatus,
  }
}
