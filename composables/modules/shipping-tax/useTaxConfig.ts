import { ref } from 'vue'
import { shipping_tax_api } from "@/apiFactory/modules/shipping-tax"

export interface TaxConfig {
  id: string
  countryCode: string
  countryName: string
  vatRate: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateTaxConfigDto {
  countryCode: string
  countryName: string
  vatRate: number
  isActive?: boolean
}

export const useTaxConfig = () => {
  const error = ref<string | null>(null)

  // Fetch all tax configs
  const fetchTaxConfigs = async (): Promise<TaxConfig[]> => {
    try {
      // In a real app, this would be an API call
      // const response = await $fetch('/api/tax-configs')
      
      // For demo purposes, return mock data
      const res = await shipping_tax_api.$_get_all_tax_configs()
      return res.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch tax configs'
      throw error.value
    }
  }

  // Create a new tax config
  const createTaxConfig = async (data: CreateTaxConfigDto): Promise<TaxConfig> => {
    try {
      // In a real app, this would be an API call
      // const response = await $fetch('/api/tax-configs', {
      //   method: 'POST',
      //   body: data
      // })
      
      // For demo purposes, return mock data
      const res = await shipping_tax_api.$_create_tax_config({...data})
      return res.data
    //   return {
    //     id: Date.now().toString(),
    //     ...data,
    //     createdAt: new Date().toISOString(),
    //     updatedAt: new Date().toISOString()
    //   }
    } catch (err: any) {
      error.value = err.message || 'Failed to create tax config'
      throw error.value
    }
  }

  // Update an existing tax config
  const updateTaxConfig = async (id: string, data: Partial<CreateTaxConfigDto>): Promise<TaxConfig> => {
    try {
      // In a real app, this would be an API call
      // const response = await $fetch(`/api/tax-configs/${id}`, {
      //   method: 'PATCH',
      //   body: data
      // })
      const res = await shipping_tax_api.$_update_tax_config(id, {
        countryCode: data.countryCode || '',
        countryName: data.countryName || '',
        vatRate: data.vatRate || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      })
      return res.data
      
      // For demo purposes, return mock data
    //   return {
    //     id,
    //     countryCode: data.countryCode || '',
    //     countryName: data.countryName || '',
    //     vatRate: data.vatRate || 0,
    //     isActive: data.isActive !== undefined ? data.isActive : true,
    //     updatedAt: new Date().toISOString()
    //   }
    } catch (err: any) {
      error.value = err.message || 'Failed to update tax config'
      throw error.value
    }
  }

  // Delete a tax config
  const deleteTaxConfig = async (id: string): Promise<void> => {
    try {
      // In a real app, this would be an API call
      // await $fetch(`/api/tax-configs/${id}`, {
      //   method: 'DELETE'
      // })
      const res = await shipping_tax_api.$_delete_tax_config(id)
      
      // For demo purposes, just return
      return res.data
    } catch (err: any) {
      error.value = err.message || 'Failed to delete tax config'
      throw error.value
    }
  }

  onMounted(() => {
    fetchTaxConfigs()
  })

  return {
    error,
    fetchTaxConfigs,
    createTaxConfig,
    updateTaxConfig,
    deleteTaxConfig
  }
}