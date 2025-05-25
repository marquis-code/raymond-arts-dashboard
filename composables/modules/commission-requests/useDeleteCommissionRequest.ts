import { ref } from 'vue'
import { commission_request_api } from '@/apiFactory/modules/commission-requests'

export const useDeleteCommissionRequest = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const deleteCommissionRequest = async (id: string) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      await commission_request_api.$_delete_commission_request(id)
      success.value = true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete commission request'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    success,
    deleteCommissionRequest,
  }
}
