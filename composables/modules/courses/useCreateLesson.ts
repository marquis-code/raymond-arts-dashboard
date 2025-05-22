import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useCreateLesson = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lesson = ref<any>(null)

  const createLesson = async (lessonData: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_create_lesson(lessonData)
      lesson.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create lesson'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    lesson,
    createLesson,
  }
}