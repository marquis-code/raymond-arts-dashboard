import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useGenerateCertificate = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const certificate = ref<any>(null)

  const generateCertificate = async (courseId: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_generate_certificate(courseId)
      certificate.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to generate certificate'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    certificate,
    generateCertificate,
  }
}