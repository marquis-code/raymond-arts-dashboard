import { promosale_api } from '@/apiFactory/modules/promosales'
import { ref, onMounted } from 'vue'

export const useDeletePromosale = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
  
    const deletePromosale = async (id: string) => {
      loading.value = true
      error.value = null
      try {
        const response = await promosale_api.$_delete_promosale(id)
        return response.data
      } catch (e: any) {
        error.value = e.response?.data?.message || 'Failed to delete promosale'
        throw error.value
      } finally {
        loading.value = false
      }
    }
  
    return {
      loading,
      error,
      deletePromosale,
    }
  }
  