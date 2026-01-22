import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// ===== LẤY BIẾN MÔI TRƯỜNG =====
// Note: Vite uses import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_USERNAME = import.meta.env.VITE_API_USERNAME;
const API_PASSWORD = import.meta.env.VITE_API_PASSWORD;
const TENANT_CODE = import.meta.env.VITE_TENANT_CODE;

// Mở rộng kiểu config để có thể đánh dấu request đã được thử lại
interface AuthRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let currentAuthToken: string | undefined = undefined;
let isRefreshing = false;
let failedQueue: {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  originalConfig: any;
}[] = [];

// ===== AXIOS INSTANCE =====
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// ===== LOGIN & LẤY TOKEN (SỬ DỤNG AXIOS GỐC) =====
// Đảm bảo request login không chạy qua bất kỳ Interceptor nào của 'api'
const loginAndGetToken = async (): Promise<string> => {
  if (!API_USERNAME || !API_PASSWORD || !API_BASE_URL || !TENANT_CODE) {
    throw new Error("Missing API credentials or Tenant Code");
  }

  const formData = new URLSearchParams();
  formData.append("username", API_USERNAME);
  formData.append("password", API_PASSWORD);

  try {
    // SỬ DỤNG 'axios' GỐC: Request này HOÀN TOÀN BỎ QUA Interceptor của 'api'
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-tenant-code": TENANT_CODE,
        },
      }
    );

    const newToken = response.data.access_token;
    return newToken;
  } catch (error) {
    console.error("[AUTH FAILED] Không thể đăng nhập và lấy token:", error);
    // Nếu request login thất bại, throw lỗi để các request đang chờ bị hủy bỏ
    throw error;
  }
};

// ===== XỬ LÝ HÀNG ĐỢI VÀ ENSURE TOKEN (Giữ nguyên logic) =====
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      // Khi có token mới, resolve với token
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const ensureToken = async (): Promise<string> => {
  if (currentAuthToken) return currentAuthToken;

  if (isRefreshing) {
    // Chặn request và thêm vào hàng đợi
    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve,
        reject,
        originalConfig: null,
      });
    });
  }

  isRefreshing = true;
  try {
    const newToken = await loginAndGetToken();
    currentAuthToken = newToken;
    processQueue(null, newToken);
    return newToken;
  } catch (err) {
    processQueue(err, null);
    throw err;
  } finally {
    isRefreshing = false;
  }
};

// ===== REQUEST INTERCEPTOR (Đã sửa để chỉ sử dụng token) =====
api.interceptors.request.use(async (config) => {
  if (TENANT_CODE) {
    config.headers["x-tenant-code"] = TENANT_CODE;
  }

  // Chặn và chờ lấy token
  const token = await ensureToken();
  config.headers.Authorization = `Bearer ${token}`;


  return config;
});

// ===== RESPONSE INTERCEPTOR (Giữ nguyên logic retry token) =====
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AuthRequestConfig;
    const status = error.response?.status;
    const errorDetail = error.response?.data?.detail;

    // Điều kiện retry: 401 HOẶC (403 thiếu token) VÀ chưa retry
    const shouldRetry =
      (status === 401 ||
        (status === 403 &&
          errorDetail === "Could not validate credentials - no token")) &&
      originalRequest &&
      !originalRequest._retry;

    if (shouldRetry) {
      originalRequest._retry = true;
      currentAuthToken = undefined; // xóa token cũ

      // Đẩy request gốc vào hàng đợi và chờ token mới
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken: string) => {
            // Khi có token mới, thiết lập header và gửi lại request
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          },
          reject,
          originalConfig: originalRequest,
        });
        // Kích hoạt tiến trình lấy token
        ensureToken().catch(() => { });
      });
    }
    return Promise.reject(error);
  }
);

export default api;
