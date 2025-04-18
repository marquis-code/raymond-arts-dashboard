import { notifications_api } from '@/apiFactory/modules/notfications'
import { ref } from 'vue'

export const useUpdateNotification = (id: string, data: any) => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const updateNotification = async () => {
    loading.value = true
    error.value = null
    try {
      await notifications_api.$_update_notification(id, data)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update notification'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    updateNotification,
  }
}
