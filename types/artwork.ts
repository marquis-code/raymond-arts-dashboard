export enum ProductSize {
    SMALL = "small",
    BASIC = "basic",
    MEDIUM = "medium",
    LARGE = "large",
  }
  
  export enum ProductColor {
    BLACK = "black",
    WHITE = "white",
  }
  
  export interface SizeInstallmentConfig {
    enabled: boolean
    maxInstallments: number
    interestRate: number
    minimumAmount: number
    availableTerms: number[]
    minimumDownPaymentPercentage: number
    maximumDownPaymentPercentage: number
  }
  
  export interface SizePrice {
    size: ProductSize
    price: number
    color: ProductColor
    installmentConfig: SizeInstallmentConfig
  }
  
  export interface InstallmentConfig {
    enabled: boolean
    maxInstallments: number
    interestRate: number
    minimumAmount: number
    availableTerms: number[]
    minimumDownPaymentPercentage: number
    maximumDownPaymentPercentage: number
  }
  
  export interface ArtworkFormData {
    name: string
    description: string
    price: number
    discountPrice: number
    category: string
    tags: string[]
    images: string[]
    weight: number
    width: number
    height: number
    length: number
    isAvailable: boolean
    isFeatured: boolean
    isNew: boolean
    isBestseller: boolean
    attributes: Record<string, any>
    productInfo: string
    returnPolicy: string
    shippingInfo: string
    sizes: SizePrice[]
    promotionText: string
    installmentConfig: InstallmentConfig
  }
  
  export interface FormStep {
    id: number
    title: string
    icon: string
    component: string
  }
  