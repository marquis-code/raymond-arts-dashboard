import { GATEWAY_ENDPOINT } from "../axios.config";

interface OrdersParams {
  page?: number
  limit?: number
}

export const orders_api = {
  $_create_order(data: any) {
    return GATEWAY_ENDPOINT.post("/orders", data);
  },
  
  $_fetch_all_orders(params: OrdersParams = {}) {
    const {
      page = 1,
      limit = 10
    } = params

       // Build query parameters object, only including defined values
       const queryParams: Record<string, string | number> = {
        page,
        limit,
      }

          // Convert to URL search params
    const searchParams = new URLSearchParams()
    Object.entries(queryParams).forEach(([key, value]) => {
      searchParams.append(key, String(value))
    })

    return GATEWAY_ENDPOINT.get(`/orders?${searchParams.toString()}`);
  },
  
  $_fetch_my_orders(pagination: any) {
    return GATEWAY_ENDPOINT.get("/orders/my-orders", { params: pagination });
  },
  
  $_get_order_statistics() {
    return GATEWAY_ENDPOINT.get("/orders/statistics");
  },
  
  $_get_recent_orders(limit?: number) {
    return GATEWAY_ENDPOINT.get("/orders/recent", { 
      params: limit ? { limit } : {} 
    });
  },
  
  $_find_by_order_number(orderNumber: string) {
    return GATEWAY_ENDPOINT.get(`/orders/number/${orderNumber}`);
  },
  
  $_find_order_by_id(id: string) {
    return GATEWAY_ENDPOINT.get(`/orders/${id}`);
  },
  
  $_update_order_status(id: string, data: any) {
    return GATEWAY_ENDPOINT.patch(`/orders/${id}/status`, data);
  }
};