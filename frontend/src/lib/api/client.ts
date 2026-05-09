import { AppConfig } from "@shared/schemas/config.schema";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("cr_token", token);
      else localStorage.removeItem("cr_token");
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== "undefined") {
      return localStorage.getItem("cr_token");
    }
    return null;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string; code?: string; [key: string]: unknown }> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      });

      const json = await res.json();

      if (res.status === 401) {
        this.setToken(null);
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }

      return json;
    } catch (e: any) {
      return { success: false, error: e.message || "Network error", code: "NETWORK_ERROR" };
    }
  }

  get<T>(path: string) { return this.request<T>("GET", path); }
  post<T>(path: string, body: unknown) { return this.request<T>("POST", path, body); }
  put<T>(path: string, body: unknown) { return this.request<T>("PUT", path, body); }
  patch<T>(path: string, body: unknown) { return this.request<T>("PATCH", path, body); }
  delete<T>(path: string) { return this.request<T>("DELETE", path); }

  // ── Resource CRUD ──────────────────────────────────────────────────────────

  async listRecords(resourceName: string, params: Record<string, unknown> = {}) {
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") {
        query.set(k, String(v));
      }
    }
    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.get(`/api/v1/${resourceName}${qs}`);
  }

  async getRecord(resourceName: string, id: string) {
    return this.get(`/api/v1/${resourceName}/${id}`);
  }

  async createRecord(resourceName: string, data: Record<string, unknown>) {
    return this.post(`/api/v1/${resourceName}`, data);
  }

  async updateRecord(resourceName: string, id: string, data: Record<string, unknown>) {
    return this.put(`/api/v1/${resourceName}/${id}`, data);
  }

  async deleteRecord(resourceName: string, id: string) {
    return this.delete(`/api/v1/${resourceName}/${id}`);
  }

  // ── Auth ────────────────────────────────────────────────────────────────────

  async login(email: string, password: string) {
    const result = await this.post<{ token: string; user: any }>("/api/v1/auth/login", { email, password });
    if (result.success && result.data?.token) {
      this.setToken(result.data.token);
    }
    return result;
  }

  async register(email: string, password: string, name?: string) {
    return this.post("/api/v1/auth/register", { email, password, name });
  }

  async logout() {
    await this.post("/api/v1/auth/logout", {});
    this.setToken(null);
  }

  async getMe() {
    return this.get<{ user: any }>("/api/v1/auth/me");
  }

  async getAuthConfig() {
    return this.get("/api/v1/auth/config");
  }

  // ── Config ──────────────────────────────────────────────────────────────────

  async getAppConfig(): Promise<{ success: boolean; data?: AppConfig }> {
    return this.get("/api/v1/config") as any;
  }

  // ── i18n ────────────────────────────────────────────────────────────────────

  async getTranslations(locale: string) {
    return this.get<Record<string, string>>(`/api/v1/i18n/${locale}`);
  }

  async getSupportedLocales() {
    return this.get("/api/v1/i18n/locales");
  }

  // ── CSV Import ──────────────────────────────────────────────────────────────

  async uploadCSV(resourceName: string, file: File) {
    const token = this.getToken();
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BASE_URL}/api/v1/csv/${resourceName}/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return res.json();
  }

  async executeImport(resourceName: string, importId: string, mappings: Array<{ csvHeader: string; fieldName: string }>) {
    return this.post(`/api/v1/csv/${resourceName}/import/${importId}`, { mappings });
  }

  async getImportStatus(resourceName: string, importId: string) {
    return this.get(`/api/v1/csv/${resourceName}/import/${importId}/status`);
  }

  // ── GitHub Export ────────────────────────────────────────────────────────────

  async downloadProjectZip(config?: AppConfig) {
    const token = this.getToken();
    const res = await fetch(`${BASE_URL}/api/v1/export/github/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ config }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Export failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Health ────────────────────────────────────────────────────────────────

  async health() {
    return this.get("/health");
  }
}

export const apiClient = new ApiClient();
