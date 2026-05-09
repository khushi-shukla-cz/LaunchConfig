import { create } from "zustand";
import { AppConfig } from "@shared/schemas/config.schema";
import { apiClient } from "../api/client";

// ─── Config Store ─────────────────────────────────────────────────────────────

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  avatarUrl?: string;
}

interface ConfigStore {
  // Config
  config: AppConfig | null;
  configLoading: boolean;
  configError: string | null;
  loadConfig: () => Promise<void>;
  updateConfig: (config: AppConfig) => void;

  // Auth
  user: User | null;
  token: string | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;

  // i18n
  locale: string;
  translations: Record<string, string>;
  setLocale: (locale: string) => Promise<void>;
  t: (key: string, params?: Record<string, string>) => string;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  // ── Config ──────────────────────────────────────────────────────────────────
  config: null,
  configLoading: false,
  configError: null,

  loadConfig: async () => {
    set({ configLoading: true, configError: null });
    try {
      const result = await apiClient.getAppConfig();
      if (result.success && result.data) {
        set({ config: result.data, configLoading: false });
      } else {
        set({ configError: result.error || "Failed to load config", configLoading: false });
      }
    } catch (e: any) {
      set({ configError: e.message, configLoading: false });
    }
  },

  updateConfig: (config: AppConfig) => set({ config }),

  // ── Auth ────────────────────────────────────────────────────────────────────
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("cr_token") : null,
  authLoading: false,

  login: async (email, password) => {
    set({ authLoading: true });
    const result = await apiClient.login(email, password);
    if (result.success && result.data) {
      const d = result.data as any;
      set({ user: d.user, token: d.token, authLoading: false });
      return { success: true };
    }
    set({ authLoading: false });
    return { success: false, error: result.error };
  },

  register: async (email, password, name) => {
    set({ authLoading: true });
    const result = await apiClient.register(email, password, name);
    set({ authLoading: false });
    if (result.success) return { success: true };
    return { success: false, error: result.error };
  },

  logout: async () => {
    await apiClient.logout();
    set({ user: null, token: null });
  },

  loadUser: async () => {
    const result = await apiClient.getMe();
    if (result.success && result.data) {
      set({ user: (result.data as any).user });
    } else {
      set({ user: null, token: null });
    }
  },

  // ── i18n ────────────────────────────────────────────────────────────────────
  locale: typeof window !== "undefined"
    ? localStorage.getItem("cr_locale") || "en"
    : "en",
  translations: {},

  setLocale: async (locale: string) => {
    const result = await apiClient.getTranslations(locale);
    if (result.success && result.data) {
      set({ locale, translations: result.data as any });
      if (typeof window !== "undefined") {
        localStorage.setItem("cr_locale", locale);
      }
    }
  },

  t: (key: string, params?: Record<string, string>) => {
    const { translations } = get();
    let value = translations[key] ?? key;
    if (params) {
      value = Object.entries(params).reduce(
        (str, [k, v]) => str.replace(new RegExp(`{{${k}}}`, "g"), v),
        value
      );
    }
    return value;
  },
}));

// ─── Resource Store factory ────────────────────────────────────────────────────

import { apiClient as ac } from "../api/client";

interface ResourceState {
  records: any[];
  total: number;
  page: number;
  pages: number;
  loading: boolean;
  error: string | null;
  selected: any | null;
  filters: Record<string, unknown>;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface ResourceActions {
  fetch: (params?: Record<string, unknown>) => Promise<void>;
  fetchOne: (id: string) => Promise<any>;
  create: (data: Record<string, unknown>) => Promise<{ success: boolean; data?: any; error?: string; errors?: any }>;
  update: (id: string, data: Record<string, unknown>) => Promise<{ success: boolean; data?: any; error?: string; errors?: any }>;
  remove: (id: string) => Promise<{ success: boolean; error?: string }>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setFilter: (key: string, value: unknown) => void;
  clearFilters: () => void;
  setSort: (sortBy: string, sortOrder?: "asc" | "desc") => void;
  setSelected: (record: any | null) => void;
}

type ResourceStore = ResourceState & ResourceActions;

const resourceStores = new Map<string, ReturnType<typeof create<ResourceStore>>>();

export function useResourceStore(resourceName: string) {
  if (!resourceStores.has(resourceName)) {
    const store = create<ResourceStore>((set, get) => ({
      records: [],
      total: 0,
      page: 1,
      pages: 0,
      loading: false,
      error: null,
      selected: null,
      filters: {},
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",

      fetch: async (extraParams = {}) => {
        set({ loading: true, error: null });
        const { page, filters, search, sortBy, sortOrder } = get();
        const filterParams: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(filters)) {
          filterParams[`f_${k}`] = v;
        }

        const result = await ac.listRecords(resourceName, {
          page,
          sortBy,
          sortOrder,
          ...(search ? { search } : {}),
          ...filterParams,
          ...extraParams,
        });

        if (result.success) {
          set({
            records: (result as any).data || [],
            total: (result as any).total || 0,
            pages: (result as any).pages || 0,
            loading: false,
          });
        } else {
          set({ error: result.error || "Failed to load", loading: false });
        }
      },

      fetchOne: async (id: string) => {
        const result = await ac.getRecord(resourceName, id);
        if (result.success) {
          set({ selected: (result as any).data });
          return (result as any).data;
        }
        return null;
      },

      create: async (data) => {
        const result = await ac.createRecord(resourceName, data);
        if (result.success) {
          await get().fetch();
          return { success: true, data: (result as any).data };
        }
        return { success: false, error: result.error, errors: (result as any).data };
      },

      update: async (id, data) => {
        const result = await ac.updateRecord(resourceName, id, data);
        if (result.success) {
          await get().fetch();
          set({ selected: (result as any).data });
          return { success: true, data: (result as any).data };
        }
        return { success: false, error: result.error, errors: (result as any).data };
      },

      remove: async (id) => {
        const result = await ac.deleteRecord(resourceName, id);
        if (result.success) {
          await get().fetch();
          return { success: true };
        }
        return { success: false, error: result.error };
      },

      setPage: (page) => { set({ page }); get().fetch(); },
      setSearch: (search) => { set({ search, page: 1 }); get().fetch(); },
      setFilter: (key, value) => { set((s) => ({ filters: { ...s.filters, [key]: value }, page: 1 })); get().fetch(); },
      clearFilters: () => { set({ filters: {}, search: "", page: 1 }); get().fetch(); },
      setSort: (sortBy, sortOrder = "asc") => { set({ sortBy, sortOrder }); get().fetch(); },
      setSelected: (record) => set({ selected: record }),
    }));

    resourceStores.set(resourceName, store);
  }

  return resourceStores.get(resourceName)!();
}
