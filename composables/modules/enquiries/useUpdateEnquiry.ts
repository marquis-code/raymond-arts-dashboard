import { enquiry_api } from '@/apiFactory/modules/enquiries'
import { ref } from 'vue'

export const useUpdateEnquiry = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const updated = ref(null)

  const updateEnquiry = async (id: string, data: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await enquiry_api.$_update_enquiry(id, data)
      updated.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update enquiry'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    updated,
    updateEnquiry,
  }
}
