import { GATEWAY_ENDPOINT } from "../axios.config";

export const notifications_api = {
  $_create_notification(data: any) {
    return GATEWAY_ENDPOINT.post("/notifications", data);
  },
  
  $_fetch_all_notifications() {
    return GATEWAY_ENDPOINT.get("/notifications");
  },
  
  $_fetch_my_notifications(pagination: any) {
    return GATEWAY_ENDPOINT.get("/notifications/my-notifications", { params: pagination });
  },
  
  $_fetch_admin_notifications(pagination: any) {
    return GATEWAY_ENDPOINT.get("/notifications/admin", { params: pagination });
  },
  
  $_get_unread_count() {
    return GATEWAY_ENDPOINT.get("/notifications/unread-count");
  },
  
  $_fetch_notification_by_id(id: string) {
    return GATEWAY_ENDPOINT.get(`/notifications/${id}`);
  },
  
  $_update_notification(id: string, data: any) {
    return GATEWAY_ENDPOINT.patch(`/notifications/${id}`, data);
  },
  
  $_mark_as_read(id: string) {
    return GATEWAY_ENDPOINT.patch(`/notifications/${id}/mark-as-read`);
  },
  
  $_mark_all_as_read() {
    return GATEWAY_ENDPOINT.patch("/notifications/mark-all-as-read");
  },
  
  $_remove_notification(id: string) {
    return GATEWAY_ENDPOINT.delete(`/notifications/${id}`);
  }
};