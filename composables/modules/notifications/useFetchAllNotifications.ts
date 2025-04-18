import { notifications_api } from '@/apiFactory/modules/notfications'
import { ref } from 'vue'

export const useFetchAllNotifications = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const notifications = ref<any[]>([])

  const fetchAllNotifications = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await notifications_api.$_fetch_all_notifications()
      notifications.value = response.data.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch all notifications'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchAllNotifications()
  })

  return {
    loading,
    error,
    notifications,
    fetchAllNotifications,
  }
}
