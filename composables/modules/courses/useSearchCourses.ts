import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useSearchCourses = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const results = ref<any[]>([])

  const searchCourses = async (query: string, limit?: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_search_courses(query, limit)
      results.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to search courses'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    results,
    searchCourses,
  }
}