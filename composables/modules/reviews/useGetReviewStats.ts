import { review_api } from '@/apiFactory/modules/reviews'
import { ref } from 'vue'

export const useGetReviewStats = (productId: string) => {
  const stats = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getReviewStats = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await review_api.$_get_review_stats(productId)
      stats.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch review stats'
    } finally {
      loading.value = false
    }
  }

  return {
    stats,
    loading,
    error,
    getReviewStats,
  }
}
