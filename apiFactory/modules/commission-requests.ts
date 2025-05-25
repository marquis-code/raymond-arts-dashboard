// src/api/commission-request.api.ts
import { GATEWAY_ENDPOINT } from "../axios.config";

export const commission_request_api = {
  // Create a new commission request
  $_create_commission_request(data: FormData) {
    return GATEWAY_ENDPOINT.post("/commission-requests", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Fetch all commission requests with pagination
  $_fetch_commission_requests(page = 1, limit = 10) {
    return GATEWAY_ENDPOINT.get("/commission-requests", {
      params: { page, limit },
    });
  },

  // Fetch a commission request by ID
  $_get_commission_request(id: string) {
    return GATEWAY_ENDPOINT.get(`/commission-requests/${id}`);
  },

  // Fetch commission requests by status
  $_get_commission_requests_by_status(status: string) {
    return GATEWAY_ENDPOINT.get(`/commission-requests/status/${status}`);
  },

  // Fetch commission requests by email
  $_get_commission_requests_by_email(email: string) {
    return GATEWAY_ENDPOINT.get(`/commission-requests/email/${email}`);
  },

  // Update a commission request
  $_update_commission_request(id: string, data: any) {
    return GATEWAY_ENDPOINT.patch(`/commission-requests/${id}`, data);
  },

  // Delete a commission request
  $_delete_commission_request(id: string) {
    return GATEWAY_ENDPOINT.delete(`/commission-requests/${id}`);
  },
};
