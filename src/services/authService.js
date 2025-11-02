import apiService from "./api";
import { auth, googleProvider } from "../firebase/config";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

class AuthService {
  // 🔹 Email/password login
  async loginWithEmail(email, password) {
    try {
      // Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await user.reload();
      
       // Always get fresh Firebase ID token
      const idToken = await user.getIdToken(true);
     
      // Clear old tokens
      this.clearTokens();
  
      // Send ID token in request body
      const response = await apiService.post("/auth/login", { idToken });
      console.log(response);
  
      // Destructure backend response
      const { accessToken, refreshToken, user: backendUser } = response;
     

  
      // Save tokens + user locally
      // this.setToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(backendUser));
  
      return { user: backendUser, accessToken, refreshToken };
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      throw err.response?.data || new Error(err.message);
    }
  }
  
// 🔹 Google login
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const idToken = await user.getIdToken();
      const { token: accessToken, user: backendUser } = await apiService.post("/auth/login", { idToken });

      this.setToken(accessToken);
      localStorage.setItem("user", JSON.stringify(backendUser));

      return { user: backendUser, accessToken };
    } catch (err) {
      console.error("Google login failed:", err.response?.data || err.message);
      throw err.response?.data || new Error(err.message);
    }
  }

  // 🔹 Register user
  async register({ email, password, displayName,termsAccepted }) {
    try {
      const { user: backendUser } = await apiService.post("/auth/register", { email, password, displayName,termsAccepted});
      return backendUser;
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      throw err.response?.data || new Error(err.message);
    }
  }

  async verifyEmail(uid) {
    try {
      // send uid to backend
      const { data } = await apiService.post("/auth/verify-email", { uid });
      return data;
    } catch (err) {
      console.error("Email verification failed:", err.response?.data || err.message);
      throw err.response?.data || new Error(err.message);
    }
  }
  
  // 🔹 Resend verification email
  async resendVerification() {
    try {
      // For resend, the backend will fetch the user from the token
      const token = this.getToken();
      const { data } = await apiService.post(
        "/auth/resend-verification",
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    } catch (err) {
      console.error("Resend verification failed:", err.response?.data || err.message);
      throw err.response?.data || new Error(err.message);
    }
  }

  // 🔹 Forgot password
  async forgotPassword(email) {
    try {
      const { data } = await apiService.post("/auth/forgot-password", { email });
      return data;
    } catch (err) {
      console.error("Forgot password failed:", err.response?.data || err.message);
      throw err.response?.data || new Error(err.message);
    }
  }

  // 🔹 Reset password
  async resetPassword({ oobCode, newPassword, confirmPassword }) {
    try {
      const { data } = await apiService.post("/auth/reset-password", { oobCode, newPassword, confirmPassword });
      return data;
    } catch (err) {
      console.error("Reset password failed:", err.response?.data || err.message);
      throw err.response?.data || new Error(err.message);
    }
  }

  // 🔹 Change password
  async changePassword({ oldPassword, newPassword, confirmPassword }) {
    try {
      const token = this.getToken();
      const { data } = await apiService.post(
        "/auth/change-password",
        { oldPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (err) {
      console.error("Change password failed:", err.response?.data || err.message);
      throw err.response?.data || new Error(err.message);
    }
  }

  // 🔹 Create admin
  async createAdmin({ email, password, displayName }) {
    try {
      const token = this.getToken();
      if (!token) throw new Error("Not authenticated as admin");

      const { token: accessToken, user: backendUser } = await apiService.post(
        "/auth/create-admin",
        { email, password, displayName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return { user: backendUser, accessToken };
    } catch (err) {
      console.error("Admin creation failed:", err.response?.data || err.message);
      throw err.response?.data || new Error(err.message);
    }
  }

  // 🔹 Get current user
  async getCurrentUser() {
    try {
      const token = this.getToken();
      return await apiService.get("/auth/profile", { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error("Fetch current user failed:", err.response?.data || err.message);
      throw err.response?.data || new Error(err.message);
    }
  }

  // 🔹 Update profile
  async updateProfile(data) {
    try {
      const token = this.getToken();
      return await apiService.put("/auth/profile", data, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error("Update profile failed:", err.response?.data || err.message);
      throw err.response?.data || new Error(err.message);
    }
  }

  // 🔹 Logout
  async logout() {
    try {
      const token = this.getToken();
      await apiService.post("/auth/logout", null, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.warn("Logout failed:", err.response?.data || err.message);
    } finally {
      this.clearTokens();
    }
  }

  async  refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token stored");
  
    const { data } = await apiService.post("/auth/refresh", { refreshToken });
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  }
  
  // 🔹 Auth helpers
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem("accessToken");
  }

  setToken(token) {
    localStorage.setItem("accessToken", token);
  }

  clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }
}

export const authService = new AuthService();
export default authService;



