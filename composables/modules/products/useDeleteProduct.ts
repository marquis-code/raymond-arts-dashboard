import { product_api } from '@/apiFactory/modules/products'
import { ref } from 'vue'

export const useDeleteProduct = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Delete product
  const deleteProduct = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await product_api.$_delete_product(id)
      
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete product'
      throw error.value
    } finally {
      loading.value = false
    }
  }


  return {
    loading,
    error,
    deleteProduct,
  }
}