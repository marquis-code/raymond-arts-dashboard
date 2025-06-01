import { promosale_api } from '@/apiFactory/modules/promosales'
import { ref, onMounted } from 'vue'

export const useFetchPromosaleById = () => {
    const promosale = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
  
    const fetchById = async () => {
      loading.value = true
      error.value = null
      try {
        const response = await promosale_api.$_fetch_promosales_by_id(id)
        promosale.value = response.data.data
        return response.data.data
      } catch (e: any) {
        error.value = e.response?.data?.message || 'Failed to fetch promosale by ID'
        throw error.value
      } finally {
        loading.value = false
      }
    }
  
    onMounted(() => fetchById())
  
    return {
      promosale,
      loading,
      error,
      fetchById,
    }
  }
  