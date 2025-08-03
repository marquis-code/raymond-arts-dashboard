import { users_api } from '@/apiFactory/modules/users'
import { ref } from 'vue'

export const useFetchUserById = () => {
  const user = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const findUserById = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await users_api.$_find_user_by_id(id)
      user.value = response.data || null
      return user.value
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to find user'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    findUserById,
  }
}
