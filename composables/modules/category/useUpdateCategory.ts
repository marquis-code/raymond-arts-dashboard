import { product_api } from '@/apiFactory/modules/products'
import { ref } from 'vue'

interface CategoryDTO {
  name: string
  description?: string
  image?: string
  parent?: string
  isActive?: boolean
  order?: number
}

export const useUpdateCategory = () => {
  const category = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)


  // Update category
  const updateCategory = async (id: string, categoryData: Partial<CategoryDTO>) => {
    loading.value = true
    error.value = null
    try {
      const response = await product_api.$_update_category(id, categoryData as CategoryDTO)      
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update category'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    category,
    loading,
    error,
    updateCategory
  }
}