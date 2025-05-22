import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useUpdateLessonProgress = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const updateLessonProgress = async (courseId: string, lessonId: string, completed: boolean) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_update_lesson_progress(courseId, lessonId, completed)
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update lesson progress'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    updateLessonProgress,
  }
}