import { ref } from 'vue'
import { originals_api } from '@/apiFactory/modules/originals'

export const useFetchOriginalById = () => {
  const loading = ref(false)
  const original = ref(null)
  const error = ref<string | null>(null)

  const fetchOriginalById = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await originals_api.$_get_original_by_id(id)
      original.value = res.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch original'
    } finally {
      loading.value = false
    }
  }

  return { loading, original, error, fetchOriginalById }
}
