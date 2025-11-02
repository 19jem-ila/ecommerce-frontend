import { apiService } from "./api";

class ReviewService {
  // Get all reviews for a product
  async getProductReviews(productId) {
    return apiService.get(`/review/product/${productId}`);
  }

  // Get current user's review for a product
  async getUserReview(productId) {
    return apiService.get(`/review/product/${productId}/me`);
  }

  // Add or update review
  async addOrUpdateReview(reviewData) {
    return apiService.post("/review", reviewData);
  }

  // Delete a review
  async deleteReview(reviewId) {
    return apiService.delete(`/review/${reviewId}`);
  }
}

// Export a singleton instance
export const reviewService = new ReviewService();
export default reviewService;
