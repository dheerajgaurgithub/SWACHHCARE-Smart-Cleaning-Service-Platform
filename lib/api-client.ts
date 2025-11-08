const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  headers?: Record<string, string>
  body?: any
  auth?: boolean
}

class APIClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  private async request(endpoint: string, options: RequestOptions = {}) {
    const { method = "GET", headers = {}, body, auth = true } = options

    const url = `${this.baseURL}${endpoint}`
    const token = auth ? this.getAuthToken() : null

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    }

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        method,
        headers: defaultHeaders,
        body: body ? JSON.stringify(body) : undefined,
      })

      const data = await response.json()

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || "An error occurred",
          data,
        }
      }

      return data
    } catch (error: any) {
      console.error("[API Error]", error)
      throw error
    }
  }

  get(endpoint: string, auth?: boolean) {
    return this.request(endpoint, { method: "GET", auth })
  }

  post(endpoint: string, body?: any, auth?: boolean) {
    return this.request(endpoint, { method: "POST", body, auth })
  }

  put(endpoint: string, body?: any, auth?: boolean) {
    return this.request(endpoint, { method: "PUT", body, auth })
  }

  delete(endpoint: string, auth?: boolean) {
    return this.request(endpoint, { method: "DELETE", auth })
  }

  patch(endpoint: string, body?: any, auth?: boolean) {
    return this.request(endpoint, { method: "PATCH", body, auth })
  }
}

export const apiClient = new APIClient(API_BASE_URL)
