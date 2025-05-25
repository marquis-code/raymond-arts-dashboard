import { ref } from 'vue'
import { drawing_type_api } from '@/apiFactory/modules/drawing-types'

export const useDeleteDrawingType = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const deleteDrawingType = async (id: string) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      await drawing_type_api.$_delete_drawing_type(id)
      success.value = true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete drawing type'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    success,
    deleteDrawingType,
  }
}
