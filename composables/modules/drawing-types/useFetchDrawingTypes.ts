import { ref, onMounted } from 'vue'
import { drawing_type_api } from '@/apiFactory/modules/drawing-types'

export const useFetchDrawingTypes = () => {
  const drawingTypes = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDrawingTypes = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await drawing_type_api.$_get_drawing_types()
      drawingTypes.value = response.data
      return drawingTypes.value
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch drawing types'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchDrawingTypes)

  return {
    drawingTypes,
    loading,
    error,
    fetchDrawingTypes,
  }
}
