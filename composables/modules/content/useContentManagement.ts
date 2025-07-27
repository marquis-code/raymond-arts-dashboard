import { content_api } from "@/apiFactory/modules/content"
import { ref, computed } from "vue"

export const useContentManagement = () => {
  const contents = ref<any[]>([])
  const currentContent = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalPages = ref(0)
  const currentPage = ref(1)
  const total = ref(0)

  const contentTypes = [
    { value: "home_hero", label: "Home Hero", imageCount: 1 },
    { value: "portrait_hero", label: "Portrait Hero", imageCount: 1 },
    { value: "gallery_hero", label: "Gallery Hero", imageCount: 1 },
    { value: "shop_prints_hero", label: "Shop Prints Hero", imageCount: 4 },
    { value: "commission_hero", label: "Commission Hero", imageCount: 1 },
    { value: "commission_info", label: "Commission Info", imageCount: 0 },
    { value: "contact_info", label: "Contact Info", imageCount: 0 },
    { value: "about_section", label: "About Section", imageCount: 1 },
  ]

  const contentStatuses = [
    { value: "draft", label: "Draft", color: "gray" },
    { value: "active", label: "Active", color: "green" },
    { value: "inactive", label: "Inactive", color: "red" },
  ]

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

  const fetchContentById = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await content_api.$_get_content_by_id(id)
      currentContent.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to fetch content"
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const fetchContentByType = async (type: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await content_api.$_get_content_by_type(type)
      currentContent.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to fetch content"
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const createContent = async (data: any) => {
    loading.value = true
    error.value = null

    try {
      const response = await content_api.$_create_content(data)
      await fetchContents() // Refresh the list
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to create content"
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const updateContent = async (id: string, data: any) => {
    loading.value = true
    error.value = null

    try {
      const response = await content_api.$_update_content(id, data)
      await fetchContents() // Refresh the list
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to update content"
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const updateContentStatus = async (id: string, status: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await content_api.$_update_content_status(id, status)
      await fetchContents() // Refresh the list
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to update content status"
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const deleteContent = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await content_api.$_delete_content(id)
      await fetchContents() // Refresh the list
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to delete content"
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const seedDefaultContent = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await content_api.$_seed_default_content()
      await fetchContents() // Refresh the list
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to seed default content"
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const getContentTypeInfo = (type: string) => {
    return contentTypes.find((ct) => ct.value === type)
  }

  const getStatusInfo = (status: string) => {
    return contentStatuses.find((cs) => cs.value === status)
  }

  const filteredContents = computed(() => {
    return contents.value || []
  })

  return {
    contents: filteredContents,
    currentContent,
    loading,
    error,
    totalPages,
    currentPage,
    total,
    contentTypes,
    contentStatuses,
    fetchContents,
    fetchContentById,
    fetchContentByType,
    createContent,
    updateContent,
    updateContentStatus,
    deleteContent,
    seedDefaultContent,
    getContentTypeInfo,
    getStatusInfo,
  }
}
