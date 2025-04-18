<template>
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Tax Management</h1>
          <p class="text-gray-500 mt-1">Configure shipping rates and tax settings for different countries</p>
        </div>
        <div class="flex gap-2">
          <button 
            @click="activeTab = 'shipping'" 
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            :class="activeTab === 'shipping' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            Shipping Rates
          </button>
          <button 
            @click="activeTab = 'tax'" 
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            :class="activeTab === 'tax' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            Tax Rates
          </button>
        </div>
      </div>
  
      <!-- Shipping Tax Configuration -->
      <div v-if="activeTab === 'shipping'" class="animate-fade-in">
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 class="text-lg font-semibold text-gray-900">Shipping Rates Configuration</h2>
            <button 
              @click="openShippingModal()" 
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors duration-200"
            >
              <Plus class="h-4 w-4 mr-2" />
              Add Shipping Rate
            </button>
          </div>
  
          <!-- Shipping Rates Table -->
          <div v-if="loadingShipping" class="p-8 flex justify-center items-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
          </div>
          <div v-else-if="!shippingConfigs.length" class="p-8 text-center text-gray-500">
            <Package class="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p class="text-lg font-medium">No shipping rates configured</p>
            <p class="mt-1">Add your first shipping rate to get started</p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipping Rate
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="config in shippingConfigs" 
                  :key="config.id" 
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-6 w-9 overflow-hidden rounded border border-gray-200">
                        <img 
                          :src="`https://flagcdn.com/w80/${config.countryCode.toLowerCase()}.png`" 
                          :alt="config.countryName" 
                          class="h-full w-full object-cover"
                        />
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">{{ config.countryName }}</div>
                        <div class="text-xs text-gray-500">{{ config.countryCode }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${{ config.shippingRate.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="config.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    >
                      {{ config.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                      <button 
                        @click="openShippingModal(config)" 
                        class="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit class="h-4 w-4" />
                      </button>
                      <button 
                        @click="toggleShippingStatus(config)" 
                        class="text-violet-600 hover:text-violet-900 transition-colors duration-200 p-1 rounded-full hover:bg-violet-50"
                        :title="config.isActive ? 'Deactivate' : 'Activate'"
                      >
                        <ToggleLeft v-if="!config.isActive" class="h-4 w-4" />
                        <ToggleRight v-else class="h-4 w-4" />
                      </button>
                      <button 
                        @click="confirmDeleteShipping(config)" 
                        class="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- Tax Configuration -->
      <div v-if="activeTab === 'tax'" class="animate-fade-in">
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 class="text-lg font-semibold text-gray-900">Tax Rates Configuration</h2>
            <button 
              @click="openTaxModal()" 
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors duration-200"
            >
              <Plus class="h-4 w-4 mr-2" />
              Add Tax Rate
            </button>
          </div>
  
          <!-- Tax Rates Table -->
          <div v-if="loadingTax" class="p-8 flex justify-center items-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
          </div>
          <div v-else-if="!taxConfigs.length" class="p-8 text-center text-gray-500">
            <Percent class="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p class="text-lg font-medium">No tax rates configured</p>
            <p class="mt-1">Add your first tax rate to get started</p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VAT Rate
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="config in taxConfigs" 
                  :key="config.id" 
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-6 w-9 overflow-hidden rounded border border-gray-200">
                        <img 
                          :src="`https://flagcdn.com/w80/${config.countryCode.toLowerCase()}.png`" 
                          :alt="config.countryName" 
                          class="h-full w-full object-cover"
                        />
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">{{ config.countryName }}</div>
                        <div class="text-xs text-gray-500">{{ config.countryCode }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ config.vatRate.toFixed(2) }}%
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="config.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    >
                      {{ config.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                      <button 
                        @click="openTaxModal(config)" 
                        class="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit class="h-4 w-4" />
                      </button>
                      <button 
                        @click="toggleTaxStatus(config)" 
                        class="text-violet-600 hover:text-violet-900 transition-colors duration-200 p-1 rounded-full hover:bg-violet-50"
                        :title="config.isActive ? 'Deactivate' : 'Activate'"
                      >
                        <ToggleLeft v-if="!config.isActive" class="h-4 w-4" />
                        <ToggleRight v-else class="h-4 w-4" />
                      </button>
                      <button 
                        @click="confirmDeleteTax(config)" 
                        class="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- Shipping Rate Modal -->
      <Transition name="modal">
        <div v-if="isShippingModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="closeShippingModal">
              <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center">
                      <Package class="h-5 w-5 mr-2 text-violet-600" />
                      {{ editingShipping ? 'Edit Shipping Rate' : 'Add Shipping Rate' }}
                    </h3>
                    <div class="mt-4 space-y-4">
                      <div>
                        <label for="shipping-country" class="block text-sm font-medium text-gray-700">Country</label>
                        <div class="mt-1 relative w-full">
                          <input 
                            type="text" 
                            id="shipping-country-search" 
                            v-model="countrySearch" 
                            @input="filterCountries" 
                            @focus="showCountryDropdown = true"
                            placeholder="Search for a country" 
                            class="border-[0.5px] p-3 w-full rounded-lg outline-none"
                          />
                          <div 
                            v-if="showCountryDropdown && filteredCountries.length > 0" 
                            class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
                          >
                            <div 
                              v-for="country in filteredCountries" 
                              :key="country.code" 
                              @click="selectCountry(country, 'shipping')" 
                              class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-violet-50 transition-colors duration-150"
                            >
                              <div class="flex items-center">
                                <div class="flex-shrink-0 h-4 w-6 overflow-hidden rounded-sm border border-gray-200">
                                  <img 
                                    :src="`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`" 
                                    :alt="country.name" 
                                    class="h-full w-full object-cover"
                                  />
                                </div>
                                <span class="ml-3 truncate">{{ country.name }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-if="currentShipping.countryCode" class="mt-2 flex items-center">
                          <div class="flex-shrink-0 h-5 w-8 overflow-hidden rounded-sm border border-gray-200">
                            <img 
                              :src="`https://flagcdn.com/w80/${currentShipping.countryCode.toLowerCase()}.png`" 
                              :alt="currentShipping.countryName" 
                              class="h-full w-full object-cover"
                            />
                          </div>
                          <span class="ml-2 text-sm text-gray-700">{{ currentShipping.countryName }} ({{ currentShipping.countryCode }})</span>
                        </div>
                      </div>
                      
                      <div>
                        <label for="shipping-rate" class="block text-sm font-medium text-gray-700">Shipping Rate ($)</label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span class="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input 
                            type="number" 
                            id="shipping-rate" 
                            v-model="currentShipping.shippingRate" 
                            min="0" 
                            step="0.01" 
                            placeholder="0.00" 
                            class="block w-full border-[0.5px] p-3 pl-7 pr-12 rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200"
                          />
                          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span class="text-gray-500 sm:text-sm">USD</span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="flex items-center">
                        <input 
                          id="shipping-active" 
                          type="checkbox" 
                          v-model="currentShipping.isActive" 
                          class="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded transition-colors duration-200"
                        />
                        <label for="shipping-active" class="ml-2 block text-sm text-gray-700">
                          Active
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  @click="saveShippingConfig" 
                  :disabled="!isShippingFormValid || savingShipping"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="savingShipping" class="mr-2">
                    <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  {{ editingShipping ? 'Update' : 'Save' }}
                </button>
                <button 
                  @click="closeShippingModal" 
                  type="button" 
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
  
      <!-- Tax Rate Modal -->
      <Transition name="modal">
        <div v-if="isTaxModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="closeTaxModal">
              <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center">
                      <Percent class="h-5 w-5 mr-2 text-violet-600" />
                      {{ editingTax ? 'Edit Tax Rate' : 'Add Tax Rate' }}
                    </h3>
                    <div class="mt-4 space-y-4">
                      <div>
                        <label for="tax-country" class="block text-sm font-medium text-gray-700">Country</label>
                        <div class="mt-1 relative">
                          <input 
                            type="text" 
                            id="tax-country-search" 
                            v-model="countrySearch" 
                            @input="filterCountries" 
                            @focus="showCountryDropdown = true"
                            placeholder="Search for a country" 
                            class="border-[0.5px] p-3 outline-none w-full rounded-lg"
                          />
                          <div 
                            v-if="showCountryDropdown && filteredCountries.length > 0" 
                            class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
                          >
                            <div 
                              v-for="country in filteredCountries" 
                              :key="country.code" 
                              @click="selectCountry(country, 'tax')" 
                              class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-violet-50 transition-colors duration-150"
                            >
                              <div class="flex items-center">
                                <div class="flex-shrink-0 h-4 w-6 overflow-hidden rounded-sm border border-gray-200">
                                  <img 
                                    :src="`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`" 
                                    :alt="country.name" 
                                    class="h-full w-full object-cover"
                                  />
                                </div>
                                <span class="ml-3 truncate">{{ country.name }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-if="currentTax.countryCode" class="mt-2 flex items-center">
                          <div class="flex-shrink-0 h-5 w-8 overflow-hidden rounded-sm border border-gray-200">
                            <img 
                              :src="`https://flagcdn.com/w80/${currentTax.countryCode.toLowerCase()}.png`" 
                              :alt="currentTax.countryName" 
                              class="h-full w-full object-cover"
                            />
                          </div>
                          <span class="ml-2 text-sm text-gray-700">{{ currentTax.countryName }} ({{ currentTax.countryCode }})</span>
                        </div>
                      </div>
                      
                      <div>
                        <label for="vat-rate" class="block text-sm font-medium text-gray-700">VAT Rate (%)</label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                          <input 
                            type="number" 
                            id="vat-rate" 
                            v-model="currentTax.vatRate" 
                            min="0" 
                            max="100" 
                            step="0.01" 
                            placeholder="0.00" 
                            class="block w-full pr-12 p-3 rouned-lg border-[0.5px] outline-none rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200"
                          />
                          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span class="text-gray-500 sm:text-sm">%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="flex items-center">
                        <input 
                          id="tax-active" 
                          type="checkbox" 
                          v-model="currentTax.isActive" 
                          class="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded transition-colors duration-200"
                        />
                        <label for="tax-active" class="ml-2 block text-sm text-gray-700">
                          Active
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  @click="saveTaxConfig" 
                  :disabled="!isTaxFormValid || savingTax"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="savingTax" class="mr-2">
                    <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  {{ editingTax ? 'Update' : 'Save' }}
                </button>
                <button 
                  @click="closeTaxModal" 
                  type="button" 
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
  
      <!-- Delete Confirmation Modal -->
      <Transition name="modal">
        <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="isDeleteModalOpen = false">
              <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle class="h-6 w-6 text-red-600" />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      Delete Configuration
                    </h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Are you sure you want to delete this configuration? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  @click="confirmDelete" 
                  :disabled="deleting"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="deleting" class="mr-2">
                    <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  Delete
                </button>
                <button 
                  @click="isDeleteModalOpen = false" 
                  type="button" 
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { 
    Plus, Edit, Trash2, Package, Percent, 
    ToggleLeft, ToggleRight, AlertTriangle
  } from 'lucide-vue-next'
  import { useShippingConfig } from '@/composables/modules/shipping-tax/useShippingConfig'
  import { useTaxConfig } from '@/composables/modules/shipping-tax/useTaxConfig'
  import { useCountries } from '@/composables/core/useCountries'
  
  // Import composables
  const { 
    fetchShippingConfigs, 
    createShippingConfig, 
    updateShippingConfig, 
    deleteShippingConfig 
  } = useShippingConfig()
  
  const { 
    fetchTaxConfigs, 
    createTaxConfig, 
    updateTaxConfig, 
    deleteTaxConfig 
  } = useTaxConfig()
  
  const { fetchCountries } = useCountries()
  
  // State
  const activeTab = ref('shipping')
  const countries = ref<{ code: string; name: string }[]>([])
  const countrySearch = ref('')
  const filteredCountries = ref<{ code: string; name: string }[]>([])
  const showCountryDropdown = ref(false)
  
  // Shipping config state
  const shippingConfigs = ref<any[]>([])
  const loadingShipping = ref(true)
  const savingShipping = ref(false)
  const isShippingModalOpen = ref(false)
  const editingShipping = ref(false)
  const currentShipping = ref({
    id: '',
    countryCode: '',
    countryName: '',
    shippingRate: 0,
    isActive: true
  })
  
  // Tax config state
  const taxConfigs = ref<any[]>([])
  const loadingTax = ref(true)
  const savingTax = ref(false)
  const isTaxModalOpen = ref(false)
  const editingTax = ref(false)
  const currentTax = ref({
    id: '',
    countryCode: '',
    countryName: '',
    vatRate: 0,
    isActive: true
  })
  
  // Delete modal state
  const isDeleteModalOpen = ref(false)
  const deleting = ref(false)
  const deleteType = ref<'shipping' | 'tax'>('shipping')
  const itemToDelete = ref<any>(null)
  
  // Form validation
  const isShippingFormValid = computed(() => {
    return (
      currentShipping.value.countryCode !== '' &&
      currentShipping.value.countryName !== '' &&
      currentShipping.value.shippingRate >= 0
    )
  })
  
  const isTaxFormValid = computed(() => {
    return (
      currentTax.value.countryCode !== '' &&
      currentTax.value.countryName !== '' &&
      currentTax.value.vatRate >= 0 &&
      currentTax.value.vatRate <= 100
    )
  })
  
  // Fetch data
  onMounted(async () => {
    // Fetch countries
    try {
      const data = await fetchCountries()
      countries.value = data
      filteredCountries.value = data.slice(0, 10) // Show first 10 by default
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  
    // Fetch shipping configs
    try {
      loadingShipping.value = true
      const data = await fetchShippingConfigs()
      shippingConfigs.value = data
      loadingShipping.value = false
    } catch (error) {
      console.error('Error fetching shipping configs:', error)
      loadingShipping.value = false
    }
  
    // Fetch tax configs
    try {
      loadingTax.value = true
      const data = await fetchTaxConfigs()
      taxConfigs.value = data
      loadingTax.value = false
    } catch (error) {
      console.error('Error fetching tax configs:', error)
      loadingTax.value = false
    }
  })
  
  // Filter countries based on search
  const filterCountries = () => {
    if (countrySearch.value.length === 0) {
      filteredCountries.value = countries.value.slice(0, 10)
      return
    }
  
    const search = countrySearch.value.toLowerCase()
    filteredCountries.value = countries.value
      .filter(country => 
        country.name.toLowerCase().includes(search) || 
        country.code.toLowerCase().includes(search)
      )
      .slice(0, 10)
  }
  
  // Select a country from the dropdown
  const selectCountry = (country: { code: string; name: string }, type: 'shipping' | 'tax') => {
    if (type === 'shipping') {
      currentShipping.value.countryCode = country.code
      currentShipping.value.countryName = country.name
    } else {
      currentTax.value.countryCode = country.code
      currentTax.value.countryName = country.name
    }
    
    countrySearch.value = ''
    showCountryDropdown.value = false
  }
  
  // Click outside to close country dropdown
  watch(() => showCountryDropdown.value, (isOpen) => {
    if (isOpen) {
      setTimeout(() => {
        const handleClickOutside = (event: MouseEvent) => {
          const target = event.target as HTMLElement
          const dropdown = document.querySelector('#shipping-country-search, #tax-country-search')
          if (dropdown && !dropdown.contains(target)) {
            showCountryDropdown.value = false
            document.removeEventListener('click', handleClickOutside)
          }
        }
        document.addEventListener('click', handleClickOutside)
      }, 0)
    }
  })
  
  // Shipping config functions
  const openShippingModal = (config?: any) => {
    if (config) {
      // Edit mode
      currentShipping.value = {
        id: config.id,
        countryCode: config.countryCode,
        countryName: config.countryName,
        shippingRate: config.shippingRate,
        isActive: config.isActive
      }
      editingShipping.value = true
    } else {
      // Create mode
      currentShipping.value = {
        id: '',
        countryCode: '',
        countryName: '',
        shippingRate: 0,
        isActive: true
      }
      editingShipping.value = false
    }
    
    isShippingModalOpen.value = true
  }
  
  const closeShippingModal = () => {
    isShippingModalOpen.value = false
    currentShipping.value = {
      id: '',
      countryCode: '',
      countryName: '',
      shippingRate: 0,
      isActive: true
    }
  }
  
  const saveShippingConfig = async () => {
    if (!isShippingFormValid.value) return
    
    savingShipping.value = true
    try {
      if (editingShipping.value) {
        // Update existing config
        const updatedConfig = await updateShippingConfig(
          currentShipping.value.id,
          {
            countryCode: currentShipping.value.countryCode,
            countryName: currentShipping.value.countryName,
            shippingRate: currentShipping.value.shippingRate,
            isActive: currentShipping.value.isActive
          }
        )
        
        // Update local state
        const index = shippingConfigs.value.findIndex(c => c.id === currentShipping.value.id)
        if (index !== -1) {
          shippingConfigs.value[index] = updatedConfig
        }
      } else {
        // Create new config
        const newConfig = await createShippingConfig({
          countryCode: currentShipping.value.countryCode,
          countryName: currentShipping.value.countryName,
          shippingRate: currentShipping.value.shippingRate,
          isActive: currentShipping.value.isActive
        })
        
        // Add to local state
        shippingConfigs.value.push(newConfig)
      }
      
      closeShippingModal()
    } catch (error) {
      console.error('Error saving shipping config:', error)
    } finally {
      savingShipping.value = false
    }
  }
  
  const toggleShippingStatus = async (config: any) => {
    try {
      const updatedConfig = await updateShippingConfig(
        config.id,
        {
          ...config,
          isActive: !config.isActive
        }
      )
      
      // Update local state
      const index = shippingConfigs.value.findIndex(c => c.id === config.id)
      if (index !== -1) {
        shippingConfigs.value[index] = updatedConfig
      }
    } catch (error) {
      console.error('Error toggling shipping status:', error)
    }
  }
  
  const confirmDeleteShipping = (config: any) => {
    itemToDelete.value = config
    deleteType.value = 'shipping'
    isDeleteModalOpen.value = true
  }
  
  // Tax config functions
  const openTaxModal = (config?: any) => {
    if (config) {
      // Edit mode
      currentTax.value = {
        id: config.id,
        countryCode: config.countryCode,
        countryName: config.countryName,
        vatRate: config.vatRate,
        isActive: config.isActive
      }
      editingTax.value = true
    } else {
      // Create mode
      currentTax.value = {
        id: '',
        countryCode: '',
        countryName: '',
        vatRate: 0,
        isActive: true
      }
      editingTax.value = false
    }
    
    isTaxModalOpen.value = true
  }
  
  const closeTaxModal = () => {
    isTaxModalOpen.value = false
    currentTax.value = {
      id: '',
      countryCode: '',
      countryName: '',
      vatRate: 0,
      isActive: true
    }
  }
  
  const saveTaxConfig = async () => {
    if (!isTaxFormValid.value) return
    
    savingTax.value = true
    try {
      if (editingTax.value) {
        // Update existing config
        const updatedConfig = await updateTaxConfig(
          currentTax.value.id,
          {
            countryCode: currentTax.value.countryCode,
            countryName: currentTax.value.countryName,
            vatRate: currentTax.value.vatRate,
            isActive: currentTax.value.isActive
          }
        )
        
        // Update local state
        const index = taxConfigs.value.findIndex(c => c.id === currentTax.value.id)
        if (index !== -1) {
          taxConfigs.value[index] = updatedConfig
        }
      } else {
        // Create new config
        const newConfig = await createTaxConfig({
          countryCode: currentTax.value.countryCode,
          countryName: currentTax.value.countryName,
          vatRate: currentTax.value.vatRate,
          isActive: currentTax.value.isActive
        })
        
        // Add to local state
        taxConfigs.value.push(newConfig)
      }
      
      closeTaxModal()
    } catch (error) {
      console.error('Error saving tax config:', error)
    } finally {
      savingTax.value = false
    }
  }
  
  const toggleTaxStatus = async (config: any) => {
    try {
      const updatedConfig = await updateTaxConfig(
        config.id,
        {
          ...config,
          isActive: !config.isActive
        }
      )
      
      // Update local state
      const index = taxConfigs.value.findIndex(c => c.id === config.id)
      if (index !== -1) {
        taxConfigs.value[index] = updatedConfig
      }
    } catch (error) {
      console.error('Error toggling tax status:', error)
    }
  }
  
  const confirmDeleteTax = (config: any) => {
    itemToDelete.value = config
    deleteType.value = 'tax'
    isDeleteModalOpen.value = true
  }
  
  // Delete confirmation
  const confirmDelete = async () => {
    if (!itemToDelete.value) return
    
    deleting.value = true
    try {
      if (deleteType.value === 'shipping') {
        await deleteShippingConfig(itemToDelete.value.id)
        // Remove from local state
        shippingConfigs.value = shippingConfigs.value.filter(c => c.id !== itemToDelete.value.id)
      } else {
        await deleteTaxConfig(itemToDelete.value.id)
        // Remove from local state
        taxConfigs.value = taxConfigs.value.filter(c => c.id !== itemToDelete.value.id)
      }
      
      isDeleteModalOpen.value = false
      itemToDelete.value = null
    } catch (error) {
      console.error('Error deleting config:', error)
    } finally {
      deleting.value = false
    }
  }

  definePageMeta({
    layout: 'dashboard'
  })
  </script>
  
  <style scoped>
  /* Animations */
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  /* Modal transitions */
  .modal-enter-active,
  .modal-leave-active {
    transition: all 0.3s ease;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
  </style>