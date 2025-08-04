import { ref } from 'vue'
import { originals_api } from '@/apiFactory/modules/originals'

export const useDeleteOriginal = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const deleteOriginal = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await originals_api.$_delete_original(id)
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete original'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return { loading, error, deleteOriginal }
}
