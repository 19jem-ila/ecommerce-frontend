import { apiService } from "./api";

class OrderService {
  // Create a new order
  async createOrder(orderData) {
    return apiService.post("/orders", orderData);
  }

  // Get logged-in user's orders
  async getUserOrders(page = 1, limit = 10, status) {
    let query = `?page=${page}&limit=${limit}`;
    if (status) query += `&status=${status}`;
    return apiService.get(`/orders/my-orders${query}`);
  }

  // Cancel an order
  async cancelOrder(orderId) {
    return apiService.patch(`/orders/${orderId}/cancel`);
  }

  // ------------------ Admin ------------------
  async getAllOrders(page = 1, limit = 20, status, paymentStatus) {
    let query = `?page=${page}&limit=${limit}`;
    if (status) query += `&status=${status}`;
    if (paymentStatus) query += `&paymentStatus=${paymentStatus}`;
    return apiService.get(`/orders/admin/all${query}`);
  }

  async updateOrderStatus(orderId, data) {
    return apiService.patch(`/orders/admin/${orderId}/status`, data);
  }

  // ------------------ Telebirr Payment ------------------
  async initiatePayment(orderId) {
    const response = await apiService.post("/orders/payments/initiate", { orderId });
    console.log("Initiate Payment Response:", response);
    return response;
  }
  
  async confirmPayment(transactionId, status, data) {
    const response = await apiService.post("/orders/payments/confirm", { transactionId, status, data });
    console.log("Confirm Payment Response:", response);
    return response;
  }
  
}

// Export a singleton instance
export const orderService = new OrderService();
export default orderService;
