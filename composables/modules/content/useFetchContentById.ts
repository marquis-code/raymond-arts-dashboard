import { content_api } from "@/apiFactory/modules/content"
import { ref } from "vue"

export const useFetchContentById = () => {
  const content = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchContentById = async (id: string) => {
    loading.value = true
    error.value = null
    content.value = null

    try {
      const response = await content_api.$_get_content_by_id(id)
      content.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to fetch content"
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    content,
    loading,
    error,
    fetchContentById,
  }
}
