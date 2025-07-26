import { review_api } from '@/apiFactory/modules/reviews'
import { ref } from 'vue'

export const useGetPendingReviews = (page: number = 1, limit: number = 10) => {
  const reviews = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getPendingReviews = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await review_api.$_get_pending_reviews(page, limit)
      reviews.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch pending reviews'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    getPendingReviews()
  })

  return {
    reviews,
    loading,
    error,
    getPendingReviews,
  }
}
