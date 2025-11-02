import apiService from "./api.js";

class UserService {
  // -------- USER ROUTES --------
  getProfile() {
    return apiService.get("/users/profile");
  }

  updateProfile(data) {
    return apiService.patch("/users/profile", data);
  }

  addAddress(data) {
    return apiService.post("/users/addresses", data);
  }

  updateAddress(addressId, data) {
    return apiService.patch(`/users/addresses/${addressId}`, data);
  }

  deleteAddress(addressId) {
    return apiService.delete(`/users/addresses/${addressId}`);
  }

  updatePreferences(data) {
    return apiService.patch("/users/preferences", data);
  }

  // -------- ADMIN ROUTES --------
  getAllUsers(query = {}) {
    const params = new URLSearchParams(query).toString();
    return apiService.get(`/users/admin/all?${params}`);
  }

  updateUserRole(userId, role) {
    return apiService.patch(`/users/admin/${userId}/role`, { role })
      .then(res => {
        return res;  
      });
  }
  
  

   getUserById(userId) {
    return apiService.get(`/users/admin/${userId}`)
    .then(res => {
      return res.user;  
    });
     
  }

 
  deleteUser(userId) {
    return apiService.delete(`/users/admin/${userId}`)
      .then(() => userId); 
  }
  
  toggleUserActive(userId) {
    return apiService.patch(`/users/admin/${userId}/toggle-active`);
  }
}

export const userService = new UserService();
