import { GATEWAY_ENDPOINT } from "../axios.config"

export const originals_api = {
  $_create_original(data: any) {
    return GATEWAY_ENDPOINT.post("/originals", data)
  },

  $_fetch_originals() {
    return GATEWAY_ENDPOINT.get("/originals")
  },

  $_get_original_by_id(id: string) {
    return GATEWAY_ENDPOINT.get(`/originals/${id}`)
  },

  $_update_original(id: string, data: any) {
    return GATEWAY_ENDPOINT.patch(`/originals/${id}`, data)
  },

  $_delete_original(id: string) {
    return GATEWAY_ENDPOINT.delete(`/originals/${id}`)
  },

  $_reorder_originals(data: { orderedOriginals: string[] }) {
    return GATEWAY_ENDPOINT.patch("/originals/reorder", data)
  },
}
