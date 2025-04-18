import { GATEWAY_ENDPOINT } from "../axios.config";

export const audit_api = {  
  $_fetch_all_audits_logs() {
    return GATEWAY_ENDPOINT.get("/audit");
  },
      
  $_fetch_user_audit_logs(userId: string) {
    return GATEWAY_ENDPOINT.get(`/audit/user/${userId}`);
  },
  
  $_fetch_module_audit_logs(moduleId: string) {
    return GATEWAY_ENDPOINT.patch(`/audit/module/${moduleId}`);
  },
  
};