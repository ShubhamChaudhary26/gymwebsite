// api.js (Fixed Version with Correct Endpoints)
class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  processQueue(error, token = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // This is crucial for cookies!
      ...options,
    };

    try {
      console.log(`🌐 Making request to: ${endpoint}`);
      const response = await fetch(url, config);

      // Handle different response statuses
      if (
        response.status === 401 &&
        !endpoint.includes("/refresh-token") &&
        !endpoint.includes("/login")
      ) {
        console.log("🔒 401 Unauthorized - attempting token refresh");

        // Try to refresh token
        if (!this.isRefreshing) {
          this.isRefreshing = true;

          try {
            const refreshResponse = await this.refreshToken();
            console.log("🔄 Refresh response:", refreshResponse);

            if (refreshResponse.success) {
              this.processQueue(null, "refreshed");

              // Retry the original request
              console.log("🔄 Retrying original request");
              const retryResponse = await fetch(url, config);

              if (!retryResponse.ok) {
                const retryErrorData = await retryResponse
                  .json()
                  .catch(() => ({}));
                throw new Error(
                  retryErrorData.message ||
                    `HTTP error! status: ${retryResponse.status}`
                );
              }

              return await retryResponse.json();
            } else {
              throw new Error("Token refresh failed");
            }
          } catch (refreshError) {
            console.error("❌ Token refresh failed:", refreshError);
            this.processQueue(refreshError, null);
            throw refreshError;
          } finally {
            this.isRefreshing = false;
          }
        } else {
          // Queue the request if already refreshing
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          }).then(() => {
            return fetch(url, config).then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            });
          });
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`❌ Request failed:`, errorData);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log(`✅ Request successful:`, endpoint);
      return data;
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    console.log("🔐 Attempting admin login...");
    return this.request("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    console.log("🚪 Logging out admin...");
    return this.request("/admin/auth/logout", {
      method: "POST",
    });
  }
  async refreshToken() {
    console.log("🔄 Refreshing admin token...");
    try {
      const response = await this.request("/admin/auth/refresh-token", {
        method: "POST",
      });
      return response;
    } catch (error) {
      console.error("❌ Refresh token request failed:", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.request("/admin/auth/me", {
        method: "GET",
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // User Management endpoints
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/users?${queryString}`);
  }

  async getAllAdmins() {
    return this.request("/admin/admins");
  }

  async createAdmin(adminData) {
    return this.request("/admin/admins/create", {
      method: "POST",
      body: JSON.stringify(adminData),
    });
  }

  async promoteToAdmin(userId) {
    return this.request(`/admin/users/${userId}/promote`, {
      method: "PUT",
    });
  }

  async demoteFromAdmin(userId) {
    return this.request(`/admin/users/${userId}/demote`, {
      method: "PUT",
    });
  }

  async createUser(userData) {
    return this.request("/admin/users/create", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId, userData) {
    return this.request(`/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: "DELETE",
    });
  }

  // Dashboard Stats
  async getDashboardStats() {
    return this.request("/admin/dashboard/stats");
  }

  // Blogs endpoints (with FormData for image upload)
  async getBlogs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/blogs?${queryString}`);
  }

  async getBlog(id) {
    return this.request(`/blogs/${id}`);
  }

  async createBlog(blogData) {
    return this.request("/blogs/create", {
      method: "POST",
      body: blogData,
      headers: {}, // Remove Content-Type for FormData
    });
  }

  async updateBlog(id, blogData) {
    return this.request(`/blogs/${id}`, {
      method: "PUT",
      body: blogData,
      headers: {}, // Remove Content-Type for FormData
    });
  }

  async deleteBlog(id) {
    return this.request(`/blogs/${id}`, {
      method: "DELETE",
    });
  }

  // Inquiries endpoints
  async getInquiries(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/inquires?${queryString}`);
  }

  async getInquiry(id) {
    return this.request(`/inquires/${id}`);
  }

  async createInquiry(inquiryData) {
    return this.request("/inquires", {
      method: "POST",
      body: JSON.stringify(inquiryData),
    });
  }

  async updateInquiry(id, inquiryData) {
    return this.request(`/inquires/${id}`, {
      method: "PUT",
      body: JSON.stringify(inquiryData),
    });
  }

  async deleteInquiry(id) {
    return this.request(`/inquires/${id}`, {
      method: "DELETE",
    });
  }

  // Quotes endpoints
  async getQuotes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/quotes?${queryString}`);
  }

  async getQuote(id) {
    return this.request(`/quotes/${id}`);
  }

  async createQuote(quoteData) {
    return this.request("/quotes/create", {
      method: "POST",
      body: JSON.stringify(quoteData),
    });
  }

  async updateQuote(id, quoteData) {
    return this.request(`/quotes/${id}`, {
      method: "PUT",
      body: JSON.stringify(quoteData),
    });
  }

  async deleteQuote(id) {
    return this.request(`/quotes/${id}`, {
      method: "DELETE",
    });
  }

  // Subscribers endpoints
  async getSubscribers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/subscribers?${queryString}`);
  }

  async deleteSubscriber(id) {
    return this.request(`/subscribers/${id}`, {
      method: "DELETE",
    });
  }
  // api.js

  // 🆕 Trainer endpoints
  async getTrainers() {
    return this.request("/trainers", { method: "GET" });
  }

  async createTrainer(formData) {
    return this.request("/trainers/create", {
      method: "POST",
      body: formData,
      headers: {}, // ❌ content-type auto handle by browser
    });
  }

  async updateTrainer(id, formData) {
    return this.request(`/trainers/${id}`, {
      method: "PUT",
      body: formData,
      headers: {},
    });
  }

  async deleteTrainer(id) {
    return this.request(`/trainers/${id}`, { method: "DELETE" });
  }
  // api.js Product endpoints (already got most of them probably)
  async getProducts() {
    return this.request("/products", { method: "GET" });
  }

  async createProduct(formData) {
    return this.request("/products/create", {
      method: "POST",
      body: formData,
      headers: {}, // don't set content-type for FormData
    });
  }

  async updateProduct(id, formData) {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: formData,
      headers: {},
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, { method: "DELETE" });
  }
  async getSubscriptions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/subscriptions?${queryString}`);
  }

  async getSubscriptionStats() {
    return this.request("/admin/subscriptions/stats");
  }

  async cancelSubscription(subscriptionId) {
    return this.request(`/admin/subscriptions/${subscriptionId}/cancel`, {
      method: "PUT",
    });
  }

  // Plan endpoints
  // services/api.js mein ye add karo existing Plan endpoints ke saath:

  // Plan endpoints (complete set)
  async getPlans(includeInactive = false) {
    const params = includeInactive ? "?includeInactive=true" : "";
    return this.request(`/plans${params}`);
  }

  async getPlanById(planId) {
    return this.request(`/plans/${planId}`);
  }

  async createPlan(planData) {
    return this.request("/plans/create", {
      method: "POST",
      body: JSON.stringify(planData),
    });
  }

  async updatePlan(planId, planData) {
    return this.request(`/plans/${planId}`, {
      method: "PUT",
      body: JSON.stringify(planData),
    });
  }

  async deletePlan(planId) {
    return this.request(`/plans/${planId}`, {
      method: "DELETE",
    });
  }

  async togglePlanStatus(planId) {
    return this.request(`/plans/${planId}/toggle-status`, {
      method: "PATCH",
    });
  }

  // Payment endpoints (for testing)
  async createTestPayment(userId, planId) {
    return this.request("/admin/payments/test", {
      method: "POST",
      body: JSON.stringify({ userId, planId }),
    });
  }
  // services/api.js mein add karo:

  // Offline Subscription
  async createOfflineSubscription(subscriptionData) {
    return this.request("/admin/subscriptions/offline", {
      method: "POST",
      body: JSON.stringify(subscriptionData),
    });
  }

  // Get single subscription details
  async getSubscriptionById(subscriptionId) {
    return this.request(`/admin/subscriptions/${subscriptionId}`);
  }
  // services/api.js mein add karo:

  // Extend subscription validity
  async extendSubscription(subscriptionId, days) {
    return this.request(`/admin/subscriptions/${subscriptionId}/extend`, {
      method: "PUT",
      body: JSON.stringify({ days }),
    });
  }

  // Change subscription plan
  async changeSubscriptionPlan(subscriptionId, newPlanId) {
    return this.request(`/admin/subscriptions/${subscriptionId}/change-plan`, {
      method: "PUT",
      body: JSON.stringify({ planId: newPlanId }),
    });
  }

  // Add notes to subscription
  async addSubscriptionNote(subscriptionId, note) {
    return this.request(`/admin/subscriptions/${subscriptionId}/notes`, {
      method: "POST",
      body: JSON.stringify({ note }),
    });
  }

  // Get user's subscription history
  async getUserSubscriptionHistory(userId) {
    return this.request(`/admin/users/${userId}/subscription-history`);
  }
  // services/api.js mein add karo:

  // Admin initiates renewal for a user
  // services/api.js - CORRECTED
  async adminInitiateRenewal(data) {
    // data = { subscriptionId, planId, paymentMethod }
    return this.request("/admin/subscriptions/renew", {
      method: "POST",
      body: JSON.stringify(data), // ✅ Pura data object bhejo
    });
  }
  // services/api.js
  async updateSubscription(subscriptionId, data) {
    return this.request(`/admin/subscriptions/${subscriptionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

export default new ApiService();
