/**
 * API Data Provider - 连接真实后端 API
 * 实现 Refine DataProvider 接口，使用 HTTP 请求调用后端 API
 */

import { DataProvider } from "@refinedev/core";
import type { components } from "@spec/types";
import { getAccessToken } from "./authProvider";

// 定义类型别名
type CloneVariantResponseDto = components["schemas"]["CloneVariantResponseDto"];

// 后端 API 基础 URL（使用相对路径，通过 vite 代理转发）
const API_BASE_URL = "/api";

/**
 * 资源名称映射（前端资源名 -> 后端 API 路径）
 */
const resourceMap: Record<string, string> = {
  styles: "styles",
  variants: "variants",
  bom_items: "bom-items",
  spec_details: "spec-details",
  customers: "customers",
  sizes: "sizes",
  units: "units",
};

/**
 * 获取 API 路径
 */
function getApiPath(resource: string): string {
  return resourceMap[resource] || resource;
}

/**
 * 通用 HTTP 请求封装
 */
async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options?.headers as Record<string, string>) || {}),
  };

  // 添加 Authorization 头
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * API Data Provider 实现
 */
export const apiDataProvider: DataProvider = {
  /**
   * 获取资源列表 - 使用 POST /search 端点
   */
  getList: async ({ resource, filters, pagination, sorters }) => {
    console.log(`[API] getList: ${resource}`, { filters, pagination });

    const apiPath = getApiPath(resource);

    // 构建 POST 请求体
    const searchRequest = {
      filters: filters?.map(f => {
        // 处理 LogicalFilter 和 ConditionalFilter
        if ('field' in f) {
          return {
            field: f.field,
            operator: f.operator,
            value: f.value,
          };
        }
        // 处理其他类型的 filter
        return f;
      }),
      pagination: pagination ? {
        current: pagination.current,
        pageSize: pagination.pageSize,
      } : undefined,
      sorters: sorters?.map(s => ({
        field: s.field,
        order: s.order,
      })),
    };

    // 使用 POST /search
    const url = `${API_BASE_URL}/${apiPath}/search`;
    const result = await request<{ data: any[]; total: number }>(url, {
      method: "POST",
      body: JSON.stringify(searchRequest),
    });

    return {
      data: result.data,
      total: result.total,
    };
  },

  /**
   * 获取单条记录
   */
  getOne: async ({ resource, id }) => {
    console.log(`[API] getOne: ${resource}#${id}`);

    const apiPath = getApiPath(resource);
    const url = `${API_BASE_URL}/${apiPath}/${id}`;
    const result = await request<{ data: any }>(url);

    return {
      data: result.data,
    };
  },

  /**
   * 创建记录
   */
  create: async ({ resource, variables }) => {
    console.log(`[API] create: ${resource}`, variables);

    const apiPath = getApiPath(resource);
    const url = `${API_BASE_URL}/${apiPath}`;
    const result = await request<{ data: any }>(url, {
      method: "POST",
      body: JSON.stringify(variables),
    });

    return {
      data: result.data,
    };
  },

  /**
   * 更新记录
   */
  update: async ({ resource, id, variables }) => {
    console.log(`[API] update: ${resource}#${id}`, variables);

    const apiPath = getApiPath(resource);
    const url = `${API_BASE_URL}/${apiPath}/${id}`;
    const result = await request<{ data: any }>(url, {
      method: "PUT",
      body: JSON.stringify(variables),
    });

    return {
      data: result.data,
    };
  },

  /**
   * 删除记录
   */
  deleteOne: async ({ resource, id }) => {
    console.log(`[API] delete: ${resource}#${id}`);

    const apiPath = getApiPath(resource);
    const url = `${API_BASE_URL}/${apiPath}/${id}`;
    const result = await request<{ data: any }>(url, {
      method: "DELETE",
    });

    return {
      data: result.data,
    };
  },

  /**
   * 批量获取记录
   */
  getMany: async ({ resource, ids }) => {
    console.log(`[API] getMany: ${resource}`, ids);

    // 使用多个 getOne 请求实现
    const promises = ids.map((id) =>
      apiDataProvider.getOne({ resource, id })
    );
    const results = await Promise.all(promises);

    return {
      data: results.map((r) => r.data) as any,
    };
  },

  /**
   * 批量更新记录
   */
  updateMany: async ({ resource, ids, variables }) => {
    console.log(`[API] updateMany: ${resource}`, ids);

    const promises = ids.map((id) =>
      apiDataProvider.update({ resource, id, variables })
    );
    const results = await Promise.all(promises);

    return {
      data: results.map((r) => r.data) as any,
    };
  },

  /**
   * 批量删除记录
   */
  deleteMany: async ({ resource, ids }) => {
    console.log(`[API] deleteMany: ${resource}`, ids);

    const promises = ids.map((id) =>
      apiDataProvider.deleteOne({ resource, id })
    );
    const results = await Promise.all(promises);

    return {
      data: results.map((r) => r.data) as any,
    };
  },

  /**
   * 自定义操作（用于深度克隆等）
   */
  custom: async ({ url, method, payload }) => {
    console.log(`[API] custom: ${method} ${url}`, payload);

    // 处理深度克隆请求
    // URL 格式: /api/styles/:styleId/variants/:variantId/clone
    const cloneMatch = url.match(
      /\/api\/styles\/(\d+)\/variants\/(\d+)\/clone/
    );

    if (cloneMatch && method === "post") {
      const fullUrl = `${API_BASE_URL}/styles/${cloneMatch[1]}/variants/${cloneMatch[2]}/clone`;
      const result = await request<{ data: CloneVariantResponseDto }>(fullUrl, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return {
        data: result.data,
      };
    }

    // 通用自定义请求
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
    const result = await request<{ data: any }>(fullUrl, {
      method: method?.toUpperCase() || "GET",
      body: payload ? JSON.stringify(payload) : undefined,
    });

    return {
      data: result.data,
    };
  },

  /**
   * 获取 API URL
   */
  getApiUrl: () => API_BASE_URL,
};
