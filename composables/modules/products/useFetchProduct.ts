import { product_api } from '@/apiFactory/modules/products'
import { ref } from 'vue'

export const useFetchProduct = () => {
  const product = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch products with pagination
  const fetchProduct = async (productId: string | any) => {
    loading.value = true
    error.value = null
    try {
      const response = await product_api.$_fetch_products(productId)
      product.value = response.data.product || response.data
      
      
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch products'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    fetchProduct,
    product,
    loading,
    error
  }
}