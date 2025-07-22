import { useState, useEffect, useCallback } from 'react'
import { applicationsService } from '@/lib/api/applications'
import { Application, ApiError } from '@/types/api'

/**
 * Interfaz del valor de retorno del hook useApplications
 */
interface UseApplicationsReturn {
  applications: Application[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  applyToProject: (projectId: string) => Promise<boolean>
  withdrawApplication: (projectId: string) => Promise<boolean>
  isAppliedToProject: (projectId: string) => boolean
  isProcessing: boolean
}

/**
 * Hook personalizado para gestionar aplicaciones a proyectos
 * Maneja la obtención, aplicación y retiro de aplicaciones
 * 
 * @returns Objeto con aplicaciones, estados y funciones de control
 */
export function useApplications(): UseApplicationsReturn {
  // Estados del hook
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Obtiene las aplicaciones del usuario desde la API
   */
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await applicationsService.getMyApplications()
      setApplications(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Error loading applications')
      setApplications([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  /**
   * Aplica a un proyecto específico
   * Actualiza optimistamente el estado local y luego revalida desde servidor
   */
  const applyToProject = useCallback(async (projectId: string): Promise<boolean> => {
    try {
      setIsProcessing(true)
      setError(null)
      
      const newApplication = await applicationsService.applyToProject(projectId)
      
      // Verifica si ya existe una aplicación para este proyecto y la actualiza, o añade una nueva
      setApplications(prev => {
        const existingIndex = prev.findIndex(app => app.projectId === projectId)
        if (existingIndex !== -1) {
          // Actualiza aplicación existente
          const updated = [...prev]
          updated[existingIndex] = newApplication
          return updated
        } else {
          // Añade nueva aplicación
          return [...prev, newApplication]
        }
      })
      
      // Actualiza aplicaciones desde servidor para obtener datos reales
      // Esto es importante ya que podríamos estar usando un objeto temporal
      setTimeout(() => {
        fetchApplications()
      }, 500) // Pequeño retraso para permitir que el backend procese
      
      return true
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Error applying to project')
      return false
    } finally {
      setIsProcessing(false)
    }
  }, [fetchApplications])

  /**
   * Retira una aplicación de un proyecto
   * Actualiza el estado local y luego revalida desde servidor
   */
  const withdrawApplication = useCallback(async (projectId: string): Promise<boolean> => {
    try {
      setIsProcessing(true)
      setError(null)
      
      await applicationsService.withdrawApplication(projectId)
      
      // Actualiza el estado de la aplicación existente a WITHDRAWN en lugar de eliminarla
      setApplications(prev => 
        prev.map(app => 
          app.projectId === projectId 
            ? { ...app, status: 'WITHDRAWN' as const, withdrawnAt: new Date().toISOString() }
            : app
        )
      )
      
      // Actualiza aplicaciones desde servidor para obtener el estado real
      setTimeout(() => {
        fetchApplications()
      }, 500) // Pequeño retraso para permitir que el backend procese
      
      return true
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Error withdrawing application')
      return false
    } finally {
      setIsProcessing(false)
    }
  }, [fetchApplications])

  /**
   * Verifica si el usuario ya ha aplicado a un proyecto específico
   */
  const isAppliedToProject = useCallback((projectId: string): boolean => {
    return applications.some(app => app.projectId === projectId && app.status === 'APPLIED')
  }, [applications])

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
    applyToProject,
    withdrawApplication,
    isAppliedToProject,
    isProcessing,
  }
}