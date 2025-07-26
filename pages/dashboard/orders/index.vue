<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->

    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div class="animate-fade-in">
            <h1 class="text-2xl font-bold text-gray-900">Orders Management</h1>

            <p class="text-gray-600 mt-1">
              Track orders, installments, and payment schedules
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 animate-slide-in-right">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search orders, customers..."
                class="pl-10 pr-4 py-3 w-full sm:w-80 border border-gray-300 rounded-xl shadow-sm text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
              />

              <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              />
            </div>

            <button
              @click="exportOrders"
              class="inline-flex items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200"
            >
              <Download class="h-4 w-4 mr-2" />

              Export
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Dashboard -->

    <div class="py-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Orders -->

        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 animate-fade-in"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Orders</p>
              <!-- {{ pagination }} -->

              <p class="text-2xl font-bold text-gray-900 mt-2">
                {{ pagination?.total }}
              </p>

              <p class="text-sm text-green-600 mt-1">
                <TrendingUp class="inline h-4 w-4 mr-1" />

                +12% from last month
              </p>
            </div>

            <div
              class="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center"
            >
              <ShoppingBag class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Installment Orders -->

        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 animate-fade-in"
          style="animation-delay: 0.1s"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">
                Installment Orders
              </p>

              <p class="text-2xl font-bold text-gray-900 mt-2">
                {{ orderStats.installmentOrders }}
              </p>

              <p class="text-sm text-green-600 mt-1">
                {{
                  (
                    (orderStats.installmentOrders / orderStats.totalOrders) *
                    100
                  ).toFixed(1)
                }}% of total
              </p>
            </div>

            <div
              class="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center"
            >
              <CreditCard class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Outstanding Balance -->

        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 animate-fade-in"
          style="animation-delay: 0.2s"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">
                Outstanding Balance
              </p>

              <p class="text-2xl font-bold text-gray-900 mt-2">
                ${{ formatCurrency(orderStats.outstandingBalance) }}
              </p>

              <p class="text-sm text-orange-600 mt-1">
                {{ orderStats.overdueCount }} overdue payments
              </p>
            </div>

            <div
              class="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center"
            >
              <DollarSign class="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <!-- Revenue This Month -->

        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 animate-fade-in"
          style="animation-delay: 0.3s"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">
                Revenue This Month
              </p>

              <p class="text-2xl font-bold text-gray-900 mt-2">
                ${{ formatCurrency(orderStats.monthlyRevenue) }}
              </p>

              <p class="text-sm text-green-600 mt-1">
                <TrendingUp class="inline h-4 w-4 mr-1" />

                +8.2% from last month
              </p>
            </div>

            <div
              class="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center"
            >
              <BarChart3 class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->

      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 animate-fade-in"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Status</label
            >

            <select
              v-model="filters.status"
              class="w-full rounded-xl text-sm border py-2.5 px-3 border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200"
            >
              <option value="all">All Status</option>

              <option value="pending">Pending</option>

              <option value="processing">Processing</option>

              <option value="shipped">Shipped</option>

              <option value="delivered">Delivered</option>

              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Payment Type</label
            >

            <select
              v-model="filters.paymentType"
              class="w-full rounded-xl text-sm border py-2.5 px-3 border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200"
            >
              <option value="all">All Types</option>

              <option value="one_time">One-time Payment</option>

              <option value="installment">Installment Plan</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Payment Status</label
            >

            <select
              v-model="filters.paymentStatus"
              class="w-full rounded-xl text-sm border py-2.5 px-3 border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200"
            >
              <option value="all">All Payment Status</option>

              <option value="paid">Fully Paid</option>

              <option value="partially_paid">Partially Paid</option>

              <option value="pending">Pending</option>

              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Date Range</label
            >

            <select
              v-model="filters.dateRange"
              class="w-full rounded-xl text-sm border py-2.5 px-3 border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200"
            >
              <option value="all">All Time</option>

              <option value="today">Today</option>

              <option value="week">This Week</option>

              <option value="month">This Month</option>

              <option value="year">This Year</option>
            </select>
          </div>

          <div class="flex items-end">
            <button
              @click="resetFilters"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Orders Table -->

      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in"
      >
        <div v-if="loading" class="p-12 flex justify-center items-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"
          ></div>
        </div>

        <div
          v-else-if="!filteredOrders.length"
          class="p-12 text-center text-gray-500"
        >
          <PackageX class="h-16 w-16 mx-auto mb-4 text-gray-400" />

          <p class="text-xl font-medium">No orders found</p>

          <p class="mt-2">Try adjusting your filters or search criteria</p>
        </div>

        <div v-else>
          <!-- Mobile Cards View -->

          <div class="block lg:hidden">
            <div class="divide-y divide-gray-200">
              <div
                v-for="(order, index) in paginatedOrders"
                :key="order._id"
                class="p-6 hover:bg-gray-50 transition-all duration-200 cursor-pointer animate-fade-in"
                :style="{ animationDelay: `${index * 0.05}s` }"
                @click="viewOrder(order)"
              >
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <p class="text-lg font-semibold text-violet-600">
                      {{ order.orderNumber }}
                    </p>

                    <p class="text-sm text-gray-500">
                      {{ formatDate(order.createdAt) }}
                    </p>
                  </div>

                  <div class="flex flex-col items-end gap-2">
                    <span
                      class="px-3 py-1 text-xs font-semibold rounded-full"
                      :class="getStatusClass(order.status)"
                    >
                      {{ capitalizeFirstLetter(order.status) }}
                    </span>

                    <span
                      v-if="order.paymentType === 'installment'"
                      class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                    >
                      Installment
                    </span>
                  </div>
                </div>

                <div class="flex items-center mb-3">
                  <div
                    class="h-10 w-10 bg-violet-100 rounded-full flex items-center justify-center mr-3"
                  >
                    <span class="text-sm font-medium text-violet-700">{{
                      getInitials(order.customer.fullName)
                    }}</span>
                  </div>

                  <div>
                    <p class="font-medium text-gray-900">
                      {{ order.customer.fullName }}
                    </p>

                    <p class="text-sm text-gray-500">
                      {{ order.customer.email }}
                    </p>
                  </div>
                </div>

                <div class="flex justify-between items-center">
                  <div>
                    <p class="text-sm text-gray-500">
                      {{ order.items.length }} item(s)
                    </p>

                    <p class="text-lg font-bold text-gray-900">
                      ${{ order.total.toFixed(2) }}
                    </p>
                  </div>

                  <div
                    v-if="order.paymentType === 'installment'"
                    class="text-right"
                  >
                    <p class="text-sm text-gray-500">
                      Paid: ${{ order.paidAmount?.toFixed(2) || "0.00" }}
                    </p>

                    <p class="text-sm font-medium text-orange-600">
                      Remaining: ${{ (order.remainingBalance || 0).toFixed(2) }}
                    </p>
                  </div>
                </div>

                <div
                  v-if="
                    order.paymentType === 'installment' && order.installmentInfo
                  "
                  class="mt-4 p-3 bg-green-50 rounded-lg"
                >
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span class="text-gray-600">Next Payment:</span>

                      <p class="font-medium">
                        ${{
                          order.installmentInfo.installmentAmount.toFixed(2)
                        }}
                      </p>
                    </div>

                    <div>
                      <span class="text-gray-600">Frequency:</span>

                      <p class="font-medium">
                        {{
                          capitalizeFirstLetter(
                            order.installmentInfo.paymentFrequency
                          )
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop Table View -->

          <div class="hidden lg:block overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order
                  </th>

                  <th
                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>

                  <th
                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Items
                  </th>

                  <th
                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Payment
                  </th>

                  <th
                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>

                  <th
                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(order, index) in paginatedOrders"
                  :key="order._id"
                  class="hover:bg-gray-50 transition-all duration-200 cursor-pointer animate-fade-in"
                  :style="{ animationDelay: `${index * 0.05}s` }"
                  @click="viewOrder(order)"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p class="text-sm font-semibold text-violet-600">
                        {{ order.orderNumber }}
                      </p>

                      <p class="text-xs text-gray-500">
                        {{ formatDate(order.createdAt) }}
                      </p>

                      <div class="flex gap-1 mt-1">
                        <span
                          v-if="order.paymentType === 'installment'"
                          class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                        >
                          Installment
                        </span>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div
                        class="h-10 w-10 bg-violet-100 rounded-full flex items-center justify-center mr-3"
                      >
                        <span class="text-sm font-medium text-violet-700">{{
                          getInitials(order.customer.fullName)
                        }}</span>
                      </div>

                      <div>
                        <p class="text-sm font-medium text-gray-900">
                          {{ order.customer.fullName }}
                        </p>

                        <p class="text-xs text-gray-500">
                          {{ order.customer.email }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <span class="text-sm font-medium"
                        >{{ order.items.length }} item(s)</span
                      >
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p class="text-sm font-bold text-gray-900">
                        ${{ order.total.toFixed(2) }}
                      </p>

                      <div v-if="order.paymentType === 'installment'">
                        <p class="text-xs text-green-600">
                          Paid: ${{ order.paidAmount?.toFixed(2) || "0.00" }}
                        </p>

                        <p class="text-xs text-orange-600">
                          Remaining: ${{
                            (order.remainingBalance || 0).toFixed(2)
                          }}
                        </p>
                      </div>

                      <span
                        class="px-2 py-1 text-xs font-semibold rounded-full mt-1 inline-block"
                        :class="getPaymentStatusClass(order.paymentStatus)"
                      >
                        {{ capitalizeFirstLetter(order.paymentStatus) }}
                      </span>
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-3 py-1 text-xs font-semibold rounded-full"
                      :class="getStatusClass(order.status)"
                    >
                      {{ capitalizeFirstLetter(order.status) }}
                    </span>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="flex justify-end space-x-2">
                      <button
                        @click.stop="viewOrder(order)"
                        class="p-2 text-violet-600 hover:text-violet-900 hover:bg-violet-50 rounded-lg transition-all duration-200"
                        title="View Details"
                      >
                        <Eye class="h-4 w-4" />
                      </button>

                      <button
                        @click.stop="updateOrderStatus(order)"
                        class="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Update Status"
                      >
                        <RefreshCw class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->

          <div class="mt-6 p-4">
      <CorePagination 
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        :total="pagination.total"
        :limit="pagination.limit"
        @page-change="handlePageChange"
      />
    </div>
        </div>
      </div>

    </div>

    <!-- Order Details Side Drawer -->

    <OrderDetailsSideDrawer
      :order="selectedOrder"
      :is-open="!!selectedOrder"
      @close="closeOrderDetails"
      @update-status="updateOrderStatus"
    />

    <!-- Update Status Modal -->

    <UpdateStatusModal
      :order="orderToUpdate"
      :is-open="isUpdateStatusModalOpen"
      @close="isUpdateStatusModalOpen = false"
      @updated="handleStatusUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

import { useFetchAllOrders } from "@/composables/modules/orders/useFetchAllOrders";

import {
  Search,
  Download,
  Eye,
  RefreshCw,
  PackageX,
  ShoppingBag,
  CreditCard,
  DollarSign,
  BarChart3,
  TrendingUp,
} from "lucide-vue-next";

import { definePageMeta } from "#imports";

// Types

interface InstallmentInfo {
  isInstallment: boolean;

  numberOfInstallments: number;

  downPayment: number;

  installmentAmount: number;

  interestRate: number;

  totalPayable: number;

  totalInterest: number;

  remainingAmount: number;

  paymentFrequency: string;

  paymentMethod: string;
}

interface Customer {
  _id: string;

  firstName: string;

  lastName: string;

  email: string;

  fullName: string;

  id: string;
}

interface OrderItem {
  product: string;

  quantity: number;

  price: number;

  size?: string;

  color?: string;

  discount: number;

  total: number;
}

interface Order {
  _id: string;

  orderNumber: string;

  customer: Customer;

  items: OrderItem[];

  subtotal: number;

  tax: number;

  taxRate: number;

  shipping: number;

  discount: number;

  total: number;

  status: string;

  paymentStatus: string;

  paymentType: string;

  installmentInfo?: InstallmentInfo;

  paidAmount?: number;

  remainingBalance?: number;

  isFullyPaid: boolean;

  isOverdue: boolean;

  createdAt: string;

  updatedAt: string;

  age: number;

  id: string;
}

// Composables

const { orders, loading,
  pagination,
  changePage } = useFetchAllOrders();

// State

const searchQuery = ref("");

const selectedOrder = ref<Order | null>(null);

const orderToUpdate = ref<Order | null>(null);

const isUpdateStatusModalOpen = ref(false);

const currentPage = ref(1);

const itemsPerPage = ref(10);

const filters = ref({
  status: "all",

  paymentType: "all",

  paymentStatus: "all",

  dateRange: "all",
});

// Computed

const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    // Search filter

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();

      if (
        !order.orderNumber.toLowerCase().includes(query) &&
        !order.customer.fullName.toLowerCase().includes(query) &&
        !order.customer.email.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Status filter

    if (
      filters.value.status !== "all" &&
      order.status !== filters.value.status
    ) {
      return false;
    }

    // Payment type filter

    if (
      filters.value.paymentType !== "all" &&
      order.paymentType !== filters.value.paymentType
    ) {
      return false;
    }

    // Payment status filter

    if (
      filters.value.paymentStatus !== "all" &&
      order.paymentStatus !== filters.value.paymentStatus
    ) {
      return false;
    }

    // Date range filter

    if (filters.value.dateRange !== "all") {
      const orderDate = new Date(order.createdAt);

      const now = new Date();

      switch (filters.value.dateRange) {
        case "today":
          if (orderDate.toDateString() !== now.toDateString()) return false;

          break;

        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

          if (orderDate < weekAgo) return false;

          break;

        case "month":
          if (
            orderDate.getMonth() !== now.getMonth() ||
            orderDate.getFullYear() !== now.getFullYear()
          )
            return false;

          break;

        case "year":
          if (orderDate.getFullYear() !== now.getFullYear()) return false;

          break;
      }
    }

    return true;
  });
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;

  const end = start + itemsPerPage.value;

  return filteredOrders.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(filteredOrders.value.length / itemsPerPage.value)
);

const paginationStart = computed(() => {
  if (filteredOrders.value.length === 0) return 0;

  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const paginationEnd = computed(() => {
  if (filteredOrders.value.length === 0) return 0;

  return Math.min(
    currentPage.value * itemsPerPage.value,
    filteredOrders.value.length
  );
});

const orderStats = computed(() => {
  const totalOrders = orders.value.length;

  const installmentOrders = orders.value.filter(
    (o) => o.paymentType === "installment"
  ).length;

  const outstandingBalance = orders.value

    .filter((o) => o.paymentType === "installment" && !o.isFullyPaid)

    .reduce((sum, o) => sum + (o.remainingBalance || 0), 0);

  const overdueCount = orders.value.filter((o) => o.isOverdue).length;

  const currentMonth = new Date().getMonth();

  const currentYear = new Date().getFullYear();

  const monthlyRevenue = orders.value

    .filter((o) => {
      const orderDate = new Date(o.createdAt);

      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    })

    .reduce((sum, o) => sum + (o.paidAmount || o.total), 0);

  return {
    totalOrders,

    installmentOrders,

    outstandingBalance,

    overdueCount,

    monthlyRevenue,
  };
});

// Methods

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",

    month: "short",

    day: "numeric",

    hour: "2-digit",

    minute: "2-digit",
  }).format(new Date(dateString));
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US").format(amount);
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).replace("_", " ");
};

