import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useCreateCourse = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const course = ref<any>(null)

  const createCourse = async (courseData: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_create_course(courseData)
      course.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create course'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    course,
    createCourse,
  }
}