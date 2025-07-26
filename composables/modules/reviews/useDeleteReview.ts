import { review_api } from '@/apiFactory/modules/reviews'
import { ref } from 'vue'

export const useDeleteReview = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const deleteReview = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await review_api.$_delete_review(id)
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete review'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    deleteReview,
  }
}
