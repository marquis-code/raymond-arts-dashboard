// import { ref } from 'vue'
// import { originals_api } from '@/apiFactory/modules/originals'

// export const useReorderOriginals = () => {
//   const loading = ref(false)
//   const error = ref<string | null>(null)

//   const reorderOriginals = async (orderedOriginals: string[]) => {
//     loading.value = true
//     error.value = null
//     try {
//       await originals_api.$_reorder_originals({ orderedOriginals })
//     } catch (e: any) {
//       error.value = e.response?.data?.message || 'Failed to reorder originals'
//       throw error.value
//     } finally {
//       loading.value = false
//     }
//   }

//   return { loading, error, reorderOriginals }
// }


import { ref } from "vue"
import { originals_api } from "@/apiFactory/modules/originals"

// Define the reorder payload type to match the backend DTO
export interface OriginalPositionData {
  id: string
  position: number
}

export interface ReorderOriginalsPayload {
  orderedOriginals: OriginalPositionData[]
}

export const useReorderOriginals = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const reorderedOriginals = ref<any[]>([])

  const reorderOriginals = async (originalsReorderPayload: ReorderOriginalsPayload) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await originals_api.$_reorder_originals(originalsReorderPayload)
      success.value = true
      reorderedOriginals.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to reorder originals"
      throw err
    } finally {
      loading.value = false
    }
  }

  // Helper function to create reorder payload from a sorted array of originals
  const createReorderPayload = (sortedOriginals: any[]): ReorderOriginalsPayload => {
    return {
      orderedOriginals: sortedOriginals.map((original, index) => ({
        id: original._id || original.id, // Handle both _id and id cases
        position: index + 1, // Start positions from 1
      })),
    }
  }

  // Convenience method to reorder from a drag-and-drop sorted array
  const reorderFromSortedArray = async (sortedOriginals: any[]) => {
    const payload = createReorderPayload(sortedOriginals)
    return await reorderOriginals(payload)
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    success.value = false
    reorderedOriginals.value = []
  }

  return {
    loading,
    error,
    success,
    reorderedOriginals,
    reorderOriginals,
    createReorderPayload,
    reorderFromSortedArray,
    resetState,
  }
}
