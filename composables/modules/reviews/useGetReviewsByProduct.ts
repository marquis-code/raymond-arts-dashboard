import { review_api } from '@/apiFactory/modules/reviews'
import { ref } from 'vue'

export const useGetReviewsByProduct = (productId: string, page: number = 1, limit: number = 10, includeAll: string = "") => {
  const reviews = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getReviewsByProduct = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await review_api.$_get_reviews_by_product(productId, page, limit, includeAll)
      reviews.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch product reviews'
    } finally {
      loading.value = false
    }
  }

  return {
    reviews,
    loading,
    error,
    getReviewsByProduct,
  }
}
