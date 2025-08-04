import { GATEWAY_ENDPOINT } from "../axios.config";

interface PaginationDTO {
    page: number
    limit: number
    sort: string
    order: string
    search: string
}

interface CategoryDTO {
    name: string
    description?: string
    image?: string
    parent?: string
    isActive?: boolean
    order?: number
}

interface CreateParoductDto {
    name: string
    descrption: string
    price: number
    discountPrice?: number
    images?: string[]
    category?: string
    isAvailable?: boolean
    weight?: number
    height?: number
    length?: number
    tags?: string[]
    attributes?: Record<string, any>
    relatedProducts?: string[]
    isFeatured?: boolean
    isNew?: boolean
    isBestseller?: boolean
}

export const product_api = {
  $_create_product(data: CreateParoductDto | any) {
    return GATEWAY_ENDPOINT.post("/products", data);
  },
  $_fetch_products(metadata: { page: 1, limit: 10000000 }) {
    // return GATEWAY_ENDPOINT.get(`/products?page=${metadata.page}&limit=${metadata.limit}&sort=${metadata.sort}&order=${metadata.order}&search=${metadata.search}`);
    return GATEWAY_ENDPOINT.get(`/products?page=1&limit=10000000`);
  },
  $_fetch_featured_products(metadata: { limit: number }) {
    return GATEWAY_ENDPOINT.get(`/products/featured?limit=${metadata.limit}`);
  },
  $_get_new_products(metadata: { limit: number }) {
    return GATEWAY_ENDPOINT.get(`/products/new?limit=${metadata.limit}`);
  },
  $_get_new_best_seller_products(metadata: { limit: number }) {
    return GATEWAY_ENDPOINT.get(`/products/bestsellers?limit=${metadata.limit}`);
  },
  $_search_product(metadata: PaginationDTO) {
    return GATEWAY_ENDPOINT.get(`/products/search?page=${metadata.page}&limit=${metadata.limit}&sort=${metadata.sort}&order=${metadata.order}&q=${metadata.search}`);
  },
  $_get_product_by_category(id: string) {
    return GATEWAY_ENDPOINT.post(`/products/category/${id}`);
  },
  $_update_product(id: string, payload: CreateParoductDto) {
    return GATEWAY_ENDPOINT.patch(`/products/${id}`, payload);
  },
  $_delete_product(id: string) {
    return GATEWAY_ENDPOINT.delete(`/products/${id}`);
  },
  $_get_product_by_id(id: string) {
    return GATEWAY_ENDPOINT.get(`/products/${id}`);
  },
  $_upload_product_image(id: string) {
    return GATEWAY_ENDPOINT.post(`/products/${id}/images`);
  },
  $_remove_product_image(id: string) {
    return GATEWAY_ENDPOINT.delete(`/products/${id}/images`);
  },
  $_create_product_category(data: CategoryDTO) {
    return GATEWAY_ENDPOINT.post("/products/categories", data);
  },
  $_get_categories () {
    return GATEWAY_ENDPOINT.get("/products/categories");
  },
  $_update_category(id: string, payload: CategoryDTO) {
    return GATEWAY_ENDPOINT.patch(`/products/categories/${id}`, payload);
  },
  $_delete_category(id: string) {
    return GATEWAY_ENDPOINT.delete(`/products/categories/${id}`);
  },
  $_get_category_by_id(id: string) {
    return GATEWAY_ENDPOINT.get(`/products/categories/${id}`);
  },
  $_upload_category_image(id: string) {
    return GATEWAY_ENDPOINT.post(`/products/categories/${id}/image`);
  },
  $_reorder_products(data: { orderedProducts: string[] }) {
    return GATEWAY_ENDPOINT.patch("/products/reorder", data)
  },
};
