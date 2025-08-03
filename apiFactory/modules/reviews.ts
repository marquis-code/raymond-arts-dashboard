import { GATEWAY_ENDPOINT } from "../axios.config";

export const review_api = {
  // Create a new review
  $_create_review(data: any) {
    return GATEWAY_ENDPOINT.post("/reviews", data);
  },

  // Get all reviews (Admin only)
  $_get_all_reviews(page: number = 1, limit: number = 10) {
    return GATEWAY_ENDPOINT.get(`/reviews?page=${page}&limit=${limit}`);
  },

  // Get reviews for a product
  $_get_reviews_by_product(productId: string, page: number = 1, limit: number = 10, includeAll: string = "") {
    return GATEWAY_ENDPOINT.get(`/reviews/product/${productId}?page=${page}&limit=${limit}&includeAll=${includeAll}`);
  },

  // Get review statistics for a product
  $_get_review_stats(productId: string) {
    return GATEWAY_ENDPOINT.get(`/reviews/product/${productId}/stats`);
  },

  // Get pending reviews (Admin only)
  $_get_pending_reviews(page: number = 1, limit: number = 10) {
    return GATEWAY_ENDPOINT.get(`/reviews/pending?page=${page}&limit=${limit}`);
  },

  // Get current user's reviews
  $_get_user_reviews(page: number = 1, limit: number = 10) {
    return GATEWAY_ENDPOINT.get(`/reviews/user/my-reviews?page=${page}&limit=${limit}`);
  },

  // Reject a review (admin only)
  $_reject_review(id: string, rejectionReason: string) {
    return GATEWAY_ENDPOINT.patch(`/reviews/${id}/reject`, { rejectionReason });
  },

    // Reject a review (admin only)
    $_approve_review(id: string) {
      return GATEWAY_ENDPOINT.patch(`/reviews/${id}/approve`);
    },

    // // update a review statua (admin only)
    // $_update_review_status(id: string, status: string) {
    //     return GATEWAY_ENDPOINT.patch(`/reviews/${id}/status`, { rejectionReason });
    //   },

  // Delete a review
  $_delete_review(id: string) {
    return GATEWAY_ENDPOINT.delete(`/reviews/${id}`);
  }
};
