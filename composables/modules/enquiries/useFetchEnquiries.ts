import { enquiry_api } from '@/apiFactory/modules/enquiries'
import { ref } from 'vue'

export const useFetchEnquiries = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const enquiries = ref([])
  const pagination = ref(null)

  const fetchEnquiries = async (params: any = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await enquiry_api.$_fetch_enquiries(params)
      enquiries.value = response.data.data
      pagination.value = response.data.pagination
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch enquiries'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchEnquiries()

  })

  return {
    loading,
    error,
    enquiries,
    pagination,
    fetchEnquiries,
  }
}
