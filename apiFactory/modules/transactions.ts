import { GATEWAY_ENDPOINT } from "../axios.config";

export const transactions_api = {
  $_create_transaction(data: any) {
    return GATEWAY_ENDPOINT.post("/transactions", data);
  },
  
  $_fetch_all_transactions(pagination: any) {
    return GATEWAY_ENDPOINT.get("/transactions", { params: pagination });
  },
  
  $_fetch_my_transactions(pagination: any) {
    return GATEWAY_ENDPOINT.get("/transactions/my-transactions", { params: pagination });
  },
  
  $_get_transaction_statistics() {
    return GATEWAY_ENDPOINT.get("/transactions/statistics");
  },
  
  $_find_transaction_by_id(id: string) {
    return GATEWAY_ENDPOINT.get(`/transactions/${id}`);
  },
  
  $_find_by_transaction_id(transactionId: string) {
    return GATEWAY_ENDPOINT.get(`/transactions/transaction-id/${transactionId}`);
  },
  
  $_update_transaction(id: string, data: any) {
    return GATEWAY_ENDPOINT.patch(`/transactions/${id}`, data);
  },
  
  $_update_transaction_status(id: string, status: any) {
    return GATEWAY_ENDPOINT.patch(`/transactions/${id}/status/${status}`);
  },
  
  $_delete_transaction(id: string) {
    return GATEWAY_ENDPOINT.delete(`/transactions/${id}`);
  }
};