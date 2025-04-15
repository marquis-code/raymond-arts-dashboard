import { product_api } from '@/apiFactory/modules/products'
import { ref } from 'vue'

export const useFetchCategory = () => {
  const category = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch a single category by ID
  const fetchCategoryById = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await product_api.$_get_category_by_id(id)
      category.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch category'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  

  return {
    category,
    loading,
    error,
    fetchCategoryById,
  }
}