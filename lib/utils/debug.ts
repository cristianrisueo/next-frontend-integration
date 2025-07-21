// Debug utilities for development
export const isDevelopment = process.env.NODE_ENV === 'development'

export function logApiCall(endpoint: string, method: string = 'GET', data?: any) {
  if (isDevelopment) {
    console.log(`[API Call] ${method} ${endpoint}`, data ? { data } : '')
  }
}

export function logApiResponse(endpoint: string, response: any) {
  if (isDevelopment) {
    console.log(`[API Response] ${endpoint}`, { 
      status: 'success', 
      dataType: Array.isArray(response) ? `Array(${response.length})` : typeof response 
    })
  }
}

export function logApiError(endpoint: string, error: any) {
  if (isDevelopment) {
    console.error(`[API Error] ${endpoint}`, error)
  }
}