import { notifications_api } from '@/apiFactory/modules/notfications'
import { ref } from 'vue'

export const useMarkAsRead = (id: string) => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const markAsRead = async () => {
    loading.value = true
    error.value = null
    try {
      await notifications_api.$_mark_as_read(id)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to mark notification as read'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    markAsRead,
  }
}
