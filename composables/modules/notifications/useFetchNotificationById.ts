import { notifications_api } from '@/apiFactory/modules/notfications'
import { ref } from 'vue'

export const useFetchNotificationById = (id: string) => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const notification = ref<any>(null)

  const fetchNotificationById = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await notifications_api.$_fetch_notification_by_id(id)
      notification.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch notification by ID'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    notification,
    fetchNotificationById,
  }
}
