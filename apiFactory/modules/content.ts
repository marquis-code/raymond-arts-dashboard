import { GATEWAY_ENDPOINT } from "../axios.config"

export interface ContentType {
  HOME_HERO: "home_hero"
  PORTRAIT_HERO: "portrait_hero"
  GALLERY_HERO: "gallery_hero"
  SHOP_PRINTS_HERO: "shop_prints_hero"
  COMMISSION_HERO: "commission_hero"
  COMMISSION_INFO: "commission_info"
  CONTACT_INFO: "contact_info"
  ABOUT_SECTION: "about_section"
}

export interface ContentStatus {
  ACTIVE: "active"
  INACTIVE: "inactive"
  DRAFT: "draft"
}

export interface CreateContentDto {
  type: string
  title: string
  description?: string
  images?: string[]
  metadata?: any
  status?: string
}

export interface UpdateContentDto {
  title?: string
  description?: string
  images?: string[]
  metadata?: any
  status?: string
}

export const content_api = {
  $_create_content(data: CreateContentDto) {
    return GATEWAY_ENDPOINT.post("/content", data)
  },

  $_fetch_all_contents(params?: {
    type?: string
    status?: string
    page?: number
    limit?: number
  }) {
    return GATEWAY_ENDPOINT.get("/content", { params })
  },

  $_fetch_public_contents(type?: string) {
    const params = type ? { type } : {}
    return GATEWAY_ENDPOINT.get("/content/public", { params })
  },

  $_get_content_by_type(type: string) {
    return GATEWAY_ENDPOINT.get(`/content/type/${type}`)
  },

  $_get_content_by_id(id: string) {
    return GATEWAY_ENDPOINT.get(`/content/${id}`)
  },

  $_update_content(id: string, data: UpdateContentDto) {
    return GATEWAY_ENDPOINT.patch(`/content/${id}`, data)
  },

  $_update_content_status(id: string, status: string) {
    return GATEWAY_ENDPOINT.patch(`/content/${id}/status`, { status })
  },

  $_delete_content(id: string) {
    return GATEWAY_ENDPOINT.delete(`/content/${id}`)
  },

  $_seed_default_content() {
    return GATEWAY_ENDPOINT.post("/content/seed")
  }
}
