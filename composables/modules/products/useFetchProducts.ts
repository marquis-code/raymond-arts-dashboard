import { product_api } from '@/apiFactory/modules/products'
import { ref } from 'vue'

interface PaginationDTO {
  page: number
  limit: number
  sort: string
  order: string
  search: string
}

const metadata = ref({
    page: 1,
    limit: 100,
    sort: "",
    order: "",
    search: ""
})

export const useFetchProducts = () => {
  const products = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalProducts = ref(0)
  const totalPages = ref(0)

  // Fetch products with pagination
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await product_api.$_fetch_products()
      console.log(response, 'res hee')
      products.value = response?.data?.data
      
      // Handle pagination metadata if available
      if (response.data.meta) {
        totalProducts.value = response.data.meta.total || 0
        totalPages.value = response.data.meta.totalPages || 0
      }
      
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch products'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchProducts()
  })

  return {
    products,
    loading,
    error,
    totalProducts,
    totalPages,
    fetchProducts,
  }
}