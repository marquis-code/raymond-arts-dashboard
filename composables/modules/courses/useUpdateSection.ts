import { courses_api } from '@/apiFactory/modules/courses'
import { ref } from 'vue'

export const useUpdateSection = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const section = ref<any>(null)

  const updateSection = async (id: string, sectionData: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await courses_api.$_update_section(id, sectionData)
      section.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update section'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    section,
    updateSection,
  }
}