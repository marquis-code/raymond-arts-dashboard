import { content_api } from "@/apiFactory/modules/content"
import { ref } from "vue"

export const useFetchPublicContents = () => {
  const contents = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPublicContents = async (type?: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await content_api.$_fetch_public_contents(type)
      contents.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to fetch public contents"
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    contents,
    loading,
    error,
    fetchPublicContents,
  }
}
