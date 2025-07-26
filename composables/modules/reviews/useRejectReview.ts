import { review_api } from '@/apiFactory/modules/reviews'
import { ref } from 'vue'

export const useRejectReview = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const rejectReview = async (id: string, rejectionReason: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await review_api.$_reject_review(id, rejectionReason)
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to reject review'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    rejectReview,
  }
}
