import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useDeleteCourse = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const deleteCourse = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_delete_course(id)
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete course'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    deleteCourse,
  }
}