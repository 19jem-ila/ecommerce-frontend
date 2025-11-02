import { apiService } from "./api.js"; // your fetch wrapper

class CartService {
  // Get current user's cart
  async getCart() {
    return apiService.get("/cart");
  }

  // Add item to cart
  async addToCart(productId, quantity = 1, variant = {}) {
    return apiService.post("/cart", { productId, quantity, variant });
  }

  // Update item quantity
  async updateCartItem(productId, quantity, variant = {}) {
    return apiService.patch("/cart", { productId, quantity, variant });
  }

  // Remove a specific item
  async removeCartItem(productId, variant = {}) {
    return apiService.delete("/cart", { productId, variant });
  }

  // Clear the entire cart
  async clearCart() {
    return apiService.delete("/cart/clear");
  }
}

// Export singleton instance
export const cartService = new CartService();
export default cartService;
