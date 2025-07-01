<template>
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="isOpen" class="fixed inset-0 backdrop-blur-lg z-50 overflow-hidden">
          <!-- Backdrop -->
          <div 
            class="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            @click="$emit('close')"
          ></div>
          
          <!-- Drawer -->
          <div class="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div class="flex flex-col h-full">
              <!-- Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                <div class="flex items-center space-x-3">
                  <div class="h-10 w-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <ShoppingBag class="h-5 w-5" />
                  </div>
                  <div>
                    <h2 class="text-xl font-bold">{{ order?.orderNumber }}</h2>
                    <p class="text-violet-100 text-sm">Order Details</p>
                  </div>
                </div>
                <button 
                  @click="$emit('close')"
                  class="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
                >
                  <X class="h-5 w-5" />
                </button>
              </div>
  
              <!-- Content -->
              <div class="flex-1 overflow-y-auto">
                <div v-if="order" class="p-6 space-y-8">
                  <!-- Order Status & Quick Actions -->
                  <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-3">
                        <span class="px-4 py-2 text-sm font-semibold rounded-full" :class="getStatusClass(order.status)">
                          {{ capitalizeFirstLetter(order.status) }}
                        </span>
                        <span v-if="order.paymentType === 'installment'" class="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                          Installment Plan
                        </span>
                      </div>
                      <button 
                        @click="$emit('update-status', order)"
                        class="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all duration-200 text-sm font-medium"
                      >
                        Update Status
                      </button>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p class="text-gray-600">Order Date</p>
                        <p class="font-semibold">{{ formatDate(order.createdAt) }}</p>
                      </div>
                      <div>
                        <p class="text-gray-600">Order Age</p>
                        <p class="font-semibold">{{ order.age }} days</p>
                      </div>
                    </div>
                  </div>
  
                  <!-- Customer Information -->
                  <div class="bg-white border border-gray-200 rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User class="h-5 w-5 mr-2 text-violet-600" />
                      Customer Information
                    </h3>
                    <div class="flex items-start space-x-4">
                      <div class="h-16 w-16 bg-violet-100 rounded-full flex items-center justify-center">
                        <span class="text-lg font-bold text-violet-700">{{ getInitials(order.customer.fullName) }}</span>
                      </div>
                      <div class="flex-1">
                        <h4 class="text-lg font-semibold text-gray-900">{{ order.customer.fullName }}</h4>
                        <p class="text-gray-600">{{ order.customer.email }}</p>
                        <div class="mt-3 flex space-x-3">
                          <button class="text-violet-600 hover:text-violet-800 text-sm font-medium">
                            View Profile
                          </button>
                          <button class="text-violet-600 hover:text-violet-800 text-sm font-medium">
                            Contact Customer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Payment Information -->
                  <div class="bg-white border border-gray-200 rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard class="h-5 w-5 mr-2 text-violet-600" />
                      Payment Information
                    </h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Payment Summary -->
                      <div class="space-y-3">
                        <div class="flex justify-between">
                          <span class="text-gray-600">Subtotal:</span>
                          <span class="font-semibold">${{ order.subtotal.toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600">Tax ({{ order.taxRate }}%):</span>
                          <span class="font-semibold">${{ order.tax.toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600">Shipping:</span>
                          <span class="font-semibold">${{ order.shipping.toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between border-t pt-3">
                          <span class="text-lg font-semibold">Total:</span>
                          <span class="text-lg font-bold text-violet-600">${{ order.total.toFixed(2) }}</span>
                        </div>
                      </div>
  
                      <!-- Payment Status -->
                      <div class="space-y-4">
                        <div>
                          <span class="px-3 py-1 text-sm font-semibold rounded-full" :class="getPaymentStatusClass(order.paymentStatus)">
                            {{ capitalizeFirstLetter(order.paymentStatus) }}
                          </span>
                        </div>
                        
                        <div v-if="order.paymentType === 'installment' && order.installmentInfo" class="space-y-3">
                          <div class="bg-purple-50 rounded-lg p-4">
                            <h4 class="font-semibold text-purple-900 mb-3">Installment Details</h4>
                            <div class="space-y-2 text-sm">
                              <div class="flex justify-between">
                                <span class="text-purple-700">Down Payment:</span>
                                <span class="font-semibold">${{ order.installmentInfo.downPayment.toFixed(2) }}</span>
                              </div>
                              <div class="flex justify-between">
                                <span class="text-purple-700">Installments:</span>
                                <span class="font-semibold">{{ order.installmentInfo.numberOfInstallments }} payments</span>
                              </div>
                              <div class="flex justify-between">
                                <span class="text-purple-700">Payment Amount:</span>
                                <span class="font-semibold">${{ order.installmentInfo.installmentAmount.toFixed(2) }}</span>
                              </div>
                              <div class="flex justify-between">
                                <span class="text-purple-700">Frequency:</span>
                                <span class="font-semibold">{{ capitalizeFirstLetter(order.installmentInfo.paymentFrequency) }}</span>
                              </div>
                              <div class="flex justify-between">
                                <span class="text-purple-700">Interest Rate:</span>
                                <span class="font-semibold">{{ order.installmentInfo.interestRate }}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div class="bg-orange-50 rounded-lg p-4">
                            <div class="flex justify-between items-center">
                              <span class="text-orange-700 font-medium">Remaining Balance:</span>
                              <span class="text-lg font-bold text-orange-600">${{ (order.remainingBalance || 0).toFixed(2) }}</span>
                            </div>
                            <div class="mt-2 bg-orange-200 rounded-full h-2">
                              <div 
                                class="bg-orange-500 h-2 rounded-full transition-all duration-500"
                                :style="{ width: `${((order.paidAmount || 0) / order.total) * 100}%` }"
                              ></div>
                            </div>
                            <p class="text-xs text-orange-600 mt-1">
                              {{ (((order.paidAmount || 0) / order.total) * 100).toFixed(1) }}% paid
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Order Items -->
                  <div class="bg-white border border-gray-200 rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Package class="h-5 w-5 mr-2 text-violet-600" />
                      Order Items ({{ order.items.length }})
                    </h3>
                    <div class="space-y-4">
                      <div 
                        v-for="(item, index) in order.items" 
                        :key="index"
                        class="flex items-start space-x-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-200"
                      >
                        <div class="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package class="h-8 w-8 text-gray-400" />
                        </div>
                        <div class="flex-1">
                          <div class="flex justify-between items-start">
                            <div>
                              <h4 class="font-semibold text-gray-900">Product Item</h4>
                              <p class="text-sm text-gray-600">ID: {{ item.product }}</p>
                              <div class="flex space-x-4 mt-1 text-sm text-gray-500">
                                <span v-if="item.size">Size: {{ item.size }}</span>
                                <span v-if="item.color">Color: {{ item.color }}</span>
                              </div>
                            </div>
                            <div class="text-right">
                              <p class="font-semibold text-gray-900">${{ item.price.toFixed(2) }}</p>
                              <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                            </div>
                          </div>
                          <div class="flex justify-between items-center mt-3">
                            <span class="text-sm text-gray-600">Total:</span>
                            <span class="font-bold text-violet-600">${{ item.total.toFixed(2) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Shipping Information -->
                  <div class="bg-white border border-gray-200 rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Truck class="h-5 w-5 mr-2 text-violet-600" />
                      Shipping Information
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 class="font-semibold text-gray-900 mb-3">Shipping Address</h4>
                        <div class="text-sm text-gray-600 space-y-1">
                          <p class="font-medium text-gray-900">{{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}</p>
                          <p>{{ order.shippingAddress.address }}</p>
                          <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.postalCode }}</p>
                          <p>{{ order.shippingAddress.country }}</p>
                          <div class="mt-3 pt-3 border-t border-gray-100">
                            <p><span class="font-medium">Phone:</span> {{ order.shippingAddress.phone || 'N/A' }}</p>
                            <p><span class="font-medium">Email:</span> {{ order.shippingAddress.email }}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 class="font-semibold text-gray-900 mb-3">Billing Address</h4>
                        <div class="text-sm text-gray-600 space-y-1">
                          <p class="font-medium text-gray-900">{{ order.billingAddress.firstName }} {{ order.billingAddress.lastName }}</p>
                          <p>{{ order.billingAddress.address }}</p>
                          <p>{{ order.billingAddress.city }}, {{ order.billingAddress.state }} {{ order.billingAddress.postalCode }}</p>
                          <p>{{ order.billingAddress.country }}</p>
                          <div class="mt-3 pt-3 border-t border-gray-100">
                            <p><span class="font-medium">Phone:</span> {{ order.billingAddress.phone || 'N/A' }}</p>
                            <p><span class="font-medium">Email:</span> {{ order.billingAddress.email }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Order Timeline -->
                  <div class="bg-white border border-gray-200 rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Clock class="h-5 w-5 mr-2 text-violet-600" />
                      Order Timeline
                    </h3>
                    <div class="space-y-4">
                      <div 
                        v-for="(event, index) in order.statusHistory" 
                        :key="index"
                        class="flex items-start space-x-4"
                      >
                        <div class="flex-shrink-0">
                          <div class="h-8 w-8 rounded-full flex items-center justify-center" :class="getStatusClass(event.status)">
                            <CheckCircle v-if="event.status === 'delivered'" class="h-4 w-4" />
                            <Truck v-else-if="event.status === 'shipped'" class="h-4 w-4" />
                            <Clock v-else class="h-4 w-4" />
                          </div>
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center justify-between">
                            <p class="text-sm font-medium text-gray-900">
                              {{ capitalizeFirstLetter(event.status) }}
                            </p>
                            <p class="text-xs text-gray-500">{{ formatDate(event.date) }}</p>
                          </div>
                          <p v-if="event.notes" class="text-sm text-gray-600 mt-1">{{ event.notes }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Notes -->
                  <div v-if="order.notes" class="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-amber-900 mb-3 flex items-center">
                      <FileText class="h-5 w-5 mr-2" />
                      Order Notes
                    </h3>
                    <p class="text-amber-800">{{ order.notes }}</p>
                  </div>
                </div>
              </div>
  
              <!-- Footer Actions -->
              <div class="border-t border-gray-200 p-6 bg-gray-50">
                <div class="flex space-x-3">
                  <button 
                    @click="$emit('update-status', order)"
                    class="flex-1 bg-violet-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-violet-700 transition-all duration-200"
                  >
                    Update Status
                  </button>
                  <button 
                    @click="printOrder"
                    class="px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  >
                    <Printer class="h-4 w-4" />
                  </button>
                  <button 
                    @click="$emit('close')"
                    class="px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import { 
    X, ShoppingBag, User, CreditCard, Package, Truck, Clock, 
    CheckCircle, FileText, Printer
  } from 'lucide-vue-next'
  
  interface Props {
    order: any
    isOpen: boolean
  }
  
  defineProps<Props>()
  defineEmits(['close', 'update-status'])
  
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
  }
  
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).replace('_', ' ')
  }
  
  const getStatusClass = (status: string) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
  }
  
  const getPaymentStatusClass = (status: string) => {
    const classes = {
      paid: 'bg-green-100 text-green-800',
      partially_paid: 'bg-orange-100 text-orange-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800'
    }
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
  }
  
  const printOrder = () => {
    window.print()
  }
  </script>
  
  <style scoped>
  .drawer-enter-active,
  .drawer-leave-active {
    transition: all 0.3s ease;
  }
  
  .drawer-enter-from {
    transform: translateX(100%);
  }
  
  .drawer-leave-to {
    transform: translateX(100%);
  }
  
  .drawer-enter-from .absolute.inset-0,
  .drawer-leave-to .absolute.inset-0 {
    opacity: 0;
  }
  </style>
  