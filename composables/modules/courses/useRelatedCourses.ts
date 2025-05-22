import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useRelatedCourses = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const courses = ref<any[]>([])

  const getRelatedCourses = async (id: string, limit?: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_get_related_courses(id, limit)
      courses.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch related courses'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    courses,
    getRelatedCourses,
  }
}