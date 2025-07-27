import { content_api } from "@/apiFactory/modules/content"
import { ref } from "vue"

export const useDeleteContent = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const deleteContent = async (id: string) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      await content_api.$_delete_content(id)
      success.value = true
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to delete content"
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    success,
    deleteContent,
  }
}
