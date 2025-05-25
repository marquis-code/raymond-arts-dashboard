import { ref } from 'vue'
import { commission_request_api } from '@/apiFactory/modules/commission-requests'

export const useUpdateCommissionRequest = () => {
  const result = ref(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const updateCommissionRequest = async (id: string, data: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await commission_request_api.$_update_commission_request(id, data)
      result.value = response.data
      return result.value
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update commission request'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    result,
    loading,
    error,
    updateCommissionRequest,
  }
}