const getStatusClass = (status: string) => {
  const classes = {
    pending: "bg-yellow-100 text-yellow-800",

    processing: "bg-blue-100 text-blue-800",

    shipped: "bg-indigo-100 text-indigo-800",

    delivered: "bg-green-100 text-green-800",

    cancelled: "bg-red-100 text-red-800",
  };

  return classes[status as keyof typeof classes] || "bg-gray-100 text-gray-800";
};

const getPaymentStatusClass = (status: string) => {
  const classes = {
    paid: "bg-green-100 text-green-800",

    partially_paid: "bg-orange-100 text-orange-800",

    pending: "bg-yellow-100 text-yellow-800",

    overdue: "bg-red-100 text-red-800",
  };

  return classes[status as keyof typeof classes] || "bg-gray-100 text-gray-800";
};

const viewOrder = (order: Order) => {
  selectedOrder.value = order;
};

const closeOrderDetails = () => {
  selectedOrder.value = null;
};

const updateOrderStatus = (order: Order) => {
  orderToUpdate.value = order;

  isUpdateStatusModalOpen.value = true;
};

const handleStatusUpdated = () => {
  isUpdateStatusModalOpen.value = false;

  orderToUpdate.value = null;
};

const resetFilters = () => {
  filters.value = {
    status: "all",

    paymentType: "all",

    paymentStatus: "all",

    dateRange: "all",
  };

  searchQuery.value = "";

  currentPage.value = 1;
};

const exportOrders = () => {
  // Implementation for exporting orders

  console.log("Exporting orders...");
};


// Watch for filter changes

watch(
  [filters, searchQuery],
  () => {
    currentPage.value = 1;
  },
  { deep: true }
);

// Page meta

definePageMeta({
  layout: "dashboard",
});


const handlePageChange = async (page: number) => {
  console.log('cloed')
  await changePage(page)
}

</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;

  opacity: 0;
}

.animate-slide-in-right {
  animation: slideInRight 0.6s ease-out forwards;

  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;

    transform: translateY(20px);
  }

  to {
    opacity: 1;

    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;

    transform: translateX(30px);
  }

  to {
    opacity: 1;

    transform: translateX(0);
  }
}

/* Custom scrollbar */

::-webkit-scrollbar {
  width: 6px;

  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;

  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;

  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
