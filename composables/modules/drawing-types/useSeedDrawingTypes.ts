import { ref } from 'vue'
import { drawing_type_api } from '@/apiFactory/modules/drawing-types'

export const useSeedDrawingTypes = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const result = ref(null)

  const seedDrawingTypes = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await drawing_type_api.$_seed_drawing_types()
      result.value = response.data
      return result.value
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to seed drawing types'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    result,
    seedDrawingTypes,
  }
}
