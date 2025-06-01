import { promosale_api } from '@/apiFactory/modules/promosales'
import { ref, onMounted } from 'vue'

export const useCreatePromosale = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
  
    const createPromosale = async (data: any) => {
      loading.value = true
      error.value = null
      try {
        const response = await promosale_api.$_create_promosale(data)
        return response.data
      } catch (e: any) {
        error.value = e.response?.data?.message || 'Failed to create promosale'
        throw error.value
      } finally {
        loading.value = false
      }
    }
  
    return {
      loading,
      error,
      createPromosale,
    }
  }
  