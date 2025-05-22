import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useDeleteLesson = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const deleteLesson = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_delete_lesson(id)
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete lesson'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    deleteLesson,
  }
}