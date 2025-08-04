import { ref } from 'vue'
import { originals_api } from '@/apiFactory/modules/originals'

export const useFetchOriginals = () => {
  const loading = ref(false)
  const originals = ref([])
  const error = ref<string | null>(null)

  const fetchOriginals = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await originals_api.$_fetch_originals()
      console.log(res, 'origunalas')
      originals.value = res.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch originals'
    } finally {
      loading.value = false
    }
  }

  return { loading, originals, error, fetchOriginals }
}
