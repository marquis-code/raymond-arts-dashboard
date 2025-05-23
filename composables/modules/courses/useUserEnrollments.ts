import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useUserEnrollments = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const enrollments = ref<any[]>([])

  const getUserEnrollments = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_get_user_enrollments()
      console.log(res, 'enrollments')
      enrollments.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch user enrollments'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    getUserEnrollments()
  })

  return {
    loading,
    error,
    enrollments,
    getUserEnrollments,
  }
}