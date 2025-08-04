import { ref } from 'vue'
import { originals_api } from '@/apiFactory/modules/originals'

export const useUpdateOriginal = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const updateOriginal = async (id: string, data: any) => {
    loading.value = true
    error.value = null
    try {
      await originals_api.$_update_original(id, data)
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update original'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return { loading, error, updateOriginal }
}
