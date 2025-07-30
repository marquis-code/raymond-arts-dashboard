import { review_api } from '@/apiFactory/modules/reviews'
import { ref } from 'vue'

export const useGetAllReviews = (page: number = 1, limit: number = 10) => {
  const reviews = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getAllReviews = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await review_api.$_get_all_reviews(page, limit)
      reviews.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch reviews'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    getAllReviews()
  })

  return {
    reviews,
    loading,
    error,
    getAllReviews,
  }
}
