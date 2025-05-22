import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useUserCertificates = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const certificates = ref<any[]>([])

  const getUserCertificates = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_get_user_certificates()
      certificates.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch user certificates'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    certificates,
    getUserCertificates,
  }
}