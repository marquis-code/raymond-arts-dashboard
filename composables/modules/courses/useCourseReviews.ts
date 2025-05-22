import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useCourseReviews = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const reviews = ref<any[]>([])

  const getCourseReviews = async (courseId: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_get_course_reviews(courseId)
      reviews.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch course reviews'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    reviews,
    getCourseReviews,
  }
}