import { users_api } from '@/apiFactory/modules/users'
import { ref } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useDeactivateUser = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { showToast } = useCustomToast()

  const deactivateUser = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await users_api.$_deactivate_user(id)
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to deactivate user'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    deactivateUser,
  }
}
