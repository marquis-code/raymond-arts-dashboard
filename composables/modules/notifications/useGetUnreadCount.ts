import { notifications_api } from '@/apiFactory/modules/notfications'
import { ref } from 'vue'

export const useGetUnreadCount = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const unreadCount = ref<number>(0)

  const getUnreadCount = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await notifications_api.$_get_unread_count()
      unreadCount.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to get unread notifications count'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    unreadCount,
    getUnreadCount,
  }
}
