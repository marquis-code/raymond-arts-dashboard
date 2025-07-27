import { ref } from "vue"
import { useContentTypes } from "./useContentTypes"

export const useContentValidation = () => {
  const { getImageRequirement } = useContentTypes()
  const validationErrors = ref<string[]>([])

  const validateContentData = (data: any) => {
    validationErrors.value = []

    // Required field validations
    if (!data.type) {
      validationErrors.value.push("Content type is required")
    }

    if (!data.title || data.title.trim() === "") {
      validationErrors.value.push("Title is required")
    }

    if (data.title && data.title.length > 200) {
      validationErrors.value.push("Title must be 200 characters or less")
    }

    if (data.description && data.description.length > 1000) {
      validationErrors.value.push("Description must be 1000 characters or less")
    }

    // Image validation based on content type
    if (data.type) {
      const requiredImages = getImageRequirement(data.type)
      const providedImages = data.images?.filter((img: string) => img.trim() !== "").length || 0

      if (requiredImages > 0 && providedImages !== requiredImages) {
        validationErrors.value.push(
          `${data.type} requires exactly ${requiredImages} image${requiredImages > 1 ? "s" : ""}, but ${providedImages} provided`,
        )
      }

      if (data.images && data.images.length > 10) {
        validationErrors.value.push("Maximum 10 images allowed")
      }
    }

    // URL validation for images
    if (data.images) {
      data.images.forEach((url: string, index: number) => {
        if (url && !isValidUrl(url)) {
          validationErrors.value.push(`Image ${index + 1} must be a valid URL`)
        }
      })
    }

    // Metadata validation
    if (data.type === "contact_info" && data.metadata?.contactInfo?.email?.address) {
      if (!isValidEmail(data.metadata.contactInfo.email.address)) {
        validationErrors.value.push("Contact email must be a valid email address")
      }
    }

    return validationErrors.value.length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const clearValidationErrors = () => {
    validationErrors.value = []
  }

  return {
    validationErrors,
    validateContentData,
    clearValidationErrors,
    isValidUrl,
    isValidEmail,
  }
}
