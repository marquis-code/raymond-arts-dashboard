import { GATEWAY_ENDPOINT } from "../axios.config"

export const drawing_type_api = {
  // Create a new drawing type
  $_create_drawing_type(data: any) {
    return GATEWAY_ENDPOINT.post("/drawing-types", data)
  },

  // Get all drawing types
  $_get_drawing_types() {
    return GATEWAY_ENDPOINT.get("/drawing-types")
  },

  // Get a specific drawing type by ID
  $_get_drawing_type(id: string) {
    return GATEWAY_ENDPOINT.get(`/drawing-types/${id}`)
  },

  // Update a specific drawing type by ID
  $_update_drawing_type(id: string, data: any) {
    return GATEWAY_ENDPOINT.patch(`/drawing-types/${id}`, data)
  },

  // Delete a specific drawing type by ID
  $_delete_drawing_type(id: string) {
    return GATEWAY_ENDPOINT.delete(`/drawing-types/${id}`)
  },

  // Seed default drawing types
  $_seed_drawing_types() {
    return GATEWAY_ENDPOINT.post("/drawing-types/seed")
  }
}
