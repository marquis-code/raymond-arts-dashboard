import { product_api } from '@/apiFactory/modules/products'
import { ref } from 'vue'

interface CreateProductDto {
  name: string
  description: string
  price: number
  discountPrice?: number
  images?: string[]
  category?: string
  isAvailable?: boolean
  weight?: number
  width?: number
  height?: number
  length?: number
  tags?: string[]
  attributes?: Record<string, any>
  relatedProducts?: string[]
  isFeatured?: boolean
  isNew?: boolean
  isBestseller?: boolean
}

export const useCreateProduct = () => {
  const product = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const router = useRouter()

  const createProduct = async (productData: CreateProductDto) => {
    loading.value = true
    error.value = null
    try {
      const response = await product_api.$_create_product(productData) 
      router.push('/dashboard/products')
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create product'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    product,
    loading,
    error,
    createProduct,
  }
}