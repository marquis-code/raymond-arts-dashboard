import type { ArtworkFormData, SizePrice, InstallmentConfig, SizeInstallmentConfig } from "~/types/artwork"
import { useCreateProduct } from "@/composables/modules/products/useCreateProduct"
import { ProductSize, ProductColor } from "~/types/artwork"
import { ref, reactive } from "vue"

const { createProduct, loading } = useCreateProduct()

const DEFAULT_INSTALLMENT_CONFIG: SizeInstallmentConfig = {
  enabled: false,
  maxInstallments: 12,
  interestRate: 0,
  minimumAmount: 100,
  availableTerms: [3, 6, 12],
  minimumDownPaymentPercentage: 20,
  maximumDownPaymentPercentage: 50,
}

export const useArtworkForm = () => {
  // Use reactive instead of ref for better reactivity with nested objects
  const formData = reactive<ArtworkFormData>({
    name: "",
    description: "",
    price: 0,
    discountPrice: 0,
    category: "",
    tags: [],
    images: [],
    weight: 0,
    width: 0,
    height: 0,
    length: 0,
    isAvailable: true,
    isFeatured: false,
    isNew: true,
    isBestseller: false,
    attributes: {},
    productInfo: "",
    returnPolicy: "",
    shippingInfo: "",
    sizes: [],
    promotionText: "",
    installmentConfig: { ...DEFAULT_INSTALLMENT_CONFIG },
  })

  const currentStep = ref(1)
  const totalSteps = 6

  const updateFormData = (updates: Partial<ArtworkFormData>) => {
    Object.assign(formData, updates)
  }

  const addSizeVariant = () => {
    console.log("Adding size variant, current sizes:", formData.sizes.length)
    const newSize: SizePrice = {
      size: ProductSize.SMALL,
      price: 0,
      color: ProductColor.BLACK,
      installmentConfig: { ...DEFAULT_INSTALLMENT_CONFIG },
    }
    formData.sizes.push(newSize)
    console.log("After adding, sizes count:", formData.sizes.length)
  }

  const updateSizeVariant = (index: number, updates: Partial<SizePrice>) => {
    console.log("Updating size variant at index:", index, "with:", updates)
    if (formData.sizes[index]) {
      Object.assign(formData.sizes[index], updates)
    }
  }

  const removeSizeVariant = (index: number) => {
    console.log("Removing size variant at index:", index)
    formData.sizes.splice(index, 1)
  }

  const updateGlobalInstallment = (updates: Partial<InstallmentConfig>) => {
    Object.assign(formData.installmentConfig, updates)
  }

  const updateSizeInstallment = (sizeIndex: number, updates: Partial<SizeInstallmentConfig>) => {
    if (formData.sizes[sizeIndex]) {
      Object.assign(formData.sizes[sizeIndex].installmentConfig, updates)
    }
  }

  const nextStep = () => {
    if (currentStep.value < totalSteps) {
      currentStep.value++
    }
  }

  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      currentStep.value = step
    }
  }

  const resetForm = () => {
    Object.assign(formData, {
      name: "",
      description: "",
      price: 0,
      discountPrice: 0,
      category: "",
      tags: [],
      images: [],
      weight: 0,
      width: 0,
      height: 0,
      length: 0,
      isAvailable: true,
      isFeatured: false,
      isNew: true,
      isBestseller: false,
      attributes: {},
      productInfo: "",
      returnPolicy: "",
      shippingInfo: "",
      sizes: [],
      promotionText: "",
      installmentConfig: { ...DEFAULT_INSTALLMENT_CONFIG },
    })
    currentStep.value = 1
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.description && formData.category)
      case 2:
        return formData.sizes.length > 0
      case 5:
        return formData.images.length > 0
      default:
        return true
    }
  }

  const submitForm = async () => {
    try {
      console.log("Submitting artwork:", formData)
      // Handle API submission here
      await createProduct(formData).then(() => {
        return { success: true }
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      return { success: false, error }
    }
  }

  return {
    formData, // Return reactive object directly, not readonly
    currentStep,
    totalSteps,
    updateFormData,
    addSizeVariant,
    updateSizeVariant,
    removeSizeVariant,
    updateGlobalInstallment,
    updateSizeInstallment,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    validateStep,
    submitForm,
  }
}
