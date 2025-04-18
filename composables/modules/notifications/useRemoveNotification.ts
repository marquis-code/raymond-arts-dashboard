import { notifications_api } from '@/apiFactory/modules/notfications'
import { ref } from 'vue'

export const useRemoveNotification = (id: string) => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const removeNotification = async () => {
    loading.value = true
    error.value = null
    try {
      await notifications_api.$_remove_notification(id)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to remove notification'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    removeNotification,
  }
}
