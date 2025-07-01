import { ref, onMounted, readonly, watch } from "vue"
import { orders_api } from "@/apiFactory/modules/orders";
import { type PaginationData } from "@/types/pagination";

export const useFetchAllOrders = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const orders = ref<any[]>([]);

  const pagination = ref<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchAllOrders = async (page = 1, limit = 10) => {
    loading.value = true;
    error.value = null;
    // Build the parameters object for the API call
    const params = {
      page,
      limit,
    };

    // Remove empty/undefined values to keep the API call clean
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    try {
      const response = await orders_api.$_fetch_all_orders(cleanParams);
      console.log(response, "orders response");
      orders.value = response.data.data;
      pagination.value = {
        page: response?.data?.meta?.page || 1,
        limit: response?.data?.meta?.limit || 10,
        total: response?.data?.meta?.total || 0,
        totalPages: response?.data?.meta?.totalPages || 1,
      }
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to fetch orders";
    } finally {
      loading.value = false;
    }
  };

  const changePage = async (page: number) => {
    pagination.value.page = page
    await fetchAllOrders(page, pagination.value.limit)
  }

  const changeLimit = async (limit: number) => {
    pagination.value.page = 1
    pagination.value.limit = limit
    await fetchAllOrders(1, limit)
  }

  onMounted(() => {
    fetchAllOrders();
  });

  return {
    loading,
    error,
    orders,
    fetchAllOrders,
    pagination: readonly(pagination),
    changePage,
    changeLimit,
  };
};
