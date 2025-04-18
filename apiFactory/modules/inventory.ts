import { GATEWAY_ENDPOINT } from "../axios.config";

export const inventory_api = {
  $_create_inventory(data: any) {
    return GATEWAY_ENDPOINT.post("/inventory", data);
  },
  
  $_fetch_all_inventory() {
    return GATEWAY_ENDPOINT.get("/inventory");
  },
  
  $_fetch_low_stock(threshold?: number) {
    return GATEWAY_ENDPOINT.get("/inventory/low-stock", { 
      params: threshold ? { threshold } : {} 
    });
  },
  
  $_fetch_out_of_stock() {
    return GATEWAY_ENDPOINT.get("/inventory/out-of-stock");
  },
  
  $_fetch_inventory_by_product(productId: string) {
    return GATEWAY_ENDPOINT.get(`/inventory/${productId}`);
  },
  
  $_update_inventory(productId: string, data: any) {
    return GATEWAY_ENDPOINT.patch(`/inventory/${productId}`, data);
  },
  
  $_add_inventory_history(productId: string, historyData: any) {
    return GATEWAY_ENDPOINT.post(`/inventory/${productId}/history`, historyData);
  }
};