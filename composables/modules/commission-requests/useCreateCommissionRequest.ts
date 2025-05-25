import { ref } from 'vue'
import { commission_request_api } from '@/apiFactory/modules/commission-requests'

export const useCreateCommissionRequest = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const result = ref(null)

  const createCommissionRequest = async (formData: FormData) => {
    loading.value = true
    error.value = null
    try {
      const response = await commission_request_api.$_create_commission_request(formData)
      result.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create commission request'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    result,
    createCommissionRequest,
  }
}
