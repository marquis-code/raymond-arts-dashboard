import { promosale_api } from '@/apiFactory/modules/promosales'
import { ref, onMounted } from 'vue'

export const useDeactivatePromosale = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
  
    const deactivatePromosale = async (id: string, payload: any) => {
      loading.value = true
      error.value = null
      try {
        const response = await promosale_api.$_deactivate_promosale(id, payload)
        return response.data
      } catch (e: any) {
        error.value = e.response?.data?.message || 'Failed to deactivate promosale'
        throw error.value
      } finally {
        loading.value = false
      }
    }
  
    return {
      loading,
      error,
      deactivatePromosale,
    }
  }
  