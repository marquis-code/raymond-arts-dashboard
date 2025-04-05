import { axiosInstance } from "../axios.config";

export const contact_api = {
  $_create_contact(data: any) {
    return axiosInstance.post("/contacts", data);
  },
  $_fetch_contacts() {
    return axiosInstance.get("/contacts");
  },
  $_get_current_contact() {
    return axiosInstance.get("/contacts/my-contacts");
  },
  $_get_tgs() {
    return axiosInstance.get("/contacts/tgs");
  },
  $_get_contact_by_tag(id: string) {
    return axiosInstance.post(`/contacts/tag/${id}`);
  },
  $_get_contact_by_id(id: string) {
    return axiosInstance.post(`/contacts/${id}`);
  },
  $_update_contact(id: string) {
    return axiosInstance.patch(`/contacts/${id}`);
  },
  $_delete_contact(id: string) {
    return axiosInstance.delete(`/contacts/${id}`);
  },
  $_add_contact_interraction(id: string) {
    return axiosInstance.post(`/contacts/${id}/interactions`);
  }
};
