import { content_api } from "@/apiFactory/modules/content"
import { ref } from "vue"

export const useUpdateContentStatus = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const updatedContent = ref<any>(null)

  const updateContentStatus = async (id: string, status: string) => {
    loading.value = true
    error.value = null
    updatedContent.value = null

    try {
      const response = await content_api.$_update_content_status(id, status)
      updatedContent.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to update content status"
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    updatedContent,
    updateContentStatus,
  }
}
