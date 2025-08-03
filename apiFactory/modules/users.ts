import { GATEWAY_ENDPOINT } from "../axios.config";

export const users_api = {  
  $_fetch_all_users() {
    return GATEWAY_ENDPOINT.get("/users");
  },
  
  $_find_user_by_id(id: string) {
    return GATEWAY_ENDPOINT.get(`/users/${id}`);
  },
  $_deactivate_user(id: string, payload: any) {
    return GATEWAY_ENDPOINT.post(`/users/${id}`,payload);
  },
  $_activate_user(id: string, payload: any) {
    return GATEWAY_ENDPOINT.post(`/users/${id}/activate`, payload)
  }
};