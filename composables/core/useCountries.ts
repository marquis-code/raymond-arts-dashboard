import { ref } from 'vue'

interface Country {
  code: string
  name: string
}

export const useCountries = () => {
  const error = ref<string | null>(null)

  // Fetch all countries
  const fetchCountries = async (): Promise<Country[]> => {
    try {
      // In a real app, this would be an API call to get countries
      // const response = await $fetch('https://restcountries.com/v3.1/all')
      
      // For demo purposes, return a subset of countries
      return [
        { code: 'US', name: 'United States' },
        { code: 'CA', name: 'Canada' },
        { code: 'GB', name: 'United Kingdom' },
        { code: 'DE', name: 'Germany' },
        { code: 'FR', name: 'France' },
        { code: 'IT', name: 'Italy' },
        { code: 'ES', name: 'Spain' },
        { code: 'JP', name: 'Japan' },
        { code: 'CN', name: 'China' },
        { code: 'IN', name: 'India' },
        { code: 'AU', name: 'Australia' },
        { code: 'BR', name: 'Brazil' },
        { code: 'RU', name: 'Russia' },
        { code: 'ZA', name: 'South Africa' },
        { code: 'MX', name: 'Mexico' },
        { code: 'AR', name: 'Argentina' },
        { code: 'NL', name: 'Netherlands' },
        { code: 'SE', name: 'Sweden' },
        { code: 'NO', name: 'Norway' },
        { code: 'DK', name: 'Denmark' },
        { code: 'FI', name: 'Finland' },
        { code: 'CH', name: 'Switzerland' },
        { code: 'AT', name: 'Austria' },
        { code: 'BE', name: 'Belgium' },
        { code: 'PT', name: 'Portugal' },
        { code: 'GR', name: 'Greece' },
        { code: 'IE', name: 'Ireland' },
        { code: 'NZ', name: 'New Zealand' },
        { code: 'SG', name: 'Singapore' },
        { code: 'MY', name: 'Malaysia' },
        { code: 'TH', name: 'Thailand' },
        { code: 'PH', name: 'Philippines' },
        { code: 'ID', name: 'Indonesia' },
        { code: 'VN', name: 'Vietnam' },
        { code: 'TR', name: 'Turkey' },
        { code: 'EG', name: 'Egypt' },
        { code: 'NG', name: 'Nigeria' },
        { code: 'KE', name: 'Kenya' },
        { code: 'ZW', name: 'Zimbabwe' },
        { code: 'AE', name: 'United Arab Emirates' }
      ]
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch countries'
      throw error.value
    }
  }

  return {
    error,
    fetchCountries
  }
}