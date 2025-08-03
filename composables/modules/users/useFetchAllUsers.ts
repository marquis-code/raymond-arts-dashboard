import { users_api } from '@/apiFactory/modules/users'
import { ref } from 'vue'

export const useFetchAllUsers = () => {
  const users = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAllUsers = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await users_api.$_fetch_all_users()
      users.value = response.data || []
      return users.value
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch users'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchAllUsers()
  })

  return {
    users,
    loading,
    error,
    fetchAllUsers,
  }
}
