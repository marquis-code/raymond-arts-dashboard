import { content_api } from "@/apiFactory/modules/content"
import { ref } from "vue"

export const useUpdateContent = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const updatedContent = ref<any>(null)

  const updateContent = async (id: string, data: any) => {
    loading.value = true
    error.value = null
    updatedContent.value = null

    try {
      const response = await content_api.$_update_content(id, data)
      updatedContent.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to update content"
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    updatedContent,
    updateContent,
  }
}
