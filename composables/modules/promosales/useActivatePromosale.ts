import { promosale_api } from '@/apiFactory/modules/promosales'
import { ref, onMounted } from 'vue'

export const useActivatePromosale = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
  
    const activatePromosale = async (id: string) => {
      loading.value = true
      error.value = null
      try {
        const response = await promosale_api.$_activate_promosale(id)
        return response.data
      } catch (e: any) {
        error.value = e.response?.data?.message || 'Failed to activate promosale'
        throw error.value
      } finally {
        loading.value = false
      }
    }
  
    return {
      loading,
      error,
      activatePromosale,
    }
  }
  