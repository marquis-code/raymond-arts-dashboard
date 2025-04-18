import { GATEWAY_ENDPOINT } from "../axios.config";

export const sales_api = {
  $_create_sale(data: any) {
    return GATEWAY_ENDPOINT.post("/sales", data);
  },
  
  $_fetch_all_sales(pagination: any) {
    return GATEWAY_ENDPOINT.get("/sales", { params: pagination });
  },
  
  $_get_sales_statistics() {
    return GATEWAY_ENDPOINT.get("/sales/statistics");
  },
  
  $_get_top_products(limit?: number) {
    return GATEWAY_ENDPOINT.get("/sales/top-products", { 
      params: limit ? { limit } : {} 
    });
  },
  
  $_get_top_customers(limit?: number) {
    return GATEWAY_ENDPOINT.get("/sales/top-customers", { 
      params: limit ? { limit } : {} 
    });
  },
  
  $_find_sales_by_customer(customerId: string, pagination: any) {
    return GATEWAY_ENDPOINT.get(`/sales/customer/${customerId}`, { 
      params: pagination 
    });
  },
  
  $_find_sale_by_id(id: string) {
    return GATEWAY_ENDPOINT.get(`/sales/${id}`);
  },
  
  $_update_sale(id: string, data: any) {
    return GATEWAY_ENDPOINT.patch(`/sales/${id}`, data);
  },
  
  $_delete_sale(id: string) {
    return GATEWAY_ENDPOINT.delete(`/sales/${id}`);
  }
};