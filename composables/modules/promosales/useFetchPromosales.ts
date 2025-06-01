import { promosale_api } from '@/apiFactory/modules/promosales'
import { ref, onMounted } from 'vue'

export const useFetchPromosales = () => {
  const promosales = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPromosales = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await promosale_api.$_fetch_promosales({})
      console.log(response, 'res  here')
      promosales.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch promosales'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchPromosales()
  })

  return {
    promosales,
    loading,
    error,
    fetchPromosales,
  }
}
