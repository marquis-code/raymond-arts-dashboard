import { ref, computed } from "vue"

export const useContentTypes = () => {
  const contentTypes = ref([
    { value: "home_hero", label: "Home Hero", imageCount: 1 },
    { value: "portrait_hero", label: "Portrait Hero", imageCount: 1 },
    { value: "gallery_hero", label: "Gallery Hero", imageCount: 1 },
    { value: "shop_prints_hero", label: "Shop Prints Hero", imageCount: 4 },
    { value: "commission_hero", label: "Commission Hero", imageCount: 1 },
    { value: "commission_info", label: "Commission Info", imageCount: 0 },
    { value: "contact_info", label: "Contact Info", imageCount: 0 },
    { value: "about_section", label: "About Section", imageCount: 1 },
  ])

  const contentStatuses = ref([
    { value: "draft", label: "Draft", color: "gray" },
    { value: "active", label: "Active", color: "green" },
    { value: "inactive", label: "Inactive", color: "red" },
  ])

  const getContentTypeInfo = (type: string) => {
    return contentTypes.value.find((ct) => ct.value === type)
  }

  const getStatusInfo = (status: string) => {
    return contentStatuses.value.find((cs) => cs.value === status)
  }

  const getTypeLabel = (type: string) => {
    return getContentTypeInfo(type)?.label || type
  }

  const getStatusLabel = (status: string) => {
    return getStatusInfo(status)?.label || status
  }

  const getStatusColor = (status: string) => {
    return getStatusInfo(status)?.color || "gray"
  }

  const getImageRequirement = (type: string) => {
    return getContentTypeInfo(type)?.imageCount || 0
  }

  const typeOptions = computed(() => {
    return contentTypes.value.map((type) => ({
      label: type.label,
      value: type.value,
    }))
  })

  const statusOptions = computed(() => {
    return contentStatuses.value.map((status) => ({
      label: status.label,
      value: status.value,
    }))
  })

  return {
    contentTypes,
    contentStatuses,
    typeOptions,
    statusOptions,
    getContentTypeInfo,
    getStatusInfo,
    getTypeLabel,
    getStatusLabel,
    getStatusColor,
    getImageRequirement,
  }
}
