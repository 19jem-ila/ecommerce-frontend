const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
import { authService } from "./authService"; // your Firebase + JWT auth service

class ApiService {
  // Get headers automatically, include JWT from localStorage
  getHeaders(contentType = "application/json") {
    const token = localStorage.getItem("accessToken");
    const headers = {};
    if (contentType) headers["Content-Type"] = contentType;
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }

  // Handle response errors centrally
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Centralized fetch with optional retry on 401
  async fetchWithAuth(input, init = {}, retry = true) {
    let response = await fetch(input, init);

    if (response.status === 401 && retry) {
      try {
        // Refresh token via Firebase + backend
        await authService.refreshToken();
        const newHeaders = {
          ...init.headers,
          Authorization: `Bearer ${authService.getToken()}`,
        };
        response = await fetch(input, { ...init, headers: newHeaders });
      } catch (err) {
        authService.clearTokens();
        throw err;
      }
    }

    return this.handleResponse(response);
  }

  // CRUD Methods
  get(endpoint) {
    return this.fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
  }

  post(endpoint, data) {
    return this.fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put(endpoint, data) {
    return this.fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  patch(endpoint, data) {
    return this.fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete(endpoint, data) {
    return this.fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined, // ✅ send body if provided
    });
  }
  

  // Upload formData (images, files)
  upload(endpoint, formData) {
    return this.fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(null), // no content-type: browser sets automatically
      body: formData,
    });
  }
}

export const apiService = new ApiService();
export default apiService;
