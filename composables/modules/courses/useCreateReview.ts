import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useCreateReview = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const review = ref<any>(null)

  const createReview = async (reviewData: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_create_review(reviewData)
      review.value = response.data
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
    review,
    createReview,
  }
}