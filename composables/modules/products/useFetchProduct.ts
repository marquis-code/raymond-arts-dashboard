import { product_api } from '@/apiFactory/modules/products'
import { ref } from 'vue'

export const useFetchProduct = () => {
  const product = ref<any>(null)
  const loading = ref(false)
  const route = useRoute()
  const error = ref<string | null>(null)

  // Fetch products with pagination
  const fetchProduct = async (productId: string | any) => {
    loading.value = true
    error.value = null
    try {
      const response = await product_api.$_get_product_by_id(productId)
      console.log(response,'res here')
      product.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch products'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  onMounted(()=> {
    if(route?.query?.id){
      fetchProduct(route?.query?.id)
    }
  })

  return {
    fetchProduct,
    product,
    loading,
    error
  }
}