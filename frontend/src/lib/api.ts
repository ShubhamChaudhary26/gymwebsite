// lib/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

class ApiService {
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (value?: any) => void;
        reject: (reason?: any) => void;
    }> = [];

    // Process queued requests after token refresh
    private processQueue(error: any = null, token: string | null = null) {
        this.failedQueue.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        this.failedQueue = [];
    }

    // Main request wrapper
    async request(endpoint: string, options: RequestInit = {}) {
        const url = `${API_BASE}${endpoint}`;

        const config: RequestInit = {
            ...options,
            credentials: "include", // ✅ CRITICAL: Send/receive cookies
            headers: {
                // ✅ ONLY set Content-Type if body is NOT FormData
                ...(!(options.body instanceof FormData) && {
                    "Content-Type": "application/json",
                }),
                ...options.headers,
            },
        };

        try {
            console.log(`🌐 Making request to: ${endpoint}`);
            const response = await fetch(url, config);

            // Handle 401 Unauthorized (token expired)
            if (
                response.status === 401 &&
                !endpoint.includes("/refresh-token") &&
                !endpoint.includes("/login")
            ) {
                console.log("🔒 401 Unauthorized - attempting token refresh");

                if (!this.isRefreshing) {
                    this.isRefreshing = true;

                    try {
                        const refreshResponse = await this.refreshToken();
                        console.log("🔄 Token refreshed successfully");

                        this.processQueue(null, "refreshed");

                        // Retry original request
                        console.log("🔄 Retrying original request");
                        const retryResponse = await fetch(url, config);

                        if (!retryResponse.ok) {
                            const retryErrorData = await retryResponse.json().catch(() => ({}));
                            throw new Error(
                                retryErrorData.message || `HTTP error! status: ${retryResponse.status}`
                            );
                        }

                        return await retryResponse.json();
                    } catch (refreshError: any) {
                        console.error("❌ Token refresh failed:", refreshError);
                        this.processQueue(refreshError, null);

                        // Redirect to login on refresh failure
                        if (typeof window !== "undefined") {
                            localStorage.removeItem("user");
                            window.location.href = "/login";
                        }

                        throw refreshError;
                    } finally {
                        this.isRefreshing = false;
                    }
                } else {
                    // Queue the request if already refreshing
                    return new Promise((resolve, reject) => {
                        this.failedQueue.push({ resolve, reject });
                    })
                        .then(() => {
                            return fetch(url, config).then((response) => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.json();
                            });
                        });
                }
            }

            // Handle other errors
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error(`❌ Request failed:`, errorData);
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`✅ Request successful:`, endpoint);
            return data;
        } catch (error: any) {
            console.error(`❌ API request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    // ========== AUTH ENDPOINTS ==========

    async register(formData: FormData) {
        console.log("📝 Attempting registration...");
        return this.request("/users/register", {
            method: "POST",
            body: formData,
            headers: {}, // ✅ Don't set Content-Type for FormData
        });
    }

    async login(email: string, password: string) {
        console.log("🔐 Attempting login...");
        return this.request("/users/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
    }

    async logout() {
        console.log("🚪 Logging out...");
        return this.request("/users/logout", {
            method: "POST",
        });
    }

    async refreshToken() {
        console.log("🔄 Refreshing token...");
        return this.request("/users/refresh-token", {
            method: "POST",
        });
    }

    async getCurrentUser() {
        console.log("👤 Fetching current user...");
        return this.request("/users/me", {
            method: "GET",
        });
    }

    async forgotPassword(email: string) {
        return this.request("/users/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email }),
        });
    }

    async resetPassword(token: string, newPassword: string, confirmPassword: string) {
        return this.request("/users/reset-password-token", {
            method: "POST",
            body: JSON.stringify({ token, newPassword, confirmPassword }),
        });
    }

    // ========== PAYMENT ENDPOINTS ==========

    async getRazorpayConfig() {
        console.log("🔑 Fetching Razorpay config...");
        return this.request("/payments/config", {
            method: "GET",
        });
    }

    async createOrder(planId: string) {
        console.log("💳 Creating payment order...");
        return this.request("/payments/create-order", {
            method: "POST",
            body: JSON.stringify({ planId }),
        });
    }

    async verifyPayment(paymentData: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
        subscriptionId: string;
    }) {
        console.log("✅ Verifying payment...");
        return this.request("/payments/verify", {
            method: "POST",
            body: JSON.stringify(paymentData),
        });
    }

    async getSubscriptionStatus() {
        return this.request("/payments/subscription-status", {
            method: "GET",
        });
    }

    async getPaymentHistory(page = 1, limit = 10) {
        return this.request(`/payments/history?page=${page}&limit=${limit}`, {
            method: "GET",
        });
    }

    async renewSubscription(subscriptionId: string, planId: string) {
        return this.request("/payments/renew", {
            method: "POST",
            body: JSON.stringify({ subscriptionId, planId }),
        });
    }

    async checkRenewalEligibility() {
        return this.request("/payments/renewal-eligibility", {
            method: "GET",
        });
    }

    async getExpiryStatus() {
        return this.request("/payments/expiry-status", {
            method: "GET",
        });
    }

    // ========== PLAN ENDPOINTS ==========

    async getPlans(includeInactive = false) {
        const params = includeInactive ? "?includeInactive=true" : "";
        return this.request(`/plans${params}`, {
            method: "GET",
        });
    }

    async getPlanById(planId: string) {
        return this.request(`/plans/${planId}`, {
            method: "GET",
        });
    }

    // ========== PRODUCT ENDPOINTS ==========

    async getProducts() {
        return this.request("/products", {
            method: "GET",
        });
    }

    async getProductById(productId: string) {
        return this.request(`/products/${productId}`, {
            method: "GET",
        });
    }

    // ========== BLOG ENDPOINTS ==========

    async getBlogs(params = {}) {
        const queryString = new URLSearchParams(params as any).toString();
        return this.request(`/blogs?${queryString}`, {
            method: "GET",
        });
    }

    async getBlogById(blogId: string) {
        return this.request(`/blogs/${blogId}`, {
            method: "GET",
        });
    }

    // ========== TRAINER ENDPOINTS ==========

    async getTrainers() {
        return this.request("/trainers", {
            method: "GET",
        });
    }

    async getTrainerById(trainerId: string) {
        return this.request(`/trainers/${trainerId}`, {
            method: "GET",
        });
    }

    // ========== QUOTE ENDPOINTS ==========

    async createQuote(quoteData: any) {
        return this.request("/quotes/create", {
            method: "POST",
            body: JSON.stringify(quoteData),
        });
    }

    // ========== SUBSCRIBER ENDPOINTS ==========

    async subscribe(email: string) {
        return this.request("/subscribe", {
            method: "POST",
            body: JSON.stringify({ email }),
        });
    }
}

export default new ApiService();