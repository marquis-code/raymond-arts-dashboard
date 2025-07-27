import { ref, computed } from "vue"

export const useContentFilters = () => {
  const filters = ref({
    type: "",
    status: "",
    search: "",
    page: 1,
    limit: 10,
  })

  const activeFilters = computed(() => {
    const active: any = {}

    if (filters.value.type) active.type = filters.value.type
    if (filters.value.status) active.status = filters.value.status
    if (filters.value.search) active.search = filters.value.search
    if (filters.value.page > 1) active.page = filters.value.page
    if (filters.value.limit !== 10) active.limit = filters.value.limit

    return active
  })

  const hasActiveFilters = computed(() => {
    return Object.keys(activeFilters.value).length > 0
  })

  const setFilter = (key: string, value: any) => {
    filters.value[key as keyof typeof filters.value] = value
    // Reset page when changing filters (except page itself)
    if (key !== "page") {
      filters.value.page = 1
    }
  }

  const clearFilters = () => {
    filters.value = {
      type: "",
      status: "",
      search: "",
      page: 1,
      limit: 10,
    }
  }

  const clearFilter = (key: string) => {
    filters.value[key as keyof typeof filters.value] = key === "page" ? 1 : key === "limit" ? 10 : ""
  }

  const setPage = (page: number) => {
    filters.value.page = page
  }

  const setLimit = (limit: number) => {
    filters.value.limit = limit
    filters.value.page = 1 // Reset to first page when changing limit
  }

  return {
    filters,
    activeFilters,
    hasActiveFilters,
    setFilter,
    clearFilters,
    clearFilter,
    setPage,
    setLimit,
  }
}
