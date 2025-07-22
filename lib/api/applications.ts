import { apiClient } from './client'
import { Application } from '@/types/api'

// ID de usuario hardcodeado como se menciona en la configuración del backend
const USER_ID = 'user-123'

/**
 * Servicio para gestionar aplicaciones a proyectos
 * Maneja aplicación, retiro y obtención de aplicaciones del usuario
 */
export const applicationsService = {
  /**
   * Aplica a un proyecto específico
   * Crea un objeto de aplicación temporal si el backend devuelve respuesta vacía
   */
  async applyToProject(projectId: string): Promise<Application> {
    const response = await apiClient.post<any>(`/projects/${projectId}/apply`, {
      userId: USER_ID,
    })
    
    // Si el backend devuelve respuesta vacía (null), crea objeto de aplicación temporal
    if (response === null || response === undefined) {
      return {
        id: `temp-${Date.now()}`, // ID temporal
        userId: USER_ID,
        projectId: projectId,
        status: 'APPLIED' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
    
    return response
  },

  /**
   * Retira una aplicación de un proyecto
   */
  async withdrawApplication(projectId: string): Promise<void> {
    return apiClient.delete<void>(`/projects/${projectId}/apply`)
  },

  /**
   * Obtiene todas las aplicaciones del usuario actual
   */
  async getMyApplications(): Promise<Application[]> {
    return apiClient.get<Application[]>('/applications/my')
  },

}