/**
 * Utilidades de debug para desarrollo
 * Proporciona funciones de logging para llamadas API y depuración
 */

// Determina si estamos en modo de desarrollo
export const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Registra una llamada a la API en la consola (solo en desarrollo)
 * 
 * @param endpoint - Endpoint de la API llamado
 * @param method - Método HTTP utilizado (GET, POST, etc.)
 * @param data - Datos enviados en la petición (opcional)
 */
export function logApiCall(endpoint: string, method: string = 'GET', data?: any) {
  if (isDevelopment) {
    console.log(`[API Call] ${method} ${endpoint}`, data ? { data } : '')
  }
}

/**
 * Registra una respuesta exitosa de la API (solo en desarrollo)
 * 
 * @param endpoint - Endpoint que respondió
 * @param response - Datos de respuesta recibidos
 */
export function logApiResponse(endpoint: string, response: any) {
  if (isDevelopment) {
    console.log(`[API Response] ${endpoint}`, { 
      status: 'success', 
      dataType: Array.isArray(response) ? `Array(${response.length})` : typeof response 
    })
  }
}

/**
 * Registra un error de la API en la consola (solo en desarrollo)
 * 
 * @param endpoint - Endpoint que generó el error
 * @param error - Objeto de error recibido
 */
export function logApiError(endpoint: string, error: any) {
  if (isDevelopment) {
    console.error(`[API Error] ${endpoint}`, error)
  }
}