import { apiClient } from './client'
import { Application } from '@/types/api'

const USER_ID = 'user-123' // Hardcoded as mentioned in the backend setup

export const applicationsService = {
  async applyToProject(projectId: string): Promise<Application> {
    const response = await apiClient.post<any>(`/projects/${projectId}/apply`, {
      userId: USER_ID,
    })
    
    // If the backend returns empty response (null), create a mock application object
    if (response === null || response === undefined) {
      return {
        id: `temp-${Date.now()}`, // Temporary ID
        userId: USER_ID,
        projectId: projectId,
        status: 'APPLIED' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
    
    return response
  },

  async withdrawApplication(projectId: string): Promise<void> {
    return apiClient.delete<void>(`/projects/${projectId}/apply`)
  },

  async getMyApplications(): Promise<Application[]> {
    return apiClient.get<Application[]>('/applications/my')
  },

  async getUserApplications(userId: string = USER_ID): Promise<Application[]> {
    return apiClient.get<Application[]>(`/users/${userId}/applications`)
  },
}