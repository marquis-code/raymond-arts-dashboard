import { notifications_api } from '@/apiFactory/modules/notfications'
import { ref } from 'vue'

export const useCreateNotification = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createNotification = async (data: any) => {
    loading.value = true
    error.value = null
    try {
      await notifications_api.$_create_notification(data)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create notification'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    createNotification,
  }
}
