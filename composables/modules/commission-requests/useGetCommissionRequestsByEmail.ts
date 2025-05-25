import { ref } from 'vue'
import { commission_request_api } from '@/apiFactory/modules/commission-requests'

export const useGetCommissionRequestsByEmail = () => {
  const requests = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getByEmail = async (email: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await commission_request_api.$_get_commission_requests_by_email(email)
      requests.value = response.data
      return requests.value
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch by email'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    requests,
    loading,
    error,
    getByEmail,
  }
}
