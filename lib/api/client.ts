import { ApiError } from '@/types/api'
import { logApiCall, logApiResponse, logApiError } from '@/lib/utils/debug'

const API_BASE_URL = 'http://localhost:3001'

class ApiClient {
  private baseURL: string
  private defaultHeaders: HeadersInit

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    }

    logApiCall(endpoint, options.method || 'GET', options.body ? JSON.parse(options.body as string) : undefined)

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error: ApiError = {
          message: errorData.message || `HTTP Error: ${response.status}`,
          statusCode: response.status,
          code: errorData.code,
        }
        logApiError(endpoint, error)
        throw error
      }

      // Handle empty responses (common for 201, 204 status codes)
      const text = await response.text()
      let data
      
      if (text.trim() === '') {
        // Empty response - return null or empty object based on expected type
        data = null
      } else {
        try {
          data = JSON.parse(text)
        } catch (jsonError) {
          // If it's not valid JSON but we have text, return the text
          data = text
        }
      }
      
      logApiResponse(endpoint, data)
      return data
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error
      }
      
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Network error occurred',
        statusCode: 0,
      }
      logApiError(endpoint, apiError)
      throw apiError
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = params ? new URLSearchParams(
      Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => [key, Array.isArray(value) ? value.join(',') : String(value)])
    ).toString() : ''
    
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint
    return this.request<T>(url)
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient()
export default apiClient