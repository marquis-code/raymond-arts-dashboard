import { review_api } from '@/apiFactory/modules/reviews'
import { ref } from 'vue'

export const useCreateReview = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createReview = async (data: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await review_api.$_create_review(data)
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create review'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    createReview,
  }
}
