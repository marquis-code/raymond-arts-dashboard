import { enquiry_api } from '@/apiFactory/modules/enquiries'
import { ref } from 'vue'

export const useGetEnquiryById = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const enquiry = ref(null)

  const getEnquiryById = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await enquiry_api.$_get_enquiry_by_id(id)
      enquiry.value = response.data.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to get enquiry'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    enquiry,
    getEnquiryById,
  }
}
