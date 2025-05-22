import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useUpdateCourse = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const course = ref<any>(null)

  const updateCourse = async (id: string, courseData: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_update_course(id, courseData)
      course.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update course'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    course,
    updateCourse,
  }
}