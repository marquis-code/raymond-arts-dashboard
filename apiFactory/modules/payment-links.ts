import { GATEWAY_ENDPOINT } from "../axios.config";

export const payment_links_api = {
  $_create_payment_link(data: any) {
    return GATEWAY_ENDPOINT.post("/payment-links", data);
  },
  
  $_fetch_all_payment_links() {
    return GATEWAY_ENDPOINT.get("/payment-links");
  },
  
  $_fetch_my_payment_links(pagination: any) {
    return GATEWAY_ENDPOINT.get("/payment-links/my-links", { params: pagination });
  },
  
  $_fetch_payment_link_by_link_id(linkId: string) {
    return GATEWAY_ENDPOINT.get(`/payment-links/link/${linkId}`);
  },
  
  $_fetch_payment_link_by_id(id: string) {
    return GATEWAY_ENDPOINT.get(`/payment-links/${id}`);
  },
  
  $_update_payment_link(id: string, data: any) {
    return GATEWAY_ENDPOINT.patch(`/payment-links/${id}`, data);
  },
  
  $_update_payment_link_status(id: string, status: any) {
    return GATEWAY_ENDPOINT.patch(`/payment-links/${id}/status/${status}`);
  },
  
  $_remove_payment_link(id: string) {
    return GATEWAY_ENDPOINT.delete(`/payment-links/${id}`);
  },
  
  $_use_payment_link(data: any) {
    return GATEWAY_ENDPOINT.post("/payment-links/use", data);
  }
};