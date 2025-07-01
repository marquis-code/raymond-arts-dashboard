<template>
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Backdrop -->
            <div 
              class="fixed inset-0 blur-xl transition-opacity bg-black bg-opacity-50" 
              @click="$emit('close')"
            ></div>
  
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
  
            <!-- Modal -->
            <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-6 pt-6 pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-violet-100 sm:mx-0 sm:h-10 sm:w-10">
                    <RefreshCw class="h-6 w-6 text-violet-600" />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 class="text-lg leading-6 font-semibold text-gray-900">
                      Update Order Status
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">
                      Update the status for order {{ order?.orderNumber }}
                    </p>
  
                    <div class="mt-6 space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select 
                          v-model="newStatus" 
                          class="w-full rounded-xl text-sm py-2.5 border px-3 border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="returned">Returned</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </div>
  
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                        <textarea 
                          v-model="statusNotes" 
                          rows="3" 
                          class="w-full rounded-xl text-sm p-3 border border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200"
                          placeholder="Add notes about this status change..."
                        ></textarea>
                      </div>
  
                      <div v-if="newStatus === 'shipped'" class="p-4 bg-blue-50 rounded-xl">
                        <h4 class="text-sm font-semibold text-blue-900 mb-3">Shipping Information</h4>
                        <div class="space-y-3">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                            <input 
                              type="text" 
                              v-model="trackingNumber" 
                              class="w-full rounded-lg text-sm py-2.5 px-3 border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200"
                              placeholder="Enter tracking number..."
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Shipping Carrier</label>
                            <select 
                              v-model="shippingCarrier" 
                              class="w-full rounded-lg text-sm py-2.5 px-3 border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200"
                            >
                              <option value="usps">USPS</option>
                              <option value="ups">UPS</option>
                              <option value="fedex">FedEx</option>
                              <option value="dhl">DHL</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <div class="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse rounded-b-2xl">
                <button 
                  @click="saveStatus" 
                  :disabled="updating"
                  class="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="updating" class="mr-2">
                    <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  {{ updating ? 'Updating...' : 'Update Status' }}
                </button>
                <button 
                  @click="$emit('close')" 
                  type="button" 
                  class="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { RefreshCw } from 'lucide-vue-next'
  import { useUpdateOrderStatus } from "@/composables/modules/orders/useUpdateOrderStatus"
  const { updateOrderStatus, loading: updating } = useUpdateOrderStatus()
  
  interface Props {
    order: any
    isOpen: boolean
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits(['close', 'updated'])
  
//   const updating = ref(false)
  const newStatus = ref('')
  const statusNotes = ref('')
  const trackingNumber = ref('')
  const shippingCarrier = ref('usps')
  
  watch(() => props.order, (order) => {
    if (order) {
      newStatus.value = order.status
      statusNotes.value = ''
      trackingNumber.value = ''
      shippingCarrier.value = 'usps'
    }
  })
  
  const saveStatus = async () => {
    if (!props.order) return
  
    updating.value = true
    
    try {
      // Simulate API call
    //   await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Here you would make the actual API call to update the order status
      console.log('Updating order status:', {
        orderId: props.order._id,
        status: newStatus.value,
        notes: statusNotes.value,
        trackingNumber: trackingNumber.value,
        shippingCarrier: shippingCarrier.value
      })
      await updateOrderStatus(props.order._id, {
        status: newStatus.value,
        notes: statusNotes.value,
        trackingNumber: trackingNumber.value,
        shippingCarrier: shippingCarrier.value
      }).then(() => {
        emit('updated')
      })
    } catch (error) {
      console.error('Error updating order status:', error)
    } finally {
      updating.value = false
    }
  }
  </script>
  
  <style scoped>
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
  