import {audit_api } from '@/apiFactory/modules/audit'
import { ref } from 'vue'

export const useFetchAllAudits = () => {
  const auditsList = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all categories
  const fetchAllAudits = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await audit_api.$_fetch_all_audits_logs()
      console.log(response,'audits hee')
      auditsList.value = response.data.data
      return response.data.data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch audits'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchAllAudits()
  })

  return {
    auditsList,
    loading,
    error,
    fetchAllAudits,
  }
}