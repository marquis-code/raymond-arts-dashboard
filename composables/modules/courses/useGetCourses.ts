import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useGetCourses = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const courses = ref<any[]>([])
  const pagination = ref<any>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  })

  const getCourses = async (params: any = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_get_all_courses(params)
      courses.value = response.data.items || response.data
      
      // Handle pagination if available in response
      if (response.data.meta) {
        pagination.value = {
          page: response.data.meta.currentPage,
          limit: response.data.meta.itemsPerPage,
          totalItems: response.data.meta.totalItems,
          totalPages: response.data.meta.totalPages
        }
      }
      
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch courses'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    courses,
    pagination,
    getCourses,
  }
}