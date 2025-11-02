import { apiService } from "./api.js"; // fetch-based wrapper

class WishlistService {
  // Get wishlist
  async getWishlist() {
    return apiService.get("/wishlist");
  }

  // Add to wishlist
  async addToWishlist(productId) {
    return apiService.post("/wishlist", { productId });
  }

  // Remove from wishlist
  async removeFromWishlist(productId) {
    return apiService.delete(`/wishlist/${productId}`);
  }

  // Move items to cart
  async moveToCart(productIds) {
    return apiService.post("/wishlist/move-to-cart", { productIds });
  }
}

// Export singleton instance
export const wishlistService = new WishlistService();
export default wishlistService;
