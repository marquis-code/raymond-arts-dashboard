import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useCheckEnrollment = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isEnrolled = ref(false)

  const checkEnrollment = async (courseId: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_check_enrollment(courseId)
      isEnrolled.value = response.data.isEnrolled
      return response.data.isEnrolled
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to check enrollment status'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    isEnrolled,
    checkEnrollment,
  }
}