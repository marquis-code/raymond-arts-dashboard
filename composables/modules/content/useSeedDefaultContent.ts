import { content_api } from "@/apiFactory/modules/content"
import { ref } from "vue"

export const useSeedDefaultContent = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const result = ref<any>(null)

  const seedDefaultContent = async () => {
    loading.value = true
    error.value = null
    result.value = null

    try {
      const response = await content_api.$_seed_default_content()
      result.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to seed default content"
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    result,
    seedDefaultContent,
  }
}
