import type { AuthenticatedUser, AuthResponse } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const ACCESS_TOKEN_KEY = "restaurant.accessToken";
const REFRESH_TOKEN_KEY = "restaurant.refreshToken";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function saveAuthSession(response: AuthResponse): void {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
}

export function clearAuthSession(): void {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error("The request could not be completed.");
  }

  return response.json() as Promise<T>;
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentUser(): Promise<AuthenticatedUser> {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Authentication is required.");

  try {
    return await request<AuthenticatedUser>("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch {
    const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) throw new Error("Authentication is required.");

    const response = await request<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    saveAuthSession(response);
    return {
      sub: response.user.id,
      email: response.user.email,
      role: response.user.role,
    };
  }
}

export function logout(): void {
  clearAuthSession();
}
