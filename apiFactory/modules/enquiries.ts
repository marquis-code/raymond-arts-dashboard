import { GATEWAY_ENDPOINT } from "../axios.config";

export const enquiry_api = {
  // Create a new enquiry
  $_create_enquiry(data: any) {
    return GATEWAY_ENDPOINT.post("/enquiries", data);
  },

  // Fetch paginated enquiries with optional filters
  $_fetch_enquiries(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    return GATEWAY_ENDPOINT.get("/enquiries", { params });
  },

  // Get an enquiry by ID
  $_get_enquiry_by_id(id: string) {
    return GATEWAY_ENDPOINT.get(`/enquiries/${id}`);
  },

  // Update an enquiry
  $_update_enquiry(id: string, data: any) {
    return GATEWAY_ENDPOINT.patch(`/enquiries/${id}`, data);
  },

  // Delete an enquiry
  $_delete_enquiry(id: string) {
    return GATEWAY_ENDPOINT.delete(`/enquiries/${id}`);
  },

  // Update enquiry status
  $_update_enquiry_status(id: string, data: { status: string; adminNotes?: string }) {
    return GATEWAY_ENDPOINT.patch(`/enquiries/${id}/status`, data);
  }
};
