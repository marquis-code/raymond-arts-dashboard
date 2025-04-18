<template>
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Payments Management</h1>
          <p class="text-gray-500 mt-1">Manage and track all payment methods and transactions</p>
        </div>
        <div class="flex gap-3">
          <button class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            <Plus class="h-4 w-4 mr-2" />
            Add Payment Method
          </button>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
        <div class="space-y-4">
          <div class="p-4 border rounded-lg flex items-center justify-between">
            <div class="flex items-center">
              <CreditCard class="h-8 w-8 text-violet-600 mr-4" />
              <div>
                <h3 class="font-medium text-gray-900">Visa ending in 4242</h3>
                <p class="text-sm text-gray-500">Expires 04/2028</p>
              </div>
            </div>
            <div class="flex items-center">
              <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mr-4">Default</span>
              <button class="text-gray-400 hover:text-gray-500">
                <MoreVertical class="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div class="p-4 border rounded-lg flex items-center justify-between">
            <div class="flex items-center">
              <CreditCard class="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 class="font-medium text-gray-900">Mastercard ending in 5555</h3>
                <p class="text-sm text-gray-500">Expires 12/2026</p>
              </div>
            </div>
            <div>
              <button class="text-gray-400 hover:text-gray-500">
                <MoreVertical class="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div class="p-4 border rounded-lg flex items-center justify-between">
            <div class="flex items-center">
              <DollarSign class="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 class="font-medium text-gray-900">PayPal</h3>
                <p class="text-sm text-gray-500">artist@example.com</p>
              </div>
            </div>
            <div>
              <button class="text-gray-400 hover:text-gray-500">
                <MoreVertical class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(payment, index) in recentPayments" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ payment.date }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-violet-600">#{{ payment.orderId }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ payment.customer }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${{ payment.amount.toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ payment.method }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="{
                      'bg-green-100 text-green-800': payment.status === 'Successful',
                      'bg-yellow-100 text-yellow-800': payment.status === 'Pending',
                      'bg-red-100 text-red-800': payment.status === 'Failed'
                    }">
                    {{ payment.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Plus, CreditCard, DollarSign, MoreVertical } from 'lucide-vue-next'
  
  // Sample recent payments data
  const recentPayments = ref([
    { date: 'Apr 2, 2025', orderId: '1089', customer: 'John Doe', amount: 350.00, method: 'Visa *4242', status: 'Successful' },
    { date: 'Apr 1, 2025', orderId: '1088', customer: 'Sarah Smith', amount: 125.00, method: 'PayPal', status: 'Successful' },
    { date: 'Mar 30, 2025', orderId: '1087', customer: 'Michael Johnson', amount: 500.00, method: 'Bank Transfer', status: 'Pending' },
    { date: 'Mar 29, 2025', orderId: '1086', customer: 'Emily Williams', amount: 75.00, method: 'Mastercard *5555', status: 'Successful' },
    { date: 'Mar 28, 2025', orderId: '1085', customer: 'Robert Brown', amount: 450.00, method: 'PayPal', status: 'Failed' }
  ])

  definePageMeta({
      layout: 'dashboard'
  })
  </script>