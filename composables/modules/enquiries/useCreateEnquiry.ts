import { enquiry_api } from '@/apiFactory/modules/enquiries'
import { ref } from 'vue'

export const useCreateEnquiry = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const result = ref(null)

  const createEnquiry = async (data: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await enquiry_api.$_create_enquiry(data)
      result.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create enquiry'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    result,
    createEnquiry,
  }
}
