import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useUserReviews = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const reviews = ref<any[]>([])

  const getUserReviews = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_get_user_reviews()
      reviews.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch user reviews'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    reviews,
    getUserReviews,
  }
}