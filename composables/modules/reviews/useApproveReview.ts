import { review_api } from '@/apiFactory/modules/reviews'
import { ref } from 'vue'

export const useApproveReview = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const approveReview = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await review_api.$_approve_review(id)
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to approve review'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    approveReview,
  }
}
