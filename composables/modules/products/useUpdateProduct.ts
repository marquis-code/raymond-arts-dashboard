import { product_api } from '@/apiFactory/modules/products'
import { ref } from 'vue'

interface PaginationDTO {
  page: number
  limit: number
  sort: string
  order: string
  search: string
}

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

export const useUpdateProduct = () => {
  const products = ref<any[]>([])
  const product = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  // Update product
  const updateProduct = async (id: string, productData: Partial<CreateProductDto>) => {
    loading.value = true
    error.value = null
    try {
      const updatePayload = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        discountPrice: productData.discountPrice,
        images: productData.images,
        isAvailable: productData.isAvailable,
        width: productData.weight,
        height: productData.height,
        length: productData.length,
        tags: productData.tags,
        isFeatured: productData.isFeatured,
        isNew: productData.isNew,
        isBestseller: productData.isBestseller,
        category: productData.category.id
      }
      const response = await product_api.$_update_product(id, updatePayload as CreateProductDto | any)
      
      // Update the product in the local state if it exists
      const index = products.value.findIndex(p => p.id === id || p._id === id)
      if (index !== -1) {
        products.value[index] = { ...products.value[index], ...response.data }
      }
      
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update product'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  // isDeleteModalOpen

  
  return {
    product,
    loading,
    error,
    updateProduct,
  }
}