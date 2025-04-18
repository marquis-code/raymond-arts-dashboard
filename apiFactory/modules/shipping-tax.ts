import { GATEWAY_ENDPOINT } from "../axios.config";

export const shipping_tax_api = {
  $_create_shipping_config(data: any) {
    return GATEWAY_ENDPOINT.post("/shipping-tax/shipping", data);
  },
  
  $_create_tax_config(data: any) {
    return GATEWAY_ENDPOINT.post("/shipping-tax/tax", data);
  },
  
  $_get_all_shipping_configs() {
    return GATEWAY_ENDPOINT.get("/shipping-tax/shipping");
  },
  
  $_get_all_tax_configs() {
    return GATEWAY_ENDPOINT.get("/shipping-tax/tax");
  },
  
  $_update_shipping_config(id: string, data: Partial<any>) {
    return GATEWAY_ENDPOINT.patch(`/shipping-tax/shipping/${id}`, data);
  },
  
  $_update_tax_config(id: string, data: Partial<any>) {
    return GATEWAY_ENDPOINT.patch(`/shipping-tax/tax/${id}`, data);
  },
  
  $_delete_shipping_config(id: string) {
    return GATEWAY_ENDPOINT.delete(`/shipping-tax/shipping/${id}`);
  },
  
  $_delete_tax_config(id: string) {
    return GATEWAY_ENDPOINT.delete(`/shipping-tax/tax/${id}`);
  }
};