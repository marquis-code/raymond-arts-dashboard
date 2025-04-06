import { GATEWAY_ENDPOINT } from "../axios.config";

export const contact_api = {
  $_create_contact(data: any) {
    return GATEWAY_ENDPOINT.post("/contacts", data);
  },
  $_fetch_contacts() {
    return GATEWAY_ENDPOINT.get("/contacts");
  },
  $_get_current_contact() {
    return GATEWAY_ENDPOINT.get("/contacts/my-contacts");
  },
  $_get_tgs() {
    return GATEWAY_ENDPOINT.get("/contacts/tgs");
  },
  $_get_contact_by_tag(id: string) {
    return GATEWAY_ENDPOINT.post(`/contacts/tag/${id}`);
  },
  $_get_contact_by_id(id: string) {
    return GATEWAY_ENDPOINT.post(`/contacts/${id}`);
  },
  $_update_contact(id: string) {
    return GATEWAY_ENDPOINT.patch(`/contacts/${id}`);
  },
  $_delete_contact(id: string) {
    return GATEWAY_ENDPOINT.delete(`/contacts/${id}`);
  },
  $_add_contact_interraction(id: string) {
    return GATEWAY_ENDPOINT.post(`/contacts/${id}/interactions`);
  }
};
