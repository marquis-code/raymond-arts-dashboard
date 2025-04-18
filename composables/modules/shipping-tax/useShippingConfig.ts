import { ref } from 'vue'
import { shipping_tax_api } from "@/apiFactory/modules/shipping-tax"

export interface ShippingConfig {
  id: string
  countryCode: string
  countryName: string
  shippingRate: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateShippingConfigDto {
  countryCode: string
  countryName: string
  shippingRate: number
  isActive?: boolean
}

export const useShippingConfig = () => {
  const error = ref<string | null>(null)

  // Fetch all shipping configs
  const fetchShippingConfigs = async (): Promise<ShippingConfig[]> => {
    try {
      // In a real app, this would be an API call
      // const response = await $fetch('/api/shipping-configs')
     const res = await shipping_tax_api.$_get_all_shipping_configs()
      // For demo purposes, return mock data
      return res.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch shipping configs'
      throw error.value
    }
  }

  // Create a new shipping config
  const createShippingConfig = async (data: CreateShippingConfigDto): Promise<ShippingConfig> => {
    try {
      // In a real app, this would be an API call
      // const response = await $fetch('/api/shipping-configs', {
      //   method: 'POST',
      //   body: data
      // })
      const res = await shipping_tax_api.$_create_shipping_config({...data})
      // For demo purposes, return mock data
    //   return {
    //     id: Date.now().toString(),
    //     ...data,
    //     createdAt: new Date().toISOString(),
    //     updatedAt: new Date().toISOString()
    //   }
    return res.data
    } catch (err: any) {
      error.value = err.message || 'Failed to create shipping config'
      throw error.value
    }
  }

  // Update an existing shipping config
  const updateShippingConfig = async (id: string, data: Partial<CreateShippingConfigDto>): Promise<ShippingConfig> => {
    try {
      // In a real app, this would be an API call
      // const response = await $fetch(`/api/shipping-configs/${id}`, {
      //   method: 'PATCH',
      //   body: data
      // })
      const res = await shipping_tax_api.$_update_shipping_config(id, {
        countryCode: data.countryCode || '',
        countryName: data.countryName || '',
        shippingRate: data.shippingRate || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      })
      return res.data
      // For demo purposes, return mock data
    //   return {
    //     id,
    //     countryCode: data.countryCode || '',
    //     countryName: data.countryName || '',
    //     shippingRate: data.shippingRate || 0,
    //     isActive: data.isActive !== undefined ? data.isActive : true,
    //     updatedAt: new Date().toISOString()
    //   }
    } catch (err: any) {
      error.value = err.message || 'Failed to update shipping config'
      throw error.value
    }
  }

  // Delete a shipping config
  const deleteShippingConfig = async (id: string): Promise<void> => {
    try {
      // In a real app, this would be an API call
      // await $fetch(`/api/shipping-configs/${id}`, {
      //   method: 'DELETE'
      // })
      const res = await shipping_tax_api.$_delete_shipping_config(id)
      
      // For demo purposes, just return
      return res.data
    } catch (err: any) {
      error.value = err.message || 'Failed to delete shipping config'
      throw error.value
    }
  }

  onMounted(() => {
    fetchShippingConfigs()
  })

  return {
    error,
    fetchShippingConfigs,
    createShippingConfig,
    updateShippingConfig,
    deleteShippingConfig
  }
}