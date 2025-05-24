import { enquiry_api } from '@/apiFactory/modules/enquiries'
import { ref } from 'vue'

export const useDeleteEnquiry = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const deleted = ref(false)

  const deleteEnquiry = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await enquiry_api.$_delete_enquiry(id)
      deleted.value = true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete enquiry'
      deleted.value = f/alse
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    deleted,
    deleteEnquiry,
  }
}
