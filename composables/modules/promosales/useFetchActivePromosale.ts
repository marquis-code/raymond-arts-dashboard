import { promosale_api } from '@/apiFactory/modules/promosales'
import { ref, onMounted } from 'vue'

export const useFetchActivePromosale = () => {
    const activePromosale = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
  
    const fetchActive = async () => {
      loading.value = true
      error.value = null
      try {
        const response = await promosale_api.$_fetch_currently_active_promosale({})
        activePromosale.value = response.data.data
        return response.data.data
      } catch (e: any) {
        error.value = e.response?.data?.message || 'Failed to fetch active promosale'
        throw error.value
      } finally {
        loading.value = false
      }
    }
  
    onMounted(() => fetchActive())
  
    return {
      activePromosale,
      loading,
      error,
      fetchActive,
    }
  }
  