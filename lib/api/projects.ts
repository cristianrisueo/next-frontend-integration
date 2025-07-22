import { apiClient } from './client'
import { Project, ProjectsResponse, ProjectFilters } from '@/types/api'

// Caché para habilidades y especialidades para evitar múltiples llamadas a la API
let skillsCache: any[] = []
let specialtiesCache: any[] = []

/**
 * Obtiene habilidades con caché para optimizar rendimiento
 */
const getSkills = async () => {
  if (skillsCache.length === 0) {
    skillsCache = await apiClient.get<any[]>('/skills')
  }
  return skillsCache
}

/**
 * Obtiene especialidades con caché para optimizar rendimiento
 */
const getSpecialties = async () => {
  if (specialtiesCache.length === 0) {
    specialtiesCache = await apiClient.get<any[]>('/specialties')
  }
  return specialtiesCache
}

/**
 * Transforma datos de proyecto de la API al formato esperado por el frontend
 * Resuelve referencias de habilidades y especialidades usando caché
 */
const transformProject = async (apiProject: any): Promise<Project> => {
  const [skills, specialties] = await Promise.all([getSkills(), getSpecialties()])
  
  // Extrae todas las habilidades de las posiciones
  const allSkillIds = (apiProject.positions || []).flatMap((pos: any) => pos.skills || [])
  const uniqueSkillIds = [...new Set(allSkillIds)]
  const projectSkills = uniqueSkillIds.map(skillId => {
    const skill = skills.find(s => s.id === skillId)
    return skill || { id: skillId, name: `Skill ${skillId}` }
  })
  
  // Obtiene la especialidad principal (de la primera posición)
  const firstPosition = apiProject.positions?.[0]
  const specialtyId = firstPosition?.specialties?.[0]
  const specialty = specialties.find(s => s.id === specialtyId)
  
  return {
    id: apiProject.id,
    title: apiProject.title,
    description: apiProject.description,
    status: apiProject.status,
    price: apiProject.budget?.total ? `€${apiProject.budget.total}` : undefined,
    hours: apiProject.budget?.hourFrom && apiProject.budget?.hourTo 
      ? `${apiProject.budget.hourFrom}-${apiProject.budget.hourTo}€/h`
      : undefined,
    skills: projectSkills,
    specialty: specialty || undefined,
    company: apiProject.organization ? {
      id: apiProject.organization.id,
      name: apiProject.organization.name,
      logo: apiProject.organization.logo,
    } : undefined,
    createdAt: apiProject.createdAt,
    updatedAt: apiProject.updatedAt || apiProject.createdAt,
  }
}

/**
 * Servicio para operaciones relacionadas con proyectos
 * Maneja obtención, transformación y búsqueda de proyectos
 */
export const projectsService = {
  /**
   * Obtiene lista de proyectos con filtros opcionales
   */
  async getProjects(filters: ProjectFilters = {}): Promise<ProjectsResponse> {
    const params = {
      ...filters,
      page: filters.page || 1,
      limit: filters.limit || 10,
    }
    
    const response = await apiClient.get<any>('/projects', params)
    
    // Transforma proyectos al formato esperado
    const transformedProjects = await Promise.all(
      (response.projects || []).map(transformProject)
    )
    
    return {
      data: transformedProjects,
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 0,
    }
  },

  /**
   * Obtiene un proyecto específico por ID
   */
  async getProject(id: string): Promise<Project> {
    const apiProject = await apiClient.get<any>(`/projects/${id}`)
    return transformProject(apiProject)
  },

  /**
   * Busca proyectos con filtros avanzados
   */
  async searchProjects(filters: ProjectFilters = {}): Promise<ProjectsResponse> {
    const params = {
      ...filters,
      page: filters.page || 1,
      limit: filters.limit || 10,
    }
    
    const response = await apiClient.get<any>('/projects/search', params)
    
    // Transforma proyectos al formato esperado
    const transformedProjects = await Promise.all(
      (response.projects || []).map(transformProject)
    )
    
    return {
      data: transformedProjects,
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 0,
    }
  },

}