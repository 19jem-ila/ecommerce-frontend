import apiService from "./api";

class AdminService {
  // Get overall dashboard stats (users, products, orders, revenue)
  async getAdminStats() {
    try {
      const response = await apiService.get("/admin/stats");
      console.log("response of stat", response);
      
      return response; // { totalUsers, totalProducts, totalOrders, totalRevenue }
    } catch (err) {
      throw new Error(err.message || "Failed to fetch admin stats");
    }
  }

  // Get sales trends (monthly revenue and orders)
  async getSalesTrends() {
    try {
      const response = await apiService.get("/admin/trends");
      return response; // [{ _id: '2025-01', totalRevenue: 1000, totalOrders: 5 }, ...]
    } catch (err) {
      throw new Error(err.message || "Failed to fetch sales trends");
    }
  }
}

export const adminService = new AdminService();
export default adminService;
