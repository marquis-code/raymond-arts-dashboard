import { content_api } from "@/apiFactory/modules/content"
import { ref } from "vue"

export const useCreateContent = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const createdContent = ref<any>(null)

  const createContent = async (data: any) => {
    loading.value = true
    error.value = null
    createdContent.value = null

    try {
      const response = await content_api.$_create_content(data)
      createdContent.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to create content"
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    createdContent,
    createContent,
  }
}
