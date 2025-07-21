import { useState, useEffect, useCallback } from 'react'
import { applicationsService } from '@/lib/api/applications'
import { Application, ApiError } from '@/types/api'

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

export function useApplications(): UseApplicationsReturn {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const applyToProject = useCallback(async (projectId: string): Promise<boolean> => {
    try {
      setIsProcessing(true)
      setError(null)
      
      const newApplication = await applicationsService.applyToProject(projectId)
      
      // Check if there's already an application for this project and update it, or add new one
      setApplications(prev => {
        const existingIndex = prev.findIndex(app => app.projectId === projectId)
        if (existingIndex !== -1) {
          // Update existing application
          const updated = [...prev]
          updated[existingIndex] = newApplication
          return updated
        } else {
          // Add new application
          return [...prev, newApplication]
        }
      })
      
      // Refresh applications from server to get the real application data
      // This is important since we might be using a temporary application object
      setTimeout(() => {
        fetchApplications()
      }, 500) // Small delay to allow backend to process
      
      return true
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Error applying to project')
      return false
    } finally {
      setIsProcessing(false)
    }
  }, [fetchApplications])

  const withdrawApplication = useCallback(async (projectId: string): Promise<boolean> => {
    try {
      setIsProcessing(true)
      setError(null)
      
      await applicationsService.withdrawApplication(projectId)
      
      // Update the existing application status to WITHDRAWN instead of removing it
      setApplications(prev => 
        prev.map(app => 
          app.projectId === projectId 
            ? { ...app, status: 'WITHDRAWN' as const, withdrawnAt: new Date().toISOString() }
            : app
        )
      )
      
      // Refresh applications from server to get the real application status
      setTimeout(() => {
        fetchApplications()
      }, 500) // Small delay to allow backend to process
      
      return true
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Error withdrawing application')
      return false
    } finally {
      setIsProcessing(false)
    }
  }, [fetchApplications])

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