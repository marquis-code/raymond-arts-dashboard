import { ref } from 'vue'
import { originals_api } from '@/apiFactory/modules/originals'

export const useCreateOriginal = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createOriginal = async (data: any) => {
    loading.value = true
    error.value = null
    try {
      await originals_api.$_create_original(data)
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create original'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return { loading, error, createOriginal }
}
