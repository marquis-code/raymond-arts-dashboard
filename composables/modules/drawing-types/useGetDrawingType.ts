import { ref } from 'vue'
import { drawing_type_api } from '@/apiFactory/modules/drawing-types'

export const useGetDrawingType = () => {
  const drawingType = ref(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getDrawingType = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await drawing_type_api.$_get_drawing_type(id)
      drawingType.value = response.data
      return drawingType.value
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch drawing type'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    drawingType,
    loading,
    error,
    getDrawingType,
  }
}
