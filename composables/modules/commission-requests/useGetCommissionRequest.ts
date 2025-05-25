import { ref } from 'vue'
import { commission_request_api } from '@/apiFactory/modules/commission-requests'

export const useGetCommissionRequest = () => {
  const request = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getCommissionRequest = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await commission_request_api.$_get_commission_request(id)
      request.value = response.data
      return request.value
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch commission request'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    request,
    loading,
    error,
    getCommissionRequest,
  }
}
