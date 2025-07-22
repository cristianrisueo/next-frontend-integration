import { useState, useEffect, useCallback } from 'react'
import { projectsService } from '@/lib/api/projects'
import { Project, ProjectsResponse, ProjectFilters, ApiError } from '@/types/api'

/**
 * Interfaz del valor de retorno del hook useProjects
 */
interface UseProjectsReturn {
  projects: Project[]
  loading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  refetch: () => Promise<void>
  loadMore: () => Promise<void>
  hasMore: boolean
}

/**
 * Hook personalizado para gestionar el listado de proyectos
 * Maneja carga inicial, paginación, filtrado y actualizaciones
 * 
 * @param initialFilters - Filtros iniciales para aplicar
 * @returns Objeto con proyectos, estados de carga, paginación y funciones de control
 */
export function useProjects(initialFilters: ProjectFilters = {}) {
  // Estados del hook
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProjectFilters>({
    page: 1,
    limit: 10,
    status: 'PUBLISHED',
    ...initialFilters,
  })
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })

  /**
   * Función para obtener proyectos de la API
   * Maneja tanto carga inicial como carga de más elementos
   */
  const fetchProjects = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const currentFilters = isLoadMore ? { ...filters, page: filters.page! + 1 } : filters
      
      // Usa endpoint de búsqueda si se aplican filtros (más allá de status/page/limit básicos)
      const hasFilters = currentFilters.specialties || currentFilters.skills || 
                        currentFilters.industry || currentFilters.category || 
                        currentFilters.subcategory || currentFilters.q
      
      const response = hasFilters 
        ? await projectsService.searchProjects(currentFilters)
        : await projectsService.getProjects(currentFilters)

      if (isLoadMore) {
        setProjects(prev => [...prev, ...response.data])
        setFilters(prev => ({ ...prev, page: currentFilters.page }))
      } else {
        setProjects(response.data)
      }

      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      })
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Error loading projects')
      if (!isLoadMore) {
        setProjects([])
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [filters])

  /**
   * Actualiza los filtros aplicados a la búsqueda
   * Resetea a la primera página cuando cambian los filtros
   */
  const updateFilters = useCallback((newFilters: Partial<ProjectFilters>) => {
    // Si solo se proporcionan propiedades básicas, resetea filtros completamente
    const hasSearchFilters = newFilters.specialties || newFilters.skills || 
                             newFilters.industry || newFilters.category || 
                             newFilters.subcategory || newFilters.q;
    
    if (!hasSearchFilters) {
      setFilters({
        status: newFilters.status || 'PUBLISHED',
        page: 1,
        limit: newFilters.limit || 10,
        // Siempre preserva parámetros de ordenamiento incluso sin filtros de búsqueda
        sortBy: newFilters.sortBy,
        order: newFilters.order,
      })
    } else {
      setFilters(prev => ({
        ...prev,
        ...newFilters,
        page: 1, // Resetea a primera página cuando cambian los filtros
      }))
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const loadMore = useCallback(() => {
    if (!loadingMore && pagination.page < pagination.totalPages) {
      return fetchProjects(true)
    }
    return Promise.resolve()
  }, [fetchProjects, loadingMore, pagination.page, pagination.totalPages])

  const hasMore = pagination.page < pagination.totalPages

  return {
    projects,
    loading,
    error,
    pagination,
    refetch: () => fetchProjects(false),
    loadMore,
    hasMore,
    filters,
    updateFilters,
  }
}

/**
 * Hook para obtener un proyecto individual por ID
 * 
 * @param id - ID del proyecto a obtener
 * @returns Objeto con proyecto, estado de carga y error
 */
export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchProject = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await projectsService.getProject(id)
        setProject(data)
      } catch (err) {
        const apiError = err as ApiError
        setError(apiError.message || 'Error loading project')
        setProject(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  return { project, loading, error }
}