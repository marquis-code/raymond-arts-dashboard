import { notifications_api } from '@/apiFactory/modules/notfications'
import { ref } from 'vue'

export const useFetchAdminNotifications = (pagination: any) => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const adminNotifications = ref<any[]>([])

  const fetchAdminNotifications = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await notifications_api.$_fetch_admin_notifications(pagination)
      adminNotifications.value = response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch admin notifications'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    adminNotifications,
    fetchAdminNotifications,
  }
}
