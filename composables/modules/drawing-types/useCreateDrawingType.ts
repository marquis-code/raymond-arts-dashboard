import { ref } from 'vue'
import { drawing_type_api } from '@/apiFactory/modules/drawing-types'

export const useCreateDrawingType = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const result = ref(null)

  const createDrawingType = async (data: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await drawing_type_api.$_create_drawing_type(data)
      result.value = response.data
      return result.value
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create drawing type'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    result,
    createDrawingType,
  }
}
