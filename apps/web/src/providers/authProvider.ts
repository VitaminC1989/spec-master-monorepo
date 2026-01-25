/**
 * Auth Provider - Refine 认证提供者
 * 实现登录、登出、Token 刷新等认证功能
 */

import type { AuthProvider } from "@refinedev/core";

// API 基础路径
const API_BASE_URL = "/api";

// Token 存储键名
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

/**
 * 用户信息类型
 */
export interface UserInfo {
  id: number;
  username: string;
  realName: string | null;
  email: string | null;
  avatar: string | null;
  roles: string[];
  permissions: string[];
}

/**
 * 登录响应类型
 */
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}

/**
 * 获取存储的 Token
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * 获取存储的用户信息
 */
export function getStoredUser(): UserInfo | null {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * 刷新 Access Token
 */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // Refresh Token 无效，清除存储
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }

    const data = await response.json();
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

/**
 * Refine Auth Provider 实现
 */
export const authProvider: AuthProvider = {
  /**
   * 登录
   */
  login: async ({ username, password }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
          success: false,
          error: {
            name: "登录失败",
            message: error.message || "用户名或密码错误",
          },
        };
      }

      const data: LoginResponse = await response.json();

      // 存储 Token 和用户信息
      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return {
        success: true,
        redirectTo: "/",
      };
    } catch {
      return {
        success: false,
        error: {
          name: "登录失败",
          message: "网络错误，请稍后重试",
        },
      };
    }
  },

  /**
   * 登出
   */
  logout: async () => {
    const refreshToken = getRefreshToken();

    // 调用后端登出接口
    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      } catch {
        // 忽略登出接口错误
      }
    }

    // 清除本地存储
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  /**
   * 检查认证状态
   */
  check: async () => {
    const token = getAccessToken();

    if (!token) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }

    return {
      authenticated: true,
    };
  },

  /**
   * 获取用户权限
   */
  getPermissions: async () => {
    const user = getStoredUser();
    return user?.permissions || [];
  },

  /**
   * 获取用户身份信息
   */
  getIdentity: async () => {
    const user = getStoredUser();
    if (!user) return null;

    return {
      id: user.id,
      name: user.realName || user.username,
      avatar: user.avatar,
    };
  },

  /**
   * 错误处理
   */
  onError: async (error) => {
    // 401 错误尝试刷新 Token
    if (error.statusCode === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        return {
          logout: true,
          redirectTo: "/login",
        };
      }
    }
    return { error };
  },
};
