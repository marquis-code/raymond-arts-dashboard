import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useVerifyCertificate = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const certificate = ref<any>(null)

  const verifyCertificate = async (certificateNumber: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_verify_certificate(certificateNumber)
      certificate.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to verify certificate'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    certificate,
    verifyCertificate,
  }
}