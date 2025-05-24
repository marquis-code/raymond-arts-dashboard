import { enquiry_api } from '@/apiFactory/modules/enquiries'
import { ref } from 'vue'

export const useUpdateEnquiryStatus = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const statusUpdated = ref(null)

  const updateStatus = async (id: string, data: { status: string; adminNotes?: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await enquiry_api.$_update_enquiry_status(id, data)
      statusUpdated.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update enquiry status'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    statusUpdated,
    updateStatus,
  }
}
