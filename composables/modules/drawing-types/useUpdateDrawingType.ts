import { ref } from 'vue'
import { drawing_type_api } from '@/apiFactory/modules/drawing-types'

export const useUpdateDrawingType = () => {
  const result = ref(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const updateDrawingType = async (id: string, data: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await drawing_type_api.$_update_drawing_type(id, data)
      result.value = response.data
      return result.value
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update drawing type'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    result,
    loading,
    error,
    updateDrawingType,
  }
}
