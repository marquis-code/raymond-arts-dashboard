import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useUpdateLesson = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lesson = ref<any>(null)

  const updateLesson = async (id: string, lessonData: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_update_lesson(id, lessonData)
      lesson.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update lesson'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    lesson,
    updateLesson,
  }
}