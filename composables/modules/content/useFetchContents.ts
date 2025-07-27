import { content_api } from "@/apiFactory/modules/content"
import { ref } from "vue"

export const useFetchContents = () => {
  const contents = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalPages = ref(0)
  const currentPage = ref(1)
  const total = ref(0)

  const fetchContents = async (filters?: {
    type?: string
    status?: string
    page?: number
    limit?: number
  }) => {
    loading.value = true
    error.value = null

    try {
      const response = await content_api.$_fetch_all_contents(filters)
      contents.value = response.data.content
      totalPages.value = response.data.totalPages
      currentPage.value = response.data.page
      total.value = response.data.total
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to fetch contents"
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    contents,
    loading,
    error,
    totalPages,
    currentPage,
    total,
    fetchContents,
  }
}
