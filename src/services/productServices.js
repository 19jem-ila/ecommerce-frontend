import apiService from "./api";
import authService from "./authService";

class ProductService {
  // Get all products with filters, search, pagination, sorting
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiService.get(`/products${queryString ? `?${queryString}` : ""}`);
    return response; // fetch already returns JSON
  }

  // Get single product by ID
  async getProductById(id) {
    const response = await apiService.get(`/products/${id}`);
    return response;
  }

  // Get products by category
  async getProductsByCategory(category, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiService.get(
      `/products/category/${category}${queryString ? `?${queryString}` : ""}`
    );
    console.log("Service → API Response:", response); // will log { success, products, pagination }
    return response;
  }

  // Get featured products
  async getFeaturedProducts() {
    const response = await apiService.get("/products/featured");
    return response;
  }

  // Create product (Admin)
  // productService.js
async createProduct(productData) {
  // productData should already be a FormData (as above)
  if (!(productData instanceof FormData)) {
    throw new Error('createProduct expects FormData');
  }

  // Debug (optional)
  for (const pair of productData.entries()) {
    console.log('service FormData', pair[0], pair[1]);
  }

  // apiService.upload already uses fetch and doesn't set content-type (browser sets boundary)
  return apiService.upload('/products', productData);
}


  // Update product (Admin)
  async updateProduct(id, productData) {
    const token = authService.getToken();
    const response = await apiService.patch(`/products/${id}`, productData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  }

  // Delete product (Admin)
  async deleteProduct(id) {
    const token = authService.getToken();
    const response = await apiService.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  }

  // Search products
  async searchProducts(query, limit = 10) {
    const response = await apiService.get(`/products/search/${query}?limit=${limit}`);
    return response;
  }
}

export const productService = new ProductService();
export default productService;
