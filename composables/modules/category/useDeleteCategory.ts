import { product_api } from '@/apiFactory/modules/products'
import { ref } from 'vue'

export const useDeleteCategory = () => {
  const category = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Delete category
  const deleteCategory = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await product_api.$_delete_category(id)
      
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete category'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    category,
    loading,
    error,
    deleteCategory,
  }
}