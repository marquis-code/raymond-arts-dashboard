import { GATEWAY_ENDPOINT } from "../axios.config"

export const promosale_api = {
  $_create_promosale(data: any) {
    return GATEWAY_ENDPOINT.post("/promosales", data);
  },
  $_fetch_promosales() {
    return GATEWAY_ENDPOINT.get("/promosales");
  },
  $_fetch_currently_active_promosale() {
    return GATEWAY_ENDPOINT.get("/promosales/active");
  },
  $_fetch_promosales_by_id(id: string) {
    return GATEWAY_ENDPOINT.get(`/promosales/${id}`);
  },
  // $_fetch_promosales_by_id(id: string) {
  //   return GATEWAY_ENDPOINT.get(`/promosales/${id}`);
  // },
  $_update_promosale(id: string, payload: any) {
    return GATEWAY_ENDPOINT.patch(`/promosales/${id}`, payload);
  },
  $_delete_promosale(id: string) {
    return GATEWAY_ENDPOINT.delete(`/promosales/${id}`);
  },
  $_activate_promosale(id: string) {
    return GATEWAY_ENDPOINT.patch(`/promosales/${id}/activate`);
  },
  $_deactivate_promosale(id: string, payload: any) {
    return GATEWAY_ENDPOINT.patch(`/promosales/${id}/deactivate`);
  },
};