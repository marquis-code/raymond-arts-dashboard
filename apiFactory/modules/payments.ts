import { GATEWAY_ENDPOINT } from "../axios.config";

export const payments_api = {
  $_process_payment(data: any) {
    return GATEWAY_ENDPOINT.post("/payments/process", data);
  },
  
  $_verify_payment(data: any) {
    return GATEWAY_ENDPOINT.post("/payments/verify", data);
  },
  
  $_handle_flutterwave_webhook(data: any) {
    return GATEWAY_ENDPOINT.post("/payments/webhook/flutterwave", data);
  },
  $_fetch_payments() {
    return GATEWAY_ENDPOINT.get("/payments");
  },
};