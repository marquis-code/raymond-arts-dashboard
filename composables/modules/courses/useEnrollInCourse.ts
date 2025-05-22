import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useEnrollInCourse = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const enrollment = ref<any>(null)

  const enrollInCourse = async (courseId: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_enroll_in_course(courseId)
      enrollment.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to enroll in course'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    enrollment,
    enrollInCourse,
  }
}