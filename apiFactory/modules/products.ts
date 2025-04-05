import { axiosInstance } from "../axios.config";

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
  $_create_product(data: CreateParoductDto) {
    return axiosInstance.post("/products", data);
  },
  $_fetch_products(metadata: PaginationDTO) {
    return axiosInstance.get(`/products?page=${metadata.page}&limit=${metadata.limit}&sort=${metadata.sort}&order=${metadata.order}&search=${metadata.search}`);
  },
  $_fetch_featured_products(metadata: { limit: number }) {
    return axiosInstance.get(`/products/featured?limit=${metadata.limit}`);
  },
  $_get_new_products(metadata: { limit: number }) {
    return axiosInstance.get(`/products/new?limit=${metadata.limit}`);
  },
  $_get_new_best_seller_products(metadata: { limit: number }) {
    return axiosInstance.get(`/products/bestsellers?limit=${metadata.limit}`);
  },
  $_search_product(metadata: PaginationDTO) {
    return axiosInstance.get(`/products/search?page=${metadata.page}&limit=${metadata.limit}&sort=${metadata.sort}&order=${metadata.order}&q=${metadata.search}`);
  },
  $_get_product_by_category(id: string) {
    return axiosInstance.post(`/products/category/${id}`);
  },
  $_update_product(id: string, payload: CreateParoductDto) {
    return axiosInstance.patch(`/products/${id}`, payload);
  },
  $_delete_product(id: string) {
    return axiosInstance.delete(`/products/${id}`);
  },
  $_get_product_by_id(id: string) {
    return axiosInstance.post(`/products/${id}`);
  },
  $_upload_product_image(id: string) {
    return axiosInstance.post(`/products/${id}/images`);
  },
  $_remove_product_image(id: string) {
    return axiosInstance.delete(`/products/${id}/images`);
  },
  $_create_product_category(data: CategoryDTO) {
    return axiosInstance.post("/products/categories", data);
  },
  $_get_categories () {
    return axiosInstance.get("/products/categories");
  },
  $_update_category(id: string, payload: CategoryDTO) {
    return axiosInstance.patch(`/products/categories/${id}`, payload);
  },
  $_delete_category(id: string) {
    return axiosInstance.delete(`/products/categories/${id}`);
  },
  $_get_category_by_id(id: string) {
    return axiosInstance.get(`/products/categories/${id}`);
  },
  $_upload_category_image(id: string) {
    return axiosInstance.post(`/products/categories/${id}/image`);
  },
};
