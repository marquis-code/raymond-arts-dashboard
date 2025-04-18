import { notifications_api } from  '@/apiFactory/modules/notfications'
import { ref } from 'vue'

export const useMarkAllAsRead = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const markAllAsRead = async () => {
    loading.value = true
    error.value = null
    try {
      await notifications_api.$_mark_all_as_read()
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to mark all notifications as read'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    markAllAsRead,
  }
}
