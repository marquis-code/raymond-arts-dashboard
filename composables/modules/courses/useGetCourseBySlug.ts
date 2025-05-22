import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useGetCourseBySlug = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const course = ref<any>(null)

  const getCourseBySlug = async (slug: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_get_course_by_slug(slug)
      course.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch course'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    course,
    getCourseBySlug,
  }
}