import { GATEWAY_ENDPOINT } from "../axios.config";

export const invoices_api = {
  $_create_invoice(data: any) {
    return GATEWAY_ENDPOINT.post("/invoices", data);
  },
  
  $_fetch_all_invoices() {
    return GATEWAY_ENDPOINT.get("/invoices");
  },
  
  $_fetch_my_invoices(pagination: any) {
    return GATEWAY_ENDPOINT.get("/invoices/my-invoices", { params: pagination });
  },
  
  $_find_by_invoice_number(invoiceNumber: string) {
    return GATEWAY_ENDPOINT.get(`/invoices/number/${invoiceNumber}`);
  },
  
  $_find_invoice_by_id(id: string) {
    return GATEWAY_ENDPOINT.get(`/invoices/${id}`);
  },
  
  $_update_invoice(id: string, data: any) {
    return GATEWAY_ENDPOINT.patch(`/invoices/${id}`, data);
  },
  
  $_update_invoice_status(id: string, status: any) {
    return GATEWAY_ENDPOINT.patch(`/invoices/${id}/status/${status}`);
  },
  
  $_delete_invoice(id: string) {
    return GATEWAY_ENDPOINT.delete(`/invoices/${id}`);
  }
};