// import { ref } from "vue"
// import { product_api } from "@/apiFactory/modules/products"

// // Define the reorder payload type to match the backend DTO
// export interface ProductPositionData {
//   id: string
//   position: number
// }

// export interface ReorderProductsPayload {
//   orderedProducts: ProductPositionData[]
// }

// export const useReorderProducts = () => {
//   const loading = ref(false)
//   const error = ref<string | null>(null)
//   const success = ref(false)
//   const reorderedProducts = ref<any[]>([])

//   const reorderProducts = async (productsReorderPayload: ReorderProductsPayload | Record<string, any>) => {
//     loading.value = true
//     error.value = null
//     success.value = false

//     try {
//       const response = await product_api.$_reorder_products(productsReorderPayload)
//       success.value = true
//       reorderedProducts.value = response.data
//       return response.data
//     } catch (err: any) {
//       error.value = err.response?.data?.message || "Failed to reorder products"
//       throw err
//     } finally {
//       loading.value = false
//     }
//   }

//   // Helper function to create reorder payload from a sorted array of originals
//   const createReorderPayload = (sortedProducts: any[]): ReorderProductsPayload => {
//     return {
//       orderedProducts: sortedProducts.map((original, index) => ({
//         id: original._id || original.id, // Handle both _id and id cases
//         position: index + 1, // Start positions from 1
//       })),
//     }
//   }

//   // Convenience method to reorder from a drag-and-drop sorted array
//   const reorderFromSortedArray = async (sortedProducts: any[]) => {
//     const payload = createReorderPayload(sortedProducts)
//     return await reorderProducts(payload)
//   }

//   const resetState = () => {
//     loading.value = false
//     error.value = null
//     success.value = false
//     reorderedProducts.value = []
//   }

//   return {
//     loading,
//     error,
//     success,
//     reorderedProducts,
//     reorderProducts,
//     createReorderPayload,
//     reorderFromSortedArray,
//     resetState,
//   }
// }


import { ref } from "vue"
import { product_api } from "@/apiFactory/modules/products"

// Define the reorder payload type to match the backend DTO
export interface ProductPositionData {
  id: string
  position: number
}

export interface ReorderProductsPayload {
  orderedProducts: ProductPositionData[]
}

export const useReorderProducts = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const reorderedProducts = ref<any[]>([])

  const reorderProducts = async (productsReorderPayload: any) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await product_api.$_reorder_products(productsReorderPayload)
      success.value = true
      reorderedProducts.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to reorder products"
      throw err
    } finally {
      loading.value = false
    }
  }

  // Helper function to create reorder payload from a sorted array of products
  const createReorderPayload = (sortedProducts: any[]): ReorderProductsPayload => {
    return {
      orderedProducts: sortedProducts.map((product, index) => ({
        id: product._id || product.id, // Handle both _id and id cases
        position: index + 1, // Start positions from 1
      })),
    }
  }

  // Convenience method to reorder from a drag-and-drop sorted array
  const reorderFromSortedArray = async (sortedProducts: any[]) => {
    const payload = createReorderPayload(sortedProducts)
    return await reorderProducts(payload)
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    success.value = false
    reorderedProducts.value = []
  }

  return {
    loading,
    error,
    success,
    reorderedProducts,
    reorderProducts,
    createReorderPayload,
    reorderFromSortedArray,
    resetState,
  }
}
