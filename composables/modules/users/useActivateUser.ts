import { users_api } from '@/apiFactory/modules/users'
import { ref } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useActivateUser = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { showToast } = useCustomToast()

  const activateUser = async (id: string, payload: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await users_api.$_activate_user(id, payload)
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to activate user'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    activateUser,
  }
}
