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

export const useCreateCategory = () => {
  const categories = ref<any[]>([])
  const category = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Create category
  const createCategory = async (categoryData: CategoryDTO) => {
    loading.value = true
    error.value = null
    try {

      const response = await product_api.$_create_product_category(categoryData)
      
      // Add the new category to the local state
      if (response.data) {
         return response.data
      }
      
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create category'
      throw error.value
    } finally {
      loading.value = false
    }
  }

 
  return {
    category,
    loading,
    error,
    createCategory
  }
}